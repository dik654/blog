import type { CodeRef } from "@/components/code/types";
import attentionPy from "./codebase/vllm/vllm/model_executor/layers/attention/attention.py?raw";
import envsPy from "./codebase/vllm/vllm/envs.py?raw";
import cacheKernels from "./codebase/vllm/csrc/libtorch_stable/cache_kernels.cu?raw";
import quantUtils from "./codebase/vllm/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh?raw";
import ggmlCommon from "./codebase/llama.cpp/ggml/src/ggml-common.h?raw";
import llamaContext from "./codebase/llama.cpp/src/llama-context.cpp?raw";

export const codeRefs: Record<string, CodeRef> = {
  "scale-defaults": {
    path: "vllm/vllm/model_executor/layers/attention/attention.py",
    highlight: [124, 150],
    desc: "scale을 따로 정하지 않으면 1.0으로 두고, 나중에 계산할 때 쓸 상한 상수를 붙입니다.",
    annotations: [
      { lines: [126, 135], color: "sky", note: "보정 없이 kv_cache_dtype=fp8만 켜면 k·v scale은 1.0입니다. FP8은 지수가 있어 0.47이 0.46875로 저장되지만, 448을 넘는 값은 그대로 잘립니다." },
      { lines: [148, 150], color: "amber", note: "k_range=200, v_range=100입니다. 가장 큰 값을 448이 아닌 200·100에 맞춰 두어 나중에 더 큰 값이 와도 여유를 둡니다." },
    ],
    code: attentionPy,
    lang: "python",
  },
  "calc-scales": {
    path: "vllm/vllm/model_executor/layers/attention/attention.py",
    highlight: [584, 594],
    desc: "warmup의 첫 batch 하나에서 가장 큰 절댓값을 보고 scale을 한 번만 정합니다.",
    annotations: [
      { lines: [586, 587], color: "sky", note: "max|k|가 4.0이면 k_scale = 4.0 ÷ 200 = 0.02입니다. 이 글의 네 값 사례가 이 식을 씁니다." },
      { lines: [593, 594], color: "amber", note: "계산 뒤 플래그를 끕니다. 그 뒤에 처음 보는 12.0 같은 큰 값은 scale을 다시 넓히지 못합니다." },
    ],
    code: attentionPy,
    lang: "python",
  },
  "scale-constants": {
    path: "vllm/vllm/envs.py",
    highlight: [153, 155],
    desc: "q·k·v의 가장 큰 값을 FP8 격자의 어디에 놓을지 정하는 환경 상수입니다.",
    annotations: [
      { lines: [153, 155], color: "sky", note: "기본값은 Q 200, K 200, V 100입니다. E4M3 최댓값 448과의 차이가 warmup 뒤 더 큰 값을 받아 줄 여유입니다." },
    ],
    code: envsPy,
    lang: "python",
  },
  "scale-op": {
    path: "vllm/csrc/libtorch_stable/cache_kernels.cu",
    highlight: [241, 252],
    desc: "원소 하나를 cache에 쓸 때 dtype이 auto면 그대로, FP8이면 scale을 넣어 변환합니다.",
    annotations: [
      { lines: [246, 250], color: "sky", note: "auto는 BF16을 BF16으로 복사합니다. fp8이면 scaled_convert가 x ÷ s를 FP8로 바꿉니다." },
    ],
    code: cacheKernels,
    lang: "c",
  },
  "write-kernel": {
    path: "vllm/csrc/libtorch_stable/cache_kernels.cu",
    highlight: [314, 399],
    desc: "새 token의 K·V를 slot 주소에 쓰면서 FP8로 바꾸는 kernel입니다.",
    annotations: [
      { lines: [327, 344], color: "sky", note: "slot_mapping으로 block과 block 안 위치를 구합니다. KV 양자화는 이 쓰기 자리에서 일어나고 주소 계산은 BF16일 때와 같습니다." },
      { lines: [351, 363], color: "amber", note: "scale이 [1]이면 모든 head가 같은 k_scale 하나를 씁니다." },
      { lines: [364, 397], color: "violet", note: "scale이 [num_heads]이면 warp 하나가 head 하나를 맡고 head마다 다른 scale을 씁니다." },
    ],
    code: cacheKernels,
    lang: "c",
  },
  "scale-shape-check": {
    path: "vllm/csrc/libtorch_stable/cache_kernels.cu",
    highlight: [852, 856],
    desc: "scale은 tensor 하나 또는 head마다 하나만 받습니다.",
    annotations: [
      { lines: [854, 856], color: "sky", note: "[1] 또는 [num_heads]가 아니면 멈춥니다. 채널마다 또는 token마다 scale을 두는 KIVI식 배치는 이 쓰기 경로가 받지 않습니다." },
    ],
    code: cacheKernels,
    lang: "c",
  },
  "fp8-convention": {
    path: "vllm/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh",
    highlight: [303, 324],
    desc: "FP8 = Quantize(HP ÷ scale), HP = Dequant(FP8) × scale이라는 약속과 읽기 쪽 구현입니다.",
    annotations: [
      { lines: [303, 307], color: "sky", note: "쓰기에서 나누고 읽기에서 곱한다는 규약이 주석으로 적혀 있습니다." },
      { lines: [317, 324], color: "amber", note: "읽을 때는 FP8 → half로 바꾼 뒤 scale을 곱합니다. 저장된 448은 448 × 0.02 = 8.96으로 돌아옵니다." },
    ],
    code: quantUtils,
    lang: "c",
  },
  "fp8-write": {
    path: "vllm/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh",
    highlight: [480, 488],
    desc: "half 값을 scale로 나눈 뒤 포화(SATFINITE) 변환으로 FP8에 넣습니다.",
    annotations: [
      { lines: [485, 487], color: "sky", note: "600은 무한대가 되지 않고 __NV_SATFINITE 때문에 표현 가능한 최댓값 448에 멈춥니다." },
    ],
    code: quantUtils,
    lang: "c",
  },
  "q8-block": {
    path: "llama.cpp/ggml/src/ggml-common.h",
    highlight: [194, 255],
    desc: "llama.cpp의 KV 양자화 형식은 32원소마다 FP16 scale 하나를 붙인 block입니다.",
    annotations: [
      { lines: [194, 199], color: "amber", note: "q4_0은 FP16 scale 2 byte + 4bit 32개 16 byte = 18 byte입니다. 원소당 0.5625 byte입니다." },
      { lines: [251, 255], color: "sky", note: "q8_0은 2 + 32 = 34 byte입니다. 원소당 1.0625 byte라 per-tensor FP8보다 6.25% 큽니다." },
    ],
    code: ggmlCommon,
    lang: "c",
  },
  "v-needs-fa": {
    path: "llama.cpp/src/llama-context.cpp",
    highlight: [4063, 4092],
    desc: "V를 양자화하려면 Flash Attention 경로가 켜져 있어야 하고, head 폭이 block 크기로 나누어떨어져야 합니다.",
    annotations: [
      { lines: [4063, 4072], color: "sky", note: "auto면 Flash Attention을 켜고, 사용자가 끄라고 했으면 context 생성을 거부합니다." },
      { lines: [4074, 4092], color: "amber", note: "head 폭 128은 32로 나누어떨어집니다. 나누어떨어지지 않는 모델이면 이 형식을 쓸 수 없습니다." },
    ],
    code: llamaContext,
    lang: "c",
  },
};
