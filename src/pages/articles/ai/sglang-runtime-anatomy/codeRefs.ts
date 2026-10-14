import type { CodeRef } from "@/components/code/types";
import memoryPool from "./codebase/sglang/python/sglang/srt/mem_cache/memory_pool.py?raw";
import prefillBudget from "./codebase/sglang/python/sglang/srt/mem_cache/prefill_budget.py?raw";
import schedulePolicy from "./codebase/sglang/python/sglang/srt/managers/schedule_policy.py?raw";
import scheduleBatch from "./codebase/sglang/python/sglang/srt/managers/schedule_batch.py?raw";
import scheduler from "./codebase/sglang/python/sglang/srt/managers/scheduler.py?raw";
import overlapUtils from "./codebase/sglang/python/sglang/srt/managers/overlap_utils.py?raw";
import ratioTracker from "./codebase/sglang/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py?raw";
import environ from "./codebase/sglang/python/sglang/srt/environ.py?raw";
import vllmScheduler from "./codebase/vllm/vllm/v1/core/sched/scheduler.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "req-to-token": {
    path: "sglang/python/sglang/srt/mem_cache/memory_pool.py",
    highlight: [374, 408],
    desc: "요청마다 한 행을 주고, 그 행에 token 위치마다 KV 칸 번호를 적습니다.",
    annotations: [
      {
        lines: [397, 407],
        color: "sky",
        note: "size=64, max_context_len=8192라면 (65, 8192) int32 표입니다. 0번 행은 CUDA graph가 채운 가짜 요청이 쓰도록 비워 둡니다.",
      },
    ],
    code: memoryPool,
    lang: "python",
  },
  "kv-buffer-shape": {
    path: "sglang/python/sglang/srt/mem_cache/memory_pool.py",
    highlight: [2518, 2582],
    desc: "기본 NHD 배치에서 층마다 K와 V를 따로 두고 첫 축을 token 칸으로 씁니다.",
    annotations: [
      {
        lines: [2525, 2529],
        color: "sky",
        note: "size=4096, page_size=1이면 첫 축은 4097행입니다. 덧붙인 한 행은 padding token의 가짜 쓰기를 받습니다.",
      },
      {
        lines: [2574, 2582],
        color: "amber",
        note: "층 수만큼 tensor를 만듭니다. 32층이면 K 32개와 V 32개입니다.",
      },
    ],
    code: memoryPool,
    lang: "python",
  },
  "clip-max-new": {
    path: "sglang/python/sglang/srt/managers/schedule_policy.py",
    highlight: [80, 87],
    desc: "수용 추정에서만 max_new_tokens를 4096으로 자릅니다.",
    annotations: [
      {
        lines: [82, 83],
        color: "amber",
        note: "자른 값은 장부에만 쓰입니다. max_new_tokens=32,000인 요청은 4096으로 셈하지만 실제로 32,000개까지 생성할 수 있습니다.",
      },
    ],
    code: schedulePolicy,
    lang: "python",
  },
  "running-offset": {
    path: "sglang/python/sglang/srt/managers/schedule_policy.py",
    highlight: [642, 649],
    desc: "이미 실행 중인 요청이 앞으로 쓸 칸을 비율로 줄여 장부에 미리 올립니다.",
    annotations: [
      {
        lines: [642, 649],
        color: "sky",
        note: "A·B·C가 각 1개를 생성한 직후라면 (1000-1)×0.7=699.3씩, 합 2,097.9칸을 예약합니다.",
      },
    ],
    code: schedulePolicy,
    lang: "python",
  },
  "ratio-offset": {
    path: "sglang/python/sglang/srt/managers/schedule_policy.py",
    highlight: [754, 764],
    desc: "실행 중 요청의 남은 출력 상한에 new_token_ratio를 곱합니다.",
    annotations: [
      {
        lines: [756, 756],
        color: "amber",
        note: "ignore_eos 요청은 일찍 끝날 수 없으므로 비율 1.0을 씁니다.",
      },
    ],
    code: schedulePolicy,
    lang: "python",
  },
  "new-request-charge": {
    path: "sglang/python/sglang/srt/managers/schedule_policy.py",
    highlight: [1336, 1354],
    desc: "새 요청은 입력 길이와 잘린 max_new_tokens 전체, page 하나를 더해 심사합니다.",
    annotations: [
      {
        lines: [1348, 1354],
        color: "sky",
        note: "입력 200, max_new 1000, page 1이면 total_tokens=1,201입니다. 이 값에는 비율을 곱하지 않습니다.",
      },
    ],
    code: schedulePolicy,
    lang: "python",
  },
  "prefill-budget": {
    path: "sglang/python/sglang/srt/mem_cache/prefill_budget.py",
    highlight: [99, 171],
    desc: "남은 칸에서 예약을 빼고, 새 요청이 그보다 작을 때만 받아들입니다.",
    annotations: [
      {
        lines: [114, 129],
        color: "sky",
        note: "부등호가 엄격합니다. 남은 1,201칸에 1,201칸짜리 요청은 들어가지 못합니다.",
      },
      {
        lines: [155, 171],
        color: "amber",
        note: "받아들인 요청은 입력+page와 max_new를 total_offset에 더해 같은 pass의 다음 심사에 반영합니다.",
      },
    ],
    code: prefillBudget,
    lang: "python",
  },
  "ratio-tracker": {
    path: "sglang/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py",
    highlight: [14, 50],
    desc: "비율의 시작값·바닥·한 step 감소량과 retract 뒤 재추정식을 정합니다.",
    annotations: [
      {
        lines: [21, 32],
        color: "sky",
        note: "기본값이면 init=0.7, min=0.7×0.14=0.098, decay=(0.7−0.098)/600≈0.001003입니다.",
      },
      {
        lines: [41, 50],
        color: "amber",
        note: "남은 요청이 250·200·150개를 생성했다면 (600+20×3)/(3000+1)≈0.2199입니다.",
      },
    ],
    code: ratioTracker,
    lang: "python",
  },
  "ratio-env": {
    path: "sglang/python/sglang/srt/environ.py",
    highlight: [597, 601],
    desc: "비율 계산에 쓰는 다섯 기본값입니다.",
    annotations: [
      {
        lines: [597, 601],
        color: "sky",
        note: "0.7, 0.14, 600 step, retract 여유 20 step, 추정 상한 4096입니다.",
      },
    ],
    code: environ,
    lang: "python",
  },
  "decode-mem": {
    path: "sglang/python/sglang/srt/managers/schedule_batch.py",
    highlight: [3281, 3298],
    desc: "다음 decode 한 번에 필요한 칸이 있는지만 확인합니다.",
    annotations: [
      {
        lines: [3287, 3298],
        color: "sky",
        note: "page 1에서 요청 9개는 다음 step에 9칸이 필요합니다. 미래의 출력 전체가 아니라 바로 다음 칸을 봅니다.",
      },
    ],
    code: scheduleBatch,
    lang: "python",
  },
  "retract-decode": {
    path: "sglang/python/sglang/srt/managers/schedule_batch.py",
    highlight: [3300, 3388],
    desc: "자리가 날 때까지 요청을 하나씩 빼 대기열로 돌려보내고 비율을 다시 셉니다.",
    annotations: [
      {
        lines: [3315, 3337],
        color: "sky",
        note: "목록 끝의 요청부터 빼며, KV를 radix tree에 넣지 않고 바로 반환합니다.",
      },
      {
        lines: [3381, 3388],
        color: "amber",
        note: "남은 요청만으로 new_token_ratio를 다시 계산해 돌려줍니다.",
      },
    ],
    code: scheduleBatch,
    lang: "python",
  },
  "retract-order": {
    path: "sglang/python/sglang/srt/managers/schedule_batch.py",
    highlight: [3390, 3429],
    desc: "기본 순서는 출력을 적게 만든 요청을 먼저 뺍니다.",
    annotations: [
      {
        lines: [3401, 3402],
        color: "sky",
        note: "출력 250·200·150·100이면 내림차순 정렬 뒤 끝의 100짜리가 먼저 빠집니다. 출력 수가 같으면 입력이 긴 요청이 먼저 빠집니다.",
      },
    ],
    code: scheduleBatch,
    lang: "python",
  },
  "update-running": {
    path: "sglang/python/sglang/srt/managers/scheduler.py",
    highlight: [4320, 4420],
    desc: "decode 직전에 길이로 끝날 요청을 빼고, 칸이 모자라면 retract, 아니면 비율을 한 step 줄입니다.",
    annotations: [
      {
        lines: [4320, 4333],
        color: "sky",
        note: "앞 step의 결과가 max_new_tokens 도달로 끝날 요청은 결과를 기다리지 않고 이번 batch에서 뺍니다.",
      },
      {
        lines: [4416, 4418],
        color: "amber",
        note: "retract가 없던 step마다 decay_step이 불립니다.",
      },
    ],
    code: scheduler,
    lang: "python",
  },
  "overlap-loop": {
    path: "sglang/python/sglang/srt/managers/scheduler.py",
    highlight: [1975, 2048],
    desc: "이번 batch를 GPU에 넘긴 뒤에야 앞 batch의 결과를 처리합니다.",
    annotations: [
      {
        lines: [2021, 2026],
        color: "sky",
        note: "run_batch는 결과를 기다리지 않고 돌아오며, 결과 묶음은 result_queue에 쌓입니다.",
      },
      {
        lines: [2031, 2034],
        color: "amber",
        note: "앞 batch의 결과 처리가 지금 batch의 GPU 실행과 겹칩니다. 결과는 한 step 늦게 반영됩니다.",
      },
    ],
    code: scheduler,
    lang: "python",
  },
  "overlap-disable": {
    path: "sglang/python/sglang/srt/managers/scheduler.py",
    highlight: [2050, 2086],
    desc: "겹치기를 끄는 두 조건입니다.",
    annotations: [
      {
        lines: [2066, 2070],
        color: "sky",
        note: "연속 prefill에서 끄는 선택은 환경 변수로만 켜지며 기본값은 False입니다.",
      },
    ],
    code: scheduler,
    lang: "python",
  },
  "future-map": {
    path: "sglang/python/sglang/srt/managers/overlap_utils.py",
    highlight: [87, 121],
    desc: "다음 decode의 입력 token을 CPU가 아니라 GPU 버퍼에서 바로 읽습니다.",
    annotations: [
      {
        lines: [116, 121],
        color: "sky",
        note: "req_pool_idx로 output_tokens_buf를 모읍니다. CPU는 앞 step의 token 값을 몰라도 다음 step을 제출할 수 있습니다.",
      },
    ],
    code: overlapUtils,
    lang: "python",
  },
  "vllm-preempt": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [575, 626],
    desc: "vLLM은 이번 step에 필요한 block만 요구하고, 실패하면 실행 중 요청을 선점합니다.",
    annotations: [
      {
        lines: [578, 586],
        color: "sky",
        note: "allocate_slots가 None이면 자리가 없다는 뜻입니다. 미래 출력을 미리 예약하지 않습니다.",
      },
      {
        lines: [614, 626],
        color: "amber",
        note: "기본 FCFS에서는 running 목록의 마지막 요청을 선점합니다.",
      },
    ],
    code: vllmScheduler,
    lang: "python",
  },
};
