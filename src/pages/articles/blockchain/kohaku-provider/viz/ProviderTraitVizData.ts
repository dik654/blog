export const C = {
  trait_c: '#6366f1', helios: '#0ea5e9', oram: '#10b981', dandelion: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Provider trait — 3개 메서드 인터페이스',
    body: 'get_balance, get_nonce, call 3개 async fn으로 추상화.\n구현체만 교체하면 MockProvider 주입 가능.',
  },
  {
    label: 'KohakuProvider 구조체 — 3개 컴포넌트 조합',
    body: 'helios: HeliosClient(상태 검증)\noram: ORAMProxy(쿼리 프라이버시)\ndandelion: DandelionRouter(TX 프라이버시)',
  },
  {
    label: 'get_balance() 실행 흐름',
    body: '1) ORAM이 더미 쿼리와 섞어 전송\n2) Helios가 Merkle 증명으로 응답 검증\n→ 프라이버시 + 무신뢰 동시 달성.',
  },
];
