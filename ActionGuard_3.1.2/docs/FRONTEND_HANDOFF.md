# ActionGuard Travel — 프론트엔드 팀 인수인계

기준일: 2026-10-16 · 현재 코드 버전: 2.9 계열

이 문서는 **현재 소스에서 동작하는 기능**을 기준으로 작성했습니다. 시연 화면이 곧 배포 준비 완료를 뜻하지 않습니다. 화면 디자인은 교체할 수 있으며, 아래 API·공식 식별자·상태의 의미를 유지하면 됩니다.

## 1. 먼저 알아둘 서비스 흐름

**받은 문자 또는 공식 경보 선택 → 한국어 핵심 이해 → 원문 불일치 확인 → 대응 단계·행동지침 → 일정 비교 / AI 질문 / 필요한 경우 대피시설·일반 길찾기**

챗봇은 경보 선택 전에도 쓸 수 있습니다. 사용자가 질문에 장소를 적으면 장소 검색을 하고, 필요한 경우 후보 선택을 받습니다. 위치가 없고 장소도 언급하지 않은 질문에만 위치를 요청합니다.

현재 기본 지도·경로는 Leaflet, OpenStreetMap, FOSSGIS/OSRM을 사용합니다. Google Maps API 키는 필요하지 않습니다. Gemini 비밀키는 서버에만 둡니다.

## 2. 화면과 소스 위치

모든 경로는 프론트엔드 경로이며, API는 별도 `/api` 접두사를 사용합니다.

| 화면 경로 | 구현 내용 | 주된 프론트 파일 |
|---|---|---|
| `/` | 문자 입력, 이미지 OCR, 공식 경보 조회, F1~F3 및 대응 단계 | `frontend/src/pages/Flow.tsx`, `MessageOverview.tsx`, `UrgencyCard.tsx` |
| `/chat` | 앱 전체 AI 도우미, 실제 조회 카드와 관련 기능 연결 | `frontend/src/components/TravelAssistant.tsx` |
| `/itinerary` | 장소 한 곳·체류 시간 등록, 선택한 경보와 겹침 비교 | `TravelAssistant.tsx`, `JourneyPlace.tsx` |
| `/shelters` | 미국·일본 시설 목록/지도, 재난별 필터, 오프라인 목록 | `frontend/src/pages/Shelters.tsx` |
| `/shelters?view=route&…` | 같은 화면 안의 길찾기, 구간별 안내, 위치 추적 | `frontend/src/pages/Navigation.tsx`, `features/shelters/RouteCoach.tsx` |
| `/japan-disasters?tab=earthquake` | 일본 기상청 지진 관측·진앙·관측 진도 지도 | `frontend/src/pages/JapanDisasters.tsx`, `features/seismic/` |
| `/japan-disasters?tab=tsunami` | 쓰나미 해안별 단계·도달·예상 높이 지도 | 위와 같음 |
| `/notifications` | 서버 상태, 지역/유형 선택 초안, 앱 실행 중 알림 목록 | `frontend/src/pages/Notifications.tsx`, `features/mobile/` |
| `/weather-alert?scope=…` | 알림 지역의 최신 공식 기상경보 다시 조회 | `frontend/src/pages/WeatherAlert.tsx` |

`/navigation`은 통합 길찾기로 이동합니다. `/analyze`, `/translate`, `/verify`, `/guidance`는 홈으로 이동하는 호환 경로입니다. 독립된 F2 검증 탭은 만들지 않습니다.

`App.tsx`는 홈·챗봇·일정의 공통 Flow를 숨김/표시하며 분석 상태를 유지합니다. 새 UI에서 페이지를 분리한다면 공통 상태도 함께 옮겨야 합니다.

## 3. 구현된 기능과 한계

