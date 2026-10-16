from backend import launcher


def test_old_server_with_same_version_is_skipped(monkeypatch):
    monkeypatch.setattr(launcher, 'listening', lambda port: port == 8000)
    monkeypatch.setattr(launcher, 'response', lambda port, path: {'version': '2.9'})
    assert launcher.choose_port(range(8000, 8003), '/api/local-runtime', {'project_id': 'desktop', 'revision': 'new'}, 'backend') == (8001, False)


def test_server_from_another_folder_is_skipped(monkeypatch):
    monkeypatch.setattr(launcher, 'response', lambda *args: {'project_id': 'other-folder', 'revision': 'new', 'kind': 'backend'})
    assert not launcher.matches(8000, '/api/local-runtime', {'project_id': 'desktop', 'revision': 'new'}, 'backend')


def test_frontend_with_old_backend_is_skipped(monkeypatch):
    identity = {'project_id': 'desktop', 'revision': 'new'}
    monkeypatch.setattr(launcher, 'response', lambda *args: {**identity, 'kind': 'frontend', 'api_target': 'http://127.0.0.1:8000'})
    assert not launcher.matches(5173, '/__actionguard/runtime', identity, 'frontend', 'http://127.0.0.1:8001')
    assert launcher.matches(5173, '/__actionguard/runtime', identity, 'frontend', 'http://127.0.0.1:8000')
