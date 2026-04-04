export const STEPS = [
  { label: 'Chunk + Parent + Node: 체인 타입',
    body: 'Chunk = 시퀀서별 독립 체인 단위. Node = Chunk + 서명 + Parent(이전 인증서)' },
  { label: 'Engine select_loop!: 노드 수신 → 검증',
    body: 'Node 디코딩 → 서명 검증 → parent 인증서 처리 → handle_node()' },
  { label: 'AckManager: 부분 서명 → 인증서',
    body: '부분 서명 누적 → 2f+1 쿼럼 시 Certificate 반환. 3중 Map으로 관리' },
  { label: 'TipManager: 시퀀서별 최신 청크',
    body: 'tips HashMap으로 시퀀서별 최신 Node 추적 — 동일 height면 payload 일치 필수' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ordered-types',
  1: 'ordered-engine',
  2: 'ordered-ack-mgr',
  3: 'ordered-types',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'types.rs — Chunk + Node',
  1: 'engine.rs — select_loop!',
  2: 'ack_manager.rs — AckManager',
  3: 'types.rs — TipManager',
};
