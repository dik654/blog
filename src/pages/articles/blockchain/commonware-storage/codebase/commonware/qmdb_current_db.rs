// commonware/storage/src/qmdb/current/db.rs — QMDB Current (현재 값 증명)

/// Current QMDB — Any DB + Activity Bitmap + Grafted MMR.
/// "현재 값"을 증명하려면 이력 증명 + 활성 상태가 필요.
pub struct Db<E: Context, C, I, H: Hasher, U, const N: usize> {
    /// any — 이력 증명을 제공하는 Any QMDB.
    pub(super) any: any::db::Db<E, C, I, H, U>,

    /// status — 각 연산의 활성(1)/비활성(0) 비트맵.
    /// N바이트 청크 단위로 관리.
    pub(super) status: BitmapBatch<N>,

    /// grafted_mmr — 비트맵 청크 + ops 서브트리를 결합한 MMR.
    /// 증명 크기를 ~50% 절감.
    pub(super) grafted_mmr: mmr::batch::MerkleizedBatch<H::Digest>,

    /// metadata — 핀 노드 + 프루닝 청크 수 영속.
    pub(super) metadata: AsyncMutex<Metadata<E, U64, Vec<u8>>>,

    /// root — 캐시된 정규 루트.
    /// Hash(ops_root || grafted_root [|| partial_chunk]).
    pub(super) root: DigestOf<H>,
}

impl<E, C, I, H, U, const N: usize> Db<E, C, I, H, U, N> {
    /// root — 정규 루트 = ops_root + grafted_root + partial_chunk.
    pub fn root(&self) -> DigestOf<H> { self.root }

    /// get — Any DB의 get을 위임.
    pub async fn get(&self, key: &U::Key) -> Result<Option<U::Value>> {
        self.any.get(key).await
    }

    /// operation_proof — 특정 연산이 활성임을 증명.
    /// RangeProof(MMR 증명) + 해당 비트맵 청크 포함.
    pub async fn operation_proof(&self, loc: Location)
        -> Result<OperationProof<H::Digest, N>>
    {
        let ops_root = self.any.root();
        OperationProof::new(&mut hasher, &self.status, &self.grafted_mmr, loc, ops_root).await
    }
}
