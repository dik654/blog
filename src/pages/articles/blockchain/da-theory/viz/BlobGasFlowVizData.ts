export const STEPS = [
  {
    label: 'VerifyEIP4844Header(parent, header)',
    body: '블록 헤더 검증: BlobGasUsed가 131072의 배수인지,\nExcessBlobGas가 부모 기반 계산값과 일치하는지 확인한다.\nconsensus/misc/eip4844/eip4844.go',
  },
  {
    label: 'calcExcessBlobGas(parent) → uint64',
    body: 'excess = parent.ExcessBlobGas + parent.BlobGasUsed - targetBlobGas.\ntarget 미만이면 excess = 0 (하한). excess가 blob 가격을 결정한다.',
  },
  {
    label: 'CalcBlobFee(excessBlobGas) → *big.Int',
    body: 'fakeExponential(MIN_BLOB_GASPRICE, excess, UPDATE_FRACTION) 호출.\nMIN = 1 wei, UPDATE_FRACTION = 5,314,649.',
  },
  {
    label: 'fakeExponential(): 테일러 급수 루프',
    body: 'output = 0, accum = factor * denom.\nloop: accum += accum * num / (denom * i)\naccum이 0이 되면 종료. 정수 산술로 e^(num/denom) 근사.',
  },
];

/** VerifyEIP4844Header 검증 항목 */
export const HEADER_CHECKS = [
  { label: 'ExcessBlobGas != nil', color: '#6366f1' },
  { label: 'BlobGasUsed != nil', color: '#6366f1' },
  { label: 'Used ≤ Max×131072', color: '#10b981' },
  { label: 'Used % 131072 == 0', color: '#10b981' },
  { label: 'Excess == calc(parent)', color: '#f59e0b' },
];

/** 테일러 급수 반복 과정 시각 데이터 */
export const TAYLOR_ITERS = [
  { i: 0, term: 'factor * denom', label: '초기값' },
  { i: 1, term: 'accum * num / (denom * 1)', label: 'x/1!' },
  { i: 2, term: 'accum * num / (denom * 2)', label: 'x^2/2!' },
  { i: 3, term: 'accum * num / (denom * 3)', label: 'x^3/3!' },
  { i: 4, term: '... → 0 수렴', label: '종료' },
];
