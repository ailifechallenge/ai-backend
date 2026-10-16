# 휴대폰 앱 기반 · 구현 및 남은 작업

2026-10-15. 기존 React UI를 Capacitor 8 iOS·Android 프로젝트에 연결했다.
**설치용 APK/IPA 생성, 실기기 실행, 푸시 발송 서버 구축은 아직 완료하지 않았다.**

## 구현한 것
- `frontend/ios/App/App.xcodeproj`, `frontend/android` 생성, 빌드한 웹 화면을 플랫폼으로 동기화.
- 앱이 열린 채 수신한 알림의 실행 중 목록(최대 30개, 중복 제거), 알림 탭 이동과 앱 종료 상태에서의 링크 진입 처리.
- 알림의 경로·제목을 신뢰하지 않고 종류/공식 파일명/발표 시각만 검증해 내부 경로를 생성한다. 지금은 일본 지진·쓰나미만 지원한다.
- 지난 쓰나미 알림도 현재 상태 화면을 다시 조회한다. 목록에서 사라진 지진은 다른 지진으로 바꾸어 보여주지 않고 제공 기간 만료/미확인을 알린다.
- 앱으로 돌아오면 일본 관측/쓰나미 조회를 갱신한다. 이 처리는 백그라운드 경보 감시가 아니다.
- 브라우저에서는 네이티브 알림 권한을 요청하지 않는다. 앱에서도 자동 요청하지 않고 설정 준비 후 버튼을 눌렀을 때만 요청한다.
- `VITE_PUSH_READY=false`가 기본이다. true는 OS 수신 등록 버튼을 열 뿐, 발송 서버를 활성화하지 않는다. 기기 토큰은 로그·화면·브라우저 저장소에 기록하거나 임의 서버에 보내지 않는다. 서버 구독 API는 구현했으며, 모바일의 계정 인증·관리 키 보안 저장과 자동 등록 연동은 다음 단계다. [푸시 서버 안내](PUSH_SERVER.md)를 참고한다.
- iOS/Android의 `actionguard://alert` 진입 주소 등록, iOS APNs 결과 콜백 추가. iOS 위치 안내 문구와 Android foreground 위치 권한 선언 추가(실제 GPS 권한/정확도는 기기 검증 필요).
- 네이티브 환경에서 상대 `/api`를 로컬 앱 서버로 잘못 요청하지 않도록 별도 HTTPS 서버 주소를 요구한다. FastAPI 기본 CORS에 Capacitor 앱 출처를 추가했다.

## 빌드 담당자
`frontend/.env.mobile.example`을 `.env.mobile.local`로 복사하고 실제 **배포한 HTTPS API 서버** 주소를 `VITE_API_BASE_URL`에 입력한다. 여기에 Gemini/APNs/FCM 비밀키를 넣지 않는다. 서버 URL에는 `/api`를 붙이지 않는다.

```sh
cd frontend
npm ci
npm run mobile:sync
npm run mobile:ios
# 또는 npm run mobile:android
```

`build:mobile`은 실제 서버 주소가 없거나 예시 도메인이면 중단한다. 개발용 `npm run build`로 복사한 초기 플랫폼 자산은 설치 배포용이 아니다. 웹 실행본은 기존 개발 프록시를 사용한다.

임시 앱 식별자: `com.actionguard.travel`. 배포 전 팀이 소유하는 식별자로 확정하고 Android applicationId, iOS Bundle Identifier, Capacitor appId 및 아래 설정을 일치시켜야 한다.

## 실제 푸시까지 필요한 것
1. 배포 API, 사용자/기기 인증, 기기 토큰 등록·폐기·만료 처리, 지역/재난별 동의·구독 설정.
2. 공식 피드의 수집/정정/취소/중복 제거, 대상 지역 판별, 발송 이력·실패 재시도·수신 지연 관측을 담당할 상시 서버 작업.
3. iOS: Apple 개발자 계정·서명·Push Notifications capability·APNs 서버 자격 증명. 실제 APNs capability/entitlements는 배포 팀이 Xcode에서 연결해야 한다.
4. Android: Firebase 앱 등록과 `android/app/google-services.json`, 서버 FCM 자격 증명. 해당 파일·키는 저장소/공유 ZIP에 넣지 않는다.
5. 위 설정 이후에만 `VITE_PUSH_READY=true`로 빌드한다. OS 등록만으로 서버 구독이 등록된 것처럼 표시하지 않는다.
6. 실기기에서 최초 거부/재허용, foreground/background/종료 상태 수신, 오프라인·지연·중복·취소 알림, 콜드 스타트, GPS 권한 및 네트워크 실패를 검증한다.

기존 휴대폰의 셀 브로드캐스트 재난문자/다른 앱 알림을 자동 읽는 구현은 포함하지 않는다. 일반 푸시가 긴급 재난문자 전달을 대체한다고 표현하지 않는다.

## 알림 데이터 계약

APNs custom payload 또는 FCM `data`에 다음 문자열 필드를 넣는다. 아래는 개발용 계약 예시이며 현재 경보가 아니다.

```json
{"kind":"earthquake","event":"20261015141311_20261015141019_VXSE5k_1.json","issued_at":"2026-10-15T05:13:00Z"}
```

쓰나미: kind=`tsunami`, event는 VTSE41 공식 파일명 또는 생략, issued_at은 시간대가 있는 ISO 시각. 탭하면 과거 발표 파일로 이동하지 않고 현재 쓰나미 상태를 연다. 사용자 위치·문자 본문·비밀키는 알림 데이터에 넣지 않는다.

커스텀 링크 형식은 `actionguard://alert?kind=tsunami&issued_at=2026-10-15T05%3A13%3A00Z`이다. 이는 이동용 주소이며 공식 경보를 발령하는 근거가 아니다. 앱 스킴 등록/링크 동작의 기기 검증과, 공개 배포 시 소유 도메인을 이용한 App/Universal Links 전환은 별도로 필요하다.

## 공식 문서
- https://capacitorjs.com/docs/getting-started
- https://capacitorjs.com/docs/apis/push-notifications
- https://capacitorjs.com/docs/apis/app
- https://capacitorjs.com/docs/guides/deep-links

현재 환경은 Xcode 전체가 아닌 Command Line Tools만 선택되어 있어 iOS 네이티브 컴파일·서명은 검증하지 못했다. Android 컴파일·설치도 아직 검증하지 않았다.

## 검증 결과
- 프론트엔드 전체 85개 테스트와 배포용 빌드 성공.
- 백엔드 기존 181개 및 네이티브 CORS 추가 4개 테스트 성공.
- iOS·Android cap sync 성공. 네이티브 컴파일·설치 성공을 뜻하지 않는다.
- 서버 주소 없는 모바일 빌드가 사전 검사에서 중단되는 것 확인.
- 공식 CLI 8.4.3 고정 후 npm audit 0건 확인.
- 브라우저에서 알림 화면을 확인했다. 실제 OS 푸시 수신은 미검증이다.
