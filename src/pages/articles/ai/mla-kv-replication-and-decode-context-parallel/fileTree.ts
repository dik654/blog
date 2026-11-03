import type { FileNode } from "@/components/code/types";

export const mlaDcpTrees: Record<string, FileNode> = {
  vllm: {
    name: "vllm",
    type: "dir",
    children: [
      { name: "vllm/config/model.py", path: "vllm/vllm/config/model.py", type: "file", codeKey: "kv-heads-per-rank" },
      { name: "vllm/transformers_utils/model_arch_config_convertor.py", path: "vllm/vllm/transformers_utils/model_arch_config_convertor.py", type: "file", codeKey: "mla-head-size" },
      { name: "vllm/v1/attention/backends/utils.py", path: "vllm/vllm/v1/attention/backends/utils.py", type: "file", codeKey: "dcp-local-seq-lens" },
      { name: "vllm/model_executor/layers/attention/mla_attention.py", path: "vllm/vllm/model_executor/layers/attention/mla_attention.py", type: "file", codeKey: "dcp-decode-path" },
      { name: "vllm/v1/attention/ops/dcp.py", path: "vllm/vllm/v1/attention/ops/dcp.py", type: "file", codeKey: "lse-combine" },
      { name: "vllm/v1/attention/backends/mla/triton_mla.py", path: "vllm/vllm/v1/attention/backends/mla/triton_mla.py", type: "file", codeKey: "triton-mla-dcp" },
    ],
  },
};
