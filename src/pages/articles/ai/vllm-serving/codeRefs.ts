import type { CodeRef } from "@/components/code/types";
import schedulerPy from "./codebase/vllm/v1/core/sched/scheduler.py?raw";
export const codeRefs: Record<string, CodeRef> = {
  "schedule-resource-feasibility": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [516, 523],
    desc: "vLLM v0.27.1, commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac의 전체 원문입니다. 남은 계산량·token 예산·KV 할당·정책에 따른 preemption을 별도로 확인합니다. 원문의 줄 번호를 보존했습니다.",
    annotations: [
      {
        lines: [459, 462],
        color: "sky",
        note: "이번 실행의 예산입니다. 전체 일시 정지 상태이면 0으로 바꿉니다.",
      },
      {
        lines: [516, 523],
        color: "emerald",
        note: "사례 A의 6−4=2를 구하고 남은 예산 4와 비교합니다. 추가 조건도 통과해야 실행됩니다.",
      },
      {
        lines: [575, 586],
        color: "amber",
        note: "추가 KV 블록을 확보한 경우에만 이 반복에서 나갑니다.",
      },
      {
        lines: [590, 625],
        color: "violet",
        note: "우선순위 정책과 기본 정책이 다른 요청을 선택할 수 있습니다. 이미 계획한 요청을 빼면 예산도 되돌립니다.",
      },
      {
        lines: [631, 638],
        color: "sky",
        note: "확정한 요청을 기록하고 실제 선택량만큼 예산을 차감합니다.",
      },
      {
        lines: [683, 692],
        color: "emerald",
        note: "기다리는 요청을 넣을 때 현재 요청 수 상한도 검사합니다.",
      },
    ],
  },
};
