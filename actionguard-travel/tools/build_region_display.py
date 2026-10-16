"""Build the small frontend display index from the full reviewed region catalog."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=json.loads((root/'data/japan-regions-ko.json').read_text())
index={group:{code:{'name':r['name'],'ko_name':r['ko_name']} for code,r in source[group].items()} for group in ('offices','municipalities')}
(root/'data/japan-region-display.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':'))+'\n')
