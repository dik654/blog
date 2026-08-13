import type { CodeRef } from "@/components/code/types";
import executorRs from "./codebase/reth/crates/evm/src/executor.rs?raw";
import evmConfigRs from "./codebase/reth/crates/revm/src/evm_config.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "block-executor": {
    path: "reth/crates/evm/src/executor.rs",
    code: executorRs,
    lang: "rust",
    highlight: [4, 29],
    desc: "저장된 코드 스냅샷의 BlockExecutor/BatchExecutor 경계입니다. 현재 Reth API는 pre-execution, transactions, post-execution 수명주기를 중심으로 개편되었으므로 메서드 이름이 아니라 실행 결과 누적과 상위 저장 경계를 비교해 보세요.",
    annotations: [
      {
        lines: [10, 13],
        color: "sky",
        note: "BlockExecutor: 단일 블록 실행 + 검증",
      },
      {
        lines: [18, 26],
        color: "emerald",
        note: "BatchExecutor: 누적 실행 후 finalize()로 BundleState 반환",
      },
    ],
  },
  "evm-config": {
    path: "reth/crates/revm/src/evm_config.rs",
    code: evmConfigRs,
    lang: "rust",
    highlight: [4, 38],
    desc: "저장된 코드 스냅샷에서 header와 transaction을 revm 환경으로 변환하는 경계입니다. 현재 API와 이름이 다를 수 있으므로 chain spec·block context·recovered transaction이 EVM 생성으로 수렴하는 책임을 중심으로 읽으세요.",
    annotations: [
      {
        lines: [8, 18],
        color: "sky",
        note: "fill_block_env: 헤더 → BlockEnv 매핑 (coinbase, basefee, prevrandao 등)",
      },
      {
        lines: [21, 32],
        color: "emerald",
        note: "fill_tx_env: TX → TxEnv 매핑 (caller, gas_limit, value, nonce 등)",
      },
    ],
  },
};
