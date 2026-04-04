// rust-fil-proofs — post.rs (WindowPoSt & WinningPoSt)
// filecoin-proofs/src/api 에서 핵심 함수 발췌

/// WindowPoSt: 24시간을 48 데드라인으로 분할, 각 데드라인에 파티션 증명 제출
pub fn generate_window_post(
    randomness: &ChallengeSeed,   // 체인에서 추출한 랜덤 시드
    replicas: &BTreeMap<SectorId, PrivateReplicaInfo>,
    prover_id: ProverId,
) -> Result<Vec<PoStProof>> {
    // 1. randomness로 챌린지 섹터/리프 위치 결정
    //    파티션 내 섹터 수 × 챌린지 수만큼 랜덤 선택
    let challenges = generate_fallback_sector_challenges(
        &config, randomness, &sector_ids, prover_id,
    )?;

    // 2. 각 챌린지 위치에서 봉인된 섹터의 머클 경로 생성
    //    TreeR에서 해당 리프까지의 경로(siblings) 추출
    let vanilla_proofs = generate_single_vanilla_proofs(
        &config, &sector_ids, replicas, &challenges,
    )?;

    // 3. Groth16으로 vanilla proof를 SNARK 증명으로 변환
    //    체인에 SubmitWindowedPoSt 메시지로 제출
    let proof = FallbackPoStCompound::prove(&pp, &pub_inputs, &vanilla_proofs)?;

    Ok(vec![PoStProof { proof_bytes: proof.to_vec() }])
}

/// WinningPoSt: 매 에폭(30초)마다 추첨, 당첨 시 PoSt 제출 → 블록 보상
pub fn generate_winning_post(
    randomness: &ChallengeSeed,   // DRAND 비콘에서 추출
    replicas: &BTreeMap<SectorId, PrivateReplicaInfo>,
    prover_id: ProverId,
) -> Result<Vec<PoStProof>> {
    // 4. WinningPoSt 챌린지 — 1개 섹터에서 소수의 리프 챌린지
    //    빠른 증명 필요 (30초 에폭 내 완료해야 함)
    let challenges = generate_fallback_sector_challenges(
        &winning_config, randomness, &sector_ids, prover_id,
    )?;

    // 5. 머클 경로 + Groth16 증명 — WindowPoSt보다 작은 회로
    let vanilla_proofs = generate_single_vanilla_proofs(
        &winning_config, &sector_ids, replicas, &challenges,
    )?;
    let proof = FallbackPoStCompound::prove(&pp, &pub_inputs, &vanilla_proofs)?;

    Ok(vec![PoStProof { proof_bytes: proof.to_vec() }])
}