| 기능 | 현재 동작 | 반드시 유지할 한계/표시 |
|---|---|---|
| 문자 입력·OCR | 직접 입력, 이미지에서 원문 추출 | OCR은 서버 Tesseract 설치에 의존. 추출문은 사용자 확인 필요 |
| F1 한국어 이해 | 번역, 짧은 요약, 위험 설명, 용어 풀이, 공식 행동지시 번역 | AI 실패를 번역 완료로 표시하지 않기. 긴 번역은 접어서 제공 |
| F2 의미 검증 | 날짜·시간 역할·장소·숫자·단위·부정·조건·요약의 의미 대조 | 확실한 중대 불일치를 짧게 표시. 검증 불가/미완료와 불일치 미탐지는 다름 |
| 단위·시간 | 화씨/섭씨, mph/km/h 병기. ISO 시각 읽기 개선 | 날짜 숫자를 온도로 변환하지 않기. 발령/시작/종료/메시지 만료 구분 |
| F3 행동지침 | 공식 원문 지시와 공식 자료 기반 일반 안전수칙 구분 | 일반 수칙을 현지 대피 명령으로 표현하지 않기. 출처·적용 조건 유지 |
| 대응 4단계 | 정보/주의/대비/대피 + 확인 필요, 규칙 기본값 후 Gemini 보조 해석 | 앱 참고 척도. 정부 등급의 공식 환산이 아님. 4단계가 항상 야외 이동을 뜻하지 않음 |
| 공식 기상경보 | 미국 NWS 주/좌표 조회, 일본 JMA 관할별 조회 | 주 전체/관할 전체 목록은 내 위치 해당 여부를 보장하지 않음 |
| 일정 비교 | 장소 1곳의 위치·체류 시간과 공식 경보 비교 | 여행 일정 전체/이동 경로 분석이 아님. 일본은 시정촌 이름만으로 가능성 판정일 수 있음 |
| AI 도우미 | 번역·검증·대응·경보·시설·일정·알림·일반 안전수칙·앱 사용법 | 앱 밖 잡학·투자·오락 제한. 실제 조회 없이 경보/시설을 생성하지 않음 |
| 장소 질문 | 도쿄역 같은 지명, 도시 검색, 복수 후보 선택, 후속 조회 위치 유지 | 도시 대표 지점 ≠ 현재 GPS. 구독/공통 위치를 임의로 덮어쓰지 않음 |
| 대피시설 | 미국 FEMA·NYC 자료, 일본 GSI 자료, 거리·재난·시설 상태 표시 | 지정 시설 ≠ 현재 개방/입소 가능. 일본 일반 피난소와 재난별 긴급대피장소 구분 |
| 일반 길찾기 | 도보/자동차 경로, 지도, 현재 구간, 원하는 구간부터 보기, 한국어 읽기, 화면 내 GPS 진행 | 실시간 교통·침수·도로 통제·안전 경로·백그라운드 내비게이션은 미지원 |
| 오프라인 목록 | 조회 시설과 약도를 브라우저 저장, 안내 HTML 다운로드/다시 열기 | 저장 당시 자료. 최신 개방 상태/전체 지도 타일의 오프라인 보장을 하지 않음 |
| 지진 | 최근 관측 목록, 특정 사건, 규모·깊이·진앙 거리·관측소 진도 지도 | 발생 후 관측. 긴급지진속보 수신 기능이 아님. 가까운 관측소 진도는 내 위치 진도 예측이 아님 |
| 쓰나미 | 현재 유효 발표, 해안별 단계·높이·도달, 해제·과거 자료 구분 | 회색 해안/표시 없음 ≠ 안전. GPS로 침수/대피 대상 자동 판정하지 않음 |
| 알림 서버 | 지역·유형별 새 경보/격상/중요 변경/공식 해제 구분, 중복 방지·재시도 기반 | `disabled`/`dry_run`/`live`를 구분. 서버 상태만으로 기기 수신을 확인할 수 없음 |
| 모바일 | Capacitor iOS/Android 프로젝트, 알림 수신·탭 이동·딥링크 기반 | APK/IPA 배포, 실제 서명·토큰 보안 저장·서버 자동 등록·실기기 수신은 미완료 |

휴대폰에 온 셀 브로드캐스트 재난문자나 다른 앱 알림을 자동으로 읽는 기능은 구현되어 있지 않습니다.

## 4. API 연결

실행 중인 서버의 `/docs`에서 Swagger, `/openapi.json`에서 스키마를 확인할 수 있습니다. 전달본의 `docs/FRONTEND_API_SCHEMA.json`은 이 문서 작성 시점의 스냅샷입니다. 일부 외부 조회 API는 응답 모델이 느슨하므로 아래 설명과 실제 어댑터/타입도 함께 보세요.

### 원문 해석·대응

