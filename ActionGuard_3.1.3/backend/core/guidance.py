import json
import re
from backend.core.hazard_state import classify_hazard
from pathlib import Path
from backend.models.contracts import Guidance, Card

GUIDES = json.loads(
    (
        Path(__file__).resolve().parents[2] / "data/official_guides/guides.json"
    ).read_text()
)

JAPAN_GUIDES = json.loads((Path(__file__).resolve().parents[2] / "data/official_guides/japan.json").read_text())


def guidance(text, official=None, country="unknown"):
    cards = []
    if official and official.instruction:
        cards.append(
            Card(
                title="경보 원문의 공식 행동지시",
                text=official.instruction,
                category="official",
                agency=official.sender,
                url=official.source,
                condition="해당 경보의 지역·대상·유효시간에만 적용",
                checked_at=official.checked_at,
            )
        )
    if official:
        country = "JP" if official.id.startswith("jma:") else "US"
    is_japan = country == "JP"
    content = (official.event if official else text).lower()
    selected_guides = (JAPAN_GUIDES if is_japan else GUIDES) if country != "unknown" else []
    for g in selected_guides:
        hazard = classify_hazard(content, g["tokens"])
        if hazard.state == "mentioned":
            cards.append(
                Card(
                title=(
                    g["title"]
                    if "행동요령" in g["title"]
                    else g["title"] + " 일반 안전수칙"
                ),
                    text=g["text"],
                    category="general",
                    agency="ActionGuard · 일본 일반 안전안내" if is_japan else "ActionGuard · NWS 자료 기반 일반 안내",
                    url=g["url"],
                    condition=g["condition"] + (" / 원문에 언급된 위험에 대한 일반 안내이며 현재 발효 여부는 확인되지 않았습니다." if not official else ""),
                    checked_at="2026-10-15 (자료 검토일; 실시간 확인 아님)",
                )
            )
    if not cards:
        cards.append(
            Card(
                title="지금 할 일",
                text=(
                    "경보가 현재 위치와 시간에 적용되는지 확인하십시오. "
                    "현지 당국의 최신 안내를 따르고, 위험 지역에 접근하지 마십시오. "
                    "생명이나 신체에 즉각적인 위험이 있으면 현지 긴급전화에 연락하십시오."
                ),
                category="general",
                agency="ActionGuard · 일반 안전안내",
                url="https://www.jma.go.jp/bosai/map.html?area_type=japan" if is_japan else "https://www.ready.gov/alerts",
                condition="공식 행동지시나 재난 유형별 안전수칙을 확인할 수 없을 때의 기본 안내",
                checked_at="2026-10-15 (자료 검토일; 실시간 확인 아님)",
            )
        )
    return Guidance(
        cards=cards,
        provenance=("JMA · 일본 기상청 경보 자료" if is_japan else "NWS API 원문 일치")
        if official
        else "사용자 입력 — 공식 발령 여부 확인되지 않음",
        limitations=[
            "현지 당국의 공식 지시가 AI 설명보다 우선합니다.",
            "대피소 운영·안전 경로·시설 폐쇄 여부는 확인되지 않음.",
            "일반 수칙은 개인별 대피 명령이 아닙니다.",
        ],
    )
