export const CRATE_CODE = `// walrus 모노레포 (crates/)
walrus-core/          // 핵심 인코딩, 타입, BFT 파라미터
  src/bft.rs          // max_n_faulty(n) = (n-1)/3
  src/encoding/
    config.rs         // EncodingConfig, ReedSolomonEncodingConfig
    basic_encoding.rs // ReedSolomonEncoder / Decoder (reed_solomon_simd 래핑)
    blob_encoding.rs  // BlobEncoder — 2D 인코딩 파이프라인
    slivers.rs        // SliverData<Primary/Secondary>, SliverPair
    symbols.rs        // Symbols (평탄 바이트 버퍼 + 심볼 크기)
  src/merkle.rs       // MerkleTree<Blake2b256> — 슬라이버 해시
  src/metadata.rs     // VerifiedBlobMetadataWithId, BlobId
walrus-service/       // 클라이언트 + 저장 노드 서비스
walrus-sui/           // Sui 온체인 레지스트리 연동`;

export const CRATE_ANNOTATIONS = [
  { lines: [2, 11] as [number, number], color: 'sky' as const, note: '핵심 인코딩 크레이트' },
  { lines: [12, 13] as [number, number], color: 'emerald' as const, note: '서비스 & Sui 온체인' },
];

export const BFT_CODE = `// walrus-core/src/bft.rs

// f = 최대 비잔틴 노드 수 = (n-1) / 3
pub fn max_n_faulty(n: NonZeroU16) -> u16 { (n.get() - 1) / 3 }

// min_n_correct = n - f  (최소 정직 노드 수)
pub fn min_n_correct(n: NonZeroU16) -> NonZeroU16 {
    (n.get() - max_n_faulty(n)).try_into().expect("max_n_faulty < n")
}

// 예) n=100: f=33, min_correct=67
// n=300: f=99, min_correct=201

// 인코딩 파라미터 도출 (config.rs)
// source_symbols_primary   = min_n_correct - f  = n - 2f
// source_symbols_secondary = min_n_correct       = n - f
pub fn source_symbols_for_n_shards(n: NonZeroU16) -> (NonZeroU16, NonZeroU16) {
    let min_c = min_n_correct(n);
    (
        (min_c.get() - max_n_faulty(n)).try_into().unwrap(),
        min_c,
    )
}
// n=100 시: primary_k=34, secondary_k=67, n_shards=100`;

export const BFT_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '비잔틴 장애 임계값' },
  { lines: [14, 16] as [number, number], color: 'emerald' as const, note: '인코딩 파라미터 도출' },
];

export const REDSTUFF_CODE = `// 2D 메시지 행렬: primary_k × secondary_k 심볼
//
//        ← secondary_k 열 →
//   ┌─────────────────────────┐
// ↑ │  raw blob data (행 우선) │ (primary_k 행)
// primary_k  ├─────────────────────────┤
// ↓ │  (zero-padded)          │
//   └─────────────────────────┘
//
// 행(row) 방향 Reed-Solomon → Secondary 슬라이버 (n_shards개)
// 열(col) 방향 Reed-Solomon → Primary   슬라이버 (n_shards개)
//
// 노드 i가 보유: (Primary슬라이버[i], Secondary슬라이버[n-1-i])
// → 두 방향 인코딩이 교차되어 f개 장애 노드에서도 복구 가능
//
// 복구 임계값:
//   Primary  슬라이버 복구: secondary_k = n-f 개 심볼 필요
//   Secondary 슬라이버 복구: primary_k  = n-2f 개 심볼 필요`;

export const REDSTUFF_ANNOTATIONS = [
  { lines: [10, 11] as [number, number], color: 'sky' as const, note: 'RS 인코딩 방향' },
  { lines: [13, 14] as [number, number], color: 'emerald' as const, note: '교차 보유 구조' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '복구 임계값' },
];
