export const C = {
  map: '#6366f1', chain: '#10b981', provider: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1~3: MultiChainProvider 구조체',
    body: 'chains: HashMap<ChainId, KohakuProvider>\nChainId를 키로 각 체인별 독립 KohakuProvider 관리.',
  },
  {
    label: 'Line 5~8: add_chain() — 체인 추가',
    body: 'HeliosClient::new(rpc, checkpoint)\nKohakuProvider::new(helios, ORAMProxy, DandelionRouter)\n각 체인마다 독립된 경량 클라이언트 + ORAM + Dandelion.',
  },
  {
    label: '멀티체인 프라이버시 달성',
    body: 'Ethereum, Optimism, Base 등 각 체인별 독립 인스턴스.\n체인 간 쿼리 패턴이 격리되어 크로스체인 프로파일링 불가.',
  },
];
