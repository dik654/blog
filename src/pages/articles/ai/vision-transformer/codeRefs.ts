import type { CodeRef } from "@/components/code/types";
import vitPy from "./codebase/torchvision/models/vision_transformer.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "conv-as-patch-proj": {
    path: "torchvision/models/vision_transformer.py",
    code: vitPy,
    lang: "python",
    highlight: [7, 35],
    desc: "문제: patch를 펼쳐 matmul하는 구현과 Conv2d 한 층이 실제로 같은 연산인지 확인해야 합니다.\n\n해결: torchvision의 실제 VisionTransformer는 kernel_size=stride=patch_size인 Conv2d를 conv_proj로 씁니다 — article이 유도한 flatten(K_d)=E_{:,d} 등가성이 실제 구현 그 자체입니다.",
    annotations: [
      { lines: [12, 14], color: "sky", note: "article의 E — kernel=stride=P인 Conv2d로 patch flatten+matmul을 대체" },
      { lines: [26, 31], color: "emerald", note: "article의 (r,s) 2D grid 좌표를 1D patch index로 펼치는 과정" },
      { lines: [17, 17], color: "amber", note: "article의 p_i — position embedding parameter" },
    ],
  },
  "class-token-concat": {
    path: "torchvision/models/vision_transformer.py",
    code: vitPy,
    lang: "python",
    highlight: [37, 46],
    desc: "문제: class token이 patch token sequence와 어떻게 결합되는지 확인해야 합니다.\n\n해결: forward()가 patch embedding 앞에 class_token을 concat해 article의 Z_0=[e_cls;e_1;...;e_N]을 그대로 만듭니다.",
    annotations: [
      { lines: [41, 43], color: "sky", note: "article의 Z_0=[e_cls;e_1;...;e_N] — class token을 patch token 앞에 붙임" },
    ],
  },
};
