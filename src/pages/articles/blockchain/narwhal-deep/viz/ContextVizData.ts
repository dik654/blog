export const C = { seq: '#ef4444', dag: '#10b981', cert: '#6366f1', avail: '#f59e0b' };

export const STEPS = [
  {
    label: '순차 멤풀의 병목',
    body: '전통 BFT: 리더 1명이 블록 제안 — 대역폭 병목 + 장애 시 TX 유실',
  },
  {
    label: 'DAG 기반 병렬 제안',
    body: '모든 검증자가 동시에 배치 제안 — 리더 없이 병렬 전파, DAG로 인과관계 기록',
  },
  {
    label: '증명서(Certificate)로 가용성 보장',
    body: '각 vertex에 2f+1 서명 = 증명서(Certificate) — TX 유실 방지',
  },
  {
    label: 'Narwhal = DAG 멤풀 레이어',
    body: 'Narwhal은 멤풀 프로토콜 — 그 위에 Tusk/Bullshark 합의 실행',
  },
];
