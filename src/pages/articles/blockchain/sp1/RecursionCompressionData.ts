export const COMPRESS_CODE = `// compress(): Core → Compressed (BabyBear STARK)
pub fn compress(
    &self,
    vk: &VerifyingKey,
    proof: SP1CoreProof,
    deferred_proofs: Vec<SP1DeferredProof>,
) -> Result<SP1ReduceProof<InnerSC>> {
    // 1단계: First Layer (batch_size = 1)
    //   각 ShardProof를 개별 재귀 프로그램으로 검증
    let first_layer: Vec<SP1ReduceProof<InnerSC>> = proof.shard_proofs
        .par_iter()
        .map(|sp| self.verify_in_recursion(vk, sp))
        .collect();

    // 2단계: Intermediate Layers (REDUCE_BATCH_SIZE = 2)
    //   이진 트리 방식으로 쌍으로 합치기
    let mut current = first_layer;
    while current.len() > 1 {
        current = current
            .par_chunks(REDUCE_BATCH_SIZE)
            .map(|pair| self.reduce(vk, pair))
            .collect();
    }

    Ok(current.into_iter().next().unwrap())
}`;

export const STAGES = [
  { name: 'Core', field: 'BabyBear', size: '~수 MB/샤드', desc: '각 샤드의 AIR STARK 증명' },
  { name: 'Compress', field: 'BabyBear', size: '~수백 KB', desc: '이진 트리 재귀 압축. N개 → 1개' },
  { name: 'Shrink', field: 'BN254', size: '~수십 KB', desc: 'BabyBear → BN254 필드 전환' },
  { name: 'Wrap', field: 'BN254', size: '~수 KB', desc: 'Groth16 회로 입력 형식 준비' },
];

export const compressAnnotations = [
  { lines: [8, 13] as [number, number], color: 'sky' as const, note: '1단계: 개별 검증 (First Layer)' },
  { lines: [15, 22] as [number, number], color: 'emerald' as const, note: '2단계: 이진 트리 축소' },
];
