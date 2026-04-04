import type { FlowNode } from './FlowDiagram';

/* ── devp2p-0: EthMessage dispatch ───────────────────────────── */
export const devp2pFlowData: Record<string, FlowNode[]> = {
  'devp2p-0': [
    {
      id: 'd0-1', fn: 'handle_incoming_message(peer_id, msg)', desc: 'DevP2P 세션에서 수신한 EthMessage 라우팅',
      color: 'sky', codeRefKey: 'devp2p-0',
      detail: 'TCP 스트림에서 RLP 디코드된 메시지가 들어옵니다. match 문으로 메시지 타입을 분기합니다.',
      children: [
        {
          id: 'd0-1-1', fn: 'EthMessage::Status(_) → BadMessage',
          desc: '핸드셰이크 완료 후 Status 재수신 — 프로토콜 위반으로 즉시 거부',
          color: 'rose', codeRefKey: 'devp2p-0',
          detail: 'Status 메시지는 연결 직후 1번만 교환합니다. ActiveSession에서 다시 오면 상대방이 프로토콜을 잘못 구현한 것이므로 EthHandshakeError::StatusNotInHandshake를 반환합니다.',
        },
        {
          id: 'd0-1-2', fn: 'NewBlockHashes / NewBlock → handle_block_broadcast()',
          desc: '블록 브로드캐스트 — 피어가 새 블록 공지 또는 전송',
          color: 'sky', codeRefKey: 'engine-tree-0',
          detail: 'NewBlockHashes: 블록 해시만 먼저 공지 (경량). NewBlock: 전체 블록 포함 (무거움). eth/68 이후로는 주로 해시만 공지하고 요청 시 블록을 전송합니다.',
          children: [
            {
              id: 'd0-1-2-1', fn: 'peer_manager.handle_new_block(peer, block)',
              desc: '블록 유효성 예비 확인 + fork choice 후보에 추가',
              color: 'emerald', codeRefKey: 'engine-tree-0',
            },
          ],
        },
        {
          id: 'd0-1-3', fn: 'NewPooledTransactionHashes → on_new_pooled_tx_hashes()',
          desc: 'tx 해시만 수신 — 없는 tx만 GetPooledTransactions로 요청',
          color: 'amber',
          codeRefKey: 'txpool-0',
          detail: '↗ 소스 클릭: on_new_pooled_transaction_hashes 구현을 확인할 수 있습니다. 동기화 상태 확인 → 중복 필터 → 피어 평판 감점 흐름이 있습니다.',
        },
        {
          id: 'd0-1-4', fn: 'GetBlockHeaders → BlockHeaders',
          desc: '요청/응답 쌍 — 헤더 범위 조회 (동기화에 사용)',
          color: 'violet', codeRefKey: 'storage-0',
          children: [
            {
              id: 'd0-1-4-1', fn: 'database.get_headers(start, limit)',
              desc: 'MDBX에서 블록 헤더 범위 조회',
              color: 'slate', codeRefKey: 'storage-0',
            },
          ],
        },
        {
          id: 'd0-1-5', fn: 'GetBlockBodies → BlockBodies',
          desc: '요청/응답 쌍 — 트랜잭션 바디 조회',
          color: 'emerald', codeRefKey: 'storage-0',
        },
      ],
    },
  ],
};
