export type Origin = { lat: number; lon: number };
export type Lodging = Origin & { name: string };
export type Shelter = Origin & {
  country?: "US"|"JP"; facility_kind?:string; supported_hazards?:string[]; hazard_compatibility?:string; remarks?:string;
  id: string; name: string; address: string; status: 'open' | 'planned' | 'registered'; status_label: string;
  shelter_type: 'school' | 'assembly' | 'safe_room' | 'community' | 'religious' | 'temporary' | 'evacuation_center' | 'lodging' | 'camp' | 'warehouse' | 'other';
  type_label: string; incident_name: string | null;
  navigable?: boolean; operating_status?: string | null; role_label?: string; classification_source?: string | null;
  distance_m: number; bearing_deg: number; direction: string;
  wheelchair_accessible: string; pets: string; source: string;
  checked_at: string; source_updated_at: string | null;
};
export type SearchResult = {
  origin: Origin; radius_km: number; country?: "US"|"JP"; disaster: string; shelters: Shelter[]; checked_at: string;
  source: string; sources: string[]; warnings: string[]; truncated: boolean; note: string;
  pending_review?: {name:string; address:string; google_search_url:string}[];
  excluded_count?: number; building_search_enabled?: boolean;
};
export type WalkingRoute = {
  shelter_id: string; origin: Origin; distance_m: number; duration_s: number;
  coordinates: number[][]; steps: { instruction: string; distance_m: number; coordinates?: number[][] }[];
  checked_at: string; source: string; attribution: string; note: string;
  routing_criterion?: string; alternatives_evaluated?: number;
};
export type Snapshot = {
  version: 1; saved_at: string; origin_label: string;
  result: SearchResult; selected_id: string; route: WalkingRoute | null;
};
export function distance(m: number) { return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(2)}km`; }
export function timestamp(value: string) { return new Date(value).toLocaleString('ko-KR', { timeZoneName: 'short' }); }
