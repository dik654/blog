import type { CodeRef } from '@/components/code/types';
import engineCorePy from './codebase/vllm/v1/engine/core.py?raw';
import schedulerPy from './codebase/vllm/v1/core/sched/scheduler.py?raw';
import kvCacheMgrPy from './codebase/vllm/v1/core/kv_cache_manager.py?raw';
import apiServerPy from './codebase/vllm/entrypoints/openai/api_server.py?raw';
import gpuWorkerPy from './codebase/vllm/v1/worker/gpu_worker.py?raw';

export const sharedCodeRefs: Record<string, CodeRef> = {
  'engine-core': {
    path: 'vllm/v1/engine/core.py',
    code: engineCorePy,
    lang: 'python',
    highlight: [85, 148],
    annotations: [
      { lines: [85, 107], color: 'sky', note: 'EngineCore.__init__ — plugin을 먼저 로드하고 runtime config를 기록' },
      { lines: [111, 122], color: 'emerald', note: 'Executor 생성 뒤 available memory를 profile해 KV cache를 초기화' },
      { lines: [123, 148], color: 'amber', note: 'Structured-output manager와 scheduler class를 준비하고 실제 Scheduler instance를 생성' },
    ],
    desc:
`문제: LLM 추론 엔진의 핵심 루프를 어떻게 구성할까요?

해결: EngineCore는 vLLM V1의 내부 루프입니다.
① Executor(GPU Worker)를 생성하여 모델을 로드
② KV 캐시를 프로파일링하고 초기화
③ Scheduler를 생성하여 요청 배치를 관리
step() 메서드에서 schedule → execute → output 파이프라인을 실행합니다.`,
  },

  'engine-step': {
    path: 'vllm/v1/engine/core.py',
    code: engineCorePy,
    lang: 'python',
    highlight: [378, 407],
    annotations: [
      { lines: [378, 389], color: 'sky',     note: 'step() — 스케줄러 호출, 실행 요청 생성' },
      { lines: [390, 398], color: 'emerald', note: '비동기 모델 실행 → 토큰 샘플링' },
      { lines: [400, 407], color: 'amber', note: '중단 처리, scheduler 상태 갱신, 실제 scheduled token이 있었는지 반환' },
    ],
    desc:
`문제: 매 스텝마다 스케줄링, 모델 실행, 출력 처리를 효율적으로 파이프라이닝해야 합니다.

해결: step()은 3단계로 동작합니다.
① scheduler.schedule() — 대기 중인 요청에서 배치 구성
② model_executor.execute_model() — GPU에서 비동기 추론 실행
③ scheduler.update_from_output() — 완료된 토큰 반영, 요청 상태 갱신
마지막 boolean은 상수가 아니라 total_num_scheduled_tokens > 0으로 실제 model 실행 여부를 알립니다.`,
  },

  'kv-cache-mgr': {
    path: 'vllm/v1/core/kv_cache_manager.py',
    code: kvCacheMgrPy,
    lang: 'python',
    highlight: [106, 155],
    annotations: [
      { lines: [106, 119], color: 'sky',     note: 'KVCacheManager.__init__ — config, caching 설정' },
      { lines: [131, 144], color: 'emerald', note: 'coordinator + block_pool 초기화 — 블록 할당 관리' },
      { lines: [146, 153], color: 'amber',   note: 'empty_kv_cache_blocks — GC 오버헤드 방지용 프리빌트 객체' },
    ],
    desc:
`문제: PagedAttention에서 KV 캐시 블록을 효율적으로 할당/해제해야 합니다.

해결: KVCacheManager는 블록 풀(block_pool) 기반으로 KV 캐시를 관리합니다.
coordinator가 블록 할당/해제를 조율하며, prefix caching으로 중복 계산을 방지합니다.
빈 KVCacheBlocks를 미리 생성해 GC 오버헤드를 최소화합니다.`,
  },

  'scheduler': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [67, 110],
    annotations: [
      { lines: [67, 80], color: 'sky',     note: 'Scheduler 클래스 — SchedulerInterface 구현' },
    ],
    desc:
`문제: 여러 요청을 GPU 메모리 제약 내에서 최적으로 배치해야 합니다.

해결: Scheduler는 Continuous Batching을 구현하여,
새 요청(prefill)과 진행 중인 요청(decode)을 동적으로 배치에 추가/제거합니다.
KV 캐시 가용량에 따라 요청 우선순위를 결정합니다.`,
  },

  'api-server': {
    path: 'vllm/entrypoints/openai/api_server.py',
    code: apiServerPy,
    lang: 'python',
    highlight: [165, 221],
    annotations: [
      { lines: [165, 190], color: 'sky', note: 'build_app() — FastAPI application을 만들고 공통 vLLM route를 등록' },
      { lines: [192, 209], color: 'emerald', note: 'Model route와 generate task router를 조건에 맞게 연결' },
      { lines: [211, 221], color: 'amber', note: 'Disaggregated serving과 RLHF router를 generate app에 추가' },
    ],
    desc:
`문제: vLLM을 OpenAI API와 호환되는 서빙 엔드포인트로 제공해야 합니다.

해결: FastAPI 기반 서버가 /v1/completions, /v1/chat/completions 등의
OpenAI 호환 API를 제공합니다. 이 범위는 endpoint handler 자체가 아니라 task별 router를 FastAPI app에 연결하는 composition root입니다.`,
  },

  'gpu-worker-execute': {
    path: 'vllm/v1/worker/gpu_worker.py',
    code: gpuWorkerPy,
    lang: 'python',
    highlight: [759, 820],
    annotations: [
      { lines: [759, 769], color: 'sky', note: 'execute_model() — 이전 pipeline send를 끝낸 뒤 scheduled token 유무로 forward 여부를 결정' },
      { lines: [775, 803], color: 'emerald', note: 'Pipeline parallel과 sequence parallel 조건에서 batch shape와 all-gather 요구를 준비' },
      { lines: [804, 820], color: 'amber', note: '이전 pipeline rank의 tensor를 비동기로 받고 model_runner.execute_model()에 위임' },
    ],
    desc:
`문제: EngineCore가 만든 SchedulerOutput은 실제 GPU 실행으로 어떻게 이어질까요?

해결: GPUWorker.execute_model()은 scheduled token이 있을 때만 forward path를 엽니다.
Pipeline parallel 환경이면 이전 rank의 intermediate tensor를 비동기로 받고,
마지막에는 GPUModelRunner에 scheduler output과 intermediate state를 함께 넘깁니다.`,
  },
};
