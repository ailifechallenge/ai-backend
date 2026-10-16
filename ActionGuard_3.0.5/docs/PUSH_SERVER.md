# 일본 지진·쓰나미 푸시 서버 기반

기본값은 `PUSH_MODE=disabled`이다. 현재는 개발 기반이며, **상용 배포·모바일의 인증/보안 저장 연동·실기기 수신 검증은 미완료**이다. 구독 등록 API와 공급자 발송 코드는 구현했지만 현재 앱이 자동으로 이 API에 기기를 등록하지는 않는다. 기기 키를 일반 브라우저 저장소에 넣는 임시 방식을 피하기 위해 계정/보안 저장 연동을 별도 단계로 남겼다.

## 구현
- SQLite 영속 기기 구독, 기기별 관리 키 해시, 10분 일회용 등록 코드, 30일 구독 만료, 해제 시 토큰 삭제.
- 일본 도도부현의 **해당 지역 관측 진도** 기준(기본 JMA 3), 쓰나미 예보구 선택 구독. GPS나 여행 일정은 수집하지 않는다.
- 등록/조회/갱신/해제에 필요한 API. 연결 코드 없는 임의 기기 등록과 타 기기 변경 거부.
- JMA 지진 목록 첫 실행은 기준 상태만 저장해 과거 알림 폭주를 막는다. 이후 15분 이내 발표된 새 버전만 새 알림 후보로 취급한다.
- 과거에 알린 지진은 진도가 기준 아래로 정정되거나 취소되어도 갱신 후보가 된다. 구독 지역을 바꾸면 이전 지역의 알림 이력이 새 구독에 따라오지 않는다.
- 쓰나미는 현재 유효한 경보/주의보와 구독한 해안의 내용 변화, 해제·하향을 처리한다. 다른 해안만 바뀌면 같은 해안 내용을 반복 발송하지 않는다. 새 구독은 현재 경보를 한 번 받을 수 있다.
- 송신 큐의 기기/경보 버전 중복 방지, 대기 중 취소/정정 무효화, 만료, 재시도 간격, 최대 5회 시도. 10분 TTL 안에서만 시도한다.
- 겹쳐 실행된 worker는 DB 실행 임대로 순서를 보호한다. 각 작업도 개별 임대를 사용한다. 공급자 요청은 30초 제한, 공식 스냅샷은 2분이 지나면 추가 발송을 멈춘다.
- 공식 조회 실패 시 기준 상태를 진행시키거나 대기 알림을 발송하지 않는다. 최근 성공 후 실패한 경우에도 상태 API는 정상 실행 중으로 보고하지 않는다.
- Android FCM HTTP v1, iOS APNs HTTP/2 발송 어댑터. 공급자 `accepted`는 기기 도착 확인이 아니다. FCM UNREGISTERED/APNs 무효 토큰은 기기 연결을 제거한다.
- `dry_run`은 큐를 `previewed`로 기록하며 공급자 호출을 하지 않는다. `accepted`/`previewed`를 별도로 기록한다.

## 서버 API

| 요청 | 용도 | 인증 |
|---|---|---|
| GET `/api/push/status` | 모드, 공급자 설정 유무, 마지막 worker 확인 | 공개 상태만 반환 |
| POST `/api/push/devices` | 등록 코드 교환 + 기기 등록 | 일회용 코드 |
| POST `/api/push/devices/{id}/update` | 토큰 회전·지역 변경 | 기기 관리 키 Bearer |
| POST `/api/push/devices/{id}/revoke` | 연결 해제·토큰 삭제 | 기기 관리 키 Bearer |
| GET `/api/push/devices/{id}/status` | 해당 기기의 상태별 작업 수 | 기기 관리 키 Bearer |

등록 본문 필드: `enrollment_code`, `provider` (`apns`/`fcm`), `token`, `preferences`.
`preferences`에는 `prefectures`(예: 도쿄 `13`, 지바 `12`), `tsunami_regions`(JMA 예보구 코드), `minimum_intensity`(`1`~`7`, `5-`/`5+`/`6-`/`6+` 유지)를 넣는다. 적어도 하나의 지역을 선택해야 한다. 해안은 2026-10-15 확인한 공식 66개 코드만 허용한다. 예보구 개편 시 이 코드 집합을 함께 갱신해야 한다.

등록 응답의 `management_key`는 기기 자신에게만 반환한다. 서버에는 해시만 보관한다. 관리 키는 URL/채팅/접속 로그에 넣지 않는다. 검증 실패 응답에도 등록 코드나 기기 토큰 입력값을 포함하지 않는다.

## 운영자 실행

