export const SHRINK_CODE = `// Shrink: BabyBear STARK → BN254 STARK
pub fn shrink(
    &self,
    compressed: &SP1ReduceProof<InnerSC>,
) -> Result<SP1ReduceProof<OuterSC>> {
    // BabyBear(2^31 - 2^27 + 1) → BN254 스칼라체 변환
    // 왜? Groth16은 BN254 곡선에서 동작
    // → BabyBear 필드 원소를 BN254 필드 원소로 임베딩
    // → FRI 검증을 BN254 AIR로 재증명

    let shrink_program = self.build_shrink_program(compressed)?;
    let proof = self.prover.prove(&shrink_program)?;
    Ok(SP1ReduceProof { proof })
}`;

export const WRAP_CODE = `// Wrap + Groth16: BN254 STARK → Groth16 SNARK
pub fn wrap_groth16_bn254(
    &self, shrunk: SP1ReduceProof<OuterSC>,
    build_dir: &Path,
) -> Result<SP1Groth16Proof> {
    // 1. BN254 STARK → 래핑 (Groth16 회로 입력 준비)
    let wrapped = self.wrap_bn254(&shrunk)?;

    // 2. Groth16 증명 생성
    //    - 신뢰 셋업 (powers of tau + circuit-specific)
    //    - R1CS 만족성 증명
    let groth16 = Groth16Prover::prove(
        &wrapped.proof,
        &wrapped.vk,
        build_dir,
    )?;

    // 최종 크기: ~192 bytes (A, B, C 포인트)
    // 검증 가스: ~250,000 gas (이더리움)
    Ok(SP1Groth16Proof { proof: groth16 })
}`;

export const COMPARE = [
  { item: '증명 크기', groth16: '~192 bytes (3 포인트)', plonk: '~500 bytes' },
  { item: '검증 가스', groth16: '~250k gas', plonk: '~500k gas' },
  { item: '신뢰 셋업', groth16: '필요 (회로별)', plonk: '범용 SRS' },
  { item: '증명 시간', groth16: '더 빠름', plonk: '약간 느림' },
  { item: '사용 곡선', groth16: 'BN254', plonk: 'BN254' },
];

export const shrinkAnnotations = [
  { lines: [6, 9] as [number, number], color: 'sky' as const, note: '필드 변환 이유: Groth16 ↔ BN254' },
  { lines: [11, 13] as [number, number], color: 'emerald' as const, note: '재증명: BN254 AIR 프로그램 실행' },
];

export const wrapAnnotations = [
  { lines: [6, 7] as [number, number], color: 'sky' as const, note: '래핑: 회로 입력 변환' },
  { lines: [9, 16] as [number, number], color: 'emerald' as const, note: 'Groth16 증명 생성' },
  { lines: [18, 19] as [number, number], color: 'amber' as const, note: '최종 크기 + 온체인 가스' },
];
