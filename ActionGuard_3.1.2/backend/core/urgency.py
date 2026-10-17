"""US/JP action-based reading aid. Deterministic, independent of AI and not an alert issuer.

A four-step *app* scale, not a conversion into Korean official warning levels.
Only supported event headings and affirmative present instructions are classified.
Conditional, negated, unknown, stale and non-US input is handled explicitly.
See docs/URGENCY_SCALE.md for the mapping and NWS references.
"""
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from dataclasses import replace

from backend.models.contracts import Alert, UrgencyAssessment, UrgencyEvidence, UrgencySource

BASE = 'https://www.weather.gov/'
GENERAL = ('NWS · Watch / Warning / Advisory', BASE + 'sjt/WatchWarningAdvisoryExplained')
TORNADO = ('NWS · 토네이도 경보', BASE + 'safety/tornado-ww')
FLOOD = ('NWS · 홍수 경보', BASE + 'safety/flood-watch-warning')
HURRICANE = ('NWS · 허리케인 경보', BASE + 'safety/hurricane-ww')
TSUNAMI = ('NWS · 쓰나미 경보', BASE + 'safety/tsunami-alerts')
WINTER = ('NWS · 겨울철 경보', BASE + 'safety/winter-ww')
WIND = ('NWS · 강풍 경보·주의보', BASE + 'safety/wind-ww')
JMA = ('JMA · 기상 경보·주의보', 'https://www.jma.go.jp/jma/kishou/know/bosai/warning.html')
JMA_TSUNAMI = ('JMA · 쓰나미 경보·주의보', 'https://www.data.jma.go.jp/eqev/data/en/tsunami/tsunami_warning.html')


@dataclass(frozen=True)
class Reading:
    level: int
    kind: str
    headline: str
    meaning: str
    actions: tuple[str, ...]
    source: tuple[str, str] = GENERAL


INFO = Reading(1, 'monitor', '새 안내를 확인하세요',
    '상황을 알리는 정보 단계예요. 이 표시만으로 현재 장소가 안전하다고 판단할 수는 없어요.',
    ('적용 지역과 발표 시각을 확인하세요.', '새 경보와 현지 당국의 후속 안내를 확인하세요.'))
CAUTION = Reading(2, 'caution', '활동을 조정하고 주의하세요',
    '이동이나 야외활동에 영향을 줄 수 있어요. 원문의 주의사항을 지금 확인할 단계예요.',
    ('여행·야외활동 계획을 조정하세요.', '원문의 대상·시간·금지 행동을 확인하세요.'))
PREPARE = Reading(3, 'prepare', '지금 준비를 시작하세요',
    '위험이 발생할 가능성이 있어요. 경보가 강화되면 바로 행동할 수 있도록 준비할 단계예요.',
    ('안전한 실내 장소와 이동 방법을 미리 확인하세요.', '휴대전화를 충전하고 필요한 물품을 챙기며 후속 경보를 확인하세요.'))
PROTECT = Reading(3, 'protect', '지금 보호행동을 시작하세요',
    '위험이 예상되거나 진행 중이라는 뜻이에요. 단순히 기다릴 단계가 아니며, 구체적인 행동은 원문 지시를 따라야 해요.',
    ('원문의 보호행동·이동 제한을 지금 실행하세요.', '현재 위치에 적용되는 당국 지시와 최신 경보를 확인하세요.'))
SHELTER = Reading(4, 'shelter', '지금 하던 일을 멈추고 실내 대피하세요',
    '즉시 몸을 보호할 행동이 필요한 단계예요. 대피 방식은 재난과 원문 지시에 따라 달라요.',
    ('튼튼한 건물 안의 안전한 장소로 즉시 이동하세요.', '실내 대피 지시와 창문에서 떨어지라는 안내를 따르세요.'))
TORNADO_SHELTER = Reading(4, 'shelter', '지금 멈추고 낮은 층의 실내로 대피하세요',
    '토네이도가 관측됐거나 레이더로 확인되어 즉시 몸을 보호해야 한다는 뜻이에요.',
    ('튼튼한 건물의 지하 또는 가장 낮은 층, 창문 없는 안쪽 방으로 즉시 이동하세요.', '창문에서 떨어져 머리와 목을 보호하세요.'), TORNADO)
