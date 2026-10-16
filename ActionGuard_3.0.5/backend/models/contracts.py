from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Model(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Alert(Model):
    geometry: dict | None = None
    message_type: str | None = None
    status: str | None = None
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


class UrgencyEvidence(Model):
    quote: str
    explanation: str


class UrgencySource(Model):
    title: str
    url: str


class UrgencyAssessment(Model):
    level: Literal[1, 2, 3, 4] | None
    label: Literal['정보', '주의', '대비', '대피', '확인 필요']
    action_kind: Literal['monitor', 'caution', 'prepare', 'protect', 'shelter', 'higher_ground', 'evacuate', 'unknown']
    headline: str
    meaning: str
    actions: list[str]
    evidence: list[UrgencyEvidence]
    sources: list[UrgencySource]
    provenance: Literal['official', 'input', 'example']
    applicability: str
    notice: str
    inactive: bool = False
    rule_version: str = 'us-jp-action-scale-2'
    method: Literal['rules', 'ai', 'rules_fallback'] = 'rules'
    method_note: str = '원문 표현을 기준으로 판단했어요.'


class UrgencyInput(Input):
    use_ai: bool = True


class UrgencyInterpretation(Model):
    level: Literal[1, 2, 3, 4] | None
    action_kind: Literal['monitor', 'caution', 'prepare', 'protect', 'shelter', 'higher_ground', 'evacuate', 'unknown']
    evidence: list[str] = Field(max_length=4)
    reason_ko: str = Field(max_length=300)


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


class ChatLocation(Model):
    country: Literal['US', 'JP']
    lat: float = Field(ge=-90, le=90, allow_inf_nan=False)
    lon: float = Field(ge=-180, le=180, allow_inf_nan=False)
    name: str = Field(default='등록한 위치', max_length=120)
    approximate: bool = False


class ChatPlaceQuery(Model):
    mention: str | None = Field(default=None,max_length=120)
    query: str | None = Field(default=None,max_length=160)
    country: Literal['US','JP'] | None = None


class ChatPlaceCandidate(Model):
    location: ChatLocation
    label: str
    approximate: bool = False
    source: str


ChatIntent = Literal['alerts','shelters','navigation','analysis','urgency','guidance','itinerary','notifications','japan_disasters','app_help','alert_question','scope','greeting','clarify']


class ChatInput(Model):
    text: str = Field(default='', max_length=16000)
    country: Literal['US', 'JP', 'unknown'] = 'unknown'
    alert_id: str | None = Field(default=None, max_length=500)
    question: str = Field(min_length=1, max_length=1000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=8)
    stay: Stay | None = None
    location: ChatLocation | None = None
    weather_scope: str | None = Field(default=None, pattern=r'^(?:US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}|JP:[0-9]{6}:[0-9]{7})$')
    place_selection: ChatLocation | None = None
    previous_intent: ChatIntent | None = None
    related_alert_ids: list[str] = Field(default_factory=list, max_length=5)

    @field_validator('question')
    @classmethod
    def question_nonempty(cls, value):
        if not value.strip():
            raise ValueError('질문을 입력해 주세요.')
        return value


class ChatRouting(Model):
    intents: list[ChatIntent] = Field(min_length=1, max_length=3)


class ChatAction(Model):
    label: str
    path: str

    @field_validator('path')
    @classmethod
    def app_path(cls, value):
        from urllib.parse import urlsplit
        parsed=urlsplit(value)
        if parsed.scheme or parsed.netloc or parsed.path not in ('/','/chat','/itinerary','/notifications','/japan-disasters','/shelters','/weather-alert'):
            raise ValueError('앱 내부 화면만 연결할 수 있습니다.')
        return value


class ChatItem(Model):
    kind: Literal['alert','shelter','info']
    title: str
    detail: str
    status: str
    source: str
    path: str | None = None
    distance_m: float | None = None
    alert: Alert | None = None

    @field_validator('path')
    @classmethod
    def internal_path(cls, value):
        if value is not None:
            ChatAction(label='확인',path=value)
        return value


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
    mode: Literal['evidence', 'rule', 'unavailable', 'live', 'scope', 'clarify']
    intent: ChatIntent = 'alert_question'
    query_location: ChatLocation | None = None
    place_candidates: list[ChatPlaceCandidate] = Field(default_factory=list)
    needs_location: bool = False
    items: list[ChatItem] = Field(default_factory=list)
    scope_note: str | None = None
    ai_used: bool = False
    actions: list[ChatAction] = Field(default_factory=list)
    tools_used: list[str] = Field(default_factory=list)
    urgency: UrgencyAssessment | None = None
    translation: Translation | None = None


class ChatReview(Model):
    supported: bool
    reason: str = Field(max_length=500)
