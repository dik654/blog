// Reth v2.8.1 · d763342f
// crates/engine/tree/src/tree/mod.rs에서 동기화 분기만 발췌했습니다.

fn on_forkchoice_updated(
    &mut self,
    state: ForkchoiceState,
    attrs: Option<T::PayloadAttributes>,
) -> ProviderResult<TreeOutcome<OnForkChoiceUpdated>> {
    // 이미 가진 canonical head인지, tree 안의 fork인지 먼저 확인합니다.
    if let Some(result) = self.handle_canonical_head(state, &attrs)? {
        return Ok(result)
    }
    if let Some(result) = self.apply_chain_update(state, &attrs)? {
        return Ok(result)
    }

    // 어느 경로에서도 head를 찾지 못했을 때만 자료 수집을 시작합니다.
    self.handle_missing_block(state)
}

fn handle_missing_block(
    &self,
    state: ForkchoiceState,
) -> ProviderResult<TreeOutcome<OnForkChoiceUpdated>> {
    // 초기 FCU에서 safe block도 없다면 safe부터, 아니면 head부터 찾습니다.
    let target = if self.state.forkchoice_state_tracker.is_empty() &&
        !state.safe_block_hash.is_zero() &&
        self.find_canonical_header(state.safe_block_hash).ok().flatten().is_none()
    {
        state.safe_block_hash
    } else {
        state.head_block_hash
    };

    let target = self.lowest_buffered_ancestor_or(target);

    // SYNCING과 DownloadRequest를 함께 내보냅니다.
    Ok(TreeOutcome::new(OnForkChoiceUpdated::valid(
        PayloadStatus::from_status(PayloadStatusEnum::Syncing),
    ))
    .with_event(TreeEvent::Download(
        DownloadRequest::single_block(target)
            .with_access_lists(self.should_download_access_lists()),
    )))
}

fn on_disconnected_downloaded_block(
    &self,
    downloaded_block: BlockNumHash,
    missing_parent: BlockNumHash,
    head: BlockNumHash,
) -> Option<TreeEvent> {
    // 간격이 backfill 기준을 넘으면 pipeline 실행을 요청합니다.
    if let Some(target) =
        self.backfill_sync_target(head.number, missing_parent.number, Some(downloaded_block))
    {
        return Some(TreeEvent::BackfillAction(
            BackfillAction::Start(target.into()),
        ))
    }

    // 기준보다 짧으면 빠진 부모 범위를 계속 내려받습니다.
    let request = if let Some(distance) =
        self.distance_from_local_tip(head.number, missing_parent.number)
    {
        DownloadRequest::block_range(missing_parent.hash, distance)
    } else {
        DownloadRequest::single_block(missing_parent.hash)
    };

    Some(TreeEvent::Download(
        request.with_access_lists(self.should_download_access_lists()),
    ))
}