| 메서드·경로 | 입력/역할 | 주요 응답 |
|---|---|---|
| `GET /api/health` | 연결·서버 설정 점검 | `status`, `ai_configured`, `model`, `ocr_available` |
| `GET /api/alerts?area=CA` 또는 `?lat=…&lon=…` | 미국 경보 조회, 두 방식 동시 사용 불가 | `alerts[]`, `checked_at` |
| `GET /api/japan/areas` | 일본 관할 선택 목록 | `areas[]`: `code`, `name`, `en_name`, `ko_name`, `display_name`, `label_method` |
| `GET /api/japan/alerts?office=130000` | 일본 관할 경보 조회 | `alerts[]`, `checked_at` |
| `POST /api/translate` | `text`, `country`, 선택적 `alert_id` | `translation`, `summary[]`, `hazard_explanation`, `glossary[]`, `instruction_translation_ko` |
| `POST /api/verify` | 위 입력 + `translation`, 표시 내용 `displayed` | `status`, `issues[]`, `unresolved[]`, `checked_fields[]`, `checks[]` 등 |
| `POST /api/guidance` | 원문/국가/선택 경보 | `cards[]`의 `category=official/general`, `text`, `condition`, `agency`, `url`, `checked_at` |
| `POST /api/urgency` | 원문/국가/선택 경보 + `use_ai` | `level`, `label`, `action_kind`, `headline`, `actions`, `evidence`, `sources`, `inactive`, `method` |
| `POST /api/ocr` | multipart `file` 이미지 | `text`, `note` |
| `POST /api/journey/context` | 원문/국가/선택 경보 | 연결 가능한 `hazards[]` |

`country`는 `US`, `JP`, `unknown`. 일반 원문은 최대 16,000자입니다. 공식 경보의 `alert_id`는 서버가 조회해 보관한 실제 ID여야 합니다. ID와 원문을 임의로 조합하면 공식 자료로 인정하지 않으며 409로 갱신을 요구할 수 있습니다.

`health.ai_configured=true`는 키 설정 확인이며 모든 모델 호출의 성공을 보장하는 값이 아닙니다.

### 일정 비교

`POST /api/conflict` 요청 예시 (가상 테스트 데이터):

```json
{
  "text": "사용자가 선택한 실제 경보 원문",
  "country": "JP",
  "stay": {
    "name": "시험 장소", "country": "JP",
    "latitude": 35.68, "longitude": 139.76,
    "municipality": null, "timezone": "Asia/Tokyo",
    "start": "2026-10-17T15:00", "end": "2026-10-18T11:00"
  }
}
```

공식 비교를 할 때 실제 `alert_id`를 추가합니다. 시작·종료는 장소의 현지 시각이며 UTC 오프셋을 붙이지 않습니다. `timezone`은 IANA 이름입니다. 서머타임으로 존재하지 않거나 두 번 생기는 시각은 422가 될 수 있습니다.

응답 `status`: `겹침 확인`, `겹칠 가능성`, `현재 확인된 겹침 없음`, `메시지 만료`, `해제`, `판정 불가`. `reasons`, `spatial`, `temporal`, `interval_utc`를 함께 사용하세요. 겹침 없음은 안전 보장이 아닙니다.

### AI 도우미

`POST /api/chat` 최소 요청:

```json
{"question":"도쿄역에서 가장 가까운 지진 대피소 알려줘","country":"JP"}
```

선택 원문은 없어도 됩니다. 필요하면 다음을 함께 전달합니다.

- `text`, `alert_id`: 현재 연결한 문자/공식 경보.
- `history`: 최대 8턴, `{role:"user"|"assistant",text}`. 질문 최대 1,000자, 각 과거 턴 최대 1,800자.
- `location`: `{name,country,lat,lon,approximate?}`. 실제 등록 위치 또는 이전 응답의 `query_location`.
- `place_selection`: 사용자가 선택한 `place_candidates[].location`. 후보 선택 시 원래 질문과 함께 다시 요청.
- `stay`: 위 체류 일정 형식.
- `weather_scope`: 저장 지역의 공식 식별자. 예: `JP:130000:1310100`, `US:CA:CAZ522`.
- `previous_intent`, `related_alert_ids`: 직전 의도와 실제 조회한 경보 ID를 이어서 전달.

주요 응답:

