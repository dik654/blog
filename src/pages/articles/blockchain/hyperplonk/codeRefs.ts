import type { CodeRef } from "@/components/code/types";
import customGateRs from "./codebase/hyperplonk/custom_gate.rs?raw";
import zeroCheckRs from "./codebase/hyperplonk/zero_check.rs?raw";
import sumCheckRs from "./codebase/hyperplonk/sum_check.rs?raw";
import e2eGateRs from "./codebase/hyperplonk/e2e_gate.rs?raw";
import e2ePathsRs from "./codebase/hyperplonk/e2e_paths.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "custom-gate": {
    path: "hyperplonk/src/custom_gate.rs:9–44",
    code: customGateRs.trimEnd(),
    lang: "rust",
    highlight: [1, 36],
    desc: "EspressoSystems/hyperplonk @ 2a3b55c · q_L·W₁⁵−W₂ gate를 selector와 witness index tuple로 표현하고 실제 degree를 계산하는 원문",
    annotations: [
      {
        lines: [1, 21],
        color: "sky",
        note: "W₁ index를 다섯 번 적은 항이 W₁⁵이고, selector q_L과 −W₂ 항이 함께 한 gate를 만듭니다.",
      },
      {
        lines: [23, 27],
        color: "amber",
        note: "구현은 coefficient·optional selector·witness index 목록을 한 monomial 표현으로 저장합니다.",
      },
      {
        lines: [30, 36],
        color: "emerald",
        note: "Gate degree는 witness multiplicand 수에 selector가 있으면 1을 더해 계산합니다.",
      },
    ],
  },
  "zero-check": {
    path: "subroutines/src/poly_iop/zero_check/mod.rs:69–120",
    code: zeroCheckRs.trimEnd(),
    lang: "rust",
    highlight: [1, 52],
    desc: "EspressoSystems/hyperplonk @ 2a3b55c · transcript에서 random r을 뽑아 f_hat=f·eq(x,r)를 만들고 sumcheck로 모든 Boolean corner의 0을 검사하는 원문",
    annotations: [
      {
        lines: [7, 10],
        color: "violet",
        note: "검증자가 먼저 r을 고르고 build_f_hat이 임의 가중치 역할의 equality polynomial을 곱합니다.",
      },
      {
        lines: [22, 29],
        color: "rose",
        note: "첫 round endpoint 합이 0이 아니면 zero claim을 즉시 거절합니다.",
      },
      {
        lines: [32, 52],
        color: "emerald",
        note: "같은 r로 degree를 하나 늘린 sumcheck를 검증하고, 마지막 point의 예상 f 평가값을 복원합니다.",
      },
    ],
  },
  sumcheck: {
    path: "subroutines/src/poly_iop/sum_check/mod.rs:154–208",
    code: sumCheckRs.trimEnd(),
    lang: "rust",
    highlight: [1, 55],
    desc: "EspressoSystems/hyperplonk @ 2a3b55c · 변수 수만큼 round message를 transcript에 넣은 뒤 challenge를 뽑고 verifier가 같은 순서로 subclaim을 만드는 원문",
    annotations: [
      {
        lines: [7, 18],
        color: "sky",
        note: "각 변수마다 prover message를 먼저 transcript에 넣고 그 다음 challenge를 뽑습니다.",
      },
      {
        lines: [20, 28],
        color: "amber",
        note: "마지막 challenge point와 모든 round polynomial message가 IOPProof가 됩니다.",
      },
      {
        lines: [40, 55],
        color: "emerald",
        note: "Verifier도 같은 aux info·message 순서로 challenge를 재생하고 최종 single-point subclaim을 만듭니다.",
      },
    ],
  },
  "e2e-gate": {
    path: "hyperplonk/src/snark.rs:636–655",
    code: e2eGateRs.trimEnd(),
    lang: "rust",
    highlight: [1, 20],
    desc: "EspressoSystems/hyperplonk @ 2a3b55c · 네 row·두 MLE 변수에서 q_L·W₁⁵−W₂=0 high-degree gate를 만드는 공식 end-to-end test 원문",
    annotations: [
      {
        lines: [3, 10],
        color: "sky",
        note: "이 글의 x⁵−y 사례와 같은 gate이며 W₁을 다섯 번 곱하는 항을 index 목록으로 나타냅니다.",
      },
      {
        lines: [11, 20],
        color: "emerald",
        note: "4 constraints는 2-bit Boolean cube가 되고 selector 1개와 witness columns 2개를 사용합니다.",
      },
    ],
  },
  "e2e-paths": {
    path: "hyperplonk/src/snark.rs:687–746",
    code: e2ePathsRs.trimEnd(),
    lang: "rust",
    highlight: [1, 60],
    desc: "EspressoSystems/hyperplonk @ 2a3b55c · x=[0,1,2,3], y=[0,1,32,243] proof를 검증하고 wrong permutation·wrong witness를 거절하는 공식 test 원문",
    annotations: [
      {
        lines: [1, 22],
        color: "sky",
        note: "Index를 preprocess하고 네 x 값과 정확한 다섯제곱 y 값을 witness columns로 만듭니다.",
      },
      {
        lines: [24, 36],
        color: "emerald",
        note: "같은 PK·VK·public input으로 proof를 만들고 실제 verifier를 호출합니다.",
      },
      {
        lines: [38, 60],
        color: "rose",
        note: "다른 permutation으로 만든 VK와 잘못 바꾼 witness는 각각 verify false와 prove error가 되어야 합니다.",
      },
    ],
  },
};
