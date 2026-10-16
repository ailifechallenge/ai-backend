"""Readable timestamps without changing the source offset or inventing a role."""
import re
from datetime import datetime

ISO_TIMESTAMP = re.compile(r"(?<![\dT])\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})(?![\d:])")


def readable_times(text):
    def render(match):
        value = match[0]
        try:
            time = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return value
        offset = time.strftime('%z')
        zone = f"UTC{offset[:3]}:{offset[3:]}"
        clock = f"{'오전' if time.hour < 12 else '오후'} {time.hour % 12 or 12}시 {time.minute:02d}분"
        if time.second or time.microsecond:
            clock += f" {time.second:02d}"
            if time.microsecond:
                clock += f".{time.microsecond:06d}".rstrip('0')
            clock += '초'
        return f"{time.year}년 {time.month}월 {time.day}일 {clock} ({zone})"
    return ISO_TIMESTAMP.sub(render, text)


def equivalent_timestamp_present(iso, target):
    """Recognize equivalent Korean date/time offsets, never ignoring the zone."""
    try:
        original = datetime.fromisoformat(iso.replace('Z', '+00:00'))
    except ValueError:
        return False
    pattern = re.compile(
        r'(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(오전|오후)\s*(\d{1,2})시\s*(\d{1,2})분'
        r'(?:\s*(\d{1,2}(?:\.\d+)?)초)?\s*\(\s*(?:UTC|GMT)?\s*([+-])(\d{1,2})(?::?(\d{2}))?\s*\)'
    )
    for m in pattern.finditer(target):
        year,month,day,period,hour,minute,second,sign,oh,om=m.groups()
        if not 1 <= int(hour) <= 12: continue
        h=int(hour)%12+(12 if period=='오후' else 0)
        stamp=f'{int(year):04d}-{int(month):02d}-{int(day):02d}T{h:02d}:{int(minute):02d}:{second or "00"}{sign}{int(oh):02d}:{int(om or 0):02d}'
        try:
            if datetime.fromisoformat(stamp)==original: return True
        except ValueError:
            continue
    return False
