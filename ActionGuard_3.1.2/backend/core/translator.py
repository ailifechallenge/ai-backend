import re
from backend.core.times import readable_times
from backend.models.contracts import Translation

PROMPT = """Translate the ENTIRE alert into faithful Korean. The source may be English or Japanese. Preserve all dates, time zones, numbers, units, and place names (keep original place names in parentheses). For U.S. weather-alert temperatures, retain Fahrenheit and show a correctly calculated Celsius equivalent, e.g. 95°F (약 35°C); never replace the original Fahrenheit value. Only when the system confirms an official U.S. NWS source may an omitted weather temperature unit be treated as Fahrenheit. Japanese alerts commonly state temperatures in Celsius; preserve those values and do not convert them to Fahrenheit. Convert wind speeds stated in mph to km/h alongside the original, e.g. 60~70 mph (약 97~113 km/h), so Korean readers can understand them. Do not apply temperature conversion to dates, times, or unrelated numbers. Keep issued/report time, event onset, event end and message expiration separate. Never present a publication time as a start time or message expiration as the event end. Unknown onset/end stays unspecified. In Korean use readable year/month/day and 오전/오후 times with the ORIGINAL UTC offset or named timezone, not raw ISO timestamps. Do not guess a year or timezone for relative dates or midnight. Never claim an old pasted alert is currently active just because it says in effect. Translate Japanese statuses such as 継続/発表/解除 into Korean; in a summary label continued status as 발표 당시 지속 상태 rather than a claim about now. Keep actual Japanese place names in parentheses; do not replace them with invented English names. Never invent evacuation, closures, safety claims or facilities. In hazard_explanation and glossary, explain unfamiliar storm terms in plain Korean: when Category N is explicitly present, explain it as a wind-intensity category out of five, distinct from evacuation instructions and Korean typhoon intensity labels. Never assign a category absent from the source or present storm intensity at a distant center as the measured wind at the user location. Preserve the original Category N term in the full translation. Keep the full translation accurate, but make hazard_explanation one short Korean sentence and summary no more than three short, mobile-friendly Korean bullets containing only time, place, and actions present in the input. Include at most three glossary items, only when they materially help a traveler. No Korean four-level mapping. If an official action instruction is provided separately, translate that instruction faithfully into instruction_translation_ko, keeping all conditions, prohibitions, numbers, and urgency. If none is provided, return null for instruction_translation_ko."""



def fahrenheit_values(source, us_weather=False):
    values = set()
    for match in re.finditer(
        r"(?<![\d.+~–—-])(-?\d+(?:\.\d+)?)\s*(?:°\s*F(?:ahrenheit)?|degrees?\s*(?:Fahrenheit|F)\b|화씨)",
        source,
        re.I,
    ):
        values.add(float(match.group(1)))
    if not us_weather or re.search(r"°\s*C|degrees?\s*Celsius|섭씨", source, re.I):
        return values
    for match in re.finditer(
        r"\b(?:temperatures?|temps?|heat\s+index|wind\s+chill)\s+"
        r"(?:(?:up to|down to|as high as|as low as|near|around|of|at|will be|are|reach|reaching)\s+)?"
        r"(-?\d+(?:\.\d+)?)(?![\d.:]|\s*(?:mph|percent|%|°?C\b))",
        source,
        re.I,
    ):
        value = float(match.group(1))
        if -100 <= value <= 150:
            values.add(value)
    return values


def add_celsius_equivalents(source, text, us_weather=False):
    values = fahrenheit_values(source, us_weather=us_weather)
    for value in sorted(values, key=abs, reverse=True):
        f_label = str(int(value)) if value.is_integer() else str(value)
        c = round((value - 32) * 5 / 9)
        pattern = re.compile(
            rf"(?<![\d.+~–—-]){re.escape(f_label)}\s*(?:°\s*F(?:ahrenheit)?|degrees?\s*(?:Fahrenheit|F)\b|화씨|도)(?:\s*\([^)]*°?\s*C[^)]*\))?(?!\d)",
            re.I,
        )
        def replace_temperature(match):
            prefix = text[max(0, match.start() - 12):match.start()]
            suffix = text[match.end():match.end() + 8]
            if re.search(r"(?:섭씨|Celsius)\s*$", prefix, re.I) or re.match(r"\s*(?:°?C\b|씨)", suffix, re.I):
                return match.group(0)
            return f"{f_label}°F (약 {c}°C)"
        text = pattern.sub(replace_temperature, text)
    return add_kilometers_per_hour(source, text)