FLOOD_ESCAPE = Reading(4, 'higher_ground', '침수 위험 지역이라면 지금 높은 곳으로 이동하세요',
    '돌발홍수가 임박했거나 진행 중이라는 뜻이에요. 저지대·하천 주변 등 침수 위험 지역에서는 즉시 행동해야 해요.',
    ('침수 위험 지역에 있다면 즉시 높은 곳으로 이동하세요.', '물에 잠긴 도로와 흐르는 물을 걷거나 차로 건너지 마세요.'), FLOOD)
EVACUATE = Reading(4, 'evacuate', '대상 지역이라면 지시된 대피를 시작하세요',
    '지역을 떠나라는 직접적인 대피 지시가 있어요. 대상 구역·출발 시각·경로는 원문과 현지 당국 안내를 따라야 해요.',
    ('원문에 지정된 대피 대상 구역에 해당하는지 확인하고 지시를 실행하세요.', '당국이 안내하는 시각·목적지·경로를 따르세요.'))
HIGH_GROUND = Reading(4, 'higher_ground', '대상 지역이라면 지금 높은 곳으로 이동하세요',
    '높은 곳으로 이동하라는 직접적인 보호행동 지시가 있어요.',
    ('원문의 대상 지역·조건에 해당한다면 높은 곳으로 이동하세요.', '침수된 길을 건너지 말고 당국의 이동 지시를 따르세요.'), FLOOD)
TSUNAMI_ESCAPE = Reading(4, 'higher_ground', '해안 대상 지역이라면 높은 곳·내륙으로 대피하세요',
    '광범위한 해안 침수를 일으킬 쓰나미가 예상되거나 발생 중이라는 뜻이에요.',
    ('해안 대상 지역에 있다면 높은 곳이나 물에서 먼 내륙으로 이동하세요.', '현지 당국의 대피 지시를 따르고 해안으로 돌아가지 마세요.'), TSUNAMI)

# Closed vocabulary: unsupported warning names never become an automatic evacuation.
EXTRA = ('Tornado Emergency', 'Flash Flood Emergency', 'Evacuation Immediate',
    'Shelter In Place Warning', 'Civil Emergency Message', 'Civil Danger Warning',
    'Special Weather Statement', 'Hazardous Weather Outlook', 'Tsunami Information Statement')
EVENT_SUFFIXES = {
    'Tornado': ('Watch', 'Warning'), 'Severe Thunderstorm': ('Watch', 'Warning'),
    'Flash Flood': ('Watch', 'Warning'), 'Flood': ('Watch', 'Warning', 'Advisory'),
    'Areal Flood': ('Watch', 'Warning', 'Advisory'), 'Coastal Flood': ('Watch', 'Warning', 'Advisory'),
    'Lakeshore Flood': ('Watch', 'Warning', 'Advisory'), 'Hurricane': ('Watch', 'Warning'), 'Typhoon': ('Watch', 'Warning'), 'Super Typhoon': ('Watch', 'Warning'),
    'Tropical Storm': ('Watch', 'Warning'), 'Storm Surge': ('Watch', 'Warning'),
    'Extreme Wind': ('Warning',), 'High Wind': ('Watch', 'Warning'),
    'Wind': ('Advisory',), 'Lake Wind': ('Advisory',),
    'Excessive Heat': ('Watch', 'Warning'), 'Extreme Heat': ('Watch', 'Warning'), 'Heat': ('Advisory',),
    'Extreme Cold': ('Watch', 'Warning'), 'Wind Chill': ('Watch', 'Warning', 'Advisory'),
    'Freeze': ('Watch', 'Warning'), 'Hard Freeze': ('Watch', 'Warning'), 'Frost': ('Advisory',),
    'Winter Storm': ('Watch', 'Warning'), 'Winter Weather': ('Advisory',),
    'Blizzard': ('Warning',), 'Ice Storm': ('Warning',), 'Snow Squall': ('Warning',),
    'Lake Effect Snow': ('Watch', 'Warning', 'Advisory'), 'Dense Fog': ('Advisory',),
    'Dust Storm': ('Warning',), 'Blowing Dust': ('Advisory',), 'High Surf': ('Warning', 'Advisory'),
    'Small Craft': ('Advisory',), 'Gale': ('Watch', 'Warning'), 'Storm': ('Watch', 'Warning'),
    'Hazardous Seas': ('Watch', 'Warning'), 'Tsunami': ('Watch', 'Warning', 'Advisory'),
    'Fire Weather': ('Watch',), 'Red Flag': ('Warning',), 'Air Quality': ('Alert',),
    'Rip Current': ('Statement',),
}
NAMES = tuple(sorted({f'{hazard} {suffix}' for hazard, suffixes in EVENT_SUFFIXES.items() for suffix in suffixes} | set(EXTRA), key=len, reverse=True))
EVENT_RE = re.compile(r'\b(?:' + '|'.join(map(re.escape, NAMES)) + r')\b', re.I)
# SAME codes only in a labeled/standalone header, not inside arbitrary words.
CODES = {'TOR': 'Tornado Warning', 'TOA': 'Tornado Watch', 'SVR': 'Severe Thunderstorm Warning',
    'SVA': 'Severe Thunderstorm Watch', 'FFW': 'Flash Flood Warning', 'FFA': 'Flood Watch',
    'FLW': 'Flood Warning', 'HUW': 'Hurricane Warning', 'HUA': 'Hurricane Watch',
    'TRW': 'Tropical Storm Warning', 'TRA': 'Tropical Storm Watch', 'EWW': 'Extreme Wind Warning',
    'TSW': 'Tsunami Warning', 'TSA': 'Tsunami Watch', 'EVI': 'Evacuation Immediate',
    'SPW': 'Shelter In Place Warning'}
