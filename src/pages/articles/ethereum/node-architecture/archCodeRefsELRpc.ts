import dbProviderRs from './codebase/reth/crates/storage/provider/src/providers/database/provider.rs?raw';
import rpcBuilderRs from './codebase/reth/crates/rpc/rpc-builder/src/lib.rs?raw';
import callRs from './codebase/reth/crates/rpc/rpc/src/eth/helpers/call.rs?raw';
import type { CodeRef } from './archCodeRefsTypes';

export const elRpcCodeRefs: Record<string, CodeRef> = {
  'storage-0': {
    path: 'reth/crates/storage/provider/src/providers/database/provider.rs',
    code: dbProviderRs,
    lang: 'rust',
    highlight: [3459, 3490],
    annotations: [
      { lines: [3459, 3464], color: 'sky',     note: 'insert_block 진입 · 블록 번호 추출 (이후 body indices 조회에 사용)' },
      { lines: [3465, 3481], color: 'emerald', note: 'ExecutedBlock 래핑 (영수증·상태 비어있음) · save_blocks(BlocksOnly) 위임' },
      { lines: [3482, 3490], color: 'amber',   note: 'block_body_indices 조회 · 없으면 BlockBodyIndicesNotFound 오류 반환' },
    ],
    desc:
`문제: 블록 헤더·트랜잭션·영수증·상태를 빠르게 저장하고 O(log n) 시간에 조회해야 합니다. 일반 파일 I/O는 너무 느립니다.

해결: Reth는 MDBX(Memory-Mapped B-Tree Database)를 사용합니다. 파일을 메모리에 직접 매핑(mmap)해 페이지 단위로 읽고 쓰므로 시스템 콜 없이 디스크 I/O가 가능합니다.

insert_block() 은 블록을 ExecutedBlock 으로 래핑해 save_blocks(SaveBlocksMode::BlocksOnly) 에 위임합니다. BlocksOnly 모드는 영수증·상태·trie 계산을 건너뛰고 블록 헤더와 바디만 기록합니다.

테이블 구조: BlockBodyIndices(블록 번호 → tx 범위 인덱스), TransactionBlocks(tx 번호 → 블록 번호), StaticFiles(트랜잭션 실제 데이터, 별도 파일).

하이라이트 구간: insert_block → ExecutedBlock 래핑 → save_blocks 위임 → block_body_indices 반환`,
  },

  'rpc-0': {
    path: 'reth/crates/rpc/rpc-builder/src/lib.rs',
    code: rpcBuilderRs,
    lang: 'rust',
    highlight: [116, 175],
    annotations: [
      { lines: [116, 139], color: 'sky',     note: 'RpcModuleBuilder 구조체 — Provider, Pool, Network, EvmConfig 등 의존성 필드' },
      { lines: [140, 175], color: 'emerald', note: '의존성 주입 메서드 체인 — with_provider, with_pool 등으로 빌더 패턴 구성' },
    ],
    desc:
`문제: eth_getBalance, eth_call, eth_sendRawTransaction, debug_traceTransaction 등 수십 개의 RPC 메서드를 체계적으로 등록하고 HTTP/WebSocket 두 트랜스포트로 동시에 서빙해야 합니다.

해결: RpcModuleBuilder — 네임스페이스별 API 모듈을 조립하는 빌더 패턴입니다.
· Provider, Pool, Network, EvmConfig 등 의존성을 제네릭 파라미터로 주입받습니다.
· build() 를 호출하면 TransportRpcModules 를 반환하고, 각 모듈은 jsonrpsee의 RpcModule에 merge() 로 등록됩니다.
· RpcServerConfig 가 HTTP(8545)·WebSocket(8546)·IPC 세 가지 트랜스포트를 동시에 서빙할 수 있습니다.

jsonrpsee란: Rust용 JSON-RPC 2.0 서버/클라이언트 라이브러리로, 비동기 핸들러와 미들웨어를 지원합니다.

하이라이트 구간: RpcModuleBuilder 구조체 정의 — provider, network, pool, evm_config 의존성 필드`,
  },

  'rpc-2': {
    path: 'reth/crates/rpc/rpc/src/eth/helpers/call.rs',
    code: callRs,
    lang: 'rust',
    highlight: [1, 47],
    annotations: [
      { lines: [11, 17],  color: 'sky',     note: 'EthCall impl — eth_call, eth_estimateGas RPC 핸들러. 본문 없음 = 트레이트 기본 구현 사용' },
      { lines: [19, 38],  color: 'emerald', note: 'Call impl — call_gas_limit, max_simulate_blocks, evm_memory_limit 설정 위임' },
      { lines: [41, 47],  color: 'amber',   note: 'EstimateCall impl — 가스 이진 탐색 로직. 본문 없음 = 트레이트 기본 구현 사용' },
    ],
    desc:
`문제: eth_call 은 트랜잭션을 실제로 전송하지 않고 EVM 실행 결과(반환값, 가스 소비량)만 확인하고 싶을 때 사용합니다. EVM을 실행하면 잔액·스토리지가 변경되므로 상태를 격리해야 합니다.

해결: EthCall, Call, EstimateCall 트레이트 위임 구조입니다.
· EthCall: eth_call, eth_estimateGas 등 외부 RPC 핸들러 트레이트
· Call: 내부 EVM 실행 로직 — CacheDB(읽기는 스냅샷, 쓰기는 메모리에만)를 씌워 실행하고 상태 변경을 버립니다.
· EstimateCall: 이진 탐색으로 최소 gasLimit을 찾는 로직

EthApi<N, Rpc> 가 세 트레이트를 모두 구현하고, 실제 로직은 reth_rpc_eth_api crate의 기본 구현에 위임합니다. 이 파일은 Reth 특화 파라미터 바인딩만 담당합니다.

하이라이트 구간: EthCall, Call, EstimateCall impl — 전체 파일이 트레이트 위임 구조`,
  },
};
