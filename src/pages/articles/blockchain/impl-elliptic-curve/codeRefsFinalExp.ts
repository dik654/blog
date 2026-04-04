import type { CodeRef } from '@/components/code/types';

export const finalExpCodeRefs: Record<string, CodeRef> = {
  'final-exp': {
    path: 'curve/pairing.rs — final_exponentiation()',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'f^((p¹²-1)/r) — 3단계로 분해.\nEasy part: conjugate·inv + frob². Hard part: 761비트 지수 거듭제곱.',
    code: `/// f^((p^12-1)/r) = f^((p^6-1)(p^2+1)·(p^4-p^2+1)/r)
fn final_exponentiation(f: Fp12) -> Fp12 {
    // ── Easy part 1: f^(p^6-1) ──
    // p^6-1 지수: conj(f) = f^(p^6) 이용
    let f_inv = f.inv().unwrap();
    let r1 = f.conjugate() * f_inv; // f^(p^6) · f^(-1)

    // ── Easy part 2: r1^(p^2+1) ──
    let r2 = fp12_frob2(&r1) * r1;  // frob²(r1) · r1

    // ── Hard part: r2^((p^4-p^2+1)/r) ──
    // 761-bit exponent, precomputed
    let hard_exp: [u64; 12] = [
        0xe81bb482ccdf42b1, 0x5abf5cc4f49c36d4,
        0xf1154e7e1da014fd, 0xdcc7b44c87cdbacf,
        0xaaa441e3954bcf8a, 0x6b887d56d5095f23,
        0x79581e16f3fd90c6, 0x3b1b1355d189227d,
        0x4e529a5861876f6b, 0x6c0eb522d5b12278,
        0x331ec15183177faf, 0x01baaa710b0759ad,
    ];
    r2.pow(&hard_exp)
}

/// 페어링 함수: e(P, Q) → GT ⊂ Fp12*
pub fn pairing(p: &G1, q: &G2) -> Fp12 {
    let p_aff = p.to_affine();
    let q_aff = q.to_affine();
    if p_aff.infinity || q_aff.infinity { return Fp12::ONE; }
    let f = miller_loop(&p_aff, &q_aff);
    final_exponentiation(f)
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'Easy part 1: Fp12 conjugate = p^6승. inv와 곱하면 p^6-1승 완료' },
      { lines: [8, 9], color: 'emerald', note: 'Easy part 2: Frobenius² = p²승. 곱하면 p²+1승 완료' },
      { lines: [11, 21], color: 'amber', note: 'Hard part: 761비트 지수. square-and-multiply ~1500회 Fp12 곱셈' },
      { lines: [25, 30], color: 'violet', note: 'pairing() = to_affine → miller_loop → final_exp. 전체 파이프라인' },
    ],
  },
  'frobenius-g2': {
    path: 'curve/pairing.rs — frobenius_g2()',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'Frobenius 자기동형사상 π: (x,y) → (conj(x)·γ₁, conj(y)·γ₂).\nγ 상수는 ξ^((p-1)/3) 등 — 미리 계산된 고정 상수.',
    code: `/// π(x,y) = (conj(x)·γ₁₁, conj(y)·γ₂₁)
fn frobenius_g2(q: &G2Affine) -> G2Affine {
    // γ₁₁ = ξ^((p-1)/3) — 미리 계산된 상수
    let g11 = Fp2::new(
        Fp::from_raw([0x99e39557176f553d, ...]),
        Fp::from_raw([0x1665d51c640fcba2, ...]),
    );
    // γ₂₁ = ξ^((p-1)/2)
    let g21 = Fp2::new(
        Fp::from_raw([0xdc54014671a0135a, ...]),
        Fp::from_raw([0x82d37f632623b0e3, ...]),
    );
    G2Affine::new(q.x.conjugate() * g11, q.y.conjugate() * g21)
}

/// π²(x,y) = (x·γ₁₂, -y)  (γ₂₂ = -1)
fn frobenius_g2_sq(q: &G2Affine) -> G2Affine {
    let g12 = Fp2::new(Fp::from_raw([...]), Fp::ZERO);
    G2Affine::new(q.x * g12, -q.y) // conjugate 불필요 (p² ≡ 1 mod 2)
}`,
    annotations: [
      { lines: [1, 6], color: 'sky', note: 'π: Frobenius. conjugate(a+bu)=a-bu (Fp2 켤레) 후 γ 보정' },
      { lines: [8, 11], color: 'emerald', note: 'γ 상수들: ξ의 거듭제곱 — 미리 계산해 하드코딩' },
      { lines: [16, 19], color: 'amber', note: 'π²: conjugate가 상쇄되어 곱셈 1회 + 부호 반전만 필요' },
    ],
  },
};
