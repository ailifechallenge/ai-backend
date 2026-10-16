/** Progressive disclosure of the exact source text; never generates a shorter directive. */
export function AlertRegion({area,collapsed=false}:{area:string;collapsed?:boolean}){
 const parts=area.split(/;|、/).map(s=>s.trim()).filter(Boolean)
 if(!collapsed&&area.length<75)return <p className="alert-region-short">{area}</p>
 return <details className="alert-region"><summary>{collapsed&&parts.length===1?'경보 적용 지역 보기':`적용 지역 ${parts.length>1?`${parts.length}곳`:'확인'} · 전체 보기`}</summary><ul>{parts.map((part,i)=><li key={i}>{part}</li>)}</ul></details>
}
export function InstructionPreview({text}:{text:string}){
 const paragraphs=text.split(/\n+/).filter(Boolean)
 if(text.length<180)return <p className="instruction-text">{text}</p>
 return <details className="instruction-disclosure"><summary><span className="instruction-excerpt">{text}</span><span className="instruction-open">일부 미리보기 · 행동지침 전체 펼치기</span></summary><div className="instruction-full">{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div></details>
}
