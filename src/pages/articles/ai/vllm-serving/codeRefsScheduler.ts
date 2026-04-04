import type { CodeRef } from '@/components/code/types';
import schedulerPy from './codebase/vllm/v1/core/sched/scheduler.py?raw';

export const schedulerCodeRefs: Record<string, CodeRef> = {
  'scheduler-schedule': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [341, 510],
    annotations: [
      { lines: [341, 351], color: 'sky',     note: 'schedule() — prefill/decode 구분 없이 토큰 단위로 스케줄링' },
      { lines: [358, 360], color: 'emerald', note: 'token_budget — 한 스텝에 스케줄할 수 있는 최대 토큰 수' },
      { lines: [376, 404], color: 'amber',   note: 'RUNNING 요청 순회 — num_new_tokens 계산 후 budget 차감' },
      { lines: [454, 464], color: 'violet',  note: 'allocate_slots 시도 → 실패하면 프리엠션 루프' },
      { lines: [468, 496], color: 'rose',    note: '프리엠션: 가장 낮은 우선순위 요청을 waiting에 반환' },
    ],
    desc:
`문제: Prefill과 Decode를 어떻게 하나의 배치에 섞을까요?

해결: vLLM V1은 "phase" 구분이 없습니다.
각 요청은 num_computed_tokens와 num_tokens_with_spec만 갖고 있고,
schedule()은 그 차이(= 새로 계산할 토큰 수)를 token_budget에서 차감합니다.
블록 할당 실패 시 가장 낮은 우선순위 요청을 프리엠션하여 메모리를 확보합니다.`,
  },

  'scheduler-update': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [1295, 1420],
    annotations: [
      { lines: [1295, 1307], color: 'sky',     note: 'update_from_output() — 모델 출력 수신' },
      { lines: [1338, 1352], color: 'emerald', note: '요청별 루프 — 생성된 토큰 추출' },
      { lines: [1362, 1383], color: 'amber',   note: 'Spec Decode 검증: 거부된 토큰만큼 num_computed_tokens 감소' },
      { lines: [1393, 1396], color: 'violet',  note: '정지 조건 체크 + 요청 상태 업데이트' },
      { lines: [1410, 1412], color: 'rose',    note: '완료된 요청 해제 → KV 블록 반환' },
    ],
    desc:
`문제: 모델 실행 결과를 스케줄러에 어떻게 반영할까요?

해결: update_from_output()은 ModelRunnerOutput을 순회하며:
① 생성된 토큰을 요청에 추가
② Spec Decode 시 거부된 토큰만큼 computed_tokens를 롤백
③ 정지 조건(max_tokens, EOS) 체크 후 완료된 요청의 KV 블록 해제`,
  },

  'scheduler-preempt': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [949, 969],
    annotations: [
      { lines: [949, 957], color: 'sky',     note: '_preempt_request — RUNNING 상태만 프리엠션 가능' },
      { lines: [958, 963], color: 'emerald', note: 'KV 캐시 + 인코더 캐시 해제, computed_tokens 초기화' },
      { lines: [968, 969], color: 'amber',   note: 'waiting 큐 맨 앞에 삽입 → 최우선 재스케줄링' },
    ],
    desc:
`문제: GPU 메모리가 부족하면 어떤 요청을 내보낼까요?

해결: _preempt_request()는 KV 캐시를 모두 해제하고 num_computed_tokens를 0으로 초기화합니다.
V1에서는 Swap(CPU 이동) 대신 Recomputation(재계산) 방식을 사용합니다.
프리엠션된 요청은 waiting 큐 맨 앞에 삽입되어 다음 스텝에서 최우선 처리됩니다.`,
  },
};
