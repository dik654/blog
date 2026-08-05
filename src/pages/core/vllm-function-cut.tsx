import { Link, useParams } from 'react-router-dom';
import { CodeSidebar, useCodeSidebar, type CodeRef, type FileNode } from '@/components/code';
import { coreItemPath } from '@/lib/paths';

import engineCorePy from '../articles/ai/vllm-serving/codebase/vllm/v1/engine/core.py?raw';
import gpuWorkerPy from '../articles/ai/vllm-serving/codebase/vllm/v1/worker/gpu_worker.py?raw';
import samplerPy from '../articles/ai/vllm-serving/codebase/vllm/v1/sample/sampler.py?raw';
import schedulerPy from '../articles/ai/vllm-serving/codebase/vllm/v1/core/sched/scheduler.py?raw';
import blockPoolPy from '../articles/ai/vllm-serving/codebase/vllm/v1/core/block_pool.py?raw';
import kvCacheManagerPy from '../articles/ai/vllm-serving/codebase/vllm/v1/core/kv_cache_manager.py?raw';
import apiServerPy from '../articles/ai/vllm-serving/codebase/vllm/entrypoints/openai/api_server.py?raw';
import rejectionSamplerPy from '../articles/ai/vllm-serving/codebase/vllm/v1/sample/rejection_sampler.py?raw';
import eaglePy from '../articles/ai/vllm-serving/codebase/vllm/v1/spec_decode/eagle.py?raw';

type VllmCut = {
  slug: string;
  number: string;
  title: string;
  target: string;
  sourcePath: string;
  code: string;
  lineStart: number;
  lineEnd: number;
  role: string;
  boundary: string;
  excludes: string;
  command: string;
  notes: string[];
  invariants: string[][];
  tests: string[][];
  next: string[];
};

function sourceToCodeRef(cut: VllmCut): CodeRef {
  return {
    path: cut.sourcePath,
    code: cut.code,
    lang: 'python',
    highlight: [cut.lineStart, cut.lineEnd],
    lineStart: 1,
    desc: cut.role,
    annotations: cut.notes.map((note, index) => ({
      lines: [Math.min(cut.lineStart + index * 3, cut.lineEnd), Math.min(cut.lineStart + index * 3, cut.lineEnd)] as [number, number],
      color: (['sky', 'emerald', 'amber', 'violet'] as const)[index % 4],
      note,
    })),
  };
}

function fileTreeFor(cut: VllmCut): FileNode {
  return {
    name: 'vllm',
    type: 'dir',
    children: [{
      name: cut.sourcePath,
      type: 'file',
      path: cut.sourcePath,
      codeKey: cut.slug,
    }],
  };
}

