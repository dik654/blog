import type { CodeRef } from "@/components/code/types";
import adamPy from "./codebase/torch/optim/adam.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "moment-update": {
    path: "torch/optim/adam.py",
    code: adamPy,
    lang: "python",
    highlight: [9, 23],
    desc: "문제: m_t, v_t의 exponential moving average가 실제 tensor 연산으로 어떻게 계산되는지 확인해야 합니다.\n\n해결: RNN/LSTM의 핵심 연산과 달리, Adam의 이 부분은 native 함수 하나로 뭉쳐 있지 않고 실제로 순수 PyTorch tensor 연산(lerp_, mul_, addcmul_)으로 작성돼 있어 그대로 대조할 수 있습니다.",
    annotations: [
      { lines: [20, 20], color: "sky", note: "article의 m_t=β1 m_{t-1}+(1-β1)g_t — lerp_ 한 줄로 구현" },
      { lines: [23, 23], color: "emerald", note: "article의 v_t=β2 v_{t-1}+(1-β2)g_t²" },
    ],
  },
  "bias-correction-update": {
    path: "torch/optim/adam.py",
    code: adamPy,
    lang: "python",
    highlight: [25, 40],
    desc: "문제: bias correction과 최종 parameter update가 article의 m̂_t, v̂_t, θ_{t+1} 식과 정확히 같은 계산인지 확인해야 합니다.\n\n해결: 실제 코드는 m̂_t를 별도 tensor로 만드는 대신 그 보정을 learning rate 쪽으로 접어 넣은 step_size로 계산합니다 — article과 수학적으로 동일한 값을 만들지만 실제로 materialize하는 tensor가 다릅니다.",
    annotations: [
      { lines: [26, 27], color: "sky", note: "article의 (1-β1^t), (1-β2^t)" },
      { lines: [29, 32], color: "amber", note: "article 식에는 없는 실제 구현 최적화 — m̂_t를 별도로 안 만들고 step_size에 보정을 접어 넣음" },
      { lines: [34, 36], color: "emerald", note: "article의 q_t=√v̂_t+ε" },
      { lines: [38, 40], color: "violet", note: "article의 θ_{t+1}=θ_t-η·m̂_t/q_t — addcdiv_ 한 줄로 구현" },
    ],
  },
};
