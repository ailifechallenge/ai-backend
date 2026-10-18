"""Bounded live evaluation. Run from project root: python -m evaluation.run ..."""
import argparse, asyncio, hashlib, json, os
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from backend.core.gemini import Gemini
from backend.core.translator import translate
from backend.core.extractor import extract_compare
from backend.core.verification import assess
from backend.core.guidance import guidance

ROOT = Path(__file__).resolve().parents[1]

def displayed(t):
    return dict(summary='\n'.join(t.summary), hazard_explanation=t.hazard_explanation,
        instruction_translation_ko=t.instruction_translation_ko or '',
        glossary='\n'.join(f'{g.term}: {g.meaning}' for g in t.glossary))

async def evaluate(args):
    load_dotenv(args.env, override=True)
    path = ROOT / 'evaluation/cases.json'
    cases = json.loads(path.read_text())
    selected = [c for c in cases if c['id'] in args.ids.split(',')]
    if len(selected) != len(set(args.ids.split(','))):
        raise ValueError('Unknown/duplicate selection')
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    if (output/'results.jsonl').exists():
        raise ValueError('Use a fresh output directory to preserve earlier evidence')
    metadata = {'started_at':datetime.now(timezone.utc).isoformat(),'model':os.getenv('GEMINI_MODEL','gemini-3.5-flash-lite'),
        'dataset_sha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'selected':[c['id'] for c in selected],
        'repeats':args.repeat,'max_calls':args.max_calls,
        'code_sha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT/'backend').rglob('*.py'))}, 'release_decision':'HOLD: independent review and coverage required',
        'summary_error_rate':None,'semantic_verification_miss_rate':None}
    (output/'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
    if not os.getenv('GEMINI_API_KEY') or os.getenv('GEMINI_FREE_TIER_CONFIRMED') != 'true':
        metadata['blocked']='Missing server key/free-tier confirmation'
        (output/'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)); return
    gemini=Gemini()
    completed=0
    stage='not_started'
    current=None
    partial={}
    try:
        for repeat in range(args.repeat):
            for case in selected:
                needed=4+(3 if repeat==0 and case.get('mutation') and not args.skip_mutations else 0)
                if gemini.calls + needed > min(args.max_calls,int(os.getenv('AI_DAILY_CALL_LIMIT','40'))):
                    metadata['stopped']='call budget'; return
                current={'id':case['id'],'repeat':repeat+1}
                partial={}
                stage='translation'
                t=await translate(case['text'],gemini)
                partial['translation']=t.model_dump()
                stage='verification'
                d=displayed(t)
                sf,tf,j=await extract_compare(case['text'],t.translation,gemini,d)
                v=assess(case['text'],t.translation,sf,tf,j,displayed=d)
                row={'id':case['id'],'repeat':repeat+1,'translation':t.model_dump(),'verification':v.model_dump(),
                    'guidance':guidance(case['text'],country=case['country']).model_dump(),'gold':case['gold'],
                    'review':{'summary_has_material_error':None,'verification_missed_error':None,'notes':None}}
                if repeat==0 and case.get('mutation') and not args.skip_mutations:
                    stage='mutation_verification'
                    changed={**d,'summary':case['mutation']['summary']}
                    sf,tf,j=await extract_compare(case['text'],t.translation,gemini,changed)
                    mv=assess(case['text'],t.translation,sf,tf,j,displayed=changed)
                    row['mutation']={'input':case['mutation'],'verification':mv.model_dump(),
                        'detected_summary_error':any(i.field=='summary' and i.severity=='critical' for i in mv.issues)}
                with (output/'results.jsonl').open('a') as f: f.write(json.dumps(row,ensure_ascii=False)+'\n')
                completed+=1
                print(f"completed {case['id']} repeat {repeat+1}; calls={gemini.calls}",flush=True)
    except Exception as e:
        # Avoid logging headers, key, environment or provider payloads.
        metadata['stopped']=type(e).__name__
        metadata['failed_case']=current
        metadata['failed_stage']=stage
        if partial:
            (output/'partial.json').write_text(json.dumps({'case':current,'stage':stage,**partial},ensure_ascii=False,indent=2))
        metadata['http_status']=getattr(e,'status_code',None)
        metadata['error_category']=getattr(e,'detail','Unexpected evaluation error')
        print('Evaluation stopped; see metadata (no secret/provider payload logged).',flush=True)
    finally:
        metadata.update(completed=completed, calls=gemini.calls, finished_at=datetime.now(timezone.utc).isoformat())
        (output/'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--env',default=str(ROOT/'backend/.env'))
    p.add_argument('--output',required=True)
    p.add_argument('--ids',default='us-public-wind,jp-public-earthquake,jp-iso-wave,us-date-heat')
    p.add_argument('--skip-mutations',action='store_true')
    p.add_argument('--repeat',type=int,default=2)
    p.add_argument('--max-calls',type=int,default=38)
    args=p.parse_args()
    if not 1 <= args.repeat <= 5 or not 1 <= args.max_calls <= 40: p.error('repeat 1..5 and max-calls 1..40 required')
    asyncio.run(evaluate(args))
