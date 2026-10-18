import re
from backend.core.times import ISO_TIMESTAMP, readable_times, equivalent_timestamp_present
from backend.models.contracts import Issue, Verification, Fact
from backend.core.quotes import (
    supported_quote,
    extract_english_clock_times,
    extract_korean_clock_times,
)

KINDS = [
    "hazard",
    "area",
    "issued_time",
    "message_expiration",
    "start_time",
    "end_time",
    "level",
    "audience",
    "required_action",
    "recommended_action",
    "prohibition",
    "number_unit",
    "negation",
    "condition",
]


def assess(source, target, sf, tf, judgment, official=None, displayed=None):
    targets = {"translation": target, **(displayed or {})}
    unresolved = list(judgment.unresolved)
    issues = []

    def valid(facts, text):
        good = []
        for f in facts.facts:
            if supported_quote(f.quote, text):
                good.append(f)
            else:
                unresolved.append(
                    f"{f.kind}: 실제 입력에 없는 추출 근거를 제외했습니다."
                )
        return good

    s = valid(sf, source)
    t = valid(tf, target)
    if official:
        authoritative = {
            "hazard": official.event,
            "area": official.area,
            "issued_time": official.sent,
            "message_expiration": official.expires,
            "start_time": official.onset,
            "end_time": official.ends,
        }
        level = re.search(r"\b(Watch|Warning|Advisory)\b", official.event)
        if level:
            authoritative["level"] = level[0]
        for kind, value in authoritative.items():
            if value and supported_quote(value, source):
                s = [f for f in s if f.kind != kind]
                s.append(Fact(kind=kind, value=value, quote=value))
    if not sf.facts or not tf.facts or not s or not t:
        unresolved.append("핵심정보 추출이 비어 있어 충분히 검증할 수 없습니다.")
    for i in judgment.issues:
        if (
            i.field in targets
            and (i.source_quote or i.translation_quote)
            and (i.source_quote is None or supported_quote(i.source_quote, source))
            and (
                i.translation_quote is None
                or supported_quote(i.translation_quote, targets[i.field])
            )
        ):
            issues.append(i.model_copy(update={"method": "ai"}))
        else:
            unresolved.append(
                "AI 판정의 인용 근거가 실제 입력과 일치하지 않아 제외했습니다."
            )

    def add(kind, reason, sq, tq=None, severity="critical"):
        issues.append(
            Issue(
                kind=kind,
                severity=severity,
                source_quote=sq,
                translation_quote=tq,
                reason=reason,
                method="rule",
            )
        )

    # Only a clearly anchored end time can support a deterministic mismatch.
    # Multiple timestamps, dates or explicit zones need contextual AI review.
    end_en = re.search(r"\buntil\s+(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*[AP]M\b", source, re.I)
    end_ko = re.search(r"(?:오전|오후)\s*(?:1[0-2]|0?[1-9])(?::[0-5][0-9]|\s*시(?:\s*[0-5]?[0-9]\s*분)?)?\s*까지", target)
    complex_context = re.search(r"\b(?:UTC|GMT|[A-Z]{2,4}T)\b|\d{1,2}월|\d{4}-\d{2}-\d{2}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b", source + " " + target)
    if end_en and end_ko and not complex_context and len(extract_english_clock_times(source)) == 1 and len(extract_korean_clock_times(target)) == 1:
        if extract_english_clock_times(end_en[0]) != extract_korean_clock_times(end_ko[0]):
            add("end_time", "종료 시각이 원문과 다르게 번역됐습니다.", end_en[0], end_ko[0])
    for date in set(ISO_TIMESTAMP.findall(source)):
        if date not in target and not equivalent_timestamp_present(date, target):
            unresolved.append(
                f"날짜/시간대 원형이 유지되지 않음: {date}. 동등한 표기인지는 추가 확인 필요."
            )
    # Date-only inputs also need preservation, accepting an equivalent Korean date.
    for date in set(re.findall(r"\b\d{4}-\d{2}-\d{2}\b(?!T)", source)):
        year, month, day = map(int, date.split("-"))
        korean = rf"{year}년\s*0?{month}월\s*0?{day}일"
        if date not in target and not re.search(korean, target):
            unresolved.append("날짜 의미가 유지되는지 추가 확인이 필요합니다: " + date)
    units = {
        "mph": r"(?:mph|마일\s*/\s*시|마일)",
        "inches": r"(?:inches|inch|인치)",
        "feet": r"(?:feet|ft|피트)",
        "miles": r"(?:miles|mile|마일)",
        "percent": r"(?:percent|%|퍼센트)",
    }
    for m in re.finditer(
        r"\b(\d+(?:\.\d+)?)\s*(mph|inches|feet|miles|percent)\b", source, re.I
    ):
        if not re.search(re.escape(m[1]) + r"\s*" + units[m[2].lower()], target, re.I):
            add(
                "number_unit",
                "숫자·단위 보존을 확인할 수 없습니다. 단위 변환 여부를 점검하십시오.",
                m[0],
                severity="minor",
            )
    for token in re.findall(r"\b(?:Watch|Warning|Advisory)\b", source):
        if token not in target:
            add(
                "level",
                "공식 경보 용어가 번역문에 유지되지 않았습니다.",
                token,
                severity="minor",
            )
    for f in s:
        if f.kind in [
            "required_action",
            "recommended_action",
            "prohibition",
            "condition",
            "audience",
        ] and not any(x.kind == f.kind for x in t):
            unresolved.append(
                f"{f.kind}: 번역문에 대응 정보가 추출되지 않았습니다. 누락 여부 확인 필요."
            )
    # Narrow phrase-level inversion rule; no broad sentence-level negation guessing.
    prohibition = re.search(r"do not drive through flooded roads", source, re.I)
    inversion = re.search(r"침수[^.\n]{0,30}운전해도\s*(?:됩니다|된다)", target)
    if prohibition and inversion:
        add(
            "prohibition",
            "침수 도로 운전 금지가 허용 표현으로 바뀌었습니다.",
            prohibition[0],
            inversion[0],
        )
    fields = {}
    if official:
        fields = {
            k: str(getattr(official, k) or "확인되지 않음")
            for k in [
                "event",
                "area",
                "severity",
                "effective",
                "expires",
                "onset",
                "ends",
                "sender",
            ]
        }
        for place in [v.strip() for v in official.area.split(";") if v.strip()]:
            if place.casefold() not in target.casefold():
                add(
                    "area",
                    "공식 지역명이 번역문에 원어로 보존되지 않았습니다. 의미 일치 여부 확인 필요.",
                    place,
                    severity="minor",
                )
    missing = [k for k in KINDS if not any(f.kind == k for f in s)]
    checks = [
        "독립 원문/번역 추출",
        "실제 인용 근거 검사",
        "시각·날짜·숫자/단위·경보명 규칙",
        "AI 행동·부정·조건 의미 비교",
    ]
    checks += [
        "원문에 추출되지 않은 항목(존재하지 않을 수 있음): " + ", ".join(missing)
    ]
    status = (
        "불일치 탐지"
        if any(i.severity == "critical" for i in issues)
        else "검증 불가"
        if unresolved
        else "오류 의심"
        if issues
        else "불일치 미탐지"
    )
    return Verification(
        checked_fields=list(targets),
        status=status,
        issues=issues,
        unresolved=list(dict.fromkeys(unresolved)),
        source_facts=s,
        translated_facts=t,
        official_fields=fields,
        checks=checks,
    )
