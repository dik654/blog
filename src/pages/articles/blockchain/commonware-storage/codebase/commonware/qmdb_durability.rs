// commonware/storage/src/qmdb/current/db.rs · v2026.9.0

// 적용된 journal state를 durable하게 만듭니다.
pub async fn commit(mut self) -> Result<Self, Error<F>> {
    self.any = self.any.commit().await?;
    Ok(self)
}

// 모든 DB state를 disk에 sync해 시작 시 recovery가 필요 없는 경계를 만듭니다.
pub async fn sync(mut self) -> Result<Self, Error<F>> {
    let _timer = self.metrics.sync_timer();
    self.metrics.sync_calls.inc();
    self.any = self.any.sync().await?;

    // Bitmap pruning boundary와 pinned nodes metadata도 함께 sync합니다.
    self = self.sync_metadata().await?;
    self.update_metrics();
    Ok(self)
}

// 현재 DB state에 batch를 적용할 수 있는지 handle을 소비하지 않고 검사합니다.
pub fn validate_batch(
    &self,
    batch: &super::batch::MerkleizedBatch<F, H::Digest, U, N, S>,
) -> Result<(), Error<F>> {
    self.any.validate_batch(&batch.inner)
}

// 유효한 batch를 Current view와 journal에 반영합니다.
pub async fn apply_batch(
    mut self,
    batch: Arc<super::batch::MerkleizedBatch<F, H::Digest, U, N, S>>,
) -> Result<(Self, Range<Location<F>>), Error<F>> {
    let _timer = self.metrics.apply_batch_timer();
    self.metrics.apply_batch_calls.inc();
    let range;
    (self.any, range) = self.any.apply_batch(Arc::clone(&batch.inner)).await?;
    Arc::make_mut(&mut self.grafted_tree).apply_batch(&batch.grafted)?;
    self.root = batch.canonical_root;
    self.update_metrics();
    Ok((self, range))
}
