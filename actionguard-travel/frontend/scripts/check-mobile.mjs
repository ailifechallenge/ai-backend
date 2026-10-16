import {loadEnv} from 'vite';
const env=loadEnv('mobile',process.cwd(),'VITE_');
try{
 const url=new URL(env.VITE_API_BASE_URL||'');
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.hostname.endsWith('.example'))throw new Error();
}catch{
 console.error('앱 서버 주소가 필요합니다. .env.mobile.local의 VITE_API_BASE_URL에 실제 배포한 HTTPS 서버 주소를 설정하세요.');
 process.exit(1);
}
