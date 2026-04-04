export const C = {
  header: '#6366f1', committee: '#10b981', branch: '#f59e0b',
};

export const STEPS = [
  {
    label: '필드 1: header (BeaconBlockHeader)',
    body: 'slot, proposer_index, parent_root, state_root, body_root.\n체크포인트 시점의 finalized 블록 헤더.',
  },
  {
    label: '필드 2: current_sync_committee (512 공개키)',
    body: 'pubkeys: [G1Affine; 512] — 현재 기간의 위원회.\naggregate_pubkey: 전체 합산 공개키.',
  },
  {
    label: '필드 3: current_sync_committee_branch',
    body: 'Merkle 증명 (5개 해시). depth=5, index=22.\nheader.state_root에서 committee 해시까지의 경로.',
  },
];
