import type { CodeRef } from "@/components/code/types";
import extendingAutogradPy from "./codebase/pytorch-docs/extending_autograd.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "linear-forward": {
    path: "pytorch-docs/extending_autograd.py",
    code: extendingAutogradPy,
    lang: "python",
    highlight: [8, 22],
    desc: "문제: forward가 backward에 필요한 어떤 값을 남겨야 하는지 실제 코드로 확인해야 합니다.\n\n해결: PyTorch 공식 문서의 LinearFunction 예제가 forward에서 만든 input·weight·bias를 setup_context에서 명시적으로 save_for_backward합니다.",
    annotations: [
      { lines: [12, 14], color: "sky", note: "article의 Z=XW+1b^⊤ (weight가 [out,in]이라 전치해서 곱함)" },
      { lines: [21, 22], color: "emerald", note: "article의 질문 — forward가 backward를 위해 남겨야 할 값" },
    ],
  },
  "vjp-backward": {
    path: "pytorch-docs/extending_autograd.py",
    code: extendingAutogradPy,
    lang: "python",
    highlight: [24, 43],
    desc: "문제: x̄=ȳ·J_f(x)가 실제로 어떤 tensor 연산인지, Jacobian 전체를 만들지 않고 계산되는지 확인해야 합니다.\n\n해결: 이 문서 예제는 autograd engine 뒤에 VJP를 숨기지 않고 backward에 직접 손으로 적어 둡니다 — Jacobian 행렬을 한 번도 만들지 않고 곱 결과만 계산합니다.",
    annotations: [
      { lines: [30, 34], color: "amber", note: "article의 x̄=ȳ·J_f(x) — grad_output과 weight의 행렬곱 하나로 VJP를 계산" },
      { lines: [35, 39], color: "violet", note: "같은 ȳ가 weight 방향으로는 다른 local Jacobian과 곱해짐 — fan-out의 한 예" },
    ],
  },
};