CONDITIONAL = re.compile(r'\b(?:if|unless|would|could|may|might|when issued|in case|be ready|prepare to|prepared to|how to)\b', re.I)
NEGATED = re.compile(r"\b(?:not|no|never|don['’]?t|do not|isn['’]?t|hasn['’]?t|won['’]?t|without|cancelled|canceled|lifted|expired|rescinded)\b", re.I)
TEST = re.compile(r'\b(?:this is (?:only )?a (?:test|drill)|test message|test only|exercise only|drill only|not an actual emergency)\b', re.I)
CANCEL_AFTER = re.compile(r'^\s*(?:(?:has been|is|was|has|is now)\s+)?(?:cancelled|canceled|lifted|expired|ended|rescinded|no longer in effect)\b', re.I)


def clauses(text):
    return [c.strip(' *\t') for c in re.split(r'[\n.!?;]+|\bbut\b|\bhowever\b', text) if c.strip(' *\t')]


def headings(text):
    """Return event, verbatim evidence, inactive flag. Avoid conditional mentions."""
    rows = []
    for clause in clauses(text):
        for match in EVENT_RE.finditer(clause):
            prefix = clause[:match.start()].strip()
            # Restrict to heading-like contexts; discussions/comparisons are not issuances.
            heading = (not prefix or re.fullmatch(r'(?:Event|Alert|Headline|Subject|Warning|NWS)\s*[:–—-]', prefix, re.I)
                       or re.fullmatch(r'(?:A|The)\s*', prefix, re.I)
                       or re.fullmatch(r'(?:NWS|National Weather Service)(?: in [\w ]+)? (?:has )?issued (?:a|an)', prefix, re.I)
                       or re.fullmatch(r'(?:Cancelled|Canceled|Expired|Lifted)\s*:', prefix, re.I))
            if not heading or CONDITIONAL.search(prefix):
                continue
            tail = clause[match.end():]
            if re.match(r"\s+(?:is |has )?not\b|\s+(?:isn['’]?t|hasn['’]?t)\b", tail, re.I):
                continue
            if re.match(r'\s+(?:means|versus|vs\b|may|might|could|would|possible|is (?:defined|issued when))', tail, re.I):
                continue
            canonical = next(n for n in NAMES if n.lower() == match.group().lower())
            inactive = bool(CANCEL_AFTER.match(tail) or re.match(r'^(?:cancelled|canceled|expired|lifted)\s*:', prefix, re.I))
            rows.append((canonical, clause, inactive))
        code = re.fullmatch(r'(?:(?:SAME|Event code|Event)\s*:\s*)?([A-Z]{3})', clause)
        if code and code[1] in CODES:
            rows.append((CODES[code[1]], clause, False))
    return rows


