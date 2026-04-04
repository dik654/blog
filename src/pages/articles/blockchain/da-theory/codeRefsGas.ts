import type { CodeRef } from '@/components/code/types';

import eip4844Go from './codebase/go-ethereum/consensus/misc/eip4844/eip4844.go?raw';

export const gasCodeRefs: Record<string, CodeRef> = {
  'blob-gas-verify': {
    path: 'go-ethereum/consensus/misc/eip4844/eip4844.go',
    code: eip4844Go,
    lang: 'go',
    highlight: [96, 127],
    desc: 'VerifyEIP4844Header — 블록 헤더의 blob 가스 필드를 검증합니다.\n① ExcessBlobGas/BlobGasUsed 필드 존재 확인\n② BlobGasUsed가 최대치(Max x 131072) 이하인지\n③ BlobGasUsed가 131072의 배수인지 (blob 단위 정합)\n④ ExcessBlobGas가 부모 헤더 기반 계산값과 일치하는지.',
    annotations: [
      { lines: [114, 116], color: 'sky', note: '블록당 최대 blob 가스 = Max블럽 x 131072' },
      { lines: [117, 119], color: 'emerald', note: 'blob 가스는 131072의 배수 — 부분 blob 불허' },
      { lines: [122, 125], color: 'amber', note: 'CalcExcessBlobGas로 계산한 기대값과 비교' },
    ],
  },

  'blob-excess-calc': {
    path: 'go-ethereum/consensus/misc/eip4844/eip4844.go',
    code: eip4844Go,
    lang: 'go',
    highlight: [140, 171],
    desc: 'calcExcessBlobGas — EIP-4844 핵심 공식입니다.\nexcessBlobGas = 부모excess + 부모blobGasUsed - targetGas.\n목표(target)보다 많으면 excess 증가 → blob 가격 상승.\n목표보다 적으면 excess = 0 → blob 가격 하락.\nEIP-7918(Osaka)은 reserve price 메커니즘을 추가합니다.',
    annotations: [
      { lines: [148, 149], color: 'sky', note: '부모 excess + 부모 사용량 합산' },
      { lines: [151, 153], color: 'emerald', note: 'target 미만이면 excess = 0 (가격 최저)' },
      { lines: [157, 166], color: 'amber', note: 'EIP-7918: blobPrice < reservePrice면 완화된 공식 적용' },
      { lines: [170, 170], color: 'rose', note: '원본 EIP-4844: excess - target (단순 차감)' },
    ],
  },

  'blob-fake-exponential': {
    path: 'go-ethereum/consensus/misc/eip4844/eip4844.go',
    code: eip4844Go,
    lang: 'go',
    highlight: [217, 230],
    desc: 'fakeExponential — 정수 산술로 지수함수를 근사합니다.\nfactor x e^(numerator/denominator)를 테일러 급수로 계산.\nblob 가스 가격 = MIN_PRICE x e^(excessBlobGas / UPDATE_FRACTION).\n이 공식이 EIP-1559와 유사한 blob 수수료 시장을 만듭니다.',
    annotations: [
      { lines: [220, 221], color: 'sky', note: 'accum = factor x denominator (테일러 초항)' },
      { lines: [222, 228], color: 'emerald', note: '테일러 급수: accum = accum x num / denom / i (수렴할 때까지)' },
      { lines: [229, 229], color: 'amber', note: '최종: output / denominator' },
    ],
  },
};
