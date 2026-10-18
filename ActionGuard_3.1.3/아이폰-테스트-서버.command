#!/bin/bash
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
printf '아이폰과 Mac을 같은 Wi-Fi에 연결해 주세요.\n이 창을 닫으면 아이폰 앱의 서버 연결이 종료됩니다.\n연결 주소: http://%s.local:8004\n' "$(/usr/sbin/scutil --get LocalHostName)"
exec ./.venv/bin/python -B -m uvicorn backend.main:app --host 0.0.0.0 --port 8004
