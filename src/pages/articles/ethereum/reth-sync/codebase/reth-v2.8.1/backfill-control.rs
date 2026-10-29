// Reth v2.8.1 · d763342f
// crates/engine/tree/src/backfill.rs와 tree/mod.rs의 상태 전이를 발췌했습니다.

pub enum BackfillSyncState {
    // Pipeline을 쓰지 않는 live 상태입니다.
    Idle,
    // Start action을 보냈지만 pipeline이 아직 시작되지 않았습니다.
    Pending,
    // Persistence와 payload job이 끝난 뒤 필요성을 다시 판단합니다.
    PendingRevalidation,
    // Pipeline이 DB write lock을 가지고 실행 중입니다.
    Active,
}

pub enum BackfillAction {
    // 새 backfill run을 시작합니다.
    Start(PipelineTarget),
    // 실행 중인 run의 최신 forkchoice 목표를 전달합니다.
    UpdateTarget(B256),
    // 되돌릴 수 없는 작업의 기준이 될 finalized block을 전달합니다.
    UpdateFinalized(B256),
}

fn validate_forkchoice_state(
    &mut self,
    state: ForkchoiceState,
) -> ProviderResult<Option<OnForkChoiceUpdated>> {
    if !self.backfill_sync_state.is_idle() {
        // 실행 중인 backfill에는 최신 head와 finalized를 전달합니다.
        if self.backfill_sync_state.is_pending() || self.backfill_sync_state.is_active() {
            self.send_event(EngineApiEvent::BackfillAction(
                BackfillAction::UpdateTarget(state.head_block_hash),
            ));
            self.forward_finalized(state.finalized_block_hash);
        }

        // Pipeline이 DB를 쓰는 동안 live FCU는 canonical state를 쓰지 않습니다.
        return Ok(Some(OnForkChoiceUpdated::syncing()))
    }

    Ok(None)
}

fn on_new_payload(&mut self, payload: Payload) -> TreeOutcome<OnNewPayload> {
    if self.backfill_sync_state.is_idle() {
        // Live owner일 때만 즉시 실행합니다.
        self.try_insert_payload(payload)?.into_outcome()
    } else {
        // Backfill owner일 때는 나중에 연결할 payload로 보관합니다.
        TreeOutcome::new(self.try_buffer_payload(payload)?)
    }
}

fn dispatch_backfill_action(&mut self, action: BackfillAction) {
    // Orchestrator가 Started를 돌려줄 때까지 Pending으로 writer 전환을 막습니다.
    self.backfill_sync_state = BackfillSyncState::Pending;
    self.send_event(EngineApiEvent::BackfillAction(action));
}
