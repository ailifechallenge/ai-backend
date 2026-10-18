import {it,expect} from 'vitest'
import {fireEvent,render,screen} from '@testing-library/react'
import {Workspace,useWorkspace} from './workspace'
import {JOURNEY_KEY} from './workspace-storage'
function Subject(){const ws=useWorkspace();return <><p>{ws.place?.name??'no place'}</p><p>{ws.stay?.name??'no stay'}</p><button onClick={()=>ws.setPlace({name:'New York',country:'US',lat:40.7,lon:-74})}>New location</button><button onClick={ws.clearJourney}>Forget</button></>}
it('rehydrates a saved itinerary and keeps it when the lookup location changes',()=>{
 const stay={name:'Tokyo hotel',country:'JP',latitude:35.68,longitude:139.76,municipality:null,timezone:'Asia/Tokyo',start:'2026-10-17T15:00',end:'2026-10-18T10:00'}
 localStorage.setItem(JOURNEY_KEY,JSON.stringify({version:1,place:{name:'Tokyo',country:'JP',lat:35.68,lon:139.76},stay}))
 const first=render(<Workspace><Subject/></Workspace>);expect(screen.getByText('Tokyo hotel')).toBeVisible()
 fireEvent.click(screen.getByText('New location'));expect(screen.getByText('Tokyo hotel')).toBeVisible();first.unmount()
 render(<Workspace><Subject/></Workspace>);expect(screen.getByText('New York')).toBeVisible();expect(screen.getByText('Tokyo hotel')).toBeVisible()
 fireEvent.click(screen.getByText('Forget'));expect(localStorage.getItem(JOURNEY_KEY)).toBeNull()
})

function AlertChange(){const ws=useWorkspace();return <><button onClick={()=>{ws.update('old text',{id:'nws:old',text:'old text',event:'Heat Advisory'} as never)}}>Select heat</button><button onClick={()=>ws.setTranslation({translation:'OLD',summary:[],glossary:[]} as never)}>Translate</button><button onClick={()=>ws.setPlace({name:'Tokyo',country:'JP',lat:35.68,lon:139.76})}>Tokyo</button><span>{ws.alert?.event??'no alert'}</span><span>{ws.translation?.translation??'no translation'}</span><span>{ws.text||'no text'}</span></>}
it('clears a US selected alert, translation and source when switching to a Japanese point',()=>{render(<Workspace><AlertChange/></Workspace>);fireEvent.click(screen.getByText('Select heat'));fireEvent.click(screen.getByText('Translate'));expect(screen.getByText('Heat Advisory')).toBeVisible();fireEvent.click(screen.getByText('Tokyo'));expect(screen.getByText('no alert')).toBeVisible();expect(screen.getByText('no translation')).toBeVisible();expect(screen.getByText('no text')).toBeVisible()})
let obsoleteRevision=0
function DelayedAssessment(){const ws=useWorkspace();return <><button onClick={()=>{ws.update('Heat Advisory',{id:'nws:old',text:'Heat Advisory'} as never)}}>Old source</button><button onClick={()=>{obsoleteRevision=ws.revision}}>Start assessment</button><button onClick={()=>ws.setPlace({name:'Tokyo',country:'JP',lat:35.68,lon:139.76})}>Move</button><button onClick={()=>{ws.setUrgency({level:2} as never,obsoleteRevision);ws.setTranslation({translation:'late old result'} as never,obsoleteRevision)}}>Finish old request</button><span>{ws.urgency?'old urgency':'no urgency'}</span><span>{ws.translation?.translation??'no late translation'}</span></>}
it('rejects a late response assessment and translation after the lookup point changes',()=>{render(<Workspace><DelayedAssessment/></Workspace>);fireEvent.click(screen.getByText('Old source'));fireEvent.click(screen.getByText('Start assessment'));fireEvent.click(screen.getByText('Move'));fireEvent.click(screen.getByText('Finish old request'));expect(screen.getByText('no urgency')).toBeVisible();expect(screen.getByText('no late translation')).toBeVisible()})
it('drops a legacy lookup from another country at startup while retaining the saved itinerary',()=>{
 const stay={name:'US hotel',country:'US',latitude:34,longitude:-118,municipality:null,timezone:'America/Los_Angeles',start:'2026-10-17T15:00',end:'2026-10-18T10:00'};localStorage.setItem('ag-country','JP');localStorage.setItem(JOURNEY_KEY,JSON.stringify({version:1,place:{name:'LA',country:'US',lat:34,lon:-118},stay}));render(<Workspace><Subject/></Workspace>);expect(screen.getByText('no place')).toBeVisible();expect(screen.getByText('US hotel')).toBeVisible();
})
