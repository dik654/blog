import type { CodeRef } from "@/components/code/types";
import dcganMainPy from "./codebase/pytorch-examples/dcgan/main.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "minimax-training-loop": {
    path: "pytorch-examples/dcgan/main.py",
    code: dcganMainPy,
    lang: "python",
    highlight: [6, 40],
    desc: "문제: D를 먼저 업데이트하고 G를 나중에 업데이트하는 순서, 그리고 non-saturating G loss가 실제로 어떻게 구현되는지 확인해야 합니다.\n\n해결: 공식 PyTorch DCGAN 예제가 real/fake 두 번의 D backward, optimizerD.step(), 그 다음 G의 label을 뒤집는 non-saturating trick까지 정확한 순서로 보여줍니다.",
    annotations: [
      { lines: [13, 19], color: "sky", note: "article의 log D(x_i) 항 — BCE(D(x),1)로 구현" },
      { lines: [21, 29], color: "emerald", note: "article의 log(1-D(G(z_i))) 항 — fake.detach()로 D update가 G 그래프까지 역전파하지 않게 끊음" },
      { lines: [32, 39], color: "amber", note: "Non-saturating G step — label을 real로 뒤집어 BCE(D(G(z)),1)을 최소화하는 것이 article의 log D(G(z)) 최대화와 동치" },
    ],
  },
};
