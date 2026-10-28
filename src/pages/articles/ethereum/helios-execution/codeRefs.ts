import type { CodeRef } from "@/components/code/types";

import evmTransactRs from "./codebase/helios-0.11.1/evm_transact.rs?raw";
import nodeApiRs from "./codebase/helios-0.11.1/node_api.rs?raw";
import proofDbRs from "./codebase/helios-0.11.1/proof_db.rs?raw";
import proofReceiptsRs from "./codebase/helios-0.11.1/proof_receipts.rs?raw";
import rpcProviderRs from "./codebase/helios-0.11.1/rpc_provider.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "hl-evm-transact": {
    path: "helios/ethereum/src/evm.rs",
    code: evmTransactRs,
    lang: "rust",
    highlight: [3, 58],
    desc: "EthereumEvm::transact_inner — block hash를 고정하고 ProofDB를 prefetch한 뒤, miss를 비동기로 보충하고 같은 context를 replay합니다.",
    annotations: [
      { lines: [9, 21], color: "sky", note: "Block을 먼저 읽어 header hash로 고정하고 그 hash를 ProofDB 전체 실행에 사용합니다." },
      { lines: [29, 40], color: "amber", note: "이전 EVM 시도가 남긴 access가 있으면 EVM 생성 전에 비동기 update_state를 수행합니다." },
      { lines: [42, 55], color: "emerald", note: "같은 tx와 block으로 context를 만들고 EVM을 scope 안에서 replay한 뒤 miss 여부를 확인합니다." },
    ],
  },
  "hl-proofdb-state": {
    path: "helios/revm-utils/src/proof_db.rs",
    code: proofDbRs,
    lang: "rust",
    highlight: [3, 212],
    desc: "ProofDB EvmState — Basic·Storage·BlockHash miss를 typed access로 기록하고, 같은 pinned block에서 account·slot을 보충합니다.",
    annotations: [
      { lines: [3, 17], color: "sky", note: "빠진 state의 종류와 pinned block·override를 별도 field로 보존합니다." },
      { lines: [37, 80], color: "emerald", note: "동기 실행 밖에서 access를 꺼내 같은 block으로 account·storage·block hash를 보충합니다." },
      { lines: [87, 127], color: "amber", note: "Basic account나 code가 없으면 StateMissing을 남기며, override도 base account fetch 뒤 적용합니다." },
      { lines: [130, 160], color: "violet", note: "Storage·block hash miss도 값 부재와 구분해 typed access로 기록합니다." },
      { lines: [182, 211], color: "rose", note: "Revm의 동기 Database trait은 network를 기다리지 않고 EvmState read 또는 StateMissing만 반환합니다." },
    ],
  },
  "hl-execution-hint": {
    path: "helios/core/src/execution/providers/rpc.rs",
    code: rpcProviderRs,
    lang: "rust",
    highlight: [151, 216],
    desc: "RpcExecutionProvider::get_execution_hint — createAccessList에 sender·receiver·producer를 더하고, 각 account를 block id에 고정해 병렬로 가져옵니다.",
    annotations: [
      { lines: [154, 171], color: "sky", note: "Access list는 block id에 대한 원격 hint로 받아옵니다." },
      { lines: [173, 196], color: "amber", note: "실행에 반드시 필요한 sender·receiver·block producer를 중복 없이 보완합니다." },
      { lines: [198, 214], color: "emerald", note: "각 address·slot은 get_account 경로에서 proof 검증을 거쳐 prefetch map에 들어갑니다." },
    ],
  },
  "hl-call-estimate": {
    path: "helios/core/src/client/node.rs",
    code: nodeApiRs,
    lang: "rust",
    highlight: [3, 53],
    desc: "Node::call과 estimate_gas — 같은 N::transact 경로를 사용하고 Success·Revert·Halt를 나누며, estimate는 gas_used를 그대로 반환합니다.",
    annotations: [
      { lines: [3, 19], color: "sky", note: "Call은 block age를 확인한 뒤 transaction validation을 끈 local transact를 실행합니다." },
      { lines: [21, 29], color: "emerald", note: "Success만 output bytes가 되고 Revert·Halt는 별도의 오류 경계로 남습니다." },
      { lines: [32, 52], color: "amber", note: "Estimate도 같은 경로를 쓰며 이 release에는 고정 10% margin이 없습니다." },
    ],
  },
  "hl-log-verification": {
    path: "helios/core/src/execution/providers/rpc.rs",
    code: rpcProviderRs,
    lang: "rust",
    highlight: [3, 150],
    desc: "RPC receipt·log verification — block receipts root를 먼저 확인하고, 반환된 log bytes가 해당 transaction receipt에 실제로 있는지 대조합니다.",
    annotations: [
      { lines: [18, 28], color: "sky", note: "Log가 가리키는 block의 receipt 전체를 검증된 경로로 가져옵니다." },
      { lines: [30, 63], color: "emerald", note: "Transaction hash별 receipt log를 RLP-encode해 원격 log가 실제 receipt 안에 있는지 확인합니다." },
      { lines: [76, 118], color: "amber", note: "Receipt와 block receipt 목록은 header receipts root를 통과한 뒤 반환됩니다." },
      { lines: [126, 148], color: "violet", note: "Filter range를 고정하고 log membership과 filter 조건을 모두 확인합니다." },
    ],
  },
  "hl-receipts-root": {
    path: "helios/core/src/execution/proof.rs",
    code: proofReceiptsRs,
    lang: "rust",
    highlight: [3, 19],
    desc: "verify_block_receipts — canonical receipt encoding의 ordered trie root를 계산해 block header의 receipts root와 비교합니다.",
    annotations: [
      { lines: [5, 10], color: "sky", note: "Receipt 순서와 canonical encoding으로 expected root를 다시 계산합니다." },
      { lines: [12, 18], color: "rose", note: "Header commitment와 다르면 receipt·log 결과를 공개하지 않습니다." },
    ],
  },
  "hl-broadcast": {
    path: "helios/core/src/client/node.rs",
    code: nodeApiRs,
    lang: "rust",
    highlight: [129, 143],
    desc: "Transaction submission boundary — raw transaction은 provider에 전달하고, receipt는 별도 검증 경로로 조회합니다.",
    annotations: [
      { lines: [129, 131], color: "amber", note: "제출 시점에는 execution provider가 반환한 hash를 그대로 돌려줍니다." },
      { lines: [133, 143], color: "emerald", note: "나중 receipt와 block receipt는 별도 provider verification 경로를 거칩니다." },
    ],
  },
};
