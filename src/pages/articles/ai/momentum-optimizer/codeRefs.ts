import type { CodeRef } from "@/components/code/types";
import sgdPy from "./codebase/torch/optim/sgd.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "velocity-update": {
    path: "torch/optim/sgd.py",
    code: sgdPy,
    lang: "python",
    highlight: [8, 35],
    desc: "문제: v_t=β v_{t-1}+g_t와 θ_{t+1}=θ_t-η v_t가 실제 tensor 연산으로 어떻게 계산되는지 확인해야 합니다.\n\n해결: PyTorch SGD의 _single_tensor_sgd가 momentum buffer를 mul_+add_로 갱신한 뒤 param에서 뺍니다.",
    annotations: [
      { lines: [20, 21], color: "sky", note: "article의 v_t=β v_{t-1}+g_t" },
      { lines: [30, 35], color: "emerald", note: "article의 θ_{t+1}=θ_t-η v_t" },
    ],
  },
  "nesterov-formulation": {
    path: "torch/optim/sgd.py",
    code: sgdPy,
    lang: "python",
    highlight: [23, 29],
    desc: "문제: article이 이미 \"구현마다 look-ahead 적용 순서가 다르다\"고 경고한 대로, PyTorch의 nesterov=True가 실제로 classic 식과 어떻게 다른지 확인해야 합니다.\n\n해결: 실제 PyTorch는 θ_{t-1}-β v_{t-1} 지점에서 gradient를 다시 계산하지 않고, 방금 만든 v_t를 momentum 배율로 현재 gradient에 더하는 Sutskever formulation을 씁니다.",
    annotations: [
      { lines: [24, 28], color: "amber", note: "article의 classic Nesterov(θ_{t-1}-β v_{t-1}에서 gradient 재계산)와 다른 실제 구현 — 대수적으로 동등한 재구성" },
      { lines: [29, 29], color: "violet", note: "grad + momentum·v_t — look-ahead gradient를 다시 구하지 않고 같은 효과를 냄" },
    ],
  },
};
