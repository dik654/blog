import type { CodeRef } from "@/components/code/types";
import patchProjectionPy from "./codebase/torchvision/models/patch_projection.py?raw";
import classTokenPy from "./codebase/torchvision/models/class_token.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "conv-as-patch-proj": {
    path: "torchvision/models/vision_transformer.py",
    code: patchProjectionPy,
    lang: "python",
    highlight: [1, 31],
    desc: "torchvision v0.28.0의 실제 구현입니다. kernel_size와 stride를 모두 patch_size로 둔 Conv2d가 patch grid를 만들고, reshape와 permute가 이를 [batch, sequence, embedding] 순서로 바꿉니다.",
    annotations: [
      { lines: [1, 3], color: "sky", note: "kernel=stride=P라서 겹치지 않는 patch마다 같은 D개 dot product를 계산합니다." },
      { lines: [20, 22], color: "emerald", note: "14×14 spatial grid를 길이 196의 sequence axis로 펼칩니다." },
      { lines: [24, 29], color: "amber", note: "Self-attention이 읽는 [batch, sequence, embedding] 순서로 축을 바꿉니다." },
    ],
  },
  "class-token-concat": {
    path: "torchvision/models/vision_transformer.py",
    code: classTokenPy,
    lang: "python",
    highlight: [1, 18],
    desc: "torchvision v0.28.0의 forward 원문입니다. batch마다 class token을 복제해 196개 patch token 앞에 붙인 뒤 encoder를 통과시키고 첫 token만 classification head에 전달합니다.",
    annotations: [
      { lines: [7, 9], color: "sky", note: "[CLS] 하나를 각 batch에 복제하고 patch sequence 앞에 붙여 길이를 197로 만듭니다." },
      { lines: [11, 16], color: "emerald", note: "Encoder 뒤 첫 token의 D차원 출력만 꺼내 K개 class logit으로 바꿉니다." },
    ],
  },
};
