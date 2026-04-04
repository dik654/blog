export const KEYGEN_VK_CODE = `// halo2_proofs/src/plonk/keygen.rs

pub fn keygen_vk<C, ConcreteCircuit>(
    params: &Params<C>,
    circuit: &ConcreteCircuit,
) -> Result<VerifyingKey<C>, Error>
{
    // 1. 도메인 & ConstraintSystem 생성
    //    degree = cs.degree() → EvaluationDomain::new(degree, params.k)
    //    k = log2(회로 행 수), n = 2^k
    let (domain, cs, config) = create_domain::<C, ConcreteCircuit>(params);

    // 2. 회로 합성(synthesis)으로 고정 열 채움 + 퍼뮤테이션 조립
    let mut assembly = Assembly {
        fixed: vec![domain.empty_lagrange_assigned(); cs.num_fixed_columns],
        permutation: permutation::keygen::Assembly::new(n, &cs.permutation),
        selectors: vec![vec![false; n]; cs.num_selectors],
        usable_rows: 0..n - (cs.blinding_factors() + 1),
    };
    ConcreteCircuit::FloorPlanner::synthesize(&mut assembly, circuit, config, cs.constants)?;

    // 3. 선택자 압축: 셀렉터 → 고정 열로 컴팩트 표현
    let (cs, selector_polys) = cs.compress_selectors(assembly.selectors);
    // → 중복 패턴 제거로 고정 열 수 감소

    // 4. 고정 열 KZG 커밋 (ProvingKey에도 저장)
    let fixed_commitments = fixed.iter()
        .map(|poly| params.commit_lagrange(poly, Blind::default()).to_affine())
        .collect();

    // 5. 퍼뮤테이션 VK 생성 (복사 제약 확인용)
    let permutation_vk = assembly.permutation.build_vk(params, &domain, &cs.permutation);

    Ok(VerifyingKey { domain, fixed_commitments, permutation_vk, cs })
}`;

export const KEYGEN_PK_CODE = `// halo2_proofs/src/plonk/keygen.rs

pub fn keygen_pk(params, vk, circuit) -> Result<ProvingKey<C>, Error> {
    // ... (keygen_vk와 동일한 합성 과정) ...

    // 도메인 경계 다항식 (그랜드 프로덕트 인수 경계 조건)
    // l0(X): X=1 (row 0)에서만 1, 나머지 0
    let mut l0 = vk.domain.empty_lagrange();
    l0[0] = C::Scalar::ONE;
    let l0 = vk.domain.coeff_to_extended(vk.domain.lagrange_to_coeff(l0));

    // l_blind(X): 마지막 blinding_factors 행에서 1
    // → 퍼뮤테이션 그랜드 프로덕트의 마지막 행 블라인딩
    let mut l_blind = vk.domain.empty_lagrange();
    for eval in l_blind.iter_mut().rev().take(cs.blinding_factors()) {
        *eval = C::Scalar::ONE;
    }

    // l_last(X): 블라인딩 직전 행(n - blinding - 1)에서 1
    // → 그랜드 프로덕트가 1로 끝나는지 검사
    let mut l_last = vk.domain.empty_lagrange();
    l_last[n - cs.blinding_factors() - 1] = C::Scalar::ONE;

    Ok(ProvingKey {
        vk, l0, l_blind, l_last,
        fixed_values, fixed_polys, fixed_cosets,
        permutation: permutation_pk,
    })
}`;
