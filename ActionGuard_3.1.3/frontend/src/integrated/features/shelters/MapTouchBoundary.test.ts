import {afterEach,expect,it,vi} from 'vitest';
import {point} from 'leaflet';
import type {Map} from 'leaflet';
import {installMapTouchBoundary} from './MapTouchBoundary';

let remove:()=>void=()=>{};
afterEach(()=>{remove();document.body.replaceChildren();vi.unstubAllGlobals();});
function setup(){
 const container=document.createElement('div'),tile=document.createElement('div'),outside=document.createElement('div');
 container.append(tile);document.body.append(container,outside);
 container.getBoundingClientRect=()=>({left:0,top:0,right:200,bottom:200,width:200,height:200} as DOMRect);
 let zoom=10;
 const map={getContainer:()=>container,options:{zoomSnap:1},touchZoom:{enabled:()=>false,disable:vi.fn()},
  dragging:{enabled:()=>true,disable:vi.fn(),enable:vi.fn()},getZoom:()=>zoom,getMinZoom:()=>1,getMaxZoom:()=>20,
  mouseEventToContainerPoint:(t:Touch)=>point(t.clientX,t.clientY),containerPointToLatLng:(p:{x:number;y:number})=>({lat:p.y,lng:p.x}),
  getScaleZoom:(scale:number,start:number)=>start+Math.log2(scale),getSize:()=>point(200,200),
  project:(p:{lng:number;lat:number})=>point(p.lng,p.lat),unproject:(p:{x:number;y:number})=>({lat:p.y,lng:p.x}),
  setView:vi.fn((_center:unknown,z:number)=>{zoom=z;}),setZoom:vi.fn((z:number)=>{zoom=z;})};
 vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>{cb(0);return 1;});
 vi.stubGlobal('cancelAnimationFrame',vi.fn());
 remove=installMapTouchBoundary(map as unknown as Map);
 const touch=(id:number,x:number,y:number,target:EventTarget=tile)=>({identifier:id,clientX:x,clientY:y,target} as Touch);
 function send(type:string,touches:Touch[],target:EventTarget=container){
  const event=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(event,'touches',{value:touches});target.dispatchEvent(event);return event;
 }
 return {map,container,tile,outside,touch,send};
}
it('zooms when both contacts start and move inside the map',()=>{
 const {map,touch,send}=setup();
 send('touchstart',[touch(1,50,100),touch(2,100,100)]);
 const move=send('touchmove',[touch(1,25,100),touch(2,125,100)],document);
 expect(map.setView).toHaveBeenCalledWith(expect.anything(),11,{animate:false});
 expect(move.defaultPrevented).toBe(true);
 send('touchend',[],document);expect(map.dragging.enable).toHaveBeenCalled();
 expect(map.options.zoomSnap).toBe(1);
});
it('rejects a contact outside the map even when the second touch begins inside',()=>{
 const {map,outside,touch,send}=setup();
 send('touchstart',[touch(1,230,100,outside),touch(2,80,100)]);
 send('touchmove',[touch(1,260,100,outside),touch(2,50,100)],document);
 expect(map.setView).not.toHaveBeenCalled();expect(map.dragging.disable).not.toHaveBeenCalled();
});
it('stops the pinch at the boundary and cannot restart until all fingers lift',()=>{
 const {map,touch,send}=setup();
 send('touchstart',[touch(1,50,100),touch(2,100,100)]);
 send('touchmove',[touch(1,20,100),touch(2,220,100)],document);
 send('touchstart',[touch(1,20,100),touch(2,180,100)]);
 send('touchmove',[touch(1,10,100),touch(2,190,100)],document);
 expect(map.setView).not.toHaveBeenCalled();expect(map.options.zoomSnap).toBe(1);
 send('touchend',[],document);
 send('touchstart',[touch(3,50,100),touch(4,100,100)]);
 send('touchmove',[touch(3,25,100),touch(4,125,100)],document);
 expect(map.setView).toHaveBeenCalled();
});
it('does not treat zoom controls as a pinch surface',()=>{
 const {container,map,touch,send}=setup();const control=document.createElement('a');control.className='leaflet-control';container.append(control);
 send('touchstart',[touch(1,40,40,control),touch(2,100,100)]);
 expect(map.dragging.disable).not.toHaveBeenCalled();
});
