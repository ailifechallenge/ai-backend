import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {connectDevice,type Preferences} from './subscription';
import {Capacitor,type PluginListenerHandle} from '@capacitor/core';
import {App as NativeApp} from '@capacitor/app';
import {PushNotifications} from '@capacitor/push-notifications';
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {addReceived,deepLinkTarget,notificationTarget,type ReceivedAlert,type AlertTarget} from './contracts';
type MobileState={platform:string;native:boolean;configured:boolean;status:string;rows:ReceivedAlert[];enable:(code?:string,preferences?:Preferences)=>Promise<void>;clear:()=>void};
const Context=createContext<MobileState|null>(null);
export const useMobile=()=>useContext(Context);
export function MobileRuntime({children}:{children:ReactNode}){
 const native=Capacitor.isNativePlatform();const configured=import.meta.env.VITE_PUSH_READY==='true';
 const enrollment=useRef<{code:string;preferences:Preferences}|null>(null);
 const [status,setStatus]=useState('수신 준비 전');const [rows,setRows]=useState<ReceivedAlert[]>([]);
 const navigate=useNavigate();const navigateRef=useRef(navigate);navigateRef.current=navigate;const queryClient=useQueryClient();
 useEffect(()=>{
  if(!native)return;
  let disposed=false;const handles:PluginListenerHandle[]=[];
  const add=async(p:Promise<PluginListenerHandle>)=>{const h=await p;if(disposed)await h.remove();else handles.push(h);};
  const accept=(target:AlertTarget|null,open:boolean)=>{if(disposed)return;if(!target){setStatus('지원하지 않는 알림 연결입니다. 공식 정보를 직접 확인해 주십시오.');return;}setRows(old=>addReceived(old,target));if(open)navigateRef.current(target.route);};
  const setup=async()=>{
   await add(NativeApp.addListener('appUrlOpen',event=>accept(deepLinkTarget(event.url),true)));
   await add(NativeApp.addListener('appStateChange',({isActive})=>{if(isActive){void queryClient.invalidateQueries({queryKey:['japan-earthquakes']});void queryClient.invalidateQueries({queryKey:['japan-tsunami']});void queryClient.invalidateQueries({queryKey:['japan-quake']});}}));
   // A tap on a cold launch must use the same validation as an already running app.
   const launch=await NativeApp.getLaunchUrl();if(launch?.url)accept(deepLinkTarget(launch.url),true);
   if(configured){
    await add(PushNotifications.addListener('registration',async({value})=>{const request=enrollment.current;if(!request||disposed)return;enrollment.current=null;try{await connectDevice(request.code,Capacitor.getPlatform()==='ios'?'apns':'fcm',value,request.preferences);if(!disposed)setStatus('서버 구독 연결 완료 · 실제 기기 도착은 별도 확인이 필요합니다.')}catch(error){if(!disposed)setStatus(error instanceof Error?error.message:'서버 구독 연결에 실패했습니다.')}}));
    await add(PushNotifications.addListener('registrationError',()=>{if(!disposed)setStatus('기기 수신 등록에 실패했습니다. 앱 알림 설정과 연결 상태를 확인하십시오.');}));
    await add(PushNotifications.addListener('pushNotificationReceived',n=>accept(notificationTarget(n.data),false)));
    await add(PushNotifications.addListener('pushNotificationActionPerformed',n=>accept(notificationTarget(n.notification.data),true)));
   }
  };
  void setup().catch(()=>{if(!disposed)setStatus('앱 연결 초기화에 실패했습니다. 앱을 다시 열어 주십시오.');});
  return()=>{disposed=true;for(const h of handles)void h.remove();};
 },[native,configured,queryClient]);
 async function enable(code='',preferences?:Preferences){
  if(!native||!configured||!preferences)return;
  enrollment.current={code,preferences};
  try{let permission=await PushNotifications.checkPermissions();if(permission.receive==='prompt'||permission.receive==='prompt-with-rationale')permission=await PushNotifications.requestPermissions();
   if(permission.receive!=='granted'){setStatus('알림 권한이 허용되지 않았습니다. 휴대폰 설정에서 변경할 수 있습니다.');return;}
   if(Capacitor.getPlatform()==='android')await PushNotifications.createChannel({id:'official-alerts',name:'공식 재난정보 업데이트',importance:4});
   setStatus('기기 수신 등록 중…');await PushNotifications.register();
  }catch{setStatus('알림 수신 준비에 실패했습니다. 휴대폰 설정과 앱 배포 설정을 확인하십시오.');}
 }
 return <Context.Provider value={{platform:Capacitor.getPlatform(),native,configured,status,rows,enable,clear:()=>setRows([])}}>{children}</Context.Provider>;
}
