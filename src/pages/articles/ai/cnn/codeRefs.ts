import type { CodeRef } from "@/components/code/types";
import foldPy from "./codebase/torch/nn/modules/fold.py?raw";
import convPy from "./codebase/torch/nn/modules/conv.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "conv-as-matmul": {
    path: "torch/nn/modules/fold.py",
    code: foldPy,
    lang: "python",
    highlight: [15, 32],
    desc: "문제: Y_{o,p,q}=b_o+Σ W_{o,c,u,v}X_{c,p+u,q+v}가 실제로 어떤 tensor 연산 순서인지 확인해야 합니다.\n\n해결: PyTorch 공식 문서는 convolution이 patch 추출(Unfold)→행렬곱→재배치(Fold)와 수치적으로 같다는 것을 검증 코드와 함께 직접 보여줍니다.",
    annotations: [
      { lines: [18, 20], color: "sky", note: "article의 patch 선택 X_{c,p+u,q+v} — 모든 local window를 한 번에 펼침" },
      { lines: [22, 24], color: "emerald", note: "article의 W·P 곱과 합 — kernel을 펴서 행렬곱 하나로 계산" },
      { lines: [26, 27], color: "amber", note: "article의 Y_{o,p,q} — 다시 spatial grid로 되돌림" },
      { lines: [31, 33], color: "violet", note: "F.conv2d의 native kernel과 수치적으로 같은 결과임을 문서가 직접 검증" },
    ],
  },
  "output-shape-spec": {
    path: "torch/nn/modules/conv.py",
    code: convPy,
    lang: "python",
    highlight: [7, 19],
    desc: "문제: H_out 식이 article의 식과 실제로 같은지, 아니면 문서가 다르게 정의하는 부분이 있는지 확인해야 합니다.\n\n해결: PyTorch Conv2d class의 공식 docstring이 명시한 shape 계약을 그대로 옮겼습니다.",
    annotations: [
      { lines: [12, 14], color: "sky", note: "article의 H_out = floor((H+2P-D(K-1)-1)/S + 1)과 LaTeX까지 동일" },
    ],
  },
};
