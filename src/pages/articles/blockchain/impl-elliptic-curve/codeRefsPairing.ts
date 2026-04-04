import type { CodeRef } from '@/components/code/types';

export const pairingCodeRefs: Record<string, CodeRef> = {
  'miller-loop': {
    path: 'curve/pairing.rs — miller_loop()',
    lang: 'rust',
    highlight: [1, 32],
    desc: 'NAF(|6u+2|) 표현을 MSB→LSB로 순회.\n각 비트마다 line_double, NAF=±1이면 추가로 line_add.\nFrobenius 보정항 Q1, Q2 적용.',
    code: `fn miller_loop(p: &G1Affine, q: &G2Affine) -> Fp12 {
    if p.infinity || q.infinity { return Fp12::ONE; }
    let mut f = Fp12::ONE;    // 누적 결과
    let mut t = *q;           // 이동하는 G2 점
    let neg_q = G2Affine::new(q.x, -q.y);

    // NAF(|6u+2|) MSB→LSB 순회 (64 iterations)
    for i in (0..64).rev() {
        let (new_t, line) = line_double(&t, p); // 접선
        t = new_t;
        f = f.square() * line;  // f² · l_{T,T}(P)

        match ATE_NAF[i] {
            1 => {  // NAF 비트 = +1
                let (new_t, line) = line_add(&t, q, p);
                t = new_t;
                f = f * line;   // f · l_{T,Q}(P)
            }
            -1 => { // NAF 비트 = -1
                let (new_t, line) = line_add(&t, &neg_q, p);
                t = new_t;
                f = f * line;   // f · l_{T,-Q}(P)
            }
            _ => {}
        }
    }
    // BN 보정: Q1 = π(Q), Q2 = -π²(Q)
    let q1 = frobenius_g2(q);
    let q2_neg = { let q2 = frobenius_g2_sq(q);
        G2Affine::new(q2.x, -q2.y) };
    let (new_t, line) = line_add(&t, &q1, p);
    t = new_t; f = f * line;
    let (_, line) = line_add(&t, &q2_neg, p);
    f * line
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'f=1(Fp12 항등원), T=Q에서 시작. neg_q는 -Q 미리 계산' },
      { lines: [9, 11], color: 'emerald', note: '매 iteration: T에서 접선(line_double) → f²·line 누적' },
      { lines: [14, 17], color: 'amber', note: 'NAF=+1: T+Q 할선. NAF=-1: T+(-Q) 할선. NAF=0: 스킵' },
      { lines: [27, 33], color: 'violet', note: 'BN254 전용 보정: Frobenius π, π² 적용 → 정확한 Ate 페어링' },
    ],
  },
  'line-functions': {
    path: 'curve/pairing.rs — line_double + line_add',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'line function: G2 점에서의 접선/할선을 G1 점에서 평가.\nD-type twist 매핑으로 Fp12 결과를 sparse하게 구성.',
    code: `/// line function → Fp12 (sparse: 0이 아닌 계수 3개만)
fn line_eval(lambda: Fp2, xt: Fp2, yt: Fp2, p: &G1Affine) -> Fp12 {
    Fp12::new(
        Fp6::new(embed(p.y), Fp2::ZERO, Fp2::ZERO),
        Fp6::new(-(lambda * embed(p.x)), lambda * xt - yt, Fp2::ZERO),
    )
}

/// 접선 (doubling step): 기울기 = 3x²/(2y)
fn line_double(t: &G2Affine, p: &G1Affine) -> (G2Affine, Fp12) {
    let lambda = (fp2c(3) * t.x.square())
                 * (fp2c(2) * t.y).inv().unwrap();
    let x2t = lambda.square() - fp2c(2) * t.x;
    let y2t = lambda * (t.x - x2t) - t.y;
    (G2Affine::new(x2t, y2t), line_eval(lambda, t.x, t.y, p))
}

/// 할선 (addition step): 기울기 = (y₂-y₁)/(x₂-x₁)
fn line_add(t: &G2Affine, q: &G2Affine, p: &G1Affine)
    -> (G2Affine, Fp12) {
    let lambda = (q.y - t.y) * (q.x - t.x).inv().unwrap();
    let xr = lambda.square() - t.x - q.x;
    let yr = lambda * (t.x - xr) - t.y;
    (G2Affine::new(xr, yr), line_eval(lambda, t.x, t.y, p))
}`,
    annotations: [
      { lines: [2, 6], color: 'sky', note: 'sparse Fp12: c0.c0과 c1.c0, c1.c1만 비영 → 곱셈 최적화 가능' },
      { lines: [10, 15], color: 'emerald', note: 'doubling step: Affine 좌표 사용 (Jacobian 아님) — 교육용 구현' },
      { lines: [18, 24], color: 'amber', note: 'addition step: T+Q의 할선. Affine라서 inv() 매번 호출' },
    ],
  },
};
