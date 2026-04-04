export const C = { blob: '#6366f1', err: '#ef4444', ok: '#10b981', kzg: '#f59e0b', gas: '#0ea5e9' };

export const STEPS = [
  {
    label: 'L2 롤업의 데이터 비용 문제',
    body: '롤업의 L1 데이터 게시 비용이 L2 수수료의 대부분을 차지하여 확장성 병목입니다.',
  },
  {
    label: '문제: calldata의 한계',
    body: 'calldata는 영구 저장이라 임시 데이터에 과도한 비용이 부과됩니다.',
  },
  {
    label: '해결: EIP-4844 Blob TX',
    body: '별도 blob 공간(블록당 최대 6개, 768KB)을 도입하여 calldata보다 저렴한 임시 저장을 제공합니다.',
  },
  {
    label: 'KZG Commitment 무결성 증명',
    body: 'KZG commitment의 versioned hash로 blob ↔ TX 매칭을 별도 proof 없이 검증합니다.',
  },
  {
    label: 'Blob Gas: 독립 가격 시장',
    body: 'EIP-1559의 선형 조정과 달리 지수 함수로 target=3 blobs 초과 시 가격이 급등합니다.',
  },
];
