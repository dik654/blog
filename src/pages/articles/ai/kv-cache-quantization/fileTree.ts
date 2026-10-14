import type { FileNode } from "@/components/code/types";

export const kvQuantTrees: Record<string, FileNode> = {
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/model_executor/layers/attention/attention.py", path: "vllm/vllm/model_executor/layers/attention/attention.py", type: "file", codeKey: "calc-scales" },
      { name: "vllm/envs.py", path: "vllm/vllm/envs.py", type: "file", codeKey: "scale-constants" },
      { name: "csrc/libtorch_stable/cache_kernels.cu", path: "vllm/csrc/libtorch_stable/cache_kernels.cu", type: "file", codeKey: "write-kernel" },
      { name: "csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh", path: "vllm/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh", type: "file", codeKey: "fp8-convention" },
    ],
  },
  "llama.cpp": {
    name: "llama.cpp",
    type: "dir",
    children: [
      { name: "ggml/src/ggml-common.h", path: "llama.cpp/ggml/src/ggml-common.h", type: "file", codeKey: "q8-block" },
      { name: "src/llama-context.cpp", path: "llama.cpp/src/llama-context.cpp", type: "file", codeKey: "v-needs-fa" },
    ],
  },
};
