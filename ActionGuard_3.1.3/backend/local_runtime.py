"""Identify a local checkout and loaded code when choosing development servers."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDENTITY_FILES = tuple(json.loads((ROOT / 'data/runtime-files.json').read_text()))


def runtime_identity(root=ROOT):
    root = Path(root).resolve()
    revision = hashlib.sha256()
    for name in IDENTITY_FILES:
        revision.update((root / name).read_bytes())
    return {
        'project_id': hashlib.sha256(str(root).encode()).hexdigest()[:16],
        'revision': revision.hexdigest(),
    }