def reading_for(event):
    if event in ('Wind Advisory', 'Lake Wind Advisory'):
        return Reading(2, 'caution', '강풍에 대비해 이동과 야외활동을 조정하세요',
            '바람에 물건이 날리거나 운전에 영향을 줄 수 있어요.',
            ('안전하게 할 수 있을 때 날아갈 물건을 고정하고 운전과 야외활동에 주의하세요.', '큰 나무·간판·전선에서 떨어지고 원문의 차량 운행 주의사항을 확인하세요.'), WIND)
    if event == 'High Wind Warning':
        return Reading(4, 'shelter', '강풍을 피해 튼튼한 건물 안으로 이동하세요',
            '강한 바람이 발생하거나 예상되어 즉시 몸을 보호할 행동이 필요해요.',
            ('튼튼한 건물 안에서 창문을 피해 머무르세요.', '운전 중이면 속도를 줄이고 원문의 운행 지시를 따르세요.'), WIND)
    if event in ('Evacuation Immediate',):
        return EVACUATE
    if event in ('Tornado Warning', 'Tornado Emergency'):
        return TORNADO_SHELTER
    if event in ('Flash Flood Warning', 'Flash Flood Emergency'):
        return FLOOD_ESCAPE
    if event == 'Tsunami Warning':
        return TSUNAMI_ESCAPE
    if event == 'Shelter In Place Warning':
        return Reading(4, 'shelter', '지금 실내에 머물며 원문의 차단 지시를 따르세요',
            '외부로 나가는 대신 실내에서 몸을 보호하라는 지시예요. 안전실·환기 차단 등 세부 조치는 원문을 확인하세요.',
            ('실내에 머물며 원문의 장소·출입·환기 관련 지시를 따르세요.', '당국의 후속 지시를 확인하세요.'))
    if event in ('Severe Thunderstorm Warning', 'Extreme Wind Warning'):
        return Reading(4, 'shelter', SHELTER.headline,
            '강한 바람·낙뢰 등으로 즉시 실내 보호가 필요한 경보예요.', SHELTER.actions, HURRICANE if event.startswith('Extreme Wind') else TORNADO)
    if event == 'Tsunami Advisory':
        return Reading(3, 'protect', '지금 물가·해변·항구에서 벗어나세요',
            '주의보라는 이름이어도 물속이나 해변·항구에서는 위험한 파도와 해류가 예상돼요.',
            ('물에 들어가지 말고 해변·항구·수로 주변에서 벗어나세요.', '현지 당국 지시와 추가 경보를 확인하세요.'), TSUNAMI)
    if event in ('Hurricane Warning', 'Typhoon Warning', 'Super Typhoon Warning', 'Tropical Storm Warning', 'Storm Surge Warning'):
        return Reading(3, 'protect', '지금 대비를 마치고 당국의 대피 명령을 확인하세요',
            '위험이 예상되는 경보예요. 준비를 끝내고 현지 당국이 대피를 명령했다면 즉시 따라야 해요.',
            ('현지 당국의 대피 대상 구역·명령을 지금 확인하세요.', '바람과 침수에 대비한 준비를 마치고 원문 지시를 따르세요.'), HURRICANE)
    if event in ('Excessive Heat Warning', 'Extreme Heat Warning'):
        return replace(PROTECT, headline='지금 더위를 피하고 활동을 줄이세요',
            meaning='심각한 고온 위험이 예상돼요. 외출·운동 계획을 조정하고 지금 몸을 보호해야 해요.',
            actions=('냉방되는 실내 등 시원한 장소에서 머무르고 야외활동을 줄이세요.', '물을 챙기고 현지 폭염 지침을 확인하세요.'))
    if event.endswith('Watch'):
        return PREPARE
    if event.endswith('Advisory'):
        return CAUTION
    if event.endswith('Warning') or event in ('Civil Emergency Message', 'Civil Danger Warning'):
        return PROTECT
    return INFO


