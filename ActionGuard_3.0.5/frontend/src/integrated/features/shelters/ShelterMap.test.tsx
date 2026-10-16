import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ShelterMap from './ShelterMap';
import type { Shelter, WalkingRoute } from './types';
const map = vi.hoisted(()=>({fitBounds:vi.fn(),setView:vi.fn(),invalidateSize:vi.fn(),getContainer:vi.fn(()=>document.createElement('div'))}));
vi.mock('leaflet',()=>({divIcon:vi.fn(x=>x)}));
vi.mock('react-leaflet',()=>{
 const children=({children}:{children?:ReactNode})=><div>{children}</div>;
 return {MapContainer:children,TileLayer:()=>null,CircleMarker:children,Marker:children,Tooltip:children,Polyline:children,ScaleControl:()=>null,useMap:()=>map,useMapEvents:()=>null};
});
describe('walking map view',()=>{
 it('keeps the road route visible even with a distant shelter in the result list',()=>{
  const row: Shelter={id:'1',name:'School',address:'Test',lat:40.723,lon:-73.852,status:'planned',status_label:'개방 확인 필요',shelter_type:'school',type_label:'학교·교육시설',role_label:'허리케인 대피 접수센터',incident_name:null,distance_m:100,bearing_deg:90,direction:'동',wheelchair_accessible:'미확인',pets:'미확인',source:'https://example.gov',checked_at:'2026-10-14T00:00:00Z',source_updated_at:null};
  const route: WalkingRoute={shelter_id:'1',origin:{lat:40.722,lon:-73.853},distance_m:180,duration_s:140,coordinates:[[-73.853,40.722],[-73.8525,40.7222],[-73.852,40.723]],steps:[],checked_at:row.checked_at,source:row.source,attribution:'OSM',note:'일반 보행 경로'};
  render(<ShelterMap origin={route.origin} shelters={[row,{...row,id:'2',lat:40.5,lon:-74.1}]} selected="1" route={route} disaster="hurricane" onSelect={()=>{}} onOrigin={()=>{}}/>);
  const points=map.fitBounds.mock.calls.at(-1)![0];
  expect(points).toContainEqual([40.7222,-73.8525]);
  expect(points).not.toContainEqual([40.5,-74.1]);
  expect(screen.getAllByText(/건물: 학교·교육시설/)[0]).toBeInTheDocument();
  expect(screen.getByText(/도보 180m/)).toBeInTheDocument();
 });
});
