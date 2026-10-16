"""Launch this checkout, without accidentally opening an older local server."""
import json
import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.request

from backend.local_runtime import ROOT, runtime_identity


def response(port, path):
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=.5) as r:
            return json.load(r)
    except (OSError, ValueError):
        return None


def matches(port, path, expected, kind, api_target=None):
    data = response(port, path)
    return isinstance(data, dict) and all(data.get(k) == v for k, v in expected.items()) and data.get('kind') == kind and (api_target is None or data.get('api_target') == api_target)


def listening(port):
    with socket.socket() as sock:
        return sock.connect_ex(('127.0.0.1', port)) == 0


def choose_port(ports, path, expected, kind, api_target=None):
    occupied = [p for p in ports if listening(p)]
    for port in occupied:
        if matches(port, path, expected, kind, api_target):
            return port, True
    for port in ports:
        if port not in occupied:
            return port, False
    raise RuntimeError('사용 가능한 실행 포트가 없습니다. 이전 실행 창을 닫고 다시 시작하세요.')


def main():
    os.chdir(ROOT)
    children = []
    expected = runtime_identity()
    try:
        backend_port, backend_running = choose_port(range(8000, 8100), '/api/local-runtime', expected, 'backend')
        target = f'http://127.0.0.1:{backend_port}'
        frontend_port, frontend_running = choose_port(range(5173, 5273), '/__actionguard/runtime', expected, 'frontend', target)
        if not backend_running:
            children.append(subprocess.Popen([sys.executable, '-B', '-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', str(backend_port)]))
        if not frontend_running:
            npm = shutil.which('npm')
            if not npm:
                raise RuntimeError('Node.js 설치가 필요합니다. README의 실행 준비를 확인하세요.')
            children.append(subprocess.Popen([npm, '--prefix', 'frontend', 'run', 'dev', '--', '--port', str(frontend_port), '--strictPort'], env={**os.environ, 'ACTIONGUARD_API_TARGET': target, 'ACTIONGUARD_BACKEND_PORT': str(backend_port)}))
        for _ in range(90):
            if any(p.poll() is not None for p in children):
                raise RuntimeError('시작에 실패했습니다. 위 오류와 README의 설치 안내를 확인하세요.')
            if matches(backend_port, '/api/local-runtime', expected, 'backend') and matches(frontend_port, '/__actionguard/runtime', expected, 'frontend', target) and matches(frontend_port, '/api/local-runtime', expected, 'backend'):
                break
            time.sleep(.5)
        else:
            raise RuntimeError('서버 연결 확인 시간이 초과되었습니다.')
        url = f'http://127.0.0.1:{frontend_port}'
        print(f'\nActionGuard: {url}\n일본 지진·쓰나미: {url}/japan-disasters\n사용하는 동안 이 창을 열어 두세요. 종료: Ctrl+C', flush=True)
        if os.environ.get('ACTIONGUARD_NO_BROWSER') != '1':
            subprocess.run(['open', url], check=False)
        while children:
            if any(p.poll() is not None for p in children):
                raise RuntimeError('서버가 종료되었습니다. 위 오류를 확인하세요.')
            time.sleep(1)
    except KeyboardInterrupt:
        print('\nActionGuard를 종료합니다.')
    except Exception as exc:
        print(str(exc), flush=True)
        if sys.stdin.isatty():
            input('Enter를 누르면 닫힙니다.')
        return 1
    finally:
        for process in children:
            if process.poll() is None:
                process.terminate()
        for process in children:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
    return 0


if __name__ == '__main__':
    sys.exit(main())
