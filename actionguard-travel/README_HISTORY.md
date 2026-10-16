# ActionGuard Travel 2.9

최신 개편: [2.9 작업 중심 UX와 실패 보완](docs/UX_2.9.md) · [실사용 점검표](docs/USABILITY_CHECKLIST_2.9.md).

이전 UI: [2.8 팀 시안·통합 경로 안내](docs/UI_2.8.md).

이전 버전: [2.7 통합 흐름·일본 대피소·키 없는 길찾기](docs/JOURNEY_2.7.md). 아래 이전 단계 기록보다 이 문서를 우선 참고하세요.

추가 구현: [경보 질문 챗봇 + 숙소·방문지 일정 한 건 판정](docs/CHAT_AND_TRAVEL_PHASE1.md). 좌표/시정촌과 현지 체류 시간을 직접 확인해 입력합니다. 주소 자동 검색·계정 저장·경로 판정은 아직 지원하지 않습니다. 해당 단계의 자동 검사: 백엔드 96개 + 프론트엔드 10개 통과.

2026-10-15 업데이트: [실제 모델 평가·시간 표시·행동지침 개선](docs/EVALUATION_2026-10-15.md). 자동 검사 78+7개 통과. 실모델 분석 5건 완료, 주입 오류 2/2 탐지. API 한도로 반복 평가 일부 미완료이며 공개 출시는 보류입니다.

현재 상태와 실제 운영 전 필수 개선사항: [전체 코드 검토 및 개발 방향](docs/PRODUCTION_REVIEW_2026-10-14.md). API 키는 `backend/.env` 또는 서버 환경변수에 한 번 설정하면 매번 입력할 필요가 없습니다. 실제 키 파일은 공유 ZIP에 포함하지 않습니다.

미국 NWS와 일본 기상청(JMA)의 공식 기상 경보를 한국어로 번역하고, 중요한 행동정보를 검증하며, 행동지침까지 **한 화면에서 연속 실행하는 로컬 F1~F3 MVP**입니다. 원문을 한 번 선택하거나 입력한 뒤 단일 버튼을 누르면 번역 → 교차검증 → 행동지침이 순서대로 완성됩니다. 일본어 경보문을 직접 붙여넣거나 일본 기상청 관할 지역별 기상 경보·주의보를 조회할 수 있습니다. 지진·쓰나미는 일본 실시간 경보 조회에 포함되지 않으며, 해당 일본어 문자를 직접 입력하면 일반 행동요령을 안내합니다. React + TypeScript + Vite / FastAPI + Pydantic + httpx + Gemini REST를 사용합니다. 로그인·결제·대피소 추천은 포함하지 않습니다.

이번 개선: [문자 한 건 이해하기 — 1차 구현](docs/SINGLE_MESSAGE_PHASE1.md). 붙여넣은 문자는 국가를 직접 선택하며, 모르는 경우 국가별 행동지시를 추정하지 않습니다.

## 먼저 알아둘 사항

- **API 키 없이** NWS/JMA 경보 조회와 F3 일반 지침을 사용할 수 있습니다. F1 번역과 F2 의미 검증은 서버의 Gemini 키가 필요합니다.
- 기본 `gemini-3.5-flash-lite`의 입력/출력 무료 티어는 [Google 공식 요금표](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite)에서 2026-10-14 확인했습니다. 실제 계정 접근과 한도는 AI Studio에서 확인해야 합니다.
- **결제 연결되지 않은 Free tier 프로젝트의 키만 사용하세요.** 앱은 Google 프로젝트의 결제 상태를 조회하거나 강제로 무료로 바꿀 수 없습니다. `GEMINI_FREE_TIER_CONFIRMED=true`는 운영자의 확인 표시이지 과금 차단 기능이 아닙니다.
- 429 응답은 자동 재시도하지 않습니다. 모델 자동 변경·유료 전환·유료 grounding·OpenAI SDK/API는 없습니다.
- F1 1회, F2 3회로 전체 분석에 Gemini 요청 최대 4회가 필요합니다. 동일 요청은 10분 메모리 캐시됩니다. 일일 기본 40회 제한은 **프로세스 단위**이며 서버 재시작 시 초기화됩니다.
- 일반 안내는 현지 당국의 긴급 지시를 대체하지 않습니다. ‘불일치 미탐지’는 안전 인증이 아닙니다.

