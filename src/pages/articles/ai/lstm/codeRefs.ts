import type { CodeRef } from "@/components/code/types";
import rnnPy from "./codebase/torch/nn/modules/rnn.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "gate-formula": {
    path: "torch/nn/modules/rnn.py",
    code: rnnPy,
    lang: "python",
    highlight: [9, 43],
    desc: "문제: 네 gate(f,i,g,o)와 cell/hidden state update가 실제 PyTorch weight·연산과 어떻게 대응하는지 확인해야 합니다.\n\n해결: LSTMCell의 공식 docstring이 네 gate 식과 C_t, h_t 업데이트를 그대로 명시하고, num_chunks=4가 네 gate를 하나의 packed weight에 담는다는 걸 실제 코드로 보여줍니다.",
    annotations: [
      { lines: [15, 18], color: "sky", note: "Gates의 f_t=σ(a_f), i_t=σ(a_i), g_t=tanh(a_g), o_t=σ(a_o) — 네 gate 식과 정확히 일치" },
      { lines: [19, 20], color: "emerald", note: "Overview의 C_t=f_t⊙C_{t-1}+i_t⊙g_t, h_t=o_t⊙tanh(C_t)" },
      { lines: [31, 33], color: "amber", note: "num_chunks=4 — 네 gate가 하나의 packed weight로 저장됨을 실제 코드로 확인" },
      { lines: [40, 42], color: "violet", note: "실제 elementwise 계산은 native(C++) 함수 하나로 실행됨을 정직하게 표시" },
    ],
  },
};
