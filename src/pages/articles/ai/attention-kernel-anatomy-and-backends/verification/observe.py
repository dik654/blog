from pathlib import Path
import ast,json,types,enum,sys
from collections import namedtuple
repo=Path(__file__).resolve().parent.parent
# Compile exact AST statement/function bodies with annotations/decorators removed only.
class Clean(ast.NodeTransformer):
 def visit_FunctionDef(self,n):
  n=self.generic_visit(n);n.decorator_list=[];n.returns=None
  for a in n.args.posonlyargs+n.args.args+n.args.kwonlyargs:a.annotation=None
  if n.args.kwarg:n.args.kwarg.annotation=None
  if n.args.vararg:n.args.vararg.annotation=None
  return n
 def visit_AnnAssign(self,n):return ast.copy_location(ast.Assign(targets=[n.target],value=self.visit(n.value)),n) if n.value else None

def execute(nodes,ns):
 module=ast.Module(body=nodes,type_ignores=[]);module=Clean().visit(module);ast.fix_missing_locations(module);exec(compile(module,'<pinned-original-AST>','exec'),ns)
triton=ast.parse((repo/'codebase/triton/python/tutorials/06-fused-attention.py').read_text());Config=lambda kwargs,**other:types.SimpleNamespace(kwargs=kwargs,**other)
ns={'triton':types.SimpleNamespace(Config=Config),'NUM_STAGES_OPTIONS':[2,3,4],'_host_descriptor_pre_hook':None,'is_cuda':lambda:True,'torch':types.SimpleNamespace(cuda=types.SimpleNamespace(get_device_capability=lambda:(9,0)))}
execute([n for n in triton.body if isinstance(n,ast.Assign) and n.lineno==135 and any(isinstance(t,ast.Name) and t.id=='configs' for t in n.targets)]+[n for n in triton.body if isinstance(n,ast.FunctionDef) and n.name in ['keep','prune_invalid_configs']],ns)
configs=ns['configs']; kept=list(filter(ns['keep'],configs));counts=[len(configs),len(kept),len(ns['prune_invalid_configs'](kept,{},N_CTX=64)),len(ns['prune_invalid_configs'](kept,{},N_CTX=8))];print('actual config counts',counts);assert counts==[36,21,9,0]
source=ast.parse((repo/'codebase/vllm/vllm/platforms/cuda.py').read_text());members=sorted(set(n.attr for n in ast.walk(source) if isinstance(n,ast.Attribute) and isinstance(n.value,ast.Name) and n.value.id=='AttentionBackendEnum'))
E=enum.Enum('AttentionBackendEnum',members)
module=types.ModuleType('vllm.utils.torch_utils');module.is_quantized_kv_cache=lambda value:value.startswith('fp8');sys.modules['vllm.utils.torch_utils']=module
reasons={e:[] for e in E}; cap=types.SimpleNamespace(major=9)
classes={e:type(e.name,(),{'validate_configuration':classmethod(lambda cls,**kw:reasons[E[cls.__name__]]),'full_cls_name':classmethod(lambda cls:('fake',cls.__name__))}) for e in E}
ns={'AttentionBackendEnum':E,'_get_attn_backend_class':lambda e:classes[e],'_BackendCandidate':namedtuple('_BackendCandidate','backend_class backend priority'),'logger':types.SimpleNamespace(**{n:lambda *a,**k:None for n in ['info','info_once','debug_once','warning']})}
execute([n for n in source.body if isinstance(n,ast.FunctionDef) and n.name in ['_get_backend_priorities','_backend_cls_path']],ns)
platform=next(n for n in source.body if isinstance(n,ast.ClassDef) and n.name=='CudaPlatformBase');execute([n for n in platform.body if isinstance(n,ast.FunctionDef) and n.name in ['get_valid_backends','get_attn_backend_cls']],ns)
P=type('P',(),{'device_name':'FAKE-validation-CPU','get_device_capability':classmethod(lambda cls:cap),'get_valid_backends':classmethod(ns['get_valid_backends']),'get_attn_backend_cls':classmethod(ns['get_attn_backend_cls'])})
Cfg=namedtuple('Cfg','use_mla kv_cache_dtype use_non_causal block_size'); cfg=Cfg(False,'auto',False,None)
reasons[E.FLASH_ATTN]=['head_size not supported']; auto=P.get_attn_backend_cls(None,cfg);assert auto=='fake.FLASHINFER'
try:P.get_attn_backend_cls(E.FLASH_ATTN,cfg);raise AssertionError('did not reject explicit invalid backend')
except ValueError as e:explicit=str(e)
for e in E:reasons[e]=['fake failure']
try:P.get_attn_backend_cls(None,cfg);raise AssertionError('did not reject all invalid')
except ValueError as e:allbad=str(e)
priority={}
for major,noncausal in [(9,False),(10,False),(10,True)]:priority[f'{major}-{noncausal}']=[e.name for e in ns['_get_backend_priorities'](False,types.SimpleNamespace(major=major),None,'auto',noncausal)]
assert priority['10-False'][0]=='FLASHINFER' and priority['10-True'][0]=='FLASH_ATTN'
result={'pass':True,'sourceHashesMatch':True,'triton':{'originalASTBodies':['configs comprehension','keep','prune_invalid_configs'],'deviceMock':'CUDA capability (9,0); HD128; test override absent','counts':counts,'gpuExecution':False},'vllm':{'originalASTBodies':['_get_backend_priorities','_backend_cls_path','CudaPlatformBase.get_valid_backends','CudaPlatformBase.get_attn_backend_cls'],'dependencies':'capability/logger/backend validation mocked; real backend support and performance not exercised','autoWithAInvalid':auto,'explicitInvalid':explicit,'allInvalid':allbad,'priorities':priority,'gpuExecution':False}}
verify=repo/'verification';verify.mkdir(exist_ok=True);(verify/'source-execution.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
