// commonware/storage/src/qmdb/current/proof/mod.rs · v2026.9.0

/// 특정 operation이 현재 active임을 증명합니다.
pub struct OperationProof<F: Graftable, D: Digest, const N: usize> {
    // Operation의 append-only log 위치입니다.
    pub loc: Location<F>,

    // 해당 위치의 activity bit를 담은 bitmap chunk입니다.
    pub chunk: [u8; N],

    // Operation과 bitmap chunk를 canonical root에 연결합니다.
    pub range_proof: RangeProof<F, D>,
}

impl<F: Graftable, D: Digest, const N: usize> OperationProof<F, D, N> {
    /// Operation이 active이고 expected root에 포함되는지 확인합니다.
    pub fn verify<H: Hasher<Digest = D>, O: Codec>(
        &self,
        operation: O,
        root: &D,
    ) -> bool {
        // Activity bit가 0이면 이력에 있어도 현재 값은 아닙니다.
        if !BitMap::<N>::get_bit_from_chunk(&self.chunk, *self.loc) {
            debug!(?self.loc, "proof verification failed, operation is inactive");
            return false;
        }

        // Operation과 bitmap chunk로 canonical root를 재구성합니다.
        self.range_proof
            .verify::<H, O, N>(self.loc, &[operation], &[self.chunk], root)
    }
}
