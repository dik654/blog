import type { CodeRef } from "@/components/code/types";

import proofRs from "./codebase/helios/execution/src/proof.rs?raw";
import rpcAccountRs from "./codebase/helios/execution/src/rpc_account.rs?raw";
import stateCacheRs from "./codebase/helios/execution/src/state_cache.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "hl-account-proof": {
    path: "helios/core/src/execution/proof.rs",
    code: proofRs,
    lang: "rust",
    highlight: [10, 25],
    desc: "verify_account_proof — RPC field를 expected TrieAccount로 묶고 검증된 block header의 state root에 accountProof를 대조합니다.",
    annotations: [
      {
        lines: [15, 21],
        color: "sky",
        note: "응답의 nonce·balance·storage hash·code hash를 하나의 expected account로 다시 구성합니다.",
      },
      {
        lines: [23, 24],
        color: "emerald",
        note: "주소와 expected account를 state root 아래 accountProof에 함께 대조합니다.",
      },
    ],
  },
  "hl-storage-proof": {
    path: "helios/core/src/execution/proof.rs",
    code: proofRs,
    lang: "rust",
    highlight: [27, 38],
    desc: "verify_storage_proof — account 응답의 storage hash를 root로 사용해 각 slot key·value·proof를 검증합니다.",
    annotations: [
      {
        lines: [29, 31],
        color: "sky",
        note: "각 storage proof에서 raw slot key와 RPC가 주장한 value를 꺼냅니다.",
      },
      {
        lines: [33, 34],
        color: "emerald",
        note: "앞 account proof가 묶은 storage hash를 root로 같은 MPT wrapper를 호출합니다.",
      },
    ],
  },
  "hl-verify-proof": {
    path: "helios/core/src/execution/proof.rs",
    code: proofRs,
    lang: "rust",
    highlight: [61, 98],
    desc: "verify_mpt_proof — raw key와 typed value를 canonical path·RLP로 만들고 empty 값은 exclusion proof로 바꿉니다.",
    annotations: [
      {
        lines: [64, 71],
        color: "sky",
        note: "Raw key는 Keccak-256 뒤 nibble path로, typed value는 RLP bytes로 바뀝니다.",
      },
      {
        lines: [73, 79],
        color: "emerald",
        note: "Empty account·slot은 expected None, 나머지는 Some(value)로 Alloy trie verifier에 전달합니다.",
      },
      {
        lines: [83, 97],
        color: "amber",
        note: "두 empty-account 표현과 RLP empty slot 0x80을 exclusion proof 대상으로 분류합니다.",
      },
    ],
  },
  "hl-rpc-account": {
    path: "helios/core/src/execution/providers/rpc.rs",
    code: rpcAccountRs,
    lang: "rust",
    highlight: [1, 45],
    desc: "RpcExecutionProvider::get_account — block을 먼저 고정하고 같은 header hash로 getProof를 호출한 뒤 account·storage·code를 순서대로 검증합니다.",
    annotations: [
      {
        lines: [8, 17],
        color: "sky",
        note: "선택한 block을 구한 뒤 그 header hash를 eth_getProof의 block id로 사용합니다.",
      },
      {
        lines: [19, 20],
        color: "emerald",
        note: "Account는 header state root에, storage는 account 응답의 storage root에 검증합니다.",
      },
      {
        lines: [22, 28],
        color: "amber",
        note: "Code가 필요하면 bytecode의 hash도 proof 안의 code hash와 대조합니다.",
      },
      {
        lines: [34, 44],
        color: "violet",
        note: "모든 검증을 통과한 뒤에만 typed Account를 구성해 반환합니다.",
      },
    ],
  },
  "hl-state-cache": {
    path: "helios/core/src/execution/cache/state.rs",
    code: stateCacheRs,
    lang: "rust",
    highlight: [1, 54],
    desc: "State cache — mutable account는 address+block hash, storage와 code는 content hash로 식별하고 verified response만 분해해 저장합니다.",
    annotations: [
      {
        lines: [1, 12],
        color: "sky",
        note: "Account·storage·code가 바뀌는 축에 맞춰 세 종류의 key를 구분합니다.",
      },
      {
        lines: [16, 23],
        color: "emerald",
        note: "Insert 계약은 이미 VERIFIED인 account proof response만 받습니다.",
      },
      {
        lines: [25, 45],
        color: "amber",
        note: "Storage는 storage root 아래 slot별로, code는 code hash로 content-addressed 저장합니다.",
      },
      {
        lines: [47, 53],
        color: "violet",
        note: "Account proof는 storage proof를 분리한 뒤 address+block hash로 저장합니다.",
      },
    ],
  },
};