| 필드 | UI 처리 |
|---|---|
| `answer` | 짧은 답변, 개행 보존. HTML로 삽입하지 않기 |
| `mode` | `rule`, `evidence`, `live`, `scope`, `clarify`, `unavailable` 구분 |
| `items[]` | 실제 경보/시설/지진 등 카드. `title`, `detail`, `status`, `source`, `path`, `distance_m`, 선택적 `alert` |
| `place_candidates[]` | `label`, `location`, `approximate`, `source`; 선택 UI 표시 |
| `query_location` | 다음 위치 기반 질문에 이어서 사용. 공통 위치를 자동 덮어쓰지 않기 |
| `needs_location` | 실제로 위치가 더 필요한 경우에만 위치 등록 UI 열기 |
| `actions[]` | 앱 내부 이동 버튼 `label`, `path`. 작업 완료/구독 활성화로 표현하지 않기 |
| `sources[]` | 답변 근거 `title`, `quote`, `url` |
| `scope_note`, `checked_at` | 조회 기준·제한·확인 시각 표시 |
| `urgency`, `translation` | 대응 카드/번역 결과가 있는 경우 해당 UI로 표시 |
| `tools_used`, `ai_used`, `intent` | 처리한 기능 및 보조 상태. 기술 정보는 사용자에게 최소 노출 |

등록 좌표·체류 시각은 모델에 보내지 않습니다. 사용자 질문·원문은 Gemini, 검색할 장소명은 지도 검색 서비스에 전송될 수 있습니다. AI가 작성한 추측 좌표를 사용하지 않습니다. 이전 도구 답변에 담긴 등록 장소·체류 정보도 후속 모델 입력에서 제외합니다.

### 시설·길찾기

| 메서드·경로 | 요청/응답 |
|---|---|
| `GET /api/shelters` | `lat`, `lon`, `radius_km=10`(0.5~50), `country=US/JP`, `disaster=general`, `include_registered=false` |
| `GET /api/navigation/config` | 지원 국가/이동 수단/제공자/키 필요 여부 |
| `POST /api/navigation/route` | `{origin:"위도,경도",destination:"위도,경도",mode:"WALK"|"DRIVE"}` → `route`, `warnings`, `traffic_verified:false` |
| `POST /api/shelters/route` | 기존 미국 공식 시설 ID 경로: `{lat,lon,shelter_id}`. 통합 일본 길찾기는 위 navigation API 사용 |

시설 응답에는 `shelters[]`, `origin`, `checked_at`, `source`, `warnings`, `truncated`, `excluded_count`가 있습니다. 시설별 `status`, `status_label`, `navigable`, `hazard_compatibility`, `supported_hazards`, `distance_m`, `address`를 보존하세요. `navigable=false`와 `registered` 참고 시설을 확인된 목적지처럼 강조하면 안 됩니다.

지원하는 재난 필터는 국가별로 다릅니다. 일본의 지진·쓰나미 등은 지정 긴급대피장소, `general`은 일반 피난소를 포함합니다. `models/shelters.py`와 `features/shelters/types.ts`가 상세 타입 기준입니다.

### 지진·쓰나미

- `GET /api/japan/earthquakes` → `events[]`, `cancelled_events[]`, `checked_at`.
- `GET /api/japan/earthquakes/{filename}` → 특정 관측의 `stations[]`, `epicenter`, `occurred_at`, `magnitude`, `max_intensity`, `source_url` 등.
- `GET /api/japan/tsunami` → `bulletin`, `status`, `checked_at`, `clear_at`.
- `GET /api/japan/tsunami-coasts` → 해안 GeoJSON.

`event` 선택값은 실제 파일명입니다. 목록에서 사라진 사건을 다른 사건으로 바꾸어 표시하지 마세요. 쓰나미의 `current`, `cancelled`, 각 해안 `level`을 확인하고, 과거 발표를 현재 경보 색상으로 보이지 않게 구분해야 합니다.

### 지역 선택·알림

- `GET /api/push/regions?country=JP&region=130000` → 관할에 속하는 시·구·정·촌. 한국어 표시 필드 포함.
- `GET /api/push/regions?country=US&region=CA` → 카운티/기상 예보 구역. 실제 코드/구역 종류를 구분.
- `GET /api/push/hazards` → 기상 재난 유형 코드/이름.
- `GET /api/push/weather?scope=JP:130000:1310100` → 선택 구역의 최신 공식 상태.
- `GET /api/push/status` → `mode`, `worker_recent`, `weather_health`, `delivery_confirmed:false` 등.
- 서버 등록: `POST /api/push/devices`, 변경: `POST /api/push/devices/{device_id}/update`, 해제: `POST /api/push/devices/{device_id}/revoke`, 확인: `GET /api/push/devices/{device_id}/status`.