## 준비물

Python 3.11 이상(3.12~3.14 권장), **Node.js 24 LTS**와 npm, 인터넷 연결. Python/Node 설치 자체는 이 프로젝트에 포함되지 않습니다. ZIP에는 소스, npm 잠금 파일, Python 검증 버전 목록, 프론트엔드 빌드 결과가 포함됩니다. `.env`, 실제 키, node_modules, 가상환경은 없습니다.

## macOS 실행

압축을 풀고 **이 README가 있는 actionguard-travel 폴더**에서:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
```

`backend/.env`를 편집합니다. 키 없이 먼저 실행하려면 그대로 두세요.

```env
GEMINI_API_KEY=발급받은_키
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FREE_TIER_CONFIRMED=true
NWS_USER_AGENT=ActionGuardTravel/2.0 (본인의_연락용_이메일)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
AI_DAILY_CALL_LIMIT=40
```

**터미널 1 — 백엔드 (프로젝트 최상위에서):**

```bash
source .venv/bin/activate
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**터미널 2 — 프론트엔드:**

```bash
cd frontend
npm ci
npm run dev
```

브라우저에서 **http://127.0.0.1:5173**을 엽니다. 프론트엔드의 `/api` 요청을 Vite가 8000번 FastAPI 서버로 전달합니다. API 문서는 http://127.0.0.1:8000/docs 에서 확인할 수 있습니다.

## Windows PowerShell 실행

