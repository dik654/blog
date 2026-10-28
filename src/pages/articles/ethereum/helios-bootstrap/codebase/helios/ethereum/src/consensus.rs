// a16z/helios commit 43a8c9f3의 ethereum/src/consensus.rs에서 발췌했습니다.
// 실행문은 원문을 보존하고, 이 글에서 따라갈 수 있도록 한국어 주석만 덧붙였습니다.

pub async fn bootstrap(&mut self, checkpoint: B256) -> Result<()> {
    // 승인된 checkpoint C를 요청 key로 사용해 Bootstrap H·K·B를 가져옵니다.
    let bootstrap = self
        .rpc
        .get_bootstrap(checkpoint)
        .await
        .map_err(|err| eyre!("could not fetch bootstrap: {}", err))?;

    // 응답 header의 slot이 구현의 최대 checkpoint 나이 정책을 통과하는지 봅니다.
    let is_valid = self.is_valid_checkpoint(bootstrap.header().beacon().slot);

    if !is_valid {
        // strict 모드에서는 오래된 checkpoint를 즉시 거부합니다.
        if self.config.strict_checkpoint_age {
            return Err(ConsensusError::CheckpointTooOld.into());
        } else {
            warn!(target: "helios::consensus", "checkpoint too old, consider using a more recent block");
        }
    }

    // Header root와 committee inclusion proof를 모두 검증합니다.
    verify_bootstrap(&bootstrap, checkpoint, &self.config.forks)?;

    // 검증이 끝난 응답만 현재 LightClientStore에 적용합니다.
    apply_bootstrap(&mut self.store, &bootstrap);

    Ok(())
}

// 구현의 freshness 정책은 slot을 초로 바꾼 뒤 설정값과 비교합니다.
fn is_valid_checkpoint(&self, blockhash_slot: u64) -> bool {
    let current_slot = self.expected_current_slot();
    let current_slot_timestamp = self.slot_timestamp(current_slot);
    let blockhash_slot_timestamp = self.slot_timestamp(blockhash_slot);

    // 미래 slot이면 음수가 되지 않도록 0으로 포화합니다.
    let slot_age = current_slot_timestamp
        .checked_sub(blockhash_slot_timestamp)
        .unwrap_or_default();

    slot_age < self.config.max_checkpoint_age
}
