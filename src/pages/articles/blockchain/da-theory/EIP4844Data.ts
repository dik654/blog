export const BLOBTX_STEPS = [
  {
    title: 'BlobTx = DynamicFeeTx + blob 필드',
    desc: '기존 EIP-1559 트랜잭션에 BlobFeeCap(blob 가스 최대 가격)과 BlobHashes(versioned hash 배열) 두 필드를 추가한다.',
    codeKey: 'blob-tx-struct',
  },
  {
    title: 'Sidecar: 전파 전용, 블록에는 미포함',
    desc: 'Sidecar에 실제 blob 데이터 + KZG 커밋먼트 + 증명이 담긴다. rlp:"-" 태그로 블록 직렬화에서 제외된다. 블록에는 versioned hash만 기록한다.',
    codeKey: 'blob-sidecar',
  },
  {
    title: 'BLOBHASH 옵코드로 EVM에서 참조',
    desc: '롤업 컨트랙트가 BLOBHASH(0x49) 옵코드로 blob의 versioned hash에 접근한다. 스택에서 인덱스를 pop해 BlobHashes[index]를 push한다.',
    codeKey: 'opcode-blobhash',
  },
];

export const VALIDATE_STEPS = [
  {
    title: '① Sidecar 존재 + 포크별 version 확인',
    desc: 'sidecar가 nil이면 즉시 거부. Osaka 이후는 Version1(cell proof), 이전은 Version0(blob proof)만 허용한다.',
    codeKey: 'blob-validate-tx',
  },
  {
    title: '② blob 개수 제한 (최소 1, 최대 6)',
    desc: '빈 blob 트랜잭션은 불허. 블록당 최대 6개 blob까지만 허용해 네트워크 부하를 제한한다.',
    codeKey: 'blob-validate-tx',
  },
  {
    title: '③ 커밋먼트 → hash 일치 + KZG 증명 검증',
    desc: '커밋먼트에서 계산한 hash와 tx의 BlobHashes를 비교한다. V0은 blob당 1개 VerifyBlobProof, V1은 128개 cell proof 배치 검증으로 전환된다.',
    codeKey: 'blob-validate-legacy',
  },
];

export const GAS_STEPS = [
  {
    title: 'excess 누적: target 기준 조절',
    desc: 'excessBlobGas = 부모excess + 부모사용량 - targetGas. target보다 많이 쓰면 excess 증가 → blob 가격 상승. 적게 쓰면 excess = 0 → 가격 최저.',
    codeKey: 'blob-excess-calc',
  },
  {
    title: 'fakeExponential: 정수 지수 근사',
    desc: 'blob 가격 = MIN_PRICE x e^(excess / UPDATE_FRACTION). 이 지수함수를 테일러 급수로 정수 근사한다. EVM에 부동소수점이 없기 때문이다.',
    codeKey: 'blob-fake-exponential',
  },
  {
    title: '헤더 검증: BlobGasUsed 정합성',
    desc: 'VerifyEIP4844Header가 블록 헤더의 BlobGasUsed(131072의 배수)와 ExcessBlobGas(부모 기반 계산값 일치)를 확인한다.',
    codeKey: 'blob-gas-verify',
  },
];