등록에는 발급받은 `enrollment_code`, `provider=apns/fcm`, 토큰, `preferences`가 필요합니다. 변경·해제·기기 상태는 `Authorization: Bearer <기기 관리 키>`로 인증합니다. 키와 토큰을 화면·로그·브라우저 저장소에 노출하지 마세요. 현재 UI는 이 자동 연결을 완료하지 않았습니다.

상세 구독 JSON과 발송 설계는 `PUSH_REGIONAL_ALERTS.md`, `PUSH_SERVER.md`를 확인하세요. 브라우저에 지역을 저장한 것과 서버 구독을 활성화한 것은 다릅니다.

## 5. 지역 이름 표시 규칙 (이번 변경)

- 일본 API의 `name`은 원문, `code`는 공식 ID입니다. **이 둘은 조회·비교·구독용으로 유지**합니다.
- 표시에는 `display_name` 또는 `japanRegionLabel()`을 사용합니다. 예: **도쿄도 (東京都)**, **지요다구 (千代田区)**.
- 한국어 58개 관할·1,805개 시정촌 경보 구역 카탈로그: `data/japan-regions-ko.json`.
- `label_method=curated`는 직접 정리한 표기, `reading`은 JMA 영문 독음을 기반으로 만든 표시용 음역, `original`은 미등록/변경되어 원문으로 남긴 항목입니다. 한국어 공식 행정 명칭 인증을 뜻하지 않습니다.
- 향후 JMA 이름/코드가 바뀌면 이전 표기를 자동으로 재사용하지 않습니다. 새 카탈로그 점검이 필요합니다.
- 미국 50개 주+워싱턴 D.C.+5개 영토: `data/us-states-ko.json`. 예: **캘리포니아주 · California (CA)**. `US_STATES`, `stateLabel()`을 재사용하세요.
- 공통 표시 함수: `frontend/src/features/regions/labels.ts`. 저장된 기존 일본 원문 이름도 이 함수로 병기할 수 있습니다.
- 미국 카운티·기상 예보구 이름 전체의 한국어 번역은 이번 범위에 포함하지 않습니다. 주 이름/코드 병기와 구역 종류를 먼저 제공합니다.

## 6. 프론트 상태와 저장 범위

| 데이터 | 현재 관리 위치 | 새로고침/보안 주의 |
|---|---|---|
| 원문·선택 경보·번역·검증·국가 | `hooks/workspace.tsx` | 메모리 상태. 이전 비동기 응답이 다른 문자에 섞이지 않게 revision 유지 |
| 공통 위치·체류 일정 | 같은 Workspace | 메모리 상태. 위치 변경 시 기존 일정 판정 초기화 |
| 대화 | `TravelAssistant` | 메모리. 경보/위치 기준 변경 시 대화·대기 응답 정리 |
| 알림 지역/유형 초안 | `actionguard-notification-draft-v1` localStorage | 실제 서버 구독 아님. 공식 scope 값 그대로 저장 |
| 오프라인 시설 목록 | `features/shelters/offline.ts` | 저장 시각·원자료 조회 시각 표시. 삭제 UI 유지 |
| 테마 | localStorage `theme` | 사용자 설정 |
| 실행 중 받은 알림 | `MobileRuntime` | 메모리 목록 최대 30개. 영구 알림함 아님 |

`services/api.ts`는 JSON 파싱·빈 응답·서버 오류·타임아웃·기본 응답 형태를 검사합니다. 새 화면도 이 클라이언트를 재사용하거나 같은 실패 처리를 유지하세요. 4xx/5xx/연결 실패를 빈 목록 성공으로 바꾸면 안 됩니다. 분석 요청은 일부 오래 걸리므로 요청 중 상태/중복 클릭 방지/원문 변경 시 이전 응답 폐기가 필요합니다.

## 7. 새 UI에서 꼭 지킬 것

