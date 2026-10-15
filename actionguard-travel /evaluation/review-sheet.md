# 표본 검토표

실제 수신 SMS라고 주장하지 않습니다. 공개 발췌 3건·합성 회귀 17건, 총 20건입니다. 각 정답은 독립 검토 전 초안입니다.

|표본|국가|자료 구분|검토 항목|독립 검토|
|---|---|---|---|---|
|us-public-wind|US|official_bulletin_excerpt|time_roles, timezone, area, wind_units|미검토|
|jp-public-earthquake|JP|public_safety_email_excerpt|date, issued_vs_onset, negation, compound_hazard, area|미검토|
|jp-iso-wave|JP|synthetic_regression|iso_display, time_roles, unknown_end|미검토|
|us-date-heat|US|synthetic_regression|date, time_roles, temperature_units, prohibition|미검토|
|us-flood-prohibition|US|synthetic_regression|negation, action|미검토|
|jp-earthquake-no-tsunami|JP|synthetic_regression|compound_hazard, negation|미검토|
|us-cancel-wind-flood|US|synthetic_regression|compound_hazard, cancellation|미검토|
|jp-drill|JP|synthetic_regression|drill|미검토|
|us-relative-midnight|US|synthetic_regression|ambiguous_midnight|미검토|
|jp-si-units|JP|synthetic_regression|temperature_units, wind_units|미검토|
|us-zone-change|US|synthetic_regression|dst, time_roles|미검토|
|jp-public-misdelivery|JP|official_misdelivery_excerpt|misdelivery, level, area|미검토|
|us-midnight-range|US|synthetic_regression|date, time_roles, wind_units|미검토|
|us-fahrenheit-negative|US|synthetic_regression|temperature, negation|미검토|
|us-cancel-one-hazard|US|synthetic_regression|compound_hazard, cancellation, prohibition|미검토|
|us-conditional-evacuation|US|synthetic_regression|condition, negation|미검토|
|jp-issued-start-end|JP|synthetic_regression|date, time_roles, negation|미검토|
|jp-tsunami-cancel-earthquake|JP|synthetic_regression|cancellation, compound_hazard, prohibition|미검토|
|jp-distance-not-speed|JP|synthetic_regression|area, wind_units|미검토|
|jp-future-drill|JP|synthetic_regression|drill, date, negation|미검토|

검토자는 날짜/시각 역할/지역/단위/부정·조건/금지 행동을 원문과 대조하고, 오류 여부와 원문 인용을 남깁니다. 미검토를 통과로 집계하지 않습니다.
