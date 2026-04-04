export const REDSTUFF_CODE = `// RedStuff 2D 이레이저 코딩 핵심
// n = 3f + 1 노드, f개 비잔틴 장애 허용
//
// Primary 슬라이버: 블롭을 열(column) 방향으로 RS 인코딩
//   - source_symbols = n - 2f (원본 심볼 수)
//   - recovery_symbols = 2f (복구 심볼 수)
//
// Secondary 슬라이버: 블롭을 행(row) 방향으로 RS 인코딩
//   - source_symbols = n - 2f
//   - recovery_symbols = 2f
//
// 각 노드는 Primary 슬라이버 1개 + Secondary 슬라이버 1개 보유
// → f개 노드 장애 시에도 n - f개 슬라이버로 복구 가능`;

export const REDSTUFF_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'BFT 파라미터: n = 3f + 1' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: 'Primary: 열 방향 RS 인코딩' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: 'Secondary: 행 방향 RS 인코딩' },
];

export const ENCODE_FLOW_CODE = `// BlobEncoder 인코딩 흐름
// 1. 블롭 → 2D 행렬 (행: source_symbols, 열: symbol_size)
let matrix = pad_to_matrix(blob, n_source, symbol_size);

// 2. Primary 인코딩 (열 방향 RS)
let primary_slivers = reed_solomon_simd::encode(
    n_source, n_recovery, &matrix.columns()
)?;

// 3. Secondary 인코딩 (행 방향 RS)
let secondary_slivers = reed_solomon_simd::encode(
    n_source, n_recovery, &matrix.rows()
)?;

// 4. Merkle 루트 계산 (Blake2b256)
let primary_root = merkle_root(primary_slivers);
let secondary_root = merkle_root(secondary_slivers);
let blob_id = hash(primary_root || secondary_root);`;

export const ENCODE_FLOW_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '블롭을 2D 행렬로 변환' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'Primary RS: SIMD 최적화' },
  { lines: [15, 18] as [number, number], color: 'amber' as const, note: 'Merkle 루트 → BlobId' },
];