README가 있는 폴더에서:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
```

`backend\.env`를 위 예시대로 편집합니다. PowerShell 실행 정책을 변경할 필요 없이 가상환경 Python을 직접 실행합니다.

**PowerShell 창 1:**

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**PowerShell 창 2:**

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

http://127.0.0.1:5173 접속. `py -3 --version`이 Python 3.11 이상인지 확인하세요. Windows 실제 실행은 이번 환경에서 검증하지 못했습니다.

## 사용 순서

1. 공식 경보 찾기에서 미국(주 코드/좌표) 또는 일본(JMA 관할 지역)을 선택해 조회합니다. 일본 경보의 적용 지역은 시정촌 단위로 표시됩니다.
2. 경보 카드를 선택하면 F1에 공식 원문과 기관, 심각도, 시간이 표시됩니다. 발효(`effective`), 현상 시작(`onset`), 현상 종료(`ends`), 메시지 만료(`expires`)는 서로 다릅니다. 카드의 시간은 브라우저 현지 시간대, 원문은 API 원래 시간대입니다.
3. F1에서 번역합니다. 직접 입력/가상 예시/OCR도 사용 가능합니다. **원문을 수정하면 공식 연결과 이전 분석이 해제됩니다.**
4. F2에서 번역문을 검증합니다. 번역문을 직접 수정하여 검증할 수도 있습니다. 두 텍스트의 근거, 오류 카드, 미검증 항목, 공식 필드를 확인합니다.
5. F3에서 조회된 공식 행동지시가 있으면 먼저 확인합니다. 일본 기상청 경보 자료에는 개별 행동지시가 포함되지 않아 일본 상황별 일반 안전안내를 따로 표시합니다. AI 키가 없어도 작동합니다.

새로고침하면 현재 원문/분석은 사라집니다. 테마만 브라우저에 저장합니다. 공식 경보 연결은 서버 메모리에 15분 유지하며, 서버 재시작·만료 후에는 다시 조회해야 합니다. 경보 취소나 변경은 자동 추적하지 않으므로 수시로 재조회하세요.

## 선택 기능: 무료 로컬 OCR

`pytesseract`는 Python 설치에 포함되지만 **Tesseract 실행 프로그램**은 별도 설치해야 합니다.

- macOS: Homebrew가 이미 설치되어 있다면 `brew install tesseract`.
- Windows: [Tesseract 공식 설치 안내](https://tesseract-ocr.github.io/tessdoc/Installation.html)를 따라 설치하고 `tesseract.exe` 폴더를 PATH에 추가합니다.
- 터미널에서 `tesseract --version`, `tesseract --list-langs`로 확인. `eng` 언어 데이터가 필요합니다.
- PNG/JPEG/WEBP, 6MB 이하, 1,200만 화소 이하, 30초 제한. 이미지는 서버 메모리에서 OCR하며 Gemini로 보내지 않습니다.
- 추출한 내용을 사용자가 수정한 후 번역합니다. 엔진 미설치·인식 실패 시 텍스트 입력/NWS 조회를 사용하세요.
- 이번 환경에는 Tesseract가 없어 **실제 문자 인식 정확도는 미검증**입니다. 엔진 미설치 처리와 OCR 입력 검증은 테스트했습니다.

## F2 구현과 한계

1. 원문과 번역을 각각 독립 요청으로 12종 Pydantic Fact에 추출합니다.
2. 공식 NWS 이벤트·지역·시작/종료·경보 용어가 있으면 원문 Fact보다 우선합니다. `severity` 등 원본 필드도 별도로 제공합니다.
3. 실제 입력에 없는 인용을 제외하고 검증 불가 사유로 남깁니다.
4. 규칙으로 영문 12시간/한국어 시각, ISO 날짜, 일부 숫자·단위(mph/inches/feet/miles/percent), 공식 지역명 원어 보존, Watch/Warning/Advisory, 특정 금지 반전을 검사합니다.
5. 별도 AI 요청으로 행동 누락/추가, 명령↔권고, 조건·대상·부정 의미를 직접 대조합니다.
6. 중요한 근거 있는 오류 → 불일치 탐지, 미해결 사유 → 검증 불가, 경미한 오류 → 오류 의심, 그 외 → 불일치 미탐지 순입니다. 오류 카드와 미해결 사유는 상태와 함께 모두 표시됩니다.

범용 시간대 변환·단위 환산·지명 음역의 완전한 동등성 증명은 구현하지 않았습니다. 보존 여부가 불명확하면 의심/검증 불가로 처리합니다. 추출과 판단이 같은 Gemini 모델이므로 오류가 상관될 수 있습니다. 모델 품질에 대한 실제 재난경보 벤치마크는 수행하지 않았습니다. 단순 문자열 규칙만으로 정확성을 보증하지 않습니다.

## API

| 메서드 | 경로 | 입력 / 동작 |
|---|---|---|
| GET | `/api/health` | 설정 여부·모델명·OCR 이용 가능 여부 (키는 반환 안 함) |
| GET | `/api/alerts?area=CA` | NWS; 또는 `?lat=38.9&lon=-77.04`; 중복 제거·120초 캐시 |
| GET | `/api/japan/areas` | JMA 관할 지역 목록; 1시간 캐시 |
| GET | `/api/japan/alerts?office=130000` | 일본 기상 경보·주의보; 시정촌 적용 지역으로 묶고 120초 캐시 |
| POST | `/api/translate` | `{ "text": "...", "alert_id": null }` |
| POST | `/api/verify` | 위 입력 + `"translation": "..."` |
| POST | `/api/guidance` | text 및 선택 alert_id; AI 호출 없음 |
| POST | `/api/ocr` | multipart `file` |

`alert_id`는 이 서버가 직접 NWS/JMA에서 조회한 값만 허용하고 원문이 정확히 일치해야 합니다. 클라이언트가 지시/출처 URL을 전달해서 공식 카드로 만들 수 없습니다. 임의 URL 요청도 받지 않습니다. JMA 조회는 [기상청 경보·주의보 안내](https://www.jma.go.jp/jma/kishou/know/bosai/warning.html)의 관할 지역별 기상 자료를 사용하며, 지진·쓰나미 실시간 정보는 별도 연동 대상입니다.

## 테스트와 빌드

macOS (최상위):

```bash
source .venv/bin/activate
python -m pytest backend/tests -q
cd frontend
npm test
npm run build
```

Windows (최상위):

```powershell
.\.venv\Scripts\python.exe -m pytest backend\tests -q
cd frontend
npm.cmd test
npm.cmd run build
```

`backend/requirements-tested.txt`는 macOS Python 3.14에서 통과한 정확한 버전 스냅샷입니다. 보통 `requirements.txt`를 사용하고 재현이 필요하면 tested 파일을 사용하세요. `package-lock.json`은 Node 24로 검증했습니다. 모의 Gemini/NWS 테스트는 외부 API를 호출하지 않습니다. 결과와 검증 범위는 [검증 보고서](docs/VALIDATION.md)를 보세요.

## 무료 배포 방안

추가 서비스나 결제 등록 없이 **자신의 컴퓨터에서 로컬 실행**하는 것이 기본 방안입니다. 공유 시에는 `npm run build`로 만든 `frontend/dist`를 기존 정적 호스트에서 제공하고, 별도 Python 서버로 `/api`를 프록시하는 구조입니다. 특정 호스팅의 무료 티어는 보장하지 않으며 이번 작업에서는 외부 배포를 하지 않았습니다. Vite 개발 서버/미리보기 서버는 공개 운영용 서버가 아닙니다. 정적 호스트는 React Router를 위해 모든 앱 경로를 `index.html`로 재작성해야 합니다.

공개 운영 전에는 HTTPS, 요청 크기 제한, 악용 방지·호출 제한, 비밀 환경변수 관리가 필요합니다. CORS만으로 API 접근을 인증할 수 없습니다. 현재 MVP는 로그인 없는 **단일 프로세스 로컬용**입니다. 다중 Uvicorn worker는 공식 출처 캐시·사용량 제한을 공유하지 않으므로 사용하지 마세요.

## 보안·개인정보

키는 `backend/.env`에만 넣고 `VITE_*` 변수에 넣지 마세요. 키·원문·이미지를 로그에 기록하지 않으며 Gemini 오류의 응답 본문/헤더를 반환하지 않습니다. 실제 입력은 Gemini에 전달되고 무료 티어 데이터는 Google 서비스 개선에 사용될 수 있습니다([공식 정책](https://ai.google.dev/gemini-api/docs/pricing)). 개인정보를 제거하고 입력하세요. 분석 결과는 서버 메모리에 최대 10분 보관되며 재시작 시 제거됩니다.

## 폴더

- `frontend/src/pages`: Dashboard, Translate, Verify, Guidance
- `frontend/src/components/ui`: shadcn 패턴의 로컬 UI 컴포넌트
- `backend/adapters/nws.py`: 비동기 공식 API, 파싱, 출처 캐시
- `backend/core`: Gemini, 번역, 독립 추출, 규칙/의미 검증, 근거 지침
- `backend/models/contracts.py`: 입력/응답 Pydantic 계약
- `backend/tests`, `frontend/src/App.test.tsx`: 테스트
- `data/fixtures`: 명확하게 표시한 가상 경보
- `data/official_guides`: 검토한 공식 자료의 한국어 요약·조건·URL
- `docs/ANALYSIS.md`: 원본 구현 검토 및 변경 근거

## 챗봇 개선 및 실행

[2026-10-15 챗봇 개선 내역](docs/CHAT_UPGRADE_2026-10-15.md)을 참고하세요. 최초 설치 이후 macOS에서는 `시작.command`를 터미널로 열거나 프로젝트 폴더에서 `bash 시작.command`로 실행하면 화면과 분석 서버가 함께 시작됩니다. 실행 중에는 해당 창을 열어 두세요.

## 2.6 지도 통합

[대피소 지도·길찾기 사용 및 검증](docs/F4_INTEGRATION.md). 기존 통합 분석과 챗봇에 지도 메뉴를 추가했습니다. 미국 공식 시설과 좌표 도보 조회는 키 없이 이용할 수 있습니다.

## iOS·Android 앱 개발 기반

`frontend/ios`와 `frontend/android`에 Capacitor 앱 프로젝트가 있습니다. 상단 **알림**에서 수신 연결 상태를 확인할 수 있습니다. 실제 푸시 발송과 APK/IPA 배포는 아직 연결하지 않았습니다. 상세 설정과 남은 작업은 [모바일 개발 안내](docs/MOBILE_FOUNDATION.md)를 참고하세요.

푸시 서버 구독 API, 모의 점검 worker, FCM/APNs 어댑터의 구현 범위와 실행 방법은 [푸시 서버 안내](docs/PUSH_SERVER.md)에 있습니다. 기본 발송 모드는 disabled입니다.

지역·재난 유형별 미국/일본 경보 알림의 구현 범위와 운영 정책은 [등록 지역별 알림](docs/PUSH_REGIONAL_ALERTS.md)을 참고하세요. 브라우저 설정 저장은 실제 휴대폰 구독 활성화와 구분됩니다.
