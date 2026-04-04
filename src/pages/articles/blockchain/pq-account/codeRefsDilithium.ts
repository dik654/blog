import type { CodeRef } from '@/components/code/types';

export const dilithiumRefs: Record<string, CodeRef> = {
  'dilithium-keygen': {
    path: 'dilithium/src/keygen.rs', lang: 'rust', highlight: [4, 14],
    desc: 'Dilithium 키 생성: SHAKE-128로 행렬 A를 생성하고,\n짧은 비밀 벡터 s1, s2를 샘플링하여 공개키 t = A*s1 + s2를 계산합니다.',
    code: `let seed = random_bytes(32);
let rho = &seed[0..32];
let a_hat = expand_a(rho);     // 4×4 다항식 행렬
let s1 = sample_short(eta: 2); // 계수 ∈ {-2..2}
let s2 = sample_short(eta: 2);
let t = ntt_inv(a_hat * ntt(s1)) + s2;  // 공개키
// pk = (rho, t), sk = (rho, s1, s2, t)`,
    annotations: [
      { lines: [1, 2] as [number, number], color: 'sky' as const, note: '시드에서 행렬 시드 추출' },
      { lines: [3, 5] as [number, number], color: 'emerald' as const, note: 'A 행렬 + 짧은 비밀 벡터' },
      { lines: [6, 7] as [number, number], color: 'amber' as const, note: 't = A*s1 + s2 (Module-LWE)' },
    ],
  },
  'dilithium-sign': {
    path: 'dilithium/src/sign.rs', lang: 'rust', highlight: [4, 16],
    desc: 'Dilithium 서명: 마스킹 벡터 y로 z = y + c*s1을 계산하고,\n||z||이 크면 거부 샘플링으로 재시작합니다.',
    code: `loop {  // 평균 4-7회 반복
    let y = sample_mask(gamma1: 1 << 17);
    let w = A * y;
    let w1 = high_bits(w, 2 * GAMMA2);
    let c = sample_in_ball(H(mu, w1), tau: 39);
    let z = y + c * s1;  // 서명 벡터
    if z.infinity_norm() >= GAMMA1 - BETA {
        continue;  // 거부: s1 정보 노출 위험
    }
    return Signature { c_tilde, z, h };
}`,
    annotations: [
      { lines: [2, 4] as [number, number], color: 'sky' as const, note: '마스킹 → 상위 비트 추출' },
      { lines: [5, 6] as [number, number], color: 'emerald' as const, note: '도전 c 생성 + 서명 벡터 z' },
      { lines: [7, 9] as [number, number], color: 'rose' as const, note: '거부 샘플링: z가 크면 재시작' },
    ],
  },
  'dilithium-verify': {
    path: 'dilithium/src/verify.rs', lang: 'rust', highlight: [5, 12],
    desc: 'Dilithium 검증: A*z - c*t에서 상위 비트를 복원하고\n도전 해시를 재계산하여 일치하는지 확인합니다.',
    code: `let c = sample_in_ball(sig.c_tilde, tau: 39);
let az_ct = A * z - c * t;
let w1_prime = use_hint(h, az_ct, 2 * GAMMA2);
// 대수적 증명:
//   A*z - c*t = A*(y+c*s1) - c*(A*s1+s2) = A*y - c*s2
let c_tilde_prime = H(mu, w1_prime);
c_tilde_prime == sig.c_tilde  // 일치하면 유효`,
    annotations: [
      { lines: [1, 3] as [number, number], color: 'sky' as const, note: '힌트로 w1 상위 비트 복원' },
      { lines: [4, 5] as [number, number], color: 'emerald' as const, note: 'A*z - c*t = A*y - c*s2' },
      { lines: [6, 7] as [number, number], color: 'amber' as const, note: '해시 재계산 → 일치 확인' },
    ],
  },
};
