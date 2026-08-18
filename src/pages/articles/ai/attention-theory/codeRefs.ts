import type { CodeRef } from "@/components/code/types";
import functionalPy from "./codebase/torch/nn/functional.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "qkv-projection": {
    path: "torch/nn/functional.py",
    code: functionalPy,
    lang: "python",
    highlight: [9, 18],
    desc: "문제: Self-attention에서 같은 입력 X가 Q·K·V 세 가지 역할을 어떻게 동시에 만드는지 확인해야 합니다.\n\n해결: PyTorch는 세 개의 별도 행렬 대신 [3E,E] 크기의 packed weight 하나로 한 번의 linear 연산에서 Q,K,V를 모두 만듭니다.",
    annotations: [
      { lines: [13, 18], color: "sky", note: "article의 Q=XW_Q,K=XW_K,V=XW_V와 수학적으로 같지만, 메모리 접근 효율을 위해 하나의 packed weight로 구현되어 있습니다" },
    ],
  },
  "multi-head-split": {
    path: "torch/nn/functional.py",
    code: functionalPy,
    lang: "python",
    highlight: [21, 40],
    desc: "문제: 여러 head가 병렬로 서로 다른 representation subspace를 읽은 뒤 어떻게 다시 하나의 output으로 합쳐지는지 확인해야 합니다.\n\n해결: Q,K,V를 head 수만큼 view로 나눠 head별로 독립적인 SDPA를 실행한 뒤, permute·reshape로 다시 이어 붙이고 out_proj로 최종 output을 만듭니다.",
    annotations: [
      { lines: [26, 29], color: "sky", note: "article의 Q_h,K_h,V_h — view 하나로 head 차원을 분리" },
      { lines: [31, 32], color: "emerald", note: "article의 a_h=Attention(Q_h,K_h,V_h) — transformer-architecture 글의 SDPA와 같은 함수를 head마다 호출" },
      { lines: [34, 35], color: "amber", note: "article의 Y=Concat(a_1,...,a_H) — permute+reshape로 head 축을 다시 하나로 합침" },
      { lines: [37, 38], color: "violet", note: "article의 MHA(X)=YW_O — 최종 output projection" },
    ],
  },
};
