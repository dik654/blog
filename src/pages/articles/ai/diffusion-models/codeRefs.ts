import type { CodeRef } from "@/components/code/types";
import schedulingDdpmPy from "./codebase/diffusers/schedulers/scheduling_ddpm.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "add-noise": {
    path: "diffusers/schedulers/scheduling_ddpm.py",
    code: schedulingDdpmPy,
    lang: "python",
    highlight: [9, 27],
    desc: "문제: Forward diffusion을 t번 반복하지 않고 x_t를 한 번에 만들어야 학습이 빠릅니다.\n\n해결: 미리 계산해 둔 ᾱ_t lookup table에서 √ᾱ_t와 √(1-ᾱ_t)를 조회해 closed-form으로 바로 계산합니다.",
    annotations: [
      { lines: [14, 17], color: "sky", note: "article의 √ᾱ_t — cumulative product를 lookup table에서 조회" },
      { lines: [20, 23], color: "emerald", note: "article의 √(1-ᾱ_t)" },
      { lines: [25, 27], color: "amber", note: "x_t = √ᾱ_t·x0 + √(1-ᾱ_t)·ε — Training AlgorithmBlock의 4번째 줄 그대로" },
    ],
  },
  "reverse-step": {
    path: "diffusers/schedulers/scheduling_ddpm.py",
    code: schedulingDdpmPy,
    lang: "python",
    highlight: [29, 64],
    desc: "문제: 학습된 ε_θ로 x_t에서 x_{t-1}을 만들 때 mean과 posterior variance를 어떻게 결합할지 정해야 합니다.\n\n해결: epsilon-prediction으로 x̂0을 먼저 복원한 뒤 DDPM 논문 formula 7의 계수로 mean을 합성하고, t>0일 때만 posterior variance만큼 noise를 더합니다.",
    annotations: [
      { lines: [42, 47], color: "sky", note: "article과 다른 parameterization(formula 15→7)이지만 대수적으로 같은 결과를 냅니다 — annotation 참고" },
      { lines: [49, 54], color: "emerald", note: "x̂0과 x_t를 섞어 article의 μ_θ와 같은 값을 만듦" },
      { lines: [56, 64], color: "amber", note: "article의 z~N(0,I)(t=1이면 z=0) — t=0(마지막 step)에서만 noise를 끔" },
    ],
  },
};
