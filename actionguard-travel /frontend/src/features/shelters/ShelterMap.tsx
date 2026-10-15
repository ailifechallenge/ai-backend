import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, Polyline, ScaleControl, useMap, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Origin, Shelter, WalkingRoute } from './types';
const markerStyles = {
  school: { color: '#2563eb', icon: '🏫' },
  assembly: { color: '#0e7490', icon: '▣' },
  safe_room: { color: '#7c3aed', icon: '🛡️' },
  community: { color: '#16805d', icon: '🏛️' },
  religious: { color: '#b45309', icon: '✦' },
  temporary: { color: '#ea7a18', icon: '▱' },
  evacuation_center: { color: '#ea7a18', icon: '📍' },
  lodging: { color: '#be185d', icon: '▤' },
  camp: { color: '#a16207', icon: '△' },
  warehouse: { color: '#475569', icon: '▦' },
  other: { color: '#64748b', icon: '●' },
} as const;
function shelterIcon(type: Shelter['shelter_type'], selected: boolean, registered = false) {
  const style = markerStyles[type] || markerStyles.other;
  return divIcon({
    className: 'shelter-div-icon',
    html: `<span class="shelter-marker${selected ? ' selected' : ''}${registered ? ' registered-marker' : ''}" style="--marker-color:${style.color}">${style.icon}</span>`,
    iconSize: [26, 26], iconAnchor: [13, 13], tooltipAnchor: [0, -18],
  });
}
function View({ origin, shelters, route }: {origin: Origin | null; shelters: Shelter[]; route: WalkingRoute | null}) {
  const map = useMap();
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => {
    if (!origin) return;
    // During navigation, distant shelter pins must not zoom the route out.
    const destination = route && shelters.find(s => s.id === route.shelter_id);
    const points: [number, number][] = route
      ? [[origin.lat, origin.lon], ...route.coordinates.map(p => [p[1], p[0]] as [number, number]), ...(destination ? [[destination.lat, destination.lon] as [number, number]] : [])]
      : [[origin.lat, origin.lon], ...shelters.map(s => [s.lat, s.lon] as [number, number])];
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: route ? 18 : 15 });
    else map.setView([origin.lat, origin.lon], 13);
  }, [origin, shelters, route, map]);
  return null;
}
function Click({ choose }: {choose: (origin: Origin) => void}) {
  useMapEvents({click: e => choose({ lat: Number(e.latlng.lat.toFixed(6)), lon: Number(e.latlng.lng.toFixed(6)) })});
  return null;
}
export default function ShelterMap({ origin, shelters, selected, route, onSelect, onOrigin }: {
  origin: Origin | null; shelters: Shelter[]; selected: string; route: WalkingRoute | null;
  disaster: string;
  onSelect: (id: string) => void; onOrigin: (p: Origin) => void;
}) {
  return <MapContainer center={[39.5, -98.35]} zoom={4} className="shelter-map" aria-label="공식 대피소 지도">
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
    <ScaleControl position="bottomleft" metric imperial={false}/>
    <Click choose={onOrigin} /><View origin={origin} shelters={shelters} route={route} />
    {origin && <CircleMarker center={[origin.lat, origin.lon]} radius={9} pathOptions={{color: '#fff', fillColor:'#2265cc', fillOpacity:1, weight:3}}><Tooltip>검색 출발지</Tooltip></CircleMarker>}
    {shelters.map((s, i) => <Marker key={s.id} position={[s.lat,s.lon]} title={s.name} alt={s.type_label + ' · ' + s.name} icon={shelterIcon(s.shelter_type, s.id === selected, s.status === 'registered')} eventHandlers={{click: e => { e.originalEvent.stopPropagation(); onSelect(s.id); }}} bubblingMouseEvents={false}><Tooltip>{i + 1}. {s.name}<br/>건물: {s.type_label}<br/>역할: {s.role_label || '공식 대피 시설'}<br/>{s.status_label}</Tooltip></Marker>)}
    {route && <><Polyline positions={route.coordinates.map(p => [p[1],p[0]] as [number,number])} interactive={false} pathOptions={{color:'#fff', weight:9, opacity:.95}}/><Polyline positions={route.coordinates.map(p => [p[1],p[0]] as [number,number])} bubblingMouseEvents={false} eventHandlers={{click:e=>e.originalEvent.stopPropagation()}} pathOptions={{color:'#2563eb', weight:5, opacity:1}}><Tooltip sticky>도보 {Math.round(route.distance_m)}m · 약 {Math.ceil(route.duration_s/60)}분</Tooltip></Polyline></>}
  </MapContainer>;
}
