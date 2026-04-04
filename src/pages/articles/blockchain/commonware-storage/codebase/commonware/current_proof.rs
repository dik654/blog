// commonware/storage/src/qmdb/current/proof.rs — Current 증명 타입

/// RangeProof — 연산 범위가 DB에 존재함을 증명.
pub struct RangeProof<D: Digest> {
    pub proof: Proof<D>,             // MMR 증명 자료
    pub partial_chunk_digest: Option<D>, // 미완성 청크 해시
    pub ops_root: D,                 // ops MMR 루트
}

/// OperationProof — 특정 연산이 활성임을 증명.
pub struct OperationProof<D: Digest, const N: usize> {
    pub loc: Location,               // 연산 위치
    pub chunk: [u8; N],              // 해당 비트맵 청크
    pub range_proof: RangeProof<D>,  // 포함 증명
}

impl<D: Digest, const N: usize> OperationProof<D, N> {
    /// verify — 연산이 활성이고 DB에 포함됨을 검증.
    pub fn verify<H: CHasher<Digest = D>, O: Codec>(
        &self, hasher: &mut H, operation: O, root: &D,
    ) -> bool {
        // 1) 비트맵에서 해당 위치가 1(활성)인지 확인
        if !BitMap::<N>::get_bit_from_chunk(&self.chunk, *self.loc) {
            return false; // 비활성 → 실패
        }
        // 2) RangeProof로 포함 + grafted 루트 검증
        self.range_proof.verify(hasher, self.loc, &[operation], &[self.chunk], root)
    }
}

impl<D: Digest> RangeProof<D> {
    /// verify — grafted MMR 루트 재구성 → 정규 루트 비교.
    pub fn verify<H, O, const N: usize>(&self, hasher: &mut H,
        start_loc: Location, ops: &[O], chunks: &[[u8; N]], root: &H::Digest,
    ) -> bool {
        // grafted 루트 재구성
        let mmr_root = self.proof.reconstruct_root(&verifier, &elements, start_loc)?;
        // 정규 루트 = hash(ops_root || grafted_root [|| partial_chunk])
        hasher.update(&self.ops_root);
        hasher.update(&mmr_root);
        if has_partial_chunk {
            hasher.update(&next_bit.to_be_bytes());
            hasher.update(self.partial_chunk_digest.as_ref().unwrap());
        }
        hasher.finalize() == *root
    }
}