1. 핵심 요약과 지금 할 행동을 먼저, 긴 번역·근거·원문은 접기.
2. F2를 독립된 사용자 작업으로 만들지 않기. 실제 오류 의심만 1~2문장으로 표시하고 자세한 근거는 선택적으로 제공.
3. `확인 필요`, `조회 실패`, `경보 0건`, `공식 해제`, `메시지 만료`를 서로 다른 상태로 표시.
4. GPS는 명시적인 버튼을 누를 때 요청. 등록 장소·검색한 장소·현재 GPS를 구분.
5. 경보·관측·시설 카드에는 출처/확인 시각/현재성 표시를 유지.
6. 장소 후보 버튼, 실제 조회 카드, 관련 화면 이동을 대화 안에서 제공. 시설 목록과 길찾기를 별도 메인 탭으로 다시 쪼갤 필요 없음.
7. 대응 4단계를 숫자/색만으로 해석하지 않기. `action_kind`, 행동 문장, 적용 조건을 같이 표시.
8. 모바일 하단 탐색과 입력창이 버튼을 가리지 않게 하고 화면 폭/키보드/글자 확대를 점검.
9. 실패 후 재시도할 질문·원문을 보존. 잘못된 JSON이나 긴 응답에서 화면이 빈 채 멈추지 않기.
10. 공식 원문의 `area`, 시정촌 값, 공식 코드 등을 번역 라벨로 바꾸어 서버에 보내지 않기.

## 8. 실행·모바일 연결

- 기술 구성: React 19, TypeScript, Vite 8, React Query, React Router, FastAPI/Pydantic, Capacitor 8.
- 개발 실행: 프로젝트의 `시작.command`가 사용 가능한 포트와 해당 소스 버전을 확인합니다. 포트 번호를 제품 코드에 고정하지 마세요.
- 프론트만 작업: `cd frontend`, `npm ci`, `npm run dev`. Vite의 API 대상은 `ACTIONGUARD_BACKEND_PORT` 또는 `ACTIONGUARD_API_TARGET`로 지정할 수 있습니다.
- Node 버전은 `frontend/package.json` engines에 맞추세요(예: Node 24).
- 서버 비밀키는 `backend/.env`에 둡니다. `VITE_` 환경변수에 Gemini/APNs/FCM 비밀키를 넣지 마세요.
- 앱 빌드: `.env.mobile.example` 기반의 실제 HTTPS API 주소 → `npm run mobile:sync` → Xcode/Android Studio.
- 실기기 APNs/FCM, 앱 서명·배포·권한 거절/재허용·종료 상태 수신·토큰 갱신은 별도 검증해야 합니다. 네이티브 프로젝트가 있다는 것만으로 출시 가능하다고 판단하지 마세요.

검증: `npm test`, `npm run build`, 서버 `python -m pytest backend/tests -q`. 이번 지역 표시 변경에 대한 결과는 `REGION_LABELS.md`에 기록합니다.

## 9. 아직 개발 완료로 표시하면 안 되는 것

- 셀 브로드캐스트 재난문자 자동 읽기, 완성된 실기기 푸시 구독/수신, APK/IPA 배포.
- 위험 구역·침수·통제 회피를 보장하는 안전 대피 경로, 백그라운드 내비게이션, 실시간 교통.
- 여행 일정 여러 개/전체 이동 동선 분석, 사용자 계정·클라우드 동기화.
- 지진의 내 위치 예상 진도, 쓰나미 침수 범위·내 위치 대피 필요성 자동 판단.
- 미국 전역의 모든 대피시설 개방 상태 보장, 공식 조회 외 재난의 완전한 감지.
- 지진 긴급속보 수준의 지연 보장, 실제 재난 중 현장 검증, 상용 운영 부하·가용성 검증.

지역 검색은 일부 공개 서비스의 사용 정책/한도에 의존합니다. 상용 배포 전 계약한 서비스 또는 자체 운영으로 전환할 부분은 `APP_ASSISTANT.md`를 함께 확인하세요.

## 10. 권장 인수 순서

1. 이 문서와 `FRONTEND_API_SCHEMA.json`을 확인하고 현재 앱의 원문 한 건→번역→행동→시설 흐름을 실행.
2. 기존 API/표시 함수/공통 상태를 유지한 채 팀 디자인의 화면·컴포넌트로 교체.
3. 미국·일본, 위치 없음/권한 거부, 원문 없음, API 실패, 만료/취소, 복수 장소 후보를 각각 점검.
4. 네이티브 토큰 보안 저장·실제 서버 구독 및 실기기 푸시 연동을 별도 작업으로 수행.
5. 실제 모델 평가와 현장 자료·재난별 행동수칙 검토 후 출시 기준을 결정.
