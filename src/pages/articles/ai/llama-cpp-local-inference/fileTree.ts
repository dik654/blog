import type { FileNode } from "@/components/code/types";

export const llamaCppTrees: Record<string, FileNode> = {
  "llama.cpp": {
    name: "llama.cpp",
    type: "dir",
    children: [
      { name: "src/llama-kv-cells.h", path: "llama.cpp/src/llama-kv-cells.h", type: "file", codeKey: "cells-fields" },
      { name: "src/llama-kv-cache.cpp", path: "llama.cpp/src/llama-kv-cache.cpp", type: "file", codeKey: "find-slot" },
      { name: "src/llama-context.cpp", path: "llama.cpp/src/llama-context.cpp", type: "file", codeKey: "n-ctx-seq" },
      { name: "src/llama-model.cpp", path: "llama.cpp/src/llama-model.cpp", type: "file", codeKey: "layer-split" },
      { name: "ggml/src/ggml-common.h", path: "llama.cpp/ggml/src/ggml-common.h", type: "file", codeKey: "q4k-block" },
      { name: "ggml/src/ggml-cuda/vecdotq.cuh", path: "llama.cpp/ggml/src/ggml-cuda/vecdotq.cuh", type: "file", codeKey: "vec-dot-impl" },
      { name: "ggml/src/ggml-cuda/mmvq.cuh", path: "llama.cpp/ggml/src/ggml-cuda/mmvq.cuh", type: "file", codeKey: "mmvq-limit" },
      { name: "ggml/src/ggml-cuda/ggml-cuda.cu", path: "llama.cpp/ggml/src/ggml-cuda/ggml-cuda.cu", type: "file", codeKey: "op-offload" },
      { name: "ggml/src/ggml-cuda/fattn-common.cuh", path: "llama.cpp/ggml/src/ggml-cuda/fattn-common.cuh", type: "file", codeKey: "fattn-kv-max" },
    ],
  },
};
