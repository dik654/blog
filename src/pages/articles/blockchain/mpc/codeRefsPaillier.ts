import type { CodeRef } from '@/components/code/types';
import paillierGo from './codebase/tss-lib/crypto/paillier/paillier.go?raw';

export const paillierCodeRefs: Record<string, CodeRef> = {
  'paillier-keygen': {
    path: 'tss-lib/crypto/paillier/paillier.go',
    code: paillierGo,
    lang: 'go',
    highlight: [40, 110],
    annotations: [
      { lines: [40, 54], color: 'sky', note: 'PublicKey / PrivateKey 타입 — N, LambdaN, PhiN, P, Q' },
      { lines: [70, 97], color: 'emerald', note: 'GenerateKeyPair — 안전소수 2개 동시 생성, P-Q 비트 차이 검증' },
      { lines: [99, 109], color: 'amber', note: 'phiN = (P-1)(Q-1), lambdaN = lcm(P-1,Q-1) 계산' },
    ],
    desc: 'Paillier 키 생성 구현입니다. 두 개의 안전소수(safe prime)를 병렬로 생성하고, |P-Q| 비트 차이가 충분한지 검증합니다. N = P*Q를 RSA 모듈러스로 사용합니다.',
  },

  'paillier-encrypt': {
    path: 'tss-lib/crypto/paillier/paillier.go',
    code: paillierGo,
    lang: 'go',
    highlight: [114, 156],
    annotations: [
      { lines: [114, 127], color: 'sky', note: 'Encrypt — g^m * r^N mod N² (가법 동형 암호화)' },
      { lines: [134, 144], color: 'emerald', note: 'HomoMult — cipher^m mod N² (스칼라 곱)' },
      { lines: [146, 156], color: 'amber', note: 'HomoAdd — c1 * c2 mod N² (동형 덧셈)' },
    ],
    desc: 'Paillier 암호화와 동형 연산입니다. Enc(m) = g^m · r^N mod N². HomoAdd(c1, c2) = c1·c2 mod N² = Enc(m1+m2). 이것이 MPC에서 비밀 값의 덧셈을 가능하게 합니다.',
  },

  'paillier-decrypt': {
    path: 'tss-lib/crypto/paillier/paillier.go',
    code: paillierGo,
    lang: 'go',
    highlight: [174, 191],
    annotations: [
      { lines: [174, 182], color: 'sky', note: 'Decrypt 입력 검증 — c ∈ [0, N²)' },
      { lines: [183, 189], color: 'emerald', note: 'L 함수 적용 — L(c^λ mod N²) · L(g^λ mod N²)⁻¹ mod N' },
    ],
    desc: 'Paillier 복호화입니다. L(u) = (u-1)/N 함수를 사용하여 m = L(c^λ mod N²) · L(g^λ mod N²)⁻¹ mod N으로 평문을 복원합니다.',
  },
};
