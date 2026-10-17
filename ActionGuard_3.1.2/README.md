# 3.1.2 UI·UX 개선

경보 결과를 상황 다음에 구체적인 행동이 나오도록 정리하고 홈·펼침 메뉴·일정·준비물 화면을 다듬었습니다. [변경 내용과 검증 범위](docs/RELEASE_3.1.2.md)를 확인하세요.

# 3.1.1 사용성 수정

상단 국가 선택을 모든 조회에 일관되게 적용하고, 한국어 용어 설명·핵심 정보 기본 표시·모바일 화면 간격을 개선했습니다. [수정 내용과 검증](docs/RELEASE_3.1.1.md)을 확인하세요.

# 3.1.0 업데이트

국가 선택 버튼·국가별 공식 경보 표시·분화 경보·위치 기반 기기 구독 연결을 추가했습니다. [구현 범위와 운영 설정](docs/RELEASE_3.1.0.md)을 먼저 확인하세요. 네이티브 설치와 실제 푸시 수신은 별도 검증이 필요합니다.

# ActionGuard Travel — 팀 프론트 통합본

미국·일본 여행 중 받은 재난문자를 한국어로 이해하고, 공식 행동지침·일정·대피시설을 한 흐름에서 확인하는 팀 개발 프로젝트입니다.

React + TypeScript + Vite / FastAPI / Capacitor(iOS·Android).

**이 폴더는 기존 프로젝트와 별도로 만든 통합본입니다.** 팀 프론트엔드의 화면 체계에 기존 기능을 연결했습니다. [통합 화면·기능·구현 위치와 제약](docs/TEAM_INTEGRATION.md)을 먼저 확인하세요.

최근 사용 흐름 개선: **도시·숙소 검색과 지도 확인, 경보의 상황·위치 적용·행동 순서, 위치·일정 기기 저장 및 공식 기상 경보 재조회**를 적용했습니다. [2026-10-17 변경과 API·저장 정책](docs/USABILITY_2026-10-17.md)을 참고하세요.

## 현재 구현 범위

- **F1**: 영문·일문 재난문자 번역, 짧은 요약, 시간·단위 보완.
- **F2**: 원문과 번역의 중요한 의미 불일치 검증.
- **F3**: 공식 행동지시와 별도 일반 행동요령, 근거 기반 질문 챗봇.
- **F4**: 미국·일본 대피시설 지도와 길찾기. Google Maps API 키 불필요.
- 일정과 경보의 지역·시간 비교.
- 일본 지진 진앙·관측 진도 지도, 쓰나미 해안별 경보 지도.
- 등록 지역·재난별 경보 변경 감지, 발송 대기열, APNs/FCM 어댑터.

**개발·검증 단계입니다.** 실제 휴대폰 푸시 구독 연결·수신 검증과 APK/IPA 배포는 남아 있습니다. 웹 화면의 알림 지역 저장은 브라우저 설정 초안이며 실제 푸시 활성화가 아닙니다. 대피시설의 현재 개방이나 경로의 재난 안전성을 보장하지 않습니다.

번역 결과의 **정보 → 주의 → 대비 → 대피** 참고 척도는 [대응 4단계 설명](docs/URGENCY_SCALE.md)을 참고하세요. 미국·일본 원문을 기본 규칙으로 먼저 확인하고, Gemini AI가 근거 문장과 행동 조건을 해석해 보완합니다. 일본의 공식 5단계 경계 레벨과는 별도의 앱 참고 척도입니다.

## 바탕화면에서 실행하기

`시작.command`를 더블 클릭하면 **402 × 874 모바일 미리보기**가 기본으로 열립니다. 창 높이가 작으면 미리보기 전체를 비율에 맞춰 축소하며, 앱 내부 크기와 하단 메뉴는 유지됩니다. 실행 중인 터미널 창은 열어 두세요.

## 처음 실행하기

Node.js 24 LTS, Python 3.11 이상, 인터넷 연결이 필요합니다. 아래 명령은 **이 README가 있는 폴더**에서 실행합니다.

### 1. 백엔드

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Windows PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

