export const PC1_CODE = `// filecoin-proofs/src/api/seal.rs

pub fn seal_pre_commit_phase1<R, S, T, Tree: MerkleTreeTrait>(
    porep_config: &PoRepConfig,  // 섹터 크기, 파티션, PoRep ID
    cache_path: R,  in_path: S,  out_path: T,
    prover_id: ProverId, sector_id: SectorId,
    ticket: Ticket,              // 체인 랜덤성 (섹터 고유성)
    piece_infos: &[PieceInfo],
) -> Result<SealPreCommitPhase1Output<Tree>>
{
    // 1. 원본 데이터 → out_path 복사 후 mmap
    fs::copy(&in_path, &out_path)?;
    f_data.set_len(sector_bytes as u64)?;
    let data = MmapOptions::new().map_mut(&f_data)?;

    // 2. comm_d: 원본 데이터 Merkle 트리 (SHA256 이진 트리)
    let data_tree = create_base_merkle_tree::<BinaryMerkleTree<DefaultPieceHasher>>(
        Some(config.clone()), base_tree_leafs, &data)?;
    let comm_d = commitment_from_fr(data_tree.root().into());

    // 3. replica_id 파생 (섹터 고유성 확보)
    //    SHA256(prover_id || sector_id || ticket || comm_d || porep_id)
    let replica_id = generate_replica_id::<Tree::Hasher, _>(
        &prover_id, sector_id.into(), &ticket, comm_d, &porep_config.porep_id);

    // 4. SDR 11계층 레이블링 (순차적 SHA256 체인)
    //    layer_k: label[i] = H(replica_id || layer as u64 BE || node_id as u64 BE
    //                          || parent_data[0..N])   // H: Blake2s/SHA256
    //    TOTAL_PARENTS = 14 (BASE_DEGREE=6 + EXP_DEGREE=8)
    let (labels, _) = StackedDrg::<Tree, DefaultPieceHasher>::replicate_phase1(
        &compound_public_params.vanilla_params,
        &replica_id,
        &config.path,
    )?;
    // → SealPreCommitPhase1Output { labels, config, comm_d }
}`;

export const PC2_CODE = `// PC2: Poseidon Merkle 트리 생성 (GPU 가속)

pub fn seal_pre_commit_phase2(pc1_output, cache_path, out_path) {
    // TreeC: 11개 레이어의 컬럼 해시를 Poseidon으로 집계
    //   column_hash[i] = Poseidon(label[1][i], ..., label[11][i])
    //   TreeC = Merkle(column_hashes)  → comm_c

    // 실제 복제: 마지막 레이어 레이블 XOR 원본 데이터
    //   replica[i] = label[11][i] XOR data[i]
    //   (AES-256 인코딩: encode(label, data))
    let data = encode(last_layer_labels, original_data);

    // TreeR: 복제본 데이터 Merkle 트리 (Poseidon Arity-8)
    //   comm_r_last = Poseidon Merkle root of replica
    let tree_r = create_octree::<Tree>(data, TreeConfig);

    // comm_r = SHA256(comm_c || comm_r_last)
    let comm_r = <Tree::Hasher>::Function::hash2(&comm_c, &comm_r_last);
    // → SealPreCommitOutput { comm_r, comm_d }
}`;

export const C2_CODE = `// C1: 챌린지 노드 샘플링 (체인 랜덤성 기반)
//     seed = SHA256(ticket || comm_r) → 챌린지 인덱스 생성
// C1 출력: 각 챌린지 노드에 대한 Merkle 경로 + 레이블 체인

// C2: Groth16 회로에서 다음을 증명
//   - commit_phase1_output의 Merkle 경로 일관성
//   - 레이블 체인: label[i] = SHA256(replica_id || parents)
//   - 인코딩 일관성: replica[i] = encode(label[11][i], data[i])
//   - comm_d, comm_r_last에 대한 Merkle 루트 일치

pub fn seal_commit_phase2<Tree>(c1_output, prover_id, sector_id) {
    // Groth16 증명 생성 (bellman/blstrs)
    let groth_params = get_stacked_params(&porep_config)?;

    // 회로: ~수억 게이트 (32GiB)
    // 증명: 192 bytes (A, B, C 좌표, BLS12-381 압축)
    let groth16_proof = bellperson::groth16::create_random_proof(
        circuit, &groth_params, rng)?;

    // 집계 가능: FIP-92로 최대 819개 PoRep을 하나의 SNARK으로
    // aggregate_seal_commit_proofs(groth_params, agg_proofs) → 단일 증명
}`;
