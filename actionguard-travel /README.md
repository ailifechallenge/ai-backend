# ActionGuard Travel

미국·일본 여행 중 받은 재난문자를 한국어로 이해하고, 공식 행동지침·일정·대피시설을 한 흐름에서 확인하는 팀 개발 프로젝트입니다.

React + TypeScript + Vite / FastAPI / Capacitor(iOS·Android).

## 현재 구현 범위

- **F1**: 영문·일문 재난문자 번역, 짧은 요약, 시간·단위 보완.
- **F2**: 원문과 번역의 중요한 의미 불일치 검증.
- **F3**: 공식 행동지시와 별도 일반 행동요령, 근거 기반 질문 챗봇.
- **F4**: 미국·일본 대피시설 지도와 길찾기. Google Maps API 키 불필요.
- 일정과 경보의 지역·시간 비교.
- 일본 지진 진앙·관측 진도 지도, 쓰나미 해안별 경보 지도.
- 등록 지역·재난별 경보 변경 감지, 발송 대기열, APNs/FCM 어댑터.

**개발·검증 단계입니다.** 실제 휴대폰 푸시 구독 연결·수신 검증과 APK/IPA 배포는 남아 있습니다. 웹 화면의 알림 지역 저장은 브라우저 설정 초안이며 실제 푸시 활성화가 아닙니다. 대피시설의 현재 개방이나 경로의 재난 안전성을 보장하지 않습니다.

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

macOS는 최초 설치 후 프로젝트 루트에서 `bash 시작.command`로 두 서버를 함께 실행할 수도 있습니다.

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
