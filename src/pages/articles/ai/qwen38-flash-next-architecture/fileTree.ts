import type { FileNode } from "@/components/code/types";

/**
 * 본문 대응: 이 글이 인용하는 Qwen4-Exp reference 구현 스냅샷.
 * huggingface/transformers @ f62dc9bf2c90 (2026-09-04) 의 두 파일만 pin 했다.
 */
export const transformersTree: FileNode = {
  name: "transformers",
  type: "dir",
  children: [
    {
      name: "src/transformers/models/qwen4_exp",
      type: "dir",
      children: [
        {
          name: "modular_qwen4_exp.py",
          type: "file",
          path: "transformers/src/transformers/models/qwen4_exp/modular_qwen4_exp.py",
          codeKey: "qsa-indexer",
        },
        {
          name: "configuration_qwen4_exp.py",
          type: "file",
          path: "transformers/src/transformers/models/qwen4_exp/configuration_qwen4_exp.py",
          codeKey: "layer-schedule",
        },
      ],
    },
  ],
};
