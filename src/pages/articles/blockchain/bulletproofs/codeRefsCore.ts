import type { CodeRef } from "@/components/code/types";
import pedersenGensRs from "./codebase/dalek/pedersen_gens.rs?raw";
import ipaStructRs from "./codebase/dalek/ipa_struct.rs?raw";
import ipaFirstRoundRs from "./codebase/dalek/ipa_first_round.rs?raw";

export const coreCodeRefs: Record<string, CodeRef> = {
  "pedersen-gens": {
    path: "src/generators.rs:29 — PedersenGens",
    code: pedersenGensRs.trimEnd(),
    lang: "rust",
    highlight: [1, 25],
    desc: "dalek-cryptography/bulletproofs @ be67b6d · value와 blinding을 서로 다른 Ristretto generator에 곱해 더하는 원문",
    annotations: [
      {
        lines: [1, 7],
        color: "sky",
        note: "B는 value, B_blinding은 무작위 blinding에 쓰는 서로 다른 기저점입니다.",
      },
      {
        lines: [9, 13],
        color: "emerald",
        note: "commit(value, blinding)은 value·B + blinding·B_blinding을 한 multiscalar multiplication으로 계산합니다.",
      },
      {
        lines: [15, 24],
        color: "amber",
        note: "기본값은 Ristretto basepoint와 그 bytes를 SHA3-512 hash-to-group한 두 번째 점을 사용합니다.",
      },
    ],
  },
  "ipa-struct": {
    path: "src/inner_product_proof.rs:18 — InnerProductProof",
    code: ipaStructRs.trimEnd(),
    lang: "rust",
    highlight: [1, 7],
    desc: "dalek-cryptography/bulletproofs @ be67b6d · round마다 L/R 점을 남기고 마지막 a·b scalar를 보관하는 proof 구조 원문",
    annotations: [
      {
        lines: [1, 7],
        color: "violet",
        note: "길이 n relation은 log₂n rounds의 L/R point 쌍과 마지막 scalar 두 개로 줄어듭니다.",
      },
    ],
  },
  "ipa-first-round": {
    path: "src/inner_product_proof.rs:75 — IPA first round",
    code: ipaFirstRoundRs.trimEnd(),
    lang: "rust",
    highlight: [1, 67],
    desc: "dalek-cryptography/bulletproofs @ be67b6d · vector를 반으로 나누고 L/R을 transcript에 넣은 뒤 challenge u로 witness와 generator를 접는 첫 round 원문",
    annotations: [
      {
        lines: [3, 11],
        color: "sky",
        note: "a·b·G·H를 같은 가운데 지점에서 좌우로 나누고 cross inner product cL·cR을 계산합니다.",
      },
      {
        lines: [13, 39],
        color: "amber",
        note: "L과 R은 좌우 cross term을 Ristretto point로 고정합니다.",
      },
      {
        lines: [41, 48],
        color: "violet",
        note: "L과 R을 transcript에 먼저 넣은 뒤에만 round challenge u를 얻습니다.",
      },
      {
        lines: [50, 66],
        color: "emerald",
        note: "Witness와 generator를 맞물린 u·u⁻¹ 계수로 접어 길이를 절반으로 줄입니다.",
      },
    ],
  },
};
