import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {api} from '../services/api';
import {useWorkspace} from '../hooks/workspace';
import {formatTime} from '../features/seismic/model';
import './JapanDisasters.css';
import {japaneseAreaLabel} from '../features/regions/labels';
type Row={id:string;event:string;area:string;sent:string;expires:string|null;status:string;instruction:string;text?:string;source:string};
type Snapshot={rows:Record<string,Row>;checked_at:string;reported_at?:string;country:string;area_name?:string};
export default function WeatherAlert(){
 const [params]=useSearchParams();const scope=params.get('scope')??'';const event=params.get('event');const valid=/^(?:US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}|JP:[0-9]{6}:[0-9]{7})$/.test(scope);
 const ws=useWorkspace();const navigate=useNavigate();
 const result=useQuery({queryKey:['push-weather',scope],queryFn:()=>api<Snapshot>('push/weather?'+new URLSearchParams({scope})),enabled:valid,retry:false,refetchInterval:60000});
 const rows=Object.values(result.data?.rows??{});const current=rows.filter(r=>r.status==='active'&&(!r.expires||Date.parse(r.expires)>Date.now()));
 function translate(row:Row){ws.update(row.text??`気象庁 発表: ${row.event}\n対象地域: ${row.area}\n発表時刻（開始時刻ではありません）: ${row.sent}\n開始・終了時刻: 記載なし。公式の個別行動指示は含まれていません。`);ws.setMessageCountry(scope.startsWith('JP:')?'JP':'US');navigate('/');}
 return <div className="seismic-page"><Link className="seismic-back" to="/notifications">← 알림으로</Link><div className="seismic-heading"><span>{scope.startsWith('US:')?'미국 NWS':'일본 기상청'} · 공식 발표</span><h1>등록 지역의<br/>최신 경보를 확인해요</h1><p>이전 알림보다 지금 조회한 공식 상태를 먼저 확인하세요.</p></div>
 {!valid?<p role="alert">알림의 지역 정보가 올바르지 않아요.</p>:<section className="seismic-card"><div className="seismic-title"><h2>{result.data?.country==='JP'?japaneseAreaLabel(result.data.area_name??''):result.data?.area_name??scope.split(':').at(-1)} 지역</h2><button onClick={()=>void result.refetch()}>다시 확인</button></div>{result.isPending?<p role="status">공식 경보를 확인하고 있어요…</p>:result.isError?<p role="alert">최신 상태를 확인하지 못했어요. 해제된 것으로 판단하지 마세요. 잠시 후 다시 확인해 주세요.</p>:<><p className="seismic-muted">조회 {formatTime(result.data!.checked_at)}</p>{event&&!rows.some(r=>r.id===event)&&<p className="seismic-nearby">알림 당시 발표가 현재 목록에 없거나 갱신되었어요. 이것만으로 공식 해제를 판단할 수 없어요.</p>}{current.length?current.map(row=><article className="seismic-card" key={row.id}><h3>{row.event}</h3><p>{scope.startsWith('JP:')?japaneseAreaLabel(row.area):row.area} · 발표 {formatTime(row.sent)}</p>{row.expires&&<p>메시지 유효시간 {formatTime(row.expires)}</p>}<button onClick={()=>translate(row)}>한국어로 이해하기</button><details><summary>공식 원문</summary><p style={{whiteSpace:'pre-wrap'}}>{row.text??row.event}</p></details></article>):<p>이번 조회에서 유효한 기상경보가 표시되지 않았어요. 지진·쓰나미 정보와 현지 당국 안내는 별도로 확인해 주세요.</p>}{rows.some(r=>r.status==='cleared')&&<p>공식 취소 발표가 있는 경보가 있어요. 다른 경보와 현지 안내도 확인하세요.</p>}</>}
 <a href={scope.startsWith('US:')?'https://www.weather.gov/':'https://www.jma.go.jp/bosai/map.html?area_type=japan'} target="_blank" rel="noreferrer">공식 기상기관 확인 ↗</a></section>}</div>;
}
