import type { CodeRef } from "@/components/code/types";
import loraConfig from "./codebase/vllm/vllm/config/lora.py?raw";
import baseLinear from "./codebase/vllm/vllm/lora/layers/base_linear.py?raw";
import modelManager from "./codebase/vllm/vllm/lora/model_manager.py?raw";
import workerManager from "./codebase/vllm/vllm/lora/worker_manager.py?raw";
import punicaGpu from "./codebase/vllm/vllm/lora/punica_wrapper/punica_gpu.py?raw";
import kernelMeta from "./codebase/vllm/vllm/lora/ops/triton_ops/lora_kernel_metadata.py?raw";
import shrinkOp from "./codebase/vllm/vllm/lora/ops/triton_ops/lora_shrink_op.py?raw";
import scheduler from "./codebase/vllm/vllm/v1/core/sched/scheduler.py?raw";
import kvUtils from "./codebase/vllm/vllm/v1/core/kv_cache_utils.py?raw";
import capacityScheduler from "./codebase/trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp?raw";
import llmRequest from "./codebase/trtllm/tensorrt_llm/_torch/pyexecutor/llm_request.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "segment-metadata": {
    path: "vllm/vllm/lora/ops/triton_ops/lora_kernel_metadata.py",
    highlight: [135, 168],
    desc: "token마다 붙은 adapter 번호를 정렬해 adapter별 연속 구간을 만듭니다.",
    annotations: [
      {
        lines: [135, 168],
        color: "sky",
        note: "번호 [0,1,0,2]를 안정 정렬하면 token 순서 [0,2,1,3]입니다. unique는 id [0,1,2]와 개수 [2,1,1]을 주고, 누적합이 시작 위치 [0,2,3,4]를 만듭니다.",
      },
    ],
    code: kernelMeta,
    lang: "python",
  },
  "shrink-kernel": {
    path: "vllm/vllm/lora/ops/triton_ops/lora_shrink_op.py",
    highlight: [70, 92],
    desc: "kernel 격자의 한 축이 adapter 하나를 맡고 자기 구간의 token만 읽습니다.",
    annotations: [
      {
        lines: [70, 92],
        color: "sky",
        note: "lora_idx=0 프로그램은 개수 2와 시작 0을 읽어 token 0·2를 처리합니다. id가 -1인 base 전용 token 구간은 바로 빠져나갑니다.",
      },
    ],
    code: shrinkOp,
    lang: "python",
  },
  "shrink-expand": {
    path: "vllm/vllm/lora/punica_wrapper/punica_gpu.py",
    highlight: [215, 263],
    desc: "y += x·A·B를 낮은 차원으로 줄이는 단계와 다시 펼치는 단계 두 번으로 나눕니다.",
    annotations: [
      {
        lines: [242, 263],
        color: "sky",
        note: "r=16이면 중간 buffer는 token 4개 × 16칸입니다. shrink가 4096칸을 16칸으로 줄이고 expand가 다시 4096칸에 더합니다.",
      },
    ],
    code: punicaGpu,
    lang: "python",
  },
  "stacked-slots": {
    path: "vllm/vllm/lora/layers/base_linear.py",
    highlight: [129, 150],
    desc: "시작할 때 max_loras개 슬롯을 max_lora_rank 크기로 미리 잡습니다.",
    annotations: [
      {
        lines: [129, 150],
        color: "sky",
        note: "슬롯 크기는 max_lora_rank로 고정됩니다. rank 8 adapter를 rank 16 슬롯에 넣으면 그 슬롯의 절반만 씁니다.",
      },
    ],
    code: baseLinear,
    lang: "python",
  },
  "set-lora": {
    path: "vllm/vllm/lora/layers/base_linear.py",
    highlight: [174, 184],
    desc: "CPU에 있던 A·B를 GPU 슬롯의 앞부분에 복사합니다.",
    annotations: [
      {
        lines: [179, 184],
        color: "sky",
        note: ":lora_a.shape[0]까지만 복사하므로 rank가 작으면 슬롯 뒤쪽은 0으로 남습니다.",
      },
    ],
    code: baseLinear,
    lang: "python",
  },
  "lora-config": {
    path: "vllm/vllm/config/lora.py",
    highlight: [35, 47],
    desc: "한 batch의 adapter 수, 최대 rank, CPU에 둘 adapter 수를 정합니다.",
    annotations: [
      {
        lines: [35, 47],
        color: "sky",
        note: "max_loras 기본 1, max_lora_rank 기본 16입니다. max_cpu_loras를 비우면 max_loras와 같아집니다(118–119행).",
      },
    ],
    code: loraConfig,
    lang: "python",
  },
  "slot-activate": {
    path: "vllm/vllm/lora/model_manager.py",
    highlight: [288, 340],
    desc: "CPU 등록 수와 GPU 슬롯 수를 다른 한도로 두고 빈 슬롯에 adapter를 올립니다.",
    annotations: [
      {
        lines: [288, 295],
        color: "sky",
        note: "capacity는 max_cpu_loras, lora_slots는 max_loras입니다. 두 층의 cache가 따로 있습니다.",
      },
      {
        lines: [308, 340],
        color: "emerald",
        note: "첫 빈 슬롯 번호를 찾아 각 layer의 set_lora를 호출합니다. 빈 슬롯이 없으면 오류이므로 LRU 쪽이 먼저 비워 둡니다.",
      },
    ],
    code: modelManager,
    lang: "python",
  },
  "lru-evict": {
    path: "vllm/vllm/lora/model_manager.py",
    highlight: [1191, 1209],
    desc: "GPU 슬롯이 가득 차면 가장 오래 쓰지 않은 adapter를 슬롯에서 내립니다.",
    annotations: [
      {
        lines: [1195, 1202],
        color: "sky",
        note: "슬롯 2개가 A·B로 찼을 때 C가 오면 마지막 사용이 더 오래된 쪽을 내리고 C를 올립니다. CPU 쪽 등록은 그대로 남습니다.",
      },
    ],
    code: modelManager,
    lang: "python",
  },
  "worker-load": {
    path: "vllm/vllm/lora/worker_manager.py",
    highlight: [285, 319],
    desc: "처음 보는 adapter를 먼저 읽고 검증한 뒤 CPU cache 한도를 넘으면 가장 오래된 것을 지웁니다.",
    annotations: [
      {
        lines: [296, 311],
        color: "sky",
        note: "읽기에 실패하면 기존 adapter를 내리지 않습니다. 성공한 뒤에만 오래된 등록을 하나 지웁니다.",
      },
    ],
    code: workerManager,
    lang: "python",
  },
  "max-loras-skip": {
    path: "vllm/vllm/v1/core/sched/scheduler.py",
    highlight: [724, 737],
    desc: "이번 step에 이미 max_loras종류가 있으면 새 adapter 요청을 대기열에 돌려 둡니다.",
    annotations: [
      {
        lines: [724, 737],
        color: "sky",
        note: "max_loras=2이고 A·B가 이미 들어갔다면 C 요청은 건너뛰고, 뒤에 있는 A 요청은 들어갑니다. break가 아니라 continue입니다.",
      },
    ],
    code: scheduler,
    lang: "python",
  },
  "peft-claim": {
    path: "trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp",
    highlight: [135, 146],
    desc: "같은 adapter(task id)를 쓰는 요청이 여럿이어도 page는 한 번만 셉니다.",
    annotations: [
      {
        lines: [139, 145],
        color: "sky",
        note: "uniqTaskIds에 이미 있는 task는 0 page로 셉니다. 요청 넷이 adapter 셋을 쓰면 page 계산은 세 번입니다.",
      },
    ],
    code: capacityScheduler,
    lang: "c",
  },
  "peft-admit": {
    path: "trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp",
    highlight: [417, 446],
    desc: "KV block과 adapter page가 모두 남을 때만 새 요청을 받습니다.",
    annotations: [
      {
        lines: [421, 431],
        color: "sky",
        note: "page만 모자라면 이 요청을 건너뛰고 다음 요청을 봅니다. KV block이 모자랄 때만 break합니다.",
      },
    ],
    code: capacityScheduler,
    lang: "c",
  },
  "prompt-table": {
    path: "trtllm/tensorrt_llm/_torch/pyexecutor/llm_request.py",
    highlight: [1594, 1608],
    desc: "요청에 붙은 prompt tuning 표를 실행 요청 객체로 넘깁니다.",
    annotations: [
      {
        lines: [1604, 1607],
        color: "sky",
        note: "embedding_table의 행 수가 prompt_vocab_size가 됩니다. 가상 token 20개면 20행입니다.",
      },
    ],
    code: llmRequest,
    lang: "python",
  },
  "cache-key": {
    path: "vllm/vllm/v1/core/kv_cache_utils.py",
    highlight: [517, 590],
    desc: "prefix cache의 block hash에 LoRA 이름과 prompt embedding hash를 함께 넣습니다.",
    annotations: [
      {
        lines: [517, 529],
        color: "sky",
        note: "같은 token 열이라도 adapter A와 B는 다른 hash를 받습니다. adapter가 바꾼 K·V를 섞어 쓰지 않게 합니다.",
      },
      {
        lines: [531, 555],
        color: "emerald",
        note: "prompt_embeds가 있으면 block 범위의 embedding 값을 SHA-256으로 묶어 key에 넣습니다.",
      },
    ],
    code: kvUtils,
    lang: "python",
  },
};
