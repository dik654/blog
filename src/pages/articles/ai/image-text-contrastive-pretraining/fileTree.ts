import type { FileNode } from "@/components/code/types";

/** 본문 대응: 두 손실의 실제 구현 (transformers @ f62dc9bf2c90). */
export const transformersTree: FileNode = {
  name: "transformers",
  type: "dir",
  children: [
    {
      name: "src/transformers/models",
      type: "dir",
      children: [
        {
          name: "clip/modeling_clip.py",
          type: "file",
          path: "transformers/src/transformers/models/clip/modeling_clip.py",
          codeKey: "clip-loss",
        },
        {
          name: "siglip/modeling_siglip.py",
          type: "file",
          path: "transformers/src/transformers/models/siglip/modeling_siglip.py",
          codeKey: "siglip-loss",
        },
      ],
    },
  ],
};
