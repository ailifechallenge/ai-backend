# ActionGuard 팀 프론트엔드 통합

팀 UI 컴포넌트와 기존 기능을 연결한 React 앱입니다. 실제 진입점은 `src/index.tsx`, 라우팅은 `src/App.tsx`, 기존 기능과 API 연결은 `src/integrated`입니다.

상세 기능은 루트의 `docs/TEAM_INTEGRATION.md`를 확인하세요. `design-reference`는 원래 팀 ZIP 코드의 참고 보관본이며 실행되지 않습니다.

- 설치: `npm ci`
- 실행: 루트의 `시작.command` 또는 백엔드를 실행한 뒤 `npm run dev`
- 검증: `npm test`, `npm run build`
- 기존 기능 스타일 재생성: `npm run sync:styles`

Google Maps API 키는 필요하지 않습니다. Gemini 키는 `backend/.env`에만 설정합니다.
