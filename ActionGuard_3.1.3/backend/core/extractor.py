from backend.models.contracts import Facts, Judgment
import json, asyncio

PROMPT = """Independently extract ALL material facts from this document: hazard, area, issued_time, message_expiration, start_time, end_time, level, audience, required_action, recommended_action, prohibition, number_unit, negation, condition. Each quote MUST be an exact contiguous substring. value is a normalized Korean explanation preserving original names, units and timezones. Do not infer absent facts. issued_time is publication/report time; start_time is actual event onset; end_time is event end; message_expiration is metadata expiration, NOT event end. Preserve these roles. Never translate or normalize quote: copy it exactly from this document; only value may be normalized. Distinguish must from should. Empty facts only for no factual content. For temperatures in U.S. weather alerts, preserve the Fahrenheit value and accept its correctly converted Celsius equivalent in parentheses as the same fact; for wind speed, accept a correctly converted km/h value alongside mph. Do not flag correct equivalent conversions as added or changed numbers. Check conversion arithmetic if present."""


async def extract_compare(source, target, gemini, displayed=None):
    sf = await gemini.structured(Facts, PROMPT, source)
    tf = await gemini.structured(Facts, PROMPT, target)
    judge = await gemini.structured(
        Judgment,
        """Compare original and Korean translation DIRECTLY as a bilingual emergency-alert reviewer. Detect omitted/added actions, must/should changes, negation reversals, conditions, locations, times, units. Compare dates, times, and time zones by their role and context, not by comparing unordered lists of every time in a message; alerts may repeat effective/expiration times. Treat an accurate Fahrenheit-to-Celsius conversion and mph-to-km/h conversion as equivalent, but flag incorrect conversion arithmetic or changed source values. Use actual short contiguous evidence quotations; omission has translation_quote=null; unsupported addition may have source_quote=null and must have target quote. Use critical only for a clearly material, evidence-supported meaning change; use minor for possible nonmaterial errors. Report genuine ambiguity in unresolved. Also review every displayed field against the original. Set issue.field to the exact field containing the error (translation, summary, hazard_explanation, instruction_translation_ko, glossary). Summary and explanation may omit details: only flag contradictions or unsupported factual/action claims, not ordinary summarization. For other fields likewise distinguish legitimate explanations from invented alert facts. Quote translation_quote from that field only. Do not certify safety. method='ai'.""",
        json.dumps(
            {
                "original": source,
                "translation": target,
                "displayed": displayed or {},
                "original_facts": sf.model_dump(),
                "translation_facts": tf.model_dump(),
            },
            ensure_ascii=False,
        ),
    )
    return sf, tf, judge
