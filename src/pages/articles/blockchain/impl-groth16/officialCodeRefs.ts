import type { CodeRef } from "@/components/code/types";

export const officialGroth16CodeRefs: Record<string, CodeRef> = {
  "ark-groth16-circuit": {
    path: "groth16/tests/mimc.rs — public input과 witness 할당",
    lang: "rust",
    highlight: [1, 25],
    desc: "arkworks groth16 commit 8f0904a. 비공개 preimage는 witness로, 공개 hash output은 instance input으로 할당하고 마지막에 같은 값인지 제약합니다.",
    code: `let mut xl = FpVar::new_witness(cs.clone(), || {
    self.xl.ok_or(SynthesisError::AssignmentMissing)
})?;

let mut xr = FpVar::new_witness(cs.clone(), || {
    self.xr.ok_or(SynthesisError::AssignmentMissing)
})?;

let output = FpVar::new_input(cs.clone(), || {
    self.output.ok_or(SynthesisError::AssignmentMissing)
})?;

for i in 0..MIMC_ROUNDS {
    let tmp = (&xl + self.constants[i]).square()?;
    let new_xl = tmp * (&xl + self.constants[i]) + xr;

    xr = xl;
    xl = new_xl;
}

output.enforce_equal(&xl)?;`,
    annotations: [
      { lines: [1, 7], color: "amber", note: "xl과 xr는 verifier에게 공개하지 않는 witness 변수입니다." },
      { lines: [9, 11], color: "sky", note: "output은 verifier가 proof와 함께 받는 public input입니다." },
      { lines: [13, 19], color: "violet", note: "Circuit은 값 자체가 아니라 값들이 따라야 할 계산 관계를 제약식으로 만듭니다." },
      { lines: [21, 21], color: "emerald", note: "계산한 값과 공개 output이 같아야 circuit이 만족됩니다." },
    ],
  },
  "ark-groth16-prover": {
    path: "groth16/src/prover.rs — create_proof_with_reduction",
    lang: "rust",
    highlight: [1, 33],
    desc: "arkworks groth16 commit 8f0904a. Circuit을 R1CS로 합성하고 QAP witness map을 만든 뒤 instance와 witness assignment를 분리해 proof 계산으로 넘깁니다.",
    code: `pub fn create_proof_with_reduction<C>(
    circuit: C,
    pk: &ProvingKey<E>,
    r: E::ScalarField,
    s: E::ScalarField,
) -> R1CSResult<Proof<E>>
where
    C: ConstraintSynthesizer<E::ScalarField>,
{
    let cs = ConstraintSystem::new_ref();
    cs.set_optimization_goal(OptimizationGoal::Constraints);
    cs.set_mode(SynthesisMode::Prove {
        construct_matrices: true,
        generate_lc_assignments: false,
    });

    circuit.generate_constraints(cs.clone())?;
    cs.finalize();

    debug_assert!(cs.is_satisfied().unwrap());

    let h = QAP::witness_map::<
        E::ScalarField,
        D<E::ScalarField>,
    >(cs.clone())?;

    let prover = cs.borrow().unwrap();
    Self::create_proof_with_assignment(
        pk,
        r,
        s,
        &h,
        &prover.instance_assignment().unwrap()[1..],
        &prover.witness_assignment().unwrap(),
    )
}`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "Prover는 circuit, circuit-specific proving key와 두 randomness r·s를 받습니다." },
      { lines: [10, 18], color: "amber", note: "Circuit을 실제 constraint matrices와 assignment가 있는 R1CS로 합성합니다." },
      { lines: [20, 25], color: "violet", note: "만족 여부를 확인하고 R1CS를 QAP의 H coefficients로 옮깁니다." },
      { lines: [27, 36], color: "emerald", note: "Public instance와 private witness를 분리한 채 proof의 세 점 계산으로 넘깁니다." },
    ],
  },
  "ark-groth16-proof": {
    path: "groth16/src/data_structures.rs — Proof",
    lang: "rust",
    highlight: [1, 12],
    desc: "arkworks groth16 commit 8f0904a. 직렬화되는 proof는 G1 점 A, G2 점 B, G1 점 C 세 개입니다.",
    code: `#[derive(
    Clone,
    Debug,
    PartialEq,
    CanonicalSerialize,
    CanonicalDeserialize,
)]
pub struct Proof<E: Pairing> {
    pub a: E::G1Affine,
    pub b: E::G2Affine,
    pub c: E::G1Affine,
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "Proof bytes는 선택한 curve 타입의 canonical serialization 규칙을 따릅니다." },
      { lines: [8, 12], color: "emerald", note: "Groth16 proof의 공개 구조는 A∈G1, B∈G2, C∈G1입니다." },
    ],
  },
  "ark-groth16-verifier": {
    path: "groth16/src/verifier.rs — prepare_inputs와 verify",
    lang: "rust",
    highlight: [1, 32],
    desc: "arkworks groth16 commit 8f0904a. Public inputs를 verifying-key points와 결합하고 proof 세 점을 multi-pairing으로 검사합니다.",
    code: `pub fn prepare_inputs(
    pvk: &PreparedVerifyingKey<E>,
    public_inputs: &[E::ScalarField],
) -> R1CSResult<E::G1> {
    let mut g_ic = pvk.vk.gamma_abc_g1[0].into_group();
    for (i, b) in public_inputs
        .iter()
        .zip(pvk.vk.gamma_abc_g1.iter().skip(1))
    {
        g_ic.add_assign(&b.mul_bigint(i.into_bigint()));
    }
    Ok(g_ic)
}

pub fn verify_proof_with_prepared_inputs(
    pvk: &PreparedVerifyingKey<E>,
    proof: &Proof<E>,
    prepared_inputs: &E::G1,
) -> R1CSResult<bool> {
    let qap = E::multi_miller_loop(
        [
            proof.a.into(),
            prepared_inputs.into_affine().into(),
            proof.c.into(),
        ],
        [
            proof.b.into(),
            pvk.gamma_g2_neg_pc.clone(),
            pvk.delta_g2_neg_pc.clone(),
        ],
    );
    let test = E::final_exponentiation(qap).unwrap();
    Ok(test.0 == pvk.alpha_g1_beta_g2)
}`,
    annotations: [
      { lines: [1, 13], color: "sky", note: "Public input마다 대응하는 gamma_abc point를 scalar multiplication해 g_ic를 만듭니다." },
      { lines: [15, 30], color: "violet", note: "Proof A·B·C와 public-input combination을 세 pairing 항으로 함께 계산합니다." },
      { lines: [31, 32], color: "emerald", note: "Final exponentiation 뒤 prepared VK의 기준 pairing과 같을 때만 true입니다." },
    ],
  },
};
