export interface Alert {
  id: string;
  event: string;
  headline: string;
  area: string;
  severity: string;
  sender: string;
  sent: string | null;
  effective: string | null;
  expires: string | null;
  onset?: string | null;
  ends?: string | null;
  instruction: string;
  source: string;
  text: string;
  checked_at: string;
}
export interface Translation {
  translation: string;
  hazard_explanation: string;
  glossary: { term: string; meaning: string }[];
  summary: string[];
  instruction_translation_ko?: string | null;
}
export interface Fact {
  kind: string;
  value: string;
  quote: string;
}
export interface Issue {
  field?: string;
  kind: string;
  severity: string;
  source_quote: string | null;
  translation_quote: string | null;
  reason: string;
  method: string;
}
export interface Verification {
  checked_fields?: string[];
  status: string;
  issues: Issue[];
  unresolved: string[];
  source_facts: Fact[];
  translated_facts: Fact[];
  official_fields: Record<string, string>;
  checks: string[];
}
export interface Guidance {
  cards: {
    title: string;
    text: string;
    category: string;
    agency: string;
    url: string;
    condition: string;
    checked_at: string;
  }[];
  provenance: string;
  limitations: string[];
}
