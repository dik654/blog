export const C = {
  blob: '#6366f1',
  commit: '#0ea5e9',
  kzg: '#f59e0b',
  gas: '#10b981',
};

export const STEPS = [
  {
    label: 'Why: 왜 Blob TX가 필요한가?',
    body: 'L2 롤업의 calldata 비용 절감을 위해 별도 blob 공간을 도입합니다.',
  },
  {
    label: 'Blob TX 구조: TX + Sidecar',
    body: 'TX 본체에 versioned_hashes, Sidecar에 blobs+KZG commitment/proof를 분리 저장합니다.',
  },
  {
    label: 'KZG Commitment 검증',
    body: '개수 일치, 한도(6개) 확인, versioned_hash 매칭, KZG proof 배치 검증 4단계입니다.',
  },
  {
    label: 'Blob Gas 가격: 지수 함수 모델',
    body: 'target=3 blobs 초과 시 fake_exponential()로 가격이 지수적으로 상승합니다.',
  },
  {
    label: 'fake_exponential: 정수 Taylor 급수',
    body: '정수 연산 Taylor 급수로 e^(num/denom)을 근사하여 노드 간 결과 동일성을 보장합니다.',
  },
];
