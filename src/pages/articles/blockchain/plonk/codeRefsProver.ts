import type { CodeRef } from './codeRefsTypes';

export const proverCodeRefs: Record<string, CodeRef> = {
  'plonk-round1-3': {
    path: 'ZK-Garage/plonk/src/proof_system/prover.rs',
    lang: 'rust',
    highlight: [1, 32],
    desc:
`PLONK 5-Round 프로토콜의 Round 1-3입니다.

Round 1: witness wire 다항식(a,b,c,d)을 KZG로 commit
Round 2: Fiat-Shamir β,γ → permutation accumulator Z(x) commit
Round 3: Fiat-Shamir α → quotient polynomial t(x) 계산 후 3분할 commit`,
    code: `pub fn prove(
    &self,
    prover_key: &ProverKey,
    transcript: &mut Transcript,
) -> Result<Proof, Error> {
    // ── Round 1: Wire Commitments ──
    let (a_poly, b_poly, c_poly, d_poly) = self.compute_wire_polys()?;
    let a_comm = self.commit(&a_poly)?;
    let b_comm = self.commit(&b_poly)?;
    let c_comm = self.commit(&c_poly)?;
    let d_comm = self.commit(&d_poly)?;
    transcript.append_commitments(&[a_comm, b_comm, c_comm, d_comm]);

    // ── Round 2: Permutation ──
    let beta = transcript.challenge_scalar(b"beta");
    let gamma = transcript.challenge_scalar(b"gamma");
    let z_poly = self.compute_permutation_poly(
        &a_poly, &b_poly, &c_poly, &d_poly,
        &beta, &gamma,
    );
    let z_comm = self.commit(&z_poly)?;
    transcript.append_commitment(&z_comm);

    // ── Round 3: Quotient Polynomial ──
    let alpha = transcript.challenge_scalar(b"alpha");
    let t_poly = self.compute_quotient_poly(
        &a_poly, &b_poly, &c_poly, &d_poly,
        &z_poly, &alpha, &beta, &gamma,
        prover_key,
    );
    let (t_lo, t_mid, t_hi) = t_poly.split_into_3(self.n);
    let t_lo_comm = self.commit(&t_lo)?;`,
    annotations: [
      { lines: [7, 12], color: 'sky', note: 'Round 1: 4개 wire 다항식 KZG commit → [a]₁,[b]₁,[c]₁,[d]₁' },
      { lines: [14, 22], color: 'emerald', note: 'Round 2: β,γ 챌린지 → Z(x) accumulator commit' },
      { lines: [24, 32], color: 'amber', note: 'Round 3: α 챌린지 → t(x) 3분할 commit (degree 3n)' },
    ],
  },

  'plonk-round4-5': {
    path: 'ZK-Garage/plonk/src/proof_system/prover.rs',
    lang: 'rust',
    highlight: [1, 30],
    desc:
`Round 4: 평가점 ζ에서 모든 다항식의 값을 전송
Round 5: linearisation trick 적용 후 KZG opening proof 생성`,
    code: `    // ── Round 4: Evaluations ──
    let zeta = transcript.challenge_scalar(b"zeta");
    let a_eval = a_poly.evaluate(&zeta);
    let b_eval = b_poly.evaluate(&zeta);
    let c_eval = c_poly.evaluate(&zeta);
    let d_eval = d_poly.evaluate(&zeta);
    let z_bar_eval = z_poly.evaluate(&(zeta * self.domain.element(1)));
    let s_sigma_1_eval = prover_key.s_sigma_1.0.evaluate(&zeta);
    let s_sigma_2_eval = prover_key.s_sigma_2.0.evaluate(&zeta);
    let s_sigma_3_eval = prover_key.s_sigma_3.0.evaluate(&zeta);

    // ── Round 5: Opening Proofs ──
    let v = transcript.challenge_scalar(b"v");
    let r_poly = self.compute_linearisation(
        &a_eval, &b_eval, &c_eval, &d_eval,
        &z_bar_eval, &alpha, &beta, &gamma,
        &zeta, &z_poly, prover_key,
    );
    // W_ζ(x): opening proof at ζ
    let w_zeta = self.compute_aggregate_opening(
        &[&r_poly, &a_poly, &b_poly, &c_poly, &d_poly,
          &prover_key.s_sigma_1.0, &prover_key.s_sigma_2.0],
        &zeta, &v,
    );
    // W_{ζω}(x): opening proof at ζ·ω
    let w_zeta_omega = self.compute_single_opening(&z_poly, &(zeta * omega));
    Ok(Proof { a_comm, b_comm, c_comm, d_comm, z_comm, /* ... */ })`,
    annotations: [
      { lines: [1, 10], color: 'sky', note: 'Round 4: ζ에서 a,b,c,d,z(ζω),σ₁,σ₂,σ₃ 평가' },
      { lines: [14, 18], color: 'emerald', note: 'Linearisation: r(x) — 검증자가 commit 연산으로 재구성 가능' },
      { lines: [20, 24], color: 'amber', note: 'W_ζ: 여러 다항식을 ζ에서 batch opening' },
      { lines: [26, 27], color: 'violet', note: 'W_{ζω}: Z(x)를 ζ·ω에서 단독 opening' },
    ],
  },
};
