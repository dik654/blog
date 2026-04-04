export const C = {
  current: '#6366f1', next: '#10b981', handoff: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Period N: current_sync_committee 사용 중',
    body: 'Update 메시지에 next_sync_committee가 포함된다.\nMerkle 증명으로 next committee를 검증.',
  },
  {
    label: 'Period N+1 시작: 핸드오프',
    body: 'store.current = store.next로 교체.\nnext는 다음 Update에서 새로 수신.',
  },
];
