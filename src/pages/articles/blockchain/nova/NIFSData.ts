export const NIFS_PROVE_CODE = `// nova-snark/src/nova/nifs.rs

pub struct NIFS<E: Engine> {
    pub(crate) comm_T: Commitment<E>,  // 교차항 커밋 (유일한 증거)
}

impl<E: Engine> NIFS<E> {
    pub fn prove(
        ck: &CommitmentKey<E>,
        ro_consts: &ROConstants<E>,
        pp_digest: &E::Scalar,
        S: &R1CSShape<E>,
        U1: &RelaxedR1CSInstance<E>,  // 누적 인스턴스
        W1: &RelaxedR1CSWitness<E>,
        U2: &R1CSInstance<E>,         // 이번 스텝 인스턴스
        W2: &R1CSWitness<E>,
    ) -> Result<(NIFS<E>, (RelaxedR1CSInstance, RelaxedR1CSWitness)), NovaError>
    {
        let mut ro = E::RO::new(ro_consts.clone());
        ro.absorb(pp_digest);   // 도메인 분리
        U2.absorb_in_ro(&mut ro);
        // (U1은 U2.X[0]에 Hash(U1)로 이미 포함됨)

        // 교차항 T 계산 + 랜덤 블라인딩 r_T로 커밋
        let r_T = E::Scalar::random(&mut OsRng);
        let (T, comm_T) = S.commit_T(ck, U1, W1, U2, W2, &r_T)?;
        comm_T.absorb_in_ro(&mut ro);

        // Fiat-Shamir 도전값
        let r = base_as_scalar::<E>(ro.squeeze(NUM_CHALLENGE_BITS, false));

        // 선형 폴딩
        let U_folded = U1.fold(U2, &comm_T, &r);  // u' = u1 + r, X' = X1 + r·X2, ...
        let W_folded = W1.fold(W2, &T, &r_T, &r)?; // W' = W1 + r·W2, E' = E1 + r·T

        Ok((NIFS { comm_T }, (U_folded, W_folded)))
    }
}`;

export const PROVE_STEP_CODE = `// nova-snark/src/nova/mod.rs

pub fn prove_step(&mut self, pp, c: &C) -> Result<(), NovaError> {
    // 1. 보조 회로(secondary) 폴딩: E2 곡선 위
    let (nifs_secondary, (r_U_secondary, r_W_secondary)) = NIFS::prove(
        &pp.ck_secondary, ...,
        &self.r_U_secondary, &self.r_W_secondary,  // 누적
        &self.l_u_secondary, &self.l_w_secondary,  // 이전 스텝
    )?;

    // 2. 주 회로(primary) 합성: E1 곡선 위
    //    입력: (pp_digest, i, z0, zi_prev, r_U_secondary, nifs_secondary.comm_T, ...)
    let circuit_primary = NovaAugmentedCircuit::new(
        true, Some(inputs_primary), c, pp.ro_consts_circuit_primary,
    );
    let zi_primary = circuit_primary.synthesize(&mut cs_primary)?;
    // → 회로 내부에서 Hash(r_U_secondary) 검증 + 폴딩 재현

    // 3. 주 회로 폴딩
    let (nifs_primary, (r_U_primary, r_W_primary)) = NIFS::prove(
        &pp.ck_primary, ...,
        &self.r_U_primary, &self.r_W_primary,
        &l_u_primary, &l_w_primary,
    )?;

    // 4. 보조 회로 합성: r_U_primary + nifs_primary.comm_T 입력
    //    (주 회로의 폴딩을 보조 곡선 위에서 검증)

    // 상태 업데이트
    self.r_U_primary = r_U_primary;  self.r_W_primary = r_W_primary;
    self.r_U_secondary = r_U_secondary; self.r_W_secondary = r_W_secondary;
    self.zi = zi_primary; self.i += 1;
}

// 최종 압축: CompressedSNARK::prove(pp, pk, rs)
//   → Spartan SNARK으로 RelaxedR1CS 만족 증명 (수십 ms)
//   → 증명 크기: ~수 KB (재귀 깊이 무관)`;
