import type { CodeRef } from "@/components/code/types";
import schedulerPy from "./codebase/vllm/v1/core/sched/scheduler.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "schedule-resource-feasibility": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [7, 69],
    desc: "문제: 이번 GPU iteration에 RUNNING request를 얼마나, 어떤 순서로 태울지 정해야 하고, token budget은 남아도 KV block이 없을 수 있습니다.\n\n해결: token_budget이 남아 있는 동안 RUNNING queue를 순회하며 매 request마다 KV block 할당을 먼저 시도하고, 실패하면 낮은 우선순위 request를 preempt해 재시도합니다.",
    annotations: [
      { lines: [14, 14], color: "sky", note: "n_tok ≤ B_tok의 B_tok — 이번 iteration의 전체 token 예산" },
      { lines: [22, 28], color: "emerald", note: "이번 request가 이번 step에 처리할 token 수를 남은 예산으로 clip" },
      { lines: [37, 45], color: "amber", note: "M_KV^need ≤ M_KV^free 확인 — allocate_slots가 성공하면 즉시 break" },
      { lines: [47, 58], color: "violet", note: "실패하면 preempt로 KV block을 회수하고 재시도, 더 뺏을 게 없으면 포기" },
      { lines: [64, 68], color: "sky", note: "확정된 request만큼 token_budget을 차감 — 다음 request가 볼 예산이 줄어듦" },
    ],
  },
};