공식 경보·지도·일반 행동요령은 Gemini 키 없이 확인할 수 있습니다. 번역·의미 검증·AI 답변에는 `backend/.env`의 `GEMINI_API_KEY` 등 서버 설정이 필요합니다. 이미 `.env`가 있다면 덮어쓰지 마세요. 실제 키는 채팅·커밋·`VITE_*` 변수에 넣지 않습니다.

### 2. 프론트엔드 — 새 터미널

```bash
cd frontend
npm ci
npm run dev
```

화면: <http://127.0.0.1:5173> · API 문서: <http://127.0.0.1:8000/docs>

Vite가 `/api`를 백엔드 8000 포트로 전달합니다. 다른 포트를 쓰려면 `frontend/.env.local`에 `ACTIONGUARD_BACKEND_PORT=8007`처럼 지정합니다. 개발 서버는 외부 공개용 서버가 아닙니다.

macOS는 최초 설치 후 `시작.command`를 더블클릭하거나 프로젝트 루트에서 `bash 시작.command`로 실행합니다. 실행기는 현재 폴더와 코드가 일치하는 서버만 재사용합니다. 이전 버전 서버가 열려 있으면 다른 포트에서 최신 버전을 실행하며, 열린 주소는 실행 창에 표시합니다. 홈의 **일본 지진 · 쓰나미 지도** 또는 메뉴의 **지진 · 쓰나미**에서 관측 지도로 이동할 수 있습니다.

## 테스트

프로젝트 루트에서:

```bash
.venv/bin/python -m pytest backend/tests -q
cd frontend
npm test
npm run build
```

Windows에서는 Python 경로를 `.\.venv\Scripts\python.exe`로 바꾸세요. 자동 테스트는 외부 API 키 없이 실행되며, 실제 Gemini 품질·실기기 수신·현장 대피 시험을 대신하지 않습니다. 모바일 네이티브 빌드·서명은 CI 검증에 포함하지 않습니다.

## 모바일·알림 서버

- [모바일 앱 개발 기반](docs/MOBILE_FOUNDATION.md)
- [푸시 서버 API·작업자 실행](docs/PUSH_SERVER.md)
- [지역·재난별 알림 정책과 남은 연결](docs/PUSH_REGIONAL_ALERTS.md)
- [일본 지진·쓰나미 데이터와 한계](docs/JAPAN_SEISMIC.md)

푸시는 기본 `disabled`입니다. 선택 설치는 `python -m pip install -r backend/requirements-push.txt`를 사용합니다. 제공자 키와 기기 토큰 DB는 서버에만 보관합니다.

## 팀 작업

- [팀원 실행·기여 안내](CONTRIBUTING.md)
- `frontend/src/pages`: 주요 화면 / `frontend/src/features`: 지도·모바일 기능.
- `frontend/src/services/api.ts`: 프론트 API 연결 / `backend/main.py`: FastAPI 진입점.
- `backend/adapters`: 공식 데이터 / `backend/core`: 번역·검증·행동지침 / `backend/push`: 구독·변경 감지·발송.
- `backend/tests`, `frontend/src/**/*.test.*`: 자동 테스트.
- `data`, `evaluation`, `docs`: 근거·평가·개발 기록.

계정 정보·실제 재난문자의 개인정보·기기 토큰·DB·서명 파일은 공유하지 않습니다. 공식 기관의 최신 지시가 우선이며 ‘불일치 미탐지’는 안전 인증이 아닙니다. 지난 단계의 구현 기록은 [README 이력](README_HISTORY.md)에 보존했습니다. 과거 기록보다 위 최신 범위를 우선 참고하세요.

앱 전체 AI 도우미: 경보 입력 전에도 번역·경보 조회·주변 시설·일정·알림 기능을 대화로 연결합니다. [기능과 개인정보·자료 범위](docs/APP_ASSISTANT.md)를 확인하세요.

프론트엔드 팀 전달: [현재 기능·화면·API 인수인계](docs/FRONTEND_HANDOFF.md) · [API 스키마](docs/FRONTEND_API_SCHEMA.json).

팀 전달용 빠른 목록: [프론트엔드 기능 요약](docs/FRONTEND_FEATURES.md). 일본·미국 [지역 이름 병기 안내](docs/REGION_LABELS.md).
