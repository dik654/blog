import type { CodeRef } from "@/components/code/types";

export const officialPlonkCodeRefs: Record<string, CodeRef> = {
  "plonk-mul-fixture": {
    path: "이 글의 재현 fixture — MulCircuit",
    lang: "rust",
    highlight: [1, 25],
    desc: "dusk-plonk v0.22.1의 공개 API만 사용한 축소 fixture입니다. 비공개 x·y의 곱을 공개 z와 같다고 제약합니다.",
    code: `#[derive(Debug, Default)]
struct MulCircuit {
    x: BlsScalar,
    y: BlsScalar,
    z: BlsScalar,
}

impl Circuit for MulCircuit {
    fn circuit(&self, composer: &mut Composer) -> Result<(), Error> {
        // 비공개 입력 x와 y를 witness로 할당합니다.
        let x = composer.append_witness(self.x);
        let y = composer.append_witness(self.y);

        // 곱셈 행을 추가하고 계산 결과 witness를 받습니다.
        let expected = composer.gate_mul(
            Constraint::new().mult(1).a(x).b(y),
        );

        // z는 verifier도 받는 공개 입력입니다.
        let z = composer.append_public(self.z);

        // 계산 결과와 공개 z가 같은지 별도 행으로 강제합니다.
        composer.assert_equal(expected, z);
        Ok(())
    }
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "Default 값은 compile 때 회로 모양을 만들고, 실제 3·4·12는 prove 때 사용합니다." },
      { lines: [10, 12], color: "amber", note: "x와 y는 witness columns로 들어가며 proof와 함께 직접 전송되지 않습니다." },
      { lines: [15, 17], color: "violet", note: "gate_mul은 qM=1, qO=-1인 산술 행을 추가하고 결과 witness를 반환합니다." },
      { lines: [20, 23], color: "emerald", note: "공개 입력 행과 equality 행이 추가되어 expected=public z가 강제됩니다." },
    ],
  },
  "dusk-plonk-compiler": {
    path: "dusk-plonk/src/compiler.rs — compile과 preprocess",
    lang: "rust",
    highlight: [1, 38],
    desc: "dusk-network/plonk v0.22.1, commit b83aba4. 기본 circuit을 Composer로 합성하고 selector·sigma polynomials를 약정해 Prover와 Verifier를 만듭니다.",
    code: `pub fn compile<C>(
    pp: &PublicParameters,
    label: &[u8],
) -> Result<(Prover, Verifier), Error>
where
    C: Circuit,
{
    let mut composer = Composer::initialized();
    C::default().circuit(&mut composer)?;
    Self::compile_with_composer(pp, label, &composer)
}

fn compile_with_composer(
    pp: &PublicParameters,
    label: &[u8],
    composer: &Composer,
) -> Result<(Prover, Verifier), Error> {
    let n = (composer.constraints() + 6).next_power_of_two();
    let (commit, opening) = pp.trim(n)?;
    Self::preprocess(label, commit, opening, composer)
}

fn preprocess(
    label: &[u8],
    commit_key: CommitKey,
    opening_key: OpeningKey,
    prover: &Composer,
) -> Result<(Prover, Verifier), Error> {
    let mut perm = prover.perm.clone();
    let constraints = prover.constraints();
    let size = constraints.next_power_of_two();
    let domain = EvaluationDomain::new(size - 1)?;

    // q_m·q_l·... selector vectors를 domain에서 IFFT합니다.
    let q_m_poly = domain.ifft(&q_m);
    // copy wiring에서 네 sigma polynomials를 만듭니다.
    let [s_sigma_1_poly, s_sigma_2_poly,
         s_sigma_3_poly, s_sigma_4_poly] =
        perm.compute_sigma_polynomials(size, &domain);`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "Compile은 C::default()로 실제 secret 값이 아니라 회로의 고정된 모양을 합성합니다." },
      { lines: [12, 20], color: "amber", note: "행 수를 바탕으로 KZG public parameters를 trim하고 전처리로 넘깁니다." },
      { lines: [22, 31], color: "violet", note: "전처리는 constraint 수와 evaluation domain을 고정합니다." },
      { lines: [33, 38], color: "emerald", note: "Selector와 copy permutation을 polynomial로 만든 뒤 이들의 commitments가 verifier key에 들어갑니다." },
    ],
  },
  "dusk-plonk-prover": {
    path: "dusk-plonk/src/compiler/prover.rs — V3 prove_inner",
    lang: "rust",
    highlight: [1, 45],
    desc: "dusk-network/plonk v0.22.1, commit b83aba4. Public input을 먼저 transcript에 넣고 wire·permutation·quotient·opening 순서로 proof를 만듭니다.",
    code: `let mut transcript = self.transcript_for_version(version);
let public_inputs = prover.public_inputs();
public_inputs
    .iter()
    .for_each(|pi| transcript.append_scalar(b"pi", pi));

// Round 1: 네 wire polynomial을 blinding한 뒤 약정합니다.
let a_poly = Self::blind_poly(rng, &a_scalars, 1, &domain);
let b_poly = Self::blind_poly(rng, &b_scalars, 1, &domain);
let c_poly = Self::blind_poly(rng, &c_scalars, 1, &domain);
let d_poly = Self::blind_poly(rng, &d_scalars, 1, &domain);
let a_comm = self.commit_key.commit(&a_poly)?;
let b_comm = self.commit_key.commit(&b_poly)?;
let c_comm = self.commit_key.commit(&c_poly)?;
let d_comm = self.commit_key.commit(&d_poly)?;
transcript.append_commitment(b"a_comm", &a_comm);
transcript.append_commitment(b"b_comm", &b_comm);
transcript.append_commitment(b"c_comm", &c_comm);
transcript.append_commitment(b"d_comm", &d_comm);

// Round 2: 약정 뒤 β·γ를 얻고 permutation Z(X)를 약정합니다.
let beta = transcript.challenge_scalar(b"beta");
transcript.append_scalar(b"beta", &beta);
let gamma = transcript.challenge_scalar(b"gamma");
let permutation = prover.perm.compute_permutation_vec(
    &domain, wires, &beta, &gamma, sigma,
);
let z_poly = Self::blind_poly(rng, &permutation, 2, &domain);
let z_comm = self.commit_key.commit(&z_poly)?;
transcript.append_commitment(b"z_comm", &z_comm);

// Round 3: α 뒤 quotient를 계산해 네 degree-n 조각으로 나눕니다.
let alpha = transcript.challenge_scalar(b"alpha");
let t_poly = quotient_poly::compute(
    &domain, &self.prover_key, &z_poly, wires, &pi_poly, args,
)?;
let t_low_vec = t_poly[0..domain_size].to_vec();
let t_mid_vec = t_poly[domain_size..2 * domain_size].to_vec();
let t_high_vec = t_poly[2 * domain_size..3 * domain_size].to_vec();
let t_fourth_vec = t_poly[3 * domain_size..].to_vec();`,
    annotations: [
      { lines: [1, 5], color: "sky", note: "Public inputs도 challenge 생성에 영향을 주도록 wire commitments보다 먼저 transcript에 들어갑니다." },
      { lines: [7, 19], color: "amber", note: "실제 witness values가 네 wire polynomials와 네 KZG commitments로 바뀝니다." },
      { lines: [21, 30], color: "violet", note: "β·γ는 wire commitments 뒤에 나오며 copy permutation의 누적곱 Z(X)를 묶습니다." },
      { lines: [32, 40], color: "emerald", note: "α 뒤에 전체 제약의 quotient를 만들고 현재 구현은 이를 네 조각으로 나눕니다." },
    ],
  },
  "dusk-plonk-proof": {
    path: "dusk-plonk/src/proof_system/proof.rs — Proof",
    lang: "rust",
    highlight: [1, 28],
    desc: "dusk-network/plonk v0.22.1, commit b83aba4. Proof는 11개 commitments와 evaluation 묶음을 담으며 고정 직렬화 크기는 이 fixture에서 1008 bytes였습니다.",
    code: `pub struct Proof {
    // 네 witness polynomial commitments
    pub(crate) a_comm: Commitment,
    pub(crate) b_comm: Commitment,
    pub(crate) c_comm: Commitment,
    pub(crate) d_comm: Commitment,

    // copy permutation grand product commitment
    pub(crate) z_comm: Commitment,

    // quotient polynomial의 네 조각
    pub(crate) t_low_comm: Commitment,
    pub(crate) t_mid_comm: Commitment,
    pub(crate) t_high_comm: Commitment,
    pub(crate) t_fourth_comm: Commitment,

    // z와 z·omega 두 평가점의 batched opening commitments
    pub(crate) w_z_chall_comm: Commitment,
    pub(crate) w_z_chall_w_comm: Commitment,

    // wire·sigma·Z·selector evaluations
    pub(crate) evaluations: ProofEvaluations,
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "비공개 값 자체가 아니라 blinding된 wire polynomial commitments 네 개가 들어갑니다." },
      { lines: [8, 14], color: "amber", note: "Copy 관계의 Z commitment와 전체 제약의 quotient commitments 네 개입니다." },
      { lines: [16, 19], color: "violet", note: "여러 polynomial 열기를 두 평가점의 opening commitments로 배치합니다." },
      { lines: [21, 22], color: "emerald", note: "Verifier가 linearization과 batched opening을 재구성할 evaluation values입니다." },
    ],
  },
  "dusk-plonk-verifier": {
    path: "dusk-plonk/src/proof_system/proof.rs — V3 verify",
    lang: "rust",
    highlight: [1, 39],
    desc: "dusk-network/plonk v0.22.1, commit b83aba4. Verifier는 transcript를 재생하고 public input을 평가한 뒤 두 KZG opening을 하나의 pairing product로 검사합니다.",
    code: `// Prover와 같은 순서로 commitments를 흡수하고 challenge를 재생합니다.
transcript.append_commitment(b"a_comm", &self.a_comm);
transcript.append_commitment(b"b_comm", &self.b_comm);
transcript.append_commitment(b"c_comm", &self.c_comm);
transcript.append_commitment(b"d_comm", &self.d_comm);
let beta = transcript.challenge_scalar(b"beta");
transcript.append_scalar(b"beta", &beta);
let gamma = transcript.challenge_scalar(b"gamma");

// 공개 입력을 sparse Lagrange polynomial로 z에서 평가합니다.
let pi_eval = compute_barycentric_eval_sparse(
    public_input_indexes,
    pub_inputs,
    &z_challenge,
    &domain,
);

// 두 평가점의 opening commitments를 하나의 pairing 식으로 배치합니다.
let left = G1Affine::from(
    -(self.w_z_chall_comm.0
        + (self.w_z_chall_w_comm.0 * u_challenge)),
);
let right = G1Affine::from(
    (self.w_z_chall_comm.0 * z_challenge)
        + (self.w_z_chall_w_comm.0
            * (u_challenge * z_challenge * domain.group_gen))
        + F
        - E,
);

let pairing = dusk_bls12_381::multi_miller_loop(&[
    (&left, &opening_key.prepared_x_h),
    (&right, &opening_key.prepared_h),
])
.final_exponentiation();

if pairing != dusk_bls12_381::Gt::identity() {
    return Err(Error::ProofVerificationError);
}
Ok(())`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "Verifier가 흡수 순서를 바꾸면 prover와 다른 challenge를 얻어 proof를 승인할 수 없습니다." },
      { lines: [10, 15], color: "amber", note: "Public z=12는 evaluation domain의 공개 입력 polynomial 값으로 verification 식에 들어갑니다." },
      { lines: [17, 28], color: "violet", note: "z와 z·omega의 opening commitments, aggregate commitment F와 evaluation E를 두 G1 points로 만듭니다." },
      { lines: [30, 38], color: "emerald", note: "두 pairing의 곱이 GT identity일 때만 성공하고, 아니면 ProofVerificationError입니다." },
    ],
  },
};
