import type { FlowNode } from './FlowDiagram';

/* ── txpool-0: on_new_pooled_transaction_hashes ───────────────── */
/* ── txpool-1: send_raw_transaction ──────────────────────────── */
export const txpoolFlowData: Record<string, FlowNode[]> = {
  'txpool-0': [
    {
      id: 'tp0-1', fn: 'on_new_pooled_transaction_hashes(peer, hashes)',
      desc: '피어로부터 tx 해시 목록 수신 — 중복 필터 후 실제 tx 요청',
      color: 'sky', codeRefKey: 'txpool-0',
      detail: 'eth/68 프로토콜의 핵심 최적화: 전체 tx 대신 해시(32바이트)만 먼저 받습니다.',
      children: [
        {
          id: 'tp0-1-1', fn: 'is_initially_syncing() → return',
          desc: '초기 동기화 중이거나 tx gossip 비활성화면 즉시 반환',
          color: 'slate', codeRefKey: 'txpool-0',
          detail: '초기 동기화 중에는 tx를 처리할 여유가 없습니다. tx gossip 비활성화 옵션(--txpool.no-gossip)도 여기서 처리됩니다.',
        },
        {
          id: 'tp0-1-2', fn: 'peer_session.get(peer_id)',
          desc: '피어 세션 조회 — 없으면 무시 (이미 연결 끊김)',
          color: 'emerald', codeRefKey: 'txpool-0',
        },
        {
          id: 'tp0-1-3', fn: 'seen_transactions.check_and_update(hashes)',
          desc: '이미 받은 해시 필터링 — 새 해시만 남김',
          color: 'amber', codeRefKey: 'txpool-0',
          detail: '각 피어마다 seen_transactions 집합을 유지합니다. 이미 처리한 tx 해시를 다시 요청하지 않습니다.',
          children: [
            {
              id: 'tp0-1-3-1', fn: 'report_already_seen(peer_id, count)',
              desc: '이미 아는 해시를 보낸 피어 — 평판(reputation) 감점',
              color: 'rose', codeRefKey: 'txpool-0',
              detail: '피어가 불필요한 해시를 반복적으로 보내면 peer_manager가 해당 피어의 평판 점수를 낮춥니다. 낮은 점수의 피어는 연결이 끊깁니다.',
            },
          ],
        },
        {
          id: 'tp0-1-4', fn: 'GetPooledTransactions(new_hashes)',
          desc: '풀에 없는 tx만 피어에게 전체 데이터 요청',
          color: 'violet', codeRefKey: 'txpool-1',
          detail: 'pool.contains(hash)로 txpool에 이미 있는 tx를 제외하고, 없는 것만 GetPooledTransactions 메시지로 요청합니다.',
        },
      ],
    },
  ],

  'txpool-1': [
    {
      id: 'tp1-1', fn: 'eth_sendRawTransaction(rlp_bytes)',
      desc: 'JSON-RPC 진입점 — RLP 인코딩된 서명 트랜잭션 수신',
      color: 'sky', codeRefKey: 'txpool-1',
      children: [
        {
          id: 'tp1-1-1', fn: 'WithEncoded::<Recovered<PoolPooledTx>>::decode(rlp)',
          desc: 'RLP 디코드 + ecrecover — 발신자 주소 복구',
          color: 'emerald', codeRefKey: 'txpool-1',
          detail: '서명(v, r, s)에서 secp256k1 공개키를 역산해 발신자 주소를 도출합니다(ecrecover). 잘못된 서명이면 이 단계에서 실패합니다.',
        },
        {
          id: 'tp1-1-2', fn: 'Pool::Transaction::from_pooled(recovered)',
          desc: 'txpool 형식으로 변환 — nonce·잔액·maxFee 사전 검사',
          color: 'amber', codeRefKey: 'txpool-1',
          detail: 'nonce가 현재 온체인 nonce보다 낮으면 즉시 거부. maxFeePerGas가 현재 baseFee보다 낮아도 거부합니다.',
        },
        {
          id: 'tp1-1-3', fn: 'pool.add_transaction(tx)',
          desc: '트랜잭션 풀에 제출 — 서브풀 분류',
          color: 'violet', codeRefKey: 'txpool-0',
          children: [
            {
              id: 'tp1-1-3-1', fn: '→ Pending 서브풀',
              desc: 'nonce 연속 — 다음 블록에 포함 가능한 tx',
              color: 'emerald', codeRefKey: 'txpool-1',
              detail: '발신자의 현재 온체인 nonce와 연속되는 tx입니다. 블록 빌더가 이 서브풀에서 tx를 선택합니다.',
            },
            {
              id: 'tp1-1-3-2', fn: '→ Queued 서브풀',
              desc: 'nonce 갭 있음 — 앞 nonce tx 도착 대기 중',
              color: 'amber', codeRefKey: 'txpool-1',
              detail: '예: 현재 nonce=5인데 nonce=7 tx가 먼저 도착한 경우. nonce=6 tx가 도착하면 두 tx 모두 Pending으로 이동합니다.',
            },
          ],
        },
      ],
    },
  ],
};
