export const C = { P: '#6366f1', S: '#0ea5e9', A: '#f59e0b', G: '#10b981', R: '#ef4444' };

export const ACTORS = [
  { label: 'C', sub: 'Client', x: 40, color: C.A },
  { label: 'R0', sub: 'Primary', x: 130, color: C.P },
  { label: 'R1', sub: 'Backup', x: 220, color: C.S },
  { label: 'R2', sub: 'Backup', x: 310, color: C.S },
  { label: 'R3', sub: 'Backup', x: 400, color: C.S },
];

export const STEPS = [
  { label: 'Request: Client → Primary', body: 'Client가 Primary(R0)에게 요청 전송' },
  { label: 'Pre-Prepare: Primary → All', body: 'Primary가 시퀀스 번호를 부여하여 모든 Backup에 브로드캐스트' },
  { label: 'Prepare: All ↔ All (O(n²))', body: '각 Replica가 다른 모든 Replica에게 Prepare 전송' },
  { label: 'Commit: All ↔ All', body: '2f+1 Commit 수집 → "committed"' },
  { label: 'Reply: All → Client', body: 'Client가 f+1개 동일 Reply를 받으면 수용' },
];
