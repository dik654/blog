import type { CodeRef } from "@/components/code/types";
import simpleGateRs from "./codebase/halo2/simple_gate.rs?raw";
import simpleMulExposeRs from "./codebase/halo2/simple_mul_expose.rs?raw";
import simpleMockRs from "./codebase/halo2/simple_mock.rs?raw";
import createProofRs from "./codebase/halo2/create_proof.rs?raw";
import verifyProofRs from "./codebase/halo2/verify_proof.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "simple-gate": {
    path: "halo2_proofs/examples/simple-example.rs:76–117",
    code: simpleGateRs.trimEnd(),
    lang: "rust",
    highlight: [1, 42],
    desc: "zcash/halo2 @ 3442dd3 · equality-enabled columns, selector, cur/next rotations와 s_mul·(lhs·rhs−out) gate를 만드는 공식 예제 원문",
    annotations: [
      {
        lines: [1, 12],
        color: "sky",
        note: "Advice·instance columns에 equality를 켜고 multiplication selector를 만듭니다.",
      },
      {
        lines: [15, 31],
        color: "amber",
        note: "Row 0의 lhs·rhs와 다음 row의 out을 Rotation::cur·next로 읽습니다.",
      },
      {
        lines: [33, 42],
        color: "emerald",
        note: "Selector가 0이면 값이 자유롭고, 0이 아니면 lhs·rhs=out을 강제한다는 공식 주석과 식입니다.",
      },
    ],
  },
  "simple-mul-expose": {
    path: "halo2_proofs/examples/simple-example.rs:185–230",
    code: simpleMulExposeRs.trimEnd(),
    lang: "rust",
    highlight: [1, 46],
    desc: "zcash/halo2 @ 3442dd3 · selector를 켜고 입력 cell을 copy한 뒤 다음 row에 결과를 배치하고 instance에 노출하는 공식 예제 원문",
    annotations: [
      {
        lines: [9, 15],
        color: "amber",
        note: "Region offset 0에서 selector를 켜야 두 행의 multiplication gate가 활성화됩니다.",
      },
      {
        lines: [17, 22],
        color: "violet",
        note: "다른 곳의 입력은 copy_advice로 equality constraint에 결속합니다.",
      },
      {
        lines: [24, 34],
        color: "emerald",
        note: "곱을 계산해 next row의 output cell에 배치합니다. 계산만이 아니라 앞의 gate가 관계를 강제합니다.",
      },
      {
        lines: [37, 46],
        color: "sky",
        note: "Output cell을 instance column의 지정 row와 constrain_instance로 묶습니다.",
      },
    ],
  },
  "simple-mock": {
    path: "halo2_proofs/examples/simple-example.rs:305–337",
    code: simpleMockRs.trimEnd(),
    lang: "rust",
    highlight: [1, 33],
    desc: "zcash/halo2 @ 3442dd3 · 정확한 public input은 통과하고 1을 더한 잘못된 public input은 실패하는 공식 MockProver 예제 원문",
    annotations: [
      {
        lines: [5, 20],
        color: "sky",
        note: "k=4와 private values로 circuit을 구성하고 public 결과를 계산합니다.",
      },
      {
        lines: [22, 28],
        color: "emerald",
        note: "정확한 instance c는 MockProver 검증을 통과합니다.",
      },
      {
        lines: [30, 33],
        color: "rose",
        note: "같은 회로에서 public input에 1을 더하면 검증이 실패합니다.",
      },
    ],
  },
  "create-proof": {
    path: "halo2_proofs/src/plonk/prover.rs:30–59",
    code: createProofRs.trimEnd(),
    lang: "rust",
    highlight: [1, 30],
    desc: "zcash/halo2 @ 3442dd3 · 같은 circuit의 proving key, instances와 transcript를 받아 proof를 만들고 VK를 transcript에 먼저 hash하는 원문",
    annotations: [
      {
        lines: [1, 18],
        color: "sky",
        note: "Params·ProvingKey·circuit·public instances·RNG·transcript가 proof 생성 profile을 이룹니다.",
      },
      {
        lines: [19, 27],
        color: "amber",
        note: "Circuit 수와 instance 묶음 수, instance column 수가 맞지 않으면 즉시 거절합니다.",
      },
      {
        lines: [29, 30],
        color: "violet",
        note: "Verification key를 transcript에 넣어 challenge가 circuit identity에 결속되도록 합니다.",
      },
    ],
  },
  "verify-proof": {
    path: "halo2_proofs/src/plonk/verifier.rs:69–88",
    code: verifyProofRs.trimEnd(),
    lang: "rust",
    highlight: [1, 20],
    desc: "zcash/halo2 @ 3442dd3 · Params·VK·instances·transcript를 받아 검증하고 instance column 수를 먼저 확인하는 원문",
    annotations: [
      {
        lines: [1, 14],
        color: "sky",
        note: "Verifier도 exact Params·VK·instance schema·transcript profile을 받습니다.",
      },
      {
        lines: [15, 20],
        color: "rose",
        note: "Expected instance column 수와 다르면 proof 연산 전에 InvalidInstances로 실패합니다.",
      },
    ],
  },
};
