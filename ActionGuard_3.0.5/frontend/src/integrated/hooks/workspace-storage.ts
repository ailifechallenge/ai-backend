import US_ZONES from '../features/places/us-timezones.json'
import type {JourneyPlace,Stay} from './journey'
import {inJapanCoverage,inUSCoverage} from '../features/shelters/coverage'
export const JOURNEY_KEY='actionguard-journey-v1'
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
function validPlace(v:unknown):v is JourneyPlace{
 if(!object(v)||typeof v.name!=='string'||!v.name.trim()||v.name.length>120||!['US','JP'].includes(String(v.country))||typeof v.lat!=='number'||typeof v.lon!=='number'||!Number.isFinite(v.lat)||!Number.isFinite(v.lon))return false
 return (v.country==='JP'?inJapanCoverage:inUSCoverage)({lat:v.lat,lon:v.lon})
}
function validStay(v:unknown):v is Stay{
 if(!object(v)||typeof v.name!=='string'||!v.name.trim()||v.name.length>120||!['US','JP'].includes(String(v.country))||typeof v.timezone!=='string'||typeof v.start!=='string'||typeof v.end!=='string'||v.start.length>32||v.end.length>32||!Number.isFinite(Date.parse(v.start))||!Number.isFinite(Date.parse(v.end))||v.end<=v.start)return false
 try{new Intl.DateTimeFormat('en',{timeZone:v.timezone})}catch{return false}
 if(v.country==='JP'?v.timezone!=='Asia/Tokyo':!US_ZONES.includes(v.timezone))return false
 if(v.latitude===null&&v.longitude===null)return typeof v.municipality==='string'&&v.municipality.length>0&&v.municipality.length<120
 return validPlace({name:v.name,country:v.country,lat:v.latitude,lon:v.longitude})
}
export function readJourney():{place:JourneyPlace|null;stay:Stay|null}{
 try{const raw=localStorage.getItem(JOURNEY_KEY);if(!raw||raw.length>16000)return {place:null,stay:null};const data:unknown=JSON.parse(raw);if(!object(data)||data.version!==1)return {place:null,stay:null};return {place:validPlace(data.place)?data.place:null,stay:validStay(data.stay)?data.stay:null}}catch{return {place:null,stay:null}}
}
export function writeJourney(place:JourneyPlace|null,stay:Stay|null){
 try{if(!place&&!stay)localStorage.removeItem(JOURNEY_KEY);else localStorage.setItem(JOURNEY_KEY,JSON.stringify({version:1,place,stay}));return true}catch{return false}
}
