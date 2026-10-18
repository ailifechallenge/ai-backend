# Gemini 3.1 / 3.5 — 전체 원문과 실제 출력

이 문서는 평가 증거입니다. 원문 속 행동 지침은 과거 발표문이며 현재 상황 안내가 아닙니다.

## US-01 — Beach Hazards Statement

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.ccaa7e68bebf2988f639e7dee8baea63306e9ef8.001.1

### 입력 원문

event: Beach Hazards Statement
headline: Beach Hazards Statement issued October 18 at 11:50AM EDT until October 18 at 8:00PM EDT by NWS Wilmington NC
areaDesc: Coastal Pender; Coastal Horry; Coastal Georgetown
sent: 2026-10-18T11:50:00-04:00
effective: 2026-10-18T11:50:00-04:00
onset: 2026-10-18T11:50:00-04:00
ends: 2026-10-18T20:00:00-04:00
expires: 2026-10-18T20:00:00-04:00
status: Actual
messageType: Update
description: * WHAT...Strong north to south longshore current. There is also
a Moderate Risk of rip currents expected for Pender and
Georgetown Counties.

* WHERE...In North Carolina, Coastal Pender County. In South
Carolina, Coastal Horry County and Coastal Georgetown County.

* WHEN...From 6 AM EDT Sunday through Sunday evening.

* IMPACTS...Longshore currents can sweep swimmers and surfers
into rip currents, piers, jetties, and other hazardous areas.
It may sweep swimmers off their feet, making it difficult to
return to shore.

공식 별도 행동 지침:

Caution should be used when in or near the water. Check with
lifeguards before entering the ocean for possible hazards you may
be swept into.

### gemini-3.1-flash-lite

응답 2.921초 · HTTP 200

전체 번역:

해변 위험 경보(Beach Hazards Statement)가 2026년 10월 18일 오전 11시 50분 EDT에 발표되어 2026년 10월 18일 오후 8시 00분 EDT까지 유효합니다. NWS Wilmington NC에서 발행하였습니다. 무엇을... 북쪽에서 남쪽으로 흐르는 강한 연안류가 예상됩니다. 또한 펜더(Pender) 카운티와 조지타운(Georgetown) 카운티에는 이안류 발생 위험이 보통 수준으로 예상됩니다. 어디서... 노스캐롤라이나주의 해안 펜더(Coastal Pender) 카운티, 사우스캐롤라이나주의 해안 호리(Coastal Horry) 카운티 및 해안 조지타운(Coastal Georgetown) 카운티입니다. 언제... 일요일 오전 6시 EDT부터 일요일 저녁까지입니다. 영향... 연안류는 수영하는 사람과 서퍼를 이안류, 부두, 방파제 및 기타 위험한 구역으로 휩쓸어 갈 수 있습니다. 또한 수영하는 사람을 넘어뜨려 해안으로 돌아오기 어렵게 만들 수 있습니다.

설명: 연안류와 이안류는 수영하는 사람을 해안에서 멀어지게 하거나 위험한 구조물 쪽으로 휩쓸어 갈 수 있는 강한 해류입니다.

요약:

- 일시: 2026년 10월 18일 오전 11시 50분 ~ 오후 8시 00분 EDT
- 지역: 해안 펜더(Coastal Pender), 해안 호리(Coastal Horry), 해안 조지타운(Coastal Georgetown)
- 조치: 물가에 접근 시 주의하고 입수 전 안전 요원에게 위험 요소를 확인하십시오.

별도 행동 지침 번역: 물 안이나 근처에 있을 때는 주의를 기울여야 합니다. 바다에 들어가기 전에 휩쓸려 갈 수 있는 위험 요소가 있는지 안전 요원에게 확인하십시오.

용어: [{"term": "연안류 (Longshore current)", "meaning": "해안선과 평행하게 흐르는 해류로, 수영하는 사람을 의도치 않은 방향으로 밀어낼 수 있습니다."}, {"term": "이안류 (Rip current)", "meaning": "해안에서 바다 쪽으로 빠르게 빠져나가는 좁고 강한 해류입니다."}]

### gemini-3.5-flash-lite

응답 2.376초 · HTTP 200

전체 번역:

해변 위험 경보(Beach Hazards Statement)가 미국 국립기상청(NWS) 윌밍턴 NC(Wilmington NC)에 의해 2026년 10월 18 오전 11시 50분 EDT에 발표되었으며 2026년 10월 18일 오후 8시 00분 EDT까지 유효합니다. 주요 내용... 강력한 남북 방향의 연안류(longshore current). 펜더 카운티(Pender County)와 조지타운 카운티(Georgetown County)에는 이안류(rip currents) 발생 위험이 보통(Moderate) 수준으로 예상됩니다. 지역... 노스캐롤라이나주 연안 펜더 카운티(Coastal Pender County), 사우스캐롤라이나주 연안 호리 카운티(Coastal Horry County) 및 연안 조지타운 카운티(Coastal Georgetown County). 기간... 일요일 오전 6시 EDT부터 일요일 저녁까지. 영향... 연안류는 수영객과 서퍼를 이안류, 부두, 방파제 및 기타 위험 구역으로 휩쓸어 갈 수 있습니다. 수영객을 발 디딜 틈 없이 휩쓸어가 해변으로 돌아오기 어렵게 만들 수 있습니다.

설명: 이안류와 연안류로 인해 해수욕 시 휩쓸릴 위험이 있으므로 주의하십시오.

요약:

- 2026년 10월 18일 오전 11시 50분 EDT 발표 (유효기간: 2026년 10월 18일 오후 8시 00분 EDT까지)
- 대상 지역: 연안 펜더(Coastal Pender), 연안 호리(Coastal Horry), 연안 조지타운(Coastal Georgetown)
- 강한 연안류와 이안류 위험으로 인해 물가에서 주의 필요

별도 행동 지침 번역: 물 안이나 근처에 있을 때는 주의를 기울이십시오. 바다에 들어가기 전에 휩쓸려 들어갈 수 있는 위험 요소가 있는지 구조대원에게 확인하십시오.

용어: [{"term": "이안류", "meaning": "해안으로 밀려오는 파도와 반대 방향으로 해안에서 바다쪽으로 강하게 빠져나가는 물의 흐름입니다."}, {"term": "연안류", "meaning": "해안선을 따라 평행하게 흐르는 해류로 수영객을 위험한 구조물 쪽으로 밀어낼 수 있습니다."}]

## US-02 — Coastal Flood Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.0fa2b1cf35c0ffa63c715482f0e3077ecdd92f31.006.1

### 입력 원문

event: Coastal Flood Advisory
headline: Coastal Flood Advisory issued October 18 at 11:02AM EDT until October 19 at 5:00PM EDT by NWS Newport/Morehead City NC
areaDesc: Pamlico; Southern Craven
sent: 2026-10-18T11:02:00-04:00
effective: 2026-10-18T11:02:00-04:00
onset: 2026-10-18T11:02:00-04:00
ends: 2026-10-19T17:00:00-04:00
expires: 2026-10-18T23:15:00-04:00
status: Actual
messageType: Update
description: * WHAT...1 to 3 feet of inundation above ground level expected
in low-lying areas near shorelines and tidal waterways.

* WHERE...Areas along the Pamlico Sound, Trent, Bay and lower
Neuse Rivers, and adjacent tidal creeks.

* WHEN...From 8 PM this evening to 5 PM EDT Monday.

* IMPACTS...Flooding of lots, parks, and roads with only
isolated road closures expected.

공식 별도 행동 지침:

If travel is required, allow extra time as some roads may be
closed. Do not drive around barricades or through water of
unknown depth. Take the necessary actions to protect flood-prone
property.

### gemini-3.1-flash-lite

응답 3.001초 · HTTP 200

전체 번역:

해안 홍수 주의보(Coastal Flood Advisory)가 2026년 10월 18일 오전 11시 02분 EDT에 미국 국립기상청(NWS) 뉴포트/모어헤드 시티(Newport/Morehead City) 지부에 의해 발표되었습니다. 적용 지역은 팜리코(Pamlico) 및 남부 크레이븐(Southern Craven)입니다. 발효 시간은 2026년 10월 18일 오전 11시 02분 EDT이며, 종료 시간은 2026년 10월 19일 오후 5시 00분 EDT입니다. 메시지 만료 시간은 2026년 10월 18일 오후 11시 15분 EDT입니다. 상세 내용: * 예상 영향... 해안선 및 조석 수로 인근 저지대에서 지면 위로 1~3피트(약 0.3~0.9미터)의 침수가 예상됩니다. * 대상 지역... 팜리코 사운드(Pamlico Sound), 트렌트 강(Trent River), 베이 강(Bay River), 하류 뉴스 강(Neuse River)을 따라 위치한 지역 및 인접한 조석 하천. * 시기... 오늘 저녁 오후 8시부터 월요일 오후 5시 EDT까지. * 영향... 부지, 공원, 도로의 침수가 예상되며 일부 도로가 고립적으로 폐쇄될 수 있습니다.

설명: 해안 홍수 주의보는 해안가 저지대에서 조수 상승으로 인한 침수 피해가 발생할 가능성이 있을 때 발령됩니다.

요약:

- 발효 기간: 10월 18일 오후 8시 ~ 10월 19일 오후 5시 EDT
- 대상 지역: 팜리코(Pamlico) 및 남부 크레이븐(Southern Craven) 일대
- 조치 사항: 침수 피해 대비 및 도로 통제 시 우회 경로 확인

별도 행동 지침 번역: 이동이 필요한 경우 일부 도로가 폐쇄될 수 있으므로 여유 시간을 가지십시오. 바리케이드를 우회하거나 수심을 알 수 없는 물속으로 운전하지 마십시오. 홍수 피해가 발생하기 쉬운 재산을 보호하기 위한 필요한 조치를 취하십시오.

용어: [{"term": "Coastal Flood Advisory", "meaning": "해안 홍수 주의보: 해안가 저지대에 조수로 인한 침수가 예상될 때 발령되는 기상 정보입니다."}, {"term": "Inundation", "meaning": "침수: 물이 범람하여 지면이나 시설물이 물에 잠기는 현상을 의미합니다."}, {"term": "Tidal waterways", "meaning": "조석 수로: 조수 간만의 차에 따라 수위가 변하는 강이나 하천을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.874초 · HTTP 200

전체 번역:

사건: 연안 홍수 주의보. 주요 제목: 2026년 10월 18일 오전 11시 02분 EDT에 NWS 뉴포트/모어헤드 시티 NC(Newport/Morehead City NC)에서 발령한 연안 홍수 주의보가 2026년 10월 19일 오후 5시까지 지속됩니다. 지역: 팜리코(Pamlico); 서던 크레이븐(Southern Craven). 발송 시간: 2026년 10월 18일 오전 11시 02분 EDT. 효력 발생: 2026년 10월 18일 오전 11시 02분 EDT. 시작: 2026년 10월 18일 오전 11시 02분 EDT. 종료: 2026년 10월 19일 오후 5시 00분 EDT. 만료: 2026년 10월 18일 오후 11시 15분 EDT. 상태: 실제. 메시지 유형: 업데이트. 설명: * 무엇을... 해안가 및 조수 수로 근처의 저지대에서 지표면 위로 1~3피트의 침수가 예상됩니다. * 어디에서... 팜리코 사운드(Pamlico Sound), 트렌트(Trent), 베이(Bay), 하류 뉴즈 강(Neuse Rivers) 주변 지역 및 인접한 조수 소교류. * 언제... 오늘 저녁 오후 8시부터 월요일 오후 5시 EDT까지. * 영향... 주차장, 공원, 도로의 침수가 발생하며 일부 고립된 도로 폐쇄가 예상됩니다.

설명: 해안가 저지대와 조수 수로 인근에 침수 위험이 발생할 수 있습니다.

요약:

- 2026년 10월 18일 오후 8시부터 2026년 10월 19일 오후 5시 EDT까지 팜리코(Pamlico) 및 서던 크레이븐(Southern Craven) 지역에 연안 홍수 주의보가 발령되었습니다.
- 해안가 및 조수 수로 근처 저지대에 1~3피트의 침수가 예상됩니다.
- 이동 시 여유 시간을 갖고 침수된 도로와 바리케이드 주변을 운전하지 마십시오.

별도 행동 지침 번역: 이동이 필요한 경우 일부 도로가 폐쇄될 수 있으므로 여유 시간을 가지십시오. 바리케이드 주변이나 수심을 알 수 없는 물속으로 운전하여 들어가지 마십시오. 홍수 취약 재산을 보호하기 위해 필요한 조치를 취하십시오.

용어: [{"term": "Coastal Flood Advisory", "meaning": "해안가 저지대의 침수 주의를 당부하는 기상 특보입니다."}, {"term": "EDT", "meaning": "미국 동부 일광 절약 시간대입니다."}]

## US-03 — Coastal Flood Warning

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.0fa2b1cf35c0ffa63c715482f0e3077ecdd92f31.002.1

### 입력 원문

event: Coastal Flood Warning
headline: Coastal Flood Warning issued October 18 at 11:02AM EDT until October 20 at 5:00PM EDT by NWS Newport/Morehead City NC
areaDesc: Ocracoke Island
sent: 2026-10-18T11:02:00-04:00
effective: 2026-10-18T11:02:00-04:00
onset: 2026-10-18T11:02:00-04:00
ends: 2026-10-20T17:00:00-04:00
expires: 2026-10-18T23:15:00-04:00
status: Actual
messageType: Update
description: * WHAT...For the Coastal Flood Warning, 2 to 4 feet of inundation
above ground level in low-lying areas near shorelines and tidal
waterways. For the High Surf Advisory, large breaking waves of
8 to 10 feet expected in the surf zone. For the Beach Hazards
Statement, dangerous rip currents, large breaking waves
expected, and strong longshore currents in the surf zone.

* WHERE...Ocracoke Island.

* WHEN...For the Coastal Flood Warning, until 5 PM EDT Tuesday.
For the High Surf Advisory, from midnight tonight to 8 PM EDT
Monday. For the Beach Hazards Statement, through Sunday evening.

* IMPACTS...Up to 2 to 4 feet of inundation above ground level
is expected in some areas near shorelines and tidal waterways
resulting in an elevated threat of property damage. Flooding
will extend inland from the waterfront threatening some homes
and businesses. Numerous road closures and flooding of
vehicles will be possible. Vulnerable portions of NC-12 may be
inundated, especially around high tide. There is a possibility
of being stranded on Ocracoke for multiple days. This could be
life threatening if you have an emergency. Dangerous swimming
and surfing conditions and localized beach erosion. Rip
currents can sweep even the best swimmers away from shore into
deeper water. Dangerous shore break can throw a swimmer or
surfer head first into the bottom causing neck and back
injuries. Strong longshore currents will create dangerous
swimming conditions.

* ADDITIONAL DETAILS...This has the potential to be a long
duration event bringing more significant ocean overwash
impacts to vulnerable oceanside areas through multiple high
tide cycles into the work week. Minor soundside water level
rises will also be possible.

공식 별도 행동 지침:

Take the necessary actions to protect flood-prone property. If
travel is required, do not drive around barricades or through
water of unknown depth.

Swimmers should remain out of the water due to dangerous surf
conditions.

### gemini-3.1-flash-lite

응답 3.636초 · HTTP 200

전체 번역:

해안 홍수 경보(Coastal Flood Warning)가 2026년 10월 18일 오전 11시 02분 EDT에 발표되어 2026년 10월 20일 오후 5시 00분 EDT까지 유효합니다. 발표 기관: NWS Newport/Morehead City NC. 대상 지역: 오크라코크 섬(Ocracoke Island). 주요 내용: 해안 홍수 경보로 인해 해안선 및 조수 수로 인근 저지대에 지면 위 2~4피트의 침수가 예상됩니다. 높은 파도 주의보(High Surf Advisory)로 인해 서프 존에 8~10피트의 큰 파도가 예상됩니다. 해변 위험 경보(Beach Hazards Statement)로 인해 위험한 이안류, 큰 파도, 강한 연안류가 예상됩니다. 영향: 해안선 인근 일부 지역에 2~4피트의 침수가 발생하여 재산 피해 위험이 높습니다. 홍수가 내륙으로 확장되어 주택과 상업 시설을 위협할 수 있으며, 도로 폐쇄 및 차량 침수가 발생할 수 있습니다. NC-12 도로의 취약 구간이 침수될 수 있으며, 오크라코크 섬에 며칠간 고립될 가능성이 있습니다. 이는 비상 상황 발생 시 생명을 위협할 수 있습니다. 또한 위험한 수영 및 서핑 환경과 해변 침식이 예상됩니다. 추가 정보: 이번 사태는 장기간 지속될 가능성이 있으며, 여러 번의 만조 주기를 거치며 주 초까지 취약한 해안 지역에 상당한 해수 범람 피해를 줄 수 있습니다.

설명: 해안 홍수는 만조와 강한 파도로 인해 바닷물이 육지로 넘쳐 들어와 저지대 도로와 건물을 침수시키는 현상입니다.

요약:

- 일시: 10월 18일 오전 11시 02분 ~ 10월 20일 오후 5시
- 지역: 오크라코크 섬(Ocracoke Island)
- 조치: 홍수 대비 재산 보호 및 침수 도로 진입 금지, 위험한 파도로 인한 입수 금지

별도 행동 지침 번역: 홍수 취약 지역의 재산을 보호하기 위한 필요한 조치를 취하십시오. 이동이 필요한 경우, 바리케이드를 우회하거나 수심을 알 수 없는 물속으로 운전하지 마십시오. 위험한 파도 상황으로 인해 수영하는 사람은 물 밖으로 나와야 합니다.

용어: [{"term": "이안류(Rip Current)", "meaning": "해안에서 바다 쪽으로 빠르게 흐르는 좁고 강한 물살로, 수영하는 사람을 먼바다로 휩쓸어 갈 수 있습니다."}, {"term": "연안류(Longshore Current)", "meaning": "해안선과 평행하게 흐르는 물살로, 수영하는 사람의 위치를 이동시켜 위험에 빠뜨릴 수 있습니다."}, {"term": "해수 범람(Ocean Overwash)", "meaning": "높은 파도가 해안 방어 시설을 넘어 육지로 바닷물이 쏟아져 들어오는 현상입니다."}]

### gemini-3.5-flash-lite

응답 3.968초 · HTTP 200

전체 번역:

EVENT: Coastal Flood Warning
HEADLINE: 2026년 10월 18일 오전 11:02 EDT에 미국 국립기상청(NWS Newport/Morehead City NC)에서 발표한 해안 홍수 경보(Coastal Flood Warning)가 2026년 10월 20일 오후 5:00 EDT까지 유지됩니다.
AREA: 오크라코크 아일랜드(Ocracoke Island)
발송 시각: 2026년 10월 18일 오전 11:02 EDT
발효 시각: 2026년 10월 18일 오전 11:02 EDT
시작 시각: 2026년 10월 18일 오전 11:02 EDT
종료 시각: 2026년 10월 20일 오후 5:00 EDT
만료 시각: 2026년 10월 18일 오후 11:15 EDT
상태: 실제 상황 (Actual)
메시지 유형: 업데이트 (Update)

상세 내용:
* 무엇을 의미하는가... 해안 홍수 경보의 경우 해안선 및 조석 수로 인근 저지대에 지표면 위 2~4피트의 침수가 발생합니다. 풍랑 주의보(High Surf Advisory)의 경우 서프 구역에서 8~10피트의 높은 파도가 예상됩니다. 해변 위험보(Beach Hazards Statement)의 경우 서프 구역에서 위험한 이안류, 높은 파도, 강한 연안류가 예상됩니다.
* 어디서... 오크라코크 아일랜드(Ocracoke Island).
* 언제... 해안 홍수 경보의 경우 화요일 오후 5시 EDT까지입니다. 풍랑 주의보의 경우 오늘 밤 자정부터 월요일 오후 8시 EDT까지입니다. 해변 위험보의 경우 일요일 저녁까지입니다.
* 영향... 해안선 및 조석 수로 인근 일부 지역에서 지표면 위 최대 2~4피트의 침수가 예상되어 재산 피해 위험이 높아집니다. 홍수가 수변에서 내륙으로 확대되어 일부 주택과 상업 시설을 위협합니다. 수많은 도로가 통제되고 차량 침수가 발생할 수 있습니다. 특히 만조 무렵에는 NC-12의 취약한 구간이 침수될 수 있습니다. 오크라코크에 수일 동안 고립될 가능성이 있습니다. 비상 상황이 발생할 경우 생명이 위협받을 수 있습니다. 위험한 수영 및 서핑 여건과 국지적인 해변 침식이 발생합니다. 이안류는 최고의 수영 선수조차 해변에서 깊은 물로 휩쓸어 갈 수 있습니다. 위험한 해안 파도는 수영 선수나 서퍼를 머리부터 바닥으로 내리꽂아 목과 등 부상을 유발할 수 있습니다. 강한 연안류는 위험한 수영 여건을 조성합니다.
* 추가 세부 사항... 이번 상황은 주중까지 여러 차례의 만조 주기를 거치며 취약한 해안가 지역에 더 심각한 해수 범람 영향을 미치는 장기 지속 이벤트가 될 잠재력이 있습니다. 사운드사이드(soundside) 수위의 소폭 상승도 발생할 수 있습니다.

설명: 해안가 저지대 침수와 위험한 파도 및 이안류가 발생할 수 있는 재난 상황입니다.

요약:

- 2026년 10월 18일 오전 11:02 EDT, 오크라코크 아일랜드(Ocracoke Island)에 해안 홍수 경보 발표 당시 지속 상태
- 2026년 10월 20일 오후 5:00 EDT까지 해안선 및 저지대 침수와 위험한 파도 발생 예상
- 홍수 취약 지역 재산 보호 조치를 취하고 차단막이나 미확인 깊이의 물을 통과하여 운전하지 마십시오

별도 행동 지침 번역: 홍수에 취약한 재산을 보호하기 위해 필요한 조치를 취하십시오. 이동이 필요한 경우 바리케이드를 우회하거나 깊이를 알 수 없는 물을 통과해 운전하지 마십시오. 위험한 파도 여건으로 인해 수영 선수들은 물에 들어가지 않아야 합니다.

용어: [{"term": "Coastal Flood Warning", "meaning": "해안 지역에 심각한 홍수가 발생하여 생명과 재산에 위험을 초래할 때 발령하는 경보입니다."}, {"term": "Rip Currents", "meaning": "해안으로 부서진 파도가 좁은 채널을 통해 다시 바다로 빠르게 빠져나가는 매우 위험한 물살입니다."}, {"term": "High Surf Advisory", "meaning": "해안가에 위험하고 높은 파도가 쳐서 수영과 해변 활동이 위험할 때 발령하는 주의보입니다."}]

## US-04 — Coastal Flood Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.f52645bc1c9b03513c4cdc7e133cdb9ec038ade9.007.1

### 입력 원문

event: Coastal Flood Watch
headline: Coastal Flood Watch issued October 18 at 5:36AM EDT until October 21 at 10:00AM EDT by NWS Wakefield VA
areaDesc: Surry; James City
sent: 2026-10-18T05:36:00-04:00
effective: 2026-10-18T05:36:00-04:00
onset: 2026-10-19T16:00:00-04:00
ends: 2026-10-21T10:00:00-04:00
expires: 2026-10-18T13:45:00-04:00
status: Actual
messageType: Update
description: * WHAT...One to two feet of inundation above ground level
possible in low- lying areas near shorelines and tidal
waterways.

* WHERE...Surry and James City Counties.

* WHEN...From Monday afternoon through Wednesday morning.

* IMPACTS...Numerous roads may be closed. Low lying property
including homes, businesses, and some critical infrastructure
may be inundated. Some shoreline erosion may occur.

공식 별도 행동 지침:

If travel is required, allow extra time as some roads may be
closed. Do not drive around barricades or through water of
unknown depth. Take the necessary actions to protect flood-prone
property.

### gemini-3.1-flash-lite

응답 2.518초 · HTTP 200

전체 번역:

해안 홍수 주의보(Coastal Flood Watch)가 2026년 10월 18일 오전 5시 36분 EDT에 NWS Wakefield VA에 의해 발표되었습니다. 유효 기간은 2026년 10월 18일 오전 5시 36분 EDT부터 2026년 10월 18일 오후 1시 45분 EDT까지입니다. 발생 시각은 2026년 10월 19일 오후 4시 00분 EDT이며 종료 시각은 2026년 10월 21일 오전 10시 00분 EDT입니다. 무엇을... 해안선 및 조수 수로 인근 저지대에서 지면 위로 1~2피트의 침수가 발생할 수 있습니다. 어디서... 서리(Surry) 및 제임스 시티(James City) 카운티. 언제... 월요일 오후부터 수요일 오전까지. 영향... 다수의 도로가 폐쇄될 수 있습니다. 주택, 상업 시설 및 일부 주요 기반 시설을 포함한 저지대 부동산이 침수될 수 있습니다. 일부 해안선 침식이 발생할 수 있습니다.

설명: 해안 홍수 주의보는 조수나 폭풍 해일로 인해 해안가 저지대에 침수 피해가 발생할 가능성이 높을 때 발령됩니다.

요약:

- 일시: 2026년 10월 19일 오후 4시부터 10월 21일 오전 10시까지
- 지역: 서리(Surry) 및 제임스 시티(James City) 카운티
- 조치: 침수 대비 및 도로 통제 주의

별도 행동 지침 번역: 이동이 필요한 경우 도로가 폐쇄될 수 있으므로 여유 시간을 가지십시오. 바리케이드 주변이나 깊이를 알 수 없는 물속으로 운전하지 마십시오. 홍수 피해가 발생하기 쉬운 재산을 보호하기 위해 필요한 조치를 취하십시오.

용어: [{"term": "Coastal Flood Watch", "meaning": "해안 홍수 주의보로, 해안가 저지대에 홍수 피해가 발생할 가능성이 있어 대비가 필요함을 의미합니다."}, {"term": "Inundation", "meaning": "물에 잠기는 침수 현상을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.835초 · HTTP 200

전체 번역:

EVENT: 연안 홍수 주의보(Coastal Flood Watch)\nHEADLINE: 미국 국립기상청 웨이크필드 버지니아(NWS Wakefield VA)에서 2026년 10월 18일 오전 5:36 EDT에 발령한 연안 홍수 주의보가 2026년 10월 21일 오전 10:00 EDT까지 유지됩니다.\nAREA_DESC: 서리(Surry); 제임스 시티(James City)\nSENT: 2026년 10월 18일 오전 5시 36분 (UTC-04:00)\nEFFECTIVE: 2026년 10월 18일 오전 5시 36분 (UTC-04:00)\nONSET: 2026년 10월 19일 오후 4시 00분 (UTC-04:00)\nENDS: 2026년 10월 21일 오전 10시 00분 (UTC-04:00)\nEXPIRES: 2026년 10월 18일 오후 1시 45분 (UTC-04:00)\nSTATUS: 실제 상황(Actual)\nMESSAGE_TYPE: 업데이트(Update)\nDESCRIPTION:\n* 주요 내용(WHAT)... 해안가 및 조석 수로 인근 저지대에서 지면 위로 1~2피트(약 30~60cm)의 침수가 발생할 수 있습니다.\n* 지역(WHERE)... 서리(Surry) 및 제임스 시티(James City) 카운티.\n* 시기(WHEN)... 월요일 오후부터 수요일 오전까지.\n* 영향(IMPACT)... 수많은 도로가 통제될 수 있습니다. 주택, 상업 시설, 일부 주요 기반 시설을 포함한 저지대의 재산이 침수될 수 있습니다. 일부 해안선 침식이 발생할 수 있습니다.

설명: 해안가 저지대에 침수 위험이 발생하여 도로 통제 및 재산 피해가 우려되는 상황입니다.

요약:

- 장소: 서리(Surry) 및 제임스 시티(James City) 카운티
- 시간: 2026년 10월 19일 오후 4:00 EDT부터 2026년 10월 21일 오전 10:00 EDT까지
- 행동: 저지대 침수 및 도로 통제에 대비하여 홍수 취약 재산을 보호하고 안전하게 이동하십시오.

별도 행동 지침 번역: 이동이 필요한 경우 일부 도로가 통제될 수 있으므로 여유 시간을 두고 이동하십시오. 바리케이드를 우회하거나 수심을 알 수 없는 물속으로 운전하여 진입하지 마십시오. 홍수에 취약한 재산을 보호하기 위해 필요한 조치를 취하십시오.

용어: [{"term": "Coastal Flood Watch", "meaning": "연안 지역에 홍수가 발생할 가능성이 높음을 알리는 주의보입니다."}, {"term": "Inundation", "meaning": "물에 잠기는 침수 현상을 의미합니다."}]

## US-05 — Flood Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.de854b7db0cf1bfa6a17a66f2d90d2af1ceb89a1.001.1

### 입력 원문

event: Flood Advisory
headline: Flood Advisory issued October 18 at 8:07AM CDT until October 21 at 7:00AM CDT by NWS Norman OK
areaDesc: Wichita, TX; Wilbarger, TX
sent: 2026-10-18T08:07:00-05:00
effective: 2026-10-18T08:07:00-05:00
onset: 2026-10-18T08:07:00-05:00
ends: 2026-10-21T07:00:00-05:00
expires: 2026-10-18T20:15:00-05:00
status: Actual
messageType: Alert
description: ...The National Weather Service in Norman has issued a Flood Advisory
for the following rivers in Texas...

Beaver Creek near Electra affecting Wichita and Wilbarger Counties.

For the Beaver Creek (NW TX)...including Electra...elevated river
levels are forecast.

Additional information is available at www.weather.gov.

The next statement will be issued this evening at 815 PM CDT.

* WHAT...Flooding caused by excessive rainfall is expected.

* WHERE...Beaver Creek near Electra.

* WHEN...From this morning to Wednesday morning.

* IMPACTS...At 23.0 feet, Shallow and short duration flooding of
lowlands along and near the creek may occur in southern Wilbarger
County and southwestern Wichita County.

* ADDITIONAL DETAILS...
- At 7:00 AM CDT Sunday the stage was 12.7 feet.
- Bankfull stage is 24.0 feet.
- Forecast...The river is expected to rise to a crest of 23.0 feet
Tuesday morning.
- Action stage is 22.0 feet.
- Flood stage is 24.0 feet.
- http://www.weather.gov/safety/flood

### gemini-3.1-flash-lite

응답 3.345초 · HTTP 200

전체 번역:

미국 기상청(NWS) 노먼(Norman, OK) 지국은 2026년 10월 18일 오전 8시 07분 CDT에 홍수 주의보를 발령했습니다. 이 주의보는 2026년 10월 21일 오전 7시 00분 CDT까지 유효합니다. 텍사스주 위치타(Wichita) 및 윌바거(Wilbarger) 카운티에 영향을 미치는 일렉트라(Electra) 인근 비버 크릭(Beaver Creek)에 홍수 주의보가 발령되었습니다. 비버 크릭(텍사스 북서부)의 일렉트라를 포함한 지역에서 하천 수위 상승이 예상됩니다. 추가 정보는 www.weather.gov에서 확인하십시오. 다음 발표는 오늘 저녁 8시 15분 CDT에 있을 예정입니다. 무엇이 발생합니까: 과도한 강우로 인한 홍수가 예상됩니다. 어디에서 발생합니까: 일렉트라 인근 비버 크릭. 언제 발생합니까: 오늘 아침부터 수요일 아침까지. 영향: 수위가 23.0피트(약 7.0미터)에 도달하면 윌바거 카운티 남부와 위치타 카운티 남서부의 하천 인근 저지대에서 짧은 시간 동안 얕은 홍수가 발생할 수 있습니다. 추가 세부 사항: 10월 18일 일요일 오전 7시 00분 CDT 기준 수위는 12.7피트(약 3.9미터)였습니다. 하천 가득 참 수위(Bankfull stage)는 24.0피트(약 7.3미터)입니다. 예보에 따르면 하천 수위는 화요일 아침 23.0피트(약 7.0미터)까지 상승할 것으로 예상됩니다. 주의 단계(Action stage)는 22.0피트(약 6.7미터)이며, 홍수 단계(Flood stage)는 24.0피트(약 7.3미터)입니다. 자세한 안전 정보는 http://www.weather.gov/safety/flood를 참조하십시오.

설명: 과도한 강우로 인해 하천 수위가 상승하여 인근 저지대에 침수 피해가 발생할 가능성이 있습니다.

요약:

- 일시: 2026년 10월 18일 오전 8시 07분 CDT ~ 10월 21일 오전 7시 00분 CDT
- 장소: 텍사스주 위치타(Wichita) 및 윌바거(Wilbarger) 카운티 비버 크릭(Beaver Creek)
- 행동: 하천 인근 저지대 침수 가능성에 대비하고 최신 기상 정보를 확인하십시오.

별도 행동 지침 번역: None

용어: [{"term": "홍수 주의보(Flood Advisory)", "meaning": "홍수가 발생할 가능성이 있거나 이미 발생하여 주의가 필요한 상태를 의미합니다."}, {"term": "주의 단계(Action stage)", "meaning": "하천 수위가 상승하여 홍수 예방 및 대응을 위한 준비가 필요한 수위입니다."}, {"term": "홍수 단계(Flood stage)", "meaning": "하천 수위가 범람하여 주변 지역에 피해를 줄 수 있는 공식적인 기준 수위입니다."}]

### gemini-3.5-flash-lite

응답 3.06초 · HTTP 200

전체 번역:

홍수 주의보(Flood Advisory)가 노먼(Norman) OK 국립기상청에 의해 2026년 10월 18 오전 8:07 CDT에 발표되었으며 2026년 10월 21일 오전 7:00 CDT까지 유지됩니다. ...텍사스(Texas)의 다음 하천에 대하여 노먼 국립기상청이 홍수 주의보를 발령했습니다... 일렉트라(Electra) 인근 비버 크릭(Beaver Creek)이 위치타(Wichita) 카운티와 윌바거(Wilbarger) 카운티에 영향을 미칩니다. 비버 크릭(NW TX)(Beaver Creek (NW TX))... 일렉트라(Electra) 포함... 하천 수위 상승이 예보되어 있습니다. 추가 정보는 www.weather.gov에서 확인하실 수 있습니다. 다음 발표는 오늘 저녁 오후 8시 15분 CDT에 있을 예정입니다. * 내용... 과도한 강수로 인한 홍수가 예상됩니다. * 지역... 일렉트라(Electra) 인근 비버 크릭(Beaver Creek). * 시기... 오늘 아침부터 수요일 아침까지. * 영향... 23.0피트에서 윌바거(Wilbarger) 카운티 남부 및 위치타(Wichita) 카운티 서남부의 크릭(Creek) 주변 저지대에 얕고 짧은 지속 시간의 홍수가 발생할 수 있습니다. * 추가 세부 사항... - 일요일 오전 7:00 CDT 기준 수위는 12.7피트였습니다. - 제방 만수위는 24.0피트입니다. - 예보... 하천은 화요일 아침 23.0피트의 최고 수위에 이를 것으로 예상됩니다. - 조치 단계는 22.0피트입니다. - 홍수 단계는 24.0피트입니다. - http://www.weather.gov/safety/flood

설명: 지속적인 강수로 인해 하천 수위가 상승하여 저지대에 홍수가 발생할 수 있는 위험 상황입니다.

요약:

- 2026년 10월 18일 오전 8:07 CDT부터 2026년 10월 21일 오전 7:00 CDT까지 위치타(Wichita), 윌바거(Wilbarger), 텍사스(Texas) 지역에 홍수 주의보가 발령되었습니다.
- 일렉트라(Electra) 인근 비버 크릭(Beaver Creek) 주변 저지대에서 홍수가 발생할 수 있습니다.
- 최신 기상 정보를 확인하고 하천 주변 저지대에 접근을 자제하십시오.

별도 행동 지침 번역: None

용어: [{"term": "Flood Advisory", "meaning": "주민 안전에 심각한 위협까지는 아니지만 재산 피해를 유발할 수 있는 홍수 위험이 있을 때 발령하는 주의보입니다."}, {"term": "Flood stage", "meaning": "하천 수위가 제방을 넘거나 주변 지역에 물이 차오르기 시작하는 기준 높이입니다."}]

## US-06 — Flood Warning

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.e267454960d05028ffb17d918dbfe239270f59aa.001.1

### 입력 원문

event: Flood Warning
headline: Flood Warning issued October 18 at 9:11AM EDT by NWS Melbourne FL
areaDesc: Lake, FL; Volusia, FL
sent: 2026-10-18T09:11:00-04:00
effective: 2026-10-18T09:11:00-04:00
onset: 2026-10-18T09:11:00-04:00
expires: 2026-10-18T23:00:00-04:00
status: Actual
messageType: Update
description: ...The Flood Warning continues for the following rivers in Florida...

St Johns River Near Astor affecting Volusia and Lake Counties.

.The St Johns River at Astor is forecast to remain in Minor Flood
Stage today, but strong northeasterly winds will slow river flow
leading to a quicker rise in levels tonight. The river is forecast to
reach Moderate Flood Stage early Monday, and remain in Moderate Flood
through the end of this week.

For the St. Johns River...including Astor...Moderate flooding is
forecast.

* WHAT...Minor flooding is occurring and moderate flooding is
forecast.

* WHERE...St Johns River near Astor.

* WHEN...Until further notice.

* IMPACTS...At 3.5 feet, Canals have overflowed into yards. Homes on
or near Wildhog, Bonnet and Snail roads become inaccessible with
several inches of water inside homes along the river and canals.
Docks at Astor Bridge marina and throughout Astor are completely
submerged. Bartram Rd and Holiday Circle are inaccessible with
yards completely submerged. Clair Street is inaccessible. Roads
flooded in South Moon Fish Camp, docks and yards at condominiums on
Juno Trail and water breaches the sea wall at Blair's Jungle Den.

* ADDITIONAL DETAILS...
- At 8:30 AM EDT Sunday the stage was 2.6 feet.
- Bankfull stage is 2.0 feet.
- Recent Activity...The maximum river stage in the 24 hours ending
at 8:30 AM EDT Sunday was 2.6 feet.
- Forecast...The river is expected to rise to 3.3 feet Tuesday
morning. Additional rises are possible thereafter.
- Flood stage is 2.3 feet.
- http://www.weather.gov/safety/flood

공식 별도 행동 지침:

Motorists should not attempt to drive around barricades or drive cars
through flooded areas.

Caution is urged when walking near riverbanks.

Additional information is available at www.weather.gov.

The next statement will be issued this evening at 1100 PM EDT.

### gemini-3.1-flash-lite

응답 3.428초 · HTTP 200

전체 번역:

홍수 경보가 2026년 10월 18일 오전 9시 11분(EDT)에 NWS 멜버른(Melbourne), FL에 의해 발표되었습니다. ...플로리다주 다음 강들에 대한 홍수 경보가 계속됩니다... 세인트 존스 강(St Johns River), 애스터(Astor) 인근, 볼루시아(Volusia) 및 레이크(Lake) 카운티 영향. 애스터(Astor)의 세인트 존스 강(St Johns River)은 오늘 경미한 홍수 단계(Minor Flood Stage)를 유지할 것으로 예상되나, 강한 북동풍이 강물의 흐름을 늦추어 오늘 밤 수위가 더 빠르게 상승할 것입니다. 강은 월요일 이른 시간에 보통 홍수 단계(Moderate Flood Stage)에 도달할 것으로 예상되며, 이번 주 말까지 보통 홍수 단계가 유지될 것입니다. 세인트 존스 강(St. Johns River)...애스터(Astor) 포함...보통 홍수가 예상됩니다. * 내용...경미한 홍수가 발생 중이며 보통 홍수가 예상됩니다. * 지역...애스터(Astor) 인근 세인트 존스 강(St Johns River). * 시기...추후 통지가 있을 때까지. * 영향...수위 3.5피트에서 운하가 범람하여 마당으로 물이 들어옵니다. 와일드호그(Wildhog), 보넷(Bonnet), 스네일(Snail) 도로 인근 주택들은 접근이 불가능해지며 강과 운하를 따라 위치한 주택 내부로 수인치 높이의 물이 들어옵니다. 애스터 브리지(Astor Bridge) 선착장과 애스터(Astor) 전역의 부두가 완전히 침수됩니다. 바트람 로드(Bartram Rd)와 홀리데이 서클(Holiday Circle)은 접근이 불가능하며 마당이 완전히 침수됩니다. 클레어 스트리트(Clair Street)는 접근이 불가능합니다. 사우스 문 피시 캠프(South Moon Fish Camp)의 도로가 침수되고, 주노 트레일(Juno Trail) 콘도미니엄의 부두와 마당이 침수되며, 블레어스 정글 덴(Blair's Jungle Den)에서는 방파제를 넘어 물이 유입됩니다. * 추가 세부 사항... - 일요일 오전 8시 30분(EDT) 기준 수위는 2.6피트였습니다. - 제방 가득 찬 수위(Bankfull stage)는 2.0피트입니다. - 최근 활동...일요일 오전 8시 30분(EDT)까지 24시간 동안의 최대 강 수위는 2.6피트였습니다. - 예보...강 수위는 화요일 아침 3.3피트까지 상승할 것으로 예상됩니다. 그 이후 추가 상승 가능성이 있습니다. - 홍수 단계(Flood stage)는 2.3피트입니다. - http://www.weather.gov/safety/flood

설명: 강 수위가 상승하여 인근 도로와 주택, 부두가 침수될 위험이 있습니다.

요약:

- 2026년 10월 18일 오전 9시 11분(EDT)부터 추후 통지 시까지 애스터(Astor) 인근 세인트 존스 강(St Johns River)에 홍수 경보가 발효 중입니다.
- 강 수위가 상승하여 도로와 주택 침수가 예상되므로 주의가 필요합니다.
- 침수된 지역으로 차량 운행을 금하고 강둑 근처 보행 시 각별히 유의하십시오.

별도 행동 지침 번역: 운전자는 바리케이드를 우회하거나 침수된 지역으로 차량을 운전하려고 시도해서는 안 됩니다. 강둑 근처를 걸을 때는 주의가 필요합니다.

용어: [{"term": "Minor Flood Stage", "meaning": "강물이 범람하여 인근 저지대나 도로에 경미한 피해를 줄 수 있는 수위 단계입니다."}, {"term": "Moderate Flood Stage", "meaning": "강물이 범람하여 주택 침수 등 상당한 피해가 발생할 수 있는 수위 단계입니다."}, {"term": "Bankfull stage", "meaning": "강물이 제방 높이까지 가득 차서 범람하기 직전의 수위입니다."}]

### gemini-3.5-flash-lite

응답 3.731초 · HTTP 200

전체 번역:

홍수 경보(Flood Warning)가 2026년 10월 18일 오전 9시 11분 EDT에 미국 국립기상청(NWS Melbourne FL)에서 발표되었습니다. 대상 지역: 레이크(Lake, FL), 볼루시아(Volusia, FL).

...플로리다주의 다음 하천에 대해 홍수 경보가 지속됩니다...

볼루시아 카운티와 레이크 카운티에 영향을 미치는 아스토(Astor) 인근의 세인트존스 강(St Johns River).

.아스토의 세인트존스 강은 오늘 경미한 홍수 단계(Minor Flood Stage)를 유지할 것으로 예상되나, 강한 북동풍이 하천 흐름을 늦추어 오늘 밤 수위가 더 빨리 상승하게 만들겠습니다. 이 강은 월요일 이른 시간에 보통 홍수 단계(Moderate Flood Stage)에 도달하고, 이번 주말까지 보통 홍수 단계를 유지할 것으로 예상됩니다.

세인트존스 강(아스토 포함)에 대해 보통 홍수가 예보됩니다.

* 주요 내용... 경미한 홍수가 발생하고 있으며 보통 홍수가 예보됩니다.
* 영향 받는 지역... 아스토 인근의 세인트존스 강.
* 발생 시간... 추후 공지가 있을 때까지.
* 영향... 3.5피트에서 운하가 마당으로 범람합니다. 와일드호그(Wildhog), 보니(Bonnet), 스네일(Snail) 도로에 있거나 인근에 있는 주택은 진입이 불가능해지며 강과 운하를 따라 주택 내부로 수인치 정도의 물이 차오릅니다. 아스토 브리지(Astor Bridge) 마리나와 아스토 전역의 선박 부두가 완전히 잠깁니다. 바트램 로드(Bartram Rd)와 홀리데이 서클(Holiday Circle)은 마당이 완전히 잠겨 진입이 불가능합니다. 클레어 스트리트(Clair Street)는 진입이 불가능합니다. 사우스 문 피시 캠프(South Moon Fish Camp)의 도로들이 침수되고, 주노 트레일(Juno Trail) 콘도미니엄의 부두와 마당이 침수되며, 블레어스 정글 덴(Blair's Jungle Den)의 방파제를 물이 넘습니다.
* 추가 세부 정보...
- 일요일 오전 8시 30분 EDT 기준 수위는 2.6피트였습니다.
- 제방 만수위(Bankfull stage)는 2.0피트입니다.
- 최근 활동... 일요일 오전 8시 30분 EDT로 끝나는 24시간 동안의 최고 하천 수위는 2.6피트였습니다.
- 예보... 이 강은 화요일 아침에 3.3피트로 상승할 것으로 예상됩니다. 그 이후 추가 상승이 발생할 수 있습니다.
- 홍수 단계는 2.3피트입니다.
- http://www.weather.gov/safety/flood

운전자는 바리케이드 주변을 운전하거나 침수된 지역으로 차량을 운전하려고 시도해서는 안 됩니다.

강둑 근처를 걸을 때는 주의가 요구됩니다.

추가 정보는 www.weather.gov에서 확인할 수 있습니다.

다음 성명은 오늘 저녁 11시 00분 EDT에 발표될 예정입니다.

설명: 홍수 경보는 하천 범람으로 인해 주변 도로와 주택가에 침수 피해가 발생할 위험이 있을 때 발령됩니다.

요약:

- 2026년 10월 18일 오전 9시 11분 EDT 발표 (발표 당시 지속 상태)
- 플로리다주 레이크 및 볼루시아 카운티의 세인트존스 강 인근 아스토 지역
- 침수된 도로와 바리케이드를 피해 운전하지 말고 강둑 근처를 걸을 때 주의하십시오.

별도 행동 지침 번역: 운전자는 바리케이드 주변을 운전하거나 침수된 지역으로 차량을 운전하려고 시도해서는 안 됩니다. 강둑 근처를 걸을 때는 주의가 요구됩니다.

용어: [{"term": "Flood Warning", "meaning": "홍수 경보로, 하천이나 호수 범람으로 인한 침수 위험이 임박했거나 진행 중일 때 발령됩니다."}, {"term": "Flood Stage", "meaning": "하천 수위가 제방을 넘거나 인근 지역에 피해를 주기 시작하는 기준 수위입니다."}]

## US-07 — Flood Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a56cdf023271a7438c881266db8b934ca1078963.001.1

### 입력 원문

event: Flood Watch
headline: Flood Watch issued October 18 at 3:59PM ChST until October 19 at 4:00AM ChST by NWS Tiyan GU
areaDesc: Guam; Rota
sent: 2026-10-18T15:59:00+10:00
effective: 2026-10-18T15:59:00+10:00
onset: 2026-10-18T15:59:00+10:00
ends: 2026-10-19T04:00:00+10:00
expires: 2026-10-19T04:00:00+10:00
status: Actual
messageType: Alert
description: * WHAT...Flooding caused by excessive rainfall continues to be
possible.

* WHERE...Guam, Rota.

* WHEN...Through late tonight.

* IMPACTS...Excessive runoff may result in flooding of rivers,
creeks, streams, and other low-lying and flood-prone locations.
Flooding may occur in poor drainage and urban areas. Storm drains
and ditches may become clogged with debris. Extensive street
flooding and flooding of creeks and rivers are possible.

* ADDITIONAL DETAILS...
- As Super Typhoon Champi (29W) continues to move west, away from
the Marianas, outer bands around Champi will produce locally
heavy rainfall tonight. Rota could receive 1 to 3 inches, and
Guam might get 2 to 4 inches.
- http://www.weather.gov/safety/flood

공식 별도 행동 지침:

You should monitor later forecasts and be prepared to take action
should Flash Flood Warnings be issued.

### gemini-3.1-flash-lite

응답 2.565초 · HTTP 200

전체 번역:

홍수 주의보(Flood Watch)가 2026년 10월 18일 오후 3시 59분 ChST부터 2026년 10월 19일 오전 4시 00분 ChST까지 발효되었습니다. 미국 국립기상청(NWS) 티얀(Tiyan), 괌(Guam)에서 발표하였습니다. * 내용... 과도한 강우로 인한 홍수 발생 가능성이 지속됩니다. * 지역... 괌(Guam), 로타(Rota). * 시기... 오늘 밤늦게까지. * 영향... 과도한 유출수로 인해 강, 개울, 하천 및 기타 저지대와 홍수 취약 지역이 침수될 수 있습니다. 배수 시설이 미흡한 지역과 도심지에서 홍수가 발생할 수 있습니다. 배수구와 도랑이 잔해물로 막힐 수 있습니다. 광범위한 도로 침수와 개울 및 강의 범람 가능성이 있습니다. * 추가 세부 사항... - 슈퍼 태풍 참피(Champi, 29W)가 마리아나 제도에서 서쪽으로 멀어짐에 따라, 참피 주변의 외곽 띠가 오늘 밤 국지적으로 많은 비를 뿌릴 것입니다. 로타(Rota)에는 1~3인치, 괌(Guam)에는 2~4인치의 강우량이 예상됩니다. - http://www.weather.gov/safety/flood

설명: 과도한 강우로 인해 하천 범람 및 도로 침수 등 홍수 피해가 발생할 가능성이 있습니다.

요약:

- 발효 시간: 2026년 10월 18일 오후 3시 59분 ~ 10월 19일 오전 4시 00분 ChST
- 대상 지역: 괌(Guam), 로타(Rota)
- 행동 요령: 최신 기상 예보를 확인하고 돌발 홍수 경보 발령 시 즉시 대응할 준비를 하십시오.

별도 행동 지침 번역: 최신 기상 예보를 지속적으로 확인하고, 돌발 홍수 경보(Flash Flood Warnings)가 발령될 경우 즉시 대응할 준비를 하십시오.

용어: [{"term": "홍수 주의보(Flood Watch)", "meaning": "홍수를 일으킬 수 있는 기상 조건이 형성되어 있으니 대비가 필요함을 의미합니다."}, {"term": "슈퍼 태풍(Super Typhoon)", "meaning": "최대 지속 풍속이 시속 150마일(약 241km/h) 이상인 매우 강력한 태풍을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.657초 · HTTP 200

전체 번역:

event: Flood Watch
headline: 2026년 10월 18일 오후 3시 59분 ChST에 미국 기상청 티얀 GU(NWS Tiyan GU)에서 발령한 홍수 주의보(Flood Watch), 2026년 10월 19일 오전 4시 00분 ChST까지
areaDesc: 괌(Guam); 로타(Rota)
sent: 2026년 10월 18일 오후 3시 59분 (UTC+10:00)
effective: 2026년 10월 18일 오후 3시 59분 (UTC+10:00)
onset: 2026년 10월 18일 오후 3시 59분 (UTC+10:00)
ends: 2026년 10월 19일 오전 4시 00분 (UTC+10:00)
expires: 2026년 10월 19일 오전 4시 00분 (UTC+10:00)
status: Actual
messageType: Alert
description: * 무엇을... 과도한 강수로 인한 홍수가 계속 발생할 가능성이 있습니다.

* 어디서... 괌(Guam), 로타(Rota).

* 언제... 오늘 밤 늦게까지.

* 영향... 과도한 유출수로 인해 강, 개울, 시내 및 기타 저지대와 홍수 취약 지역이 범람할 수 있습니다. 배수가 불량한 지역과 도시 지역에 홍수가 발생할 수 있습니다. 배수구와 도랑이 잔해로 막힐 수 있습니다. 광범위한 도로 침수와 개울 및 강의 범람이 발생할 수 있습니다.

* 추가 세부 사항...
- 초강력 태풍 챔피(Super Typhoon Champi, 29W)가 마리아나 제도(Marianas)에서 서쪽으로 계속 이동함에 따라, 챔피 주변의 외곽 밴드가 오늘 밤 국지적으로 많은 비를 내릴 것입니다. 로타(Rota)에는 1~3인치의 비가 내릴 수 있으며, 괌(Guam)에는 2~4인치의 비가 내릴 수 있습니다.
- http://www.weather.gov/safety/flood

설명: 지속적인 폭우로 인해 저지대와 하천 주변에 홍수가 발생할 위험이 있습니다.

요약:

- 2026년 10월 18일 오후 3시 59분부터 2026년 10월 19일 오전 4시 00분까지 ChST 기준
- 괌(Guam) 및 로타(Rota) 지역
- 폭우로 인한 홍수 가능성에 대비하여 최신 기상 예보를 모니터링하십시오.

별도 행동 지침 번역: 추후 일기 예보를 모니터링하고 돌발홍수 경보(Flash Flood Warnings)가 발령될 경우 조치를 취할 준비를 하십시오.

용어: [{"term": "Flood Watch", "meaning": "홍수 발생 가능성이 있으니 대비하라는 주의보입니다."}]

## US-08 — Frost Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.39713704265509bab3d91e528ba90ceff228d48f.001.1

### 입력 원문

event: Frost Advisory
headline: Frost Advisory issued October 18 at 12:25PM EDT until October 19 at 9:00AM EDT by NWS Cleveland OH
areaDesc: Lucas; Wood; Sandusky; Lorain; Hancock; Seneca; Huron; Medina; Summit; Wyandot; Crawford; Richland; Ashland; Wayne; Stark; Marion; Morrow; Holmes; Knox
sent: 2026-10-18T12:25:00-04:00
effective: 2026-10-18T12:25:00-04:00
onset: 2026-10-19T01:00:00-04:00
ends: 2026-10-19T09:00:00-04:00
expires: 2026-10-18T20:30:00-04:00
status: Actual
messageType: Alert
description: * WHAT...Temperatures as low as 34 will result in frost formation.

* WHERE...Portions of north central, northeast, and northwest Ohio.

* WHEN...From 1 AM to 9 AM EDT Monday.

* IMPACTS...Frost could harm sensitive outdoor vegetation. Sensitive
outdoor plants may be killed if left uncovered.

공식 별도 행동 지침:

Take steps now to protect tender plants from the cold.

### gemini-3.1-flash-lite

응답 2.128초 · HTTP 200

전체 번역:

서리 주의보가 2026년 10월 18일 오후 12시 25분 EDT에 발령되어 2026년 10월 19일 오전 9시 00분 EDT까지 유효합니다. NWS 클리블랜드(Cleveland), OH 발령. 대상 지역: 루카스(Lucas), 우드(Wood), 샌더스키(Sandusky), 로레인(Lorain), 핸콕(Hancock), 세네카(Seneca), 휴런(Huron), 메디나(Medina), 서밋(Summit), 와이언도트(Wyandot), 크로포드(Crawford), 리치랜드(Richland), 애슐랜드(Ashland), 웨인(Wayne), 스타크(Stark), 매리언(Marion), 모로(Morrow), 홈즈(Holmes), 녹스(Knox). 무엇을... 최저 34°F (약 1°C)의 기온으로 인해 서리가 형성될 것입니다. 어디서... 오하이오(Ohio) 북중부, 북동부 및 북서부 일부 지역. 언제... 월요일 오전 1시부터 오전 9시(EDT)까지. 영향... 서리가 민감한 실외 식물에 피해를 줄 수 있습니다. 덮어두지 않은 민감한 실외 식물은 고사할 수 있습니다.

설명: 기온이 낮아져 지표면에 서리가 발생하여 식물에 피해를 줄 수 있는 상태입니다.

요약:

- 발령 시간: 2026년 10월 18일 오후 12시 25분 EDT
- 영향 지역: 오하이오(Ohio) 북중부, 북동부, 북서부 일부 지역
- 영향 기간: 2026년 10월 19일 오전 1시부터 오전 9시(EDT)까지

별도 행동 지침 번역: 추위로부터 연약한 식물을 보호하기 위한 조치를 지금 취하십시오.

용어: [{"term": "서리 주의보(Frost Advisory)", "meaning": "기온이 낮아져 서리가 발생할 것으로 예상될 때 발령되는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.133초 · HTTP 200

전체 번역:

기상 경보: 서리 주의보가 클리블랜드 오하이오 국립기상청(NWS Cleveland OH)에 의해 2026년 10월 18일 오후 12시 25분 EDT에 발령되었습니다. 대상 지역: 루카스(Lucas), 우드(Wood),샌더스키(Sandusky), 로레인(Lorain), 핸콕(Hancock), 세네카(Seneca), 휴런(Huron), 메디나(Medina), 서밋(Summit), 와이언도트(Wyandot), 크로퍼드(Crawford), 리치랜드(Richland), 애슐랜드(Ashland), 웨인(Wayne), 스타크(Stark), 매리언(Marion), 모로(Morrow), 홈즈(Holmes), 녹스(Knox). 주요 내용: * 무엇을... 34°F (약 1°C)까지 내려가는 기온으로 인해 서리가 형성됩니다. * 어디서... 오하이오주(Ohio) 북중앙, 동북부, 서북부 일부 지역. * 언제... 월요일 오전 1시부터 오전 9시 EDT까지. * 영향... 서리가 민감한 실외 식물에 피해를 줄 수 있습니다. 덮어두지 않으면 민감한 실외 식물이 고사할 수 있습니다.

설명: 기온이 영하권 또는 저온으로 떨어져 식물에 서리가 내릴 수 있는 위험한 상태입니다.

요약:

- 2026년 10월 19일 오전 1시 ~ 오전 9시 EDT 적용
- 오하이오주(Ohio) 북중앙, 동북부, 서북부 일부 지역
- 추위로부터 민감한 식물을 보호하기 위한 조치를 취하십시오.

별도 행동 지침 번역: 추위로부터 민감한 식물을 보호하기 위한 조치를 지금 취하십시오.

용어: [{"term": "Frost Advisory", "meaning": "농작물이나 식물에 피해를 줄 수 있는 서리 발생이 예상될 때 내려지는 주의보입니다."}]

## US-09 — Gale Warning

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.91b1130239142c44d6c7aaae03230b4a718f8ca2.001.1

### 입력 원문

event: Gale Warning
headline: Gale Warning issued October 18 at 11:41AM EDT until October 18 at 11:00PM EDT by NWS Gaylord MI
areaDesc: Straits of Mackinac within 5 nm of Mackinac Bridge including Mackinac Island; St Ignace to False Detour Channel; Grand Traverse Bay south of a line Grand Traverse Light to Norwood MI; Seul Choix Point to 5NM West of Mackinac Bridge; Norwood MI to 5NM West of Mackinac Bridge including Little Traverse Bay; Sleeping Bear Point to Grand Traverse Light MI; Point Betsie to Sleeping Bear Point MI
sent: 2026-10-18T11:41:00-04:00
effective: 2026-10-18T11:41:00-04:00
onset: 2026-10-18T11:41:00-04:00
ends: 2026-10-18T23:00:00-04:00
expires: 2026-10-18T19:45:00-04:00
status: Actual
messageType: Update
description: * WHAT...Highest gusts up to 40 kts from the southwest and
highest waves around 12 feet.

* WHERE...Portions of Lake Huron and Lake Michigan.

* WHEN...Until 11 PM EDT this evening.

* IMPACTS...Strong winds will cause hazardous highest waves
which could capsize or damage vessels and reduce visibility.

공식 별도 행동 지침:

Mariners should alter plans to avoid these hazardous conditions.
Remain in port, seek safe harbor, alter course, and/or secure the
vessel for hazardous conditions.

### gemini-3.1-flash-lite

응답 2.741초 · HTTP 200

전체 번역:

강풍 경보(Gale Warning)가 10월 18일 오전 11시 41분 EDT에 미국 기상청(NWS) 게일로드(Gaylord) 지국에 의해 발표되었으며 10월 18일 오후 11시 00분 EDT까지 유효합니다. 대상 지역: 매키낵 다리(Mackinac Bridge) 5해리 이내의 매키낵 해협(Straits of Mackinac) 및 매키낵 섬(Mackinac Island) 포함, 세인트 이그니스(St Ignace)에서 폴스 디투어 채널(False Detour Channel)까지, 그랜드 트래버스 등대(Grand Traverse Light)에서 노우드(Norwood, MI)를 잇는 선 남쪽의 그랜드 트래버스 만(Grand Traverse Bay), 술 초이 포인트(Seul Choix Point)에서 매키낵 다리 서쪽 5해리 지점까지, 노우드(Norwood, MI)에서 리틀 트래버스 만(Little Traverse Bay)을 포함한 매키낵 다리 서쪽 5해리 지점까지, 슬리핑 베어 포인트(Sleeping Bear Point)에서 그랜드 트래버스 등대(Grand Traverse Light, MI)까지, 포인트 벳시(Point Betsie)에서 슬리핑 베어 포인트(Sleeping Bear Point, MI)까지. 상세 내용: 남서쪽에서 불어오는 최대 40노트(약 74km/h)의 돌풍과 약 12피트(약 3.7미터)의 높은 파도가 예상됩니다. 영향: 강한 바람으로 인해 선박이 전복되거나 파손될 수 있는 위험한 파도가 발생하며 시야가 제한될 수 있습니다.

설명: 강풍 경보는 선박의 안전을 위협할 수 있는 강한 바람과 높은 파도가 예상될 때 발령됩니다.

요약:

- 발표 시간: 10월 18일 오전 11시 41분 EDT
- 영향 지역: 미시간주(MI) 북부 호수 일대
- 조치 사항: 항구 대기, 안전한 항구로 대피, 항로 변경 또는 선박 고정

별도 행동 지침 번역: 선박 운항자는 이러한 위험한 기상 조건을 피하기 위해 계획을 변경하십시오. 항구에 머무르거나 안전한 항구로 대피하고, 항로를 변경하거나 위험한 기상 조건에 대비하여 선박을 안전하게 고정하십시오.

용어: [{"term": "Gale Warning (강풍 경보)", "meaning": "지속적인 바람이나 돌풍이 해상 활동에 위험을 초래할 정도로 강하게 불 때 발령되는 경보입니다."}, {"term": "kts (노트)", "meaning": "해상에서 사용하는 속도 단위로, 1노트는 시속 약 1.85km입니다."}, {"term": "nm (해리)", "meaning": "해상 거리 단위로, 1해리는 약 1.85km입니다."}]

### gemini-3.5-flash-lite

응답 3.332초 · HTTP 200

전체 번역:

기상특보: 강풍주의보(Gale Warning)\n\n미국 국립기상청(NWS) 게이로드 미시간(Gaylord MI) 지부에서 2026년 10월 18 오전 11:41 EDT에 강풍주의보를 발표했습니다.\n\n대상 구역: Straits of Mackinac within 5 nm of Mackinac Bridge including Mackinac Island; St Ignace to False Detour Channel; Grand Traverse Bay south of a line Grand Traverse Light to Norwood MI; Seul Choix Point to 5NM West of Mackinac Bridge; Norwood MI to 5NM West of Mackinac Bridge including Little Traverse Bay; Sleeping Bear Point to Grand Traverse Light MI; Point Betsie to Sleeping Bear Point MI\n\n발표 시각: 2026년 10월 18일 오전 11:41 EDT\n시행 시각: 2026년 10월 18일 오전 11:41 EDT\n시작 시각: 2026년 10월 18일 오전 11:41 EDT\n종료 시각: 2026년 10월 18일 오후 11:00 EDT\n만료 시각: 2026년 10월 18일 오후 7:45 EDT\n\n상세 내용:\n* 영향(WHAT): 남서쪽에서 불어오는 최대 40노트(약 74 km/h)의 돌풍과 약 12피트 높이의 파고가 예상됩니다.\n* 지역(WHERE): 휴런호(Lake Huron) 및 미시간호(Lake Michigan) 일부 구역.\n* 시기(WHEN): 오늘 저녁 11시 EDT까지.\n* 영향(IMPACT): 강한 바람으로 인해 선박을 전복시키거나 파손할 수 있고 시정을 저하시키는 위험한 높은 파도가 발생합니다.\n\n조치 지침:\n해상 종사자는 이러한 위험한 기상 조건을 피하도록 계획을 변경해야 합니다. 위험한 기상 상황에 대비하여 항구에 머물거나, 안전한 피항지를 찾거나, 항로를 변경하거나, 선박을 단단히 결박하십시오.

설명: 강풍주의보는 선박 운항에 위험을 줄 수 있는 강한 바람과 높은 파도가 발생할 때 발령됩니다.

요약:

- 2026년 10월 18일 오전 11:41부터 오후 11:00 EDT까지 휴런호 및 미시간호 일부 구역에 강풍주의보가 발표되었습니다.
- 남서쪽에서 부는 최대 40노트(약 74 km/h)의 돌풍과 약 12피트의 높은 파도가 예상됩니다.
- 해상 종사자는 항구에 머물거나 안전한 피항지를 찾는 등 위험한 기상 조건에 대비하십시오.

별도 행동 지침 번역: 해상 종사자는 이러한 위험한 기상 조건을 피하도록 계획을 변경해야 합니다. 위험한 기상 상황에 대비하여 항구에 머물거나, 안전한 피항지를 찾거나, 항로를 변경하거나, 선박을 단단히 결박하십시오.

용어: [{"term": "Gale Warning", "meaning": "선박 운항에 위협이 되는 강한 바람이 예상될 때 발령되는 경보입니다."}, {"term": "Knots", "meaning": "해상 풍속을 나타내는 단위로, 1노트는 약 1.852 km/h입니다."}]

## US-10 — Gale Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.c3d3f92dbd5982ed7c70c3a41f50a3dfa5d06128.003.2

### 입력 원문

event: Gale Watch
headline: Gale Watch issued October 18 at 11:45AM EDT until October 20 at 6:00PM EDT by NWS Mount Holly NJ
areaDesc: Coastal waters from Manasquan Inlet to Little Egg Inlet NJ out 20 NM
sent: 2026-10-18T11:45:00-04:00
effective: 2026-10-18T11:45:00-04:00
onset: 2026-10-19T06:00:00-04:00
ends: 2026-10-20T18:00:00-04:00
expires: 2026-10-19T00:45:00-04:00
status: Actual
messageType: Update
description: * WHAT...For the Small Craft Advisory, northeast winds 15 to 20
kt with gusts up to 25 kt and seas 4 to 7 ft. For the Gale
Watch, northeast winds 20 to 30 kt with gusts up to 40 kt and
seas 7 to 12 ft possible.

* WHERE...Coastal waters from Manasquan Inlet to Little Egg
Inlet NJ out 20 NM.

* WHEN...For the Small Craft Advisory, until 6 AM EDT Monday.
For the Gale Watch, from Monday morning through Tuesday
afternoon.

* IMPACTS...Strong winds can cause hazardous seas which could
capsize or damage vessels and reduce visibility.

공식 별도 행동 지침:

Mariners should consider altering plans to avoid possible
hazardous conditions.  Remain in port, seek safe harbor, alter
course, and/or secure the vessel for severe wind and seas.

### gemini-3.1-flash-lite

응답 2.423초 · HTTP 200

전체 번역:

강풍 주의보(Gale Watch)가 2026년 10월 18일 오전 11시 45분 EDT에 마운트 홀리(Mount Holly), 뉴저지(NJ) 국립기상청(NWS)에 의해 발표되었습니다. 적용 지역은 마나스콴 인렛(Manasquan Inlet)에서 리틀 에그 인렛(Little Egg Inlet)까지의 뉴저지(NJ) 연안 해역(20해리 이내)입니다. 소형 선박 주의보(Small Craft Advisory)의 경우, 북동풍이 15~20노트, 돌풍은 최대 25노트이며 파고는 4~7피트입니다. 강풍 주의보(Gale Watch)의 경우, 북동풍이 20~30노트, 돌풍은 최대 40노트(약 74 km/h)에 달할 수 있으며 파고는 7~12피트(약 2.1~3.7미터)에 이를 수 있습니다. 소형 선박 주의보는 월요일 오전 6시 EDT까지 유효하며, 강풍 주의보는 월요일 오전부터 화요일 오후까지 유효합니다. 강한 바람은 선박을 전복시키거나 손상시킬 수 있는 위험한 해상을 초래하고 시야를 제한할 수 있습니다.

설명: 강풍 주의보는 선박의 안전을 위협할 수 있는 강한 바람과 높은 파도가 예상될 때 발령됩니다.

요약:

- 일시: 2026년 10월 19일 오전 6시부터 10월 20일 오후 6시까지
- 지역: 마나스콴 인렛(Manasquan Inlet)에서 리틀 에그 인렛(Little Egg Inlet)까지의 뉴저지(NJ) 연안 해역
- 조치: 항로 변경, 안전한 항구로 대피, 선박 고정 등 위험 상황 대비

별도 행동 지침 번역: 선박 운항자는 위험한 기상 조건을 피하기 위해 계획 변경을 고려하십시오. 항구에 머무르거나 안전한 항구로 대피하고, 항로를 변경하거나 강풍과 높은 파도에 대비하여 선박을 안전하게 고정하십시오.

용어: [{"term": "Gale Watch (강풍 주의보)", "meaning": "강풍으로 인해 선박 운항에 위험한 상황이 발생할 가능성이 있을 때 발령되는 예보입니다."}, {"term": "Small Craft Advisory (소형 선박 주의보)", "meaning": "소형 선박의 운항에 위험을 초래할 수 있는 기상 조건이 예상될 때 발령되는 주의보입니다."}, {"term": "kt (노트)", "meaning": "해상에서 사용하는 속도 단위로, 1노트는 시속 약 1.85km입니다."}]

### gemini-3.5-flash-lite

응답 2.928초 · HTTP 200

전체 번역:

Gale Watch issued October 18 at 11:45AM EDT until October 20 at 6:00PM EDT by NWS Mount Holly NJ... areaDesc: Coastal waters from Manasquan Inlet to Little Egg Inlet NJ out 20 NM... sent: 2026년 10월 18일 오전 11시 45분 (UTC-04:00)... effective: 2026년 10월 18일 오전 11시 45분 (UTC-04:00)... onset: 2026년 10월 19일 오전 6시 00분 (UTC-04:00)... ends: 2026년 10월 20일 오후 6시 00분 (UTC-04:00)... expires: 2026년 10월 19일 오전 12시 45분 (UTC-04:00)... status: Actual... messageType: Update... description: * WHAT...소형 선박 주의보(Small Craft Advisory)의 경우, 북동풍 시속 약 28~37 km/h(15~20 kt), 최대 시속 약 46 km/h(25 kt)의 돌풍과 4~7 ft의 파고가 예상됩니다. 강풍 주의보(Gale Watch)의 경우, 북동풍 시속 약 37~56 km/h(20~30 kt), 최대 시속 약 74 km/h(40 kt)의 돌풍과 7~12 ft의 파고가 발생할 가능성이 있습니다. * WHERE...뉴저지주(NJ) 마나스콴 입구(Manasquan Inlet)에서 리틀 에그 입구(Little Egg Inlet)까지 해안에서 20 해일(NM)까지의 해역. * WHEN...소형 선박 주의보(Small Craft Advisory)는 월요일 오전 6시 EDT까지입니다. 강풍 주의보(Gale Watch)는 월요일 아침부터 화요일 오후까지 이어집니다. * IMPACTS...강한 바람은 선박을 전복시키거나 파손시키고 시정을 저하시킬 수 있는 위험한 해상을 유발할 수 있습니다.

설명: 강풍 주의보는 선박 운항을 위협할 수 있는 거친 파도와 강한 바람이 예상될 때 발령됩니다.

요약:

- 2026년 10월 19일 오전 6시 EDT부터 2026년 10월 20일 오후 6시 EDT까지 뉴저지주(NJ) 마나스콴 입구에서 리틀 에그 입구까지 해안 20 해일(NM) 해역에 강풍 주의보가 발표된 상태입니다.
- 북동풍이 시속 약 37~56 km/h(20~30 kt)로 불고 최대 시속 약 74 km/h(40 kt)의 돌풍과 함께 7~12 ft의 높은 파고가 발생할 가능성이 있습니다.

별도 행동 지침 번역: 해상 종사자는 위험한 기상 조건을 피하기 위해 계획을 변경하는 것을 고려하십시오. 항구에 머물거나, 안전한 피항지를 찾거나, 항로를 변경하거나, 심한 바람과 파도에 대비해 선박을 단단히 결박하십시오.

용어: [{"term": "Gale Watch", "meaning": "선박 안전에 위협이 되는 강풍이 불 가능성이 높을 때 발령되는 주의보입니다."}, {"term": "Small Craft Advisory", "meaning": "소형 선박의 안전 운항에 지장을 주는 바람과 파고가 예상될 때 발령되는 경보입니다."}, {"term": "kt", "meaning": "노트(Knot)를 뜻하며, 해상 풍속의 단위로 1kt는 약 1.852 km/h입니다."}]

## US-11 — Hazardous Seas Warning

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.b2d003b6e78224651363b6fca0a13e4917f9f707.002.1

### 입력 원문

event: Hazardous Seas Warning
headline: Hazardous Seas Warning issued October 18 at 1:31AM PDT until October 18 at 5:00PM PDT by NWS Medford OR
areaDesc: Waters from Cape Blanco OR to Pt. St. George CA from 10 to 60 nm
sent: 2026-10-18T01:31:00-07:00
effective: 2026-10-18T01:31:00-07:00
onset: 2026-10-18T01:31:00-07:00
ends: 2026-10-18T17:00:00-07:00
expires: 2026-10-18T14:45:00-07:00
status: Actual
messageType: Update
description: * WHAT...For the Hazardous Seas Warning, north winds 20 to 25 kt
and very steep and hazardous seas 9 to 12 ft due to a mix of
wind seas and building swell at 11 seconds expected. For the
Small Craft Advisory, north winds 20 kt and steep seas 7 to 9
ft due to a mix of wind seas and building swell at 11 seconds
expected.

* WHERE...Small craft advisory conditions will affect all areas.
Hazardous seas warning will affect area areas south of Gold
Beach.

* WHEN...Until 5 PM PDT Sunday.

* IMPACTS...Very steep and hazardous seas could capsize or
damage vessels. Bar crossings will become especially
treacherous.

* View the hazard area in detail at https://go.usa.gov/x6hks

공식 별도 행동 지침:

Recreational boaters should remain in port. Commercial vessels
should prepare for very steep seas and consider remaining in port
until conditions improve.

### gemini-3.1-flash-lite

응답 2.693초 · HTTP 200

전체 번역:

위험 해상 경보(Hazardous Seas Warning)가 2026년 10월 18일 오전 1시 31분 PDT에 미국 국립기상청(NWS) 메드포드(Medford, OR) 지국에 의해 발표되었으며 2026년 10월 18일 오후 5시 00분 PDT까지 유효합니다. 대상 지역은 오리건주 케이프 블랑코(Cape Blanco, OR)에서 캘리포니아주 포인트 세인트 조지(Pt. St. George, CA)까지 10~60해리 구간입니다. 위험 해상 경보와 관련하여 북풍이 20~25노트로 불고, 바람에 의한 파도와 11초 주기로 형성되는 너울이 합쳐져 9~12피트의 매우 가파르고 위험한 파도가 예상됩니다. 소형 선박 주의보(Small Craft Advisory)와 관련하여 북풍이 20노트로 불고, 7~9피트의 가파른 파도가 예상됩니다. 소형 선박 주의보 조건은 전 지역에 영향을 미치며, 위험 해상 경보는 골드 비치(Gold Beach) 남쪽 지역에 영향을 미칩니다. 매우 가파르고 위험한 파도는 선박을 전복시키거나 손상을 입힐 수 있으며, 강 하구 횡단은 특히 위험해질 것입니다. 자세한 위험 지역 정보는 https://go.usa.gov/x6hks 에서 확인하십시오.

설명: 매우 가파르고 위험한 파도가 발생하여 선박의 전복이나 파손 위험이 매우 높습니다.

요약:

- 일시: 2026년 10월 18일 오전 1시 31분 ~ 오후 5시 PDT
- 지역: 오리건주 케이프 블랑코 ~ 캘리포니아주 포인트 세인트 조지 10~60해리 구간
- 조치: 레저용 선박은 항구에 머물고, 상업용 선박은 기상 악화에 대비하거나 출항을 자제하십시오.

별도 행동 지침 번역: 레저용 선박은 항구에 머물러야 합니다. 상업용 선박은 매우 가파른 파도에 대비하고 기상 조건이 개선될 때까지 항구에 머무는 것을 고려하십시오.

용어: [{"term": "위험 해상 경보 (Hazardous Seas Warning)", "meaning": "선박의 안전을 위협할 정도로 높거나 가파른 파도가 예상될 때 발령되는 경보입니다."}, {"term": "소형 선박 주의보 (Small Craft Advisory)", "meaning": "강한 바람이나 파도로 인해 소형 선박 운항이 위험할 때 발령되는 주의보입니다."}, {"term": "너울 (Swell)", "meaning": "바람이 아닌 먼바다에서 생성되어 해안으로 밀려오는 파도입니다."}]

### gemini-3.5-flash-lite

응답 3.692초 · HTTP 200

전체 번역:

발표 시간: 2026년 10월 18일 오전 1시 31분 PDT (미국 서부 태평양 표준시)
발효 시간: 2026년 10월 18일 오전 1시 31분 PDT
시작 시간: 2026년 10월 18일 오전 1시 31분 PDT
종료 시간: 2026년 10월 18일 오후 5시 00분 PDT
만료 시간: 2026년 10월 18일 오후 2시 45분 PDT
지역: (Waters from Cape Blanco OR to Pt. St. George CA from 10 to 60 nm)

* 무엇을... 위험 해상 경보의 경우 북풍 20~25kt, 11초 주기의 풍랑과 발달하는 너울이 혼재하여 매우 가파르고 위험한 9~12피트 높이의 해상이 예상됩니다. 소형 선박 주의보의 경우 북풍 20kt, 11초 주기의 풍랑과 발달하는 너울이 혼재하여 가파른 7~9피트 높이의 해상이 예상됩니다.

* 어디서... 소형 선박 주의보 조건은 모든 구역에 영향을 미칩니다. 위험 해상 경보는 (Gold Beach) 남쪽 구역들에 영향을 미칩니다.

* 언제... 일요일 오후 5시 PDT까지.

* 영향... 매우 가파르고 위험한 해상으로 인해 선박이 전복되거나 파손될 수 있습니다. 바다 입구 횡단이 특히 험난해질 것입니다.

* https://go.usa.gov/x6hks 에서 위험 구역을 상세히 확인하십시오.

설명: 위험한 해상 상태는 강한 바람과 높은 파도로 인해 선박 전복 및 파손 위험을 초래합니다.

요약:

- 2026년 10월 18일 오전 1시 31분 PDT에 NWS (Medford OR)에서 위험 해상 경보를 발표했습니다.
- 적용 지역은 (Waters from Cape Blanco OR to Pt. St. George CA from 10 to 60 nm)이며, 2026년 10월 18일 오후 5시 00분 PDT까지 지속됩니다.
- 레저용 보트는 항구에 머물고 상선은 매우 가파른 파도에 대비하며 출항을 연기하십시오.

별도 행동 지침 번역: 레저용 보트 운항자는 항구에 머물러야 합니다. 상선은 매우 가파른 파도에 대비하고 기상이 호전될 때까지 항구에 머무는 것을 고려하십시오.

용어: [{"term": "Hazardous Seas Warning", "meaning": "선박 운항에 위험을 초래하는 매우 높고 가파른 파도가 예상될 때 발령하는 경보입니다."}, {"term": "Small Craft Advisory", "meaning": "소형 선박의 안전 운항에 위협이 되는 강풍이나 파도가 예상될 때 발령하는 주의보입니다."}]

## US-12 — Heavy Freezing Spray Warning

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.8e15595ac38991a25d6cbdd3951d992decef60b7.001.1

### 입력 원문

event: Heavy Freezing Spray Warning
headline: Heavy Freezing Spray Warning issued October 11 at 4:00PM AKDT until October 18 at 5:00PM AKDT by NWS Fairbanks AK
areaDesc: Western US Arctic Offshore
sent: 2026-10-11T15:45:00-08:00
effective: 2026-10-11T16:00:00-08:00
onset: 2026-10-11T16:00:00-08:00
ends: 2026-10-18T17:00:00-08:00
expires: 2026-10-12T04:00:00-08:00
status: Actual
messageType: Alert
description: Offshore Waters Forecast for the US Arctic Waters

Sea forecasts represent an average of the highest one-third of
the combined wind wave and swell height. Individual waves may be
twice as high.

.TONIGHT...NE winds 25 kt. Seas 8 ft. Rain in the evening.
Moderate freezing spray.
.MON...NE winds 25 kt. Seas 9 ft. Moderate freezing spray.
.MON NIGHT...N winds 25 kt. Seas 7 ft. Moderate freezing spray.
.TUE...NE winds 20 kt. Seas 4 ft. Moderate freezing spray.
.TUE NIGHT...NE winds 15 kt. Seas 4 ft. Light freezing spray.
.WED...W winds 15 kt. Seas 3 ft.
.THU...S winds 10 kt. Seas 2 ft.
.FRI...S winds 15 kt. Seas 7 ft.

### gemini-3.1-flash-lite

응답 2.227초 · HTTP 200

전체 번역:

미국 국립기상청(NWS) 페어뱅크스(Fairbanks) 지국은 10월 11일 오후 4시 AKDT부터 10월 18일 오후 5시 AKDT까지 서부 미국 북극 연안(Western US Arctic Offshore) 지역에 강한 결빙 분무 경보를 발령했습니다. 미국 북극 해역 연안 예보: 해상 예보는 결합된 풍랑과 너울 높이의 상위 3분의 1 평균을 나타냅니다. 개별 파도는 이보다 두 배 더 높을 수 있습니다. 오늘 밤: 북동풍 25노트, 파고 8피트, 저녁에 비, 보통 수준의 결빙 분무. 월요일: 북동풍 25노트, 파고 9피트, 보통 수준의 결빙 분무. 월요일 밤: 북풍 25노트, 파고 7피트, 보통 수준의 결빙 분무. 화요일: 북동풍 20노트, 파고 4피트, 보통 수준의 결빙 분무. 화요일 밤: 북동풍 15노트, 파고 4피트, 약한 결빙 분무. 수요일: 서풍 15노트, 파고 3피트. 목요일: 남풍 10노트, 파고 2피트. 금요일: 남풍 15노트, 파고 7피트.

설명: 강한 결빙 분무는 차가운 해수면 위로 강한 바람이 불 때 선박에 얼음이 빠르게 쌓여 전복 위험을 초래하는 현상입니다.

요약:

- 발령 기간: 10월 11일 오후 4시 AKDT ~ 10월 18일 오후 5시 AKDT
- 대상 지역: 서부 미국 북극 연안(Western US Arctic Offshore)
- 주의 사항: 강한 결빙 분무로 인한 선박 안전에 유의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "결빙 분무(Freezing Spray)", "meaning": "영하의 기온에서 파도가 선박에 부딪혀 발생하는 물보라가 즉시 얼어붙는 현상입니다."}, {"term": "노트(kt)", "meaning": "해상에서 사용하는 속도 단위로, 1노트는 시속 약 1.85km입니다."}, {"term": "AKDT", "meaning": "알래스카 일광 절약 시간대를 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.86초 · HTTP 200

전체 번역:

기상 경보: 강한 결빙무무 경보가 미국알래스카주 페어뱅크스(Fairbanks, AK) 기상청에 의해 2026년 10월 11일 오후 4시 00분 AKDT에 발표되었으며 2026년 10월 18일 오후 5시 00분 AKDT까지 지속됩니다. 대상 지역: 미국 서부 북극 해상(Western US Arctic Offshore). 발송 시각: 2026년 10월 11일 오후 3시 45분 -08:00. 유효 시각: 2026년 10월 11일 오후 4시 00분 -08:00. 시작 시각: 2026년 10월 11일 오후 4시 00분 -08:00. 종료 시각: 2026년 10월 18일 오후 5시 00분 -08:00. 만료 시각: 2026년 10월 12일 오전 4시 00분 -08:00. 상태: 실제 상황. 메시지 유형: 경보. 설명: 미국 북극 해역(US Arctic Waters) 해상 예보. 해상 예보는 결합된 풍랑과 너울 높이 중 가장 높은 3분의 1의 평균을 나타냅니다. 개별 파도는 이보다 두 배 높을 수 있습니다. 오늘 밤: 북동풍 25노트. 파도 8피트. 저녁에 비. 보통의 결빙무무. 월요일: 북동풍 25노트. 파도 9피트. 보통의 결빙무무. 월요일 밤: 북풍 25노트. 파도 7피트. 보통의 결빙무무. 화요일: 북동풍 20노트. 파도 4피트. 보통의 결빙무무. 화요일 밤: 북동풍 15노트. 파도 4피트. 약한 결빙무무. 수요일: 서풍 15노트. 파도 3피트. 목요일: 남풍 10노트. 파도 2피트. 금요일: 남풍 15노트. 파도 7피트.

설명: 해상에서 선박 표면에 물보라가 얼어붙어 항해 안전에 위험을 주는 기상 현상입니다.

요약:

- 미국 서부 북극 해상(Western US Arctic Offshore)에 강한 결빙무무 경보가 발표되었습니다.
- 발효 기간은 2026년 10월 11일 오후 4시 00분 AKDT부터 2026년 10월 18일 오후 5시 00분 AKDT까지입니다.
- 해상 활동 시 선박 결빙 위험에 주의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "Heavy Freezing Spray Warning", "meaning": "선박에 위험한 수준의 결빙무무가 발생할 것으로 예상될 때 발령하는 경보입니다."}, {"term": "Freezing Spray", "meaning": "차가운 해수면 위에서 바람에 날린 물보라가 선박 구조물에 닿아 얼어붙는 현상입니다."}]

## US-13 — High Surf Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.0fa2b1cf35c0ffa63c715482f0e3077ecdd92f31.001.2

### 입력 원문

event: High Surf Advisory
headline: High Surf Advisory issued October 18 at 11:02AM EDT until October 20 at 5:00PM EDT by NWS Newport/Morehead City NC
areaDesc: Hatteras Island
sent: 2026-10-18T11:02:00-04:00
effective: 2026-10-18T11:02:00-04:00
onset: 2026-10-18T11:02:00-04:00
ends: 2026-10-20T17:00:00-04:00
expires: 2026-10-18T23:15:00-04:00
status: Actual
messageType: Update
description: * WHAT...For the Coastal Flood Warning, 2 to 4 feet of inundation
above ground level expected in low-lying areas near shorelines
and tidal waterways. For the High Surf Advisory, large breaking
waves of 9 to 14 feet in the surf zone. For the Beach Hazards
Statement, dangerous rip currents, large breaking waves, and
strong longshore currents in the surf zone.

* WHERE...Hatteras Island.

* WHEN...For the Coastal Flood Warning, until 5 PM EDT Tuesday.
For the Beach Hazards Statement, through Sunday evening.

* IMPACTS...2 to 4 feet of inundation above ground level is
expected in some areas near shorelines and tidal waterways
resulting in an elevated threat of property damage. Flooding
will extend inland from the waterfront threatening some homes
and businesses. Numerous road closures and flooding of
vehicles will be possible. Vulnerable portions of NC-12 may be
inundated, especially around high tide. There is a possibility
of being stranded on Hatteras Island for multiple days. This
could be life threatening if you have an emergency. Dangerous
swimming and surfing conditions and localized beach erosion.
Rip currents can sweep even the best swimmers away from shore
into deeper water. Dangerous shore break can throw a swimmer
or surfer head first into the bottom causing neck and back
injuries. Strong longshore currents will create dangerous
swimming conditions.

* ADDITIONAL DETAILS...This has the potential to be a long
duration event bringing more significant ocean overwash
impacts to vulnerable oceanside areas through multiple high
tide cycles into the work week. Minor soundside water level
rises will also be possible.

공식 별도 행동 지침:

Take the necessary actions to protect flood-prone property. If
travel is required, do not drive around barricades or through
water of unknown depth.

Swimmers should remain out of the water due to dangerous surf
conditions.

### gemini-3.1-flash-lite

응답 3.397초 · HTTP 200

전체 번역:

높은 파도 주의보(High Surf Advisory)가 2026년 10월 18일 오전 11시 02분 EDT에 발표되어 2026년 10월 20일 오후 5시 00분 EDT까지 유효합니다. NWS Newport/Morehead City NC에서 발행하였습니다. 상세 내용: 해안 홍수 경보(Coastal Flood Warning)와 관련하여 해안선 및 조석 수로 인근 저지대에 지면 위 2~4피트(약 0.6~1.2미터)의 침수가 예상됩니다. 높은 파도 주의보와 관련하여 서프 존(surf zone)에 9~14피트(약 2.7~4.3미터)의 큰 파도가 예상됩니다. 해변 위험 경보(Beach Hazards Statement)와 관련하여 서프 존 내 위험한 이안류, 큰 파도, 강한 연안류가 발생하겠습니다. 대상 지역: 해터러스 섬(Hatteras Island). 영향: 해안선 인근 일부 지역에 2~4피트의 침수가 예상되어 재산 피해 위험이 높습니다. 홍수가 내륙으로 확장되어 주택과 상업 시설을 위협할 수 있으며, 도로 폐쇄 및 차량 침수가 발생할 수 있습니다. NC-12 도로의 취약 구간이 만조 시 침수될 수 있으며, 해터러스 섬에 며칠간 고립될 가능성이 있습니다. 이는 비상 상황 발생 시 생명을 위협할 수 있습니다. 위험한 수영 및 서핑 환경과 국지적인 해변 침식이 예상됩니다. 이안류는 숙련된 수영자도 깊은 물속으로 휩쓸어 갈 수 있습니다. 위험한 해안 파도는 수영자나 서퍼를 바닥으로 내동댕이쳐 목이나 등 부상을 유발할 수 있습니다. 강한 연안류는 위험한 수영 환경을 조성합니다. 추가 정보: 이번 현상은 장기간 지속될 가능성이 있으며, 주 초반까지 여러 번의 만조 주기를 거치며 취약한 해안 지역에 상당한 해수 범람 피해를 줄 수 있습니다. 사운드사이드(soundside) 지역의 수위 상승도 가능합니다.

설명: 해안 침수, 거대한 파도, 이안류 및 강한 연안류가 결합하여 해안가에 심각한 위험을 초래하는 상황입니다.

요약:

- 2026년 10월 20일 오후 5시까지 해터러스 섬(Hatteras Island)에 홍수 및 높은 파도 주의.
- 해안 저지대 침수 및 NC-12 도로 침수 가능성 대비.
- 위험한 파도와 이안류로 인해 입수를 금지하고 해안가 접근을 자제하십시오.

별도 행동 지침 번역: 홍수 취약 지역의 재산을 보호하기 위한 필요한 조치를 취하십시오. 이동이 필요한 경우, 바리케이드를 우회하거나 수심을 알 수 없는 물속으로 운전하지 마십시오. 위험한 파도 상황으로 인해 수영자는 물 밖으로 나와야 합니다.

용어: [{"term": "이안류 (Rip currents)", "meaning": "해안에서 바다 쪽으로 빠르게 흐르는 좁고 강한 물살입니다."}, {"term": "연안류 (Longshore currents)", "meaning": "해안선과 평행하게 흐르는 물살로, 수영자를 해안에서 멀어지게 하거나 위험한 곳으로 밀어낼 수 있습니다."}, {"term": "해수 범람 (Ocean overwash)", "meaning": "높은 파도가 해안 방어 시설을 넘어 육지로 바닷물이 밀려 들어오는 현상입니다."}]

### gemini-3.5-flash-lite

응답 3.015초 · HTTP 200

전체 번역:

기상청(NWS Newport/Morehead City NC)에서 2026년 10월 18일 오전 11시 02분 EDT에 발표한 높은 파도 주의보(High Surf Advisory)입니다. 발효 지역: 해터스 아일랜드(Hatteras Island). 시간 정보: 2026년 10월 18일 오전 11시 02분 EDT에 시작되어 2026년 10월 20일 오후 5시 00분 EDT에 종료됩니다. 상세 내용: 해안 홍수 경보(Coastal Flood Warning)의 경우 해안선 및 조수 수로 인근 저지대에 지면 위 2~4피트의 침수가 예상됩니다. 높은 파도 주의보의 경우 서프 구역에서 9~14피트의 큰 부서지는 파도가 예상됩니다. 해변 위험 경보(Beach Hazards Statement)의 경우 서프 구역에서 위험한 이안류, 큰 부서지는 파도, 강한 연안류가 예상됩니다. 영향: 해안선과 조수 수로 인근 일부 지역에서 지면 위 2~4피트의 침수가 예상되어 재산 피해 위험이 높아집니다. 해안가에서 내륙으로 홍수가 확대되어 일부 주택과 상업 시설이 위협받을 수 있습니다. 수많은 도로 통행 차단과 차량 침수가 발생할 수 있습니다. NC-12호선의 취약한 구간은 특히 만조 무렵에 침수될 수 있습니다. 해터스 아일랜드(Hatteras Island)에 수일 동안 고립될 가능성이 있습니다. 비상 상황이 발생할 경우 생명이 위험할 수 있습니다. 위험한 수영 및 서핑 조건과 국지적인 해변 침식이 발생합니다. 이안류는 최고의 수영 선수조차 해안에서 더 깊은 물로 휩쓸어 갈 수 있습니다. 위험한 해안 파도는 수영 선수나 서퍼를 바닥에 머리부터 내던져 목과 등 부상을 유발할 수 있습니다. 강한 연안류는 위험한 수영 환경을 조성합니다.

설명: 해안가에 큰 파도와 위험한 해류가 발생하여 인명과 재산에 심각한 위험을 초래하는 상황입니다.

요약:

- 발효 지역: 해터스 아일랜드(Hatteras Island)
- 기간: 2026년 10월 18일 오전 11시 02분 ~ 2026년 10월 20일 오후 5시 00분 EDT
- 행동 지침: 홍수 취약 재산 보호 및 위험 구역 접근 금지

별도 행동 지침 번역: 홍수에 취약한 재산을 보호하기 위해 필요한 조치를 취하십시오. 이동이 필요한 경우 바리케이드 주변이나 수심을 알 수 없는 물속으로 운전해 들어가지 마십시오. 위험한 파도 상황으로 인해 수영객은 물에 들어가지 말고 밖에 머물러야 합니다.

용어: [{"term": "High Surf Advisory", "meaning": "해안가에 위험한 고파도가 예상될 때 발령되는 주의보입니다."}, {"term": "Rip Currents", "meaning": "해안으로 부서진 파도가 riptide(이안류)를 통해 다시 바다로 빠르게 빠져나가는 위험한 물살입니다."}]

## US-14 — High Wind Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.ad4df7c652a9aea0b8cdc5f41ad937f4cc4197b8.001.1

### 입력 원문

event: High Wind Watch
headline: The High Wind Watch has been cancelled.
areaDesc: East Carteret
sent: 2026-10-17T02:59:00-04:00
effective: 2026-10-17T02:59:00-04:00
onset: 2026-10-17T20:00:00-04:00
ends: 2026-10-19T02:00:00-04:00
expires: 2026-10-17T03:14:30-04:00
status: Actual
messageType: Alert
description: The High Wind Watch has been cancelled and is no longer in effect.

### gemini-3.1-flash-lite

응답 1.842초 · HTTP 200

전체 번역:

강풍 주의보(High Wind Watch)가 취소되었습니다. 지역: 이스트 카터렛(East Carteret). 발행 시간: 2026년 10월 17일 오전 2시 59분(EDT). 강풍 주의보는 취소되었으며 더 이상 유효하지 않습니다.

설명: 강풍 주의보가 취소되어 해당 지역에 대한 강풍 위험 예보가 해제되었습니다.

요약:

- 2026년 10월 17일 오전 2시 59분(EDT)부로 강풍 주의보가 취소되었습니다.
- 대상 지역: 이스트 카터렛(East Carteret).
- 해당 기상 특보는 더 이상 유효하지 않습니다.

별도 행동 지침 번역: None

용어: [{"term": "강풍 주의보(High Wind Watch)", "meaning": "시속 40마일(약 64km/h) 이상의 지속적인 바람 또는 시속 58마일(약 93km/h) 이상의 돌풍이 발생할 가능성이 있을 때 발령됩니다."}]

### gemini-3.5-flash-lite

응답 1.725초 · HTTP 200

전체 번역:

이벤트: 강풍 주의보(High Wind Watch)
헤드라인: 강풍 주의보가 취소되었습니다.
지역: 이스트 카터렛(East Carteret)
발송 시각: 2026년 10월 17일 오전 2시 59분 -04:00
발효 시각: 2026년 10월 17일 오전 2시 59분 -04:00
시작 시각: 2026년 10월 17일 오후 8시 00분 -04:00
종료 시각: 2026년 10월 19일 오전 2시 00분 -04:00
만료 시각: 2026년 10월 17일 오전 3시 14분 30초 -04:00
상태: 실제(Actual)
메시지 유형: 경보(Alert)
설명: 강풍 주의보가 취소되었으며 더 이상 효력이 없습니다.

설명: 강풍 주의보가 취소되어 강풍 위험에 따른 주의 사항이 해제되었습니다.

요약:

- 이스트 카터렛(East Carteret) 지역의 강풍 주의보가 취소되었습니다.
- 발송 시각은 2026년 10월 17일 오전 2시 59분 -04:00입니다.
- 해당 주의보는 더 이상 효력이 없습니다.

별도 행동 지침 번역: None

용어: [{"term": "High Wind Watch", "meaning": "풍속이 강하게 불 가능성이 있을 때 미리 발령하는 주의보입니다."}]

## US-15 — Hydrologic Outlook

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.14e0fdbbf2d3fd9fa90874ddc716253ebee2d7f1.001.1

### 입력 원문

event: Hydrologic Outlook
headline: Hydrologic Outlook issued October 17 at 2:08PM AKDT by NWS Juneau AK
areaDesc: Glacier Bay; City and Borough of Juneau
sent: 2026-10-17T14:08:00-08:00
effective: 2026-10-17T14:08:00-08:00
onset: 2026-10-17T14:08:00-08:00
expires: 2026-10-18T14:15:00-08:00
status: Actual
messageType: Alert
description: ESFAJK

A strong storm system is expected to move over the northern Alaska
Panhandle beginning Monday night and continuing through Tuesday.
Juneau and Gustavus are expected to see periods of moderate to heavy
rain for a majority of the day on Tuesday, resulting in significant
and rapid rises on small creeks and streams. Rain totals for this
event are around 2-4 inches over a 36 hour period, though expected
totals will likely change as the event moves closer. At this time,
expect to see similar impacts to the previous storm system we saw on
Friday, where Salmon River, Jordan Creek, and Montana Creek reached
either near or into minor flood stage. Additionally, ponding of water
on roads and areas of poor drainage is possible.

Stay tuned to weather.gov/juneau as we continue to assess the
situation and make updates to the forecast.

### gemini-3.1-flash-lite

응답 2.568초 · HTTP 200

전체 번역:

수문학적 전망(Hydrologic Outlook)이 2026년 10월 17일 오후 2시 8분(AKDT)에 NWS Juneau AK에 의해 발표되었습니다. 강력한 폭풍 시스템이 월요일 밤부터 화요일까지 알래스카 팬핸들(Alaska Panhandle) 북부 지역으로 이동할 것으로 예상됩니다. 주노(Juneau)와 구스타버스(Gustavus) 지역은 화요일 대부분의 시간 동안 중간 정도에서 강한 비가 내릴 것으로 예상되며, 이로 인해 작은 개울과 하천의 수위가 급격히 상승할 것입니다. 이번 강우량은 36시간 동안 약 2~4인치(약 5.1~10.2cm)로 예상되나, 폭풍이 다가옴에 따라 예상 강우량은 변경될 수 있습니다. 현재로서는 지난 금요일 발생했던 폭풍과 유사한 영향이 예상되며, 당시 새먼 강(Salmon River), 조던 크릭(Jordan Creek), 몬태나 크릭(Montana Creek)이 경미한 홍수 단계에 도달하거나 근접했습니다. 또한 도로 위 물 고임 현상과 배수가 불량한 지역에서의 침수가 발생할 수 있습니다. 상황을 지속적으로 평가하고 예보를 업데이트할 예정이오니 weather.gov/juneau를 확인하십시오.

설명: 강한 폭풍으로 인해 하천 수위가 급격히 상승하고 도로 침수가 발생할 가능성이 있습니다.

요약:

- 일시: 2026년 10월 17일 월요일 밤 ~ 10월 18일 화요일
- 지역: 글레이셔 베이(Glacier Bay), 주노 시 및 자치구(City and Borough of Juneau)
- 조치: 기상 예보를 지속적으로 확인하고 하천 및 침수 위험 지역에 주의하십시오.

별도 행동 지침 번역: 상황을 지속적으로 평가하고 예보를 업데이트할 예정이오니 weather.gov/juneau를 확인하십시오.

용어: [{"term": "수문학적 전망(Hydrologic Outlook)", "meaning": "홍수나 하천 범람 등 수문학적 위험이 발생할 가능성이 있을 때 이를 미리 알리는 정보입니다."}, {"term": "홍수 단계(Flood stage)", "meaning": "하천의 수위가 상승하여 주변 지역에 피해를 줄 수 있는 기준 수위를 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.717초 · HTTP 200

전체 번역:

기상 개황(Hydrologic Outlook)
미국 국립기상청(NWS) 알래스카주 주노(Juneau AK)에서 2026년 10월 17일 오후 2시 08분 AKDT에 발표했습니다.
지역: 글레이셔베이(Glacier Bay); 주노 시 및 자치구(City and Borough of Juneau)
발송 시각: 2026년 10월 17일 오후 2시 08분 AKDT
효력 발생 시각: 2026년 10월 17일 오후 2시 08분 AKDT
만료 시각: 2026년 10월 18일 오후 2시 15분 AKDT

ESFAJK

월요일 밤부터 북부 알래스카 패핸들(Alaska Panhandle) 상공으로 강력한 폭풍우 시스템이 이동하여 화요일까지 이어질 것으로 예상됩니다. 주노(Juneau)와 구스타부스(Gustavus)에서는 화요일 하루 중 대부분 시간 동안 중등도에서 강한 비가 내려 소하천과 개울의 수위가 급격히 상승할 것입니다. 이번 기상 현상으로 인한 강수량은 36시간 동안 약 2~4인치(약 51~102밀리미터)가량 되겠으나, 기상 현상이 다가옴에 따라 예상 강수량은 변경될 수 있습니다. 현재로서는 금요일에 겪었던 이전 폭풍우 시스템과 유사한 영향이 나타날 것으로 예상되며, 당시 샐먼강(Salmon River), 조던 크릭(Jordan Creek), 몬태나 크릭(Montana Creek)이 소규모 홍수 단계에 근접하거나 진입했습니다. 아울러 도로 및 배수가 불량한 지역에 물이 고일 수 있습니다.

상황을 지속적으로 평가하고 예보를 업데이트할 예정이므로 weather.gov/juneau 웹사이트를 계속 주시해 주십시오.

설명: 강력한 폭풍우로 인해 소하천의 급격한 수위 상승과 도로 침수가 발생할 수 있습니다.

요약:

- 2026년 10월 17일 오후 2시 08분 AKDT 발표
- 글레이셔베이(Glacier Bay) 및 주노 시 및 자치구(City and Borough of Juneau) 지역 대상
- 월요일 밤부터 화요일까지 강력한 폭풍우로 인한 소하천 범람 및 도로 침수 가능성 대비

별도 행동 지침 번역: None

용어: [{"term": "Hydrologic Outlook", "meaning": "주요 수계의 홍수 가능성이나 수위 변화 등 수문학적 상황을 미리 알려주는 예보입니다."}, {"term": "Alaska Panhandle", "meaning": "알래스카주 남동부의 좁고 긴 띠 모양의 지역을 가리킵니다."}]

## US-16 — Lake Wind Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.609b6e05ec68ad193256f0a31d3cecf9cb6758ee.001.1

### 입력 원문

event: Lake Wind Advisory
headline: Lake Wind Advisory issued October 18 at 12:35PM EDT until October 18 at 8:00PM EDT by NWS Columbia SC
areaDesc: Lincoln; McDuffie; Columbia; Richmond; Burke; Chesterfield; McCormick; Newberry; Fairfield; Kershaw; Edgefield; Saluda; Lexington; Richland; Lee; Aiken; Sumter; Barnwell; Calhoun; Clarendon; Bamberg; Northern Lancaster; Southern Lancaster; Northwestern Orangeburg; Central Orangeburg; Southeastern Orangeburg
sent: 2026-10-18T12:35:00-04:00
effective: 2026-10-18T12:35:00-04:00
onset: 2026-10-18T12:35:00-04:00
ends: 2026-10-18T20:00:00-04:00
expires: 2026-10-18T20:00:00-04:00
status: Actual
messageType: Update
description: * WHAT...Northeast winds 10 to 20 mph with gusts up to 35 mph.

* WHERE...Portions of east central Georgia and central South
Carolina.

* WHEN...Until 8 PM EDT this evening.

* IMPACTS...Strong winds and rough waves on area lakes will create
hazardous conditions for small craft.

공식 별도 행동 지침:

Boaters on area lakes should use extra caution since strong winds and
rough waves can overturn small craft.

### gemini-3.1-flash-lite

응답 2.42초 · HTTP 200

전체 번역:

호수 강풍 주의보(Lake Wind Advisory)가 NWS Columbia SC에 의해 10월 18일 오후 12시 35분 EDT에 발표되어 10월 18일 오후 8시 00분 EDT까지 유효합니다. 대상 지역: Lincoln, McDuffie, Columbia, Richmond, Burke, Chesterfield, McCormick, Newberry, Fairfield, Kershaw, Edgefield, Saluda, Lexington, Richland, Lee, Aiken, Sumter, Barnwell, Calhoun, Clarendon, Bamberg, Northern Lancaster, Southern Lancaster, Northwestern Orangeburg, Central Orangeburg, Southeastern Orangeburg. 상세 내용: * 무엇을... 북동풍이 10~20 mph (약 16~32 km/h)로 불겠으며, 최대 35 mph (약 56 km/h)의 돌풍이 예상됩니다. * 어디서... 조지아주 동중부 및 사우스캐롤라이나주 중부 일부 지역. * 언제... 오늘 저녁 8시 EDT까지. * 영향... 강한 바람과 거친 파도가 호수 내 소형 선박에 위험한 환경을 조성할 것입니다.

설명: 호수 강풍 주의보는 강한 바람으로 인해 호수에서 소형 선박 운항이 위험해질 때 발령됩니다.

요약:

- 발표 시간: 10월 18일 오후 12시 35분 EDT
- 유효 기간: 10월 18일 오후 8시 00분 EDT까지
- 대상 지역: 조지아주 및 사우스캐롤라이나주 일부 지역

별도 행동 지침 번역: 호수에서 보트를 운항하는 분들은 강한 바람과 거친 파도로 인해 소형 선박이 전복될 수 있으므로 각별히 주의하십시오.

용어: [{"term": "Lake Wind Advisory", "meaning": "호수에서 강한 바람으로 인해 소형 선박이 전복될 위험이 있을 때 발령되는 주의보입니다."}, {"term": "Gusts", "meaning": "짧은 시간 동안 갑자기 강하게 부는 바람을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.677초 · HTTP 200

전체 번역:

호수 바람 주의보(Lake Wind Advisory)가 2026년 10월 18일 오후 12시 35분 EDT에 NWS 컬럼비아 SC(Columbia SC)에 의해 발령되었으며 2026년 10월 18일 오후 8시 00분 EDT까지 지속됩니다. 대상 지역: 링컨(Lincoln); 맥더피(McDuffie); 컬럼비아(Columbia); 리치먼드(Richmond); 버크(Burke); 체스터필드(Chesterfield); 코맥식(McCormick); 뉴베리(Newberry); 페어필드(Fairfield); 커쇼(Kershaw); 에지필드(Edgefield); 살루다(Saluda); 렉싱턴(Lexington); 리치랜드(Richland); 리(Lee); 에이킨(Aiken); 섬터(Sumter); 반웰(Barnwell); 칼훈(Calhoun); 클레런던(Clarendon); 밤버그(Bamberg); 노던 랭커스터(Northern Lancaster); 서던 랭커스터(Southern Lancaster); 노스웨스턴 오렌지버그(Northwestern Orangeburg); 센트럴 오렌지버그(Central Orangeburg); 사우스이스턴 오렌지버그(Southeastern Orangeburg). 주요 내용: * 무엇을... 북동풍 10~20 mph (약 16~32 km/h), 최대 35 mph (약 56 km/h)의 돌풍. * 어디서... 조지아주(Georgia) 동중앙부 및 사우스캐롤라이나주(South Carolina) 중부 일부 지역. * 언제... 오늘 저녁 8시 PM EDT까지. * 영향... 지역 호수의 강한 바람과 거친 파도로 인해 소형 선박에 위험한 조건이 조성됩니다.

설명: 호수에서 강한 바람과 거친 파도가 발생하여 소형 선박 운항에 위험을 초래합니다.

요약:

- 발령 시각: 2026년 10월 18일 오후 12시 35분 EDT (발표 당시 지속 상태)
- 종료 시각: 2026년 10월 18일 오후 8시 00분 EDT
- 대상 지역: 링컨(Lincoln), 맥더피(McDuffie), 컬럼비아(Columbia) 등 조지아주 및 사우스캐롤라이나주 여러 지역

별도 행동 지침 번역: 지역 호수의 보트 이용자들은 강한 바람과 거친 파도가 소형 선박을 전복시킬 수 있으므로 각별한 주의를 기울여 주십시오.

용어: [{"term": "Lake Wind Advisory", "meaning": "호수 근처에서 소형 선박에 위험을 줄 수 있는 강한 바람이 불 때 발령되는 주의보입니다."}]

## US-17 — Marine Weather Statement

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.6f7ea89e70383c6f99cb745d84a52878ffbbff0a.001.1

### 입력 원문

event: Marine Weather Statement
headline: Marine Weather Statement issued October 18 at 10:45AM EDT by NWS Baltimore MD/Washington DC
areaDesc: Tidal Potomac from Indian Head to Cobb Island MD
sent: 2026-10-18T10:45:00-04:00
effective: 2026-10-18T10:45:00-04:00
onset: 2026-10-18T10:45:00-04:00
expires: 2026-10-18T13:00:00-04:00
status: Actual
messageType: Alert
description: Northeasterly winds may gust up to 20 knots at times through 1 PM
this afternoon on the Potomac River from Indian Head to Cobb
Island, especially downstream of the US Route 301 bridge.
Mariners, especially those in small craft, should use caution and
be prepared for locally higher winds and waves.

### gemini-3.1-flash-lite

응답 2.016초 · HTTP 200

전체 번역:

해상 기상 정보(Marine Weather Statement)가 2026년 10월 18일 오전 10시 45분(EDT)에 미국 국립기상청(NWS) 볼티모어/워싱턴 DC 지부에서 발표되었습니다. 인디언 헤드(Indian Head)에서 콥 아일랜드(Cobb Island)에 이르는 포토맥 강(Potomac River) 구간에서는 오늘 오후 1시까지 북동풍이 때때로 최대 20노트의 돌풍으로 불 수 있으며, 특히 US 301번 국도 교량 하류 지역에서 주의가 필요합니다. 선원들, 특히 소형 선박 운항자는 주의를 기울이고 국지적으로 더 강한 바람과 파도에 대비하십시오.

설명: 강한 돌풍으로 인해 해상에서 파도가 높아질 수 있으므로 소형 선박 운항 시 주의가 필요합니다.

요약:

- 일시: 2026년 10월 18일 오전 10시 45분 ~ 오후 1시(EDT)
- 지역: 인디언 헤드(Indian Head) ~ 콥 아일랜드(Cobb Island) 구간 포토맥 강
- 조치: 소형 선박 운항자는 강한 바람과 파도에 대비하여 주의하십시오.

별도 행동 지침 번역: 선원들, 특히 소형 선박 운항자는 주의를 기울이고 국지적으로 더 강한 바람과 파도에 대비하십시오.

용어: [{"term": "노트(knots)", "meaning": "해상에서 사용하는 속도 단위로, 1노트는 시속 약 1.85km입니다."}, {"term": "해상 기상 정보(Marine Weather Statement)", "meaning": "해상 활동에 영향을 줄 수 있는 기상 상황을 알리는 예보입니다."}]

### gemini-3.5-flash-lite

응답 2.185초 · HTTP 200

전체 번역:

해상 날씨 예보: 미국 국립기상청(NWS) 볼티모어 MD/워싱턴 DC에서 2026년 10월 18 오전 10시 45분 EDT에 발표한 해상 날씨 예보입니다. 대상 구역: 인디언 헤드에서 콥 아일랜드 MD까지의 조수 포토맥 강. 발효 시각: 2026년 10월 18일 오전 10시 45분 EDT. 만료 시각: 2026년 10월 18일 오후 1시 00분 EDT. 설명: 인디언 헤드에서 콥 아일랜드에 이르는 포토맥 강에서는 오늘 오후 1시까지 북동풍이 때때로 20노트까지 돌풍을 불 수 있으며, 특히 US 루트 301 다리 하류 지역에서 그렇습니다. 항해자들, 특히 소형 선박에 승선한 분들은 주의를 기울이고 국지적으로 더 강한 바람과 파도에 대비하십시오.

설명: 해상 기상 악화로 인해 강한 돌풍과 높은 파도가 발생할 수 있어 항해 시 주의가 필요합니다.

요약:

- 2026년 10월 18일 오전 10시 45분 EDT 발표
- 대상 지역: 인디언 헤드에서 콥 아일랜드 MD까지의 조수 포토맥 강
- 소형 선박 등 항해자는 강한 돌풍과 파도에 대비하여 주의를 기울이십시오.

별도 행동 지침 번역: 항해자들, 특히 소형 선박에 승선한 분들은 주의를 기울이고 국지적으로 더 강한 바람과 파도에 대비하십시오.

용어: [{"term": "Marine Weather Statement", "meaning": "주요 해상 위험 기상에 대해 주의를 당부하는 예보입니다."}, {"term": "노트 (knot)", "meaning": "해상 및 항공에서 사용하는 풍속 단위로, 1노트는 약 1.852 km/h입니다."}]

## US-18 — Rip Current Statement

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.ccaa7e68bebf2988f639e7dee8baea63306e9ef8.002.1

### 입력 원문

event: Rip Current Statement
headline: Rip Current Statement issued October 18 at 11:50AM EDT until October 18 at 8:00PM EDT by NWS Wilmington NC
areaDesc: Coastal New Hanover
sent: 2026-10-18T11:50:00-04:00
effective: 2026-10-18T11:50:00-04:00
onset: 2026-10-18T11:50:00-04:00
ends: 2026-10-18T20:00:00-04:00
expires: 2026-10-18T20:00:00-04:00
status: Actual
messageType: Update
description: * WHAT...Dangerous rip currents expected. There is also a strong
north to south longshore current expected.

* WHERE...Coastal New Hanover County.

* WHEN...From 6 AM EDT Sunday through Sunday evening.

* IMPACTS...Rip currents can sweep even the best swimmers away
from shore into deeper water.

공식 별도 행동 지침:

Swim near a lifeguard. If caught in a rip current, relax and
float. Don't swim against the current. If able, swim in a
direction following the shoreline. If unable to escape, face the
shore and call or wave for help.

### gemini-3.1-flash-lite

응답 2.342초 · HTTP 200

전체 번역:

이안류 주의보(Rip Current Statement)가 2026년 10월 18일 오전 11시 50분 EDT부터 2026년 10월 18일 오후 8시 00분 EDT까지 NWS Wilmington NC에 의해 발표되었습니다. 대상 지역: Coastal New Hanover. 위험 요소: 위험한 이안류가 예상되며, 북쪽에서 남쪽으로 흐르는 강한 연안류도 예상됩니다. 영향: 이안류는 수영 실력이 뛰어난 사람이라도 해안에서 먼 깊은 물속으로 휩쓸어 갈 수 있습니다.

설명: 이안류는 해안에서 바다 쪽으로 빠르게 빠져나가는 좁고 강한 물의 흐름을 의미합니다.

요약:

- 일시: 2026년 10월 18일 오전 11시 50분 ~ 오후 8시 00분 EDT
- 지역: Coastal New Hanover
- 행동: 인명 구조원이 있는 곳에서 수영하고 이안류에 휩쓸리면 흐름을 거스르지 말고 해안과 평행하게 헤엄치십시오.

별도 행동 지침 번역: 인명 구조원 근처에서 수영하십시오. 이안류에 휩쓸리면 긴장을 풀고 몸을 물에 띄우십시오. 흐름을 거슬러 헤엄치지 마십시오. 가능하다면 해안선과 평행한 방향으로 헤엄치십시오. 탈출할 수 없다면 해안을 향해 도움을 요청하거나 손을 흔드십시오.

용어: [{"term": "이안류(Rip Current)", "meaning": "해안으로 밀려오던 파도가 갑자기 좁은 통로를 통해 바다 쪽으로 빠르게 되돌아가는 강한 물의 흐름입니다."}, {"term": "연안류(Longshore Current)", "meaning": "해안선과 평행하게 흐르는 바닷물의 흐름으로, 해안을 따라 이동하는 성질이 있습니다."}]

### gemini-3.5-flash-lite

응답 2.758초 · HTTP 200

전체 번역:

이건 기상 경보입니다. 이벤트: 이안류 경보. 헤드라인: 윌밍턴 NC 국립기상청(NWS Wilmington NC)에 의해 10월 18일 오전 11시 50분 EDT에 발표되어 10월 18일 오후 8시 00분 EDT까지 유효한 이안류 경보. 지역 설명: 해안 뉴핸오버(Coastal New Hanover). 발송 시간: 2026년 10월 18일 오전 11시 50분 EDT. 유효 시간: 2026년 10월 18일 오전 11시 50분 EDT. 시작 시간: 2026년 10월 18일 오전 11시 50분 EDT. 종료 시간: 2026년 10월 18일 오후 8시 00분 EDT. 만료 시간: 2026년 10월 18일 오후 8시 00분 EDT. 상태: 실제(Actual). 메시지 유형: 업데이트(Update). 설명: * 무엇이... 위험한 이안류가 예상됩니다. 또한 강력한 북쪽에서 남쪽으로 향하는 연안류도 예상됩니다. * 어디에서... 해안 뉴핸오버 카운티(Coastal New Hanover County). * 언제... 일요일 오전 6시 EDT부터 일요일 저녁까지. * 영향... 이안류는 수영을 가장 잘하는 사람조차도 해안에서 더 깊은 물로 휩쓸어 갈 수 있습니다.

설명: 이안류는 해안으로 밀려오는 파도가 바다로 빠져나가는 강력한 물살로, 수영 실력과 관계없이 사람을 깊은 곳으로 휩쓸어 갈 수 있어 위험합니다.

요약:

- 2026년 10월 18일 오전 11시 50분 EDT에 해안 뉴핸오버(Coastal New Hanover) 지역에 이안류 경보가 발표되었습니다.
- 위험한 이안류와 연안류가 예상되며 2026년 10월 18일 오후 8시 00분 EDT까지 지속됩니다.
- 안전요원 근처에서 수영하시고 이안류에 휩쓸릴 경우 긴장을 풀고 물 위에 떠 있으십시오.

별도 행동 지침 번역: 안전요원 근처에서 수영하십시오. 이안류에 휩쓸린 경우, 긴장을 풀고 몸을 뜨게 하십시오. 물살을 거슬러 수영하지 마십시오. 가능하면 해안선과 평행한 방향으로 수영하십시오. 빠져나갈 수 없는 경우, 해안을 바라보며 도움을 요청하거나 손을 흔드십시오.

용어: [{"term": "이안류 (Rip Current)", "meaning": "해안에서 바다 쪽으로 강하게 빠져나가는 좁은 물살입니다."}, {"term": "연안류 (Longshore Current)", "meaning": "해안선과 나란한 방향으로 흐르는 해류입니다."}]

## US-19 — Small Craft Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.f81c779fb864b3e1009098c4e1b851e6a0386923.001.1

### 입력 원문

event: Small Craft Advisory
headline: Small Craft Advisory issued October 18 at 8:59AM PDT until October 18 at 5:00PM PDT by NWS Eureka CA
areaDesc: Waters from Pt. St. George to Cape Mendocino CA from 10 to 60 nm
sent: 2026-10-18T08:59:00-07:00
effective: 2026-10-18T08:59:00-07:00
onset: 2026-10-18T08:59:00-07:00
ends: 2026-10-18T17:00:00-07:00
expires: 2026-10-18T17:00:00-07:00
status: Actual
messageType: Update
description: * WHAT...North winds 15 to 25 kt with gusts up to 30 kt and seas
9 to 12 feet.

* WHERE...Waters from Pt. St. George to Cape Mendocino CA from
10 to 60 nm.

* WHEN...Until 5 PM PDT this afternoon.

* IMPACTS...Conditions will be hazardous to small craft.

공식 별도 행동 지침:

Inexperienced mariners, especially those operating smaller
vessels, should avoid navigating in hazardous conditions.

### gemini-3.1-flash-lite

응답 2.163초 · HTTP 200

전체 번역:

소형 선박 주의보(Small Craft Advisory)가 10월 18일 오전 8시 59분 PDT에 미국 국립기상청(NWS) 유레카(Eureka) 지부에 의해 발표되었습니다. 적용 지역은 세인트 조지 곶(Pt. St. George)에서 멘도시노 곶(Cape Mendocino)까지의 해안에서 10~60해리 떨어진 해역입니다. 본 주의보는 10월 18일 오후 5시 PDT까지 유효합니다. 상세 내용: 북풍이 15~25노트(시속 약 28~46km)로 불고 돌풍은 최대 30노트(시속 약 56km)에 달하며 파고는 9~12피트(약 2.7~3.7미터)로 예상됩니다. 이러한 기상 조건은 소형 선박에 위험을 초래할 수 있습니다.

설명: 강한 바람과 높은 파도로 인해 소형 선박의 운항이 위험한 상태입니다.

요약:

- 발표 시간: 10월 18일 오전 8시 59분 PDT
- 적용 지역: 세인트 조지 곶(Pt. St. George)에서 멘도시노 곶(Cape Mendocino)까지 10~60해리 해역
- 종료 시간: 10월 18일 오후 5시 PDT

별도 행동 지침 번역: 경험이 부족한 선원, 특히 소형 선박을 운항하는 선원은 위험한 기상 조건에서의 항해를 피하십시오.

용어: [{"term": "소형 선박 주의보(Small Craft Advisory)", "meaning": "강풍이나 높은 파도로 인해 소형 선박이 운항하기에 위험한 기상 조건이 예상될 때 발표됩니다."}, {"term": "노트(kt)", "meaning": "해상에서 사용하는 속도 단위로, 1노트는 시속 약 1.85km입니다."}, {"term": "해리(nm)", "meaning": "해상 거리 단위로, 1해리는 약 1.85km입니다."}]

### gemini-3.5-flash-lite

응답 1.953초 · HTTP 200

전체 번역:

소형 선박 주의보(Small Craft Advisory)가 캘리포니아주 유리카 NWS에 의해 2026년 10월 18일 오전 8시 59분 PDT에 발표되어 2026년 10월 18일 오후 5시 00분 PDT까지 유효합니다. 무엇을... 북풍 15~25노트, 돌풍 최대 30노트, 파고 9~12피트. 어디서... 캘리포니아주 포인트 세인트 조지(Pt. St. George)에서 케이프 멘도시노(Cape Mendocino)까지 10~60해리 해역. 언제... 오늘 오후 5시 PDT까지. 영향... 해상 조건이 소형 선박에 위험합니다.

설명: 소형 선박에 위험한 강풍과 높은 파도가 예상되는 해상 기상 상황입니다.

요약:

- 발령 시간: 2026년 10월 18일 오전 8시 59분 PDT
- 종료 시간: 2026년 10월 18일 오후 5시 00분 PDT
- 대상 지역: 포인트 세인트 조지에서 케이프 멘도시노까지 10~60해리 해역

별도 행동 지침 번역: 경험이 부족한 선박 운항자, 특히 소형 선박을 조종하는 운항자는 위험한 기상 조건에서의 항해를 피하십시오.

용어: [{"term": "Small Craft Advisory", "meaning": "소형 선박에 위험한 풍속이나 파도가 예상될 때 발령되는 주의보입니다."}, {"term": "kt", "meaning": "해상 풍속 단위인 노트(knot)를 의미합니다."}]

## US-20 — Special Weather Statement

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.d71584b26bfb39b58a1073ade931c0a2ed30e5dc.001.1

### 입력 원문

event: Special Weather Statement
headline: Special Weather Statement issued October 18 at 6:29AM AKDT by NWS Fairbanks AK
areaDesc: Eastern Norton Sound and Nulato Hills; Yukon Delta Coast; Lower Yukon River; Lower Yukon and Innoko Valleys
sent: 2026-10-18T06:29:00-08:00
effective: 2026-10-18T06:29:00-08:00
onset: 2026-10-18T06:29:00-08:00
expires: 2026-10-18T16:00:00-08:00
status: Actual
messageType: Alert
description: * WHAT...Total snow accumulations of up to 2 to 4 inches expected
with rain mixing in with snow at times. Winds gusting as high
as 30 mph.

* WHERE...Eastern Norton Sound, Nulato Hills, Yukon Delta Coast,
Lower Yukon Valley, and Innoko Valley.

* WHEN...From Sunday afternoon through Monday.

* IMPACTS...Travel could be difficult. Snow could be heavy at
times. Areas of blowing snow could significantly reduce
visibility.

공식 별도 행동 지침:

Slow down and use caution while traveling.

### gemini-3.1-flash-lite

응답 2.161초 · HTTP 200

전체 번역:

특별 기상 성명. 2026년 10월 18일 오전 6시 29분 AKDT, 미국 국립기상청(NWS) 페어뱅크스(Fairbanks) 지부 발표. 대상 지역: 이스턴 노턴 사운드(Eastern Norton Sound) 및 눌라토 힐스(Nulato Hills), 유콘 델타 코스트(Yukon Delta Coast), 로어 유콘 리버(Lower Yukon River), 로어 유콘 밸리(Lower Yukon Valley) 및 인노코 밸리(Innoko Valley). 내용: * 예상 적설량은 최대 2~4인치이며, 때때로 비가 섞여 내릴 수 있습니다. 최대 시속 30 mph (약 48 km/h)의 돌풍이 예상됩니다. * 영향 지역: 이스턴 노턴 사운드(Eastern Norton Sound), 눌라토 힐스(Nulato Hills), 유콘 델타 코스트(Yukon Delta Coast), 로어 유콘 밸리(Lower Yukon Valley) 및 인노코 밸리(Innoko Valley). * 시기: 일요일 오후부터 월요일까지. * 영향: 이동이 어려울 수 있습니다. 눈이 때때로 강하게 내릴 수 있으며, 눈보라가 치는 지역에서는 가시거리가 크게 줄어들 수 있습니다.

설명: 눈과 강한 바람으로 인해 도로가 미끄럽고 가시거리가 짧아져 이동 시 위험할 수 있습니다.

요약:

- 일시: 2026년 10월 18일 일요일 오후부터 월요일까지
- 지역: 이스턴 노턴 사운드, 눌라토 힐스, 유콘 델타 코스트, 로어 유콘 밸리, 인노코 밸리
- 조치: 이동 시 속도를 줄이고 주의하십시오.

별도 행동 지침 번역: 이동 시 속도를 줄이고 주의하십시오.

용어: [{"term": "Special Weather Statement", "meaning": "기상 상황이 급변하거나 주의가 필요한 기상 현상이 예상될 때 발표하는 예보입니다."}, {"term": "Blowing snow", "meaning": "강한 바람에 의해 지면의 눈이 날려 시야를 가리는 현상입니다."}]

### gemini-3.5-flash-lite

응답 1.914초 · HTTP 200

전체 번역:

특수 날씨 예보 (Special Weather Statement). NWS Fairbanks AK에서 2026년 10월 18일 오전 6시 29분 AKDT에 발표했습니다. 대상 지역: Eastern Norton Sound and Nulato Hills; Yukon Delta Coast; Lower Yukon River; Lower Yukon and Innoko Valleys. * 내용: 비가 때때로 눈과 섞여 내리면서 총 2~4인치의 적설량이 예상됩니다. 최대 30 mph (약 48 km/h)의 돌풍이 불겠습니다. * 지역: Eastern Norton Sound, Nulato Hills, Yukon Delta Coast, Lower Yukon Valley, Innoko Valley. * 시기: 일요일 오후부터 월요일까지. * 영향: 이동이 어려울 수 있습니다. 눈이 때때로 강하게 내릴 수 있습니다. 눈보라가 치는 지역에서는 시정이 크게 저하될 수 있습니다.

설명: 눈과 강한 바람으로 인해 가시거리가 짧아지고 도로가 미끄러워질 수 있습니다.

요약:

- 2026년 10월 18일 오전 6시 29분 AKDT 발표
- Eastern Norton Sound and Nulato Hills 외 대상
- 이동 시 속도를 줄이고 주의하십시오

별도 행동 지침 번역: 이동 시 속도를 줄이고 주의하십시오.

용어: [{"term": "Special Weather Statement", "meaning": "주목할 만한 기상 현상이 예상될 때 발표하는 특수 날씨 예보입니다."}, {"term": "Snow Accumulations", "meaning": "내려서 쌓인 눈의 총량을 의미합니다."}]

## US-21 — Storm Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.446e1ab62f8cc1ac6e89ab7c82dcfb7d4c3076f9.002.2

### 입력 원문

event: Storm Watch
headline: The Storm Watch has been replaced. Please see the latest information from NWS Newport/Morehead City NC on this developing situation.
areaDesc: Waters from Oregon Inlet to Cape Hatteras NC from 20 to 60 NM; Waters from Cape Hatteras to Ocracoke Inlet NC from 20 to 60 NM
sent: 2026-10-17T03:04:00-04:00
effective: 2026-10-17T03:04:00-04:00
onset: 2026-10-17T20:00:00-04:00
ends: 2026-10-19T00:00:00-04:00
expires: 2026-10-17T03:19:33-04:00
status: Actual
messageType: Alert
description: The Storm Watch has been replaced. Please see the latest information from NWS Newport/Morehead City NC on this developing situation.

공식 별도 행동 지침:

Mariners should remain in port, alter course, and/or secure the
vessel for severe conditions.

### gemini-3.1-flash-lite

응답 2.164초 · HTTP 200

전체 번역:

폭풍 주의보(Storm Watch)가 대체되었습니다. 이 전개 상황에 대한 미국 국립기상청(NWS) 뉴포트/모어헤드 시티(Newport/Morehead City) 지부의 최신 정보를 확인하십시오. 대상 지역: 오리건 인렛(Oregon Inlet)에서 케이프 해터라스(Cape Hatteras)까지의 해역(20~60 해리); 케이프 해터라스(Cape Hatteras)에서 오크라코크 인렛(Ocracoke Inlet)까지의 해역(20~60 해리). 발행 시간: 2026년 10월 17일 오전 3시 04분(EDT). 발효 시간: 2026년 10월 17일 오전 3시 04분(EDT). 시작 시간: 2026년 10월 17일 오후 8시 00분(EDT). 종료 시간: 2026년 10월 19일 오전 12시 00분(EDT). 만료 시간: 2026년 10월 17일 오전 3시 19분(EDT).

설명: 폭풍 주의보는 악천후가 발생할 가능성이 있어 주의가 필요한 상태를 의미합니다.

요약:

- 발효 기간: 2026년 10월 17일 오전 3시 04분부터 2026년 10월 19일 오전 12시 00분까지
- 대상 지역: 오리건 인렛(Oregon Inlet)에서 오크라코크 인렛(Ocracoke Inlet)까지의 해역
- 조치 사항: 항구에 머무르거나 항로를 변경하고 선박을 안전하게 고정하십시오.

별도 행동 지침 번역: 선박 운항자는 항구에 머무르거나 항로를 변경하고, 악천후에 대비하여 선박을 안전하게 고정하십시오.

용어: [{"term": "Storm Watch", "meaning": "폭풍이 발생할 가능성이 높아 기상 상황을 예의주시해야 하는 상태입니다."}, {"term": "NM (Nautical Mile)", "meaning": "해상 거리를 나타내는 단위인 해리입니다."}]

### gemini-3.5-flash-lite

응답 2.796초 · HTTP 200

전체 번역:

발행 시각: 2026년 10월 17일 오전 3시 04분 EDT. 발효 시각: 2026년 10월 17일 오전 3시 04분 EDT. 시작 시각: 2026년 10월 17일 오후 8시 00분 EDT. 종료 시각: 2026년 10월 19일 자정 EDT. 만료 시각: 2026년 10월 17일 오전 3시 19분 33초 EDT. 지역: 오리건 인렛(Oregon Inlet)에서 케이프 해터러스(Cape Hatteras) NC 해역 20~60 NM; 케이프 해터러스(Cape Hatteras)에서 오크러코크 인렛(Ocracoke Inlet) NC 해역 20~60 NM. 폭풍 경보(Storm Watch)가 대체되었습니다. 본 발달 상황에 대한 미국 국립기상청(NWS) 뉴포트/모어헤드시티(Newport/Morehead City NC)의 최신 정보를 확인하십시오.

설명: 해상에서 위험한 기상 조건이 예상될 때 선박 운항에 주의를 기울여야 합니다.

요약:

- 시작: 2026년 10월 17일 오후 8시 00분 EDT
- 지역: 오리건 인렛(Oregon Inlet) 및 케이프 해터러스(Cape Hatteras) 인근 해역
- 조치: 최신 기상 정보를 확인하고 항해 안전 조치를 취하십시오.

별도 행동 지침 번역: 선박 운항자들은 항구에 머물고, 항로를 변경하며, 혹은 심각한 기상 조건에 대비하여 선박을 안전하게 결박해야 합니다.

용어: [{"term": "NM", "meaning": "해리(Nautical Mile)로, 해상 거리 단위입니다."}, {"term": "Storm Watch", "meaning": "폭풍 등 위험 기상이 발생할 가능성이 있어 대비가 권고되는 예비 경보 단계입니다."}]

## US-22 — Wind Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.a2e1b800c157a7bb9e592b3fe0c4a62c5c1ce05b.002.1

### 입력 원문

event: Wind Advisory
headline: Wind Advisory issued October 18 at 11:27AM EDT until October 20 at 6:00AM EDT by NWS Newport/Morehead City NC
areaDesc: Northern Outer Banks; Ocracoke Island; Hatteras Island
sent: 2026-10-18T11:27:00-04:00
effective: 2026-10-18T11:27:00-04:00
onset: 2026-10-18T11:27:00-04:00
ends: 2026-10-20T06:00:00-04:00
expires: 2026-10-19T04:00:00-04:00
status: Actual
messageType: Update
description: * WHAT...North winds 25 to 35 mph with gusts up to 45 mph.

* WHERE...Hatteras Island, Northern Outer Banks, and Ocracoke Island.

* WHEN...Until 6 AM EDT Tuesday.

* IMPACTS...Gusty winds will blow around unsecured objects. Tree
limbs could be blown down and a few power outages may result.

공식 별도 행동 지침:

Winds this strong can make driving difficult, especially for high
profile vehicles. Use extra caution.

Secure outdoor objects.

### gemini-3.1-flash-lite

응답 2.193초 · HTTP 200

전체 번역:

강풍 주의보(Wind Advisory)가 2026년 10월 18일 오전 11시 27분 EDT에 미국 기상청(NWS) 뉴포트/모어헤드 시티(Newport/Morehead City) 지부에 의해 발표되었습니다. 대상 지역은 노던 아우터 뱅크스(Northern Outer Banks), 오크라코크 섬(Ocracoke Island), 해터러스 섬(Hatteras Island)입니다. 상세 내용: * 무엇이... 북풍이 25~35 mph (약 40~56 km/h)로 불겠으며, 최대 45 mph (약 72 km/h)의 돌풍이 예상됩니다. * 어디서... 해터러스 섬(Hatteras Island), 노던 아우터 뱅크스(Northern Outer Banks), 오크라코크 섬(Ocracoke Island). * 언제... 화요일 오전 6시 EDT까지. * 영향... 강한 돌풍으로 인해 고정되지 않은 물체가 날아갈 수 있습니다. 나뭇가지가 부러질 수 있으며 일부 지역에서는 정전이 발생할 수 있습니다.

설명: 강풍 주의보는 일상적인 활동에 지장을 줄 수 있는 강한 바람이 불 때 발령됩니다.

요약:

- 발표 시간: 2026년 10월 18일 오전 11시 27분 EDT
- 대상 지역: 노던 아우터 뱅크스, 오크라코크 섬, 해터러스 섬
- 지속 시간: 2026년 10월 20일 오전 6시 EDT까지

별도 행동 지침 번역: 이 정도 강도의 바람은 운전을 어렵게 만들 수 있으며, 특히 차체가 높은 차량은 더욱 주의하십시오. 야외 물건을 단단히 고정하십시오.

용어: [{"term": "강풍 주의보(Wind Advisory)", "meaning": "지속적인 바람이나 돌풍이 특정 기준치 이상으로 불어 주의가 필요할 때 발령되는 기상 정보입니다."}, {"term": "돌풍(Gusts)", "meaning": "짧은 시간 동안 갑자기 강하게 부는 바람을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.84초 · HTTP 200

전체 번역:

강풍 주의보(Wind Advisory)가 NWS Newport/Morehead City NC에서 2026년 10월 18일 오전 11:27 EDT에 발령되었습니다. Northern Outer Banks; Ocracoke Island; Hatteras Island 지역에 적용됩니다. * 무엇을... 북풍 25~35 mph (약 40~56 km/h), 최대 순간풍속 45 mph (약 72 km/h). * 어디서... Hatteras Island, Northern Outer Banks, Ocracoke Island. * 언제... 화요일 오전 6시 EDT까지. * 영향... 돌풍으로 인해 고정되지 않은 물체가 날아갈 수 있으며, 나뭇가지가 부러지고 일부 지역에 정전이 발생할 수 있습니다.

설명: 강풍 주의보는 강한 바람으로 인해 일상생활과 운전에 위험이 발생할 수 있음을 경고하는 기상 정보입니다.

요약:

- 2026년 10월 18일 오전 11:27 EDT부터 2026년 10월 20일 오전 6:00 EDT까지 Northern Outer Banks, Ocracoke Island, Hatteras Island 지역에 강풍 주의보가 발표되었습니다.
- 북풍 25~35 mph (약 40~56 km/h) 및 최대 순간풍속 45 mph (약 72 km/h)의 강한 바람이 불 예정입니다.
- 야외의 고정되지 않은 물체를 단단히 고정하고 운전 시 각별히 주의하십시오.

별도 행동 지침 번역: 이처럼 강한 바람은 특히 차체가 높은 차량의 운전을 어렵게 만들 수 있으므로 각별히 주의하십시오. 야외의 물체를 단단히 고정하십시오.

용어: [{"term": "Wind Advisory", "meaning": "강풍 주의보로, 주의를 기울여야 하는 강한 바람이 불 때 발령됩니다."}, {"term": "EDT", "meaning": "미국 동부 일광 절약 시간대입니다."}]

## US-23 — Winter Storm Watch

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.015e276ec830f7f557225b895ba7b32f9602aab7.001.1

### 입력 원문

event: Winter Storm Watch
headline: Winter Storm Watch issued October 18 at 6:06AM AKDT until October 21 at 4:00PM AKDT by NWS Fairbanks AK
areaDesc: Northern Denali Borough; Southern Denali Borough
sent: 2026-10-18T06:06:00-08:00
effective: 2026-10-18T06:06:00-08:00
onset: 2026-10-19T16:00:00-08:00
ends: 2026-10-21T16:00:00-08:00
expires: 2026-10-18T16:00:00-08:00
status: Actual
messageType: Alert
description: * WHAT...Heavy snow possible. Total snow accumulations of 8 to 12
inches possible with higher amounts above pass level. Winds could
gust as high as 40 mph.

* WHERE...Denali Borough.

* WHEN...From Monday afternoon through Wednesday afternoon.

* IMPACTS...Travel could be very difficult.

* ADDITIONAL DETAILS...Following strong southerly winds on Monday,
winds will shift to being out of the north on Tuesday into
Wednesday with gusts up to 40 mph possible.

공식 별도 행동 지침:

Monitor the latest forecasts for updates on this situation.

### gemini-3.1-flash-lite

응답 2.223초 · HTTP 200

전체 번역:

겨울 폭풍 주의보(Winter Storm Watch)가 2026년 10월 18일 오전 6시 6분 AKDT에 NWS Fairbanks AK에 의해 발표되었습니다. 유효 기간은 2026년 10월 21일 오후 4시 AKDT까지입니다. 무엇을... 폭설이 예상됩니다. 총 8~12인치(약 20~30cm)의 적설량이 예상되며, 고갯길 위쪽으로는 더 많은 양이 쌓일 수 있습니다. 바람은 시속 40 mph (약 64 km/h)까지 불 수 있습니다. 어디서... 디날리 자치구(Denali Borough). 언제... 월요일 오후부터 수요일 오후까지. 영향... 이동이 매우 어려울 수 있습니다. 추가 세부 사항... 월요일의 강한 남풍 이후, 화요일부터 수요일까지 바람은 북풍으로 바뀌겠으며 시속 40 mph (약 64 km/h)의 돌풍이 불 수 있습니다.

설명: 겨울 폭풍 주의보는 많은 양의 눈과 강한 바람으로 인해 이동이 위험해질 가능성이 있을 때 발령됩니다.

요약:

- 발령 시간: 2026년 10월 18일 오전 6시 6분 AKDT
- 대상 지역: 디날리 자치구(Denali Borough)
- 발생 기간: 2026년 10월 19일 오후 4시부터 10월 21일 오후 4시까지

별도 행동 지침 번역: 이 상황에 대한 최신 예보를 지속적으로 확인하십시오.

용어: [{"term": "겨울 폭풍 주의보(Winter Storm Watch)", "meaning": "폭설이나 결빙 등 위험한 겨울 기상 현상이 발생할 가능성이 높음을 알리는 예비 단계의 경보입니다."}, {"term": "돌풍(Gust)", "meaning": "짧은 시간 동안 갑자기 강하게 부는 바람을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.444초 · HTTP 200

전체 번역:

발표 시간: 2026년 10월 18일 오전 6:06 AKDT (NWS Fairbanks AK)
발효 대상 지역: Northern Denali Borough, Southern Denali Borough (Denali Borough)
이벤트: 겨울 폭풍 주의보(Winter Storm Watch)

* 영향... 폭설이 발생할 가능성이 있습니다. 고개(pass) 수준보다 높은 지역에서는 더 많은 양을 포함하여 총 8~12인치의 눈이 쌓일 수 있습니다. 바람은 최대 40 mph (약 64 km/h)의 돌풍을 동반할 수 있습니다.
* 지역... 디날리 자치구(Denali Borough).
* 시기... 월요일 오후부터 수요일 오후까지.
* 영향... 이동이 매우 어려울 수 있습니다.
* 추가 세부 사항... 월요일의 강한 남풍에 이어, 화요일부터 수요일까지는 북풍으로 바람이 바뀌며 최대 40 mph (약 64 km/h)의 돌풍이 불 수 있습니다.

설명: 겨울 폭풍 주의보는 폭설과 강풍으로 인해 이동이 위험해질 수 있음을 예고하는 기상 경보입니다.

요약:

- 2026년 10월 19일 오후부터 2026년 10월 21일 오후까지 Northern Denali Borough 및 Southern Denali Borough (Denali Borough) 지역에 겨울 폭풍 주의보가 발표되었습니다.
- 최대 8~12인치의 적설량과 최대 40 mph (약 64 km/h)의 돌풍이 예상됩니다.
- 이동이 매우 어려울 수 있으니 최신 일기예보를 모니터링하십시오.

별도 행동 지침 번역: 최신 일기예보를 모니터링하여 본 상황에 대한 업데이트를 확인하십시오.

용어: [{"term": "Winter Storm Watch", "meaning": "겨울 폭풍 주의보로, 폭설 등 악천후가 발생할 가능성이 있어 주의를 기울여야 하는 단계입니다."}, {"term": "Snow accumulations", "meaning": "눈이 쌓이는 양(적설량)을 의미합니다."}]

## US-24 — Winter Weather Advisory

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.baf388d6888090e97656862a191f1ba9c989cd12.001.1

### 입력 원문

event: Winter Weather Advisory
headline: Winter Weather Advisory issued October 18 at 4:54AM AKDT until October 20 at 4:00PM AKDT by NWS Anchorage AK
areaDesc: Northern Copper Valley
sent: 2026-10-18T04:54:00-08:00
effective: 2026-10-18T04:54:00-08:00
onset: 2026-10-19T04:00:00-08:00
ends: 2026-10-20T16:00:00-08:00
expires: 2026-10-18T16:45:00-08:00
status: Actual
messageType: Alert
description: * WHAT...Snow expected. Total snow accumulations between 4 and 8
inches.

* WHERE...Northern Copper Valley, including the eastern Denali
Highway, Paxson, and Isabel Pass.

* WHEN...From 4 AM Monday to 4 PM AKDT Tuesday.

* IMPACTS...Travel could be difficult. Be prepared for slippery
roads.

공식 별도 행동 지침:

Slow down and use caution while traveling. For the latest road
conditions call 5 1 1 or visit 511.alaska.gov.

### gemini-3.1-flash-lite

응답 1.933초 · HTTP 200

전체 번역:

겨울철 기상 주의보(Winter Weather Advisory)가 2026년 10월 18일 오전 4시 54분 AKDT에 앵커리지(Anchorage) 국립기상청(NWS)에 의해 발표되었으며 2026년 10월 20일 오후 4시 AKDT까지 유효합니다. 무엇을... 눈이 예상됩니다. 총 적설량은 4~8인치(약 10~20cm)가 되겠습니다. 어디서... 북부 코퍼 밸리(Northern Copper Valley) 지역으로, 데날리 고속도로(Denali Highway) 동부, 팩슨(Paxson), 이자벨 패스(Isabel Pass)를 포함합니다. 언제... 월요일 오전 4시부터 화요일 오후 4시 AKDT까지입니다. 영향... 이동이 어려울 수 있습니다. 도로가 미끄러울 수 있으니 대비하십시오.

설명: 겨울철 기상 주의보는 눈이나 얼음으로 인해 도로 상황이 악화되어 이동에 지장이 생길 가능성이 있을 때 발령됩니다.

요약:

- 발효 기간: 10월 19일 오전 4시 ~ 10월 20일 오후 4시 AKDT
- 대상 지역: 북부 코퍼 밸리(Northern Copper Valley) 및 인근 지역
- 조치 사항: 미끄러운 도로에 대비하고 이동 시 주의하십시오.

별도 행동 지침 번역: 이동 시 속도를 줄이고 주의하십시오. 최신 도로 상황은 511번으로 전화하거나 511.alaska.gov를 방문하여 확인하십시오.

용어: [{"term": "겨울철 기상 주의보(Winter Weather Advisory)", "meaning": "겨울철 기상 현상으로 인해 도로가 미끄러워지거나 이동이 어려워질 것으로 예상될 때 발령되는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 1.979초 · HTTP 200

전체 번역:

겨울철 날씨 주의보(Winter Weather Advisory)가 미국 국립기상청 앵커리지(NWS Anchorage AK)에 의해 2026년 10월 18일 오전 4시 54분(AKDT)에 발령되었으며 2026년 10월 20일 오후 4시(AKDT)까지 유효합니다. 대상 지역은 노던 코퍼 밸리(Northern Copper Valley)입니다. * 무엇을... 눈이 예상됩니다. 총 적설량은 4~8인치입니다. * 어디서... 동부 데날리 하이웨이(Denali Highway), 팩슨(Paxson), 이사벨 패스(Isabel Pass)를 포함한 노던 코퍼 밸리(Northern Copper Valley). * 언제... 월요일 오전 4시부터 화요일 오후 4시(AKDT)까지. * 영향... 통행이 어려울 수 있습니다. 미끄러운 도로에 대비하십시오.

설명: 겨울철 악천후로 인해 적설과 미끄러운 도로가 예상되어 주의가 필요합니다.

요약:

- 2026년 10월 19일 오전 4시부터 2026년 10월 20일 오후 4시(AKDT)까지 노던 코퍼 밸리(Northern Copper Valley)에 겨울철 날씨 주의보가 발령되었습니다.
- 총 4~8인치의 눈이 쌓일 것으로 예상되며 통행이 어려울 수 있습니다.
- 도로 미끄러움에 대비하여 안전 운행을 하십시오.

별도 행동 지침 번역: 운행 시 속도를 줄이고 주의하십시오. 최신 도로 상황은 511번으로 전화하거나 511.alaska.gov를 방문하여 확인하십시오.

용어: [{"term": "Winter Weather Advisory", "meaning": "눈이나 얼음 등으로 인해 통행에 지장을 줄 수 있는 기상 상황일 때 발령되는 주의보입니다."}]

## US-25 — Beach Hazards Statement

공식 원문: https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.f61bb7b44720ec71e157c4b92e5ad3665ce316b2.001.1

### 입력 원문

event: Beach Hazards Statement
headline: Beach Hazards Statement issued October 18 at 8:33AM PDT until October 20 at 9:00AM PDT by NWS San Diego CA
areaDesc: San Diego County Coastal Areas; Orange County Coastal
sent: 2026-10-18T08:33:00-07:00
effective: 2026-10-18T08:33:00-07:00
onset: 2026-10-18T09:00:00-07:00
ends: 2026-10-20T09:00:00-07:00
expires: 2026-10-18T22:30:00-07:00
status: Actual
messageType: Update
description: * WHAT...Dangerous rip currents and breaking waves due to elevated
surf expected. Surf will build to 3 to 6 feet with sets to 7
feet on Sunday and persist through Tuesday morning.

* WHERE...San Diego County Coastal Areas and Orange County Coastal
Areas. Highest waves on south and southwest facing beaches.

* WHEN...From 9 AM PDT this morning through Tuesday morning.

* IMPACTS...There is an increased risk of ocean drowning. Rip
currents can pull swimmers and surfers out to sea. Waves can
wash people off beaches and rocks, and capsize small boats
nearshore.

* ADDITIONAL DETAILS...Minor beach erosion may occur across south-
facing beaches.

공식 별도 행동 지침:

Remain out of the water to avoid hazardous swimming conditions.

### gemini-3.1-flash-lite

응답 3.148초 · HTTP 200

전체 번역:

해변 위험 주의보(Beach Hazards Statement)가 2026년 10월 18일 오전 8시 33분 PDT에 미국 국립기상청(NWS) 샌디에이고 지부에 의해 발표되었습니다. 유효 기간은 2026년 10월 18일 오전 9시 PDT부터 2026년 10월 20일 오전 9시 PDT까지입니다. 무엇을... 높은 파도로 인해 위험한 이안류와 부서지는 파도가 예상됩니다. 파도는 일요일에 3~6피트(약 0.9~1.8미터)까지 높아지고 최대 7피트(약 2.1미터)의 세트 파도가 발생하며 화요일 오전까지 지속될 것입니다. 어디서... 샌디에이고 카운티 해안 지역(San Diego County Coastal Areas) 및 오렌지 카운티 해안 지역(Orange County Coastal Areas). 남쪽 및 남서쪽을 향한 해변에서 가장 높은 파도가 예상됩니다. 언제... 오늘 오전 9시 PDT부터 화요일 오전까지. 영향... 익사 위험이 증가합니다. 이안류는 수영하는 사람과 서퍼를 바다 쪽으로 휩쓸어 갈 수 있습니다. 파도는 사람들을 해변과 바위에서 씻어내릴 수 있으며 연안의 작은 보트를 전복시킬 수 있습니다. 추가 세부 사항... 남쪽을 향한 해변 전역에서 경미한 해변 침식이 발생할 수 있습니다.

설명: 높은 파도와 이안류로 인해 해안가에서 익사 및 선박 전복의 위험이 매우 높습니다.

요약:

- 일시: 2026년 10월 18일 오전 9시 ~ 10월 20일 오전 9시 PDT
- 지역: 샌디에이고 카운티 및 오렌지 카운티 해안 지역
- 행동: 위험한 수영 조건을 피하기 위해 물 밖으로 나오십시오.

별도 행동 지침 번역: 위험한 수영 조건을 피하기 위해 물 밖으로 나오십시오.

용어: [{"term": "이안류(Rip currents)", "meaning": "해안에서 바다 쪽으로 빠르게 흐르는 강력한 물살로, 수영하는 사람을 먼 바다로 휩쓸어 갈 수 있습니다."}, {"term": "세트 파도(Sets)", "meaning": "일정한 간격을 두고 연속적으로 밀려오는 더 크고 강한 파도 무리를 의미합니다."}, {"term": "해변 위험 주의보(Beach Hazards Statement)", "meaning": "해변 이용객에게 위험을 초래할 수 있는 해양 상황이 발생할 때 국립기상청에서 발령하는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.616초 · HTTP 200

전체 번역:

해변 위험 경보(Beach Hazards Statement)가 미국 국립기상청(NWS San Diego CA)에 의해 2026년 10월 18일 오전 8시 33분(PDT)에 발령되었으며 2026년 10월 20일 오전 9시 00분(PDT)까지 유지됩니다. * 내용: 높은 파도로 인한 위험한 이안류와 부서지는 파도가 예상됩니다. 파도는 일요일에 3~6피트, 최대 7피트 세트로 높아져 화요일 아침까지 지속됩니다. * 지역: 샌디에이고 카운티 해안 지역(San Diego County Coastal Areas) 및 오렌지 카운티 해안 지역(Orange County Coastal Areas). 남쪽 및 남서쪽을 향한 해변에서 가장 높은 파도가 칩니다. * 시간: 오늘 오전 9시(PDT)부터 화요일 아침까지. * 영향: 바다 익사 위험이 증가합니다. 이안류는 수영자와 서퍼를 바다 쪽으로 휩쓸어 갈 수 있습니다. 파도는 사람들을 해변과 바위에서 씻어내릴 수 있으며 연안의 소형 선박을 전복시킬 수 있습니다. * 추가 세부 사항: 남쪽을 향한 해변 전반에 걸쳐 경미한 해변 침식이 발생할 수 있습니다.

설명: 해변 위험 경보는 높은 파도와 이안류로 인해 해안가 안전사고 위험이 높을 때 발령됩니다.

요약:

- 2026년 10월 18일 오전 9시 00분(PDT)부터 2026년 10월 20일 오전 9시 00분(PDT)까지 샌디에이고 카운티 해안 지역(San Diego County Coastal Areas) 및 오렌지 카운티 해안 지역(Orange County Coastal Areas)에 해변 위험 경보가 발표 당시 지속 상태였습니다.
- 높은 파도와 이안류로 인해 익사 위험 및 해변 침식이 예상됩니다.
- 위험한 수영 조건을 피하기 위해 물에 들어가지 마십시오.

별도 행동 지침 번역: 위험한 수영 조건을 피하기 위해 물에 들어가지 마십시오.

용어: [{"term": "이안류(Rip Currents)", "meaning": "해안으로 밀려온 물이 좁은 통로를 통해 다시 바다로 빠르게 빠져나가는 강력한 물살입니다."}, {"term": "해변 위험 경보(Beach Hazards Statement)", "meaning": "해수욕객에게 위험을 초래할 수 있는 해양 조건이 예상될 때 발령되는 경보입니다."}]

## JP-01 — 台風解析・予報情報（５日予報）（Ｈ３０）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018154034_0_VPTW60_010000.xml

### 입력 원문

Title: 台風解析・予報情報（５日予報）（Ｈ３０）
DateTime: 2026-10-18T15:40:33Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 台風解析・予報情報
ReportDateTime: 2026-10-19T00:45:00+09:00
TargetDateTime: 2026-10-19T00:00:00+09:00
TargetDuration: PT120H
EventID: TC2636
InfoType: 発表
Serial: 38
InfoKind: 台風解析・予報情報（５日予報）
InfoKindVersion: 1.0_2
DateTime: 2026-10-19T00:00:00+09:00
Type: 呼称
Name: CHAMPI
NameKana: チャンパー
Number: 2630
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
Location: マリアナ諸島
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 960
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 60
Radius: 110
WindSpeed: 30
WindSpeed: 15
Direction: 北東
Radius: 270
Radius: 500
Direction: 南西
Radius: 210
Radius: 390
Name: 熱帯低気圧
BasePoint: +13.6+140.8/
BasePoint: +1335+14050/
Direction: 北東
Radius: 270
Radius: 500
Direction: 南西
Radius: 210
Radius: 390
DateTime: 2026-10-19T12:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +14.6+139.0/
BasePoint: +1435+13900/
Radius: 25
Radius: 45
Location: フィリピンの東
Direction: 西北西
Speed: 10
Speed: 20
Pressure: 955
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 90
Radius: 165
Name: 熱帯低気圧
BasePoint: +14.6+139.0/
BasePoint: +1435+13900/
Radius: 25
Radius: 45
DateTime: 2026-10-20T00:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +15.6+136.9/
BasePoint: +1535+13655/
Radius: 35
Radius: 65
Location: フィリピンの東
Direction: 西北西
Speed: 11
Speed: 20
Pressure: 955
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 105
Radius: 190
Name: 熱帯低気圧
BasePoint: +15.6+136.9/
BasePoint: +1535+13655/
Radius: 35
Radius: 65
DateTime: 2026-10-20T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +17.2+132.8/
BasePoint: +1710+13250/
Radius: 55
Radius: 100
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 940
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 135
Radius: 250
Name: 熱帯低気圧
BasePoint: +17.2+132.8/
BasePoint: +1710+13250/
Radius: 55
Radius: 100
DateTime: 2026-10-21T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +19.4+128.1/
BasePoint: +1925+12805/
Radius: 80
Radius: 150
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 925
Type: 風
WindSpeed: 100
WindSpeed: 50
WindSpeed: 140
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 180
Radius: 330
Name: 熱帯低気圧
BasePoint: +19.4+128.1/
BasePoint: +1925+12805/
Radius: 80
Radius: 150
DateTime: 2026-10-22T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +20.5+125.3/
BasePoint: +2030+12520/
Radius: 100
Radius: 185
Location: 沖縄の南
Direction: 西北西
Speed: 7
Speed: 15
Pressure: 935
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 220
Radius: 410
Name: 熱帯低気圧
BasePoint: +20.5+125.3/
BasePoint: +2030+12520/
Radius: 100
Radius: 185
DateTime: 2026-10-23T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +22.6+122.0/
BasePoint: +2235+12200/
Radius: 120
Radius: 220
Location: 沖縄の南
Direction: 西北西
Speed: 9
Speed: 15
Pressure: 950
Type: 風
WindSpeed: 85
WindSpeed: 45
WindSpeed: 120
WindSpeed: 60
WindSpeed: 50
WindSpeed: 25
Radius: 240
Radius: 440
Name: 熱帯低気圧
BasePoint: +22.6+122.0/
BasePoint: +2235+12200/
Radius: 120
Radius: 220

### gemini-3.1-flash-lite

응답 2.371초 · HTTP 200

전체 번역:

태풍 해석 및 예보 정보 (5일 예보) 제38호. 2026년 10월 19일 00시 00분 기준, 제30호 태풍 チャンパー(CHAMPI)는 마리아나 제도(Mariana Islands) 부근에서 매우 강한 세력으로 북서진하고 있습니다. 중심 기압은 960hPa이며, 중심 부근 최대 풍속은 45m/s(약 162km/h), 최대 순간 풍속은 65m/s(약 234km/h)입니다. 이후 10월 22일경에는 오키나와 남쪽(South of Okinawa) 해상으로 이동할 것으로 예상됩니다.

설명: 태풍의 중심 부근에서는 매우 강한 바람과 높은 파도가 발생하여 심각한 피해를 줄 수 있습니다.

요약:

- 2026년 10월 19일 00시 기준, 마리아나 제도(Mariana Islands) 부근에서 매우 강한 태풍 チャンパー(CHAMPI)가 북서진 중입니다.
- 태풍은 10월 22일경 오키나와 남쪽(South of Okinawa) 해상으로 이동할 것으로 전망됩니다.
- 태풍의 이동 경로와 강도 변화에 주의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "매우 강한(非常に強い)", "meaning": "일본 기상청 분류상 중심 부근 최대 풍속이 44m/s 이상 54m/s 미만인 태풍의 강도를 의미합니다."}, {"term": "태풍(TY)", "meaning": "중심 부근의 최대 풍속이 약 17m/s 이상인 열대 저기압을 의미합니다."}, {"term": "열대 저기압(Tropical Depression)", "meaning": "태풍의 중심부에서 강한 바람이 부는 영역을 나타내는 기상학적 구분입니다."}]

### gemini-3.5-flash-lite

응답 1.953초 · HTTP 200

전체 번역:

일본 기상청 태풍 분석 및 예보 정보(5일 예보)입니다. 2026년 10월 19일 00시 45분 JST 발표 당시 지속 상태입니다. 태풍 제30호 チャンパー(참피, CHAMPI)가 마리아나 제도(マリアナ諸島) 부근에서 매우 강한(非常に強い) 세력으로 북서쪽으로 이동하고 있습니다.

설명: 태풍 제30호 チャンパー(참피)가 매우 강한 세력으로 북서진하며 강풍과 폭우를 동반하고 있습니다.

요약:

- 2026년 10월 19일 00시 45분 JST 발표 당시 지속 상태
- 위치: 마리아나 제도(マリアナ諸島)
- 조치: 최신 기상 정보를 확인하고 안전에 유의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "매우 강한(非常に強い)", "meaning": "일본 기상청의 태풍 강도 분류 중 하나로 최대풍속이 약 44m/s 이상 54m/s 미만인 단계입니다."}, {"term": "태풍(TY)", "meaning": "북서태평양에서 발생하는 최대풍속 17.2m/s 이상의 열대저기압입니다."}]

## JP-02 — 噴火に関する火山観測報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018081200_0_VFVO52_400000.xml

### 입력 원문

Title: 噴火に関する火山観測報
DateTime: 2026-10-18T08:12:00Z
Status: 通常
EditorialOffice: 福岡管区気象台
PublishingOffice: 福岡管区気象台　鹿児島地方気象台
Title: 火山名　桜島　噴火に関する火山観測報
ReportDateTime: 2026-10-18T17:12:00+09:00
TargetDateTime: 2026-10-18T17:04:00+09:00
EventID: 20261018171200_506
InfoType: 発表
Serial: 1
InfoKind: 噴火に関する火山観測報
InfoKindVersion: 1.0_0
Text: 火　　山：桜島
日　　時：2026年10月18日17時04分(180804UTC)
現　　象：噴火
Name: 噴火
Name: 桜島
EventDateTime: 2026-10-18T17:04:00+09:00
EventDateTimeUTC: 2026-10-18T08:04:00Z
Name: 噴火
Name: 桜島
CraterName: 南岳山頂火口
CraterCoordinate: +3134.63+13039.53+1060/
PlumeHeightAboveCrater: 1000
PlumeHeightAboveSeaLevel: 6800
PlumeDirection: 北西
OtherObservation: 火口：南岳山頂火口
噴煙量：中量

### gemini-3.1-flash-lite

응답 1.875초 · HTTP 200

전체 번역:

제목: 분화 관련 화산 관측보. 발행 시각: 2026년 10월 18일 17시 12분(일본 표준시). 화산명: 사쿠라지마(桜島). 발생 일시: 2026년 10월 18일 17시 04분. 현상: 분화. 화구: 미나미다케 산정 화구(南岳山頂火口). 분연 높이: 화구로부터 1000m, 해발 6800m. 분연 방향: 북서쪽. 기타 관측: 분연량은 중량입니다.

설명: 화산 분화로 인해 화산재와 분연이 분출되고 있으니 주의하십시오.

요약:

- 2026년 10월 18일 17시 04분 사쿠라지마(桜島)에서 분화가 발생했습니다.
- 미나미다케 산정 화구(南岳山頂火口)에서 분연이 해발 6800m까지 북서쪽으로 분출되었습니다.
- 분연량은 중량으로 관측되었습니다.

별도 행동 지침 번역: None

용어: [{"term": "분연(噴煙)", "meaning": "화산 분화 시 화구에서 뿜어져 나오는 화산 가스, 화산재, 암석 파편 등의 혼합물입니다."}, {"term": "미나미다케 산정 화구(南岳山頂火口)", "meaning": "사쿠라지마 화산의 주요 분화 활동이 일어나는 화구 중 하나입니다."}]

### gemini-3.5-flash-lite

응답 2.712초 · HTTP 200

전체 번역:

제목: 분화에 관한 화산관측보
발행일시: 2026년 10월 18일 08:12 UTC
상태: 통상
편집관서: 후쿠오카관구기상대
발행관서: 후쿠오카관구기상대 가고시마지방기상대
제목: 화산명 사쿠라지마(桜島) 분화에 관한 화산관측보
보고일시: 2026년 10월 18일 오후 5시 12분 (+09:00)
대상일시: 2026년 10월 18일 오후 5시 04분 (+09:00)
이벤트ID: 20261018171200_506
정보유형: 발표
일련번호: 1
정보종류: 분화에 관한 화산관측보
정보종류버전: 1.0_0
본문:
화산: 사쿠라지마(桜島)
일시: 2026년 10월 18일 17시 04분 (180804UTC)
현상: 분화
이름: 분화
이름: 사쿠라지마(桜島)
사건일시: 2026년 10월 18일 오후 5시 04분 (+09:00)
사건일시UTC: 2026년 10월 18일 08:04 UTC
이름: 분화
이름: 사쿠라지마(桜島)
분화구명: 미나미다케 산정 화구(南岳山頂火口)
분화구좌표: +3134.63+13039.53+1060/
분화구 상공 연기 높이: 1000m
해발 기준 연기 높이: 6800m
연기 방향: 북서
기타 관측: 화구: 미나미다케 산정 화구(南岳山頂火口), 분연량: 중량

설명: 지정된 화산에서 분화가 발생하여 화산재와 연기가 상공으로 치솟았습니다.

요약:

- 2026년 10월 18일 오후 5시 04분 사쿠라지마(桜島) 미나미다케 산정 화구(南岳山頂火口)에서 분화 발생
- 해발 6800m 높이까지 분연이 북서쪽으로 상승
- 발표 당시 지속 상태: 분화 관측 및 정보 발표

별도 행동 지침 번역: None

용어: [{"term": "미나미다케 산정 화구", "meaning": "사쿠라지마 화산의 주요 분화 활동 중심지 중 하나입니다."}, {"term": "분연량", "meaning": "분화 시 뿜어져 나오는 화산연과 화산재의 양을 나타냅니다."}]

## JP-03 — 噴火警報・予報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261016010005_0_VFVO50_016000.xml

### 입력 원문

Title: 噴火警報・予報
DateTime: 2026-10-16T01:00:04Z
Status: 通常
EditorialOffice: 札幌管区気象台
PublishingOffice: 札幌管区気象台
Title: 火山名  十勝岳  噴火警報（火口周辺）
ReportDateTime: 2026-10-16T10:00:00+09:00
TargetDateTime: 2026-10-16T10:00:00+09:00
EventID: 108
InfoType: 発表
InfoKind: 噴火警報・予報
InfoKindVersion: 1.0_0
Text: ＜十勝岳に火口周辺警報（噴火警戒レベル２、火口周辺規制）を発表＞
　十勝岳では、６２ー２火口から概ね１．５ｋｍの範囲に影響を及ぼす噴火が発生する可能性があります。
＜噴火警戒レベルを３（入山規制）から２（火口周辺規制）に引下げ＞
Name: レベル２（火口周辺規制）
Condition: 引下げ
Name: レベル３（入山規制）
Name: 十勝岳
Name: 火口周辺警報
Condition: 切替
Name: 火口周辺警報
Name: 北海道美瑛町
Name: 北海道上富良野町
Name: 北海道新得町
Name: 火口周辺警報：入山規制等
Condition: 継続
Name: 火口周辺警報：入山規制等
Name: 北海道美瑛町
Name: 北海道上富良野町
Name: 北海道新得町
Name: 活火山であることに留意
Condition: 解除
Name: 火口周辺警報：入山規制等
Name: 北海道富良野市
Name: 北海道南富良野町
Name: 活火山であることに留意
Condition: 継続
Name: 活火山であることに留意
Name: 北海道中富良野町
Name: レベル２（火口周辺規制）
Condition: 引下げ
Name: レベル３（入山規制）
Name: 十勝岳
Name: 火口周辺警報
Condition: 切替
Name: 火口周辺警報
Name: 北海道美瑛町
Name: 北海道上富良野町
Name: 北海道新得町
Name: 火口周辺警報：入山規制等
Condition: 継続
Name: 火口周辺警報：入山規制等
Name: 北海道美瑛町
Name: 北海道上富良野町
Name: 北海道新得町
Name: 活火山であることに留意
Condition: 解除
Name: 火口周辺警報：入山規制等
Name: 北海道富良野市
Name: 北海道南富良野町
Name: 活火山であることに留意
Condition: 継続
Name: 活火山であることに留意
Name: 北海道中富良野町
VolcanoHeadline: ＜十勝岳に火口周辺警報（噴火警戒レベル２、火口周辺規制）を発表＞
　十勝岳では、６２ー２火口から概ね１．５ｋｍの範囲に影響を及ぼす噴火が発生する可能性があります。
＜噴火警戒レベルを３（入山規制）から２（火口周辺規制）に引下げ＞
VolcanoActivity: ９月１３日以降、山体付近を震源とする振幅の大きな火山性地震（硫黄沢観測点で最大振幅２マイクロメートル以上）は発生しておらず、規模の小さなものを含めて地震は少ない状態で経過しており、地震活動に低下傾向が認められます。
　６２ー２火口から概ね３ｋｍの範囲に影響を及ぼす噴火の可能性は低くなりました。

　一方で、６２ー２火口及び振子沢噴気孔群付近の高温化や、火山ガス（二酸化硫黄）の放出量の増加、山体付近のやや深部の膨張を示す地殻変動など活発な火山活動は維持しているため、引き続き６２ー２火口から概ね１．５ｋｍの範囲に影響を及ぼす噴火が発生する可能性があります。
VolcanoPrevention: ６２ー２火口から概ね１．５ｋｍの範囲では、噴火に伴い弾道を描いて飛散する大きな噴石に警戒してください。地元自治体などの指示に従って危険な地域には立ち入らないでください。
　風下側では火山灰や小さな噴石が遠方まで風に流されて降るおそれがあるため注意してください。
Appendix: ＊＊（参考：噴火警戒レベルの説明）＊＊
【レベル５（避難）】：危険な居住地域からの避難等が必要。
【レベル４（高齢者等避難）】：警戒が必要な居住地域での高齢者等の要配慮者の避難、住民の避難の準備等が必要。
【レベル３（入山規制）】：登山禁止や入山規制等危険な地域への立入規制等。状況に応じて高齢者等の要配慮者の避難の準備等。
【レベル２（火口周辺規制）】：火口周辺への立入規制等。
【レベル１（活火山であることに留意）】：状況に応じて火口内への立入規制等。
（注：避難や規制の対象地域は、地域の状況や火山活動状況により異なる）

### gemini-3.1-flash-lite

응답 3.017초 · HTTP 200

전체 번역:

제목: 분화 경보 및 예보
발행 관서: 삿포로 관구 기상대
보고 일시: 2026년 10월 16일 오전 10시 00분

<도카치다케(十勝岳)에 화구 주변 경보(분화 경계 레벨 2, 화구 주변 규제) 발표>
도카치다케에서는 62-2 화구로부터 약 1.5km 범위에 영향을 미치는 분화가 발생할 가능성이 있습니다.

<분화 경계 레벨을 3(입산 규제)에서 2(화구 주변 규제)로 하향>

[화산 활동 상황]
9월 13일 이후 산체 부근을 진원으로 하는 진폭이 큰 화산성 지진(이오사와 관측점 기준 최대 진폭 2마이크로미터 이상)은 발생하지 않았으며, 소규모 지진을 포함하여 지진 활동이 적은 상태로 경과하고 있어 지진 활동의 저하 경향이 확인됩니다. 62-2 화구로부터 약 3km 범위에 영향을 미치는 분화 가능성은 낮아졌습니다.
한편, 62-2 화구 및 후리코자와 분기공군 부근의 고온화, 화산 가스(이산화황) 방출량 증가, 산체 부근의 다소 깊은 곳에서 팽창을 나타내는 지각 변동 등 활발한 화산 활동이 유지되고 있으므로, 계속해서 62-2 화구로부터 약 1.5km 범위에 영향을 미치는 분화가 발생할 가능성이 있습니다.

[방재 사항]
62-2 화구로부터 약 1.5km 범위에서는 분화에 따라 탄도를 그리며 비산하는 큰 분석(화산 암석 조각)에 경계하십시오. 지자체 등의 지시에 따라 위험한 지역에는 출입하지 마십시오. 바람이 부는 방향에서는 화산재나 작은 분석이 바람에 날려 멀리까지 떨어질 우려가 있으므로 주의하십시오.

설명: 화산 분화 시 화구 주변으로 큰 암석 조각이 날아오거나 화산재가 낙하할 위험이 있습니다.

요약:

- 2026년 10월 16일 오전 10시 기준 도카치다케(十勝岳) 분화 경계 레벨이 3에서 2로 하향되었습니다.
- 62-2 화구 반경 1.5km 이내 지역은 화구 주변 규제가 적용되므로 출입을 금지하십시오.
- 바람이 부는 방향의 지역은 화산재 및 작은 분석 낙하에 주의하십시오.

별도 행동 지침 번역: 62-2 화구로부터 약 1.5km 범위 내에서는 분화 시 비산하는 큰 분석에 경계하십시오. 지자체의 지시에 따라 위험 지역에 출입하지 마십시오.

용어: [{"term": "분화 경계 레벨", "meaning": "화산 활동 상황에 따라 주민이나 등산객이 취해야 할 행동을 5단계로 구분한 지표입니다."}, {"term": "분석(噴石)", "meaning": "분화 시 화구에서 튀어나오는 화산 암석 조각을 의미합니다."}, {"term": "분기공(噴気孔)", "meaning": "화산 가스나 수증기를 뿜어내는 지표면의 구멍을 의미합니다."}]

### gemini-3.5-flash-lite

응답 5.014초 · HTTP 200

전체 번역:

제목: 분화 경보 및 예보
발생일시: 2026년 10월 16일 오전 1시 0분 4초 UTC
상태: 통상
편집오피스: 삿포로관구기상대
발행오피스: 삿포로관구기상대
제목: 화산명 도카치다케(十勝岳) 분화 경보(화구 주변)
보고일시: 2026년 10월 16일 오전 10시 0분 +09:00
대상일시: 2026년 10월 16일 오전 10시 0분 +09:00
이벤트 ID: 108
정보유형: 발표
정보종류: 분화 경보 및 예보
정보종류 버전: 1.0_0
텍스트: <도카치다케(十勝岳)에 화구 주변 경보(분화 경계 레벨 2, 화구 주변 규제) 발표>
도카치다케(十勝岳)에서는 62-2 화구로부터 대략 1.5km 범위에 영향을 미치는 분화가 발생할 가능성이 있습니다.
<분화 경계 레벨을 3(입산 규제)에서 2(화구 주변 규제)로 하향>
이름: 레벨 2(화구 주변 규제)
조건: 하향
이름: 레벨 3(입산 규제)
이름: 도카치다케(十勝岳)
이름: 화구 주변 경보
조건: 전환
이름: 화구 주변 경보
이름: 홋카이도 비에이초(北海道美瑛町)
이름: 홋카이도 가미후라노초(北海道上富良野町)
이름: 홋카이도 신토쿠초(北海道新得町)
이름: 화구 주변 경보: 입산 규제 등
조건: 발표 당시 지속 상태
이름: 화구 주변 경보: 입산 규제 등
이름: 홋카이도 비에이초(北海道美瑛町)
이름: 홋카이도 가미후라노초(北海道上富良野町)
이름: 홋카이도 신토쿠초(北海道新得町)
이름: 활화산임을 유의
조건: 해제
이름: 화구 주변 경보: 입산 규제 등
이름: 홋카이도 후라노시(北海道富良野市)
이름: 홋카이도 미나미후라노초(北海道南富良野町)
이름: 활화산임을 유의
조건: 발표 당시 지속 상태
이름: 활화산임을 유의
이름: 홋카이도 나카후라노초(北海道中富良野町)
화산 헤드라인: <도카치다케(十勝岳)에 화구 주변 경보(분화 경계 레벨 2, 화구 주변 규제) 발표>
도카치다케(十勝岳)에서는 62-2 화구로부터 대략 1.5km 범위에 영향을 미치는 분화가 발생할 가능성이 있습니다.
<분화 경계 레벨을 3(입산 규제)에서 2(화구 주변 규제)로 하향>
화산 활동: 9월 13일 이후 산체 부근을 진원으로 하는 진폭이 큰 화산성 지진(이오사쿠(硫黄沢) 관측점에서 최대 진폭 2마이크로미터 이상)은 발생하지 않았고 규모가 작은 것을 포함하여 지진은 적은 상태로 경과하고 있으며 지진 활동에 저하 경향이 인정됩니다.
62-2 화구로부터 대략 3km 범위에 영향을 미치는 분화의 가능성은 낮아졌습니다.
반면에 62-2 화구 및 후리코자와(振子沢) 분기공군 부근의 고온화나 화산 가스(이산화황) 방출량 증가, 산체 부근 다소 심부의 팽창을 나타내는 지각 변동 등 활발한 화산 활동은 유지하고 있으므로 계속해서 62-2 화구로부터 대략 1.5km 범위에 영향을 미치는 분화가 발생할 가능성이 있습니다.
화산 방재: 62-2 화구로부터 대략 1.5km 범위에서는 분화에 수반하여 탄도를 그리며 비산하는 커다란 분석에 경계하십시오. 지방자치단체 등의 지시에 따라 위험한 지역에는 출입하지 마십시오.
풍하 측에서는 화산재나 작은 분석이 먼 곳까지 바람에 날려 내려올 우려가 있으므로 주의하십시오.
부록: **(참고: 분화 경계 레벨 설명)**
[레벨 5(피난)]: 위험한 거주 지역으로부터의 피난 등이 필요.
[레벨 4(고령자 등 피난)]: 경계가 필요한 거주 지역에서의 고령자 등 취약계층의 피난, 주민의 피난 준비 등이 필요.
[레벨 3(입산 규제)]: 등산 금지나 입산 규제 등 위험한 지역으로의 출입 규제 등. 상황에 따라 고령자 등 취약계층의 피난 준비 등.
[레벨 2(화구 주변 규제)]: 화구 주변으로의 출입 규제 등.
[레벨 1(활화산임을 유의)]: 상황에 따라 화구 내로의 출입 규제 등.
(주: 피난 및 규제 대상 지역은 지역 상황이나 화산 활동 상황에 따라 다름)

설명: 도카치다케(十勝岳) 화산 활동으로 인해 화구 주변에 분화 및 분석 낙하 위험이 있습니다.

요약:

- 2026년 10월 16일 오전 10시 0분 +09:00 기준 도카치다케(十勝岳) 화구 주변 경보가 발표되었습니다.
- 대상 지역은 도카치다케(十勝岳) 62-2 화구 주변입니다.
- 위험 지역 출입을 금지하고 지방자치단체 지시에 따르십시오.

별도 행동 지침 번역: 62-2 화구로부터 대략 1.5km 범위에서는 분화에 수반하여 탄도를 그리며 비산하는 커다란 분석에 경계하십시오. 지방자치단체 등의 지시에 따라 위험한 지역에는 출입하지 마십시오. 풍하 측에서는 화산재나 작은 분석이 먼 곳까지 바람에 날려 내려올 우려가 있으므로 주의하십시오.

용어: [{"term": "噴火警戒レベル (분화 경계 레벨)", "meaning": "화산 활동 상황에 따라 발표되는 1부터 5까지의 경계 단계입니다."}, {"term": "噴石 (분석)", "meaning": "분화 시 화구에서 뿜어져 나오는 화산탄과 암석 조각입니다."}, {"term": "火口周辺規制 (화구 주변 규제)", "meaning": "위험한 화구 주변 지역으로의 출입을 금지하는 조치입니다."}]

## JP-04 — 気象特別警報・警報・注意報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018160933_0_VPWW53_060000.xml

### 입력 원문

Title: 気象特別警報・警報・注意報
DateTime: 2026-10-18T16:09:32Z
Status: 通常
EditorialOffice: 山形地方気象台
PublishingOffice: 山形地方気象台
Title: 山形県気象警報・注意報
ReportDateTime: 2026-10-19T01:09:00+09:00
TargetDateTime: 2026-10-19T01:09:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.1_2
Text: 庄内では、強風に注意してください。山形県では、高波に注意してください。
Name: 強風注意報
Name: 波浪注意報
Name: 山形県
Name: 強風注意報
Name: 波浪注意報
Name: 庄内
Name: 強風注意報
Name: 波浪注意報
Name: 庄内北部
Name: 強風注意報
Name: 波浪注意報
Name: 庄内南部
Name: 強風注意報
Name: 波浪注意報
Name: 鶴岡市
Name: 強風注意報
Name: 波浪注意報
Name: 酒田市
Name: 強風注意報
Name: 波浪注意報
Name: 遊佐町
Name: 強風注意報
Name: 庄内
Name: 波浪注意報
Name: 庄内
Notice: ［危険警報・氾濫特別警報の発表状況］
なし
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 山形県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 村山
Status: 発表警報・注意報はなし
Name: 置賜
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 東南村山
Status: 発表警報・注意報はなし
Name: 北村山
Status: 発表警報・注意報はなし
Name: 西村山
Status: 発表警報・注意報はなし
Name: 東南置賜
Status: 発表警報・注意報はなし
Name: 西置賜
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内南部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 山形市
Status: 発表警報・注意報はなし
Name: 米沢市
Name: 強風注意報
Status: 発表
Type: 風
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 朝
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 波浪注意報
Status: 発表
Type: 波
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 昼前
WaveHeight: 4
Name: 鶴岡市
ChangeStatus: 警報・注意報種別に変化有
Name: 強風注意報
Status: 発表
Type: 風
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 朝
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 波浪注意報
Status: 発表
Type: 波
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 昼前
WaveHeight: 4
Name: 酒田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 新庄市
Status: 発表警報・注意報はなし
Name: 寒河江市
Status: 発表警報・注意報はなし
Name: 上山市
Status: 発表警報・注意報はなし
Name: 村山市
Status: 発表警報・注意報はなし
Name: 長井市
Status: 発表警報・注意報はなし
Name: 天童市
Status: 発表警報・注意報はなし
Name: 東根市
Status: 発表警報・注意報はなし
Name: 尾花沢市
Status: 発表警報・注意報はなし
Name: 南陽市
Status: 発表警報・注意報はなし
Name: 山辺町
Status: 発表警報・注意報はなし
Name: 中山町
Status: 発表警報・注意報はなし
Name: 河北町
Status: 発表警報・注意報はなし
Name: 西川町
Status: 発表警報・注意報はなし
Name: 朝日町
Status: 発表警報・注意報はなし
Name: 大江町
Status: 発表警報・注意報はなし
Name: 大石田町
Status: 発表警報・注意報はなし
Name: 金山町
Status: 発表警報・注意報はなし
Name: 最上町
Status: 発表警報・注意報はなし
Name: 舟形町
Status: 発表警報・注意報はなし
Name: 真室川町
Status: 発表警報・注意報はなし
Name: 大蔵村
Status: 発表警報・注意報はなし
Name: 鮭川村
Status: 発表警報・注意報はなし
Name: 戸沢村
Status: 発表警報・注意報はなし
Name: 高畠町
Status: 発表警報・注意報はなし
Name: 川西町
Status: 発表警報・注意報はなし
Name: 小国町
Status: 発表警報・注意報はなし
Name: 白鷹町
Status: 発表警報・注意報はなし
Name: 飯豊町
Status: 発表警報・注意報はなし
Name: 三川町
Status: 発表警報・注意報はなし
Name: 庄内町
Name: 強風注意報
Status: 発表
Type: 風
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 朝
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 波浪注意報
Status: 発表
Type: 波
Date: １９日
Term: 朝
Date: １９日
Term: 夕方
Date: １９日
Term: 昼前
WaveHeight: 4
Name: 遊佐町
ChangeStatus: 警報・注意報種別に変化有

### gemini-3.1-flash-lite

응답 2.197초 · HTTP 200

전체 번역:

기상 특별 경보·경보·주의보 (야마가타 지방 기상대 발표). 야마가타현 기상 경보·주의보, 2026년 10월 19일 오전 1시 9분 발표. 쇼나이(庄内) 지역은 강풍에 주의하십시오. 야마가타현(山形県) 전역은 높은 파도에 주의하십시오. 쇼나이(庄内) 지역(쇼나이 북부, 쇼나이 남부, 쓰루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町))에 강풍 주의보 및 파랑 주의보가 발표되었습니다. 해상에서는 19일 아침부터 저녁까지 남서풍이 강하게 불겠으며, 파고는 19일 아침부터 낮 전까지 4m에 이를 것으로 예상됩니다.

설명: 강풍과 높은 파도로 인한 해상 안전사고 및 시설물 피해에 유의하십시오.

요약:

- 발표 시점: 2026년 10월 19일 오전 1시 9분
- 대상 지역: 야마가타현 쇼나이(庄内) 지역
- 주의 사항: 강풍 및 높은 파도에 따른 안전 유의

별도 행동 지침 번역: 쇼나이 지역은 강풍에 주의하시고, 야마가타현 전역은 높은 파도에 주의하십시오.

용어: [{"term": "강풍 주의보", "meaning": "강한 바람으로 인해 피해가 예상될 때 발표되는 주의보입니다."}, {"term": "파랑 주의보", "meaning": "높은 파도로 인해 해안가나 해상에서 피해가 예상될 때 발표되는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.607초 · HTTP 200

전체 번역:

제목: 기상특별경보·경보·주의보. 일시: 2026년 10월 18일 16시 09분 32초 UTC. 상태: 통상. 편집관서: 야마가타 지방기상대. 발표관서: 야마가타 지방기상대. 제목: 야마가타현 기상 경보·주의보. 보고일시: 2026년 10월 19일 01시 09분 +09:00. 대상일시: 2026년 10월 19일 01시 09분 +09:00. 정보유형: 발표. 정보종류: 기상 경보·주의보. 본문: 쇼나이(庄内)에서는 강풍에 주의하십시오. 야마가타현(山形県)에서는 높은 파도에 주의하십시오. 강풍주의보 발표. 파도주의보 발표. 야마가타현(山形県). 쇼나이(庄内) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태). 쇼나이북부(庄内北部) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태). 쇼나 남부(庄内南部) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태). 쓰루오카시(鶴岡市) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태). 사카타시(酒田市) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태). 유사정(遊佐町) 강풍주의보(발표 당시 지속 상태), 파도주의보(발표 당시 지속 상태).

설명: 강풍과 높은 파도로 인해 위험이 예상되므로 해당 지역에서는 주의하여 주십시오.

요약:

- 2026년 10월 19일 01시 09분 +09:00 야마가타 지방기상대 발표
- 야마가타현(山形県) 쇼나이(庄内) 지역에 강풍주의보 및 파도주의보 발표 당시 지속 상태
- 해당 지역에서는 강풍과 높은 파도에 주의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "強風注意報", "meaning": "강풍으로 인한 재해 발생이 우려될 때 발표하는 주의보입니다."}, {"term": "波浪注意報", "meaning": "해상에서 높은 파도로 인한 재해 발생이 우려될 때 발표하는 주의보입니다."}]

## JP-05 — 気象警報・注意報（Ｈ２７）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018160933_0_VPWW54_060000.xml

### 입력 원문

Title: 気象警報・注意報（Ｈ２７）
DateTime: 2026-10-18T16:09:32Z
Status: 通常
EditorialOffice: 山形地方気象台
PublishingOffice: 山形地方気象台
Title: 山形県気象警報・注意報
ReportDateTime: 2026-10-19T01:09:00+09:00
TargetDateTime: 2026-10-19T01:09:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.2_2
Text: 庄内では、強風に注意してください。山形県では、高波に注意してください。
Name: 強風注意報
Name: 波浪注意報
Name: 山形県
Name: 強風注意報
Name: 波浪注意報
Name: 庄内
Name: 強風注意報
Name: 波浪注意報
Name: 庄内北部
Name: 強風注意報
Name: 波浪注意報
Name: 庄内南部
Name: 強風注意報
Name: 波浪注意報
Name: 鶴岡市
Name: 強風注意報
Name: 波浪注意報
Name: 酒田市
Name: 強風注意報
Name: 波浪注意報
Name: 遊佐町
Name: 強風注意報
Name: 庄内
Name: 波浪注意報
Name: 庄内
Notice: ［危険警報・氾濫特別警報の発表状況］
なし
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 山形県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 村山
Status: 発表警報・注意報はなし
Name: 置賜
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 東南村山
Status: 発表警報・注意報はなし
Name: 北村山
Status: 発表警報・注意報はなし
Name: 西村山
Status: 発表警報・注意報はなし
Name: 東南置賜
Status: 発表警報・注意報はなし
Name: 西置賜
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 庄内南部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 山形市
Status: 発表警報・注意報はなし
Name: 米沢市
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 鶴岡市
ChangeStatus: 警報・注意報種別に変化有
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 酒田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 新庄市
Status: 発表警報・注意報はなし
Name: 寒河江市
Status: 発表警報・注意報はなし
Name: 上山市
Status: 発表警報・注意報はなし
Name: 村山市
Status: 発表警報・注意報はなし
Name: 長井市
Status: 発表警報・注意報はなし
Name: 天童市
Status: 発表警報・注意報はなし
Name: 東根市
Status: 発表警報・注意報はなし
Name: 尾花沢市
Status: 発表警報・注意報はなし
Name: 南陽市
Status: 発表警報・注意報はなし
Name: 山辺町
Status: 発表警報・注意報はなし
Name: 中山町
Status: 発表警報・注意報はなし
Name: 河北町
Status: 発表警報・注意報はなし
Name: 西川町
Status: 発表警報・注意報はなし
Name: 朝日町
Status: 発表警報・注意報はなし
Name: 大江町
Status: 発表警報・注意報はなし
Name: 大石田町
Status: 発表警報・注意報はなし
Name: 金山町
Status: 発表警報・注意報はなし
Name: 最上町
Status: 発表警報・注意報はなし
Name: 舟形町
Status: 発表警報・注意報はなし
Name: 真室川町
Status: 発表警報・注意報はなし
Name: 大蔵村
Status: 発表警報・注意報はなし
Name: 鮭川村
Status: 発表警報・注意報はなし
Name: 戸沢村
Status: 発表警報・注意報はなし
Name: 高畠町
Status: 発表警報・注意報はなし
Name: 川西町
Status: 発表警報・注意報はなし
Name: 小国町
Status: 発表警報・注意報はなし
Name: 白鷹町
Status: 発表警報・注意報はなし
Name: 飯豊町
Status: 発表警報・注意報はなし
Name: 三川町
Status: 発表警報・注意報はなし
Name: 庄内町
Name: 強風注意報
Status: 発表
Name: 波浪注意報
Status: 発表
Name: 遊佐町
ChangeStatus: 警報・注意報種別に変化有
DateTime: 2026-10-19T00:00:00+09:00
Duration: PT3H
Name: １９日未明
DateTime: 2026-10-19T03:00:00+09:00
Duration: PT3H
Name: １９日明け方
DateTime: 2026-10-19T06:00:00+09:00
Duration: PT3H
Name: １９日朝
DateTime: 2026-10-19T09:00:00+09:00
Duration: PT3H
Name: １９日昼前
DateTime: 2026-10-19T12:00:00+09:00
Duration: PT3H
Name: １９日昼過ぎ
DateTime: 2026-10-19T15:00:00+09:00
Duration: PT3H
Name: １９日夕方
DateTime: 2026-10-19T18:00:00+09:00
Duration: PT3H
Name: １９日夜のはじめ頃
DateTime: 2026-10-19T21:00:00+09:00
Duration: PT3H
Name: １９日夜遅く
DateTime: 2026-10-20T00:00:00+09:00
Duration: PT3H
Name: ２０日未明
Name: 強風注意報
Type: 危険度
AreaName: 海上
Name: 注意報級
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 風
AreaName: 海上
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 西
AreaName: 海上
WindSpeed: 13
WindSpeed: 13
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
Name: 波浪注意報
Type: 危険度
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 波
WaveHeight: 1.5
WaveHeight: 2
WaveHeight: 3
WaveHeight: 4
WaveHeight: 4
WaveHeight: 3
Name: 鶴岡市
Name: 強風注意報
Type: 危険度
AreaName: 海上
Name: 注意報級
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 風
AreaName: 海上
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 西
AreaName: 海上
WindSpeed: 13
WindSpeed: 13
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
Name: 波浪注意報
Type: 危険度
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 波
WaveHeight: 1.5
WaveHeight: 2
WaveHeight: 3
WaveHeight: 4
WaveHeight: 4
WaveHeight: 3
Name: 酒田市
Name: 強風注意報
Type: 危険度
AreaName: 海上
Name: 注意報級
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 風
AreaName: 海上
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 南西
WindDirection: 西
AreaName: 海上
WindSpeed: 13
WindSpeed: 13
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
WindSpeed: 15
Name: 波浪注意報
Type: 危険度
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Type: 波
WaveHeight: 1.5
WaveHeight: 2
WaveHeight: 3
WaveHeight: 4
WaveHeight: 4
WaveHeight: 3
Name: 遊佐町

### gemini-3.1-flash-lite

응답 1.725초 · HTTP 200

전체 번역:

야마가타현(山形県) 기상 경보 및 주의보 발표: 쇼나이(庄内) 지역은 강풍에 주의하십시오. 야마가타현(山形県) 전역은 높은 파도에 주의하십시오. 대상 지역: 쇼나이(庄内) 지역(쓰루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町) 포함).

설명: 강풍과 높은 파도로 인해 해상 활동 및 시설물 관리에 각별한 주의가 필요합니다.

요약:

- 2026년 10월 19일 오전 1시 9분 발표
- 야마가타현(山形県) 쇼나이(庄内) 지역
- 강풍 및 높은 파도 주의

별도 행동 지침 번역: None

용어: [{"term": "강풍주의보", "meaning": "강한 바람으로 인해 피해가 예상될 때 발표하는 주의보입니다."}, {"term": "파랑주의보", "meaning": "높은 파도로 인해 해안가나 해상에서 피해가 예상될 때 발표하는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.233초 · HTTP 200

전체 번역:

야마가타 지방기상대 발표(2026년 10월 19일 오전 01:09 JST): 쇼나이(庄内) 지역은 강풍에 주의하시고, 야마가타현(山形県) 전역은 높은 파도에 주의하십시오. [발표 당시 지속 상태] 庄内(쇼나이) 지역의 鶴岡市(츠루오카시), 酒田市(사카타시), 遊佐町(유사마치) 등을 포함한 庄内北部(쇼나이 북부) 및 庄内南部(쇼나이 남부)에 강풍주의보와 파랑주의보가 발표 중입니다.

설명: 강풍과 높은 파도로 인해 야외 활동이나 해안가 안전에 위험이 발생할 수 있습니다.

요약:

- 발표 시각: 2026년 10월 19일 오전 01:09 JST
- 대상 지역: 야마가타현 쇼나이(庄内) 지역 (츠루오카시, 사카타시, 유사마치)
- 기상 상황: 강풍주의보 및 파랑주의보 발표 당시 지속 상태

별도 행동 지침 번역: 쇼나이 지역에서는 강풍에 주의하시고, 야마가타현에서는 높은 파도에 주의하십시오.

용어: [{"term": "強風注意報", "meaning": "강풍으로 인한 재해 발생이 우려될 때 발표하는 주의보입니다."}, {"term": "波浪注意報", "meaning": "높은 파도로 인한 재해 발생이 우려될 때 발표하는 주의보입니다."}]

## JP-06 — 気象警報・注意報（Ｒ０６）（その他注意報）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018142119_0_VPWW61_150000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（その他注意報）
DateTime: 2026-10-18T14:21:19Z
Status: 通常
EditorialOffice: 新潟地方気象台
PublishingOffice: 新潟地方気象台
Title: 新潟県乾燥注意報
ReportDateTime: 2026-10-18T23:21:00+09:00
TargetDateTime: 2026-10-18T23:21:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 注意報を解除します。
Name: 解除
Name: 新潟県
Name: 解除
Name: 下越
Name: 解除
Name: 佐渡
Name: 解除
Name: 新潟地域
Name: 解除
Name: 岩船地域
Name: 解除
Name: 新発田地域
Name: 解除
Name: 五泉地域
Name: 解除
Name: 佐渡
Name: 解除
Name: 新潟市
Name: 解除
Name: 新発田市
Name: 解除
Name: 村上市
Name: 解除
Name: 燕市
Name: 解除
Name: 五泉市
Name: 解除
Name: 阿賀野市
Name: 解除
Name: 佐渡市
Name: 解除
Name: 胎内市
Name: 解除
Name: 聖籠町
Name: 解除
Name: 弥彦村
Name: 解除
Name: 阿賀町
Name: 解除
Name: 関川村
Name: 解除
Name: 粟島浦村
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 新潟県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 下越
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 中越
Status: 発表警報・注意報はなし
Name: 上越
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 佐渡
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 1
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 新潟地域
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 岩船地域
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 新発田地域
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 五泉地域
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 長岡地域
Status: 発表警報・注意報はなし
Name: 三条地域
Status: 発表警報・注意報はなし
Name: 魚沼市
Status: 発表警報・注意報はなし
Name: 柏崎地域
Status: 発表警報・注意報はなし
Name: 南魚沼地域
Status: 発表警報・注意報はなし
Name: 十日町地域
Status: 発表警報・注意報はなし
Name: 上越市
Status: 発表警報・注意報はなし
Name: 糸魚川市
Status: 発表警報・注意報はなし
Name: 妙高市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 佐渡
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 新潟市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 長岡市
Status: 発表警報・注意報はなし
Name: 三条市
Status: 発表警報・注意報はなし
Name: 柏崎市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 新発田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 小千谷市
Status: 発表警報・注意報はなし
Name: 加茂市
Status: 発表警報・注意報はなし
Name: 十日町市
Status: 発表警報・注意報はなし
Name: 見附市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 村上市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 燕市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 糸魚川市
Status: 発表警報・注意報はなし
Name: 妙高市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 五泉市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 上越市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 阿賀野市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 佐渡市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 魚沼市
Status: 発表警報・注意報はなし
Name: 南魚沼市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 胎内市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 聖籠町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 弥彦村
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 田上町
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 阿賀町
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 出雲崎町
Status: 発表警報・注意報はなし
Name: 湯沢町
Status: 発表警報・注意報はなし
Name: 津南町
Status: 発表警報・注意報はなし
Name: 刈羽村
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 関川村
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 粟島浦村
ChangeStatus: 警報・注意報種別に変化有

### gemini-3.1-flash-lite

응답 1.949초 · HTTP 200

전체 번역:

기상 경보 및 주의보(R06)(기타 주의보) 발행: 니가타 지방 기상대(新潟地方気象台) 2026년 10월 18일 오후 11시 21분. 니가타현(新潟県)에 발효 중이던 건조 주의보를 해제합니다. 대상 지역: 하에쓰(下越), 사도(佐渡), 니가타 지역(新潟地域), 이와후네 지역(岩船地域), 시바타 지역(新発田地域), 고센 지역(五泉地域) 및 해당 시정촌(니가타시, 시바타시, 무라카미시, 쓰바메시, 고센시, 아가노시, 사도시, 다이나이시, 세이로정, 야히코촌, 아가정, 세키카와촌, 아와시마우라촌).

설명: 건조 주의보는 대기가 건조하여 화재 발생 가능성이 높을 때 발표됩니다.

요약:

- 2026년 10월 18일 오후 11시 21분 기준
- 니가타현(新潟県) 하에쓰(下越), 사도(佐渡) 지역 등
- 건조 주의보 해제

별도 행동 지침 번역: None

용어: [{"term": "건조 주의보", "meaning": "실효 습도가 낮아 화재 발생 위험이 클 때 발표되는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.103초 · HTTP 200

전체 번역:

기상경보·주의보(R06)(기타 주의보). 발표시각: 2026년 10월 18일 오후 11시 21분(UTC+9:00). 발표 지역: 니가타 지방기상대(新潟地方気象台). 신潟현(新潟県) 건조주의보가 해제되었습니다. 주의보를 해제합니다. 해제 지역: 니가타현(新潟県), 가에쓰(下越), 사도(佐渡), 니가타 지역(新潟地域), 이와후네 지역(岩船地域), 시바타 지역(新発田地域), 고센 지역(五泉地域), 니가타시(新潟市), 시바타시(新発田市), 무라카미시(村上市), 쓰바메시(燕市), 고센시(五泉市), 아가노시(阿賀野市), 사도시(佐渡市), 타이내시(胎内市), 세이로정(聖籠町), 야히코촌(弥彦村), 아가정(阿賀町), 세키카와촌(関川村), 아와시마우라촌(粟島浦村).

설명: 니가타현에 내려졌던 건조주의보가 해제되어 화재 위험 주의 상태가 종료되었습니다.

요약:

- 2026년 10월 18일 오후 11시 21분(UTC+9:00) 발표 당시 지속 상태
- 니가타현(新潟県) 및 관련 지역
- 건조주의보 해제

별도 행동 지침 번역: None

용어: [{"term": "건조주의보", "meaning": "대기가 매우 건조해 화재 발생 가능성이 높을 때 주의를 당부하기 위해 발표하는 기상 경보입니다."}]

## JP-07 — 気象警報・注意報（Ｒ０６）（土砂）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018144159_0_VPWW56_450000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（土砂）
DateTime: 2026-10-18T14:41:59Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県土砂災害警報・注意報
ReportDateTime: 2026-10-18T23:41:00+09:00
TargetDateTime: 2026-10-18T23:41:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 北部平野部では、土砂災害に注意してください。
Name: レベル２土砂災害注意報
Name: 宮崎県
Name: レベル２土砂災害注意報
Name: 北部平野部
Name: レベル２土砂災害注意報
Name: 延岡・日向地区
Name: レベル２土砂災害注意報
Name: 西都・高鍋地区
Name: レベル２土砂災害注意報
Name: 日向市
Name: レベル２土砂災害注意報
Name: 都農町
Name: レベル２土砂災害注意報
Status: 発表
Name: 宮崎県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 南部平野部
Name: レベル２土砂災害注意報
Status: 発表
Name: 北部平野部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Status: 発表警報・注意報はなし
Name: 宮崎地区
Status: 発表警報・注意報はなし
Name: 日南・串間地区
Name: レベル２土砂災害注意報
Status: 発表
Name: 延岡・日向地区
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Name: レベル２土砂災害注意報
Status: 発表
Name: 西都・高鍋地区
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Status: 発表警報・注意報はなし
Name: 宮崎市
Status: 発表警報・注意報はなし
Name: 都城市
Status: 発表警報・注意報はなし
Name: 延岡市
Status: 発表警報・注意報はなし
Name: 日南市
Status: 発表警報・注意報はなし
Name: 小林市
Name: レベル２土砂災害注意報
Status: 発表
Type: 土砂災害危険度
Name: 警戒レベル２
Name: 日向市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 串間市
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Status: 発表警報・注意報はなし
Name: 高鍋町
Status: 発表警報・注意報はなし
Name: 新富町
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Status: 発表警報・注意報はなし
Name: 川南町
Name: レベル２土砂災害注意報
Status: 発表
Type: 土砂災害危険度
Name: 警戒レベル２
Name: 都農町
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 門川町
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町
Name: 宮崎県
Name: 宮崎地方気象台

### gemini-3.1-flash-lite

응답 4.19초 · HTTP 200

전체 번역:

기상 경보 및 주의보(R06)(토사 재해). 발표 시각: 2026년 10월 18일 오후 11시 41분. 발표 기관: 미야자키 지방 기상대. 미야자키현 토사 재해 경보 및 주의보. 북부 평야부에서는 토사 재해에 주의하십시오. 레벨 2 토사 재해 주의보가 발표된 지역은 다음과 같습니다: 북부 평야부, 노베오카·휴가 지구, 사이토·타카나베 지구, 휴가시, 츠노초.

설명: 토사 재해는 비로 인해 지반이 약해져 산사태나 흙더미가 무너져 내리는 현상을 의미합니다.

요약:

- 2026년 10월 18일 오후 11시 41분 발표
- 미야자키현 북부 평야부, 노베오카·휴가 지구, 사이토·타카나베 지구, 휴가시, 츠노초 대상
- 토사 재해 주의보(레벨 2) 발령 중이므로 주의 요망

별도 행동 지침 번역: 북부 평야부에서는 토사 재해에 주의하십시오.

용어: [{"term": "토사 재해", "meaning": "집중 호우 등으로 인해 산비탈이나 절벽의 흙과 돌이 무너져 내리는 재해입니다."}, {"term": "레벨 2", "meaning": "일본 기상청의 경계 레벨 중 하나로, 재해 발생 가능성이 있으므로 주의가 필요한 단계입니다."}]

### gemini-3.5-flash-lite

응답 2.135초 · HTTP 200

전체 번역:

제목: 기상경보 주의보(R06)(토사)
보고 일시: 2026년 10월 18일 오후 11:41 (+09:00)
편집 기관: 미야자키 지방기상대
발행 기관: 미야자키 지방기상대
제목: 미야자키현 토사재해 경보 주의보
대상 일시: 2026년 10월 18일 오후 11:41 (+09:00)
정보 종류: 기상경보 주의보
본문: 북부 평지(北部平野部)에서는 토사재해에 주의하십시오.
발표 당시 지속 상태:
- 미야자키현(宮崎県)
- 레벨2 토사재해주의보(レベル２土砂災害注意報)
- 북부 평지(北部平野部)
- 延岡・日向地区
- 西都・高鍋地区
- 日向市
- 都農町

설명: 호우 등으로 인해 토사 재해가 발생할 위험이 있어 주의가 필요한 상황입니다.

요약:

- 2026년 10월 18일 오후 11:41 기준 미야자키현(宮崎県)에 발표 당시 지속 상태로 토사재해주의보가 내려졌습니다.
- 북부 평지(北部平野部) 등에서 토사재해에 주의하십시오.

별도 행동 지침 번역: 북부 평지(北部平野部)에서는 토사재해에 주의하십시오.

용어: [{"term": "레벨2 토사재해주의보", "meaning": "재해 위험 지역에서 주민 스스로 대피 준비를 해야 하는 단계입니다."}, {"term": "토사재해", "meaning": "산사태나 붕괴 등으로 인해 흙과 모래가 무너져 내리는 재해입니다."}]

## JP-08 — 気象警報・注意報（Ｒ０６）（大雨）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018155002_0_VPWW55_450000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（大雨）
DateTime: 2026-10-18T15:50:01Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県大雨警報・注意報
ReportDateTime: 2026-10-19T00:50:00+09:00
TargetDateTime: 2026-10-19T00:50:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 北部平野部では、低い土地の浸水や河川の増水に注意してください。
Name: レベル２大雨注意報
Name: 宮崎県
Name: レベル２大雨注意報
Name: 北部平野部
Name: レベル２大雨注意報
Name: 延岡・日向地区
Name: レベル２大雨注意報
Name: 西都・高鍋地区
Name: レベル２大雨注意報
Name: 延岡市
Name: レベル２大雨注意報
Name: 日向市
Name: レベル２大雨注意報
Name: 都農町
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 宮崎県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 南部平野部
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 北部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Status: 発表警報・注意報はなし
Name: 宮崎地区
Status: 発表警報・注意報はなし
Name: 日南・串間地区
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 延岡・日向地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 西都・高鍋地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Status: 発表警報・注意報はなし
Name: 宮崎市
Status: 発表警報・注意報はなし
Name: 都城市
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Type: 大雨浸水危険度
Name: 警戒レベル２
Name: 延岡市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 日南市
Status: 発表警報・注意報はなし
Name: 小林市
Name: レベル２大雨注意報
Status: 発表
Type: 大雨浸水危険度
Name: 警戒レベル２
Name: 日向市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 串間市
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Status: 発表警報・注意報はなし
Name: 高鍋町
Status: 発表警報・注意報はなし
Name: 新富町
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Status: 発表警報・注意報はなし
Name: 川南町
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Type: 大雨浸水危険度
Name: 警戒レベル２
Name: 都農町
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 門川町
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町

### gemini-3.1-flash-lite

응답 2.33초 · HTTP 200

전체 번역:

기상 경보 및 주의보(R06)(호우). 발표 시각: 2026년 10월 19일 오전 12시 50분. 미야자키 지방 기상대 발표. 북부 평야부에서는 낮은 지대의 침수 및 하천 수위 상승에 주의하십시오. 현재 미야자키현의 북부 평야부(노베오카·휴가 지구, 사이토·타카나베 지구, 노베오카시, 휴가시, 츠노초) 및 남부 평야부(니치난·쿠시마 지구)에 레벨 2 호우 주의보가 발표 당시 지속 상태입니다.

설명: 호우로 인해 낮은 지대가 침수되거나 하천의 수위가 급격히 상승할 위험이 있습니다.

요약:

- 2026년 10월 19일 오전 12시 50분 기준 미야자키현 일부 지역에 호우 주의보가 발효 중입니다.
- 북부 평야부 및 남부 평야부의 특정 지구에서 레벨 2 호우 주의보가 지속되고 있습니다.
- 낮은 지대 침수와 하천 수위 상승에 유의하십시오.

별도 행동 지침 번역: 북부 평야부에서는 낮은 지대의 침수나 하천의 수위 상승에 주의하십시오.

용어: [{"term": "레벨 2 호우 주의보", "meaning": "기상청이 발표하는 경계 수준으로, 호우로 인한 침수 위험이 있어 주의가 필요한 상태를 의미합니다."}]

### gemini-3.5-flash-lite

응답 4.68초 · HTTP 200

전체 번역:

제목: 기상경보·주의보(R06)(호우) 일시: 2026년 10월 18일 오후 3시 50분 01초 (UTC+00:00) 상태: 통상 편집오피스: 미야자키 지방기상대 발행오피스: 미야자키 지방기상대 제목: 미야자키현 호우 경보·주의보 보고일시: 2026년 10월 19일 오전 12시 50분 (UTC+09:00) 대상일시: 2026년 10월 19일 오전 12시 50분 (UTC+09:00) 정보유형: 발표 정보종류: 기상경보·주의보 정보종류버전: 1.5_0 텍스트: 북부 평야부(北部平野部)에서는 낮은 토지의 침수나 하천의 수위 상승에 주의하십시오. 이름: 레벨 2 호우주의보 이름: 미야자키현(宮崎県) 이름: 레벨 2 호우주의보 이름: 북부 평야부(北部平野部) 이름: 레벨 2 호우주의보 이름: 노베오카·휴가 지구(延岡・日向地区) 이름: 레벨 2 호우주의보 이름: 사이토·다카나베 지구(西都・高鍋地区) 이름: 레벨 2 호우주의보 이름: 노베오카시(延岡市) 이름: 레벨 2 호우주의보 이름: 휴가시(日向市) 이름: 레벨 2 호우주의보 이름: 쓰노초(都農町) 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 이름: 미야자키현(宮崎県) 변경상태: 변화 없음 전체상태: 일부 편집표지: 0 상태: 발표된 경보·주의보 없음 이름: 남부 평야부(南部平野部) 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 이름: 북부 평야부(北部平野部) 변경상태: 변화 없음 전체상태: 일부 편집표지: 1 상태: 발표된 경보·주의보 없음 이름: 남부 산간지대(南部山沿い) 상태: 발표된 경보·주의보 없음 이름: 북부 산간지대(北部山沿い) 상태: 발표된 경보·주의보 없음 이름: 미야자키 지구(宮崎地区) 상태: 발표된 경보·주의보 없음 이름: 니치난·구시마 지구(日南・串間地区) 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 이름: 노베오카·휴가 지구(延岡・日向地区) 변경상태: 변화 없음 전체상태: 일부 편집표지: 0 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 이름: 사이토·다카나베 지구(西都・高鍋地区) 변경상태: 변화 없음 전체상태: 일부 편집표지: 0 상태: 발표된 경보·주의보 없음 이름: 고바야시·에비노 지구(小林・えびの地区) 상태: 발표된 경보·주의보 없음 이름: 미야코노조 지구(都城地区) 상태: 발표된 경보·주의보 없음 이름: 다카치호 지구(高千穂地区) 상태: 발표된 경보·주의보 없음 이름: 시바·미사토 지구(椎葉・美郷地区) 상태: 발표된 경보·주의보 없음 이름: 미야자키시(宮崎市) 상태: 발표된 경보·주의보 없음 이름: 미야코노조시(都城市) 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 유형: 호우 침수 위험도 이름: 경계 레벨 2 이름: 노베오카시(延岡市) 변경상태: 변화 없음 상태: 발표된 경보·주의보 없음 이름: 니치난시(日南市) 상태: 발표된 경보·주의보 없음 이름: 고바야시시(小林市) 이름: 레벨 2 호우주의보 상태: 발표 유형: 호우 침수 위험도 이름: 경계 레벨 2 이름: 휴가시(日向市) 변경상태: 경보·주의보 종류별에 변화 있음 상태: 발표된 경보·주의보 없음 이름: 구시마시(串間市) 상태: 발표된 경보·주의보 없음 이름: 사이토시(西都市) 상태: 발표된 경보·주의보 없음 이름: 에비노시(えびの市) 상태: 발표된 경보·주의보 없음 이름: 미마타초(三股町) 상태: 발표된 경보·주의보 없음 이름: 다카하루초(高原町) 상태: 발표된 경보·주의보 없음 이름: 구니토미초(国富町) 상태: 발표된 경보·주의보 없음 이름: 아야초(綾町) 상태: 발표된 경보·주의보 없음 이름: 다카나베초(高鍋町) 상태: 발표된 경보·주의보 없음 이름: 신토미초(新富町) 상태: 발표된 경보·주의보 없음 이름: 니시메라촌(西米良村) 상태: 발표된 경보·주의보 없음 이름: 기조초(木城町) 상태: 발표된 경보·주의보 없음 이름: 가와미나미초(川南町) 이름: 레벨 2 호우주의보 상태: 발표 당시 지속 상태 이름: 레벨 2 호우주의보 유형: 호우 침수 위험도 이름: 경계 레벨 2 이름: 쓰노초(都農町) 변경상태: 변화 없음 상태: 발표된 경보·주의보 없음 이름: 가도카와초(門川町) 상태: 발표된 경보·주의보 없음 이름: 모로쓰카촌(諸塚村) 상태: 발표된 경보·주의보 없음 이름: 시바촌(椎葉村) 상태: 발표된 경보·주의보 없음 이름: 미사토초(美郷町) 상태: 발표된 경보·주의보 없음 이름: 다카치호초(高千穂町) 상태: 발표된 경보·주의보 없음 이름: 히노카게초(日之影町) 상태: 발표된 경보·주의보 없음 이름: 고카세초(五ヶ瀬町)

설명: 호우로 인해 미야자키현(宮崎県) 일부 지역에 침수 및 하천 범람 위험이 있어 주의보가 내려졌습니다.

요약:

- 2026년 10월 19일 오전 0시 50분 기준 미야자키현(宮崎県) 일부 지역에 호우주의보가 발표되었습니다.
- 북부 평야부(北部平野部)에서는 낮은 토지의 침수와 하천 수위 상승에 주의하십시오.

별도 행동 지침 번역: 북부 평야부에서는, 낮은 토지의 침수나 하천의 수위 상승에 주의하십시오.

용어: [{"term": "대우주의보 (大雨注意報)", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 주의를 당부하기 위해 발표하는 기상 경보입니다."}, {"term": "경계 레벨 2 (警戒レベル２)", "meaning": "일본의 방재 경보 체계로, 재해 발생 시 행동을 스스로 검토해야 하는 단계입니다."}]

## JP-09 — 気象警報・注意報（Ｒ０６）（暴風）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018160922_0_VPWW58_060000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（暴風）
DateTime: 2026-10-18T16:09:21Z
Status: 通常
EditorialOffice: 山形地方気象台
PublishingOffice: 山形地方気象台
Title: 山形県暴風（雪）警報・注意報
ReportDateTime: 2026-10-19T01:09:00+09:00
TargetDateTime: 2026-10-19T01:09:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 庄内では、強風に注意してください。
Name: 強風注意報
Name: 山形県
Name: 強風注意報
Name: 庄内
Name: 強風注意報
Name: 庄内北部
Name: 強風注意報
Name: 庄内南部
Name: 強風注意報
Name: 鶴岡市
Name: 強風注意報
Name: 酒田市
Name: 強風注意報
Name: 遊佐町
Name: 強風注意報
Status: 発表
Name: 山形県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 村山
Status: 発表警報・注意報はなし
Name: 置賜
Name: 強風注意報
Status: 発表
Name: 庄内
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 東南村山
Status: 発表警報・注意報はなし
Name: 北村山
Status: 発表警報・注意報はなし
Name: 西村山
Status: 発表警報・注意報はなし
Name: 東南置賜
Status: 発表警報・注意報はなし
Name: 西置賜
Name: 強風注意報
Status: 発表
Name: 庄内北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 強風注意報
Status: 発表
Name: 庄内南部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 山形市
Status: 発表警報・注意報はなし
Name: 米沢市
Name: 強風注意報
Status: 発表
Type: 風危険度
AreaName: 海上
Name: 注意報級
Type: 風
AreaName: 海上
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 鶴岡市
ChangeStatus: 警報・注意報種別に変化有
Name: 強風注意報
Status: 発表
Type: 風危険度
AreaName: 海上
Name: 注意報級
Type: 風
AreaName: 海上
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 酒田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 新庄市
Status: 発表警報・注意報はなし
Name: 寒河江市
Status: 発表警報・注意報はなし
Name: 上山市
Status: 発表警報・注意報はなし
Name: 村山市
Status: 発表警報・注意報はなし
Name: 長井市
Status: 発表警報・注意報はなし
Name: 天童市
Status: 発表警報・注意報はなし
Name: 東根市
Status: 発表警報・注意報はなし
Name: 尾花沢市
Status: 発表警報・注意報はなし
Name: 南陽市
Status: 発表警報・注意報はなし
Name: 山辺町
Status: 発表警報・注意報はなし
Name: 中山町
Status: 発表警報・注意報はなし
Name: 河北町
Status: 発表警報・注意報はなし
Name: 西川町
Status: 発表警報・注意報はなし
Name: 朝日町
Status: 発表警報・注意報はなし
Name: 大江町
Status: 発表警報・注意報はなし
Name: 大石田町
Status: 発表警報・注意報はなし
Name: 金山町
Status: 発表警報・注意報はなし
Name: 最上町
Status: 発表警報・注意報はなし
Name: 舟形町
Status: 発表警報・注意報はなし
Name: 真室川町
Status: 発表警報・注意報はなし
Name: 大蔵村
Status: 発表警報・注意報はなし
Name: 鮭川村
Status: 発表警報・注意報はなし
Name: 戸沢村
Status: 発表警報・注意報はなし
Name: 高畠町
Status: 発表警報・注意報はなし
Name: 川西町
Status: 発表警報・注意報はなし
Name: 小国町
Status: 発表警報・注意報はなし
Name: 白鷹町
Status: 発表警報・注意報はなし
Name: 飯豊町
Status: 発表警報・注意報はなし
Name: 三川町
Status: 発表警報・注意報はなし
Name: 庄内町
Name: 強風注意報
Status: 発表
Type: 風危険度
AreaName: 海上
Name: 注意報級
Type: 風
AreaName: 海上
WindDirection: 南西
AreaName: 海上
WindSpeed: 15
Name: 遊佐町
ChangeStatus: 警報・注意報種別に変化有

### gemini-3.1-flash-lite

응답 2.321초 · HTTP 200

전체 번역:

기상 경보 및 주의보 (R06) (폭풍). 야마가타 지방 기상대(山形地方気象台) 발표. 2026년 10월 19일 오전 1시 9분 기준 야마가타현(山形県) 강풍 주의보가 발표되었습니다. 쇼나이(庄内) 지역에서는 강풍에 주의하십시오. 현재 쇼나이(庄内), 쇼나이 북부(庄内北部), 쇼나이 남부(庄内南部), 쓰루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町)에 강풍 주의보가 발효 중입니다. 해상에서는 남서풍이 15m/s로 불 것으로 예상됩니다.

설명: 강풍 주의보는 강한 바람으로 인해 피해가 발생할 가능성이 있을 때 발표됩니다.

요약:

- 2026년 10월 19일 오전 1시 9분 발표
- 야마가타현(山形県) 쇼나이(庄内) 지역 강풍 주의보 발효
- 해상 강풍에 주의하고 안전에 유의하십시오

별도 행동 지침 번역: 쇼나이(庄内) 지역에서는 강풍에 주의하십시오.

용어: [{"term": "강풍 주의보", "meaning": "강한 바람으로 인해 재해 발생이 예상될 때 주의를 환기하기 위해 발표하는 기상 정보입니다."}, {"term": "쇼나이(庄内)", "meaning": "야마가타현 서부의 해안 지역을 지칭하는 지명입니다."}]

### gemini-3.5-flash-lite

응답 2.548초 · HTTP 200

전체 번역:

제목: 기상경보·주의보(R06)(폭풍). 일시: 2026년 10월 18일 16:09:21 UTC. 편집관서: 야마가타 지방기상대. 발표관서: 야마가타 지방기상대. 제목: 야마가타현 폭풍(눈) 경보·주의보. 보고일시: 2026년 10월 19일 오전 01:09 +09:00. 대상일시: 2026년 10월 19일 오전 01:09 +09:00. 정보유형: 발표. 정보종류: 기상경보·주의보. 본문: 쇼나이(庄内)에서는 강풍에 주의하십시오. 지역 및 상태 정보: 쇼나이(庄内) - 강풍주의보 발표(발표 당시 지속 상태), 쇼나이호쿠bu(庄内北部) - 강풍주의보 발표(발표 당시 지속 상태), 쇼나이나무bu(庄内南部) - 강풍주의보 발표(발표 당시 지속 상태), 쓰루오카시(鶴岡市) - 강풍주의보 발표(발표 당시 지속 상태), 사카타시(酒田市) - 강풍주의보 발표(발표 당시 지속 상태), 유사마치(遊佐町) - 강풍주의보 발표(발표 당시 지속 상태). 해상 기준 풍향 남서, 풍속 15.

설명: 해당 지역에 강풍주의보가 발표되어 있으므로 강한 바람에 주의하십시오.

요약:

- 2026년 10월 19일 오전 01:09 +09:00 발표
- 야마가타현 쇼나이(庄内) 지역 대상
- 강풍주의보 발표 당시 지속 상태이므로 강풍에 주의하십시오

별도 행동 지침 번역: 쇼나이(庄内)에서는 강풍에 주의하십시오.

용어: [{"term": "強風注意報", "meaning": "강풍으로 인한 재해 발생이 우려될 때 발표하는 주의보입니다."}, {"term": "庄内", "meaning": "야마가타현 서부의 해안 지역 명칭입니다."}]

## JP-10 — 気象警報・注意報（Ｒ０６）（波浪）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018160922_0_VPWW59_060000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（波浪）
DateTime: 2026-10-18T16:09:21Z
Status: 通常
EditorialOffice: 山形地方気象台
PublishingOffice: 山形地方気象台
Title: 山形県波浪警報・注意報
ReportDateTime: 2026-10-19T01:09:00+09:00
TargetDateTime: 2026-10-19T01:09:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 庄内では、高波に注意してください。
Name: 波浪注意報
Name: 山形県
Name: 波浪注意報
Name: 庄内
Name: 波浪注意報
Name: 庄内北部
Name: 波浪注意報
Name: 庄内南部
Name: 波浪注意報
Name: 鶴岡市
Name: 波浪注意報
Name: 酒田市
Name: 波浪注意報
Name: 遊佐町
Name: 波浪注意報
Status: 発表
Name: 山形県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 村山
Status: 発表警報・注意報はなし
Name: 置賜
Name: 波浪注意報
Status: 発表
Name: 庄内
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 東南村山
Status: 発表警報・注意報はなし
Name: 北村山
Status: 発表警報・注意報はなし
Name: 西村山
Status: 発表警報・注意報はなし
Name: 東南置賜
Status: 発表警報・注意報はなし
Name: 西置賜
Name: 波浪注意報
Status: 発表
Name: 庄内北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Name: 波浪注意報
Status: 発表
Name: 庄内南部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 最上
Status: 発表警報・注意報はなし
Name: 山形市
Status: 発表警報・注意報はなし
Name: 米沢市
Name: 波浪注意報
Status: 発表
Type: 波危険度
Name: 注意報級
Type: 波
WaveHeight: 4
Name: 鶴岡市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 発表
Type: 波危険度
Name: 注意報級
Type: 波
WaveHeight: 4
Name: 酒田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 新庄市
Status: 発表警報・注意報はなし
Name: 寒河江市
Status: 発表警報・注意報はなし
Name: 上山市
Status: 発表警報・注意報はなし
Name: 村山市
Status: 発表警報・注意報はなし
Name: 長井市
Status: 発表警報・注意報はなし
Name: 天童市
Status: 発表警報・注意報はなし
Name: 東根市
Status: 発表警報・注意報はなし
Name: 尾花沢市
Status: 発表警報・注意報はなし
Name: 南陽市
Status: 発表警報・注意報はなし
Name: 山辺町
Status: 発表警報・注意報はなし
Name: 中山町
Status: 発表警報・注意報はなし
Name: 河北町
Status: 発表警報・注意報はなし
Name: 西川町
Status: 発表警報・注意報はなし
Name: 朝日町
Status: 発表警報・注意報はなし
Name: 大江町
Status: 発表警報・注意報はなし
Name: 大石田町
Status: 発表警報・注意報はなし
Name: 金山町
Status: 発表警報・注意報はなし
Name: 最上町
Status: 発表警報・注意報はなし
Name: 舟形町
Status: 発表警報・注意報はなし
Name: 真室川町
Status: 発表警報・注意報はなし
Name: 大蔵村
Status: 発表警報・注意報はなし
Name: 鮭川村
Status: 発表警報・注意報はなし
Name: 戸沢村
Status: 発表警報・注意報はなし
Name: 高畠町
Status: 発表警報・注意報はなし
Name: 川西町
Status: 発表警報・注意報はなし
Name: 小国町
Status: 発表警報・注意報はなし
Name: 白鷹町
Status: 発表警報・注意報はなし
Name: 飯豊町
Status: 発表警報・注意報はなし
Name: 三川町
Status: 発表警報・注意報はなし
Name: 庄内町
Name: 波浪注意報
Status: 発表
Type: 波危険度
Name: 注意報級
Type: 波
WaveHeight: 4
Name: 遊佐町
ChangeStatus: 警報・注意報種別に変化有

### gemini-3.1-flash-lite

응답 1.992초 · HTTP 200

전체 번역:

기상 경보 및 주의보 (R06) (파랑). 야마가타 지방 기상대 발표. 2026년 10월 19일 오전 1시 9분 발표. 쇼나이(庄内) 지역에서는 높은 파도에 주의하십시오.

설명: 해안가에서 높은 파도로 인한 위험이 예상되니 주의가 필요합니다.

요약:

- 2026년 10월 19일 오전 1시 9분 기준 야마가타현(山形県) 쇼나이(庄内) 지역에 파랑주의보가 발표되었습니다.
- 대상 지역은 쇼나이(庄内) 북부 및 남부, 츠루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町)입니다.
- 해당 지역에서는 높은 파도에 유의하시기 바랍니다.

별도 행동 지침 번역: 쇼나이(庄内) 지역에서는 높은 파도에 주의하십시오.

용어: [{"term": "파랑주의보", "meaning": "높은 파도로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 2.343초 · HTTP 200

전체 번역:

제목: 기상경보·주의보(R06)(파랑). 일시: 2026년 10월 18일 16시 09분 21초 UTC. 상태: 통상. 편집관서: 야마가타 지방기상대. 발표관서: 야마가타 지방기상대. 제목: 야마가타현 파랑경보·주의보. 보고일시: 2026년 10월 19일 01시 09분 +09:00. 대상일시: 2026년 10월 19일 01시 09분 +09:00. 정보종류: 발표. 정보종류버전: 1.5_0. 본문: 쇼나이(庄内)에서는 높은 파도에 주의하십시오. 명칭: 파랑주의보, 야마가타현(山形県), 쇼나이(庄内), 쇼나이 북부(庄内北部), 쇼나이 남부(庄内南部), 쓰루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町). 상태: 발표 당시 지속 상태 (야마가타현(山形県), 쇼나이(庄内), 쇼나이 북부(庄内北部), 쇼나이 남부(庄内南部), 쓰루오카시(鶴岡市), 사카타시(酒田市), 유자마치(遊佐町)).

설명: 해상에서 높은 파도가 발생할 위험이 있으니 해안가 접근을 자제하십시오.

요약:

- 2026년 10월 19일 01시 09분 +09:00 발표
- 대상 지역: 야마가타현(山形県) 쇼나이(庄内) 지역
- 파랑주의보 발표 당시 지속 상태

별도 행동 지침 번역: 쇼나이(庄内)에서는 높은 파도에 주의하십시오.

용어: [{"term": "波浪注意報", "meaning": "해상에서 높은 파도로 인한 재해 우려가 있을 때 발표하는 주의보입니다."}, {"term": "庄内", "meaning": "야마가타현 서부 해안 지역 명칭입니다."}]

## JP-11 — 降灰予報（定時）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018140042_0_VFVO53_010000.xml

### 입력 원문

Title: 降灰予報（定時）
DateTime: 2026-10-18T14:00:00Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 火山名　薩摩硫黄島　降灰予報（定時）
ReportDateTime: 2026-10-18T23:00:00+09:00
TargetDateTime: 2026-10-19T00:00:00+09:00
ValidDateTime: 2026-10-19T18:00:00+09:00
EventID: 508
InfoType: 発表
Serial: 1
InfoKind: 降灰予報
InfoKindVersion: 1.1_0
Text: 現在、薩摩硫黄島は噴火警戒レベル２（火口周辺規制）です。薩摩硫黄島で噴火が発生した場合には、１９日０９時から１２時までは火口から北方向に降灰が予想されます。
Name: 降灰予報（定時）
Name: 薩摩硫黄島
Name: 降灰
Name: 鹿児島県三島村
Name: 小さな噴石の落下
Name: 鹿児島県三島村
Name: 降灰予報（定時）
Name: 薩摩硫黄島
Name: 降灰
Name: 鹿児島県三島村
Name: 小さな噴石の落下
Name: 鹿児島県三島村
StartTime: 2026-10-19T00:00:00+09:00
EndTime: 2026-10-19T03:00:00+09:00
Name: 降灰
PlumeDirection: 北西
Distance: 40
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北西
Distance: 1
Name: 鹿児島県三島村
StartTime: 2026-10-19T03:00:00+09:00
EndTime: 2026-10-19T06:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 30
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北西
Distance: 1
Name: 鹿児島県三島村
StartTime: 2026-10-19T06:00:00+09:00
EndTime: 2026-10-19T09:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 40
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北西
Distance: 1
Name: 鹿児島県三島村
StartTime: 2026-10-19T09:00:00+09:00
EndTime: 2026-10-19T12:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 40
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北東
Distance: 2
Name: 鹿児島県三島村
StartTime: 2026-10-19T12:00:00+09:00
EndTime: 2026-10-19T15:00:00+09:00
Name: 降灰
PlumeDirection: 北東
Distance: 30
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北東
Distance: 2
Name: 鹿児島県三島村
StartTime: 2026-10-19T15:00:00+09:00
EndTime: 2026-10-19T18:00:00+09:00
Name: 降灰
PlumeDirection: 北東
Distance: 30
Name: 鹿児島県三島村
Name: 小さな噴石の落下
PlumeDirection: 北東
Distance: 2
Name: 鹿児島県三島村
VolcanoHeadline: 現在、薩摩硫黄島は噴火警戒レベル２（火口周辺規制）です。薩摩硫黄島で噴火が発生した場合には、１９日０９時から１２時までは火口から北方向に降灰が予想されます。
VolcanoActivity: １９日０時から１９日１８時までに噴火が発生した場合には、以下の方向・距離に降灰及び小さな噴石の落下が予想されます。
　
　時刻　　　　　　　　　　　　火口からの方向　降灰の距離　小さな噴石の距離
　１９日００時から０３時まで　北西　　　　　　４０ｋｍ　　１ｋｍ　　　　　
　１９日０３時から０６時まで　北　　　　　　　３０ｋｍ　　１ｋｍ　　　　　
　１９日０６時から０９時まで　北　　　　　　　４０ｋｍ　　１ｋｍ　　　　　
　１９日０９時から１２時まで　北　　　　　　　４０ｋｍ　　２ｋｍ　　　　　
　１９日１２時から１５時まで　北東　　　　　　３０ｋｍ　　２ｋｍ　　　　　
　１９日１５時から１８時まで　北東　　　　　　３０ｋｍ　　２ｋｍ　　　　　

　
　期間中に噴火が発生した場合には、以下の市町村に降灰が予想されます。
　鹿児島県：三島村
VolcanoPrevention: 噴煙が火口縁上１０００ｍまで上がった場合の火山灰及び小さな噴石の落下範囲を示しています。
　噴火発生時、小さな噴石の落下が予想される範囲内では、屋内や頑丈な屋根の下などに移動してください。

### gemini-3.1-flash-lite

응답 3.388초 · HTTP 200

전체 번역:

강회 예보(정시) 화산명: 사쓰마이오지마(薩摩硫黄島) 강회 예보(정시) 보고 일시: 2026년 10월 18일 오후 11시 00분(JST) 대상 일시: 2026년 10월 19일 오전 0시 00분(JST) 유효 일시: 2026년 10월 19일 오후 6시 00분(JST) 현재 사쓰마이오지마(薩摩硫黄島)는 분화 경계 레벨 2(화구 주변 규제)입니다. 사쓰마이오지마(薩摩硫黄島)에서 분화가 발생할 경우, 19일 09시부터 12시까지는 화구에서 북쪽 방향으로 강회가 예상됩니다. 19일 0시부터 19일 18시까지 분화가 발생할 경우, 다음 방향 및 거리로 강회 및 작은 분석 낙하가 예상됩니다. [시간 / 화구로부터의 방향 / 강회 거리 / 작은 분석 거리] 19일 00시~03시 / 북서 / 40km / 1km, 19일 03시~06시 / 북 / 30km / 1km, 19일 06시~09시 / 북 / 40km / 1km, 19일 09시~12시 / 북 / 40km / 2km, 19일 12시~15시 / 북동 / 30km / 2km, 19일 15시~18시 / 북동 / 30km / 2km. 해당 기간 중 분화 발생 시 강회가 예상되는 시정촌: 가고시마현(鹿児島県) 미시마촌(三島村). 본 예보는 분연이 화구연 위 1000m까지 상승했을 경우의 화산재 및 작은 분석 낙하 범위를 나타냅니다.

설명: 화산 분화 시 화산재가 날리거나 작은 돌덩이(분석)가 떨어질 위험이 있습니다.

요약:

- 2026년 10월 19일 0시부터 18시까지 사쓰마이오지마(薩摩硫黄島) 분화 시 강회 및 분석 낙하 예상
- 가고시마현(鹿児島県) 미시마촌(三島村) 지역에 영향 가능성
- 분석 낙하 예상 범위 내에서는 즉시 실내나 튼튼한 지붕 아래로 대피하십시오.

별도 행동 지침 번역: 분화 발생 시, 작은 분석이 낙하할 것으로 예상되는 범위 내에 계신 분들은 실내나 튼튼한 지붕 아래 등으로 이동하십시오.

용어: [{"term": "분화 경계 레벨 2", "meaning": "화구 주변에 영향을 미칠 수 있는 분화가 발생하거나 발생할 것으로 예상되는 상태로, 화구 주변에 대한 출입 규제가 시행됩니다."}, {"term": "분석(噴石)", "meaning": "화산 분화 시 화구에서 튀어나오는 돌덩이를 의미합니다."}, {"term": "강회(降灰)", "meaning": "화산 분화로 인해 화산재가 지상으로 떨어지는 현상을 의미합니다."}]

### gemini-3.5-flash-lite

응답 3.215초 · HTTP 200

전체 번역:

제목: 降灰予報（定時） (정기 화산灰 예보)
발행 일시: 2026년 10월 18일 오후 11시 00분 (+09:00)
대상 일시: 2026년 10월 19일 오전 0시 00분 (+09:00)
유효 일시: 2026년 10월 19일 오후 6시 00분 (+09:00)
상태: 통상
편집 부서: 기상청 본청
발행 기관: 기상청
화산명: 薩摩硫黄島 (사쓰마이오토지마)

현재, 薩摩硫黄島 (사쓰마이오토지마)는 분화 경보 레벨 2(화구 주변 규제)입니다. 薩摩硫黄島 (사쓰마이오토지마)에서 분화가 발생할 경우, 19일 09시부터 12시까지는 화구에서 북쪽 방향으로 화산灰 낙하가 예상됩니다.

19일 0시부터 19일 18시까지 사이에 분화가 발생할 경우에는 다음 방향 및 거리에 화산灰 및 작은 분석(화산탄)의 낙낙이 예상됩니다.

시각 / 화구로부터의 방향 / 화산灰 거리 / 작은 분석 거리
19일 00시부터 03시까지 / 북서 / 40km / 1km
19일 03시부터 06시까지 / 북 / 30km / 1km
19일 06시부터 09시까지 / 북 / 40km / 1km
19일 09시부터 12시까지 / 북 / 40km / 2km
19일 12시부터 15시까지 / 북동 / 30km / 2km
19일 15시부터 18시까지 / 북동 / 30km / 2km

기간 중에 분화가 발생할 경우에는 다음 시町村에 화산灰가 예상됩니다.
가고시마현: 三島村 (미시마촌)

분연이 화구 연기 위 1000m까지 올라갔을 경우의 화산灰 및 작은 분석의 낙하 범위를 나타내고 있습니다.
분화 발생 시, 작은 분석의 낙하가 예상되는 범위 내에서는 실내나 튼튼한 지붕 아래 등으로 이동하십시오.

설명: 화산 분화로 인해 화산灰와 작은 화산탄이 비산할 수 있으므로 주의하십시오.

요약:

- 발표 당시 지속 상태: 사쓰마이오토지마 분화 경보 레벨 2 (발표 시각 2026년 10월 18일 오후 11시 00분 +09:00)
- 대상 지역: 가고시마현 미시마촌 (薩摩硫黄島 화산 영향)
- 조치 사항: 작은 분석 낙하 예상 범위 내에서는 실내나 튼튼한 지붕 아래로 이동하십시오.

별도 행동 지침 번역: 분화 발생 시, 작은 분석의 낙하가 예상되는 범위 내에서는 실내나 튼튼한 지붕 아래 등으로 이동하십시오.

용어: [{"term": "降灰", "meaning": "화산 분화로 인해 화산灰가 공기 중에 날리다가 지상으로 떨어지는 현상입니다."}, {"term": "小さな噴石", "meaning": "분화 시 화구에서 뿜어져 나오는 작은 바위와 돌덩이인 분석을 말합니다."}]

## JP-12 — 震源・震度に関する情報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018134900_0_VXSE53_270000.xml

### 입력 원문

Title: 震源・震度に関する情報
DateTime: 2026-10-18T13:49:00Z
Status: 通常
EditorialOffice: 大阪管区気象台
PublishingOffice: 気象庁
Title: 震源・震度情報
ReportDateTime: 2026-10-18T22:49:00+09:00
TargetDateTime: 2026-10-18T22:49:00+09:00
EventID: 20261018224626
InfoType: 発表
Serial: 1
InfoKind: 地震情報
InfoKindVersion: 1.0_1
Text: １８日２２時４６分ころ、地震がありました。
OriginTime: 2026-10-18T22:46:00+09:00
ArrivalTime: 2026-10-18T22:46:00+09:00
Name: 熊本県天草・芦北地方
Magnitude: 2.5
Type: 地震情報／都道府県等
Type: 地震情報／細分区域
Type: 気象・地震・火山情報／市町村等
Type: 震度観測点
MaxInt: 1
Name: 熊本県
MaxInt: 1
Name: 熊本県熊本
MaxInt: 1
Name: 八代市
MaxInt: 1
Name: 八代市平山新町
Int: 1
Text: この地震による津波の心配はありません。

### gemini-3.1-flash-lite

응답 1.997초 · HTTP 200

전체 번역:

진원 및 진도에 관한 정보. 2026년 10월 18일 오후 10시 49분 발표. 18일 오후 10시 46분경 지진이 발생하였습니다. 진원지는 구마모토현 아마쿠사·아시키타 지방(熊本県天草・芦北地方)이며, 규모는 2.5입니다. 최대 진도는 1입니다. 각 지역의 진도는 다음과 같습니다. 구마모토현(熊本県) 진도 1, 구마모토현 구마모토(熊本県熊本) 진도 1, 야쓰시로시(八代市) 진도 1, 야쓰시로시 히라야마신마치(八代市平山新町) 진도 1입니다. 이 지진으로 인한 쓰나미 우려는 없습니다.

설명: 지진 발생으로 인해 해당 지역에서 진동이 감지되었으나 쓰나미 위험은 없습니다.

요약:

- 발생 일시: 2026년 10월 18일 오후 10시 46분
- 발생 지역: 구마모토현 아마쿠사·아시키타 지방(熊本県天草・芦北地方)
- 피해 정보: 최대 진도 1, 쓰나미 우려 없음

별도 행동 지침 번역: None

용어: [{"term": "진도(震度)", "meaning": "일본 기상청이 사용하는 지진 등급으로, 특정 장소에서 감지되는 흔들림의 정도를 0에서 7까지의 단계로 나타냅니다."}, {"term": "규모(Magnitude)", "meaning": "지진 자체의 절대적인 크기를 나타내는 수치입니다."}]

### gemini-3.5-flash-lite

응답 1.962초 · HTTP 200

전체 번역:

제목: 진원 및 진도에 관한 정보
보고 일시: 2026년 10월 18일 오후 10시 49분 +09:00
상태: 발표 당시 지속 상태
발행 기관: 오사카관구기상대, 기상청
내용: 18일 오후 10시 46분경 지진이 발생하였습니다.
진앙지: 구마모토현 아마쿠사·아시키타 지방(熊本県天草・芦北地方)
규모: 2.5
최대 진도: 1
이 지진으로 인한 쓰나미 우려는 없습니다.

설명: 지진 발생 시 낙하물로부터 몸을 보호하고 안전한 장소로 대피하십시오.

요약:

- 2026년 10월 18일 오후 10시 49분 오사카관구기상대 및 기상청에서 지진 정보를 발표했습니다.
- 구마모토현 아마쿠사·아시키타 지방(熊本県天草・芦北地方)에서 규모 2.5의 지진이 발생했습니다.
- 쓰나미 우려는 없습니다.

별도 행동 지침 번역: None

용어: [{"term": "진도", "meaning": "특정 지역에서 느낀 지진의 흔들림 정도를 나타냅니다."}, {"term": "규모", "meaning": "지진 자체가 가진 총에너지의 크기를 나타냅니다."}]

## JP-13 — 台風解析・予報情報（５日予報）（Ｈ３０）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018124204_0_VPTW60_010000.xml

### 입력 원문

Title: 台風解析・予報情報（５日予報）（Ｈ３０）
DateTime: 2026-10-18T12:42:03Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 台風解析・予報情報
ReportDateTime: 2026-10-18T21:45:00+09:00
TargetDateTime: 2026-10-18T21:00:00+09:00
TargetDuration: PT120H
EventID: TC2636
InfoType: 発表
Serial: 37
InfoKind: 台風解析・予報情報（５日予報）
InfoKindVersion: 1.0_2
DateTime: 2026-10-18T21:00:00+09:00
Type: 呼称
Name: CHAMPI
NameKana: チャンパー
Number: 2630
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
Location: マリアナ諸島
Direction: 西
Speed: 9
Speed: 15
Pressure: 960
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 60
Radius: 110
WindSpeed: 30
WindSpeed: 15
Direction: 北東
Radius: 270
Radius: 500
Direction: 南西
Radius: 210
Radius: 390
Name: 熱帯低気圧
BasePoint: +13.4+141.5/
BasePoint: +1325+14130/
Direction: 北東
Radius: 270
Radius: 500
Direction: 南西
Radius: 210
Radius: 390
DateTime: 2026-10-19T09:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +14.4+139.3/
BasePoint: +1425+13920/
Radius: 25
Radius: 45
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 955
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 90
Radius: 165
Name: 熱帯低気圧
BasePoint: +14.4+139.3/
BasePoint: +1425+13920/
Radius: 25
Radius: 45
DateTime: 2026-10-19T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +15.3+137.4/
BasePoint: +1520+13725/
Radius: 35
Radius: 65
Location: フィリピンの東
Direction: 西北西
Speed: 10
Speed: 20
Pressure: 955
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 105
Radius: 190
Name: 熱帯低気圧
BasePoint: +15.3+137.4/
BasePoint: +1520+13725/
Radius: 35
Radius: 65
DateTime: 2026-10-20T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +17.2+132.8/
BasePoint: +1710+13250/
Radius: 55
Radius: 100
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 940
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 135
Radius: 250
Name: 熱帯低気圧
BasePoint: +17.2+132.8/
BasePoint: +1710+13250/
Radius: 55
Radius: 100
DateTime: 2026-10-21T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +19.4+128.1/
BasePoint: +1925+12805/
Radius: 80
Radius: 150
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 925
Type: 風
WindSpeed: 100
WindSpeed: 50
WindSpeed: 140
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 180
Radius: 330
Name: 熱帯低気圧
BasePoint: +19.4+128.1/
BasePoint: +1925+12805/
Radius: 80
Radius: 150
DateTime: 2026-10-22T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +20.5+125.3/
BasePoint: +2030+12520/
Radius: 100
Radius: 185
Location: 沖縄の南
Direction: 西北西
Speed: 7
Speed: 15
Pressure: 935
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 220
Radius: 410
Name: 熱帯低気圧
BasePoint: +20.5+125.3/
BasePoint: +2030+12520/
Radius: 100
Radius: 185
DateTime: 2026-10-23T21:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +22.6+122.0/
BasePoint: +2235+12200/
Radius: 120
Radius: 220
Location: 沖縄の南
Direction: 西北西
Speed: 9
Speed: 15
Pressure: 950
Type: 風
WindSpeed: 85
WindSpeed: 45
WindSpeed: 120
WindSpeed: 60
WindSpeed: 50
WindSpeed: 25
Radius: 240
Radius: 440
Name: 熱帯低気圧
BasePoint: +22.6+122.0/
BasePoint: +2235+12200/
Radius: 120
Radius: 220

### gemini-3.1-flash-lite

응답 2.456초 · HTTP 200

전체 번역:

태풍 해석 및 예보 정보 (5일 예보) (H30). 발표 시각: 2026년 10월 18일 오후 9시 45분. 태풍 제2630호 챔피(CHAMPI)는 2026년 10월 18일 오후 9시 현재 마리아나 제도(マリアナ諸島) 부근에서 서쪽으로 이동 중이며, 중심 기압은 960hPa입니다. 중심 부근 최대 풍속은 90kt(약 167km/h)이며, 최대 순간 풍속은 130kt(약 241km/h)입니다. 이후 10월 23일 오후 9시까지 필리핀 동쪽 및 오키나와 남쪽(沖縄の南) 해상을 지나며 매우 강한 세력을 유지할 것으로 예상됩니다.

설명: 태풍은 강한 바람과 폭우를 동반하여 심각한 피해를 줄 수 있는 기상 현상입니다.

요약:

- 2026년 10월 18일 오후 9시 기준 마리아나 제도(マリアナ諸島) 부근에서 태풍 챔피(CHAMPI) 발생
- 10월 23일까지 필리핀 동쪽 및 오키나와 남쪽(沖縄の南) 해상을 향해 서북서진할 것으로 전망
- 매우 강한 세력을 유지하며 이동 중이므로 향후 기상 정보에 유의하십시오

별도 행동 지침 번역: None

용어: [{"term": "태풍(TY)", "meaning": "중심 부근의 최대 풍속이 약 17m/s(34노트) 이상인 열대 저기압입니다."}, {"term": "매우 강한(Very Strong)", "meaning": "태풍의 중심 부근 최대 풍속이 44m/s(85노트) 이상 54m/s(105노트) 미만인 상태를 의미합니다."}, {"term": "hPa(헥토파스칼)", "meaning": "기압을 나타내는 단위로, 수치가 낮을수록 태풍의 세력이 강함을 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.308초 · HTTP 200

전체 번역:

일본 기상청 본청 발표. 2026년 10월 18일 21시 00분(일본 표준시) 기준 태풍 제30호 チャンパー(CHAMPI)에 관한 5일 태풍 분석 및 예보 정보(발표 당시 지속 상태)입니다. 위치: 마리아나諸島(마리아나 제도), 계급: 태풍(TY), 강도: 非常に強い(매우 강함), 중심 기압: 960 hPa.

설명: 태풍의 위치, 이동 경로, 강도 및 중심 기압 변화를 제공하는 5일 태풍 예보 정보입니다.

요약:

- 2026년 10월 18일 21시 00분(일본 표준시) 마리아나諸島(마리아나 제도)에서 태풍 제30호 チャンパー(CHAMPI)가 발표 당시 지속 상태였습니다.
- 태풍 강도는 非常に強い(매우 강함)이며 중심 기압은 960 hPa입니다.
- 기상청에서 제공하는 5일 태풍 경로 및 예보 정보를 확인하십시오.

별도 행동 지침 번역: None

용어: [{"term": "태풍(TY)", "meaning": "최대 풍속이 일정 기준 이상인 열대 저기압을 의미합니다."}, {"term": "매우 강함", "meaning": "일본 기상청 기준 태풍 강도 분류 중 하나로, 최대 풍속이 매우 강력한 상태를 뜻합니다."}]

## JP-14 — 噴火に関する火山観測報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261017084639_0_VFVO52_400000.xml

### 입력 원문

Title: 噴火に関する火山観測報
DateTime: 2026-10-17T08:46:39Z
Status: 通常
EditorialOffice: 福岡管区気象台
PublishingOffice: 福岡管区気象台　鹿児島地方気象台
Title: 火山名　桜島　噴火に関する火山観測報
ReportDateTime: 2026-10-17T17:46:00+09:00
TargetDateTime: 2026-10-17T17:36:00+09:00
EventID: 20261017174600_506
InfoType: 発表
Serial: 1
InfoKind: 噴火に関する火山観測報
InfoKindVersion: 1.0_0
Text: 火　　山：桜島
日　　時：2026年10月17日17時36分(170836UTC)
現　　象：噴火
Name: 噴火
Name: 桜島
EventDateTime: 2026-10-17T17:36:00+09:00
EventDateTimeUTC: 2026-10-17T08:36:00Z
Name: 噴火
Name: 桜島
CraterName: 南岳山頂火口
CraterCoordinate: +3134.63+13039.53+1060/
PlumeHeightAboveCrater: 1000
PlumeHeightAboveSeaLevel: 6800
PlumeDirection: 南西
OtherObservation: 火口：南岳山頂火口
噴煙量：中量

### gemini-3.1-flash-lite

응답 2.122초 · HTTP 200

전체 번역:

제목: 분화 관련 화산 관측보. 발행 시각: 2026년 10월 17일 17시 46분(JST). 화산명: 사쿠라지마(桜島). 일시: 2026년 10월 17일 17시 36분. 현상: 분화. 화구: 미나미다케 산정 화구(南岳山頂火口). 분연 높이: 화구 위 1,000m(해발 6,800m). 분연 방향: 남서쪽. 기타 관측: 분연량은 중량입니다.

설명: 화산 분화로 인해 화산재와 분연이 발생하고 있으니 주의하십시오.

요약:

- 일시: 2026년 10월 17일 17시 36분
- 장소: 사쿠라지마(桜島) 미나미다케 산정 화구
- 내용: 분화 발생 및 분연 관측

별도 행동 지침 번역: None

용어: [{"term": "분연(噴煙)", "meaning": "화산 분화 시 화구에서 뿜어져 나오는 화산재, 가스, 수증기 등의 혼합물입니다."}, {"term": "미나미다케 산정 화구(南岳山頂火口)", "meaning": "사쿠라지마 화산의 주요 분화 활동이 일어나는 화구 중 하나입니다."}]

### gemini-3.5-flash-lite

응답 2.553초 · HTTP 200

전체 번역:

제목: 분화에 관한 화산관측보
일시: 2026년 10월 17일 오전 8시 46분 39초 (UTC+00:00)
상태: 통상
편집관서: 후쿠오카 관구 기상대
발행관서: 후쿠오카 관구 기상대 가고시마 지방 기상대
제목: 화산명 사쿠라지마(桜島) 분화에 관한 화산관측보
보고일시: 2026년 10월 17일 17시 46분 +09:00
대상일시: 2026년 10월 17일 17시 36분 +09:00
이벤트ID: 20261017174600_506
정보유형: 발표
일련번호: 1
정보종류: 분화에 관한 화산관측보
정보종류버전: 1.0_0
본문:
화산: 사쿠라지마(桜島)
일시: 2026년 10월 17일 17시 36분 (170836UTC)
현상: 분화
이벤트일시: 2026년 10월 17일 17시 36분 +09:00
이벤트일시UTC: 2026년 10월 17일 오전 8시 36분 (UTC+00:00)
화구명: 미나미다케 산꼭대기 화구(南岳山頂火口)
화구좌표: +3134.63+13039.53+1060/
화구 위 연기 높이: 1000m
해발 기준 연기 높이: 6800m
연기 방향: 남서
기타 관측: 화구: 미나미다케 산꼭대기 화구(南岳山頂火口), 분연량: 중량

설명: 사쿠라지마(桜島) 미나미다케 산꼭대기 화구(南岳山頂火口)에서 분화가 발생하여 화산재와 연기가 높이 치솟았습니다.

요약:

- 2026년 10월 17일 오후 5시 36분 사쿠라지마(桜島) 미나미다케 산꼭대기 화구(南岳山頂火口)에서 분화 발생
- 발표 당시 지속 상태: 해발 6800m까지 치솟는 연기와 남서쪽으로 향하는 분연 관측
- 관련 정보 확인 및 화산 주변 안전 유의

별도 행동 지침 번역: None

용어: [{"term": "미나미다케 산꼭대기 화구(南岳山頂火口)", "meaning": "사쿠라지마 화산의 주요 분화 활동이 일어나는 산꼭대기 화구입니다."}, {"term": "분연량", "meaning": "화산 분화 시 뿜어져 나오는 연기(화산회와 가스)의 양을 나타냅니다."}]

## JP-15 — 気象特別警報・警報・注意報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018155013_0_VPWW53_450000.xml

### 입력 원문

Title: 気象特別警報・警報・注意報
DateTime: 2026-10-18T15:50:12Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県気象警報・注意報
ReportDateTime: 2026-10-19T00:50:00+09:00
TargetDateTime: 2026-10-19T00:50:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.1_2
Text: 北部平野部では、土砂災害や低い土地の浸水に注意してください。宮崎県では、高波に注意してください。
Name: 大雨注意報
Name: 波浪注意報
Name: 宮崎県
Name: 波浪注意報
Name: 南部平野部
Name: 大雨注意報
Name: 波浪注意報
Name: 北部平野部
Name: 波浪注意報
Name: 宮崎地区
Name: 波浪注意報
Name: 日南・串間地区
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡・日向地区
Name: 大雨注意報
Name: 波浪注意報
Name: 西都・高鍋地区
Name: 波浪注意報
Name: 宮崎市
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡市
Name: 波浪注意報
Name: 日南市
Name: 大雨注意報
Name: 波浪注意報
Name: 日向市
Name: 波浪注意報
Name: 串間市
Name: 波浪注意報
Name: 高鍋町
Name: 波浪注意報
Name: 新富町
Name: 波浪注意報
Name: 川南町
Name: 大雨注意報
Name: 波浪注意報
Name: 都農町
Name: 波浪注意報
Name: 門川町
Name: 大雨注意報
Name: 北部平野部
Name: 波浪注意報
Name: 南部平野部
Name: 北部平野部
Notice: ［危険警報・氾濫特別警報の発表状況］
なし
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 宮崎県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 南部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 北部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 宮崎地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 日南・串間地区
ChangeStatus: 変化無
FullStatus: 全域
EditingMark: 0
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 延岡・日向地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 西都・高鍋地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 宮崎市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 都城市
Name: 大雨注意報
Status: 継続
Note: 浸水注意
Type: 浸水
Date: １９日
Term: 明け方
Precipitation: 20
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 延岡市
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 日南市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 小林市
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Type: 土砂災害
Date: １９日
Term: 未明
Type: 浸水
Date: １９日
Term: 未明
Precipitation: 20
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 日向市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 串間市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 高鍋町
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 新富町
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 川南町
ChangeStatus: 変化無
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Type: 土砂災害
Date: １９日
Term: 未明
Type: 浸水
Date: １９日
Term: 未明
Precipitation: 20
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 都農町
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 門川町
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町

### gemini-3.1-flash-lite

응답 2.531초 · HTTP 200

전체 번역:

미야자키현 기상 경보 및 주의보 발표 (2026년 10월 19일 오전 12시 50분 발표). 북부 평야 지역에서는 토사 재해 및 저지대 침수에 유의하십시오. 미야자키현 전역에서는 높은 파도에 유의하십시오. 현재 대우 주의보와 파랑 주의보가 발표 당시 지속 상태입니다.

설명: 토사 재해, 저지대 침수, 높은 파도로 인한 피해가 발생할 수 있으니 주의하십시오.

요약:

- 발표 시각: 2026년 10월 19일 오전 12시 50분
- 대상 지역: 미야자키현 북부 평야 및 남부 평야 등
- 주의 사항: 토사 재해, 저지대 침수, 높은 파도에 유의하십시오.

별도 행동 지침 번역: 북부 평야 지역에서는 토사 재해 및 저지대 침수에 유의하십시오. 미야자키현에서는 높은 파도에 유의하십시오.

용어: [{"term": "대우 주의보", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}, {"term": "파랑 주의보", "meaning": "강한 바람이나 태풍 등으로 인해 높은 파도가 예상될 때 발표하는 주의보입니다."}, {"term": "토사 재해", "meaning": "집중 호우 등으로 인해 산사태나 흙더미가 무너져 내리는 재해를 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.023초 · HTTP 200

전체 번역:

발행 일시: 2026년 10월 19일 오전 0시 50분 JST. 발표관서: 미야자키 지방기상대(宮崎地方気象台). 대상 지역: 미야자키현(宮崎県). 북부 평야부에서는 토사 재해 및 낮은 지대의 침수에 주의하시기 바랍니다. 미야자키현에서는 높은 파도에 주의하시기 바랍니다. 현재 대우 주의보 및 파로 주의보가 발표 당시 지속 상태입니다.

설명: 대우 주의보와 파로 주의보는 기상 악화로 인해 재해가 발생할 우려가 있을 때 발표되는 주의 단계의 기상 특보입니다.

요약:

- 2026년 10월 19일 오전 0시 50분 JST 미야자키현(宮崎県) 기상 정보
- 북부 평야부 토사 재해 및 침수 주의, 미야자키현 전역 높은 파도 주의
- 대우 주의보 및 파로 주의보 발표 당시 지속 상태

별도 행동 지침 번역: None

용어: [{"term": "大雨注意報", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발령하는 주의보입니다."}, {"term": "波浪注意報", "meaning": "강풍이나 파도 등으로 인해 해상 재해가 발생할 우려가 있을 때 발령하는 주의보입니다."}]

## JP-16 — 気象警報・注意報（Ｈ２７）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018155013_0_VPWW54_450000.xml

### 입력 원문

Title: 気象警報・注意報（Ｈ２７）
DateTime: 2026-10-18T15:50:12Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県気象警報・注意報
ReportDateTime: 2026-10-19T00:50:00+09:00
TargetDateTime: 2026-10-19T00:50:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.2_2
Text: 北部平野部では、土砂災害や低い土地の浸水に注意してください。宮崎県では、高波に注意してください。
Name: 大雨注意報
Name: 波浪注意報
Name: 宮崎県
Name: 波浪注意報
Name: 南部平野部
Name: 大雨注意報
Name: 波浪注意報
Name: 北部平野部
Name: 波浪注意報
Name: 宮崎地区
Name: 波浪注意報
Name: 日南・串間地区
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡・日向地区
Name: 大雨注意報
Name: 波浪注意報
Name: 西都・高鍋地区
Name: 波浪注意報
Name: 宮崎市
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡市
Name: 波浪注意報
Name: 日南市
Name: 大雨注意報
Name: 波浪注意報
Name: 日向市
Name: 波浪注意報
Name: 串間市
Name: 波浪注意報
Name: 高鍋町
Name: 波浪注意報
Name: 新富町
Name: 波浪注意報
Name: 川南町
Name: 大雨注意報
Name: 波浪注意報
Name: 都農町
Name: 波浪注意報
Name: 門川町
Name: 大雨注意報
Name: 北部平野部
Name: 波浪注意報
Name: 南部平野部
Name: 北部平野部
Notice: ［危険警報・氾濫特別警報の発表状況］
なし
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 宮崎県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 南部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 北部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 宮崎地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 日南・串間地区
ChangeStatus: 変化無
FullStatus: 全域
EditingMark: 0
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 延岡・日向地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 西都・高鍋地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 宮崎市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 都城市
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 延岡市
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 日南市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 小林市
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 日向市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 串間市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 高鍋町
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 新富町
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 川南町
ChangeStatus: 変化無
Name: 大雨注意報
Status: 継続
Name: 大雨注意報
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 都農町
ChangeStatus: 変化無
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 門川町
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町
DateTime: 2026-10-19T00:00:00+09:00
Duration: PT3H
Name: １９日未明
DateTime: 2026-10-19T03:00:00+09:00
Duration: PT3H
Name: １９日明け方
DateTime: 2026-10-19T06:00:00+09:00
Duration: PT3H
Name: １９日朝
DateTime: 2026-10-19T09:00:00+09:00
Duration: PT3H
Name: １９日昼前
DateTime: 2026-10-19T12:00:00+09:00
Duration: PT3H
Name: １９日昼過ぎ
DateTime: 2026-10-19T15:00:00+09:00
Duration: PT3H
Name: １９日夕方
DateTime: 2026-10-19T18:00:00+09:00
Duration: PT3H
Name: １９日夜のはじめ頃
DateTime: 2026-10-19T21:00:00+09:00
Duration: PT3H
Name: １９日夜遅く
DateTime: 2026-10-20T00:00:00+09:00
Duration: PT3H
Name: ２０日未明
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 宮崎市
Name: 大雨注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: 浸水注意
Type: 雨
Precipitation: 20
Precipitation: 20
Precipitation: 40
Precipitation: 40
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 延岡市
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 日南市
Name: 大雨注意報
Type: 危険度
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: 土砂災害注意
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: 浸水注意
Type: 雨
Precipitation: 20
Precipitation: 40
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 日向市
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 串間市
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 高鍋町
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 新富町
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 川南町
Name: 大雨注意報
Type: 危険度
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: 土砂災害注意
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: 浸水注意
Type: 雨
Precipitation: 20
Precipitation: 40
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 都農町
Name: 波浪注意報
Type: 危険度
Name: 注意報級
Name: 注意報級
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Name: 注意報級未満
Note: うねり
Type: 波
WaveHeight: 2.5
WaveHeight: 2.5
Name: 門川町

### gemini-3.1-flash-lite

응답 2.331초 · HTTP 200

전체 번역:

미야자키현(宮崎県) 기상 경보 및 주의보. 북부 평야부에서는 토사 재해 및 저지대 침수에 주의하십시오. 미야자키현(宮崎県)에서는 높은 파도에 주의하십시오.

설명: 토사 재해와 저지대 침수, 그리고 높은 파도로 인한 피해가 우려되는 상황입니다.

요약:

- 2026년 10월 19일 오전 0시 50분 기준 미야자키현(宮崎県) 전역에 대우 및 파랑 주의보가 발표 당시 지속 상태입니다.
- 북부 평야부 및 각 지역에서 토사 재해, 침수, 높은 파도에 주의하십시오.
- 해안가 접근을 자제하고 기상 정보를 수시로 확인하십시오.

별도 행동 지침 번역: None

용어: [{"term": "토사 재해", "meaning": "비로 인해 지반이 약해져 산사태나 붕괴가 발생하는 재해입니다."}, {"term": "저지대 침수", "meaning": "주변보다 지대가 낮은 곳에 빗물이 고여 발생하는 침수 현상입니다."}, {"term": "너울(うねり)", "meaning": "바람이 아닌 먼바다에서 발생한 파도가 해안으로 밀려오는 현상으로, 갑자기 높은 파도가 칠 수 있습니다."}]

### gemini-3.5-flash-lite

응답 1.924초 · HTTP 200

전체 번역:

미야자키 지방기상대(宮崎地方気象台) 발표 2026년 10월 19일 오전 0시 50분 기상경보·주의보: 북부 평지(北部平野部)에서는 토사 재해나 낮은 지대의 침수에 주의하십시오. 미야자키현(宮崎県)에서는 높은 파도에 주의하십시오.

설명: 대우 및 파도로 인한 재해 위험을 알리는 기상 주의보가 발표 중인 상태입니다.

요약:

- 발표 시각: 2026년 10월 19일 오전 0시 50분
- 대상 지역: 미야자키현(宮崎県) 북부 평지(北部平野部) 및 관련 지역
- 조치 사항: 토사 재해, 침수, 높은 파도에 주의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "大雨注意報", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}, {"term": "波浪注意報", "meaning": "해상에서 높은 파도나 너울로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}]

## JP-17 — 気象警報・注意報（Ｒ０６）（その他注意報）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018124421_0_VPWW61_070000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（その他注意報）
DateTime: 2026-10-18T12:44:20Z
Status: 通常
EditorialOffice: 福島地方気象台
PublishingOffice: 福島地方気象台
Title: 福島県乾燥注意報
ReportDateTime: 2026-10-18T21:44:00+09:00
TargetDateTime: 2026-10-18T21:44:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 注意報を解除します。
Name: 解除
Name: 福島県
Name: 解除
Name: 中通り
Name: 解除
Name: 中通り北部
Name: 解除
Name: 中通り中部
Name: 解除
Name: 福島市
Name: 解除
Name: 郡山市
Name: 解除
Name: 須賀川市
Name: 解除
Name: 二本松市
Name: 解除
Name: 田村市
Name: 解除
Name: 伊達市
Name: 解除
Name: 本宮市
Name: 解除
Name: 桑折町
Name: 解除
Name: 国見町
Name: 解除
Name: 川俣町
Name: 解除
Name: 大玉村
Name: 解除
Name: 鏡石町
Name: 解除
Name: 天栄村
Name: 解除
Name: 三春町
Name: 解除
Name: 小野町
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 福島県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 中通り
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 浜通り
Status: 発表警報・注意報はなし
Name: 会津
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 中通り北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 1
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 中通り中部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 中通り南部
Status: 発表警報・注意報はなし
Name: 浜通り北部
Status: 発表警報・注意報はなし
Name: 浜通り中部
Status: 発表警報・注意報はなし
Name: 浜通り南部
Status: 発表警報・注意報はなし
Name: 会津北部
Status: 発表警報・注意報はなし
Name: 会津中部
Status: 発表警報・注意報はなし
Name: 会津南部
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 福島市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 会津若松市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 郡山市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 郡山市湖南
Status: 発表警報・注意報はなし
Name: いわき市
Status: 発表警報・注意報はなし
Name: 白河市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 須賀川市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 喜多方市
Status: 発表警報・注意報はなし
Name: 相馬市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 二本松市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 田村市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 南相馬市
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 伊達市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 本宮市
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 桑折町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 国見町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 川俣町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 大玉村
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 鏡石町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 天栄村
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 天栄村湯本
Status: 発表警報・注意報はなし
Name: 下郷町
Status: 発表警報・注意報はなし
Name: 檜枝岐村
Status: 発表警報・注意報はなし
Name: 只見町
Status: 発表警報・注意報はなし
Name: 南会津町
Status: 発表警報・注意報はなし
Name: 北塩原村
Status: 発表警報・注意報はなし
Name: 西会津町
Status: 発表警報・注意報はなし
Name: 磐梯町
Status: 発表警報・注意報はなし
Name: 猪苗代町
Status: 発表警報・注意報はなし
Name: 会津坂下町
Status: 発表警報・注意報はなし
Name: 湯川村
Status: 発表警報・注意報はなし
Name: 柳津町
Status: 発表警報・注意報はなし
Name: 三島町
Status: 発表警報・注意報はなし
Name: 金山町
Status: 発表警報・注意報はなし
Name: 昭和村
Status: 発表警報・注意報はなし
Name: 会津美里町
Status: 発表警報・注意報はなし
Name: 西郷村
Status: 発表警報・注意報はなし
Name: 泉崎村
Status: 発表警報・注意報はなし
Name: 中島村
Status: 発表警報・注意報はなし
Name: 矢吹町
Status: 発表警報・注意報はなし
Name: 棚倉町
Status: 発表警報・注意報はなし
Name: 矢祭町
Status: 発表警報・注意報はなし
Name: 塙町
Status: 発表警報・注意報はなし
Name: 鮫川村
Status: 発表警報・注意報はなし
Name: 石川町
Status: 発表警報・注意報はなし
Name: 玉川村
Status: 発表警報・注意報はなし
Name: 平田村
Status: 発表警報・注意報はなし
Name: 浅川町
Status: 発表警報・注意報はなし
Name: 古殿町
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 三春町
ChangeStatus: 警報・注意報種別に変化有
Name: 乾燥注意報
Status: 解除
Name: 乾燥注意報
Name: 小野町
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 広野町
Status: 発表警報・注意報はなし
Name: 楢葉町
Status: 発表警報・注意報はなし
Name: 富岡町
Status: 発表警報・注意報はなし
Name: 川内村
Status: 発表警報・注意報はなし
Name: 大熊町
Status: 発表警報・注意報はなし
Name: 双葉町
Status: 発表警報・注意報はなし
Name: 浪江町
Status: 発表警報・注意報はなし
Name: 葛尾村
Status: 発表警報・注意報はなし
Name: 新地町
Status: 発表警報・注意報はなし
Name: 飯舘村

### gemini-3.1-flash-lite

응답 1.354초 · HTTP 200

전체 번역:

후쿠시마현(福島県)에 발령되었던 건조주의보가 해제되었습니다.

설명: 건조주의보가 해제되어 화재 위험이 감소하였습니다.

요약:

- 2026년 10월 18일 오후 9시 44분 기준
- 후쿠시마현(福島県) 나카도리(中通り) 지역
- 건조주의보 해제

별도 행동 지침 번역: None

용어: [{"term": "건조주의보", "meaning": "실효습도가 낮아 화재 발생 가능성이 높을 때 발표하는 주의보입니다."}]

### gemini-3.5-flash-lite

응답 1.863초 · HTTP 200

전체 번역:

후쿠시마 지방기상대 기상경보·주의보. 발표 일시: 2026년 10월 18일 오후 9시 44분(JST). 발표된 내용: 후쿠시마현(福島県) 건조주의보 해제. 주의보를 해제합니다.

설명: 공기가 건조해져 화재 발생 위험이 커졌던 기상 상황이 해제되었습니다.

요약:

- 2026년 10월 18일 오후 9시 44분 발표 당시 지속 상태: 후쿠시마현(福島県) 건조주의보 해제
- 대상 지역: 후쿠시마현(福島県) 및 관련 시·정·촌(나카도리(中通り) 등) 발표 당시 지속 상태: 해제

별도 행동 지침 번역: None

용어: [{"term": "건조주의보", "meaning": "대기가 매우 건조하여 화재 발생 위험이 높을 때 발표되는 기상주의보입니다."}, {"term": "해제", "meaning": "기상경보나 주의보의 효력이 종료되어 발효 상태가 아님을 뜻합니다."}]

## JP-18 — 気象警報・注意報（Ｒ０６）（大雨）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018150105_0_VPWW55_450000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（大雨）
DateTime: 2026-10-18T15:01:05Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県大雨警報・注意報
ReportDateTime: 2026-10-19T00:01:00+09:00
TargetDateTime: 2026-10-19T00:01:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 北部平野部では、低い土地の浸水や河川の増水に注意してください。
Name: レベル２大雨注意報
Name: 宮崎県
Name: レベル２大雨注意報
Name: 北部平野部
Name: レベル２大雨注意報
Name: 延岡・日向地区
Name: レベル２大雨注意報
Name: 西都・高鍋地区
Name: レベル２大雨注意報
Name: 延岡市
Name: レベル２大雨注意報
Name: 都農町
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 宮崎県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 南部平野部
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 北部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Status: 発表警報・注意報はなし
Name: 宮崎地区
Status: 発表警報・注意報はなし
Name: 日南・串間地区
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Name: 延岡・日向地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: レベル２大雨注意報
Status: 発表
Name: 西都・高鍋地区
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Status: 発表警報・注意報はなし
Name: 宮崎市
Status: 発表警報・注意報はなし
Name: 都城市
Name: レベル２大雨注意報
Status: 継続
Name: レベル２大雨注意報
Type: 大雨浸水危険度
Name: 警戒レベル２
Name: 延岡市
ChangeStatus: 変化無
Status: 発表警報・注意報はなし
Name: 日南市
Status: 発表警報・注意報はなし
Name: 小林市
Status: 発表警報・注意報はなし
Name: 日向市
Status: 発表警報・注意報はなし
Name: 串間市
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Status: 発表警報・注意報はなし
Name: 高鍋町
Status: 発表警報・注意報はなし
Name: 新富町
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Status: 発表警報・注意報はなし
Name: 川南町
Name: レベル２大雨注意報
Status: 発表
Type: 大雨浸水危険度
Name: 警戒レベル２
Name: 都農町
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 門川町
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町

### gemini-3.1-flash-lite

응답 2.074초 · HTTP 200

전체 번역:

기상 경보 및 주의보 (R06) (호우) 발표 일시: 2026년 10월 19일 오전 12시 01분 (JST). 미야자키 지방 기상대 발표. 북부 평야 지역에서는 낮은 지대의 침수와 하천 수위 상승에 주의하십시오. 현재 미야자키현의 북부 평야 지역(노베오카·휴가 지구, 사이토·타카나베 지구, 노베오카시, 츠노초)에 레벨 2 호우 주의보가 지속되고 있습니다.

설명: 호우로 인해 낮은 지대의 침수와 하천 수위 상승이 우려되는 상황입니다.

요약:

- 2026년 10월 19일 오전 12시 01분 기준 미야자키현 북부 평야 지역에 레벨 2 호우 주의보가 발표 당시 지속 상태입니다.
- 대상 지역: 노베오카·휴가 지구, 사이토·타카나베 지구, 노베오카시, 츠노초.
- 낮은 지대 침수 및 하천 수위 상승에 주의하십시오.

별도 행동 지침 번역: 북부 평야 지역에서는 낮은 지대의 침수와 하천 수위 상승에 주의하십시오.

용어: [{"term": "레벨 2 호우 주의보", "meaning": "기상청이 발표하는 경계 수준으로, 호우로 인한 재해 발생 가능성이 있어 주의가 필요한 상태를 의미합니다."}, {"term": "침수", "meaning": "비가 많이 내려 낮은 지대나 건물이 물에 잠기는 현상을 말합니다."}]

### gemini-3.5-flash-lite

응답 4.749초 · HTTP 200

전체 번역:

제목: 기상경보·주의보(R06)(호우). 일시: 2026년 10월 18일 15시 01분 05초 UTC. 상태: 통상. 편집관서: 미야자키 지방기상대. 발표관서: 미야자키 지방기상대. 제목: 미야자키현 호우 경보·주의보. 보고일시: 2026년 10월 19일 00시 01분 +09:00. 대상일시: 2026년 10월 19일 00시 01분 +09:00. 정보유형: 발표. 정보종류: 기상경보·주의보. 정보종류버전: 1.5_0. 텍스트: 북부 평지(北部平野部)에서는 낮은 토지의 침수와 하천의 수위 상승에 주의하십시오. 이름: 레벨2 호우주의보. 이름: 미야자키현(宮崎県). 이름: 레벨2 호우주의보. 이름: 북부 평지(北部平野部). 이름: 레벨2 호우주의보. 이름: 노베오카·휴가 지구(延岡・日向地区). 이름: 레벨2 호우주의보. 이름: 사이토·다카나베 지구(西都・高鍋地区). 이름: 레벨2 호우주의보. 이름: 노베오카시(延岡市). 이름: 레벨2 호우주의보. 이름: 쓰노町(都農町). 이름: 레벨2 호우주의보. 상태: 발표 당시 지속 상태. 이름: 레벨2 호우주의보. 이름: 미야자키현(宮崎県). 변경상태: 변화 없음. 전체상태: 일부. 편집마크: 0. 상태: 발표된 경보·주의보 없음. 이름: 남부 평지(南部平野部). 이름: 레벨2 호우주의보. 상태: 발표 당시 지속 상태. 이름: 레벨2 호우주의보. 이름: 북부 평지(北部平野部). 변경상태: 변화 없음. 전체상태: 일부. 편집마크: 1. 상태: 발표된 경보·주의보 없음. 이름: 남부 산간지(南部山沿い). 상태: 발표된 경보·주의보 없음. 이름: 북부 산간지(北部山沿い). 상태: 발표된 경보·주의보 없음. 이름: 미야자키 지구(宮崎地区). 상태: 발표된 경보·주의보 없음. 이름: 니치난·구시마 지구(日南・串間地区). 이름: 레벨2 호우주의보. 상태: 발표 당시 지속 상태. 이름: 레벨2 호우주의보. 이름: 노베오카·휴가 지구(延岡・日向地区). 변경상태: 변화 없음. 전체상태: 일부. 편집마크: 0. 이름: 레벨2 호우주의보. 상태: 발표. 이름: 사이토·다카나베 지구(西都・高鍋地区). 변경상태: 경보·주의보 종류에 변화 있음. 전체상태: 일부. 편집마크: 0. 상태: 발표된 경보·주의보 없음. 이름: 고바야시·에비노 지구(小林・えびの地区). 상태: 발표된 경보·주의보 없음. 이름: 미야코노조 지구(都城地区). 상태: 발표된 경보·주의보 없음. 이름: 다카치호 지구(高千穂地区). 상태: 발표된 경보·주의보 없음. 이름: 시바·미사토 지구(椎葉・美郷地区). 상태: 발표된 경보·주의보 없음. 이름: 미야자키시(宮崎市). 상태: 발표된 경보·주의보 없음. 이름: 미야코노조시(都城市). 이름: 레벨2 호우주의보. 상태: 발표 당시 지속 상태. 이름: 레벨2 호우주의보. 유형: 호우침수위험도. 이름: 경계 레벨2. 이름: 노베오카시(延岡市). 변경상태: 변화 없음. 상태: 발표된 경보·주의보 없음. 이름: 니치난시(日南市). 상태: 발표된 경보·주의보 없음. 이름: 고바야시시(小林市). 상태: 발표된 경보·주의보 없음. 이름: 휴가시(日向市). 상태: 발표된 경보·주의보 없음. 이름: 구시마시(串間市). 상태: 발표된 경보·주의보 없음. 이름: 사이토시(西都市). 상태: 발표된 경보·주의보 없음. 이름: 에비노시(えびの市). 상태: 발표된 경보·주의보 없음. 이름: 미미타촌(三股町). 상태: 발표된 경보·주의보 없음. 이름: 다카하루정(高原町). 상태: 발표된 경보·주의보 없음. 이름: 구니토미정(国富町). 상태: 발표된 경보·주의보 없음. 이름: 아야정(綾町). 상태: 발표된 경보·주의보 없음. 이름: 다카나베정(高鍋町). 상태: 발표된 경보·주의보 없음. 이름: 신토미정(新富町). 상태: 발표된 경보·주의보 없음. 이름: 니시메라촌(西米良村). 상태: 발표된 경보·주의보 없음. 이름: 기조정(木城町). 상태: 발표된 경보·주의보 없음. 이름: 가와미나미정(川南町). 이름: 레벨2 호우주의보. 상태: 발표. 유형: 호우침수위험도. 이름: 경계 레벨2. 이름: 쓰노정(都農町). 변경상태: 경보·주의보 종류에 변화 있음. 상태: 발표된 경보·주의보 없음. 이름: 가도카와정(門川町). 상태: 발표된 경보·주의보 없음. 이름: 모로쓰카촌(諸塚村). 상태: 발표된 경보·주의보 없음. 이름: 시바촌(椎葉村). 상태: 발표된 경보·주의보 없음. 이름: 미사토정(美郷町). 상태: 발표된 경보·주의보 없음. 이름: 다카치호정(高千穂町). 상태: 발표된 경보·주의보 없음. 이름: 히노카게정(日之影町). 상태: 발표된 경보·주의보 없음. 이름: 고카세정(五ヶ瀬町).

설명: 집중호우로 인해 저지대 침수 및 하천 범람 위험이 있으므로 주의하십시오.

요약:

- 2026년 10월 19일 오전 0시 01분 기준 미야자키현(宮崎県)에 호우주의보가 발표되었습니다.
- 북부 평지(北部平野部) 등 일부 지역에서 호우 관련 주의보 상태가 지속되거나 변경되었습니다.
- 저지대 침수와 하천 수위 상승에 주의하십시오.

별도 행동 지침 번역: 북부 평지에서는 낮은 토지의 침수나 하천의 증수에 주의하십시오.

용어: [{"term": "大雨警報 (호우경보)", "meaning": "많은 비로 인해 중대한 재해 발생 우려가 있을 때 발표합니다."}, {"term": "大雨注意報 (호우주의보)", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발표합니다."}]

## JP-19 — 気象警報・注意報（Ｒ０６）（暴風）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018124548_0_VPWW58_440000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（暴風）
DateTime: 2026-10-18T12:45:48Z
Status: 通常
EditorialOffice: 大分地方気象台
PublishingOffice: 大分地方気象台
Title: 大分県暴風（雪）警報・注意報
ReportDateTime: 2026-10-18T21:45:00+09:00
TargetDateTime: 2026-10-18T21:45:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 注意報を解除します。
Name: 解除
Name: 大分県
Name: 解除
Name: 北部
Name: 解除
Name: 北部
Name: 解除
Name: 中津市
Name: 解除
Name: 豊後高田市
Name: 解除
Name: 宇佐市
Name: 解除
Name: 国東市
Name: 解除
Name: 姫島村
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 大分県
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 中部
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 西部
Status: 発表警報・注意報はなし
Name: 南部
Status: 発表警報・注意報はなし
Name: 中部
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 日田玖珠
Status: 発表警報・注意報はなし
Name: 竹田市
Status: 発表警報・注意報はなし
Name: 佐伯市
Status: 発表警報・注意報はなし
Name: 豊後大野市
Status: 発表警報・注意報はなし
Name: 大分市
Status: 発表警報・注意報はなし
Name: 別府市
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 中津市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 日田市
Status: 発表警報・注意報はなし
Name: 佐伯市
Status: 発表警報・注意報はなし
Name: 臼杵市
Status: 発表警報・注意報はなし
Name: 津久見市
Status: 発表警報・注意報はなし
Name: 竹田市
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 豊後高田市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 杵築市
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 宇佐市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 豊後大野市
Status: 発表警報・注意報はなし
Name: 由布市
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 国東市
ChangeStatus: 警報・注意報種別に変化有
Name: 強風注意報
Status: 解除
Name: 強風注意報
Name: 姫島村
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 日出町
Status: 発表警報・注意報はなし
Name: 九重町
Status: 発表警報・注意報はなし
Name: 玖珠町

### gemini-3.1-flash-lite

응답 4.143초 · HTTP 200

전체 번역:

기상 경보 및 주의보 (R06) (폭풍) 발행 시간: 2026년 10월 18일 오후 9시 45분 (JST) 오이타 지방 기상대 발표. 주의보를 해제합니다. 오이타현(大分県) 전역에 발효 중이던 강풍 주의보가 모두 해제되었습니다. 현재 발표된 경보 및 주의보는 없습니다.

설명: 강풍 주의보가 해제되어 해당 지역의 강한 바람에 의한 위험이 감소하였습니다.

요약:

- 2026년 10월 18일 오후 9시 45분 기준
- 오이타현(大分県) 전역
- 강풍 주의보가 모두 해제되었습니다.

별도 행동 지침 번역: None

용어: [{"term": "강풍 주의보", "meaning": "강한 바람으로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}, {"term": "기상대", "meaning": "특정 지역의 기상 관측 및 예보를 담당하는 일본 기상청 산하 기관입니다."}]

### gemini-3.5-flash-lite

응답 1.886초 · HTTP 200

전체 번역:

제목: 기상경보 및 주의보(R06)(폭풍). 보고 일시: 2026년 10월 18일 오후 9시 45분 +09:00. 발행 기관: 오이타 지방기상대. 본문: 주의보를 해제합니다. 대상 지역(오이타현(大分県)) 내 북부(北部), 나카쓰시(中津市), 분고타카다시(豊後高田市), 우사시(宇佐市), 구니사키시(国東市), 히메시마촌(姫島村), 중부(中部), 벳푸시(別府市), 기쓰키시(杵築市), 유후시(由布市) 등의 강풍주의보가 해제되었습니다. 현재 발표된 경보 및 주의보는 없습니다.

설명: 강풍주의보가 해제되어 해당 지역의 기상 위험 경계 상황이 종료되었습니다.

요약:

- 2026년 10월 18일 오후 9시 45분 +09:00 오이타현(大分県) 발표
- 오이타현(大分県) 내 강풍주의보 해제
- 발표 당시 지속 상태: 현재 발표된 경보 및 주의보 없음

별도 행동 지침 번역: None

용어: [{"term": "강풍주의보", "meaning": "강한 바람으로 인한 재해 발생이 예상될 때 발표되는 주의보입니다."}]

## JP-20 — 気象警報・注意報（Ｒ０６）（波浪）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018124548_0_VPWW59_440000.xml

### 입력 원문

Title: 気象警報・注意報（Ｒ０６）（波浪）
DateTime: 2026-10-18T12:45:48Z
Status: 通常
EditorialOffice: 大分地方気象台
PublishingOffice: 大分地方気象台
Title: 大分県波浪警報・注意報
ReportDateTime: 2026-10-18T21:45:00+09:00
TargetDateTime: 2026-10-18T21:45:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.5_0
Text: 南部では、高波に注意してください。
Name: 波浪注意報
Name: 大分県
Name: 解除
Name: 中部
Name: 解除
Name: 北部
Name: 波浪注意報
Name: 南部
Name: 解除
Name: 中部
Name: 解除
Name: 北部
Name: 波浪注意報
Name: 佐伯市
Name: 解除
Name: 大分市
Name: 解除
Name: 別府市
Name: 解除
Name: 中津市
Name: 波浪注意報
Name: 佐伯市
Name: 解除
Name: 臼杵市
Name: 解除
Name: 津久見市
Name: 解除
Name: 豊後高田市
Name: 解除
Name: 杵築市
Name: 解除
Name: 宇佐市
Name: 解除
Name: 国東市
Name: 解除
Name: 姫島村
Name: 解除
Name: 日出町
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 大分県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 中部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 西部
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 南部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 中部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 北部
ChangeStatus: 警報・注意報種別に変化有
FullStatus: 全域
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 日田玖珠
Status: 発表警報・注意報はなし
Name: 竹田市
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Name: 佐伯市
ChangeStatus: 変化無
FullStatus: 全域
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 豊後大野市
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 大分市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 別府市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 中津市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 日田市
Name: 波浪注意報
Status: 継続
Name: 波浪注意報
Note: うねり
Type: 波危険度
Name: 注意報級
Note: うねり
Type: 波
WaveHeight: 2.5
Name: 佐伯市
ChangeStatus: 変化無
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 臼杵市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 津久見市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 竹田市
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 豊後高田市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 杵築市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 宇佐市
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 豊後大野市
Status: 発表警報・注意報はなし
Name: 由布市
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 国東市
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 姫島村
ChangeStatus: 警報・注意報種別に変化有
Name: 波浪注意報
Status: 解除
Name: 波浪注意報
Name: 日出町
ChangeStatus: 警報・注意報種別に変化有
Status: 発表警報・注意報はなし
Name: 九重町
Status: 発表警報・注意報はなし
Name: 玖珠町

### gemini-3.1-flash-lite

응답 2.362초 · HTTP 200

전체 번역:

기상 경보 및 주의보 (R06) (파랑) 발표 시간: 2026년 10월 18일 오후 9시 45분 (JST) 오이타 지방 기상대 발표. 남부 지역에서는 높은 파도에 주의하십시오. 오이타현 내 중부, 북부, 서부, 히타·쿠스 지역 및 기타 다수의 시·정·촌에 발효되었던 파랑 주의보는 해제되었습니다. 남부의 사에키시(佐伯市) 지역은 파랑 주의보가 계속 유지되며, 너울성 파도에 유의하시기 바랍니다.

설명: 너울성 파도로 인해 해안가에서 높은 파도가 발생할 수 있으니 안전에 유의하십시오.

요약:

- 2026년 10월 18일 오후 9시 45분 기준 오이타현 남부 사에키시(佐伯市) 파랑 주의보 지속
- 오이타현 중부, 북부, 서부 및 기타 지역의 파랑 주의보 해제
- 해안가 접근을 자제하고 너울성 파도에 주의하십시오

별도 행동 지침 번역: 남부 지역에서는 높은 파도에 주의하십시오.

용어: [{"term": "파랑 주의보", "meaning": "해상에서 높은 파도로 인해 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}, {"term": "너울", "meaning": "바람이 불지 않는 곳에서도 먼바다에서 발생한 파도가 해안으로 밀려오는 현상으로, 갑작스럽게 높은 파도가 칠 수 있습니다."}]

### gemini-3.5-flash-lite

응답 2.133초 · HTTP 200

전체 번역:

제목: 기상경보·주의보(R06)(파랑). 일시: 2026년 10월 18일 12시 45분 48초 UTC. 상태: 통상. 편집관서: 오이타 지방기상대(Oita Local Meteorological Observatory). 발표관서: 오이타 지방기상대(Oita Local Meteorological Observatory). 제목: 오이타현(Oita Prefecture) 파랑경보·주의보. 보고일시: 2026년 10월 18일 오후 9시 45분 +09:00. 대상일시: 2026년 10월 18일 오후 9시 45분 +09:00. 정보유형: 발표. 정보종류: 기상경보·주의보. 텍스트: 남부(南部)에서는 높은 파도에 주의하십시오.

설명: 해안 지역에 높은 파도와 너울이 발생할 위험이 있으니 주의해야 합니다.

요약:

- 2026년 10월 18일 오후 9시 45분 기준 오이타현(Oita Prefecture) 남부(南部) 지역에 파랑주의보 발표 당시 지속 상태
- 오이타 지방기상대(Oita Local Meteorological Observatory)에서 파랑 관련 기상 정보를 발표함
- 남부(南部) 지역에서 높은 파도에 주의할 것을 당부함

별도 행동 지침 번역: 남부(南部)에서는, 고파에 주의하십시오.

용어: [{"term": "波浪注意報", "meaning": "강풍이나 높은 파도로 인해 해상이나 해안에 재해가 발생할 우려가 있을 때 발표하는 주의보입니다."}, {"term": "うねり", "meaning": "멀리서 밀려오는 큰 너울성 파도를 의미합니다."}]

## JP-21 — 降灰予報（定時）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018140045_0_VFVO53_010000.xml

### 입력 원문

Title: 降灰予報（定時）
DateTime: 2026-10-18T14:00:00Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 火山名　諏訪之瀬島　降灰予報（定時）
ReportDateTime: 2026-10-18T23:00:00+09:00
TargetDateTime: 2026-10-19T00:00:00+09:00
ValidDateTime: 2026-10-19T18:00:00+09:00
EventID: 511
InfoType: 発表
Serial: 1
InfoKind: 降灰予報
InfoKindVersion: 1.1_0
Text: 現在、諏訪之瀬島は噴火警戒レベル２（火口周辺規制）です。諏訪之瀬島で噴火が発生した場合には、１９日０９時から１２時までは火口から北方向に降灰が予想されます。
Name: 降灰予報（定時）
Name: 諏訪之瀬島
Name: 降灰
Name: 鹿児島県十島村
Name: 小さな噴石の落下
Name: 鹿児島県十島村
Name: 降灰予報（定時）
Name: 諏訪之瀬島
Name: 降灰
Name: 鹿児島県十島村
Name: 小さな噴石の落下
Name: 鹿児島県十島村
StartTime: 2026-10-19T00:00:00+09:00
EndTime: 2026-10-19T03:00:00+09:00
Name: 降灰
PlumeDirection: 北西
Distance: 40
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 北
Distance: 2
Name: 鹿児島県十島村
StartTime: 2026-10-19T03:00:00+09:00
EndTime: 2026-10-19T06:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 40
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 北
Distance: 2
Name: 鹿児島県十島村
StartTime: 2026-10-19T06:00:00+09:00
EndTime: 2026-10-19T09:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 40
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 北
Distance: 2
Name: 鹿児島県十島村
StartTime: 2026-10-19T09:00:00+09:00
EndTime: 2026-10-19T12:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 40
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 北
Distance: 2
Name: 鹿児島県十島村
StartTime: 2026-10-19T12:00:00+09:00
EndTime: 2026-10-19T15:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 30
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 北東
Distance: 2
Name: 鹿児島県十島村
StartTime: 2026-10-19T15:00:00+09:00
EndTime: 2026-10-19T18:00:00+09:00
Name: 降灰
PlumeDirection: 北
Distance: 20
Name: 鹿児島県十島村
Name: 小さな噴石の落下
PlumeDirection: 東
Distance: 1
Name: 鹿児島県十島村
VolcanoHeadline: 現在、諏訪之瀬島は噴火警戒レベル２（火口周辺規制）です。諏訪之瀬島で噴火が発生した場合には、１９日０９時から１２時までは火口から北方向に降灰が予想されます。
VolcanoActivity: １９日０時から１９日１８時までに噴火が発生した場合には、以下の方向・距離に降灰及び小さな噴石の落下が予想されます。
　
　時刻　　　　　　　　　　　　火口からの方向　降灰の距離　小さな噴石の距離
　１９日００時から０３時まで　北西　　　　　　４０ｋｍ　　２ｋｍ　　　　　
　１９日０３時から０６時まで　北　　　　　　　４０ｋｍ　　２ｋｍ　　　　　
　１９日０６時から０９時まで　北　　　　　　　４０ｋｍ　　２ｋｍ　　　　　
　１９日０９時から１２時まで　北　　　　　　　４０ｋｍ　　２ｋｍ　　　　　
　１９日１２時から１５時まで　北　　　　　　　３０ｋｍ　　２ｋｍ　　　　　
　１９日１５時から１８時まで　北　　　　　　　２０ｋｍ　　１ｋｍ　　　　　

　
　期間中に噴火が発生した場合には、以下の市町村に降灰が予想されます。
　鹿児島県：十島村
VolcanoPrevention: 噴煙が火口縁上１０００ｍまで上がった場合の火山灰及び小さな噴石の落下範囲を示しています。
　噴火発生時、小さな噴石の落下が予想される範囲内では、屋内や頑丈な屋根の下などに移動してください。

### gemini-3.1-flash-lite

응답 2.774초 · HTTP 200

전체 번역:

제목: 강회 예보(정시) 발행 관서: 기상청 보고 일시: 2026년 10월 18일 오후 11시 00분(JST) 화산명: 스와노세지마(諏訪之瀬島) 현재 스와노세지마(諏訪之瀬島)는 분화 경계 레벨 2(화구 주변 규제)입니다. 스와노세지마(諏訪之瀬島)에서 분화가 발생할 경우, 19일 09시부터 12시까지는 화구에서 북쪽 방향으로 강회가 예상됩니다. 19일 00시부터 18시 사이에 분화가 발생할 경우, 다음 방향 및 거리로 강회 및 작은 분석 낙하가 예상됩니다. [시간 / 화구로부터의 방향 / 강회 거리 / 작은 분석 거리] 19일 00시~03시 / 북서 / 40km / 2km, 19일 03시~06시 / 북 / 40km / 2km, 19일 06시~09시 / 북 / 40km / 2km, 19일 09시~12시 / 북 / 40km / 2km, 19일 12시~15시 / 북 / 30km / 2km, 19일 15시~18시 / 북 / 20km / 1km. 기간 중 분화 발생 시 가고시마현(鹿児島県) 토시마촌(十島村)에 강회가 예상됩니다. 본 예보는 분연이 화구 연상 1000m까지 상승했을 경우의 화산재 및 작은 분석 낙하 범위를 나타냅니다.

설명: 화산 분화 시 화산재가 날리거나 작은 돌덩이(분석)가 떨어질 위험이 있습니다.

요약:

- 일시: 2026년 10월 19일 00시~18시
- 장소: 가고시마현(鹿児島県) 토시마촌(十島村) 일대
- 행동: 작은 분석 낙하 예상 범위 내에서는 실내나 튼튼한 지붕 아래로 대피하십시오.

별도 행동 지침 번역: 분화 발생 시, 작은 분석 낙하가 예상되는 범위 내에 계신 분들은 실내나 튼튼한 지붕 아래 등으로 이동하십시오.

용어: [{"term": "분화 경계 레벨 2", "meaning": "화구 주변에 영향을 미치는 분화가 발생하거나 발생할 것으로 예상되는 상태로, 화구 주변에 대한 출입 규제가 시행됩니다."}, {"term": "강회", "meaning": "화산 분화로 인해 화산재가 지상으로 떨어지는 현상입니다."}, {"term": "분석", "meaning": "화산 분화 시 화구에서 튀어나오는 돌덩이입니다."}]

### gemini-3.5-flash-lite

응답 3.105초 · HTTP 200

전체 번역:

제목: 降灰予報（定時）
화산명: 스와노세지마(諏訪之瀬島) 降灰予報（정시）
보고 일시: 2026년 10월 18일 오후 11시 00분 +09:00
대상 일시: 2026년 10월 19일 오전 0시 00분 +09:00
유효 일시: 2026년 10월 19일 오후 6시 00분 +09:00
상태: 정상
편집실: 기상청 본청
발행실: 기상청
정보 종류: 降灰予報

현재 스와노세지마(諏訪之瀬島)는 분화 경보 레벨 2(화구 주변 규제)입니다. 스와노세지마(諏訪之瀬島)에서 분화가 발생할 경우에는 19일 09시부터 12시까지는 화구에서 북쪽 방향으로 강회가 예상됩니다.

19일 0시부터 19일 18시까지 분화가 발생한 경우에는 다음의 방향 및 거리에 강회 및 작은 분석의 낙하가 예상됩니다.

시각 | 화구로부터의 방향 | 강회의 거리 | 작은 분석의 거리
19일 00시부터 03시까지 | 북서 | 40km | 2km
19일 03시부터 06시까지 | 북 | 40km | 2km
19일 06시부터 09시까지 | 북 | 40km | 2km
19일 09시부터 12시까지 | 북 | 40km | 2km
19일 12시부터 15시까지 | 북 | 30km | 2km
19일 15시부터 18시까지 | 북 | 20km | 1km

기간 중에 분화가 발생한 경우에는 다음의 시정촌에 강회가 예상됩니다.
가고시마현(鹿児島県): 도시마촌(十島村)

분연이 화구 연기 위 1000m까지 올라갔을 경우의 화산재 및 작은 분석의 낙하 범위를 나타내고 있습니다.
분화 발생 시 작은 분석의 낙하가 예상되는 범위 내에서는 실내나 튼튼한 지붕 아래 등으로 이동하십시오.

설명: 화산 분화로 인해 화산재와 작은 분석이 날아와 주변 지역에 낙하할 위험이 있습니다.

요약:

- 발표 당시 지속 상태: 2026년 10월 19일 오전 0시부터 오후 6시까지 스와노세지마(諏訪之瀬島) 화산 분화 시 가고시마현 도시마촌(十島村) 등지에 강회 및 작은 분석 낙하 예상
- 대응 조치: 작은 분석 낙하 예상 범위 내에서는 실내나 튼튼한 지붕 아래로 이동하십시오.

별도 행동 지침 번역: 분화 발생 시, 작은 분석의 낙하가 예상되는 범위 내에서는 실내나 튼튼한 지붕 아래 등에 이동하십시오.

용어: [{"term": "降灰", "meaning": "화산 분화로 인해 화산재가 하늘에서 떨어지는 현상입니다."}, {"term": "小さな噴石", "meaning": "분화 시 화구에서 뿜어져 나오는 작은 돌멩이 조각입니다."}]

## JP-22 — 震源・震度に関する情報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018130039_0_VXSE53_010000.xml

### 입력 원문

Title: 震源・震度に関する情報
DateTime: 2026-10-18T13:00:38Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 震源・震度情報
ReportDateTime: 2026-10-18T22:00:00+09:00
TargetDateTime: 2026-10-18T22:00:00+09:00
EventID: 20261018215804
InfoType: 発表
Serial: 1
InfoKind: 地震情報
InfoKindVersion: 1.0_1
Text: １８日２１時５８分ころ、地震がありました。
OriginTime: 2026-10-18T21:57:00+09:00
ArrivalTime: 2026-10-18T21:58:00+09:00
Name: 福島県中通り
Magnitude: 3.3
Type: 地震情報／都道府県等
Type: 地震情報／細分区域
Type: 気象・地震・火山情報／市町村等
Type: 震度観測点
MaxInt: 1
Name: 福島県
MaxInt: 1
Name: 福島県中通り
MaxInt: 1
Name: 田村市
MaxInt: 1
Name: 田村市船引町
Int: 1
Name: 田村市都路町＊
Int: 1
Name: 棚倉町
MaxInt: 1
Name: 棚倉町棚倉中居野
Int: 1
Name: 浅川町
MaxInt: 1
Name: 浅川町浅川＊
Int: 1
Name: 福島県浜通り
MaxInt: 1
Name: いわき市
MaxInt: 1
Name: いわき市三和町
Int: 1
Name: 川内村
MaxInt: 1
Name: 川内村上川内早渡＊
Int: 1
Name: 大熊町
MaxInt: 1
Name: 大熊町大川原＊
Int: 1
Name: 浪江町
MaxInt: 1
Name: 浪江町幾世橋
Int: 1
Name: 茨城県
MaxInt: 1
Name: 茨城県北部
MaxInt: 1
Name: 大子町
MaxInt: 1
Name: 大子町池田＊
Int: 1
Text: この地震による津波の心配はありません。
Text: ＊印は気象庁以外の震度観測点についての情報です。

### gemini-3.1-flash-lite

응답 2.569초 · HTTP 200

전체 번역:

진원 및 진도에 관한 정보. 2026년 10월 18일 오후 10시 00분 발표. 18일 오후 9시 58분경 지진이 발생했습니다. 진원 시각은 18일 오후 9시 57분경입니다. 진원지는 후쿠시마현 나카도리(福島県中通り)이며 규모는 3.3입니다. 최대 진도는 1입니다. 각 지역의 진도는 다음과 같습니다. 후쿠시마현(福島県) 나카도리(中通り): 타무라시(田村市) 후네히키마치(船引町) 진도 1, 타무라시(田村市) 미야코지마치(都路町) 진도 1, 타나구라마치(棚倉町) 타나구라나카이노(棚倉中居野) 진도 1, 아사카와마치(浅川町) 아사카와(浅川) 진도 1. 후쿠시마현(福島県) 하마도리(浜通り): 이와키시(いわき市) 미와마치(三和町) 진도 1, 카와우치무라(川内村) 카미카와우치하야와타리(上川内早渡) 진도 1, 오쿠마마치(大熊町) 오카와라(大川原) 진도 1, 나미에마치(浪江町) 이쿠요하시(幾世橋) 진도 1. 이바라키현(茨城県) 북부: 다이고마치(大子町) 이케다(池田) 진도 1. 이 지진으로 인한 쓰나미 우려는 없습니다. *표시는 기상청 이외의 진도 관측점 정보입니다.

설명: 지진 발생으로 인해 해당 지역에서 진도 1의 흔들림이 관측되었습니다.

요약:

- 발생 일시: 2026년 10월 18일 오후 9시 58분경
- 발생 지역: 후쿠시마현 나카도리(福島県中通り) 및 주변 지역
- 피해 정보: 최대 진도 1, 쓰나미 우려 없음

별도 행동 지침 번역: None

용어: [{"term": "진도 1", "meaning": "실내에 있는 사람 중 일부가 흔들림을 느끼는 정도의 진동입니다."}, {"term": "진원지", "meaning": "지진이 발생한 지하의 지점입니다."}, {"term": "규모", "meaning": "지진 자체의 크기를 나타내는 수치입니다."}]

### gemini-3.5-flash-lite

응답 3.57초 · HTTP 200

전체 번역:

제목: 진원 및 진도에 관한 정보
일시: 2026년 10월 18일 오후 1시 00분 38초 (UTC+00:00)
상태: 통상
편집관서: 기상청 본청
발포관서: 기상청
제목: 진원 및 진도 정보
보고일시: 2026년 10월 18일 오후 10:00:00+09:00
대상일시: 2026년 10월 18일 오후 10:00:00+09:00
이벤트ID: 20261018215804
정보유형: 발표
일련번호: 1
정보종류: 지진 정보
정보종류버전: 1.0_1
텍스트: 18일 21시 58분경, 지진이 발생했습니다.
진원시: 2026년 10월 18일 오후 9시 57분 (UTC+09:00)
도달시각: 2026년 10월 18일 오후 9시 58분 (UTC+09:00)
이름: 후쿠시마현 나카도리(福島県中通り)
규모: 3.3
유형: 지진 정보 / 도도부현 등
유형: 지진 정보 / 세분 구역
유형: 기상·지진·화산 정보 / 시정촌 등
유형: 진도 관측소
최대진도: 1
이름: 후쿠시마현(福島県)
최대진도: 1
이름: 후쿠시마현 나카도리(福島県中通り)
최대진도: 1
이름: 다무라시(田村市)
최대진도: 1
이름: 다무라시 후네히키마치(田村市船引町)
진도: 1
이름: 다무라시 미야코지마치*(田村市都路町＊)
진도: 1
이름: 다나구라마치(棚倉町)
최대진도: 1
이름: 다나구라마치 다나구라나카이노(棚倉町棚倉中居野)
진도: 1
이름: 아사카와마치(浅川町)
최대진도: 1
이름: 아사카와마치 아사카와*(浅川町浅川＊)
진도: 1
이름: 후쿠시마현 하마도리(福島県浜通り)
최대진도: 1
이름: 이와키시(いわき市)
최대진도: 1
이름: 이와키시 미와마치(いわき市三和町)
진도: 1
이름: 가와우치무라(川内村)
최대진도: 1
이름: 가와우치무라 가미카와우치 하야와타*(川内村上川内早渡＊)
진도: 1
이름: 오쿠마마치(大熊町)
최대진도: 1
이름: 오쿠마마치 오카와라*(大熊町大川原＊)
진도: 1
이름: 나미에마치(浪江町)
최대진도: 1
이름: 나미에마치 이케요바시(浪江町幾世橋)
진도: 1
이름: 이바라키현(茨城県)
최대진도: 1
이름: 이바라키현 북부(茨城県北部)
최대진도: 1
이름: 다이고마치(大子町)
최대진도: 1
이름: 다고자마치 이케다*(大子町池田＊)
진도: 1
텍스트: 이 지진으로 인한 해일(쓰나미) 우려는 없습니다.
텍스트: *표는 기상청 이외의 진도 관측소에 관한 정보입니다.

설명: 지진이 발생하여 일부 지역에서 진도가 관측되었으나 해일 우려는 없습니다.

요약:

- 2026년 10월 18일 오후 9시 57분경 지진 발생
- 후쿠시마현 나카도리(福島県中通り) 등지에서 진도 1 관측
- 해일(쓰나미) 우려 없음

별도 행동 지침 번역: None

용어: [{"term": "진도", "meaning": "지진이 일어났을 때 특정 지역에서 나타난 흔들림의 정도를 나타냅니다."}, {"term": "규모", "meaning": "지진 자체의 에너지를 나타내는 절대적인 크기입니다."}]

## JP-23 — 台風解析・予報情報（５日予報）（Ｈ３０）

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018094027_0_VPTW60_010000.xml

### 입력 원문

Title: 台風解析・予報情報（５日予報）（Ｈ３０）
DateTime: 2026-10-18T09:40:26Z
Status: 通常
EditorialOffice: 気象庁本庁
PublishingOffice: 気象庁
Title: 台風解析・予報情報
ReportDateTime: 2026-10-18T18:45:00+09:00
TargetDateTime: 2026-10-18T18:00:00+09:00
TargetDuration: PT120H
EventID: TC2636
InfoType: 発表
Serial: 36
InfoKind: 台風解析・予報情報（５日予報）
InfoKindVersion: 1.0_2
DateTime: 2026-10-18T18:00:00+09:00
Type: 呼称
Name: CHAMPI
NameKana: チャンパー
Number: 2630
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
Location: マリアナ諸島
Direction: 西
Speed: 10
Speed: 20
Pressure: 950
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 75
Radius: 140
WindSpeed: 30
WindSpeed: 15
Radius: 240
Radius: 440
Name: 熱帯低気圧
BasePoint: +13.1+141.9/
BasePoint: +1305+14155/
Radius: 240
Radius: 440
DateTime: 2026-10-19T06:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +14.1+140.2/
BasePoint: +1405+14010/
Radius: 25
Radius: 45
Location: マリアナ諸島
Direction: 西北西
Speed: 10
Speed: 20
Pressure: 950
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 100
Radius: 185
Name: 熱帯低気圧
BasePoint: +14.1+140.2/
BasePoint: +1405+14010/
Radius: 25
Radius: 45
DateTime: 2026-10-19T18:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +15.1+138.1/
BasePoint: +1505+13805/
Radius: 35
Radius: 65
Location: フィリピンの東
Direction: 西北西
Speed: 11
Speed: 20
Pressure: 960
Type: 風
WindSpeed: 90
WindSpeed: 45
WindSpeed: 130
WindSpeed: 65
WindSpeed: 50
WindSpeed: 25
Radius: 110
Radius: 200
Name: 熱帯低気圧
BasePoint: +15.1+138.1/
BasePoint: +1505+13805/
Radius: 35
Radius: 65
DateTime: 2026-10-20T15:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +16.9+134.3/
BasePoint: +1655+13420/
Radius: 55
Radius: 100
Location: フィリピンの東
Direction: 西北西
Speed: 12
Speed: 20
Pressure: 940
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 145
Radius: 270
Name: 熱帯低気圧
BasePoint: +16.9+134.3/
BasePoint: +1655+13420/
Radius: 55
Radius: 100
DateTime: 2026-10-21T15:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +19.1+129.3/
BasePoint: +1905+12920/
Radius: 80
Radius: 150
Location: フィリピンの東
Direction: 西北西
Speed: 13
Speed: 25
Pressure: 925
Type: 風
WindSpeed: 100
WindSpeed: 50
WindSpeed: 140
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 200
Radius: 370
Name: 熱帯低気圧
BasePoint: +19.1+129.3/
BasePoint: +1905+12920/
Radius: 80
Radius: 150
DateTime: 2026-10-22T15:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +20.1+126.1/
BasePoint: +2005+12605/
Radius: 100
Radius: 185
Location: 沖縄の南
Direction: 西北西
Speed: 8
Speed: 15
Pressure: 935
Type: 風
WindSpeed: 95
WindSpeed: 50
WindSpeed: 135
WindSpeed: 70
WindSpeed: 50
WindSpeed: 25
Radius: 240
Radius: 440
Name: 熱帯低気圧
BasePoint: +20.1+126.1/
BasePoint: +2005+12605/
Radius: 100
Radius: 185
DateTime: 2026-10-23T15:00:00+09:00
Type: 階級
TyphoonClass: 台風(TY)
IntensityClass: 非常に強い
Type: 中心
BasePoint: +21.6+122.8/
BasePoint: +2135+12250/
Radius: 120
Radius: 220
Location: 沖縄の南
Direction: 西北西
Speed: 9
Speed: 15
Pressure: 950
Type: 風
WindSpeed: 85
WindSpeed: 45
WindSpeed: 120
WindSpeed: 60
WindSpeed: 50
WindSpeed: 25
Radius: 260
Radius: 480
Name: 熱帯低気圧
BasePoint: +21.6+122.8/
BasePoint: +2135+12250/
Radius: 120
Radius: 220

### gemini-3.1-flash-lite

응답 2.53초 · HTTP 200

전체 번역:

태풍 해석 및 예보 정보 (5일 예보) (H30) 발표 일시: 2026년 10월 18일 오후 6시 45분. 제30호 태풍 짠파(CHAMPI)는 2026년 10월 18일 오후 6시 현재 마리아나 제도 부근에서 매우 강한 세력으로 서쪽으로 이동 중입니다. 중심 기압은 950hPa이며, 중심 부근 최대 풍속은 약 95노트(약 176km/h)입니다. 향후 5일간 서북서진하며 필리핀 동쪽 해상을 거쳐 오키나와 남쪽 해상으로 이동할 것으로 예상됩니다.

설명: 태풍은 강한 바람과 폭우를 동반하여 심각한 피해를 줄 수 있으므로 기상 정보에 유의하십시오.

요약:

- 2026년 10월 18일 오후 6시 기준 마리아나 제도 부근에서 태풍 짠파(CHAMPI) 발생
- 매우 강한 세력을 유지하며 서북서진하여 필리핀 동쪽 및 오키나와 남쪽 해상으로 이동 예상
- 향후 5일간 태풍의 이동 경로와 세력 변화에 지속적인 주의 필요

별도 행동 지침 번역: None

용어: [{"term": "태풍(TY)", "meaning": "최대 풍속이 초속 17m 이상인 열대 저기압입니다."}, {"term": "매우 강한(Very Strong)", "meaning": "태풍의 중심 부근 최대 풍속이 44m/s 이상 54m/s 미만인 상태를 의미합니다."}, {"term": "중심 기압", "meaning": "태풍 중심부의 기압으로, 일반적으로 낮을수록 태풍의 세력이 강함을 나타냅니다."}]

### gemini-3.5-flash-lite

응답 2.626초 · HTTP 200

전체 번역:

제목: 태풍 분석 및 예보 정보(5일 예보)(H30) 보고 일시: 2026년 10월 18일 오후 6시 45분 (+09:00) 정보 종류: 태풍 분석 및 예보 정보(5일 예보) 태풍 호칭: チャンパー (CHAMPI), 번호: 2630, 계급: 태풍(TY), 강도: 매우 강. 2026년 10월 18일 오후 6시 기준 위치: 마リアナ諸島 (마리아나 제도), 진행 방향: 서, 속도: 10노트(약 19 km/h), 중심 기압: 950 hPa. 2026년 10월 19일 오전 6시 기준 위치: 마リアナ諸島 (마리아나 제도), 진행 방향: 서북서, 속도: 10노트(약 19 km/h), 중심 기압: 950 hPa. 2026년 10월 19일 오후 6시 기준 위치: フィリピンの東 (필리핀 동쪽), 진행 방향: 서북서, 속도: 11노트(약 20 km/h), 중심 기압: 960 hPa. 2026년 10월 20일 오후 3시 기준 위치: フィリピンの東 (필리핀 동쪽), 진행 방향: 서북서, 속도: 12노트(약 22 km/h), 중심 기압: 940 hPa. 2026년 10월 21일 오후 3시 기준 위치: フィリピンの東 (필리핀 동쪽), 진행 방향: 서북서, 속도: 13노트(약 24 km/h), 중심 기압: 925 hPa. 2026년 10월 22일 오후 3시 기준 위치: 沖縄の南 (오키나와 남쪽), 진행 방향: 서북서, 속도: 8노트(약 15 km/h), 중심 기압: 935 hPa. 2026년 10월 23일 오후 3시 기준 위치: 沖縄の南 (오키나와 남쪽), 진행 방향: 서북서, 속도: 9노트(약 17 km/h), 중심 기압: 950 hPa.

설명: 태풍 '찬패'가 북상하면서 강한 바람과 중심 기압 변화를 동반한 악천후가 발생할 수 있습니다.

요약:

- 보고 일시: 2026년 10월 18일 오후 6시 45분 (+09:00)
- 발표 당시 지속 상태: 태풍 '찬패'가 마리아나 제도 부근에서 서북서쪽으로 이동 중입니다.
- 조치 사항: 최신 태풍 경로 정보를 확인하고 안전에 유의하십시오.

별도 행동 지침 번역: None

용어: [{"term": "태풍(TY)", "meaning": "최대풍속이 일정 기준 이상인 열대저기압을 의미합니다."}, {"term": "매우 강", "meaning": "일본 기상청 기준에 따른 태풍의 강도 분류 중 하나입니다."}]

## JP-24 — 噴火に関する火山観測報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261017074536_0_VFVO52_400000.xml

### 입력 원문

Title: 噴火に関する火山観測報
DateTime: 2026-10-17T07:45:36Z
Status: 通常
EditorialOffice: 福岡管区気象台
PublishingOffice: 福岡管区気象台　鹿児島地方気象台
Title: 火山名　桜島　噴火に関する火山観測報
ReportDateTime: 2026-10-17T16:45:00+09:00
TargetDateTime: 2026-10-17T16:39:00+09:00
EventID: 20261017164500_506
InfoType: 発表
Serial: 1
InfoKind: 噴火に関する火山観測報
InfoKindVersion: 1.0_0
Text: 火　　山：桜島
日　　時：2026年10月17日16時39分(170739UTC)
現　　象：噴火
Name: 噴火
Name: 桜島
EventDateTime: 2026-10-17T16:39:00+09:00
EventDateTimeUTC: 2026-10-17T07:39:00Z
Name: 噴火
Name: 桜島
CraterName: 南岳山頂火口
CraterCoordinate: +3134.63+13039.53+1060/
PlumeHeightAboveCrater: 1200
PlumeHeightAboveSeaLevel: 7500
PlumeDirection: 南西
OtherObservation: 火口：南岳山頂火口
噴煙量：中量

### gemini-3.1-flash-lite

응답 1.978초 · HTTP 200

전체 번역:

제목: 분화 관련 화산 관측보. 발행 시각: 2026년 10월 17일 오후 4시 45분(JST). 화산명: 사쿠라지마(桜島). 일시: 2026년 10월 17일 오후 4시 39분. 현상: 분화. 화구: 미나미다케(南岳) 산정 화구. 분연 높이: 화구로부터 1,200m(해발 7,500m). 분연 방향: 남서쪽. 기타 관측: 분연량은 중량입니다.

설명: 화산 분화로 인해 화산재와 분연이 발생하고 있으니 주의하십시오.

요약:

- 일시: 2026년 10월 17일 오후 4시 39분
- 장소: 사쿠라지마(桜島) 미나미다케(南岳) 산정 화구
- 내용: 화산 분화 발생 및 분연 관측

별도 행동 지침 번역: None

용어: [{"term": "분연(噴煙)", "meaning": "화산 분화 시 화구에서 뿜어져 나오는 화산 가스, 화산재, 암석 파편 등의 혼합물입니다."}, {"term": "미나미다케(南岳) 산정 화구", "meaning": "사쿠라지마 화산의 주요 활동 화구 중 하나입니다."}]

### gemini-3.5-flash-lite

응답 2.503초 · HTTP 200

전체 번역:

제목: 분화에 관한 화산관측보
일시: 2026년 10월 17일 07:45:36 UTC
상태: 통상
편집관서: 후쿠오카 관구 기상대
발행관서: 후쿠오카 관구 기상대 가고시마 지방기상대
제목: 화산명 사쿠라지마 분화에 관한 화산관측보
보고일시: 2026년 10월 17일 오후 4시 45분 (+09:00)
대상일시: 2026년 10월 17일 오후 4시 39분 (+09:00)
이벤트 ID: 20261017164500_506
정보유형: 발표
일련번호: 1
정보종류: 분화에 관한 화산관측보
정보종류버전: 1.0_0
본문:
화산: 사쿠라지마 (桜島)
일시: 2026년 10월 17일 오후 4시 39분 (170739UTC)
현상: 분화
이벤트 일시: 2026년 10월 17일 오후 4시 39분 (+09:00)
이벤트 일시(UTC): 2026년 10월 17일 07:39:00 Z
분화구 이름: 미나미다케 산정 화구 (南岳山頂火口)
분화구 좌표: +3134.63+13039.53+1060/
분화구 상부 연기 높이: 1200m
해수면 기준 연기 높이: 7500m
연기 방향: 남서 (南西)
기타 관측: 화구: 미나미다케 산정 화구 (南岳山頂火口), 분연량: 중량

설명: 사쿠라지마(桜島) 화산의 분화가 관측되어 화산재와 분연에 주의가 필요합니다.

요약:

- 2026년 10월 17일 오후 4시 39분 사쿠라지마(桜島) 미나미다케 산정 화구에서 분화가 발생했습니다.
- 분화구 상부 연기 높이는 1200m, 해수면 기준 연기 높이는 7500m이며 남서쪽으로 이동합니다.

별도 행동 지침 번역: None

용어: [{"term": "南岳山頂火口", "meaning": "사쿠라지마의 주요 분화구 중 하나인 미나미다케 산정 화구를 뜻합니다."}, {"term": "噴煙", "meaning": "화산 분화 시 발생하는 화산가스와 화산회 등의 연기를 뜻합니다."}]

## JP-25 — 気象特別警報・警報・注意報

공식 원문: https://www.data.jma.go.jp/developer/xml/data/20261018150137_0_VPWW53_450000.xml

### 입력 원문

Title: 気象特別警報・警報・注意報
DateTime: 2026-10-18T15:01:36Z
Status: 通常
EditorialOffice: 宮崎地方気象台
PublishingOffice: 宮崎地方気象台
Title: 宮崎県気象警報・注意報
ReportDateTime: 2026-10-19T00:01:00+09:00
TargetDateTime: 2026-10-19T00:01:00+09:00
InfoType: 発表
InfoKind: 気象警報・注意報
InfoKindVersion: 1.1_2
Text: 北部平野部では、土砂災害や低い土地の浸水に注意してください。宮崎県では、高波に注意してください。
Name: 大雨注意報
Name: 波浪注意報
Name: 宮崎県
Name: 波浪注意報
Name: 南部平野部
Name: 大雨注意報
Name: 波浪注意報
Name: 北部平野部
Name: 波浪注意報
Name: 宮崎地区
Name: 波浪注意報
Name: 日南・串間地区
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡・日向地区
Name: 大雨注意報
Name: 波浪注意報
Name: 西都・高鍋地区
Name: 波浪注意報
Name: 宮崎市
Name: 大雨注意報
Name: 波浪注意報
Name: 延岡市
Name: 波浪注意報
Name: 日南市
Name: 大雨注意報
Name: 波浪注意報
Name: 日向市
Name: 波浪注意報
Name: 串間市
Name: 波浪注意報
Name: 高鍋町
Name: 波浪注意報
Name: 新富町
Name: 波浪注意報
Name: 川南町
Name: 大雨注意報
Name: 波浪注意報
Name: 都農町
Name: 波浪注意報
Name: 門川町
Name: 大雨注意報
Name: 北部平野部
Name: 波浪注意報
Name: 南部平野部
Name: 北部平野部
Notice: ［危険警報・氾濫特別警報の発表状況］
なし
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 宮崎県
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 南部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 北部平野部
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 1
Status: 発表警報・注意報はなし
Name: 南部山沿い
Status: 発表警報・注意報はなし
Name: 北部山沿い
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 宮崎地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 日南・串間地区
ChangeStatus: 変化無
FullStatus: 全域
EditingMark: 0
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 延岡・日向地区
ChangeStatus: 変化無
FullStatus: 一部
EditingMark: 0
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Name: 波浪注意報
Status: 継続
Note: うねり
Name: 西都・高鍋地区
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
FullStatus: 一部
EditingMark: 0
Status: 発表警報・注意報はなし
Name: 小林・えびの地区
Status: 発表警報・注意報はなし
Name: 都城地区
Status: 発表警報・注意報はなし
Name: 高千穂地区
Status: 発表警報・注意報はなし
Name: 椎葉・美郷地区
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 宮崎市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Status: 発表警報・注意報はなし
Name: 都城市
Name: 大雨注意報
Status: 継続
Note: 浸水注意
Type: 浸水
Date: １９日
Term: 明け方
Precipitation: 20
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 延岡市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 日南市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Status: 発表警報・注意報はなし
Name: 小林市
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Type: 土砂災害
Date: １９日
Term: 未明
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 日向市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 串間市
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Status: 発表警報・注意報はなし
Name: 西都市
Status: 発表警報・注意報はなし
Name: えびの市
Status: 発表警報・注意報はなし
Name: 三股町
Status: 発表警報・注意報はなし
Name: 高原町
Status: 発表警報・注意報はなし
Name: 国富町
Status: 発表警報・注意報はなし
Name: 綾町
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 高鍋町
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 新富町
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Status: 発表警報・注意報はなし
Name: 西米良村
Status: 発表警報・注意報はなし
Name: 木城町
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 川南町
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 大雨注意報
Status: 継続
Note: 土砂災害注意
Note: 浸水注意
Type: 土砂災害
Date: １９日
Term: 未明
Type: 浸水
Date: １９日
Term: 未明
Precipitation: 20
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 都農町
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Name: 波浪注意報
Status: 継続
Note: うねり
Type: 波
Date: １９日
Term: 明け方
WaveHeight: 2.5
Name: 門川町
ChangeStatus: 警報・注意報種別に変化無、量的予想事項等に変化有
Status: 発表警報・注意報はなし
Name: 諸塚村
Status: 発表警報・注意報はなし
Name: 椎葉村
Status: 発表警報・注意報はなし
Name: 美郷町
Status: 発表警報・注意報はなし
Name: 高千穂町
Status: 発表警報・注意報はなし
Name: 日之影町
Status: 発表警報・注意報はなし
Name: 五ヶ瀬町

### gemini-3.1-flash-lite

응답 2.425초 · HTTP 200

전체 번역:

기상 특별 경보·경보·주의보 (미야자키 지방 기상대 발표, 2026년 10월 19일 오전 0시 1분). 미야자키현 북부 평야부에서는 토사 재해 및 낮은 지대의 침수에 주의하십시오. 미야자키현 전역에서는 높은 파도에 주의하십시오. 현재 대우 주의보 및 파랑 주의보가 발표 당시 지속 상태입니다.

설명: 대우 주의보는 많은 비로 인한 토사 재해나 침수 피해가 예상될 때, 파랑 주의보는 높은 파도로 인한 피해가 예상될 때 발령됩니다.

요약:

- 2026년 10월 19일 오전 0시 1분 기준 미야자키현 전역에 파랑 주의보, 일부 지역에 대우 주의보가 발표 당시 지속 상태입니다.
- 북부 평야부에서는 토사 재해와 침수에 주의하십시오.
- 미야자키현 전역의 해안가에서는 높은 파도에 주의하십시오.

별도 행동 지침 번역: 북부 평야부에서는 토사 재해나 낮은 지대의 침수에 주의하십시오. 미야자키현에서는 높은 파도에 주의하십시오.

용어: [{"term": "대우 주의보", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발표되는 주의보입니다."}, {"term": "파랑 주의보", "meaning": "높은 파도로 인해 재해가 발생할 우려가 있을 때 발표되는 주의보입니다."}, {"term": "토사 재해", "meaning": "비로 인해 지반이 약해져 산사태나 흙더미가 무너져 내리는 재해를 의미합니다."}]

### gemini-3.5-flash-lite

응답 2.021초 · HTTP 200

전체 번역:

미야자키 지방기상대 발표 2026년 10월 19일 오전 12시 01분 기준 미야자키현(Miyazaki Prefecture) 기상 경보 및 주의보입니다. 발표 당시 지속 상태: 북부 평야부(Northern Plains) 등 일부 지역에 대우 주의보 및 파랑 주의보가 발표 당시 지속 중입니다. 북부 평야부(Northern Plains)에서는 토사 재해나 낮은 지역의 침수에 주의하십시오. 미야자키현(Miyazaki Prefecture)에서는 높은 파도에 주의하십시오.

설명: 대우 주의보와 파랑 주의보는 재해를 일으킬 수 있는 기상 상황이 예상될 때 주의를 당부하기 위해 발표됩니다.

요약:

- 발표 시각: 2026년 10월 19일 오전 12시 01분 (+09:00)
- 대상 지역: 미야자키현(Miyazaki Prefecture) 북부 평야부(Northern Plains) 등
- 조치 사항: 북부 평야부(Northern Plains) 등에서 토사 재해, 침수, 높은 파도에 주의하십시오.

별도 행동 지침 번역: 북부 평야부에서는 토사 재해나 낮은 지역의 침수에 주의하십시오. 미야자키현에서는 고파에 주의하십시오.

용어: [{"term": "대우 주의보", "meaning": "많은 비로 인해 재해가 발생할 우려가 있을 때 발표되는 주의보입니다."}, {"term": "파랑 주의보", "meaning": "강한 바람이나 너울 등으로 인해 해상에서 높은 파도가 일어날 우려가 있을 때 발표되는 주의보입니다."}]
