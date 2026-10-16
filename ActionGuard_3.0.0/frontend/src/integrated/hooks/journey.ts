export type JourneyPlace = { name: string; country: 'US'|'JP'; lat: number; lon: number };
export type Stay = { name: string; country: 'US'|'JP'; latitude: number|null; longitude: number|null; municipality: string|null; timezone: string; start: string; end: string };
export const disasterLabels:Record<string,string>={general:'일반 피난·체류 시설',hurricane:'허리케인·해안폭풍',tornado:'토네이도',flood:'홍수',wildfire:'산불',landslide:'산사태',storm_surge:'폭풍해일',earthquake:'지진',tsunami:'쓰나미',fire:'대규모 화재',inland_flood:'내수 범람',volcano:'화산'};
export const disastersFor=(country:string)=>country==='JP'?['general','flood','landslide','storm_surge','earthquake','tsunami','fire','inland_flood','volcano']:['general','hurricane','tornado','flood','wildfire'];
