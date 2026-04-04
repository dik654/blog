export const C = { async: '#6366f1', sync: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: '부분 동기(Partial Sync) 가정의 한계',
    body: 'HotStuff, Bullshark 등 대부분의 BFT 프로토콜은',
  },
  {
    label: '비동기 합의의 필요성',
    body: 'DDoS, 네트워크 파티션 등 예측 불가 환경에서도',
  },
  {
    label: '랜덤 코인으로 활성(Liveness) 보장',
    body: 'FLP 불가능성: 결정론적 비동기 합의는 불가능',
  },
  {
    label: 'Tusk: Narwhal DAG 위 비동기 합의',
    body: 'Narwhal이 DAG를 구축 (데이터 가용성)',
  },
];
