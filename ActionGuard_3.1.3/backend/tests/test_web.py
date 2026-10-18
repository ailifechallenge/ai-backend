from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.web import mount_web

def test_public_spa_routes_and_api_remain_separate(tmp_path):
    dist = tmp_path / 'dist'
    dist.mkdir()
    (dist / 'index.html').write_text('<html>ActionGuard test</html>')
    (dist / 'assets').mkdir()
    (dist / 'assets' / 'main.js').write_text('console.log("web")')
    (tmp_path / 'private.env').write_text('TEST_SECRET=not_public')
    app = FastAPI()
    @app.get('/api/health')
    def health(): return {'status': 'ok'}
    mount_web(app, dist)
    with TestClient(app) as client:
        for route in ['/', '/itinerary', '/shelters?country=JP', '/prepare', '/japan-volcano']:
            response = client.get(route)
            assert response.status_code == 200 and 'ActionGuard test' in response.text
            assert response.headers['cache-control'] == 'no-cache'
        assert client.get('/api/health').json() == {'status': 'ok'}
        assert client.get('/assets/main.js').status_code == 200
        for path in ['/api/unknown', '/assets/missing.js', '/backend/main.py', '/.env', '/%2e%2e/private.env']:
            assert client.get(path).status_code == 404

def test_no_frontend_build_leaves_api_available(tmp_path):
    app = FastAPI()
    mount_web(app, tmp_path)
    with TestClient(app) as client: assert client.get('/').status_code == 404