const cuts: VllmCut[] = [
  {
    slug: 'vllm-fn-engine-step',
    number: '001',
    title: 'EngineCore.step()이 한 추론 step을 닫는 부분',
    target: 'EngineCore.step()',
    sourcePath: 'vllm/v1/engine/core.py',
    code: engineCorePy,
    lineStart: 378,
    lineEnd: 407,
    role: '스케줄링, 모델 실행, 토큰 샘플링, 스케줄러 상태 갱신을 한 번에 묶는 runtime loop',
    boundary: '한 engine step 안에서 schedule, execute, sample, update 순서와 요청 상태 출력 계약이 유지되는지 본다.',
    excludes: '모델 forward 내부 tensor 계산과 CUDA kernel 최적화는 이 절단에서 제외한다.',
    command: "pytest tests/engine tests/v1/engine -k 'step or engine_core or output' -q",
    notes: ['scheduler.schedule() 결과가 execute_model 입력이 된다.', 'future.result()가 None일 때 sample_tokens()가 출력 토큰을 만든다.', 'scheduler.update_from_output() 이후에만 request 상태가 바뀐다.'],
    invariants: [
      ['step order', 'schedule → execute_model → sample_tokens → update_from_output 순서가 바뀌면 안 된다.'],
      ['empty request guard', '요청이 없으면 모델 실행 없이 빈 출력으로 끝나야 한다.'],
      ['output ownership', 'model output은 scheduler update 전후로 의미가 달라지면 안 된다.'],
    ],
    tests: [
      ['T0 no request', 'scheduler에 요청이 없는 상태로 step을 호출한다.', 'execute_model이 호출되지 않고 빈 결과를 반환한다.'],
      ['T1 normal step', '하나의 prompt request를 넣고 step을 실행한다.', 'scheduler output과 engine output이 같은 request id를 유지한다.'],
      ['T2 grammar sample', 'grammar bitmask가 있는 요청을 넣는다.', 'sample_tokens가 같은 mask contract를 사용한다.'],
    ],
    next: ['GPUWorker.execute_model()', 'Scheduler.schedule()'],
  },
  {
    slug: 'vllm-fn-worker-execute-model',
    number: '002',
    title: 'GPUWorker.execute_model()이 forward 실행을 위임하는 부분',
    target: 'GPUWorker.execute_model()',
    sourcePath: 'vllm/v1/worker/gpu_worker.py',
    code: gpuWorkerPy,
    lineStart: 759,
    lineEnd: 790,
    role: 'scheduler output을 GPUModelRunner 실행으로 넘기는 worker 경계',
    boundary: '스케줄된 토큰 수, pipeline parallel tensor 수신, model_runner 호출 조건이 맞는지 본다.',
    excludes: '각 모델 아키텍처의 forward 구현과 collective 통신 성능은 제외한다.',
    command: "pytest tests/worker tests/model_executor -k 'execute_model or model_runner or pipeline' -q",
    notes: ['total_num_scheduled_tokens가 forward 실행 여부를 결정한다.', 'pipeline parallel 이전 stage tensor 수신이 먼저 끝나야 한다.', '실제 forward는 model_runner.execute_model()로 위임된다.'],
    invariants: [
      ['forward guard', '스케줄된 토큰이 없으면 forward path가 열리지 않아야 한다.'],
      ['pipeline ordering', 'PP tensor 수신이 끝나기 전에 model_runner를 호출하면 안 된다.'],
      ['single handoff', 'scheduler output은 변형 없이 model_runner 경계로 전달되어야 한다.'],
    ],
    tests: [
      ['T0 zero token', 'total_num_scheduled_tokens=0 fixture를 만든다.', 'forward 호출이 생략된다.'],
      ['T1 first rank', '첫 PP rank에서 실행한다.', '수신 없이 model_runner가 호출된다.'],
      ['T2 non-first rank', '중간 PP rank를 구성한다.', 'irecv tensor 이후 model_runner가 호출된다.'],
    ],
    next: ['EngineCore.step()', 'Scheduler.schedule()'],
  },
  {
    slug: 'vllm-fn-sampler-forward',
    number: '003',
    title: 'Sampler.forward()가 logits를 token id로 바꾸는 부분',
    target: 'Sampler.forward()',
    sourcePath: 'vllm/v1/sample/sampler.py',
    code: samplerPy,
    lineStart: 67,
    lineEnd: 135,
    role: '모델 logits에서 다음 토큰을 선택하는 sampling 경계',
    boundary: 'temperature, top-p, grammar mask, stop 조건이 token output contract를 깨지 않는지 본다.',
    excludes: '토크나이저 구현과 OpenAI response serialization은 제외한다.',
    command: "pytest tests -k 'sampler or sampling or logits or stop' -q",
    notes: ['logits processor와 sampling params가 같은 batch contract를 공유해야 한다.', 'streaming/non-streaming은 같은 token id 의미를 가져야 한다.', 'stop token은 출력 contract를 벗어나면 안 된다.'],
    invariants: [
      ['shape contract', 'batch logits와 sampled token batch 크기는 일치해야 한다.'],
      ['mask respect', 'grammar나 stop mask가 금지한 token은 선택되면 안 된다.'],
      ['deterministic greedy', 'temperature 0 또는 greedy path는 재현 가능한 결과를 내야 한다.'],
    ],
    tests: [
      ['T0 greedy', '고정 logits와 greedy 설정을 넣는다.', 'argmax token이 반환된다.'],
      ['T1 masked token', '최상위 token을 mask 처리한다.', '다음 허용 token이 선택된다.'],
      ['T2 stop condition', 'stop token을 포함한 fixture를 넣는다.', '종료 상태와 token 출력이 분리된다.'],
    ],
    next: ['RejectionSampler.forward()', 'EngineCore.step()'],
  },
  {
    slug: 'vllm-fn-scheduler-schedule',
    number: '004',
    title: 'Scheduler.schedule()이 prefill과 decode를 한 budget으로 묶는 부분',
    target: 'Scheduler.schedule()',
    sourcePath: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lineStart: 341,
    lineEnd: 510,
    role: 'RUNNING/WAITING 요청을 token budget과 KV block budget 안에 배치하는 스케줄러 핵심 함수',
    boundary: 'num_computed_tokens와 num_tokens_with_spec 차이로 새 토큰 수를 계산하고, budget을 넘지 않는 batch만 만든다.',
    excludes: 'GPU kernel 실행 시간과 모델별 attention 구현은 제외한다.',
    command: "pytest tests/core tests/engine -k 'scheduler or budget or prefill or decode' -q",
    notes: ['prefill/decode phase를 분리하지 않고 num_new_tokens로 통합한다.', 'token_budget과 encoder budget을 동시에 줄인다.', 'allocate_slots 실패 시 preemption 경계로 넘어간다.'],
    invariants: [
      ['budget bound', '스케줄된 token 수는 token_budget을 초과하면 안 된다.'],
      ['request order', 'RUNNING request 순회 순서가 output ordering을 깨면 안 된다.'],
      ['kv allocation gate', 'KV slot 확보 실패는 조용한 성공이 아니라 preemption/fail 경계로 가야 한다.'],
    ],
    tests: [
      ['T0 running decode', 'RUNNING 요청 하나를 decode 대상으로 둔다.', 'num_new_tokens만큼 budget이 줄어든다.'],
      ['T1 chunked prefill', '긴 prompt를 token_budget보다 크게 둔다.', 'chunked prefill로 일부만 스케줄된다.'],
      ['T2 no kv blocks', 'block pool을 부족하게 만든다.', 'preemption 또는 waiting 복귀가 발생한다.'],
    ],
    next: ['Scheduler._preempt_request()', 'KVCacheManager.allocate_slots()'],
  },
  {
    slug: 'vllm-fn-scheduler-preempt',
    number: '005',
    title: 'Scheduler._preempt_request()가 메모리 부족 요청을 되돌리는 부분',
    target: 'Scheduler._preempt_request()',
    sourcePath: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lineStart: 949,
    lineEnd: 969,
    role: 'KV block 부족 시 RUNNING request를 waiting queue로 되돌리는 preemption 함수',
    boundary: 'KV cache와 encoder cache를 해제하고 computed token 상태를 초기화한 뒤 재스케줄 가능 상태로 돌리는지 본다.',
    excludes: 'CPU swap 정책과 모델별 메모리 profiler는 제외한다.',
    command: "pytest tests/core tests/engine -k 'preempt or recompute or waiting' -q",
    notes: ['RUNNING 상태가 아니면 preemption 대상이 아니다.', 'KV cache와 encoder cache를 함께 해제해야 한다.', 'waiting queue 앞쪽으로 넣어 다음 step에서 재시도한다.'],
    invariants: [
      ['state reset', 'preempt된 request는 stale computed token이나 stale block reference를 남기면 안 된다.'],
      ['queue priority', 'preempt request는 다음 스케줄 기회를 잃으면 안 된다.'],
      ['resource release', 'KV block과 encoder cache가 둘 다 해제되어야 한다.'],
    ],
    tests: [
      ['T0 running only', 'WAITING request에 preempt를 시도한다.', '상태 변경 없이 거부된다.'],
      ['T1 release blocks', 'RUNNING request에 KV block을 붙여 preempt한다.', 'free block 수가 증가한다.'],
      ['T2 reschedule', 'preempt 후 다음 schedule을 호출한다.', '해당 request가 waiting 앞쪽에서 재시도된다.'],
    ],
    next: ['Scheduler.schedule()', 'BlockPool.free_blocks()'],
  },
  {
    slug: 'vllm-fn-block-pool-cache',
    number: '006',
    title: 'BlockPool.get_cached_block()이 prefix cache hit을 찾는 부분',
    target: 'BlockPool.get_cached_block()',
    sourcePath: 'vllm/v1/core/block_pool.py',
    code: blockPoolPy,
    lineStart: 183,
    lineEnd: 208,
    role: 'block hash로 cached KV block을 찾고 cache hit/miss를 나누는 함수',
    boundary: '같은 token prefix에서만 KV block을 재사용하고 ref_cnt가 있는 block을 eviction 대상으로 잘못 쓰지 않는지 본다.',
    excludes: 'tokenizer hash 생성 정책과 분산 KV connector는 제외한다.',
    command: "pytest tests -k 'prefix_cache or cached_block or block_hash' -q",
    notes: ['block hash가 cache lookup key다.', 'ref_cnt가 있는 block은 재사용 가능하지만 eviction 대상이 되면 안 된다.', 'cache miss는 새 block allocation으로 이어진다.'],
    invariants: [
      ['same-prefix only', '다른 prefix hash는 같은 KV block을 반환하면 안 된다.'],
      ['ref count safety', '사용 중인 block은 free block처럼 재활용되면 안 된다.'],
      ['miss clarity', 'hit하지 못한 경우 None/miss 경계가 명확해야 한다.'],
    ],
    tests: [
      ['T0 hit', '같은 block hash를 가진 cached block을 등록한다.', '해당 block이 반환된다.'],
      ['T1 miss', '없는 block hash를 조회한다.', 'miss로 끝난다.'],
      ['T2 collision guard', '다른 prefix fixture를 만든다.', '잘못된 block이 반환되지 않는다.'],
    ],
    next: ['BlockPool.free_blocks()', 'KVCacheManager.allocate_slots()'],
  },
  {
    slug: 'vllm-fn-block-pool-free',
    number: '007',
    title: 'BlockPool.free_blocks()가 KV block을 free queue로 돌리는 부분',
    target: 'BlockPool.free_blocks()',
    sourcePath: 'vllm/v1/core/block_pool.py',
    code: blockPoolPy,
    lineStart: 409,
    lineEnd: 490,
    role: 'ref_cnt를 줄이고 해제 가능한 KV block을 free queue로 반환하는 함수',
    boundary: 'ref_cnt, prefix cache 유지, reset_prefix_cache가 block pool 상태를 일관되게 바꾸는지 본다.',
    excludes: 'GPU memory allocator 내부 구현은 제외한다.',
    command: "pytest tests -k 'free_blocks or block_pool or reset_prefix_cache' -q",
    notes: ['ref_cnt가 0이 된 block만 free queue에 들어간다.', 'prefix caching이 켜져 있으면 hash를 유지한 채 eviction 후보가 된다.', 'reset_prefix_cache는 전체 cache map을 정리한다.'],
    invariants: [
      ['no double free', '같은 block을 두 번 free해도 ref_cnt가 음수가 되면 안 된다.'],
      ['prefix retention', 'prefix cache block은 해제 후에도 hit 후보로 남을 수 있다.'],
      ['free count', 'free queue 크기는 실제 해제 가능한 block 수와 일치해야 한다.'],
    ],
    tests: [
      ['T0 ref decrement', 'ref_cnt=2 block을 free한다.', 'free queue에는 아직 들어가지 않는다.'],
      ['T1 free return', 'ref_cnt=1 block을 free한다.', 'free queue 크기가 증가한다.'],
      ['T2 reset', 'prefix cache를 reset한다.', 'hash map과 cached flag가 정리된다.'],
    ],
    next: ['BlockPool.get_cached_block()', 'KVCacheManager.allocate_slots()'],
  },
  {
    slug: 'vllm-fn-kv-allocate-slots',
    number: '008',
    title: 'KVCacheManager.allocate_slots()가 새 토큰용 KV block을 배정하는 부분',
    target: 'KVCacheManager.allocate_slots()',
    sourcePath: 'vllm/v1/core/kv_cache_manager.py',
    code: kvCacheManagerPy,
    lineStart: 257,
    lineEnd: 340,
    role: 'computed, cache hit, external, new, lookahead 구간을 나눠 KV slot을 할당하는 함수',
    boundary: 'prefix cache, spec decode lookahead, 새 token block allocation이 memory budget과 request isolation을 지키는지 본다.',
    excludes: 'attention kernel의 paged read/write 구현은 제외한다.',
    command: "pytest tests -k 'allocate_slots or kv_cache_manager or lookahead' -q",
    notes: ['computed block 중 더 이상 필요 없는 block을 먼저 해제한다.', 'new_computed block은 cache hit이므로 ref_cnt를 증가시킨다.', 'lookahead block은 speculative decoding을 위해 별도 구간으로 잡힌다.'],
    invariants: [
      ['layout partition', 'computed/new/external/lookahead 구간이 겹치면 안 된다.'],
      ['budget respect', '필요 block 수가 free block 수보다 많으면 성공하면 안 된다.'],
      ['cache isolation', '다른 request의 prefix cache가 잘못 공유되면 안 된다.'],
    ],
    tests: [
      ['T0 normal allocation', '새 token 1개가 필요한 request를 넣는다.', 'new block 하나가 할당된다.'],
      ['T1 prefix hit', 'computed prefix가 cache hit되는 request를 넣는다.', 'new_computed ref_cnt가 증가한다.'],
      ['T2 lookahead', 'spec decode lookahead를 요청한다.', 'lookahead block이 별도 구간에 붙는다.'],
    ],
    next: ['Scheduler.schedule()', 'BlockPool.free_blocks()'],
  },
  {
    slug: 'vllm-fn-api-engine-client',
    number: '009',
    title: 'build_async_engine_client()가 OpenAI 서버용 engine client를 여는 부분',
    target: 'build_async_engine_client()',
    sourcePath: 'vllm/entrypoints/openai/api_server.py',
    code: apiServerPy,
    lineStart: 77,
    lineEnd: 130,
    role: 'API server lifecycle에서 AsyncLLM engine client를 생성하고 닫는 함수',
    boundary: '서버 시작/종료 시 engine client lifecycle, async context, engine args 전달이 안전한지 본다.',
    excludes: 'HTTP routing 세부 handler와 모델 forward는 제외한다.',
    command: "pytest tests/entrypoints/openai -k 'engine_client or api_server or lifecycle' -q",
    notes: ['async context manager로 engine client lifecycle을 감싼다.', 'engine args에서 client를 만들고 app state로 넘긴다.', '종료 시 client close 경계가 필요하다.'],
    invariants: [
      ['lifecycle close', 'server shutdown 후 engine client resource가 남으면 안 된다.'],
      ['arg fidelity', 'CLI/server args가 engine client 생성에 그대로 반영되어야 한다.'],
      ['error surface', 'client 생성 실패는 route handler 내부 error로 숨으면 안 된다.'],
    ],
    tests: [
      ['T0 create', '정상 EngineArgs fixture를 넣는다.', 'engine client가 생성된다.'],
      ['T1 bad args', '잘못된 model/path args를 넣는다.', '초기화 error가 관찰된다.'],
      ['T2 shutdown', 'context 종료를 호출한다.', 'client close가 호출된다.'],
    ],
    next: ['init_app_state()', 'EngineCore.step()'],
  },
  {
    slug: 'vllm-fn-api-app-state',
    number: '010',
    title: 'init_app_state()가 OpenAI route state를 묶는 부분',
    target: 'init_app_state()',
    sourcePath: 'vllm/entrypoints/openai/api_server.py',
    code: apiServerPy,
    lineStart: 317,
    lineEnd: 380,
    role: 'chat/completions, completions, embeddings route가 공유할 app state를 초기화하는 함수',
    boundary: 'engine client, model config, handler state가 route별로 일관되게 공유되는지 본다.',
    excludes: '개별 request body schema validation은 제외한다.',
    command: "pytest tests/entrypoints/openai -k 'init_app_state or chat or completions or embeddings' -q",
    notes: ['route handler들이 같은 engine client를 본다.', 'model config와 served model name이 app state로 들어간다.', 'route별 handler가 서로 다른 state를 만들면 안 된다.'],
    invariants: [
      ['shared engine', '동일 server process의 route는 같은 engine client를 공유해야 한다.'],
      ['model config consistency', 'served model name과 model config가 route마다 달라지면 안 된다.'],
      ['route readiness', 'state 초기화 전 route가 요청을 처리하면 안 된다.'],
    ],
    tests: [
      ['T0 chat', 'chat/completions route를 초기화한다.', 'engine client가 app state에 존재한다.'],
      ['T1 embeddings', 'embedding route를 초기화한다.', '같은 config를 참조한다.'],
      ['T2 missing state', 'state 초기화 전 handler를 호출한다.', '명확한 error로 실패한다.'],
    ],
    next: ['build_async_engine_client()', 'init_render_app_state()'],
  },
  {
    slug: 'vllm-fn-api-render-state',
    number: '011',
    title: 'init_render_app_state()가 multimodal renderer 상태를 여는 부분',
    target: 'init_render_app_state()',
    sourcePath: 'vllm/entrypoints/openai/api_server.py',
    code: apiServerPy,
    lineStart: 408,
    lineEnd: 450,
    role: 'multimodal render server와 OpenAI route state를 분리해 초기화하는 함수',
    boundary: '이미지/비디오 입력 전처리 state가 일반 OpenAI API state와 섞이지 않는지 본다.',
    excludes: '모델별 image processor 내부 구현은 제외한다.',
    command: "pytest tests/multimodal tests/entrypoints/openai -k 'render_app_state or image or video' -q",
    notes: ['render app state는 multimodal preprocessing에 필요한 별도 상태다.', '일반 text route state와 resource boundary를 분리한다.', 'renderer 초기화 실패는 request 처리 전에 드러나야 한다.'],
    invariants: [
      ['state separation', 'render state와 text route state가 서로 덮어쓰면 안 된다.'],
      ['preprocess readiness', 'renderer 준비 전 multimodal 요청을 받으면 안 된다.'],
      ['error clarity', '지원하지 않는 media 입력은 명확한 error로 끝나야 한다.'],
    ],
    tests: [
      ['T0 image renderer', 'image input renderer fixture를 넣는다.', 'render state가 생성된다.'],
      ['T1 video renderer', 'video input fixture를 넣는다.', '지원 여부가 명확히 결정된다.'],
      ['T2 unsupported', '지원하지 않는 media type을 넣는다.', '명확한 validation error가 나온다.'],
    ],
    next: ['init_app_state()', 'KVCacheManager.allocate_slots()'],
  },
  {
    slug: 'vllm-fn-rejection-sampler',
    number: '012',
    title: 'RejectionSampler.forward()가 draft token을 검증하는 부분',
    target: 'RejectionSampler.forward()',
    sourcePath: 'vllm/v1/sample/rejection_sampler.py',
    code: rejectionSamplerPy,
    lineStart: 60,
    lineEnd: 100,
    role: 'draft_probs와 target logits를 비교해 accepted/recovered/bonus token을 만드는 함수',
    boundary: 'draft token 수용/거부 후 최종 token sequence가 target model 단독 decoding contract와 맞는지 본다.',
    excludes: 'draft model forward와 EAGLE feature 생성은 별도 절단으로 둔다.',
    command: "pytest tests/spec_decode -k 'rejection_sampler or accept or reject' -q",
    notes: ['accepted token은 draft/target 확률 비율로 결정된다.', 'recovered token은 거부된 위치에서 target-draft 분포로 샘플링된다.', 'bonus token은 모든 draft가 수용될 때만 붙는다.'],
    invariants: [
      ['acceptance correctness', 'target 확률보다 과도하게 draft token을 수용하면 안 된다.'],
      ['sequence length', 'accepted/recovered/bonus token 길이는 contract 범위를 넘으면 안 된다.'],
      ['fallback soundness', '거부 위치 이후 token은 올바르게 회복되어야 한다.'],
    ],
    tests: [
      ['T0 all accept', 'draft_probs와 target_probs를 같게 둔다.', 'draft token이 모두 수용된다.'],
      ['T1 reject one', '한 위치의 draft 확률을 낮춘다.', '해당 위치부터 recovered token이 사용된다.'],
      ['T2 bonus', '모든 draft가 수용되는 fixture를 만든다.', 'bonus token이 하나 붙는다.'],
    ],
    next: ['SpecDecodeBaseProposer / EagleProposer', 'Sampler.forward()'],
  },
  {
    slug: 'vllm-fn-eagle-proposer',
    number: '013',
    title: 'SpecDecodeBaseProposer가 speculative draft 제안을 준비하는 부분',
    target: 'SpecDecodeBaseProposer.__init__()',
    sourcePath: 'vllm/v1/spec_decode/eagle.py',
    code: eaglePy,
    lineStart: 60,
    lineEnd: 118,
    role: 'target model hidden state와 draft model 설정을 묶어 speculative token 제안을 준비하는 부분',
    boundary: 'hidden_size, max_batch_size, num_speculative_tokens, parallel_drafting 제한이 scheduler와 맞는지 본다.',
    excludes: 'RejectionSampler의 수용/거부 알고리즘은 별도 절단으로 둔다.',
    command: "pytest tests/spec_decode -k 'eagle or proposer or speculative' -q",
    notes: ['draft model 설정은 target model과 별도로 관리된다.', 'num_speculative_tokens가 scheduler lookahead block과 연결된다.', 'parallel_drafting은 추가 slot 계산을 바꾼다.'],
    invariants: [
      ['hidden state contract', 'target hidden state shape가 draft model 입력 shape와 맞아야 한다.'],
      ['batch bound', 'max_batch_size를 넘는 request는 제안 단계에서 걸러져야 한다.'],
      ['lookahead agreement', 'num_speculative_tokens와 scheduler lookahead block 수가 어긋나면 안 된다.'],
    ],
    tests: [
      ['T0 hidden shape', '정상 hidden state fixture를 넣는다.', 'draft 입력 shape가 맞는다.'],
      ['T1 too many tokens', 'num_speculative_tokens를 크게 설정한다.', 'budget/slot guard가 작동한다.'],
      ['T2 parallel drafting', 'parallel_drafting 설정을 켠다.', 'extra slot 계산이 달라진다.'],
    ],
    next: ['RejectionSampler.forward()', 'KVCacheManager.allocate_slots()'],
  },
];

