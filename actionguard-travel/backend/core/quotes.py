import re
import unicodedata


def normalize_quote(text: str) -> str:
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", text)).strip().casefold()


def supported_quote(quote: str, document: str) -> bool:
    return bool(quote.strip()) and normalize_quote(quote) in normalize_quote(document)


def extract_english_clock_times(text: str) -> set[str]:
    """Partial clock-time parser for testable 12h English forms (e.g. 6:00 PM)."""
    result = set()
    pat = r"\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(a\.?m\.?|p\.?m\.?)\b"
    for match in re.finditer(pat, text, re.IGNORECASE):
        hour, minute, meridiem = (
            int(match.group(1)),
            int(match.group(2) or 0),
            match.group(3).lower(),
        )
        hour = (hour % 12) + (12 if meridiem.startswith("p") else 0)
        result.add(f"{hour:02d}:{minute:02d}")
    return result


def extract_korean_clock_times(text: str) -> set[str]:
    result = set()
    pat = r"(오전|오후)\s*(1[0-2]|0?[1-9])(?::([0-5][0-9])|\s*시(?:\s*([0-5]?[0-9])\s*분)?)?"
    for match in re.finditer(pat, text):
        hour = int(match.group(2))
        minute = int(match.group(3) or match.group(4) or 0)
        hour = (hour % 12) + (12 if match.group(1) == "오후" else 0)
        result.add(f"{hour:02d}:{minute:02d}")
    for match in re.finditer(
        r"(?<![\d:])(2[0-3]|1[0-9]|0?[0-9])\s*시(?:\s*([0-5]?[0-9])\s*분)?", text
    ):
        if not text[max(0, match.start() - 4) : match.start()].endswith(
            ("오전", "오후", "오전 ", "오후 ")
        ):
            hour, minute = int(match.group(1)), int(match.group(2) or 0)
            if hour > 12:
                result.add(f"{hour:02d}:{minute:02d}")
    return result
