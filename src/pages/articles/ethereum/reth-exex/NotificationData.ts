export interface NotificationEvent {
  id: string;
  name: string;
  desc: string;
  payload: string;
  handling: string;
  color: string;
}

export const NOTIFICATION_EVENTS: NotificationEvent[] = [
  {
    id: 'committed',
    name: 'ChainCommitted',
    desc: '새 블록이 canonical chain에 정상 추가됨.',
    payload: 'Arc<Chain> — 블록 헤더, TX, 영수증, BundleState(상태 변경 diff)',
    handling: '인덱서: TX/로그를 DB에 기록. 브릿지: deposit 이벤트를 L2로 릴레이.',
    color: '#10b981',
  },
  {
    id: 'reorged',
    name: 'ChainReorged',
    desc: 'reorg 발생. 기존 체인이 새 체인으로 교체됨.',
    payload: 'old: Arc<Chain>(제거) + new: Arc<Chain>(추가)',
    handling: '인덱서: old 블록의 인덱스 롤백 → new 블록의 인덱스 적용. 순서가 중요.',
    color: '#f59e0b',
  },
  {
    id: 'reverted',
    name: 'ChainReverted',
    desc: '블록 되감기. finality 이전 블록이 무효화됨.',
    payload: 'Arc<Chain> — 되돌려진 블록들의 데이터',
    handling: '인덱서: 해당 블록의 모든 기록을 삭제하거나 "reverted" 마킹.',
    color: '#ef4444',
  },
];
