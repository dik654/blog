// commonware/storage/src/qmdb/any/db.rs — QMDB Any (이력 값 증명)

/// Any QMDB — Operations MMR 위에 스냅샷 인덱스를 결합.
/// 모든 쓰기를 append-only 로그로 기록.
pub struct Db<E: Context, C, I, H: Hasher, U> {
    /// log — 모든 연산의 순서 기록 (인증된 Journal).
    /// MMR로 머클화되어 포함 증명 가능.
    pub(crate) log: AuthenticatedLog<E, C, H>,

    /// inactivity_floor_loc — 이 위치 이전은 전부 비활성.
    /// prune 시 이 경계까지만 삭제 가능.
    pub(crate) inactivity_floor_loc: Location,

    /// last_commit_loc — 마지막 CommitFloor 연산 위치.
    pub(crate) last_commit_loc: Location,

    /// snapshot — 활성 키 → 로그 내 최신 위치 매핑.
    /// 읽기 시 로그 전체 스캔 불필요.
    pub(crate) snapshot: I,

    /// active_keys — 현재 활성 키 개수.
    pub(crate) active_keys: usize,
}

impl<E, U, C, I, H> Db<E, C, I, H, U> {
    /// get — 키의 현재 값 조회.
    /// snapshot에서 위치 → log에서 실제 값 읽기.
    pub async fn get(&self, key: &U::Key) -> Result<Option<U::Value>> {
        let locs: Vec<Location> = self.snapshot.get(key).copied().collect();
        let reader = self.log.reader().await;
        for loc in locs {
            let op = reader.read(*loc).await?;
            let Operation::Update(data) = op else { panic!() };
            if data.key() == key {
                return Ok(Some(data.value().clone()));
            }
        }
        Ok(None)
    }

    /// proof — 특정 위치부터 최대 max_ops개 연산의 포함 증명.
    pub async fn proof(&self, loc: Location, max_ops: NonZeroU64)
        -> Result<(Proof<H::Digest>, Vec<Operation<U>>)>
    {
        self.log.historical_proof(self.log.size().await, loc, max_ops).await
    }

    /// prune — inactivity_floor 이전 연산 삭제.
    pub async fn prune(&mut self, prune_loc: Location) -> Result<()> {
        if prune_loc > self.inactivity_floor_loc {
            return Err(Error::PruneBeyondMinRequired(..));
        }
        self.log.prune(prune_loc).await
    }
}
