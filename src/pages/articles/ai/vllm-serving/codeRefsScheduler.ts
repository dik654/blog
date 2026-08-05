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
schedule()은 num_tokens_with_spec에 async output placeholder를 더한 뒤
num_computed_tokens를 빼서 새로 계산할 token 수를 정하고 token_budget에서 차감합니다.
블록 할당 실패 시 가장 낮은 우선순위 요청을 프리엠션하여 메모리를 확보합니다.`,
  },

  'scheduler-update': {
    path: 'vllm/v1/core/sched/scheduler.py',
    code: schedulerPy,
    lang: 'python',
    highlight: [1275, 1420],
    annotations: [
      { lines: [1275, 1287], color: 'sky',     note: 'update_from_output() — 모델 실행 결과 장부를 수신' },
      { lines: [1312, 1336], color: 'emerald', note: '요청별 루프 — 생성된 토큰 ID 추출' },
      { lines: [1338, 1362], color: 'amber',   note: 'Spec Decode 검증 — 거부된 토큰만큼 computed token 장부 롤백' },
      { lines: [1371, 1391], color: 'violet',  note: '정지 조건 확인 뒤 완료된 요청의 KV 블록 해제' },
      { lines: [1406, 1416], color: 'rose',    note: 'Structured Output grammar에 확정 토큰 반영' },
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
    highlight: [929, 949],
    annotations: [
      { lines: [929, 937], color: 'sky',     note: '_preempt_request — RUNNING 상태만 프리엠션 가능' },
      { lines: [938, 944], color: 'emerald', note: 'KV·인코더 캐시 해제 뒤 computed token 장부 초기화' },
      { lines: [948, 949], color: 'amber',   note: 'waiting 큐 맨 앞에 삽입 → 다음 스텝 우선 재시도' },
    ],
    desc:
`문제: GPU 메모리가 부족하면 어떤 요청을 내보낼까요?

해결: _preempt_request()는 KV 캐시를 모두 해제하고 num_computed_tokens를 0으로 초기화합니다.
V1에서는 Swap(CPU 이동) 대신 Recomputation(재계산) 방식을 사용합니다.
프리엠션된 요청은 waiting 큐 맨 앞에 삽입되어 다음 스텝에서 최우선 처리됩니다.`,
  },
};
