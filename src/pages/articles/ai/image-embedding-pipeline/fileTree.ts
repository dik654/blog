import type { FileNode } from "@/components/code/types";

/** 본문 대응: 전처리와 토큰 배치를 확인하는 reference 구현 스냅샷 (transformers @ f62dc9bf2c90). */
export const transformersTree: FileNode = {
  name: "transformers",
  type: "dir",
  children: [
    {
      name: "src/transformers/models/dinov3_vit",
      type: "dir",
      children: [
        {
          name: "image_processing_dinov3_vit.py",
          type: "file",
          path: "transformers/src/transformers/models/dinov3_vit/image_processing_dinov3_vit.py",
          codeKey: "image-processor",
        },
        {
          name: "modular_dinov3_vit.py",
          type: "file",
          path: "transformers/src/transformers/models/dinov3_vit/modular_dinov3_vit.py",
          codeKey: "token-layout",
        },
      ],
    },
  ],
};
