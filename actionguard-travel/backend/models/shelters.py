from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


class Origin(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)


class Shelter(BaseModel):
    country: Literal["US", "JP"] = "US"
    facility_kind: str = "facility"
    supported_hazards: list[str] = Field(default_factory=list)
    hazard_compatibility: Literal["designated", "unknown"] = "unknown"
    remarks: str = ""
    id: str
    name: str
    address: str
    lat: float
    lon: float
    status: Literal['open', 'planned', 'registered'] = 'open'
    shelter_type: str = 'other'
    type_label: str = '공식 데이터 유형 확인 필요'
    navigable: bool = True
    operating_status: str | None = None
    incident_name: str | None = None
    role_label: str = '공식 대피 시설'
    classification_source: str | None = None
    status_label: str = '공식 데이터상 운영 중'
    distance_m: float
    bearing_deg: float
    direction: str
    wheelchair_accessible: str = '확인되지 않음'
    pets: str = '확인되지 않음'
    source: str
    checked_at: str
    source_updated_at: str | None = None


class ReviewCandidate(BaseModel):
    name: str
    address: str
    google_search_url: str


class ShelterSearch(BaseModel):
    country: Literal["US", "JP"] = "US"
    origin: Origin
    radius_km: float
    disaster: Literal['general','hurricane','tornado','flood','wildfire','landslide','storm_surge','earthquake','tsunami','fire','inland_flood','volcano'] = 'hurricane'
    shelters: list[Shelter]
    checked_at: str
    source: str
    sources: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    pending_review: list[ReviewCandidate] = Field(default_factory=list)
    excluded_count: int = 0
    building_search_enabled: bool = False
    truncated: bool = False
    note: str = '직선거리 순입니다. 공식 데이터의 운영 표시는 현장 입소 가능 여부를 보장하지 않습니다.'


class RouteInput(Origin):
    shelter_id: str = Field(min_length=1, max_length=100)


class RouteStep(BaseModel):
    coordinates: list[list[float]] = Field(default_factory=list)
    instruction: str
    distance_m: float


class WalkingRoute(BaseModel):
    shelter_id: str
    origin: Origin
    distance_m: float
    duration_s: float
    coordinates: list[list[float]]  # GeoJSON [longitude, latitude]
    steps: list[RouteStep]
    checked_at: str
    routing_criterion: str = '제공된 도보 경로 중 예상시간 최소, 동률이면 거리 최소'
    alternatives_evaluated: int = 1
    source: str = 'https://routing.openstreetmap.de/about.html'
    attribution: str = '경로: FOSSGIS / OSRM · © OpenStreetMap contributors (ODbL)'
    note: str = '일반 보행 경로입니다. 침수·재난·도로 통제와 현장 안전은 반영하지 않습니다.'
