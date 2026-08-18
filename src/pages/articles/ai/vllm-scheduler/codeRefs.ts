import type { CodeRef } from "@/components/code/types";
import schedulerPy from "./codebase/vllm/v1/core/sched/scheduler.py?raw";
import requestPy from "./codebase/vllm/v1/request.py?raw";
import requestQueuePy from "./codebase/vllm/v1/core/sched/request_queue.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "priority-ordering": {
    path: "vllm/v1/request.py",
    code: requestPy,
    lang: "python",
    highlight: [4, 20],
    desc: "문제: Priority scheduling에서 두 요청 중 어느 쪽을 먼저 볼지 결정적으로 정해야 합니다.\n\n해결: Request.__lt__가 (priority, arrival_time, request_id, object id) 순서로 비교 규칙을 정의합니다. 이 규칙 그대로 PriorityRequestQueue가 Python heapq에 위임합니다.",
    annotations: [
      { lines: [10, 12], color: "sky", note: "priority 값이 작을수록 우선 — article의 p_i < p_j" },
      { lines: [13, 15], color: "emerald", note: "priority가 같으면 arrival_time으로 tie-break — article의 a_i < a_j" },
      { lines: [16, 20], color: "amber", note: "article 식에는 없는 실제 구현의 추가 tie-break(request_id → object id)로 완전한 전순서를 보장" },
    ],
  },
  "priority-queue": {
    path: "vllm/v1/core/sched/request_queue.py",
    code: requestQueuePy,
    lang: "python",
    highlight: [4, 34],
    desc: "문제: 위에서 정의한 비교 규칙을 실제 queue 자료구조에 어떻게 반영할지 정해야 합니다.\n\n해결: PriorityRequestQueue는 자체 비교 로직을 새로 짜지 않고, Request.__lt__가 지원하는 Python heapq(min-heap)에 그대로 위임합니다.",
    annotations: [
      { lines: [17, 19], color: "sky", note: "heapq.heappush가 Request.__lt__ 순서를 그대로 사용해 삽입" },
      { lines: [27, 34], color: "emerald", note: "Preemption으로 되돌아온 request도 앞이 아니라 같은 priority 규칙으로 재삽입" },
    ],
  },
  "preempt-chunk": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [19, 24],
    desc: "문제: 긴 prefill 하나가 token budget을 통째로 차지하면 그 사이 decode 요청이 계속 밀립니다.\n\n해결: schedule() 안에서 이번 request가 쓸 token 수를 long_prefill_token_threshold로 먼저 자르고, 남은 token_budget으로 한 번 더 clip합니다.",
    annotations: [
      { lines: [19, 22], color: "sky", note: "C=⌈P/c⌉의 c — 긴 prefill을 threshold 이하 조각으로 자름" },
      { lines: [23, 24], color: "emerald", note: "chunk를 자른 뒤에도 남은 전체 token_budget으로 다시 상한 적용" },
    ],
  },
  "preempt-request": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [27, 55],
    desc: "문제: KV block이 모자라 실행할 수 없는 request를 어떻게 안전하게 되돌릴지 정해야 합니다.\n\n해결: KV·encoder cache를 모두 반환하고 상태를 PREEMPTED로 바꾼 뒤 진행 counter를 0으로 재설정하고, WAITING queue의 policy 규칙 그대로 다시 넣습니다.",
    annotations: [
      { lines: [38, 41], color: "sky", note: "KV block과 encoder cache 반환 — article의 n_r^hit이 재개 시 다시 채워야 할 부분" },
      { lines: [43, 49], color: "emerald", note: "상태 전이(RUNNING→PREEMPTED)와 num_computed_tokens=0 재설정 — article의 n_r^before가 0으로 리셋되는 지점" },
      { lines: [54, 55], color: "amber", note: "WAITING queue에 재삽입 — FCFS/PRIORITY policy를 그대로 재사용" },
    ],
  },
};
