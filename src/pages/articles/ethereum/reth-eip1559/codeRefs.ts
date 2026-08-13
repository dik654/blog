import type { CodeRef } from "@/components/code/types";
import eip1559Rs from "./codebase/reth/crates/primitives-traits/src/eip1559.rs?raw";
import txRs from "./codebase/reth/crates/primitives-traits/src/tx.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "calc-base-fee": {
    path: "reth/crates/primitives-traits/src/eip1559.rs",
    code: eip1559Rs,
    lang: "rust",
    highlight: [5, 35],
    desc: "문제: base fee와 gas delta의 중간 곱이 좁은 정수 범위를 넘을 수 있고 integer division 순서가 consensus 결과를 바꿉니다.\n\n해결: widened integer와 명시적 conversion을 사용하고 protocol의 multiplication·division·rounding 순서를 그대로 따릅니다.",
    annotations: [
      {
        lines: [12, 14],
        color: "sky",
        note: "gas_target은 활성 chain parameters의 elasticity로 계산",
      },
      {
        lines: [16, 26],
        color: "emerald",
        note: "가스 초과 시: base_fee_delta = base_fee * delta / target / denominator (최소 1)",
      },
      {
        lines: [27, 35],
        color: "amber",
        note: "가스 미달 시: base_fee에서 delta를 빼되 0 이하로 가지 않음 (saturating_sub)",
      },
    ],
  },
  "effective-tip": {
    path: "reth/crates/primitives-traits/src/tx.rs",
    code: txRs,
    lang: "rust",
    highlight: [4, 20],
    desc: "문제: transaction fee cap에서 base fee를 제외한 beneficiary 몫을 현재 block 문맥에 맞게 계산해야 합니다.\n\n해결: effective_tip = min(max_priority_fee, max_fee - base_fee). fee cap이 base fee보다 작으면 이 문맥에서 executable tip을 만들지 않습니다.",
    annotations: [
      {
        lines: [7, 10],
        color: "sky",
        note: "fee cap이 current base fee 미만이면 이 block에서 실행 불가",
      },
      {
        lines: [13, 15],
        color: "emerald",
        note: "min(priority_fee, max_fee - base_fee) — 실효 팁 계산",
      },
    ],
  },
};
