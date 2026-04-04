import engineTreeRs from './codebase/reth/crates/engine/tree/src/tree/mod.rs?raw';
import sessionActiveRs from './codebase/reth/crates/net/network/src/session/active.rs?raw';
import transactionsMgrRs from './codebase/reth/crates/net/network/src/transactions/mod.rs?raw';
import sendRawTxRs from './codebase/reth/crates/rpc/rpc/src/eth/helpers/transaction.rs?raw';
import type { CodeRef } from './archCodeRefsTypes';

export const elCoreCodeRefs: Record<string, CodeRef> = {
  'engine-tree-0': {
    path: 'reth/crates/engine/tree/src/tree/mod.rs',
    code: engineTreeRs,
    lang: 'rust',
    highlight: [592, 655],
    annotations: [
      { lines: [592, 629], color: 'sky',     note: '함수 진입 · 타이밍 시작 · 페이로드 레이아웃 검증 (가스 한도, 버전드 해시 등)' },
      { lines: [630, 645], color: 'emerald', note: '잘못된 조상 블록 확인 · backfill 상태에 따라 insert/buffer 분기' },
      { lines: [646, 655], color: 'amber',   note: '처리 결과 확인 · sync 타깃 헤드면 canonical 체인에 등록' },
    ],
    desc:
`문제: CL이 보낸 실행 페이로드를 EVM으로 실행하고 stateRoot를 검증한 뒤 디스크에 저장하는 작업이 모두 완료될 때까지 CL에 응답을 못 보내면 다음 블록 처리가 지연됩니다.

SparseStateTrie란: 전체 상태 트리를 재계산하는 대신, EVM 실행으로 변경된 계정·스토리지 노드만 선택적으로 해싱해 stateRoot를 구하는 방식입니다. 변경이 적을수록 훨씬 빠릅니다.

PersistenceService란: MDBX 디스크 저장을 비동기 태스크로 분리한 서비스입니다. EL은 블록을 인메모리 트리에 보관하고 즉시 VALID를 반환한 뒤, 백그라운드에서 디스크에 씁니다.

해결: on_new_payload() 는 페이로드 검증 → 중복 확인 → EVM 실행 → 인메모리 트리 삽입 순서로 처리하고, 디스크 저장은 PersistenceService에 위임해 응답을 블로킹하지 않습니다.

하이라이트 구간: on_new_payload 진입 → 중복 확인 → 동기/비동기 처리 분기`,
  },

  'devp2p-0': {
    path: 'reth/crates/net/network/src/session/active.rs',
    code: sessionActiveRs,
    lang: 'rust',
    highlight: [218, 260],
    annotations: [
      { lines: [218, 222], color: 'rose',    note: 'Status 메시지 거부 — 핸드셰이크 완료 후 재수신은 프로토콜 위반(BadMessage)' },
      { lines: [223, 241], color: 'sky',     note: '블록 관련 브로드캐스트 — NewBlockHashes, NewBlock, 트랜잭션 해시/데이터' },
      { lines: [242, 260], color: 'emerald', note: '요청/응답 페어 — GetBlockHeaders ↔ BlockHeaders, GetBlockBodies ↔ BlockBodies' },
    ],
    desc:
`문제: 이더리움 DevP2P 프로토콜에서 두 노드가 처음 연결되면 Status 메시지로 체인 정보를 교환하는 핸드셰이크를 수행합니다. 이 과정에서 다른 chainId이거나 다른 genesis 해시를 가진 노드는 차단해야 합니다.

핸드셰이크 완료 후: Status 메시지는 핸드셰이크 단계에서만 유효합니다. ActiveSession은 이미 핸드셰이크가 끝난 세션을 나타내므로, 이후에 다시 Status 메시지가 오면 프로토콜 위반으로 간주하고 BadMessage를 반환합니다.

해결: EthMessage::Status(_) 분기가 EthHandshakeError::StatusNotInHandshake 오류로 즉시 처리합니다. 이후 match 분기들은 실제 데이터 교환 — 블록 헤더 요청/응답, 트랜잭션 전파 등을 처리합니다.

하이라이트 구간: EthMessage 디스패치 시작 — Status 가드 → 블록/트랜잭션 메시지 라우팅`,
  },

  'txpool-0': {
    path: 'reth/crates/net/network/src/transactions/mod.rs',
    code: transactionsMgrRs,
    lang: 'rust',
    highlight: [578, 640],
    annotations: [
      { lines: [578, 589], color: 'sky',     note: '함수 진입 · 초기 동기화 중이거나 tx gossip 비활성화면 즉시 반환' },
      { lines: [590, 627], color: 'emerald', note: '피어 세션 조회 · 중복 해시 카운트 · seen_transactions 집합 갱신' },
      { lines: [628, 640], color: 'amber',   note: '이미 본 해시 지표 기록 · report_already_seen으로 피어 평판 감점' },
    ],
    desc:
`문제: 트랜잭션 전체(수 KB)를 먼저 전송하면 이미 가지고 있는 tx를 중복 수신합니다. 인기 있는 tx는 수십 개 피어에서 동시에 오기 때문에 대역폭이 크게 낭비됩니다.

해결: eth/68 프로토콜의 NewPooledTransactionHashes 메시지 — tx 해시(32바이트)만 먼저 공유합니다. on_new_pooled_transaction_hashes() 는 수신한 해시 목록을 훑어 이미 풀에 있는 것을 제외하고, 없는 것만 GetPooledTransactions 요청으로 실제 데이터를 요청합니다.

부가 로직: 피어가 이미 알고 있다고 표시된 tx의 해시를 다시 보내면 report_already_seen() 으로 피어 평판을 낮춥니다. 초기 동기화 중(is_initially_syncing)이거나 tx gossip이 비활성화된 경우는 즉시 반환합니다.

하이라이트 구간: on_new_pooled_transaction_hashes 진입 → 동기화 상태 확인 → 피어 세션 조회 → 중복 해시 카운트`,
  },

  'txpool-1': {
    path: 'reth/crates/rpc/rpc/src/eth/helpers/transaction.rs',
    code: sendRawTxRs,
    lang: 'rust',
    highlight: [23, 80],
    annotations: [
      { lines: [23, 37], color: 'sky',     note: 'EthTransactions impl 시작 — signers, send_raw_transaction_sync_timeout 위임' },
      { lines: [39, 80], color: 'emerald', note: 'send_transaction — WithEncoded<Recovered<PoolPooledTx>> 수신 · blob 사이드카 업캐스팅 처리' },
    ],
    desc:
`문제: 사용자가 eth_sendRawTransaction 으로 서명된 트랜잭션을 제출할 때, RLP 인코딩 오류·서명 불량·nonce 불일치·잔액 부족 등 다양한 오류가 있을 수 있습니다.

해결: EthTransactions 트레이트 구현체는 send_transaction() 메서드를 통해 처리합니다.
① WithEncoded<Recovered<PoolPooledTx>> — RLP 디코드 + ecrecover로 서명자 주소 복구
② Pool::Transaction::from_pooled() — 풀이 요구하는 형태로 변환 (nonce·잔액·maxFee 검사)
③ pool.add_transaction() — TransactionPool에 제출 → nonce 연속이면 Pending, gap이 있으면 Queued 서브풀에 분류

하이라이트 구간: EthTransactions impl 블록 — signers(), send_raw_transaction_sync_timeout(), send_transaction() 메서드 위임 체인`,
  },
};
