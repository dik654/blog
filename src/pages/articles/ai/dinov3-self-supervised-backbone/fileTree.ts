import type { FileNode } from "@/components/code/types";

/**
 * 본문 대응: 이 글이 인용하는 DINOv3 공식 구현 스냅샷.
 * facebookresearch/dinov3 @ 11c58638 의 loss·head 파일만 pin 했다.
 */
export const dinov3Tree: FileNode = {
  name: "dinov3",
  type: "dir",
  children: [
    {
      name: "loss",
      type: "dir",
      children: [
        { name: "gram_loss.py", type: "file", path: "dinov3/loss/gram_loss.py", codeKey: "gram-loss" },
        {
          name: "dino_clstoken_loss.py",
          type: "file",
          path: "dinov3/loss/dino_clstoken_loss.py",
          codeKey: "dino-clstoken-loss",
        },
        {
          name: "ibot_patch_loss.py",
          type: "file",
          path: "dinov3/loss/ibot_patch_loss.py",
          codeKey: "ibot-patch-loss",
        },
        { name: "koleo_loss.py", type: "file", path: "dinov3/loss/koleo_loss.py", codeKey: "koleo-loss" },
      ],
    },
    {
      name: "layers",
      type: "dir",
      children: [
        { name: "dino_head.py", type: "file", path: "dinov3/layers/dino_head.py", codeKey: "dino-head" },
      ],
    },
  ],
};
