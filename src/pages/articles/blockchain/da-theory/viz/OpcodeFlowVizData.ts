export const STEPS = [
  {
    label: 'BLOBHASH 옵코드 (0x49): blob hash 조회',
    body: 'EVM 스택에서 index를 pop → tx.BlobHashes[index]를 push.\n범위 밖이면 0x00 push. core/vm/eips.go',
  },
  {
    label: 'BLOBBASEFEE 옵코드 (0x4A): blob 가스 가격',
    body: 'CalcBlobFee(header.ExcessBlobGas)를 계산해 스택에 push.\nsolidity에서 block.blobbasefee로 접근 가능.',
  },
  {
    label: 'enable4844: Cancun JumpTable 등록',
    body: 'enable4844 함수가 JumpTable에 BLOBHASH, BLOBBASEFEE를 등록한다.\nCancun 하드포크 활성화 시 호출.',
  },
];

/** BLOBHASH 스택 동작 */
export const BLOBHASH_STACK = [
  { phase: 'pop', value: 'index', desc: '스택 최상위에서 pop' },
  { phase: 'check', value: 'index < len(BlobHashes)', desc: '범위 확인' },
  { phase: 'push', value: 'BlobHashes[index]', desc: '32byte hash push' },
];

/** BLOBBASEFEE 스택 동작 */
export const BASEFEE_STACK = [
  { phase: 'read', value: 'header.ExcessBlobGas', desc: '블록 헤더에서 읽기' },
  { phase: 'calc', value: 'CalcBlobFee(excess)', desc: 'fakeExponential 호출' },
  { phase: 'push', value: 'blobBaseFee', desc: '*big.Int push' },
];
