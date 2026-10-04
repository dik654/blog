# -*- coding: utf-8 -*-
"""Execute retained original Python decisions on CPU; all CUDA objects are mocks.
No CUDA graph was captured or launched. Arithmetic below is a separate toy model.
"""
from pathlib import Path
from types import SimpleNamespace as NS
from dataclasses import dataclass,replace,asdict
from contextlib import ExitStack,contextmanager
from collections.abc import Set as AbstractSet
from itertools import product
from typing import Any
from unittest.mock import patch
import ast,enum,json,hashlib
base=Path(__file__).parent.parent/'codebase'
if not base.exists():base=Path('/tmp/teach-all/graphs22/research')
ns=dict(enum=enum,dataclass=dataclass,dataclasses=__import__('dataclasses'),replace=replace,AbstractSet=AbstractSet,product=product,VllmConfig=Any,Any=Any)
evidence=[]
def take(path,classes):
 s=(base/path).read_text();tree=ast.parse(s);nodes=[n for n in tree.body if isinstance(n,ast.ClassDef) and n.name in classes]
 assert len(nodes)==len(classes)
 for n in nodes:evidence.append({'file':path,'symbol':n.name,'lines':[n.lineno,n.end_lineno],'sourceSha256':hashlib.sha256(s.encode()).hexdigest()})
 mod=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0)]+nodes,type_ignores=[]);exec(compile(ast.fix_missing_locations(mod),path,'exec'),ns)
take('vllm/vllm/config/compilation.py',['CUDAGraphMode'])
take('vllm/vllm/forward_context.py',['BatchDescriptor'])
take('vllm/vllm/v1/cudagraph_dispatcher.py',['CudagraphDispatcher'])
Mode=ns['CUDAGraphMode'];BD=ns['BatchDescriptor'];D=ns['CudagraphDispatcher'];d=D.__new__(D)
sizes=[1,2,4,8,16,24,32];config=NS(max_cudagraph_capture_size=32,cudagraph_capture_sizes=sizes,compile_sizes=[])
d.compilation_config=config;d.vllm_config=NS(scheduler_config=NS(max_num_seqs=32),lora_config=None);d.uniform_decode_query_len=1;d.specialize_lora_count=False;d.cudagraph_keys={Mode.FULL:set(),Mode.PIECEWISE:set()};d.keys_initialized=False
d.initialize_cudagraph_keys(Mode.FULL_AND_PIECEWISE)
r={}
for n in [5,9,17,32,33]:
 mode,b=d.dispatch(n);r[str(n)]={'mode':mode.name,'descriptor':asdict(b)}
assert r['5']['mode']=='PIECEWISE' and r['5']['descriptor']['num_tokens']==8
# FULL_AND_PIECEWISE gives FULL only for uniform decode, mixed uses piecewise.
mode,b=d.dispatch(5,uniform_decode=True);r['5_uniform']={'mode':mode.name,'descriptor':asdict(b)};assert mode==Mode.FULL and b.num_tokens==8 and b.num_reqs==8 and b.uniform
mode,b=d.dispatch(5,uniform_decode=True,invalid_modes={Mode.FULL});r['5_full_excluded']={'mode':mode.name,'descriptor':asdict(b)};assert mode==Mode.PIECEWISE and b.num_reqs is None
assert r['33']['mode']=='NONE' and r['33']['descriptor']['num_tokens']==33
try:d.dispatch(5,uniform_decode=False,valid_modes={Mode.FULL})
except AssertionError:r['only_full_mixed']='AssertionError: no matching graph and NONE disallowed'
else:raise AssertionError('missing dispatcher assertion')
class Tensor:
 def __init__(self,p):self.p=p
 def data_ptr(self):return self.p
class FakeGraph:
 def __init__(self):self.replays=0
 def replay(self):self.replays+=1
@contextmanager
def fake_capture(*a,**kw):yield
calls={'runnable':0,'offload_sync':0,'offload_join':0}
def run(*a,**kw):calls['runnable']+=1;return {'mock_output':calls['runnable']}
def sync():calls['offload_sync']+=1
def join():calls['offload_join']+=1
ctx=NS(batch_descriptor=BD(8,8,True,False,0),cudagraph_runtime_mode=Mode.FULL)
ns.update(torch=NS(Tensor=Tensor,cuda=NS(CUDAGraph=FakeGraph,graph=fake_capture)),ExitStack=ExitStack,patch=patch,logger=NS(debug=lambda *a:None),validate_cudagraph_capturing_enabled=lambda:None,set_graph_pool_id=lambda *a:None,current_stream=lambda:None,current_platform=NS(graph_pool_handle=lambda:None),get_offloader=lambda:NS(sync_prev_onload=sync,join_after_forward=join),weak_ref_tensors=lambda x:x,compilation_counter=NS(num_cudagraph_captured=0),is_forward_context_available=lambda:True,get_forward_context=lambda:ctx)
take('vllm/vllm/compilation/cuda_graph.py',['CUDAGraphEntry','CUDAGraphOptions'])
s=(base/'vllm/vllm/compilation/cuda_graph.py').read_text();cl=next(n for n in ast.parse(s).body if isinstance(n,ast.ClassDef) and n.name=='CUDAGraphWrapper');fn=next(n for n in cl.body if isinstance(n,ast.FunctionDef) and n.name=='__call__');evidence.append({'file':'vllm/vllm/compilation/cuda_graph.py','symbol':'CUDAGraphWrapper.__call__','lines':[fn.lineno,fn.end_lineno],'sourceSha256':hashlib.sha256(s.encode()).hexdigest()});m=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0),fn],type_ignores=[]);exec(compile(ast.fix_missing_locations(m),'original-wrapper','exec'),ns)
w=NS(runnable=run,runtime_mode=Mode.FULL,concrete_cudagraph_entries={},cudagraph_options=ns['CUDAGraphOptions'](),graph_pool=None,is_debugging_mode=True)
call=ns['__call__'];a=Tensor(100);out=call(w,a);e=w.concrete_cudagraph_entries[ctx.batch_descriptor];call(w,a);call(w,a);assert calls['runnable']==1 and e.cudagraph.replays==2
try:call(w,Tensor(200))
except AssertionError:address_debug='rejected'
else:raise AssertionError('new address not rejected')
w.is_debugging_mode=False;call(w,Tensor(200));assert e.cudagraph.replays==3 and calls['runnable']==1
ctx.cudagraph_runtime_mode=Mode.NONE;call(w,a);assert calls['runnable']==2
wrapper={'capture_count':ns['compilation_counter'].num_cudagraph_captured,'original_runnable_calls_after_capture_and_three_replays':1,'replay_count':3,'debug_new_address':address_debug,'nondebug_new_address':'not checked by Python wrapper','NONE_calls_underlying':True,'cuda':'all tensor/graph/stream/offloader operations mocked; no GPU correctness/performance verified'}
def timeline(N,L,E,G):
 ready=[(i+1)*L for i in range(N)];done=[]
 for t in ready:done.append(max(t,done[-1] if done else 0)+E)
 return {'ready':ready,'done':done,'graph_done':[G+(i+1)*E for i in range(N)],'synchronized':N*(L+E)}
t1=timeline(4,3,2,2);t2=timeline(4,2,3,2);assert t1['done']==[5,8,11,14] and t2['done'][-1]==14
result={'scope':__doc__,'source':evidence,'dispatch':r,'wrapper':wrapper,'timing_model':[t1,t2],'value_model':{'input3':[3,4,8,11,22],'input5':[5,6,12,15,30]},'status':'PASS'}
(Path(__file__).parent/'source-execution.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False,indent=2))
