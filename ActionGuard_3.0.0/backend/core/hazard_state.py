"""Conservative, evidence-bearing states per hazard; never an active-alert oracle."""
import re
from dataclasses import dataclass

@dataclass(frozen=True)
class HazardState:
    state: str
    evidence: tuple[str, ...]


def classify_hazard(text, tokens):
    text = text.lower().replace('wind chill', 'cold')
    def matches(clause):
        return any(re.search(r'\b' + re.escape(t.lower()) + r'\b', clause) if t.isascii() else t in clause for t in tokens)
    clauses = [c.strip() for c in re.split(r'[。.!?;\n]|\bbut\b|ただし|しかし', text) if c.strip()]
    evidence = tuple(c for c in clauses if matches(c))
    if not evidence:
        return HazardState('absent', ())
    test_context = re.sub(r'\bnot\s+(?:a\s+)?(?:drill|exercise|test message)\b|訓練ではありません|훈련이 아닙니다', '', text)
    if re.search(r'\b(?:drill|exercise|test message)\b|訓練|テスト配信|誤送信|훈련|오발송', test_context):
        return HazardState('test', evidence)
    states = set()
    for clause in evidence:
        if re.search(r'\bnot\s+(?:cancelled|canceled|lifted)\b|解除されていません', clause):
            states.add('unknown')
        elif re.search(r'\b(?:cancelled|canceled|expired|lifted)\b|解除|해제', clause):
            states.add('cancelled')
        elif any(re.search(
            (r'\bno\s+(?:\w+\s+){0,2}' + re.escape(token) + r'\b|\b' + re.escape(token) + r'\s+(?:is\s+)?not\s+expected')
            if token.isascii() else (re.escape(token) + r'(?:の|による災害の)?(?:心配|おそれ)はありません'), clause)
            for token in tokens):
            states.add('negated')
        elif re.search(r'\bif\b|場合|라면|경우', clause):
            states.add('conditional')
        else:
            states.add('mentioned')
    # Opposing or conditional clauses need interpretation; do not assert current risk.
    state = next(iter(states)) if len(states) == 1 else 'unknown'
    return HazardState(state, evidence)
