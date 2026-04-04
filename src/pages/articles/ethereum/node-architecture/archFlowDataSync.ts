import type { FlowNode } from './FlowDiagram';

/* ── sync-0: update_sync_state ────────────────────────────────── */
export const syncFlowData: Record<string, FlowNode[]> = {
  'sync-0': [
    {
      id: 's0-1', fn: 'update_sync_state()', desc: '동기화 상태 자동 결정 — 주기적으로 호출',
      color: 'sky', codeRefKey: 'sync-0',
      detail: '피어 연결 변화, 블록 수신, RangeSync 상태 변화 시마다 호출됩니다. 가장 적합한 동기화 전략을 선택합니다.',
      children: [
        {
          id: 's0-1-1', fn: 'range_sync.state()',
          desc: 'RangeSync 상태 조회 — 대량 배치 다운로드 진행 여부 확인',
          color: 'emerald', codeRefKey: 'sync-0',
          detail: 'RangeSync가 활성화되어 있으면 수십~수천 개 블록을 배치로 요청합니다. 피어들에게 GetBlocksByRange로 분산 요청합니다.',
        },
        {
          id: 's0-1-2', fn: '→ SyncingFinalized 또는 SyncingHead',
          desc: 'RangeSync 진행 중 — 대량 배치로 빠른 따라잡기',
          color: 'amber', codeRefKey: 'sync-0',
          detail: 'SyncingFinalized: finalized 체크포인트까지 따라잡는 중. SyncingHead: finalized 이후 헤드까지 따라잡는 중.',
        },
        {
          id: 's0-1-3', fn: '→ SyncTransition',
          desc: 'RangeSync 없음 + 앞선 피어 있음 — 개별 누락 블록 lookup',
          color: 'violet', codeRefKey: 'sync-0',
          detail: '소수의 누락 블록을 개별적으로 요청합니다. 거의 동기화 완료 상태입니다.',
        },
        {
          id: 's0-1-4', fn: '→ Synced + backfill 확인',
          desc: '헤드 동기화 완료 — gossip 실시간 수신 전환',
          color: 'sky', codeRefKey: 'sync-0',
          children: [
            {
              id: 's0-1-4-1', fn: 'backfill_sync.needs_backfill()',
              desc: '과거 히스토리 부족 여부 확인',
              color: 'slate', codeRefKey: 'sync-0',
            },
            {
              id: 's0-1-4-2', fn: 'backfill_sync.start()',
              desc: '역방향 다운로드 시작 — 체크포인트 동기화 이전 히스토리',
              color: 'rose', codeRefKey: 'sync-0',
              detail: '체크포인트 동기화(--checkpoint-sync-url)로 빠르게 시작한 노드는 과거 히스토리가 없습니다. Backfill은 역방향으로 오래된 블록을 채웁니다.',
            },
          ],
        },
        {
          id: 's0-1-5', fn: '→ Stalled',
          desc: '피어 없음 — 연결을 기다리는 대기 상태',
          color: 'slate', codeRefKey: 'sync-0',
          detail: '피어 발견 시 PeerDiscovery가 새 연결을 시도합니다.',
        },
      ],
    },
  ],
};
