import type { CodeRef } from "@/components/code/types";
import repeatedSquareCpp from "./codebase/chiavdf/repeated_square.cpp?raw";
import verifyWesolowskiCpp from "./codebase/chiavdf/verify_wesolowski.cpp?raw";

export const codeRefs: Record<string, CodeRef> = {
  "vdf-repeated-square": {
    path: "chiavdf/src/vdf.h · 1.1.14 발췌",
    code: repeatedSquareCpp,
    lang: "c",
    highlight: [1, 29],
    desc: "Chia chiavdf 1.1.14의 기준 반복 제곱 함수입니다. 각 iteration이 직전 form을 제곱해 다음 form으로 넘기는 의존 경로를 확인합니다.",
    annotations: [
      {
        lines: [4, 12],
        color: "sky",
        note: "입력 form과 반복 횟수, 현재 iteration 위치와 listener를 받습니다.",
      },
      {
        lines: [19, 23],
        color: "emerald",
        note: "루프 한 번마다 직전 f_res를 제곱합니다. 다음 반복은 이 결과가 나온 뒤에만 시작됩니다.",
      },
      {
        lines: [25, 28],
        color: "amber",
        note: "마지막 form을 호출자가 넘긴 f로 복사합니다.",
      },
    ],
  },
  "vdf-wesolowski-verify": {
    path: "chiavdf/src/proof_common.h + verifier.h · 1.1.14 발췌",
    code: verifyWesolowskiCpp,
    lang: "c",
    highlight: [1, 38],
    desc: "Chia chiavdf 1.1.14가 x와 y에서 소수 B를 만들고 proof^B · x^r == y를 검사하는 실제 경로입니다.",
    annotations: [
      {
        lines: [2, 12],
        color: "sky",
        note: "GetB는 이 구현에서 직렬화한 x와 y를 hash-to-prime 입력으로 사용합니다. 논문의 일반 transcript 표기와 구현의 정확한 입력을 구분합니다.",
      },
      {
        lines: [24, 27],
        color: "emerald",
        note: "B를 다시 계산하고 r = 2^iters mod B를 구합니다.",
      },
      {
        lines: [28, 30],
        color: "amber",
        note: "proof^B와 x^r를 계산한 뒤 곱합니다. T번의 원래 반복 제곱을 다시 하지 않습니다.",
      },
      {
        lines: [31, 36],
        color: "rose",
        note: "계산한 군 원소가 제출된 y와 같을 때만 valid로 판정합니다.",
      },
    ],
  },
};
