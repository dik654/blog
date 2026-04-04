/** CoreTypes Viz — 색상 + 스텝 정의 */

export const C = {
  header: '#6366f1',   // 보라 — BeaconBlockHeader
  agg: '#10b981',      // 녹색 — SyncAggregate
  update: '#0ea5e9',   // 하늘 — LightClientUpdate
  store: '#f59e0b',    // 앰버 — LightClientStore
  accent: '#8b5cf6',   // 바이올렛 — state_root 강조
  muted: '#94a3b8',    // 회색 — 비활성
  alert: '#ef4444',    // 빨강 — 대비 강조
};

export const STEPS = [
  {
    label: 'BeaconBlockHeader — 5필드, 112바이트 고정',
    body: 'slot·proposer_index·parent_root·state_root·body_root.\nstate_root 하나로 EL 상태를 간접 검증한다.',
  },
  {
    label: 'SyncAggregate — 512비트 참여 비트맵 + BLS 서명',
    body: 'Bitvector<512>: 참여자 1비트 표기 (64B).\n서명: BLS12-381 G2 곡선 위의 점 (96B). 총 160바이트.',
  },
  {
    label: 'LightClientUpdate — Update Loop의 핵심 메시지',
    body: 'attested_header → committee + branch → finalized_header + branch → sync_aggregate + signature_slot.\n7필드가 하나의 검증 단위를 이룬다.',
  },
  {
    label: 'LightClientStore — Helios 전체 상태 (수 KB)',
    body: 'Reth: MDBX에 700GB+ 저장.\nHelios: finalized_header + committee 2개 + optimistic_header + 참여 카운터.\n메모리만으로 동작한다.',
  },
];
