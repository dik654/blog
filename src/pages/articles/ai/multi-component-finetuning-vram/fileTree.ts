import type { FileNode } from "@/components/code/types";

/** 본문 대응: 동결 부품도 장치로 옮겨지는 것을 보여 주는 공식 학습 예제 (diffusers @ 82f175e0). */
export const diffusersTree: FileNode = {
  name: "diffusers",
  type: "dir",
  children: [
    {
      name: "examples/text_to_image",
      type: "dir",
      children: [
        {
          name: "train_text_to_image_lora.py",
          type: "file",
          path: "diffusers/examples/text_to_image/train_text_to_image_lora.py",
          codeKey: "freeze-and-move",
        },
      ],
    },
  ],
};
