export const RS_CONFIG_CODE = `// walrus-core/src/encoding/config.rs
pub struct ReedSolomonEncodingConfig {
    pub n_shards: NonZeroU16,                    // n 전체 노드 수
    pub n_primary_source_symbols: NonZeroU16,    // k₁ = n - 2f (행 수)
    pub n_secondary_source_symbols: NonZeroU16,  // k₂ = n - f  (열 수)
    pub symbol_size: NonZeroU16,                 // 심볼 크기 (바이트)
}

// 메시지 행렬 총 심볼 수 = k₁ × k₂
// 최대 블롭 크기 = k₁ × k₂ × max_symbol_size(u16::MAX)
pub fn max_blob_size_for_n_shards(n_shards: NonZeroU16, enc_type: EncodingType) -> u64 {
    u64::from(source_symbols_per_blob_for_n_shards(n_shards).get())
        * u64::from(enc_type.max_symbol_size())
}`;

export const RS_CONFIG_ANNOTATIONS = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: 'RS 인코딩 설정 구조체' },
  { lines: [11, 14] as [number, number], color: 'emerald' as const, note: '최대 블롭 크기 계산' },
];

export const ENCODE_CODE = `// walrus-core/src/encoding/blob_encoding.rs
pub fn encode_with_metadata(self) -> (Vec<SliverPair>, VerifiedBlobMetadataWithId) {
    // 1. 원본 블롭 행 → primary 슬라이버[0..k₁] (시스테매틱 심볼)
    for (row, sliver) in self.rows().zip(primary_slivers.iter_mut()) {
        sliver.symbols.data_mut()[..row.len()].copy_from_slice(row);
    }
    // 2. 원본 블롭 열 → secondary 슬라이버[0..k₂] (시스테매틱 심볼)
    for (column, sliver) in self.column_symbols().zip(secondary_slivers.iter_mut()) {
        sliver.symbols.to_symbols_mut().zip(column)
            .for_each(|(dest, src)| dest[..src.len()].copy_from_slice(src));
    }

    // 3. 행 방향 RS 인코딩 → secondary 복구 심볼 (repair)
    let mut secondary_encoder = self.inner.get_encoder::<Secondary>();
    for row in primary_slivers.iter().take(k1) {
        let repair = secondary_encoder.encode(row.symbols.data())?;
        // → secondary_slivers[k₂..n] 에 채움
    }

    // 4. 열 방향 RS 인코딩 → primary 복구 심볼 + 심볼 해시
    let mut primary_encoder = self.inner.get_encoder::<Primary>();
    for (col_index, column) in secondary_slivers.iter().enumerate() {
        let symbols = primary_encoder.encode_all_ref(column.symbols.data())?;
        for (row_index, symbol) in symbols.to_symbols().enumerate() {
            symbol_hashes[n * row_index + col_index] = leaf_hash::<Blake2b256>(symbol);
        }
    }

    // 5. 각 노드 i: { primary[i], secondary[n-1-i] } 쌍으로 묶음
    let sliver_pairs = primary_slivers.into_iter()
        .zip(secondary_slivers.into_iter().rev())
        .map(|(p, s)| SliverPair { primary: p, secondary: s })
        .collect();

    // 6. 메타데이터: n×n 심볼 해시 행렬로 2개의 Merkle 트리 구성
    let metadata = compute_metadata_from_symbol_hashes(config, &symbol_hashes, unencoded_len);
    (sliver_pairs, metadata)
}`;

export const ENCODE_ANNOTATIONS = [
  { lines: [3, 11] as [number, number], color: 'sky' as const, note: '시스테매틱 심볼 배치' },
  { lines: [13, 18] as [number, number], color: 'emerald' as const, note: '행 방향 RS 인코딩' },
  { lines: [20, 27] as [number, number], color: 'amber' as const, note: '열 방향 RS 인코딩 + 해시' },
  { lines: [29, 33] as [number, number], color: 'violet' as const, note: '슬라이버 쌍 교차 배정' },
];

export const SLIVER_CODE = `// walrus-core/src/encoding/slivers.rs
pub struct SliverData<T: EncodingAxis> {
    pub symbols: Symbols,     // 평탄 바이트 버퍼 (symbol_size × n_symbols)
    pub index: SliverIndex,   // 이 슬라이버의 노드 인덱스
    _sliver_type: PhantomData<T>,
}
pub type PrimarySliver   = SliverData<Primary>;
pub type SecondarySliver = SliverData<Secondary>;

pub struct SliverPair {
    pub primary: PrimarySliver,     // 열 방향 RS 코드워드 중 1행
    pub secondary: SecondarySliver, // 행 방향 RS 코드워드 중 1열 (반전 인덱스)
}

// Symbols: Arity-free 심볼 버퍼
// - data: Vec<u8>  (symbol_size 단위 접근)
// - symbols.to_symbols() → chunks(symbol_size) 이터레이터`;

export const SLIVER_ANNOTATIONS = [
  { lines: [2, 6] as [number, number], color: 'sky' as const, note: '제네릭 슬라이버 구조체' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '슬라이버 쌍 (교차 보유)' },
];
