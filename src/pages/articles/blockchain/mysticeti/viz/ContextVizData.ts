export const C = { mysti: '#6366f1', bull: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: 'Narwhal + Bullshark의 한계',
    body: 'Narwhal은 매 라운드마다 certificate(증명서)를 생성',
  },
  {
    label: '핵심 아이디어: Uncertified DAG',
    body: '증명서 없이 블록을 직접 DAG에 추가',
  },
  {
    label: 'Fast Path: 소유 객체 즉시 확정',
    body: 'Sui의 객체 모델: 소유 객체는 충돌 불가',
  },
  {
    label: 'Mysticeti: Bullshark 대비 2배 지연 감소',
    body: 'Bullshark: 3 라운드 커밋 → Mysticeti: 2 라운드 커밋',
  },
];
