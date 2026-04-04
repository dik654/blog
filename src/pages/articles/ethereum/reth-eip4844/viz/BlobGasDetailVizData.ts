export const C = { excess: '#6366f1', fee: '#f59e0b', taylor: '#10b981', target: '#0ea5e9' };

export const STEPS = [
  {
    label: 'calc_excess_blob_gas()',
    body: 'excess = parent_excess + parent_used - TARGET(3 blobs)으로 가격 함수 입력을 산출합니다.',
  },
  {
    label: 'calc_blob_fee(excess)',
    body: 'fake_exponential(1, excess, 3338477)로 MIN_BLOB_GASPRICE 기반 지수적 가격을 산출합니다.',
  },
  {
    label: 'fake_exponential: Taylor 급수',
    body: 'Taylor 급수 정수 연산으로 e^(num/denom)을 근사하여 노드 간 동일 결과를 보장합니다.',
  },
];
