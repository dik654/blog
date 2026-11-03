import type { CodeRef } from "@/components/code/types";
import repeatedSquareCpp from "./codebase/chiavdf/repeated_square.cpp?raw";
import getBCpp from "./codebase/chiavdf/get_b.cpp?raw";
import verifyWesolowskiCpp from "./codebase/chiavdf/verify_wesolowski.cpp?raw";

export const codeRefs: Record<string, CodeRef> = {
  "vdf-repeated-square": {
    path: "src/vdf.h:83 — repeated_square_original()",
    code: repeatedSquareCpp.trimEnd(),
    lang: "c",
    highlight: [1, 18],
    desc: "Chia chiavdf 1.1.14의 always-works reference/fallback 함수 원문입니다. 실제 최적화 main loop 전체가 아니라, 각 iteration이 직전 form을 제곱해 다음 form으로 넘기는 의존 경로를 보여 줍니다.",
    annotations: [
      {
        lines: [1, 7],
        color: "sky",
        note: "입력 form과 반복 횟수, 현재 iteration 위치와 listener를 받습니다.",
      },
      {
        lines: [8, 13],
        color: "emerald",
        note: "루프 한 번마다 직전 f_res를 제곱합니다. 다음 반복은 이 결과가 나온 뒤에만 시작됩니다.",
      },
      {
        lines: [15, 17],
        color: "amber",
        note: "마지막 form을 호출자가 넘긴 f로 복사합니다.",
      },
    ],
  },
  "vdf-get-b": {
    path: "src/proof_common.h:76 — GetB()",
    code: getBCpp.trimEnd(),
    lang: "c",
    highlight: [1, 7],
    desc: "Chia chiavdf 1.1.14가 class-group form x와 y를 직렬화해 challenge prime B를 만드는 원문입니다.",
    annotations: [
      {
        lines: [2, 5],
        color: "sky",
        note: "이 버전은 D의 bit 길이에 맞춰 x와 y를 직렬화하고 두 byte sequence를 이어 붙입니다.",
      },
      {
        lines: [6, 6],
        color: "emerald",
        note: "이어 붙인 bytes에서 B_bits 크기의 소수를 결정론적으로 찾습니다.",
      },
    ],
  },
  "vdf-wesolowski-verify": {
    path: "src/verifier.h:26 — VerifyWesolowskiProof()",
    code: verifyWesolowskiCpp.trimEnd(),
    lang: "c",
    highlight: [1, 17],
    desc: "Chia chiavdf 1.1.14가 B와 r을 만든 뒤 proof^B · x^r == y를 검사하는 원문입니다.",
    annotations: [
      {
        lines: [4, 6],
        color: "sky",
        note: "고정한 GetB 규칙으로 B를 다시 만들고 r = 2^iters mod B를 계산합니다.",
      },
      {
        lines: [7, 9],
        color: "emerald",
        note: "proof^B와 x^r를 계산한 뒤 두 form을 곱습니다. 원래 iters회의 평가를 다시 하지 않습니다.",
      },
      {
        lines: [10, 16],
        color: "rose",
        note: "계산한 군 원소가 제출된 y와 같을 때만 valid로 판정합니다.",
      },
    ],
  },
};
