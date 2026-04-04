export const C = { pp: '#6366f1', pr: '#0ea5e9', cm: '#10b981', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 3단계가 필요한가',
    body: '2단계만으로는 리더가 노드별 다른 순서 부여 가능 → 3단계로 해결',
  },
  {
    label: 'Pre-prepare — 순서 제안',
    body: 'Primary가 시퀀스 번호를 부여하여 Backup에 전송 — O(n)',
  },
  {
    label: 'Prepare — 순서 합의',
    body: '전 노드가 All-to-All 전송 → O(n²) 핵심 병목',
  },
  {
    label: 'Commit — 최종 확정',
    body: '2f+1 Commit 수집 → Safety 보장, 총 5 message delays',
  },
];
