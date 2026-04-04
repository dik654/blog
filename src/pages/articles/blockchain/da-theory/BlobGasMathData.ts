export const GAS_MATH_STEPS = [
  {
    title: 'EIP-1559와 동일한 메커니즘',
    desc: '일반 가스의 base fee처럼, blob 가스도 수요-공급에 따라 자동 조절된다. target(목표치)보다 많이 쓰면 가격이 오르고, 적게 쓰면 내린다.',
    codeKey: 'blob-excess-calc',
  },
  {
    title: 'excess blob gas 누적 공식',
    desc: 'excess = parentExcess + parentUsed - target. target = 3 blobs × 131,072 = 393,216 gas. 블록당 target보다 적게 쓰면 excess = 0(하한)이 된다.',
    codeKey: 'blob-excess-calc',
  },
  {
    title: '가격 공식: price = MIN × e^(excess / UPDATE_FRACTION)',
    desc: 'MIN_BLOB_GASPRICE = 1 wei. UPDATE_FRACTION = 5,314,649. excess가 UPDATE_FRACTION만큼 증가하면 가격이 e배(약 2.72배)가 된다.',
    codeKey: 'blob-fake-exponential',
  },
  {
    title: '테일러 급수: EVM에는 부동소수점이 없다',
    desc: 'e^x = 1 + x + x²/2! + x³/3! + ... 이 급수를 정수 산술로 근사한다. fakeExponential이 accum = accum × num / (denom × i)를 반복해 수렴까지 합산한다.',
    codeKey: 'blob-fake-exponential',
  },
];

/** 가격 테이블: excess blob gas → 가격(gwei) 근사 */
export const PRICE_TABLE = [
  { excess: 0, price: 1, label: '최저가' },
  { excess: 5_314_649, price: 2.72, label: '×e' },
  { excess: 10_629_298, price: 7.39, label: '×e²' },
  { excess: 15_943_947, price: 20.09, label: '×e³' },
  { excess: 21_258_596, price: 54.60, label: '×e⁴' },
  { excess: 26_573_245, price: 148.41, label: '×e⁵' },
];
