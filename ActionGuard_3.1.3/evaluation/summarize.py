"""Summarize completed runs without converting missing reviews to success."""
import json
from pathlib import Path

def summarize(root):
    rows=[]; metadata=[]
    for p in sorted(root.glob('*/metadata.json')):
        metadata.append(json.loads(p.read_text()))
        results=p.with_name('results.jsonl')
        if results.exists(): rows.extend(json.loads(line) for line in results.read_text().splitlines())
    mutations=[r['mutation'] for r in rows if 'mutation' in r]
    reviewed=[r for r in rows if r['review']['summary_has_material_error'] is not None]
    return {'completed_analyses':len(rows),'distinct_cases':len({r['id'] for r in rows}),
        'attempted_api_calls_including_network_failure':sum(m.get('calls',0) for m in metadata),
        'stopped_runs':[{'status':m.get('http_status'),'completed':m.get('completed',0)} for m in metadata if m.get('stopped')],
        'injected_errors':len(mutations),'injected_errors_detected':sum(m['detected_summary_error'] for m in mutations),
        'injection_miss_rate':sum(not m['detected_summary_error'] for m in mutations)/len(mutations) if mutations else None,
        'independently_reviewed_summaries':len(reviewed),
        'summary_error_rate':sum(r['review']['summary_has_material_error'] for r in reviewed)/len(reviewed) if reviewed else None,
        'release_decision':'HOLD','reason':'Insufficient coverage; independent review and final-code live reevaluation required'}

if __name__=='__main__':
    root=Path(__file__).resolve().parent
    result=summarize(root/'runs')
    (root/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
