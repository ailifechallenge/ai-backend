# 아이폰 · 같은 Wi-Fi의 Mac 서버로 테스트

## 준비한 설정
- Xcode: `frontend/ios/App/App.xcodeproj`, Debug, 연결된 아이폰.
- `npm --prefix frontend run mobile:device -- http://MacBook-Pro.local:8004`
- 웹 화면을 앱 안에 포함하고 API만 Mac 서버로 보냅니다. Gemini 키는 앱에 넣지 않습니다.
- `frontend/ios/App/App/Info.Device.plist`는 Debug 전용입니다. 로컬 네트워크 설명과 `NSAllowsLocalNetworking`만 추가합니다. Release의 `Info.plist`에는 이 예외를 넣지 않습니다.
- HTTP는 명시적인 device 모드의 네이티브 앱에서 `.local` 서버에만 허용합니다. 일반/배포 빌드는 HTTPS 정책을 유지합니다.
- 푸시는 이 테스트 빌드에서 비활성화합니다.

## 다시 실행
1. Mac과 아이폰을 같은 Wi-Fi에 연결합니다.
2. 프로젝트 폴더의 `아이폰-테스트-서버.command`를 실행하고 창을 열어 둡니다. 이미 8004번 서버가 실행 중이면 중복 실행할 필요가 없습니다.
3. Xcode에서 연결한 아이폰을 선택하고 Run(⌘R)을 누릅니다.
4. 아이폰에 로컬 네트워크 접근 요청이 나오면 허용합니다. 개발자 모드/컴퓨터 신뢰/개발자 앱 신뢰가 요구되면 아이폰에서 직접 확인합니다.
5. 서버 연결 실패 시 아이폰 Safari에서 `http://MacBook-Pro.local:8004/api/health`가 열리는지 확인합니다. 게스트 Wi-Fi·기기 격리·Mac 방화벽·VPN·Mac 절전 상태를 확인합니다.

Mac이 꺼지거나 서버 창을 닫거나 다른 네트워크로 이동하면 API 기능은 연결되지 않습니다. 앱스토어용 배포 빌드와 실제 APNs 수신 검증은 별도입니다.

## 배포용 자산으로 되돌리기
실제 HTTPS API를 `.env.mobile.local`에 설정하고 기존 `npm --prefix frontend run mobile:sync`로 다시 빌드합니다. device 모드 자산을 App Store에 제출하지 않습니다.
