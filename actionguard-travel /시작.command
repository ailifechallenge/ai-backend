#!/bin/bash
cd "$(dirname "$0")" || exit 1
PYTHON="./.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON="./venv/bin/python"
if [ ! -x "$PYTHON" ]; then
  echo "프로젝트의 Python 실행 환경이 없습니다. README의 최초 설치를 먼저 진행해 주세요."
  read -r -p "Enter를 누르면 닫힙니다."
  exit 1
fi
"$PYTHON" -B - <<'PY'
import json, socket, subprocess, time, urllib.request, os
backend_port=8000
children=[]
def listening(port):
    with socket.socket() as s:
        return s.connect_ex(('127.0.0.1',port)) == 0
def integrated(port):
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/navigation/config',timeout=2) as r:
            return json.load(r).get('version') == '2.9'
    except Exception:return False
backend_port=next((p for p in reversed(range(8000,8010)) if listening(p) and integrated(p)),None) or next((p for p in range(8000,8010) if not listening(p)),8000)

frontend_port=next((p for p in reversed(range(5173,5183)) if listening(p) and integrated(p)),None) or next((p for p in range(5173,5183) if not listening(p)),5173)

def health():
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{backend_port}/api/health',timeout=2) as r:
            return json.load(r).get('status')=='ok'
    except Exception:
        return False
try:
    if listening(backend_port) and not integrated(backend_port):
        raise RuntimeError('분석 서버 포트를 다른 프로그램이 사용 중입니다. 종료 후 다시 시작해 주세요.')
    if not listening(backend_port):
        import sys
        children.append(subprocess.Popen([sys.executable,'-B','-m','uvicorn','backend.main:app','--host','127.0.0.1','--port',str(backend_port)]))
    if not listening(frontend_port):
        children.append(subprocess.Popen(['npm','--prefix','frontend','run','dev','--','--port',str(frontend_port),'--strictPort'],env={**os.environ,'ACTIONGUARD_API_TARGET':f'http://127.0.0.1:{backend_port}','ACTIONGUARD_BACKEND_PORT':str(backend_port)}))
    for _ in range(60):
        if any(p.poll() is not None for p in children):
            raise RuntimeError('시작에 실패했습니다. 위 오류와 README의 설치 안내를 확인해 주세요.')
        if health() and listening(frontend_port):break
        time.sleep(.5)
    else:raise RuntimeError('서버 시작 대기 시간이 초과되었습니다.')
    subprocess.run(['open',f'http://127.0.0.1:{frontend_port}'],check=False)
    print('\nActionGuard 실행 중입니다. 사용하는 동안 이 창을 열어 두세요. 종료하려면 Ctrl+C를 누르세요.',flush=True)
    while children:
        if any(p.poll() is not None for p in children):
            raise RuntimeError('서버가 종료되었습니다. 위 오류를 확인하고 다시 시작해 주세요.')
        time.sleep(1)
except KeyboardInterrupt:
    print('\nActionGuard를 종료합니다.')
except Exception as exc:
    print(str(exc))
    input('Enter를 누르면 닫힙니다.')
finally:
    for p in children:
        if p.poll() is None:p.terminate()
    for p in children:
        try:p.wait(timeout=5)
        except subprocess.TimeoutExpired:p.kill()
PY
