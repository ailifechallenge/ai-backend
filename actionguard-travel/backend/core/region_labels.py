"""Display-only labels. Official names/codes are never replaced for lookup or matching."""
import json
from functools import lru_cache
from pathlib import Path

@lru_cache(maxsize=1)
def catalog():
    return json.loads((Path(__file__).resolve().parents[2]/'data/japan-regions-ko.json').read_text())

def japanese_region(code,name,en_name=''):
    data=catalog();entry=data['offices'].get(code) or data['municipalities'].get(code)
    # Do not reuse a label if an official identifier was reassigned or its name changed.
    if entry and entry['name']==name:
        return {'ko_name':entry['ko_name'],'en_name':en_name or entry['en_name'],
                'display_name':entry['ko_name']+' ('+name+')','label_method':entry['label_method']}
    return {'ko_name':None,'en_name':en_name,'display_name':name+(' · '+en_name if en_name else ''),'label_method':'original'}
