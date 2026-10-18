import {useEffect} from 'react';
import {useMap} from 'react-leaflet';
import type {Map as LeafletMap, LatLng} from 'leaflet';

/** Only pinch contacts that both start and remain inside this map. */
export function installMapTouchBoundary(map:LeafletMap){
 const container=map.getContainer();
 const owner=container.ownerDocument;
 const nativeZoom=map.touchZoom?.enabled()??false;
 map.touchZoom?.disable();
 container.classList.add('leaflet-touch-zoom');
 let pinch:{ids:number[];distance:number;zoom:number;anchor:LatLng;snap:number|undefined;drag:boolean}|null=null;
 let blocked=false,frame:number|null=null;
 const inside=(t:Touch)=>{
  const box=container.getBoundingClientRect();
  return t.target instanceof Node&&container.contains(t.target)&&
   !(t.target instanceof Element&&t.target.closest('.leaflet-control'))&&
   t.clientX>=box.left&&t.clientX<box.right&&t.clientY>=box.top&&t.clientY<box.bottom;
 };
 const midpoint=(a:Touch,b:Touch)=>map.mouseEventToContainerPoint(a as unknown as MouseEvent)
  .add(map.mouseEventToContainerPoint(b as unknown as MouseEvent)).divideBy(2);
 const distance=(a:Touch,b:Touch)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
 function finish(){
  if(frame!==null){cancelAnimationFrame(frame);frame=null;}
  if(!pinch)return;
  const previous=pinch;pinch=null;
  map.options.zoomSnap=previous.snap;
  const snap=previous.snap||1;
  map.setZoom(Math.round(map.getZoom()/snap)*snap,{animate:false});
  if(previous.drag)map.dragging.enable();
 }
 function start(e:TouchEvent){
  if(e.touches.length>2){blocked=true;finish();return;}
  if(blocked||pinch||e.touches.length!==2)return;
  const [a,b]=Array.from(e.touches);
  if(!inside(a)||!inside(b)){blocked=true;return;}
  const span=distance(a,b);if(span<1)return;
  pinch={ids:[a.identifier,b.identifier],distance:span,zoom:map.getZoom(),
   anchor:map.containerPointToLatLng(midpoint(a,b)),snap:map.options.zoomSnap,drag:map.dragging.enabled()};
  map.options.zoomSnap=0;
  map.dragging.disable();
  if(e.cancelable)e.preventDefault();
 }
 function move(e:TouchEvent){
  if(!pinch)return;
  const touches=Array.from(e.touches);
  if(touches.length!==2||!touches.every(t=>pinch!.ids.includes(t.identifier)&&inside(t))){
   blocked=true;finish();return;
  }
  const [a,b]=touches,gesture=pinch;
  const zoom=Math.max(map.getMinZoom(),Math.min(map.getMaxZoom(),map.getScaleZoom(distance(a,b)/gesture.distance,gesture.zoom)));
  const center=map.unproject(map.project(gesture.anchor,zoom).subtract(midpoint(a,b).subtract(map.getSize().divideBy(2))),zoom);
  if(frame!==null)cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{frame=null;if(pinch===gesture)map.setView(center,zoom,{animate:false});});
  if(e.cancelable)e.preventDefault();
 }
 function end(e:TouchEvent){finish();if(!e.touches.length)blocked=false;else blocked=true;}
 container.addEventListener('touchstart',start,{passive:false});
 owner.addEventListener('touchmove',move,{passive:false});
 owner.addEventListener('touchend',end);
 owner.addEventListener('touchcancel',end);
 return ()=>{
  finish();container.removeEventListener('touchstart',start);
  owner.removeEventListener('touchmove',move);owner.removeEventListener('touchend',end);owner.removeEventListener('touchcancel',end);
  container.classList.remove('leaflet-touch-zoom');if(nativeZoom)map.touchZoom.enable();
 };
}

export default function MapTouchBoundary(){
 const map=useMap();
 useEffect(()=>installMapTouchBoundary(map),[map]);
 return null;
}
