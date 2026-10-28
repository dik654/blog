import type { CodeRef } from "@/components/code/types";
import executeOneRs from "./codebase/reth-v2.8.1/execute-one.rs?raw";
import evmConfigRs from "./codebase/reth-v2.8.1/evm-config.rs?raw";
import executionOutputRs from "./codebase/reth-v2.8.1/execution-output.rs?raw";
import bundleStateRs from "./codebase/reth-v2.8.1/bundle-state.rs?raw";
import postExecutionValidationRs from "./codebase/reth-v2.8.1/post-execution-validation.rs?raw";

export const RETH_BLOCK_EXECUTION_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
  revm: {
    id: "revm",
    label: "revm database 43.0.1 · Rust",
    badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
  },
} as const;

export const rethBlockExecutionCodeRefs: Record<string, CodeRef> = {
  "execute-one": {
    path: "reth/crates/evm/evm/src/execute.rs",
    code: executeOneRs,
    lang: "rust",
    highlight: [1, 45],
    desc: "Reth v2.8.1에서 실행 결과 검증 없이 BlockExecutionOutput을 만들고, 한 블록 안에서는 pre→본문 순서의 transactions→post를 적용한 뒤 revert를 보존하는 실제 경계입니다.",
    annotations: [
      { lines: [1, 12], color: "amber", note: "execute는 output validation을 하지 않는다고 명시합니다." },
      { lines: [30, 39], color: "sky", note: "사전 변경 뒤 block body 순서대로 거래를 실행합니다." },
      { lines: [41, 44], color: "emerald", note: "사후 변경을 끝낸 뒤 transition과 revert를 BundleState에 합칩니다." },
    ],
  },
  "evm-config": {
    path: "reth/crates/ethereum/evm/src/lib.rs",
    code: evmConfigRs,
    lang: "rust",
    highlight: [1, 26],
    desc: "Reth v2.8.1의 EthEvmConfig가 header와 ChainSpec으로 fork-aware EVM 환경을 만들고, block body에서 system-call과 사후 처리에 필요한 context를 구성하는 부분입니다.",
    annotations: [
      { lines: [1, 8], color: "sky", note: "Header·ChainSpec·chain ID·blob parameter로 EVM environment를 만듭니다." },
      { lines: [10, 26], color: "emerald", note: "Parent hash·beacon root·ommers·withdrawals·slot을 execution context로 묶습니다." },
    ],
  },
  "execution-output": {
    path: "reth/crates/evm/execution-types/src/execute.rs",
    code: executionOutputRs,
    lang: "rust",
    highlight: [1, 32],
    desc: "단일 블록의 BlockExecutionResult와 BundleState, 여러 블록을 누적한 ExecutionOutcome의 서로 다른 결과 경계를 보여 주는 고정 source excerpt입니다.",
    annotations: [
      { lines: [1, 8], color: "sky", note: "단일 블록 output은 실행 결과와 바뀐 상태를 함께 돌려줍니다." },
      { lines: [10, 20], color: "emerald", note: "영수증·requests·gas는 state bundle과 다른 결과 필드입니다." },
      { lines: [22, 32], color: "amber", note: "Batch 결과도 block별 receipt와 request 경계를 잃지 않습니다." },
    ],
  },
  "bundle-state": {
    path: "revm-database-43.0.1/src/states",
    code: bundleStateRs,
    lang: "rust",
    highlight: [1, 45],
    desc: "revm-database 43.0.1이 original·present 값과 revert를 보존하고, cache와 bundle에 없는 account는 database에서 읽는 실제 경계입니다.",
    annotations: [
      { lines: [1, 9], color: "sky", note: "Account별 현재값·원래값·storage·상태를 함께 보존합니다." },
      { lines: [11, 28], color: "emerald", note: "Reverts retention은 상태를 되돌릴 증거를 BundleState에 남깁니다." },
      { lines: [37, 46], color: "amber", note: "BundleState가 있어도 cache miss에서는 backing database를 읽습니다." },
    ],
  },
  "post-execution-validation": {
    path: "reth/crates/ethereum/consensus/src/validation.rs",
    code: postExecutionValidationRs,
    lang: "rust",
    highlight: [1, 56],
    desc: "실행이 만든 gas·receipts·requests·Block Access List hash를 header의 약속과 비교하는 Reth v2.8.1의 별도 post-execution validation 경계입니다.",
    annotations: [
      { lines: [12, 23], color: "amber", note: "Header gas used와 실행 결과가 다르면 블록을 거절합니다." },
      { lines: [25, 31], color: "sky", note: "Receipts root와 logs bloom은 receipt 순서와 내용을 검증합니다." },
      { lines: [33, 44], color: "emerald", note: "활성 fork에서는 requests hash도 별도로 비교합니다." },
      { lines: [43, 56], color: "violet", note: "Amsterdam에서는 계산한 Block Access List hash를 header와 대조합니다." },
    ],
  },
};
