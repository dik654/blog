"""Execute unchanged selected upstream AST with synthetic records. No vLLM server/GPU."""
from pathlib import Path
import ast,contextlib,io,json,enum,dataclasses,platform,hashlib
from types import SimpleNamespace as NS
import numpy as np
base=Path(__file__).resolve().parents[1]
comp_path=base/'codebase/vllm/vllm/config/compilation.py'
config_path=base/'codebase/vllm/vllm/config/vllm.py'
metrics_path=base/'codebase/vllm/vllm/benchmarks/serve.py'
env=dict(enum=enum,IntEnum=enum.IntEnum,dataclass=dataclasses.dataclass,np=np,TERM_PLOTLIB_AVAILABLE=False,MILLISECONDS_TO_SECONDS_CONVERSION=1000)
def execute(nodes,path):
 module=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0)]+nodes,type_ignores=[])
 ast.fix_missing_locations(module);exec(compile(module,str(path),'exec'),env)
ct=ast.parse(comp_path.read_text());execute([n for n in ct.body if isinstance(n,ast.ClassDef) and n.name in ['CompilationMode','CUDAGraphMode']],comp_path)
vt=ast.parse(config_path.read_text());eager=next(n for n in ast.walk(vt) if isinstance(n,ast.If) and n.lineno==1193)
log=[];env['logger']=NS(warning_once=lambda *x:log.append(x))
config_observations=[]
for flag in [False,True]:
 cfg=NS(model_config=NS(enforce_eager=flag),compilation_config=NS(mode=env['CompilationMode'].VLLM_COMPILE,cudagraph_mode=env['CUDAGraphMode'].FULL_AND_PIECEWISE))
 env['self']=cfg;execute([eager],config_path)
 config_observations.append(dict(enforce_eager=flag,mode=cfg.compilation_config.mode.name,cudagraph_mode=cfg.compilation_config.cudagraph_mode.name))
mt=ast.parse(metrics_path.read_text());selected=[n for n in mt.body if (isinstance(n,ast.ClassDef) and n.name=='BenchmarkMetrics')or(isinstance(n,ast.FunctionDef)and n.name=='calculate_metrics')];execute(selected,metrics_path)
def metrics(ms,wrong=False):
 outputs=[NS(success=True,output_tokens=1,prompt_len=2,latency=ms/1000,ttft=ms/1000,itl=[],input_audio_duration=0,start_time=0,generated_text='WRONG'if wrong and i==0 else 'answer')for i in range(20)]
 capture=io.StringIO()
 with contextlib.redirect_stdout(capture):
  m,lens=env['calculate_metrics']([],outputs,ms/1000,None,[50,95,99],{'e2el':90})
 return dict(metrics=dataclasses.asdict(m),output_lengths=lens,stdout=capture.getvalue(),scope='Synthetic 20 simultaneous successful records; duration supplied, not measured; text content not checked by metrics function.')
result={'python':platform.python_version(),'numpy':np.__version__,'config':config_observations,'baseline100':metrics(100),'candidate80':metrics(80),'boundary90':metrics(90),'candidateWrongText':metrics(80,True),'scope':'Unchanged AST of enums, one enforce_eager branch, BenchmarkMetrics and calculate_metrics. Synthetic fields and caller duration. No full VllmConfig validation, inference server, GPU or actual performance/cost observation.','sourceHashes':{str(p.relative_to(base)):hashlib.sha256(p.read_bytes()).hexdigest()for p in [comp_path,config_path,metrics_path]}}
assert result['config'][1]['mode']=='NONE'and result['config'][1]['cudagraph_mode']=='NONE'
assert result['baseline100']['metrics']['request_throughput']==200
assert result['baseline100']['metrics']['request_goodput']==0
assert result['candidate80']['metrics']['request_throughput']==250
assert result['candidate80']['metrics']['request_goodput']==250
assert abs(result['boundary90']['metrics']['request_goodput']-20/.09)<1e-10
assert result['candidate80']['metrics']==result['candidateWrongText']['metrics']
(base/'verification/run.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'python':result['python'],'numpy':result['numpy'],'config':config_observations,'rates':[200,250],'status':'PASS'},indent=2))
