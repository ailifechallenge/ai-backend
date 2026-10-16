#!/bin/bash
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
PYTHON="./.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON="./venv/bin/python"
if [ ! -x "$PYTHON" ]; then
  echo "실행 환경이 없습니다. README의 최초 설치를 확인하세요."
  read -r -p "Enter를 누르면 닫힙니다."
  exit 1
fi
exec "$PYTHON" -B -m backend.launcher
