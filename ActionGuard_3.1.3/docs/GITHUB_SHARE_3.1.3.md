# GitHub 업로드·웹 배포

1. ZIP을 풀고 ActionGuard_3.1.3 폴더의 내용물을 GitHub 저장소 루트에 올리십시오. backend, frontend, data, Dockerfile, render.yaml이 같은 단계에 있어야 합니다. Git으로 추가하면 .gitignore가 로컬 파일을 제외합니다.
2. 로컬 개발 방법은 루트 README를 따릅니다. API 키는 backend/.env에만 별도로 설정하며 커밋하지 않습니다. .env.example은 실제 키가 없는 예제입니다.
3. Render 배포 시 Dockerfile을 사용합니다. render.yaml은 무료 테스트 서비스 한 개를 정의합니다. API 키는 Render Environment에 입력합니다. 무료 티어를 확인한 경우에만 GEMINI_FREE_TIER_CONFIRMED=true를 설정합니다. 기존 서버를 갱신할 때는 기존 환경 변수를 유지합니다.
4. 웹은 서버 루트 /, 고정 402×874 모바일 미리보기는 /mobile-preview.html, 상태 확인은 /api/health입니다. 웹의 API 주소는 같은 출처 /api입니다.
5. 네이티브 앱 빌드는 frontend/.env.mobile.example을 .env.mobile.local로 복사해 실제 HTTPS 서버 주소를 넣고 npm run mobile:sync를 실행합니다. .env.mobile.local은 커밋하지 않습니다. Xcode에서 본인의 Signing Team을 선택합니다.

Render 무료 서비스는 테스트용이며 자동 푸시는 기본 disabled입니다. 설정만으로 푸시 수신이나 정식 출시 준비가 완료되는 것은 아닙니다. 영구 인증/사용량 제한과 운영 저장소 설계는 별도입니다.
