// rust-fil-proofs — seal.rs (PC1 ~ C2 봉인 파이프라인)
// filecoin-proofs/src/api/seal.rs 에서 핵심 함수만 발췌

/// PC1: SDR 레이블링 — 11층 DRG+Expander 그래프 순차 계산
pub fn seal_pre_commit_phase1<Tree: MerkleTreeTrait>(
    config: PoRepConfig,
    cache_path: &Path,
    in_path: &Path,       // 원본 데이터 (32GiB unsealed sector)
    sealed_path: &Path,   // 봉인된 출력 경로
    prover_id: ProverId,
    sector_id: SectorId,
    ticket: Ticket,       // 랜덤 시드 (체인에서 추출)
) -> Result<SealPreCommitPhase1Output<Tree>> {
    // 1. 원본 데이터의 Merkle 루트(comm_d) 계산
    let comm_d = compute_comm_d(config.sector_size, &in_path)?;

    // 2. replica_id 파생 — prover_id + sector_id + ticket + comm_d
    //    동일 데이터라도 SP마다, 섹터마다 다른 봉인 결과
    let replica_id = generate_replica_id(&prover_id, sector_id.into(), &ticket, comm_d);

    // 3. SDR 11층 레이블링 — 순차 SHA256 (병렬화 불가 = PoRep 핵심)
    //    각 노드 = SHA256(replica_id || 부모_레이블들)
    //    32GiB → ~4억 노드, 레이어당 ~30분 (고성능 CPU)
    let labels = StackedDrg::<Tree, Sha256Hasher>::replicate_phase1(
        &pp, &replica_id, config.sector_size,
    )?;

    Ok(SealPreCommitPhase1Output { labels, config })
}

/// PC2: 칼럼 해시(Poseidon) + TreeR 생성
pub fn seal_pre_commit_phase2<Tree: MerkleTreeTrait>(
    phase1_output: SealPreCommitPhase1Output<Tree>,
    cache_path: &Path,
    sealed_path: &Path,
) -> Result<SealPreCommitOutput> {
    // 4. 11개 레이어 칼럼을 Poseidon 해시 → TreeC
    //    GPU 가속 가능 (Poseidon은 ZK-friendly 해시)
    let (tau, (p_aux, t_aux)) = StackedDrg::<Tree, Sha256Hasher>::replicate_phase2(
        &pp, phase1_output.labels, /* ... */
    )?;

    // 5. comm_r = Poseidon(comm_c, comm_r_last)
    let comm_r = tau.comm_r;
    let comm_d = tau.comm_d;

    // comm_d + comm_r 를 체인에 PreCommit 메시지로 제출
    Ok(SealPreCommitOutput { comm_d, comm_r })
}

/// C1+C2: 챌린지 생성 → Groth16 증명
pub fn seal_commit_phase2(
    phase1_output: SealCommitPhase1Output,
    prover_id: ProverId,
    sector_id: SectorId,
) -> Result<SealCommitOutput> {
    // 6. InteractiveSeed로 랜덤 챌린지 위치 선택 (C1)
    // 7. Groth16 증명 생성 — GPU MSM 가속 (C2)
    let proof = StackedCompound::prove(&pp, &pub_inputs, &priv_inputs, &groth_params)?;

    // 체인에 ProveCommit 메시지로 제출 → 검증자가 1-pairing으로 검증
    Ok(SealCommitOutput { proof: proof.to_vec() })
}
