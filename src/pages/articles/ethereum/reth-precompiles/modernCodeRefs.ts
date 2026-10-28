import type { CodeRef } from "@/components/code/types";
import evmEnvSource from "./codebase/reth-v2.8.1/evm-env.rs?raw";
import registrySource from "./codebase/revm-43.0.3/registry.rs?raw";
import providerSource from "./codebase/revm-43.0.3/provider.rs?raw";
import sha256Source from "./codebase/revm-43.0.3/sha256.rs?raw";
import ecrecoverSource from "./codebase/revm-43.0.3/ecrecover.rs?raw";

export const RETH_PRECOMPILES_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · revm 43.0.3",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
} as const;

export const rethPrecompilesCodeRefs: Record<string, CodeRef> = {
  "evm-env": {
    path: "reth-v2.8.1/crates/ethereum/evm/src/lib.rs",
    lang: "rust",
    highlight: [4, 10],
    desc: "Header·ChainSpec에서 active SpecId가 포함된 EvmEnv를 만드는 Reth 경계",
    annotations: [
      { lines: [4, 10], color: "sky", note: "현재 block과 ChainSpec으로 EVM 환경을 고정" },
    ],
    code: evmEnvSource,
  },
  registry: {
    path: "revm-precompile-43.0.3/src/lib.rs",
    lang: "rust",
    highlight: [4, 85],
    desc: "Spec별 registry 초기화와 주소 lookup",
    annotations: [
      { lines: [4, 9], color: "sky", note: "Spec마다 registry를 한 번 만들고 재사용" },
      { lines: [12, 18], color: "emerald", note: "CALL 주소로 현재 registry entry 조회" },
      { lines: [57, 69], color: "amber", note: "EVM SpecId를 precompile 변화 지점으로 축약" },
      { lines: [72, 85], color: "sky", note: "EVM SpecId를 registry 변화가 생기는 fork 단위로 매핑" },
    ],
    code: registrySource,
  },
  provider: {
    path: "revm-handler-43.0.3/src/precompile_provider.rs",
    lang: "rust",
    highlight: [14, 58],
    desc: "미등록 주소, precompile 실행과 InterpreterResult 변환 경계",
    annotations: [
      { lines: [45, 47], color: "amber", note: "현재 registry에 없으면 regular contract 경로로 반환" },
      { lines: [49, 55], color: "sky", note: "입력·gas limit·reservoir를 선택한 함수에 전달" },
      { lines: [18, 37], color: "rose", note: "Halt는 남은 frame gas와 output을 모두 지움" },
    ],
    code: providerSource,
  },
  sha256: {
    path: "revm-precompile-43.0.3/src/hash.rs",
    lang: "rust",
    highlight: [4, 13],
    desc: "입력 길이로 gas를 먼저 계산한 뒤 SHA-256을 실행",
    annotations: [
      { lines: [5, 7], color: "amber", note: "60 + 12×ceil(bytes/32)를 gas limit과 먼저 비교" },
      { lines: [9, 11], color: "emerald", note: "통과한 입력만 crypto provider로 해시" },
    ],
    code: sha256Source,
  },
  ecrecover: {
    path: "revm-precompile-43.0.3/src/secp256k1.rs",
    lang: "rust",
    highlight: [4, 27],
    desc: "OOG와 잘못된 서명 입력이 서로 다른 결과를 만드는 ecRecover 경계",
    annotations: [
      { lines: [7, 9], color: "rose", note: "3,000 gas보다 적으면 즉시 OOG" },
      { lines: [14, 17], color: "amber", note: "잘못된 v는 3,000 gas를 쓰고 빈 output으로 성공 반환" },
      { lines: [24, 27], color: "emerald", note: "유효한 형식만 backend recovery로 전달" },
    ],
    code: ecrecoverSource,
  },
};
