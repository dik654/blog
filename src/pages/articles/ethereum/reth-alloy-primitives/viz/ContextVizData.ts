export const C = { rlp: '#6366f1', err: '#ef4444', ok: '#10b981', stack: '#f59e0b', macro: '#8b5cf6' };

export const STEPS = [
  {
    label: '이더리움의 모든 데이터는 RLP로 직렬화',
    body: 'TX, 블록, 상태의 네트워크 전송과 DB 저장에 기본 타입이 가장 빈번하게 생성됩니다.',
  },
  {
    label: '문제: 결정적 직렬화 — 1비트 차이 = 블록 무효',
    body: 'RLP 인코딩이 결정적이어야 해시가 일관되며, 잘못된 직렬화는 블록 검증 실패입니다.',
  },
  {
    label: '문제: Geth big.Int의 힙 할당 비용',
    body: 'Go의 big.Int는 힙 슬라이스 할당으로 블록당 수천 번 생성 시 GC 압박이 누적됩니다.',
  },
  {
    label: '해결: alloy 스택 할당 타입',
    body: 'Address=[u8;20], U256=4xu64 limb 등 스택 할당 타입으로 힙 할당을 제거합니다.',
  },
  {
    label: '해결: alloy-rlp derive 매크로',
    body: '#[derive(RlpEncodable)] 매크로가 컴파일 타임에 인코더를 생성하여 런타임 비용이 0입니다.',
  },
];
