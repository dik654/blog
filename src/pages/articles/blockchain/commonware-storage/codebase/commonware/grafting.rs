// commonware/storage/src/qmdb/current/grafting.rs — 비트맵 접목(Grafting)

// Grafting = ops MMR의 서브트리 루트에 비트맵 청크를 결합.
// 단일 증명으로 "연산 포함 + 활성 상태"를 동시에 검증.
//
//    Height
//      3              14
//      2        6            13       ← grafting height
//      1     2     5      9     12
//      0   0   1 3   4  7   8 10  11
//
// 높이 2의 노드(6, 13)가 "grafted leaf":
// digest = hash(bitmap_chunk || ops_subtree_root)

/// grafting height = log2(chunk_size_bits).
pub(crate) const fn height<const N: usize>() -> u32 {
    BitMap::<N>::CHUNK_SIZE_BITS.trailing_zeros()
}

/// 청크 인덱스 → ops MMR 위치 변환.
/// 청크 i는 ops 리프 [i * 2^h, (i+1) * 2^h)를 커버.
pub(super) fn chunk_idx_to_ops_pos(chunk_idx: u64, h: u32) -> Position {
    let first_leaf_loc = Location::new(chunk_idx << h);
    let first_leaf_pos = Position::try_from(first_leaf_loc).unwrap();
    Position::new(*first_leaf_pos + (1u64 << (h + 1)) - 2)
}

/// Verifier — 증명 검증 시 grafted leaf 재구성.
pub struct Verifier<H: CHasher> {
    grafting_height: u32,
    start_chunk_idx: u64,
    chunks: Vec<&[u8]>, // 비트맵 청크 슬라이스
    _h: PhantomData<H>,
}

impl<H: CHasher> Verifier<H> {
    /// 새 검증기 생성. chunks[i] = start_chunk_idx + i 번째 청크.
    pub fn new(h: u32, start: u64, chunks: Vec<&[u8]>) -> Self {
        Self { grafting_height: h, start_chunk_idx: start, chunks, _h: PhantomData }
    }

    /// 청크의 다이제스트 = hash(chunk_bytes).
    pub fn digest(&self, chunk: &[u8]) -> H::Digest {
        let mut h = H::default();
        h.update(chunk);
        h.finalize()
    }
}