def japanese_reading(event):
    if event in ('大津波警報', '津波警報'):
        return replace(TSUNAMI_ESCAPE, source=JMA_TSUNAMI)
    if event == '津波注意報':
        return replace(reading_for('Tsunami Advisory'), source=JMA_TSUNAMI)
    if event == '避難指示':
        return replace(EVACUATE, source=JMA)
    if event == '緊急地震速報':
        return Reading(4, 'shelter', '강한 흔들림에 대비해 지금 몸을 보호하세요',
            '흔들림이 오기 전 즉시 몸을 보호할 행동이 필요해요.',
            ('머리를 보호하고 튼튼한 탁자 아래 등 안전한 곳에서 몸을 지키세요.', '큰 가구와 유리에서 떨어지고 당황해서 밖으로 뛰어나가지 마세요.'), JMA)
    if event == '高齢者等避難':
        return Reading(3, 'prepare', '대피에 시간이 필요한 분은 당국의 대상·지시를 확인하세요',
            '고령자 등 대피에 시간이 필요한 대상의 조기 대피와 다른 주민의 준비를 위한 안내예요.',
            ('대피에 시간이 필요한 대상에 해당하면 지자체의 대피 안내를 확인하고 따르세요.', '다른 주민도 대피할 수 있도록 준비하고 후속 지시를 확인하세요.'), JMA)
    if event == '緊急安全確保' or '特別警報' in event or '危険警報' in event:
        return Reading(4, 'protect', '지금 가능한 안전 확보 행동을 취하세요',
            '매우 위험한 상황을 알리는 안내예요. 밖으로 이동하는 것 자체가 위험할 수 있어요.',
            ('현재 장소와 재난 상황에 맞는 지자체의 안전 확보 지시를 즉시 확인하고 따르세요.', '이동이 이미 위험하다면 무리해서 밖으로 나가지 말고 가능한 안전한 장소에서 몸을 보호하세요.'), JMA)
    if event in ('暴風警報', '暴風雪警報'):
        return Reading(3, 'protect', '강풍을 피해 실내에서 몸을 보호하세요',
            '강한 바람으로 중대한 피해가 발생할 우려가 있다는 안내예요.',
            ('야외활동과 불필요한 이동을 줄이고 튼튼한 실내에서 창문을 피해 머무르세요.', '나무·간판·전선과 떨어지고 현지 교통·기상 안내를 확인하세요.'), JMA)
    if event in ('波浪警報', '高潮警報'):
        return Reading(3, 'protect', '해안·항구와 낮은 해안 지역의 위험을 확인하세요',
            '높은 파도나 해수면 상승으로 피해가 발생할 우려가 있어요.',
            ('해안·항구에 접근하지 말고 해당 지역 지자체의 이동·대피 지시를 확인하세요.', '원문의 대상 지역과 유효 시각을 확인하세요.'), JMA)
    if event.endswith('警報') or event == '土砂災害警戒情報':
        return replace(PROTECT, headline='재난 위험에 대비해 지금 보호행동을 확인하세요', source=JMA)
    if event.endswith('注意報'):
        return replace(CAUTION, source=JMA)
    return replace(INFO, source=JMA)


JP_NAMES = tuple(sorted({
    '大津波警報', '津波警報', '津波注意報', '避難指示', '高齢者等避難', '緊急安全確保',
    '土砂災害警戒情報', '緊急地震速報', '地震情報', '津波予報', '気象情報',
    *(hazard + suffix for hazard in ('大雨', '氾濫', '洪水', '暴風', '暴風雪', '大雪', '波浪', '高潮', '土砂災害') for suffix in ('注意報', '警報', '危険警報', '特別警報')),
    '強風注意報', '雷注意報', '濃霧注意報', '乾燥注意報', '低温注意報', '着雪注意報', '着氷注意報', '霜注意報', '融雪注意報', 'なだれ注意報', '風雪注意報',
}, key=len, reverse=True))
JP_EVENT_RE = re.compile('|'.join(map(re.escape, JP_NAMES)))


def japanese_events(text):
    rows = []
    for clause in re.split(r'[。.!?;\n]|ただし|しかし', text):
        for match in JP_EVENT_RE.finditer(clause):
            prefix, tail = clause[:match.start()], clause[match.end():]
            if re.search(r'場合|もし|仮に|例として|発表されたら', prefix) or re.search(r'場合|発表されたら|発表される可能性|とは|の意味|は発表されていません|は発令されていません|は出ていません|は出されていません|はありません|ではありません', tail):
                continue
            inactive = bool(re.search(r'解除|取り消|取消|終了', tail) and not re.search(r'解除されていません|解除していません', tail))
            rows.append((match.group(), clause.strip(), inactive))
    return rows


