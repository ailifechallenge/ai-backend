# 3.1.3 공유 패키지 검사 · 2026-10-19

- 별도 공유 폴더에서 백엔드: 460 passed, 2 skipped. Starlette/httpx 관련 사용 중단 예고 경고 1개.
- 프런트엔드: 37개 파일, 192개 테스트 통과.
- TypeScript 검사 및 웹 프로덕션 빌드 성공. 500kB 초과 JS 묶음 경고는 남아 있습니다.
- backend API, npm package/lock, iOS MARKETING_VERSION, Android versionName은 3.1.3입니다. iOS/Android 빌드 번호는 313입니다.
- 실제 서버 API 키, 환경 파일, 개인 서명 팀 설정, 기기 데이터베이스, 설치 의존성 및 생성된 빌드 파일을 제외했습니다. 예제 환경 파일은 포함합니다.
- Render Dockerfile/Blueprint와 배포 의존성을 포함합니다. 이번 패키징에서 새 Render 배포나 Docker 이미지 빌드, 네이티브 빌드·설치는 실행하지 않았습니다.
- SHA256SUMS.json은 패키지 파일별 해시입니다. ZIP의 CRC와 내용 해시를 검사했습니다.
- 원본 실행 프로젝트와 운영 서버는 이 패키징으로 변경하지 않았습니다.
