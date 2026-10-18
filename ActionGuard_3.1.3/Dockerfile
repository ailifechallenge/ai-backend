FROM node:22-bookworm-slim AS webbuild
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
COPY backend /app/backend
COPY data /app/data
ENV VITE_API_BASE_URL="" VITE_PUSH_READY=false
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-eng tesseract-ocr-jpn && rm -rf /var/lib/apt/lists/*
COPY deploy/requirements.txt /app/deploy/requirements.txt
RUN pip install --no-cache-dir -r /app/deploy/requirements.txt
RUN useradd --create-home --uid 10001 appuser
COPY --chown=appuser:appuser backend /app/backend
COPY --chown=appuser:appuser data /app/data
COPY --chown=appuser:appuser frontend /app/frontend
COPY --from=webbuild --chown=appuser:appuser /app/frontend/dist /app/frontend/dist
RUN python -c "from backend.local_runtime import runtime_identity; runtime_identity()"
USER appuser
EXPOSE 10000
CMD ["sh", "-c", "exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-10000} --workers 1 --no-access-log"]
