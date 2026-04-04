import type { CodeRef } from '@/components/code/types';
import recursionModRs from './codebase/risc0/zkvm/src/host/recursion/prove/mod.rs?raw';

export const recursionCodeRefs: Record<string, CodeRef> = {
  'recursion-lift': {
    path: 'risc0/zkvm/src/host/recursion/prove/mod.rs',
    code: recursionModRs,
    lang: 'rust',
    highlight: [72, 83],
    annotations: [
      { lines: [72, 74], color: 'sky',     note: 'lift() -- SegmentReceipt(rv32im STARK)를 재귀회로 STARK로 변환' },
      { lines: [75, 83], color: 'emerald', note: '재귀회로 실행 -> claim 디코드 -> merge -> SuccinctReceipt 반환' },
    ],
    desc:
`lift()는 재귀 증명 파이프라인의 첫 번째 단계입니다.

rv32im 회로의 STARK 증명(SegmentReceipt)을 재귀 회로(recursion circuit) 안에서 검증합니다.
결과는 SuccinctReceipt로, 원래 세그먼트 크기에 관계없이 고정 크기의 검증 절차를 가집니다.

이후 join(), resolve(), identity_p254() 등 모든 재귀 프로그램의 입력으로 사용됩니다.`,
  },

  'recursion-join': {
    path: 'risc0/zkvm/src/host/recursion/prove/mod.rs',
    code: recursionModRs,
    lang: 'rust',
    highlight: [115, 132],
    annotations: [
      { lines: [115, 122], color: 'sky',     note: 'join() -- 같은 Session의 두 SuccinctReceipt를 하나로 합성' },
      { lines: [123, 132], color: 'emerald', note: '재귀 prover 실행 -> claim 병합 -> 단일 SuccinctReceipt 반환' },
    ],
    desc:
`join()은 같은 세션의 두 SuccinctReceipt를 하나로 합칩니다.

반복 적용하면 N개의 세그먼트 증명을 하나의 증명으로 압축할 수 있습니다.
내부적으로 재귀 회로가 두 증명의 claim을 검증하고, 합쳐진 claim의 새 증명을 생성합니다.

이것이 RISC Zero의 "재귀 합성(recursive composition)" 핵심 메커니즘입니다.`,
  },

  'recursion-identity': {
    path: 'risc0/zkvm/src/host/recursion/prove/mod.rs',
    code: recursionModRs,
    lang: 'rust',
    highlight: [357, 389],
    annotations: [
      { lines: [357, 364], color: 'sky',     note: 'identity_p254 -- Poseidon BabyBear → Poseidon BN254 해시 전환' },
      { lines: [365, 389], color: 'emerald', note: 'BN254 기반 증명 생성 + Merkle inclusion proof 구성' },
    ],
    desc:
`identity_p254()는 Groth16 변환 직전의 마지막 재귀 단계입니다.

Groth16은 BN254 타원 곡선 위에서 동작하므로, FRI에 사용하는 해시를
Poseidon(BabyBear) → Poseidon(BN254 base field)로 바꿔야 합니다.

이 전환 덕분에 Groth16 검증기가 STARK를 효율적으로 검증할 수 있으며,
최종적으로 ~200바이트의 이더리움 온체인 증명이 만들어집니다.`,
  },
};
