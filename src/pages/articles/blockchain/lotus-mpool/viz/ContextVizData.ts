export const C = { pool: '#6366f1', gas: '#f59e0b', ok: '#10b981', err: '#ef4444', nonce: '#8b5cf6' };

export const STEPS = [
  {
    label: '메시지 풀의 역할',
    body: '블록에 포함되기 전 대기하는 메시지 저장소',
  },
  {
    label: '가스 모델: BaseFee + Premium',
    body: 'BaseFee: 네트워크 혼잡도에 따라 자동 조정',
  },
  {
    label: 'Nonce 순차 관리',
    body: '계정별로 nonce가 순차 증가 — 갭 허용 안 함: nonce 5 없이 6은 실행 불가',
  },
  {
    label: '이더리움과의 차이',
    body: 'BaseFee 계산 공식이 다름 — 이더리움: 블록 가스 사용률 50% 기준',
  },
];
