export const C = {
  problem: '#ef4444', utxo: '#6366f1', shield: '#10b981', zk: '#f59e0b',
};

export const STEPS = [
  {
    label: '문제: 모든 TX가 공개된다',
    body: 'Ethereum TX는 from, to, amount가 전부 공개. Etherscan에서 누구나 자산 흐름을 추적할 수 있다.',
  },
  {
    label: '비트코인 UTXO 모델 차용',
    body: 'UTXO(Unspent Transaction Output) 모델에서는 "잔액"이 아니라 "미사용 출력"을 소비한다.\nRAILGUN은 이 모델을 EVM 위에 구현한다.',
  },
  {
    label: 'Shielded 잔액 — Commitment로 은닉',
    body: 'Note(npk, token, value, random)를 Poseidon 해시로 commitment 생성.\n값과 소유자가 해시 뒤에 숨는다.',
  },
  {
    label: 'ZK 증명으로 소유권 검증',
    body: '소비할 때 "이 commitment를 만든 사람"임을 Groth16 증명으로 입증.\n비밀키를 공개하지 않고도 검증 가능.',
  },
];