프로젝트 루트에서 가상환경으로 아래 모듈을 실행한다. 비밀값은 버전 관리되지 않는 `backend/.env` 또는 운영 환경의 secret 저장소로 설정한다. `backend/.env.example`에 항목 이름이 있다.

```sh
python -m pip install -r backend/requirements-push.txt
# 처음에는 PUSH_MODE=dry_run, PUSH_DATABASE는 비공개 영속 볼륨 경로로 설정
python -m backend.push.worker --once
# 또는 별도 서비스로 실행: 60초 간격 점검
python -m backend.push.worker
# 신뢰하는 테스트 기기용 코드: 기본 유효기간 10분, 1회 사용
python -m backend.push.worker --enroll fcm
# iOS 테스트 기기는 --enroll apns
```

코드는 운영자가 신뢰하는 기기에 안전하게 전달한다. 공개 등록 코드 발급 API는 없다. 일반 사용자 배포 전에는 계정 인증과 기기 보안 저장, 등록 요청 제한을 갖춘 온보딩으로 대체/통합해야 한다.

DB는 디렉터리 공개/정적 파일 배포 대상 밖에 두고 암호화된 영속 볼륨과 백업 정책을 사용한다. 파일 권한은 0600으로 설정한다. 공급자에 보낼 기기 토큰은 DB에 보관되므로 DB/백업은 비공개 데이터로 취급한다. 만료 구독/코드와 오래된 기록은 활성 worker가 정리한다. HTTP 요청 본문과 Authorization 헤더를 프록시에서 기록하지 않는다.

## 실제 발송 전
- Android: `PUSH_FCM_PROJECT_ID`, `PUSH_FCM_SERVICE_ACCOUNT_FILE`, FCM API 권한, 앱의 google-services.json.
- iOS: `PUSH_APNS_TEAM_ID`, `PUSH_APNS_KEY_ID`, `PUSH_APNS_TOPIC`, `PUSH_APNS_KEY_FILE`. 개발 토큰은 `PUSH_APNS_SANDBOX=true`로 공급자 환경과 일치시킨다.
- 실제 앱 기기의 로그인/구독·키 보안 저장·해제 UI와 서버 API를 연결한다. 현재 앱의 OS 알림 등록만으로 서버 구독이 등록되지는 않는다.
- 인증된 운영 서버에서 공급자/기기 검증 후에만 `PUSH_MODE=live`를 명시한다. 이 변경은 발송을 활성화한다.

본 작업에서는 실제 공급자 계정으로 발송하지 않았다. 테스트는 HTTP 응답 모의와 새로 생성한 테스트 키를 사용했다. 모의 기록을 live 발송 성공으로 바꾸지 않는다. 공급자 네트워크 응답이 유실되면 중복 전송 가능성이 있어 앱의 중복 제거도 유지한다. 영구 실패·만료 작업은 같은 버전으로 자동 재생하지 않는다. 해제 중 이미 공급자에 전달된 요청은 되돌릴 수 없다.

단일 DB worker 기반의 파일럿이다. 많은 사용자에게 배포하기 전에는 처리량·지역 판별·지연·공식 데이터 변경·OS 절전/수신 권한·정정/취소·장애 감시를 실기기로 평가해야 한다. 긴급지진속보/셀 브로드캐스트나 즉시 도착을 보장하는 서비스가 아니다.

## 근거 문서
- https://firebase.google.com/docs/cloud-messaging/send/v1-api
- https://firebase.google.com/docs/cloud-messaging/error-codes
- https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns
- https://developer.apple.com/documentation/usernotifications/handling-notification-responses-from-apns

## 검증 결과

백엔드 전체 223개, 프론트엔드 전체 89개 테스트 및 웹 빌드 통과. 공급자 프로토콜은 모의 HTTP 응답으로, APNs ES256 서명 및 FCM 자격 증명 갱신은 새로 만든 테스트 키와 네트워크 없는 응답으로 검증했다. 실제 기상청 자료를 모의 모드로 조회했고 등록 기기 0대·발송 0건을 확인했다. 로컬 화면에서 모의 모드와 점검 시각을 확인했다. 실제 APNs/FCM 계정과 휴대폰의 수신은 검증하지 않았다.

## 미국·일본 기상경보 확장

2026-10-15부터 지역·재난 유형 구독으로 NWS/JMA 기상경보 변경도 처리합니다. 기존 본문의 일본 지진·쓰나미 한정 설명보다 [지역별 경보 정책](PUSH_REGIONAL_ALERTS.md)의 범위·API·검증 설명을 우선 참고하세요. 브라우저 설정 초안과 실제 기기 서버 구독은 구분되어 있습니다.
