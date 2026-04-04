import type { CodeRef } from '@/components/code/types';

import ethApiRs from './codebase/reth/eth_api.rs?raw';
import engineApiRs from './codebase/reth/engine_api.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'rpc-eth-api': {
    path: 'reth/crates/rpc/rpc/src/eth/api/server.rs',
    code: ethApiRs,
    lang: 'rust',
    highlight: [10, 38],
    desc: 'EthApiServer trait — #[rpc] 매크로로 eth_* JSON-RPC 메서드를 선언. jsonrpsee가 컴파일 타임에 라우팅 코드 생성.',
    annotations: [
      { lines: [10, 11], color: 'sky', note: '#[rpc] 매크로 — namespace "eth"로 자동 라우팅' },
      { lines: [14, 19], color: 'emerald', note: 'getBalance, call — 읽기 전용 상태 조회' },
      { lines: [22, 24], color: 'amber', note: 'sendRawTransaction — TX 제출 → txpool' },
    ],
  },
  'rpc-engine-api': {
    path: 'reth/crates/rpc/rpc-engine-api/src/engine_api.rs',
    code: engineApiRs,
    lang: 'rust',
    highlight: [10, 17],
    desc: 'EngineApi — CL ↔ EL 통신 인터페이스. forkchoice_updated, new_payload, get_payload 3개 핵심 메서드.',
    annotations: [
      { lines: [12, 17], color: 'sky', note: 'provider + payload_builder + beacon_engine_handle' },
      { lines: [20, 29], color: 'emerald', note: 'forkchoice_updated — head/safe/finalized 갱신 + 페이로드 빌드' },
      { lines: [32, 38], color: 'amber', note: 'new_payload — EVM 실행 → 상태 루트 검증' },
    ],
  },
};