def add_kilometers_per_hour(source, text):
    unit = r"(?:mph|miles?\s+per\s+hour)"
    range_pattern = re.compile(
        rf"(?<![\d.+~–—-])(\d+(?:\.\d+)?)\s*(?:-|–|—|~|to)\s*(\d+(?:\.\d+)?)\s*{unit}\b",
        re.I,
    )
    for match in re.finditer(range_pattern, source):
        low, high = float(match.group(1)), float(match.group(2))
        low_label = str(int(low)) if low.is_integer() else str(low)
        high_label = str(int(high)) if high.is_integer() else str(high)
        low_kmh, high_kmh = round(low * 1.609344), round(high * 1.609344)
        target_pattern = re.compile(
            rf"(?<![\d.+~–—-]){re.escape(low_label)}\s*(?:-|–|—|~|to|에서)\s*{re.escape(high_label)}\s*(?:mph|miles?\s*/\s*hour|miles?\s+per\s+hour|마일(?:\s*/\s*시)?)(?![A-Za-z])(?:\s*\([^)]*km/h[^)]*\))?",
            re.I,
        )
        text = target_pattern.sub(
            f"{low_label}~{high_label} mph (약 {low_kmh}~{high_kmh} km/h)", text
        )

    source_without_ranges = range_pattern.sub(" ", source)
    single_values = set()
    for match in re.finditer(rf"(?<![\d.+~–—-])(\d+(?:\.\d+)?)\s*{unit}\b", source_without_ranges, re.I):
        single_values.add(float(match.group(1)))
    for value in sorted(single_values, reverse=True):
        label = str(int(value)) if value.is_integer() else str(value)
        kmh = round(value * 1.609344)
        target_pattern = re.compile(
            rf"(?<![\d.+~–—-]){re.escape(label)}\s*(?:mph|miles?\s*/\s*hour|miles?\s+per\s+hour|마일(?:\s*/\s*시)?)(?![A-Za-z])(?:\s*\([^)]*km/h[^)]*\))?",
            re.I,
        )
        text = target_pattern.sub(f"{label} mph (약 {kmh} km/h)", text)
    return text


async def translate(text, gemini, official_instruction=None, us_weather=False):
    instruction = (
        "\n\nOfficial action instruction to translate into instruction_translation_ko:\n"
        + official_instruction
        if official_instruction
        else ""
    )
    context = " This is a confirmed U.S. NWS weather alert." if us_weather else " Do not assume Fahrenheit for a temperature with no explicit unit. Mark the unit as unspecified. "
    result = await gemini.structured(Translation, PROMPT + context, text + instruction)
    result.translation = add_celsius_equivalents(text, result.translation, us_weather=us_weather)
    result.hazard_explanation = add_celsius_equivalents(
        text, result.hazard_explanation, us_weather=us_weather
    )
    result.summary = [add_celsius_equivalents(text, item, us_weather=us_weather) for item in result.summary]
    if result.instruction_translation_ko:
        result.instruction_translation_ko = add_celsius_equivalents(
            text, result.instruction_translation_ko, us_weather=us_weather
        )
    result.translation = readable_times(result.translation)
    result.hazard_explanation = readable_times(result.hazard_explanation)
    result.summary = [readable_times(item) for item in result.summary]
    if result.instruction_translation_ko:
        result.instruction_translation_ko = readable_times(result.instruction_translation_ko)
    for item in result.glossary:
        item.meaning = readable_times(item.meaning)
    return result
