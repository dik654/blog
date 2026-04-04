export const PROOF_GEN_CODE = `// 증명 생성 파이프라인
// 1. SuperCircuit 빌드
pub fn build_super_circuit(geth_data, circuits_params)
    -> Result<(u32, SuperCircuit, Vec<Vec<Fr>>)> {
    let block_data = BlockData::new_from_geth_data_with_params(...);
    let mut builder = block_data.new_circuit_input_builder();
    builder.handle_block(&geth_data.eth_block, &geth_data.geth_traces)?;
    let block = block_convert(&builder.block, &builder.code_db)?;
    let circuit = SuperCircuit::new_from_block(&block);
    let k = log2_ceil(SuperCircuit::unusable_rows() + rows_needed);
    Ok((k, circuit, instance))
}

// 2. KZG 증명 생성
pub fn gen_proof(params, pk, circuit, instances, rng) -> Result<Vec<u8>> {
    let mut transcript = Blake2bWrite::init(vec![]);
    create_proof::<KZGCommitmentScheme<Bn256>, ProverGWC<_>, ...>(
        params, pk, &[circuit],
        &[&instances.iter().map(|v| &v[..]).collect()],
        rng, &mut transcript,
    )?;
    Ok(transcript.finalize())
}`;

export const proofGenAnnotations = [
  { lines: [3, 11] as [number, number], color: 'sky' as const, note: 'SuperCircuit 빌드 — Geth 데이터 → 회로' },
  { lines: [14, 22] as [number, number], color: 'emerald' as const, note: 'KZG+SHPLONK 증명 생성' },
];

export const AGGREGATION_CODE = `// 증명 집계 전략 (Chunk → Batch → Bundle)
//
// Chunk Proof: 연속된 블록 묶음의 증명 (SuperCircuit)
//   - min_num_rows_block()으로 동적 크기 결정
//   - 각 서브회로의 필요 행 수 중 최대값 선택
//
// Batch Proof: 여러 Chunk 증명을 집계
//   - 중간 상태 루트 검증
//   - 배치 해시 연속성 보장
//
// Bundle Proof: 최종 온체인 제출용
//   - L1 검증 컨트랙트에 제출
//   - 가스 효율적인 단일 증명

// 동적 회로 크기 결정
impl SuperCircuit {
    pub fn min_num_rows_block(block: &Block) -> (usize, usize) {
        let max_rows = [
            EvmCircuit::min_num_rows_block(block),
            KeccakCircuit::min_num_rows_block(block),
            TxCircuit::min_num_rows_block(block),
            // ... 기타 회로들
        ].iter().max().unwrap();
        (*max_rows, *max_rows)
    }
}`;

export const aggregationAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'Chunk — 블록 묶음 증명' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'Batch — Chunk 집계' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: 'Bundle — L1 제출용' },
  { lines: [16, 24] as [number, number], color: 'violet' as const, note: '동적 크기 — 최대 행 수 선택' },
];

export const SETUP_CODE = `// Setup Phase — KZG 파라미터 + 키 생성
let k = 20; // 회로 크기: 2^20 = 1,048,576 행
let params = ParamsKZG::<Bn256>::setup(k, rng);

// Proving Key 생성
let vk = keygen_vk(&params, &circuit)?;  // Verifying Key
let pk = keygen_pk(&params, vk, &circuit)?;  // Proving Key

// 증명 생성 4단계:
// 1. Commitment Phase  — Advice column → 다항식 → KZG 커밋
// 2. Challenge Gen     — Fiat-Shamir → challenge 생성
// 3. Evaluation Phase  — Challenge 점에서 다항식 평가
// 4. Opening Phase     — KZG opening proof 생성`;

export const setupAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'KZG 파라미터 — 2^k 행' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'VK + PK 생성' },
  { lines: [9, 13] as [number, number], color: 'amber' as const, note: '증명 4단계: 커밋→챌린지→평가→오프닝' },
];
