import type { CodeRef } from "@/components/code/types";
import transformsPy from "./codebase/torch/distributions/transforms.py?raw";
import transformedDistributionPy from "./codebase/torch/distributions/transformed_distribution.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "affine-inverse-jacobian": {
    path: "torch/distributions/transforms.py",
    code: transformsPy,
    lang: "python",
    highlight: [6, 28],
    desc: "문제: z=f^{-1}(x)와 r(x)=|det ∂z/∂x|가 article의 x=2z 같은 affine 예시에서 실제로 어떻게 계산되는지 확인해야 합니다.\n\n해결: PyTorch의 AffineTransform이 forward·inverse·log Jacobian determinant를 각각 명시적으로 구현합니다.",
    annotations: [
      { lines: [15, 17], color: "sky", note: "article의 z=f^{-1}(x)" },
      { lines: [19, 28], color: "amber", note: "실제로는 forward 방향 log|dy/dx|를 계산 — article의 log r(x)와 부호가 반대(아래 log_prob에서 뺌으로써 상쇄)" },
    ],
  },
  "change-of-variables-logprob": {
    path: "torch/distributions/transformed_distribution.py",
    code: transformedDistributionPy,
    lang: "python",
    highlight: [6, 23],
    desc: "문제: p_X(x)=p_Z(z)·r(x)를 실제로 log-space에서 어떻게 계산하는지, inverse Jacobian을 따로 유도해야 하는지 확인해야 합니다.\n\n해결: TransformedDistribution.log_prob은 forward log-det-Jacobian을 구해 부호를 뒤집어 뺀 뒤 base distribution log density를 더합니다 — inverse Jacobian을 별도로 유도하지 않고도 같은 값을 만듭니다.",
    annotations: [
      { lines: [13, 14], color: "sky", note: "article의 z=f^{-1}(x) — inverse transform으로 base sample 복원" },
      { lines: [16, 19], color: "emerald", note: "article의 log r(x) — forward log-det을 빼는 것으로 계산(부호 반전)" },
      { lines: [21, 23], color: "amber", note: "article의 log p_Z(z) + log r(x) = log p_X(x)" },
    ],
  },
};
