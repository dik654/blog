import type { CodeRef } from "@/components/code/types";
import rnnPy from "./codebase/torch/nn/modules/rnn.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "recurrence-formula": {
    path: "torch/nn/modules/rnn.py",
    code: rnnPy,
    lang: "python",
    highlight: [8, 47],
    desc: "문제: a_t=W_xh x_t+W_hh h_{t-1}+b_h, h_t=tanh(a_t)이 실제 PyTorch weight·bias와 정확히 어떻게 대응하는지 확인해야 합니다.\n\n해결: RNNCell의 공식 docstring이 이 식을 그대로 명시하고, __init__이 실제 weight shape를, forward가 실제 실행 경로를 보여줍니다.",
    annotations: [
      { lines: [13, 16], color: "sky", note: "article의 W_xh, W_hh — 실제 weight tensor shape" },
      { lines: [18, 20], color: "emerald", note: "article의 b_h를 bias_ih·bias_hh 두 벡터로 나눠 저장(합치면 b_h와 동일)" },
      { lines: [26, 27], color: "amber", note: "공식 docstring이 명시한 식 — article과 변수 이름만 다를 뿐 정확히 같음" },
      { lines: [40, 42], color: "violet", note: "실제 elementwise 계산은 native(C++) 함수 하나로 실행됨을 정직하게 표시" },
    ],
  },
};
