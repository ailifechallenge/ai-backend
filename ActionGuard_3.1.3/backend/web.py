"""Serve only the compiled public web application, after all API routes."""
from pathlib import Path
from starlette.exceptions import HTTPException
from starlette.staticfiles import StaticFiles

APP_ROUTES = {'', '.', 'home', 'welcome', 'response-guide', 'analyze', 'translate', 'verify', 'guidance', 'chat', 'itinerary', 'schedule', 'shelters', 'navigation', 'japan-disasters', 'japan-volcano', 'notifications', 'weather-alert', 'prepare'}

class WebApplication(StaticFiles):
    async def get_response(self, path, scope):
        if path == 'api' or path.startswith('api/'):
            raise HTTPException(404)
        try:
            response = await super().get_response(path, scope)
        except HTTPException as error:
            if error.status_code != 404 or path.strip('/') not in APP_ROUTES:
                raise
            response = await super().get_response('index.html', scope)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Cache-Control'] = 'no-cache' if path.strip('/') in APP_ROUTES or path == 'index.html' else 'public, max-age=3600'
        return response

def mount_web(app, directory):
    directory = Path(directory)
    if (directory / 'index.html').is_file():
        app.mount('/', WebApplication(directory=directory, html=True), name='web')
