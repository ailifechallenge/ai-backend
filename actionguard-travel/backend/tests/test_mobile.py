import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.mark.parametrize('origin',['capacitor://localhost','https://localhost','http://localhost'])
def test_native_app_origin_can_reach_api(origin):
 response=TestClient(app).options('/api/health',headers={'Origin':origin,'Access-Control-Request-Method':'GET'})
 assert response.status_code==200 and response.headers['access-control-allow-origin']==origin

def test_unrelated_origin_is_not_added_with_native_support():
 response=TestClient(app).options('/api/health',headers={'Origin':'https://unrelated.example','Access-Control-Request-Method':'GET'})
 assert 'access-control-allow-origin' not in response.headers
