from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Model(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Alert(Model):
    geometry: dict | None = None
    message_type: str | None = None
    id: str
    event: str
    headline: str
    area: str
    severity: str
    sender: str
    sent: str | None
    effective: str | None
    expires: str | None
    onset: str | None = None
    ends: str | None = None
    instruction: str
    source: str
    text: str
    checked_at: str


class Alerts(Model):
    alerts: list[Alert]
    checked_at: str


class Input(Model):
    text: str = Field(min_length=1, max_length=16000)
    country: Literal["US", "JP", "unknown"] = "unknown"
    alert_id: str | None = Field(default=None, max_length=500)

    @field_validator("text")
    @classmethod
    def nonempty(cls, v):
        if not v.strip():
            raise ValueError("빈 원문입니다.")
        return v


DisplayField = Literal["translation", "summary", "hazard_explanation", "instruction_translation_ko", "glossary"]


class VerifyInput(Input):
    displayed: dict[DisplayField, str] = Field(default_factory=dict, max_length=4)

    @field_validator("displayed")
    @classmethod
    def bounded_display(cls, value):
        if "translation" in value or any(len(text) > 24000 for text in value.values()):
            raise ValueError("표시 내용이 유효하지 않습니다.")
        return value

    translation: str = Field(min_length=1, max_length=24000)

    @field_validator("translation")
    @classmethod
    def translation_nonempty(cls, v):
        if not v.strip():
            raise ValueError("빈 번역문입니다.")
        return v


class Glossary(Model):
    term: str
    meaning: str


class Translation(Model):
    translation: str = Field(min_length=1, max_length=24000)
    hazard_explanation: str
    glossary: list[Glossary]
    summary: list[str]
    instruction_translation_ko: str | None = None


Kind = Literal[
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


class Fact(Model):
    kind: Kind
    value: str
    quote: str = Field(min_length=1)


class Facts(Model):
    facts: list[Fact]


class Issue(Model):
    field: DisplayField = "translation"
    kind: Kind
    severity: Literal["critical", "minor"]
    source_quote: str | None
    translation_quote: str | None
    reason: str
    method: Literal["rule", "ai"] = "ai"


class Judgment(Model):
    issues: list[Issue]
    unresolved: list[str]


class Verification(Model):
    checked_fields: list[DisplayField] = Field(default_factory=list)
    status: Literal["불일치 미탐지", "오류 의심", "불일치 탐지", "검증 불가"]
    issues: list[Issue]
    unresolved: list[str]
    source_facts: list[Fact]
    translated_facts: list[Fact]
    official_fields: dict[str, str]
    checks: list[str]


class Card(Model):
    title: str
    text: str
    category: Literal["official", "general"]
    agency: str
    url: str
    condition: str
    checked_at: str


class Guidance(Model):
    cards: list[Card]
    provenance: str
    limitations: list[str]


class Health(Model):
    status: str
    ai_configured: bool
    model: str
    ocr_available: bool


class OCR(Model):
    text: str
    note: str


class Stay(Model):
    name: str = Field(min_length=1, max_length=120)
    country: Literal['US', 'JP']
    latitude: float | None = Field(default=None, ge=-90, le=90, allow_inf_nan=False)
    longitude: float | None = Field(default=None, ge=-180, le=180, allow_inf_nan=False)
    municipality: str | None = Field(default=None, max_length=100)
    timezone: str = Field(min_length=1, max_length=80)
    start: str = Field(min_length=1, max_length=40)
    end: str = Field(min_length=1, max_length=40)


class ConflictInput(Input):
    stay: Stay


class Conflict(Model):
    status: Literal['겹침 확인', '겹칠 가능성', '현재 확인된 겹침 없음', '메시지 만료', '해제', '판정 불가']
    reasons: list[str]
    spatial: str
    temporal: str
    checked_at: str
    source: str | None = None
    interval_utc: list[str] = Field(default_factory=list)


class ChatTurn(Model):
    role: Literal['user', 'assistant']
    text: str = Field(min_length=1, max_length=1800)


class ChatInput(Input):
    question: str = Field(min_length=1, max_length=1000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=8)
    stay: Stay | None = None


class ChatCitation(Model):
    evidence_id: str
    quote: str = Field(min_length=1, max_length=1200)


class ChatDraft(Model):
    answer: str = Field(min_length=1, max_length=1400)
    citations: list[ChatCitation] = Field(max_length=4)


class ChatSource(Model):
    title: str
    quote: str
    url: str | None = None


class ChatAnswer(Model):
    answer: str
    sources: list[ChatSource]
    checked_at: str
    mode: Literal['evidence', 'rule', 'unavailable']


class ChatReview(Model):
    supported: bool
    reason: str = Field(max_length=500)
