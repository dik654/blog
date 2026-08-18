import type { CodeRef } from "@/components/code/types";
import rnnPy from "./codebase/torch/nn/modules/rnn.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "gate-formula": {
    path: "torch/nn/modules/rnn.py",
    code: rnnPy,
    lang: "python",
    highlight: [7, 29],
    desc: "문제: reset gate가 candidate 계산에서 정확히 어디에 곱해지는지는 구현마다 다를 수 있습니다 — article도 이미 이 점을 경고하고 있습니다.\n\n해결: 실제 PyTorch GRUCell의 공식 docstring과 article의 식을 나란히 대조해, 이 경고가 실제로 참인 구체적 사례를 확인합니다.",
    annotations: [
      { lines: [13, 14], color: "sky", note: "r_t, z_t 두 gate는 article과 정확히 일치" },
      { lines: [15, 15], color: "amber", note: "실제 코드: reset gate r을 행렬곱 결과(W_hn h+b_hn) 전체에 곱함" },
      { lines: [19, 28], color: "violet", note: "article은 reset gate를 h_{t-1}에 먼저 곱한 뒤 행렬곱 — 대수적으로 다른 함수라는 걸 실제 코드 대조로 확인" },
    ],
  },
};
