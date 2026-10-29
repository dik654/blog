import type { CodeRef } from "@/components/code/types";
import rpcConfig from "./codebase/reth-v2.8.1/rpc-config.rs?raw";
import ethBalance from "./codebase/reth-v2.8.1/eth-balance.rs?raw";
import stateView from "./codebase/reth-v2.8.1/state-view.rs?raw";
import authServer from "./codebase/reth-v2.8.1/auth-server.rs?raw";
import engineNewPayload from "./codebase/reth-v2.8.1/engine-new-payload.rs?raw";

export const rethRpcCodeRefs: Record<string, CodeRef> = {
  "rpc-config": {
    path: "reth-v2.8.1/crates/rpc/rpc-builder/src/config.rs",
    code: rpcConfig,
    lang: "rust",
    highlight: [6, 42],
    desc: "공개 HTTP·WS module 선택과 JWT 인증 Engine listener 설정은 같은 설정 객체에서 서로 다른 server config로 만들어집니다.",
    annotations: [
      { lines: [7, 15], color: "sky", note: "--http가 켜진 transport에 공개 module 선택을 붙입니다." },
      { lines: [31, 42], color: "amber", note: "Engine API는 auth 전용 주소와 JWT secret으로 별도 구성합니다." },
    ],
  },
  "eth-balance": {
    path: "reth-v2.8.1/crates/rpc/rpc-eth-api/src/core.rs + helpers/state.rs",
    code: ethBalance,
    lang: "rust",
    highlight: [7, 31],
    desc: "eth_getBalance handler가 상태 읽기를 EthState helper에 넘기고, 선택한 block view에서 account balance를 읽습니다.",
    annotations: [
      { lines: [7, 12], color: "sky", note: "JSON-RPC method handler는 params를 받은 뒤 helper에 위임합니다." },
      { lines: [19, 31], color: "emerald", note: "선택한 StateProvider에서 계정을 읽고 계정이 없으면 0을 반환합니다." },
    ],
  },
  "state-view": {
    path: "reth-v2.8.1/crates/rpc/rpc-eth-api/src/helpers/state.rs",
    code: stateView,
    lang: "rust",
    highlight: [21, 42],
    desc: "BlockId를 pending·latest·명시적 id 가운데 하나로 해석해 작업에 넘길 StateProviderBox를 정합니다.",
    annotations: [
      { lines: [14, 19], color: "amber", note: "pending view를 만들 수 있는지 먼저 확인합니다." },
      { lines: [22, 42], color: "emerald", note: "blocking I/O task 안에서 하나의 state provider를 고른 뒤 실제 읽기 함수를 실행합니다." },
    ],
  },
  "auth-server": {
    path: "reth-v2.8.1/crates/rpc/rpc-builder/src/auth.rs",
    code: authServer,
    lang: "rust",
    highlight: [5, 23],
    desc: "Engine auth server는 JWT HTTP layer를 JSON-RPC parsing과 method dispatch 앞에 둡니다.",
    annotations: [
      { lines: [5, 6], color: "amber", note: "JWT 인증 계층이 raw HTTP request를 먼저 검사합니다." },
      { lines: [11, 18], color: "sky", note: "인증을 통과한 요청만 auth RPC module로 전달됩니다." },
    ],
  },
  "engine-new-payload": {
    path: "reth-v2.8.1/crates/rpc/rpc-engine-api/src/engine_api.rs",
    code: engineNewPayload,
    lang: "rust",
    highlight: [6, 49],
    desc: "engine_newPayloadV4 handler가 wire fields를 ExecutionData로 묶고 V4 계약을 검사한 뒤 consensus engine에 전달합니다.",
    annotations: [
      { lines: [14, 17], color: "rose", note: "허용하지 않은 requests hash 표현은 engine 실행 전에 거절합니다." },
      { lines: [39, 43], color: "amber", note: "활성 fork의 version-specific fields를 검사합니다." },
      { lines: [44, 45], color: "emerald", note: "검증을 통과한 candidate만 consensus engine으로 보내 PayloadStatus를 받습니다." },
    ],
  },
};

export const RETH_RPC_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
} as const;
