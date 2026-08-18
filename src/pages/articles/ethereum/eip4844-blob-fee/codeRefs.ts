import type { CodeRef } from "@/components/code/types";
import eip4844Rs from "../reth-eip4844/codebase/reth/crates/primitives-traits/src/eip4844.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "calc-excess-blob-gas": {
    path: "reth/crates/primitives-traits/src/eip4844.rs",
    code: eip4844Rs,
    lang: "rust",
    highlight: [3, 17],
    desc: "문제: Parent excess와 usage에서 다음 block의 excess state를 만들어야 합니다.\n\n해결: 둘을 더한 뒤 target 미만이면 0, target 이상이면 초과분만 남깁니다 — 본문의 max(0, E+U-T)와 같은 계산을 if/else로 표현한 것입니다.",
    annotations: [
      { lines: [10, 11], color: "sky", note: "excess_plus_used = E_n + U_n (pressure 계산)" },
      { lines: [12, 13], color: "emerald", note: "target 미만이면 0 — max(0, ...)의 0 분기" },
      { lines: [14, 16], color: "amber", note: "target 이상이면 초과분만 반환 — max(0, ...)의 residual 분기" },
    ],
  },
  "calc-blob-fee": {
    path: "reth/crates/primitives-traits/src/eip4844.rs",
    code: eip4844Rs,
    lang: "rust",
    highlight: [19, 45],
    desc: "문제: excess가 커질수록 지수적으로 증가하는 price를 모든 client가 같은 값으로 계산해야 합니다.\n\n해결: calc_blob_fee가 fake_exponential을 호출하고, fake_exponential은 floating-point 없이 정수 Taylor 항을 반복해서 더합니다.",
    annotations: [
      { lines: [21, 27], color: "sky", note: "calc_blob_fee: MIN_BLOB_GASPRICE·excess·UPDATE_FRACTION을 fake_exponential에 전달" },
      { lines: [33, 35], color: "emerald", note: "초기 누적자 = factor × denom" },
      { lines: [38, 42], color: "amber", note: "각 항을 num/(denom×i)로 갱신하며 반복 — Taylor 급수의 정수 근사" },
      { lines: [44, 44], color: "violet", note: "마지막에 denom으로 나눠 정규화" },
    ],
  },
};
