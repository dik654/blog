import type { CodeRef } from "@/components/code/types";
import schedulerPy from "./codebase/vllm/v1/core/sched/scheduler.py?raw";
import requestPy from "./codebase/vllm/v1/request.py?raw";
import requestQueuePy from "./codebase/vllm/v1/core/sched/request_queue.py?raw";
export const codeRefs: Record<string, CodeRef> = {
  "priority-ordering": {
    path: "vllm/v1/request.py",
    code: requestPy,
    lang: "python",
    highlight: [334, 345],
    desc: "v0.27.1 고정 원문입니다. 작은 priority, 도착 시각, request_id, 객체 id 순서로 비교합니다.",
    annotations: [
      {
        lines: [339, 340],
        color: "sky",
        note: "작은 priority 값이 먼저입니다.",
      },
      {
        lines: [341, 342],
        color: "emerald",
        note: "priority가 같으면 먼저 도착한 요청을 앞세웁니다.",
      },
      {
        lines: [343, 345],
        color: "amber",
        note: "같은 두 값 뒤에도 요청 식별자와 객체 id로 동률을 구분합니다.",
      },
    ],
  },
  "priority-queue": {
    path: "vllm/v1/core/sched/request_queue.py",
    code: requestQueuePy,
    lang: "python",
    highlight: [131, 165],
    desc: "같은 prepend 호출이어도 FCFS는 앞에 넣고 priority queue는 기존 비교 규칙으로 heap에 넣습니다. 전체 원문의 줄 번호를 보존했습니다.",
    annotations: [
      {
        lines: [78, 94],
        color: "sky",
        note: "FCFS는 새 요청을 뒤에, prepend 요청을 앞에 넣습니다.",
      },
      {
        lines: [144, 152],
        color: "emerald",
        note: "Priority queue는 Request.__lt__를 사용하는 heap으로 삽입·추출합니다.",
      },
      {
        lines: [160, 165],
        color: "amber",
        note: "Priority의 prepend는 맨 앞 삽입이 아니라 add_request 재사용입니다.",
      },
    ],
  },
  "preempt-chunk": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [516, 523],
    desc: "진행 요청의 남은 양을 요청별 상한과 전체 잔여 예산으로 제한합니다. 새 대기 요청 수용 경로와 추가 조건도 원문에 남아 있습니다.",
    annotations: [
      {
        lines: [516, 520],
        color: "sky",
        note: "목표 위치와 이미 계산한 위치의 차이를 구합니다. 비동기 placeholder도 반영됩니다.",
      },
      {
        lines: [521, 523],
        color: "emerald",
        note: "P의 남은 9를 상한 4로 줄이고 전체 잔여 3으로 다시 제한합니다.",
      },
      {
        lines: [631, 638],
        color: "amber",
        note: "요청별 배정량을 기록하고 전체 예산에서 차감합니다.",
      },
    ],
  },
  "preempt-request": {
    path: "vllm/v1/core/sched/scheduler.py",
    code: schedulerPy,
    lang: "python",
    highlight: [1274, 1315],
    desc: "전체 원문에서 블록 해제·상태 변경·진행 값 초기화·진행 중 결과 관리·재삽입을 확인합니다. 서버 응답과 실행 counter의 시점을 구분합니다.",
    annotations: [
      {
        lines: [1287, 1296],
        color: "sky",
        note: "RUNNING인지 검사한 뒤 KV·인코더 기록을 해제하고 PREEMPTED와 계산 위치 0을 설정합니다.",
      },
      {
        lines: [1297, 1309],
        color: "emerald",
        note: "비동기 실행에서 뒤늦게 돌아오는 결과가 초기화한 counter를 잘못 바꾸지 않도록 상태를 남깁니다.",
      },
      {
        lines: [1313, 1315],
        color: "amber",
        note: "실제 재삽입 위치는 waiting queue의 FCFS 또는 priority 구현이 결정합니다.",
      },
    ],
  },
};
