"""Identify a local checkout and loaded code when choosing development servers."""
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDENTITY_FILES = (
    'backend/main.py',
    'backend/core/app_assistant.py',
    'backend/adapters/local_information.py',
    'frontend/src/components/TravelAssistant.tsx',
    'frontend/src/components/TravelAssistant.css',

    'backend/local_runtime.py',
    'frontend/vite.config.ts',
    'frontend/src/App.tsx',
    'backend/core/urgency.py',
    'backend/core/urgency_ai.py',
    'backend/models/contracts.py',
    'frontend/src/services/api.ts',
    'frontend/src/types/index.ts',
    'frontend/src/pages/Flow.tsx',
    'frontend/src/components/UrgencyCard.tsx',
    'frontend/src/components/UrgencyCard.css',
)


def runtime_identity(root=ROOT):
    root = Path(root).resolve()
    revision = hashlib.sha256()
    for name in IDENTITY_FILES:
        revision.update((root / name).read_bytes())
    return {
        'project_id': hashlib.sha256(str(root).encode()).hexdigest()[:16],
        'revision': revision.hexdigest(),
    }
