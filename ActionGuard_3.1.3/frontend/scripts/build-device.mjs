// Explicit same-Wi-Fi development profile. Production build:mobile still requires HTTPS.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const address=process.argv[2];let url;
try{url=new URL(address);if(url.protocol!=='http:'||!url.hostname.endsWith('.local')||url.pathname!=='/'||url.username||url.password||url.search||url.hash)throw Error()}catch{console.error('사용법: npm run mobile:device -- http://Mac이름.local:8004');process.exit(1)}
const env={...process.env,VITE_API_BASE_URL:url.origin,VITE_PUSH_READY:'false'};
const run=(command,args)=>{const result=spawnSync(command,args,{stdio:'inherit',env});if(result.status!==0)process.exit(result.status??1)};
const original=readFileSync('ios/App/App/Info.plist','utf8');const end=original.lastIndexOf('</dict>');
const local='<key>NSAppTransportSecurity</key><dict><key>NSAllowsLocalNetworking</key><true/></dict><key>NSLocalNetworkUsageDescription</key><string>테스트 중 같은 Wi-Fi의 Mac 분석 서버에 연결합니다.</string>';
writeFileSync('ios/App/App/Info.Device.plist',original.slice(0,end)+local+'\n'+original.slice(end));
run('npm',['run','sync:styles']);run('npx',['tsc','--noEmit']);run('npx',['vite','build','--mode','device']);run('npx',['cap','sync','ios']);
console.log('아이폰 테스트 자산 준비 완료: '+url.origin+' · Xcode에서 Debug/아이폰 선택 후 실행하세요.');
