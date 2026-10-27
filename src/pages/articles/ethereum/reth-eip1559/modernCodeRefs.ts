import type { CodeRef, ProjectMeta } from "@/components/code/types";
import chainSpecRs from "./codebase/reth-v2.8.1/chainspec-api.rs?raw";
import headerValidationRs from "./codebase/reth-v2.8.1/header-validation.rs?raw";
import consumersRs from "./codebase/reth-v2.8.1/consumers.rs?raw";
import helpersRs from "./codebase/alloy-v2.5.0/eip1559-helpers.rs?raw";
import transactionRs from "./codebase/alloy-v2.5.0/transaction.rs?raw";

export const RETH_EIP1559_PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
  alloy: {
    id: "alloy",
    label: "Alloy v2.5.0 · Rust",
    badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
  },
};

export const rethEip1559CodeRefs: Record<string, CodeRef> = {
  "chain-params": {
    path: "reth-v2.8.1/crates/chainspec/src/api.rs",
    code: chainSpecRs,
    lang: "rust",
    highlight: [7, 19],
    desc: "Reth가 target timestamp의 ChainSpec에서 BaseFeeParams를 고르고 parent header의 Alloy 계산으로 넘기는 경계입니다.",
    annotations: [
      {
        lines: [7, 7],
        color: "sky",
        note: "Fork·timestamp에 따라 달라질 수 있는 parameter source",
      },
      {
        lines: [10, 19],
        color: "emerald",
        note: "Parent header와 target timestamp를 한 계산 문맥으로 묶음",
      },
    ],
  },
  "base-fee-calculation": {
    path: "alloy-v2.5.0/crates/eips/src/eip1559/helpers.rs",
    code: helpersRs,
    lang: "rust",
    highlight: [1, 37],
    desc: "Reth v2.8.1이 의존하는 alloy-eips v2.5.0의 next base-fee 정수 계산입니다. 증가·동일·감소 분기와 1 wei minimum을 실제 코드로 확인합니다.",
    annotations: [
      {
        lines: [7, 16],
        color: "sky",
        note: "Parameter와 target이 0인 방어 경계",
      },
      {
        lines: [19, 29],
        color: "emerald",
        note: "Target 초과 시 u128 중간 곱과 최소 1 wei 증가",
      },
      {
        lines: [30, 36],
        color: "amber",
        note: "Target 미달 시 정수 감소와 saturating subtraction",
      },
    ],
  },
  "effective-tip": {
    path: "alloy-v2.5.0/crates/consensus/src/transaction/mod.rs",
    code: transactionRs,
    lang: "rust",
    highlight: [6, 22],
    desc: "거래 max fee가 current base fee를 감당하는지 먼저 확인하고, 남은 cap과 priority cap 중 작은 값을 effective tip으로 선택합니다.",
    annotations: [
      {
        lines: [13, 16],
        color: "amber",
        note: "Max fee가 base fee보다 작으면 현재 block에서 tip 계산 불가",
      },
      {
        lines: [19, 21],
        color: "emerald",
        note: "Dynamic-fee와 legacy fee를 같은 계약으로 처리",
      },
    ],
  },
  "header-validation": {
    path: "reth-v2.8.1/crates/consensus/common/src/validation.rs",
    code: headerValidationRs,
    lang: "rust",
    highlight: [1, 17],
    desc: "London 전환 block의 initial base fee와 이후 parent-derived expected base fee를 구분하고, 수신 header의 값과 정확히 비교합니다.",
    annotations: [
      {
        lines: [1, 9],
        color: "sky",
        note: "Fork activation과 일반 parent transition을 분리",
      },
      {
        lines: [12, 17],
        color: "amber",
        note: "1 wei라도 다르면 consensus validation 실패",
      },
    ],
  },
  "shared-consumers": {
    path: "reth-v2.8.1/crates/{ethereum/evm,transaction-pool}/src",
    code: consumersRs,
    lang: "rust",
    highlight: [1, 10],
    desc: "Payload의 다음 EVM 문맥과 TxPool의 pending fee가 같은 ChainSpec helper를 소비하는 두 호출 지점입니다. 두 상태의 writer가 같다는 뜻은 아닙니다.",
    annotations: [
      {
        lines: [1, 4],
        color: "emerald",
        note: "다음 payload 실행 환경의 base fee",
      },
      {
        lines: [6, 10],
        color: "sky",
        note: "TxPool 분류에 쓰는 pending base fee",
      },
    ],
  },
};
