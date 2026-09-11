import type { FileNode } from "@/components/code/types";

/** 본문 대응: 이 글이 인용하는 SAM 3 공식 구현 스냅샷 (facebookresearch/sam3 @ 660a5e9e). */
export const sam3Tree: FileNode = {
  name: "sam3",
  type: "dir",
  children: [
    {
      name: "model",
      type: "dir",
      children: [
        { name: "decoder.py", type: "file", path: "sam3/model/decoder.py", codeKey: "presence-token" },
        { name: "encoder.py", type: "file", path: "sam3/model/encoder.py", codeKey: "fusion-encoder" },
      ],
    },
  ],
};
