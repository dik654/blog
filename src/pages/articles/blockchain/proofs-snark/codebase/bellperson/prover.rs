// bellperson — groth16/prover/native.rs
// Groth16 증명 생성 핵심 함수 (GPU 가속 포함)

/// Groth16 증명 배치 생성 — GPU MSM + NTT 가속
pub fn create_proof_batch_priority_inner<E, C, P>(
    circuits: Vec<C>,
    params: &Parameters<E>,
    rng: &mut R,
    priority: bool,         // GPU 우선순위 (높으면 다른 작업 양보)
) -> Result<Vec<Proof<E>>>
where
    E: Engine + MultiMillerLoop,
    C: Circuit<E::Fr>,
{
    // 1. 회로 합성 — R1CS 제약 조건 수집
    //    각 회로를 ConstraintSystem에 합성 → (a, b, c) 벡터 추출
    let mut provers = circuits.into_iter().map(|circuit| {
        let mut cs = ProvingAssignment::new();
        circuit.synthesize(&mut cs)?;
        Ok(cs)
    }).collect::<Result<Vec<_>>>()?;

    // 2. 밀도(density) 계산 — 0이 아닌 입력/보조 변수 비트맵
    //    MSM에서 0 계수를 건너뛰어 연산량 절감
    let input_density = provers[0].input_assignment_density();
    let aux_density = provers[0].aux_assignment_density();

    // 3. FFT(NTT) — 다항식 평가를 GPU 커널로 가속
    //    QAP의 A(x), B(x), C(x) 다항식을 평가점에서 계산
    let fft_kern = LockedFFTKernel::<E>::new(priority);
    let h = provers.iter_mut().map(|p| {
        let h = p.compute_h_with_fft(&fft_kern, &params)?;
        Ok(h)
    }).collect::<Result<Vec<_>>>()?;

    // 4. MSM(Multi-Scalar Multiplication) — GPU 커널로 가속
    //    h 벡터 × G1 기저점 → 증명의 핵심 연산 (전체 시간의 70~80%)
    let multiexp_kern = LockedMultiexpKernel::<E::G1Affine>::new(priority);
    let proofs = provers.iter().zip(h.iter()).map(|(p, h)| {
        let a = multiexp(&multiexp_kern, &params.a, &p.input, &input_density)?;
        let b_g1 = multiexp(&multiexp_kern, &params.b_g1, &p.aux, &aux_density)?;
        let b_g2 = multiexp_g2(&params.b_g2, &p.aux, &aux_density)?;
        let c = multiexp(&multiexp_kern, &params.l, &p.aux, &aux_density)?;

        Ok(Proof { a: a.into(), b: b_g2.into(), c: c.into() })
    }).collect::<Result<Vec<_>>>()?;

    Ok(proofs)
}

/// 증명 구조체 — 3개 그룹 원소 (192 바이트)
pub struct Proof<E: Engine> {
    pub a: E::G1Affine,    // G1 점 (48 바이트)
    pub b: E::G2Affine,    // G2 점 (96 바이트)
    pub c: E::G1Affine,    // G1 점 (48 바이트)
}