const cutBySlug = new Map(cuts.map((cut) => [cut.slug, cut]));
const stages = [
  ['1. 입력 fixture', '함수가 받는 scheduler output, request, block, logits, app state를 최소 fixture로 만든다.'],
  ['2. 단일 함수 실행', '가능한 한 target 함수만 호출하고 주변 runtime은 mock 또는 고정 fixture로 둔다.'],
  ['3. 상태 변화 확인', 'request state, block ref count, token sequence, app state처럼 실제 변경되는 값을 본다.'],
  ['4. 반례 확인', 'budget 초과, cache miss, unsupported media, bad logits처럼 한 조건만 깨진 입력을 넣는다.'],
  ['5. 회귀 명령 고정', '해당 함수 주변 테스트만 좁게 실행하는 pytest command를 남긴다.'],
];

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
          <tr>{headers.map((header) => <th key={header} className="px-3 py-2 font-medium">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.join(':')} className="align-top">
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="px-3 py-3 leading-relaxed text-muted-foreground">
                  {index === 0 ? <span className="font-medium text-foreground">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VllmFunctionCut() {
  const { item } = useParams();
  const sidebar = useCodeSidebar();
  const cut = cutBySlug.get(item ?? '') ?? cuts[0]!;
  const currentIndex = cuts.findIndex((entry) => entry.slug === cut.slug);
  const previous = currentIndex > 0 ? cuts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < cuts.length - 1 ? cuts[currentIndex + 1] : null;
  const codeRefs = { [cut.slug]: sourceToCodeRef(cut) };
  const fileTree = fileTreeFor(cut);

  return (
    <>
      <section id="overview" className="mb-14 scroll-mt-20">
        <p className="mb-3 text-sm text-muted-foreground">vLLM 코드베이스에서 확인할 함수 경계</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{cut.title}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{cut.boundary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-semibold text-muted-foreground">대상 함수</p>
            <p className="mt-2 break-words font-mono text-sm">{cut.target}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs font-semibold text-muted-foreground">관련 코드 위치</p>
            <p className="mt-2 break-words font-mono text-sm">{cut.sourcePath}:{cut.lineStart}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border bg-muted/25 p-4">
          <p className="text-xs font-semibold text-muted-foreground">대표 실행 명령</p>
          <code className="mt-2 block break-words rounded bg-background px-3 py-2 text-xs text-muted-foreground">
            {cut.command}
          </code>
        </div>
      </section>

      <section id="sources" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">코드 소스 보기와 한글 주석</h2>
        <article className="rounded-lg border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="break-words font-mono text-xs text-muted-foreground">{cut.sourcePath}</p>
              <h3 className="mt-2 text-sm font-semibold">{cut.role}</h3>
            </div>
            <button
              type="button"
              onClick={() => sidebar.open(cut.slug, codeRefs[cut.slug])}
              className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
            >
              소스 보기
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {cut.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </article>
      </section>

      <section id="procedure" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">검증 절차</h2>
        <Table headers={['단계', '판단 기준']} rows={stages} />
      </section>

      <section id="invariants" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">불변조건</h2>
        <Table headers={['속성', '정식 문장']} rows={cut.invariants} />
      </section>

      <section id="tests" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">테스트 매트릭스</h2>
        <Table headers={['케이스', 'fixture 조작', '기대 결과']} rows={cut.tests} />
      </section>

      <section id="next" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">다음 함수 후보</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cut.next.map((entry) => (
            <div key={entry} className="rounded-lg border p-4 text-sm leading-relaxed text-muted-foreground">
              {entry}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={coreItemPath('ai-systems', 'vllm-test-units')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            개요로 돌아가기
          </Link>
          {previous && (
            <Link to={coreItemPath('ai-systems', previous.slug)} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              이전 함수
            </Link>
          )}
          {next && (
            <Link to={coreItemPath('ai-systems', next.slug)} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              다음 함수
            </Link>
          )}
        </div>
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: fileTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
