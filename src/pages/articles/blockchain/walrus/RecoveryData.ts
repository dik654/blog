export const RECOVERY_SYMBOL_CODE = `// walrus-core/src/encoding/slivers.rs

// 노드 A(슬라이버 보유) → 노드 B(타겟) 복구 심볼 생성
pub fn recovery_symbol_for_sliver(
    &self,
    target_pair_index: SliverPairIndex,
    config: &EncodingConfigEnum,
) -> Result<RecoverySymbol<T::OrthogonalAxis, MerkleProof<Blake2b256>>, RecoverySymbolError>
{
    // 1. 직교 방향으로 RS 인코딩 (Primary → Secondary 방향, 또는 반대)
    //    Primary 슬라이버 → encode::<Secondary> → n_shards개 심볼
    let recovery_symbols = config.encode_all_symbols::<T::OrthogonalAxis>(self.symbols.data())?;

    // 2. 타겟 인덱스의 심볼 추출 + Merkle 증명 생성
    let target_sliver_index = target_pair_index.to_sliver_index::<T::OrthogonalAxis>(n_shards);
    Ok(recovery_symbols
        .decoding_symbol_at(target_sliver_index.as_usize(), self.index.into())?
        .with_proof(
            MerkleTree::<Blake2b256>::build(recovery_symbols.to_symbols())
                .get_proof(target_sliver_index.as_usize())?
        ))
}

// RecoverySymbol<Axis, Proof>:
//   - data: 심볼 바이트 (symbol_size)
//   - index: 이 심볼의 원천 슬라이버 인덱스
//   - proof: MerkleProof<Blake2b256> — metadata의 해시와 대조 검증 가능`;

export const RECOVERY_SYMBOL_ANNOTATIONS = [
  { lines: [10, 12] as [number, number], color: 'sky' as const, note: '직교 방향 RS 인코딩' },
  { lines: [14, 21] as [number, number], color: 'emerald' as const, note: '타겟 심볼 + Merkle 증명' },
];

export const RECOVER_SLIVER_CODE = `// walrus-core/src/encoding/slivers.rs

pub fn try_recover_sliver_from_decoding_symbols<I>(
    decoding_symbols: I,    // 다른 노드들로부터 수집한 복구 심볼
    target_index: SliverIndex,
    metadata: &BlobMetadata,
    encoding_config: &EncodingConfig,
) -> Result<SliverData<T>, SliverRecoveryOrVerificationError>
{
    let symbol_size = metadata.symbol_size(encoding_config)?;
    let config_enum = encoding_config.get_for_type(metadata.encoding_type());

    // n_symbols_required = n - f (Primary) 또는 n - 2f (Secondary) 개
    let RequiredCount::Exact(n_req) = config_enum.n_symbols_for_recovery::<T>();
    if decoding_symbols.len() < n_req {
        return Err(SliverRecoveryError::DecodingFailure.into());
    }

    // Reed-Solomon 디코딩: reed_solomon_simd::ReedSolomonDecoder
    let data = config_enum.decode_from_decoding_symbols(symbol_size, decoding_symbols)?;
    let recovered = SliverData::new(data, symbol_size, target_index);

    // 복구된 슬라이버 검증: metadata의 Merkle 루트와 대조
    recovered.verify(encoding_config, metadata)?;
    Ok(recovered)
}`;

export const RECOVER_SLIVER_ANNOTATIONS = [
  { lines: [13, 16] as [number, number], color: 'sky' as const, note: '복구 심볼 수 검증' },
  { lines: [19, 21] as [number, number], color: 'emerald' as const, note: 'RS 디코딩 실행' },
  { lines: [23, 24] as [number, number], color: 'amber' as const, note: 'Merkle 루트 검증' },
];

export const BLOB_RECOVERY_CODE = `// 클라이언트가 블롭을 읽을 때:

1. Sui 체인에서 BlobMetadata 조회 (blob_id → metadata)
   - n×n 심볼 해시 행렬 (primary_hash[], secondary_hash[] 포함)

2. 저장 노드들에게 슬라이버 요청
   - Primary  슬라이버: secondary_k = n-f  개만 있으면 블롭 복구 가능
   - Secondary 슬라이버: primary_k  = n-2f 개만 있으면 블롭 복구 가능

3. 응답한 노드의 슬라이버를 Merkle 증명으로 검증
   - MerkleTree::<Blake2b256>::build(symbols).root() == metadata.primary_hash[i]

4. Reed-Solomon 디코딩으로 메시지 행렬 복원
   - primary_slivers[0..k₁] 복원 → 행들을 붙여 원본 블롭 재구성

// 인코딩 팽창률: 원본 대비 약 n/k₁ × n/k₂ ≈ 4.5× (n=100 기준)
// → 각 노드는 원본의 1/k₁ (≈3%) 저장, 4.5배 총 저장 비용`;

export const BLOB_RECOVERY_ANNOTATIONS = [
  { lines: [6, 8] as [number, number], color: 'sky' as const, note: '슬라이버 요청 임계값' },
  { lines: [10, 11] as [number, number], color: 'emerald' as const, note: 'Merkle 증명 검증' },
  { lines: [16, 17] as [number, number], color: 'amber' as const, note: '저장 비용 분석' },
];
