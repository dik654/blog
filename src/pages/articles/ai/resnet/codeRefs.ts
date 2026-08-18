import type { CodeRef } from "@/components/code/types";
import resnetPy from "./codebase/torchvision/models/resnet.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "block-forward": {
    path: "torchvision/models/resnet.py",
    code: resnetPy,
    lang: "python",
    highlight: [10, 61],
    desc: "문제: post-activation([v1]) BasicBlock·Bottleneck의 실제 forward 순서와, torchvision이 실제로 어떤 variant를 기본 구현으로 쓰는지 확인해야 합니다.\n\n해결: torchvision의 BasicBlock·Bottleneck.forward가 정확히 conv→bn→relu를 반복한 뒤 identity를 더하고 마지막에 ReLU를 적용하는 순서를 그대로 보여줍니다.",
    annotations: [
      { lines: [16, 21], color: "sky", note: "article의 [v1] h=ReLU(BN1(conv1(x))); h=BN2(conv2(h))와 정확히 일치" },
      { lines: [26, 27], color: "emerald", note: "article의 [v1] out=ReLU(h+shortcut(x)) — addition 뒤에 ReLU가 걸림" },
      { lines: [33, 37], color: "amber", note: "article이 이미 언급한 v1.5 stride 배치(3×3 conv에 stride)가 실제 코드 주석에도 그대로 문서화되어 있음" },
      { lines: [65, 75], color: "violet", note: "마지막 BN weight를 0으로 초기화해 residual branch가 identity에서 시작하게 만드는 zero_init_residual" },
    ],
  },
};
