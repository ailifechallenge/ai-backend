import {useEffect,useState} from 'react'
import {Capacitor} from '@capacitor/core'
import {BrandMark} from './BrandMark'

export const LAUNCH_VISIBLE_MS=1300
export function NativeLaunchScreen(){
 const [visible,setVisible]=useState(()=>Capacitor.isNativePlatform())
 useEffect(()=>{
  if(!visible)return
  let timer:ReturnType<typeof setTimeout>|undefined
  // Start the minimum duration after the browser has had an opportunity to paint.
  const frame=requestAnimationFrame(()=>{timer=setTimeout(()=>setVisible(false),LAUNCH_VISIBLE_MS)})
  return()=>{cancelAnimationFrame(frame);clearTimeout(timer)}
 },[visible])
 if(!visible)return null
 return <div className="native-launch-screen" role="status" aria-label="ActionGuard 시작 중"><BrandMark/><strong>ActionGuard</strong><span>여행 중에도, 안전하게</span></div>
}
