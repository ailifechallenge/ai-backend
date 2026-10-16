"""Building types, independent of the emergency role assigned to a building."""
import re

LABELS = {
    'school': '학교·교육시설', 'assembly': '체육관·컨벤션센터',
    'safe_room': '토네이도 안전실', 'community': '커뮤니티·공공시설',
    'religious': '종교시설', 'temporary': '임시 대피시설',
    'lodging': '호텔·모텔·기숙사', 'camp': '캠프·임시 숙영지',
    'warehouse': '창고·대형 상업시설', 'other': '건물 유형 확인 대기',
}

def normalized(value):
    return ' '.join(re.findall(r'[a-z0-9]+', str(value or '').lower()))

def categorize(*values):
    text = normalized(' '.join(str(v or '') for v in values))
    if any(x in text for x in ('safe room', 'tornado shelter', 'storm shelter')):
        kind = 'safe_room'
    elif any(x in text for x in ('school', 'education', 'college', 'university', 'academy', 'campus')) or re.search(r'\b(?:p\s*s|m\s*s|i\s*s|j\s*h\s*s|h\s*s)\s*\d+', text) or re.search(r'\b(?:j\s*h\s*s|h\s*s)\b', text):
        kind = 'school'
    elif any(x in text for x in ('hotel', 'motel', 'dormitor', 'residence hall')):
        kind = 'lodging'
    elif any(x in text for x in ('campground', 'retreat', 'survivor camp', 'support camp')):
        kind = 'camp'
    elif any(x in text for x in ('warehouse', 'vacant store')):
        kind = 'warehouse'
    elif any(x in text for x in ('gymnasium', 'gym', 'convention', 'arena', 'stadium', 'conference center')):
        kind = 'assembly'
    elif any(x in text for x in ('church', 'religious', 'chapel', 'mosque', 'synagogue', 'temple', 'faith')):
        kind = 'religious'
    elif any(x in text for x in ('community', 'civic', 'public facility', 'recreation', 'municipal', 'library', 'ywca', 'ymca', 'senior center', 'borough hall', 'city hall')):
        kind = 'community'
    elif any(x in text for x in ('temporary shelter', 'temporary evacuation', 'temporary camp')):
        kind = 'temporary'
    else:
        kind = 'other'
    return kind, LABELS[kind]