def parse_time(value):
    if not value:
        return None
    try:
        date = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return date if date.tzinfo else None
    except (ValueError, TypeError):
        return None


def assess_urgency(text: str, official: Alert | None = None, country: str = 'unknown', *, now=None):
    now = now or datetime.now(timezone.utc)
    example = text.startswith('DEMO ONLY — FICTIONAL ALERT. NOT ACTIVE.') and official is None
    provenance = 'official' if official else 'example' if example else 'input'
    applicability = (f'경보 대상 지역: {official.area}' if official and official.id.startswith('jma:') else
        f'경보 대상 지역: {official.area}' if official else '원문에 지정된 지역·대상에 해당한다면')
    is_japanese = country == 'JP' or bool(official and official.id.startswith('jma:')) or (country == 'unknown' and bool(JP_EVENT_RE.search(text)))
    agency = 'JMA' if is_japanese else 'NWS'
    notice = (f'{agency}에 연결된 원문의 의미 해석입니다. 현재 위치가 경보 대상인지는 별도로 확인하세요.' if official else
        '가상 예시의 의미 해석입니다. 실제 발령 경보나 현재 대피 지시가 아닙니다.' if example else
        '입력문의 표현을 해석한 결과입니다. 실제 발령·현재 유효성·내 위치 적용 여부는 확인되지 않았습니다.')

    def result(reading=None, *, evidence=(), explanation='', inactive=False, headline='', meaning=''):
        return UrgencyAssessment(
            level=reading.level if reading else None,
            label={1: '정보', 2: '주의', 3: '대비', 4: '대피'}.get(reading.level if reading else None, '확인 필요'),
            action_kind=reading.kind if reading else 'unknown',
            headline=headline or (reading.headline if reading else '대응 단계를 정할 근거가 부족해요'),
            meaning=meaning or (reading.meaning if reading else '원문과 현지 당국의 행동 지시를 확인하세요. 정보를 찾지 못했다고 안전한 것은 아니에요.'),
            actions=list(reading.actions) if reading else ['발표 기관의 원문에서 대상 지역·발표 시각·지시를 확인하세요.', '위험을 느끼거나 즉시 행동하라는 지시를 받았다면 현지 당국 지시를 따르세요.'],
            evidence=[UrgencyEvidence(quote=q, explanation=explanation) for q in dict.fromkeys(evidence)],
            sources=[UrgencySource(title=t, url=u) for t, u in dict.fromkeys(((JMA if is_japanese else GENERAL), reading.source))] if reading else [],
            provenance=provenance, applicability=applicability, notice=notice, inactive=inactive)

    if official:
        if (official.message_type or '').lower() in ('cancel', 'error') or (official.status or '').lower() in ('test', 'exercise', 'draft', 'system'):
            return result(INFO, evidence=[official.headline], explanation='공식 메시지의 취소·시험 상태를 우선했습니다.', inactive=True,
                headline='취소·시험 메시지예요. 최신 경보를 확인하세요', meaning='현재 행동 지시로 해석하지 않았어요. 이 표시가 모든 위험의 해제를 뜻하지는 않아요.')
        expired = parse_time(official.expires)
        ended = parse_time(official.ends)
        if (expired and expired <= now) or (ended and ended <= now):
            return result(INFO, evidence=[f'{"Message expires" if expired and expired <= now else "Ends"}: {official.expires if expired and expired <= now else official.ends}'],
                explanation='공식 메시지에 표시된 시각이 지났습니다.', inactive=True,
                headline='이 메시지의 유효 시각이 지났어요', meaning='과거 메시지로 현재 대피 여부를 판단하지 마세요. 위험이 끝났다는 뜻은 아니므로 최신 경보를 다시 조회하세요.')
    elif not example and (TEST.search(text) or re.search(r'訓練|テスト配信|試験配信', re.sub(r'訓練ではありません', '', text))):
        return result(INFO, evidence=[c for c in clauses(text) if TEST.search(c) or re.search(r'訓練|テスト配信|試験配信', c)][:1], explanation='시험·훈련 문구를 우선했습니다.', inactive=True,
            headline='시험·훈련 메시지예요', meaning='이 메시지를 실제 발령으로 해석하지 않았어요. 실제 상황은 최신 공식 안내를 확인하세요.')

    if not official and not example:
        for match in re.finditer(r'^(?:Message expires|Expires|Ends):\s*(\S+)', text, re.M | re.I):
            end = parse_time(match[1])
            if end and end <= now:
                return result(INFO, evidence=[match[0]], explanation='입력문에 명시된 시간대 포함 유효 시각이 지났습니다.', inactive=True,
                    headline='입력문에 적힌 유효 시각이 지났어요', meaning='과거 메시지로 현재 행동을 결정하지 마세요. 위험이 끝났다는 뜻은 아니므로 최신 공식 안내를 확인하세요.')

    if is_japanese and re.search(r'^(?:状況|状態|Status)\s*[:：]\s*(?:解除|取消)', text, re.M):
        return result(INFO, evidence=[text.splitlines()[0]], inactive=True, headline='해제·취소된 메시지로 적혀 있어요', meaning='현재 행동 지시로 강조하지 않았어요. 위험 해제 여부는 최신 공식 정보를 확인하세요.')
    events = japanese_events(official.event if official else text) if is_japanese else ([(official.event, official.event, False)] if official else headings(text))
    if events and all(inactive for _, _, inactive in events):
        return result(INFO, evidence=[q for _, q, _ in events], explanation='경보 명칭에 연결된 취소·종료 표현을 확인했습니다.', inactive=True,
            headline='취소·종료된 경보로 적혀 있어요', meaning='이 입력문은 현재 대피 지시로 해석하지 않았어요. 현재 위험의 종료 여부는 최신 공식 경보로 확인하세요.')
    candidates = [((japanese_reading(event) if is_japanese else reading_for(event)), quote, f'{event}의 재난별 행동 의미를 적용했습니다.')
                  for event, quote, inactive in events if not inactive and event in (JP_NAMES if is_japanese else NAMES)]

    # Direct instructions outrank a general event title. A conditional evacuation
    # ('evacuate if ordered') or negation never becomes a present evacuation order.
    instructions = official.instruction if official else text
    for raw_clause in re.split(r'[.!?;]|\n\s*\n', instructions or ''):
        clause=' '.join(raw_clause.split())
        if CONDITIONAL.search(clause) or NEGATED.search(clause) or re.search(r'\b(?:said|says|reported|yesterday|previously|earlier|last night|example|means|meaning|quote)\b|[\"“”]', raw_clause.strip(), re.I):
            continue
        if re.search(r'\b(?:evacuate\s+(?:now|immediately|at once)|must evacuate|are ordered to evacuate|mandatory evacuation (?:order )?(?:is |has been )?(?:in effect|issued|ordered)|leave (?:the )?(?:area|zone|building|your home) (?:now|immediately))\b', raw_clause.strip(), re.I):
            candidates.append((EVACUATE, raw_clause.strip(), '조건문·부정문이 아닌 직접적인 대피 지시를 확인했습니다.'))
        elif re.search(r'\b(?:move|get|go) (?:immediately )?to (?:higher|high) ground\b', raw_clause.strip(), re.I):
            candidates.append((HIGH_GROUND, raw_clause.strip(), '높은 곳으로 이동하라는 직접 지시를 확인했습니다.'))
        elif re.search(r'\b(?:(?:take|seek) shelter (?:now|immediately)|shelter in place (?:now|immediately))\b', raw_clause.strip(), re.I):
            candidates.append((reading_for('Shelter In Place Warning') if re.search(r'shelter in place', raw_clause.strip(), re.I) else SHELTER, raw_clause.strip(), '즉시 실내 대피하라는 직접 지시를 확인했습니다.'))

    if candidates:
        # Preserve hazard-specific guidance on ties, but an explicit evacuation
        # instruction takes precedence over the event's default protection mode.
        selected = max(candidates, key=lambda c: (c[0].level, c[0].kind == 'evacuate'))
        reading, quote, explanation = selected
        return result(reading, evidence=[quote], explanation=explanation)
    return result()
