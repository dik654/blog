import type { CodeRef, ProjectMeta } from "@/components/code/types";

export const RETH_PIPELINE_PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "border-orange-500 bg-orange-500/10 text-orange-700",
  },
};

export const rethPipelineCodeRefs: Record<string, CodeRef> = {
  "next-block-range": {
    path: "reth/crates/stages/api/src/stage.rs",
    code: `    /// Return the next block range to execute.
    pub fn next_block_range_with_threshold(&self, threshold: u64) -> BlockRangeOutput {
        let current_block = self.checkpoint();
        let start = current_block.block_number + 1;
        let target = self.target();

        let end = min(target, current_block.block_number.saturating_add(threshold));

        let is_final_range = end == target;
        BlockRangeOutput { block_range: start..=end, is_final_range }
    }`,
    lang: "rust",
    highlight: [2, 10],
    desc: "Reth v2.8.1 · stage.rs L74–84. 저장한 checkpoint 다음 블록에서 시작해 target과 threshold 중 가까운 지점을 batch 끝으로 고릅니다.",
    annotations: [
      { lines: [3, 5], color: "sky", note: "checkpoint·start·target을 읽습니다." },
      { lines: [7, 7], color: "amber", note: "target을 넘지 않는 batch 끝을 계산합니다." },
      { lines: [9, 10], color: "emerald", note: "마지막 batch 여부와 닫힌 범위를 함께 반환합니다." },
    ],
  },
  "stage-contract": {
    path: "reth/crates/stages/api/src/stage.rs",
    code: `pub trait Stage<Provider>: Send {
    /// Get the ID of the stage.
    ///
    /// Stage IDs must be unique.
    fn id(&self) -> StageId;

    /// Returns \`Poll::Ready(Ok(()))\` when the stage is ready to execute the given range.
    fn poll_execute_ready(
        &mut self,
        _cx: &mut Context<'_>,
        _input: ExecInput,
    ) -> Poll<Result<(), StageError>> {
        Poll::Ready(Ok(()))
    }

    /// Execute the stage.
    /// It is expected that the stage will write all necessary data to the database
    /// upon invoking this method.
    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput, StageError>;

    /// Post execution commit hook.
    fn post_execute_commit(&mut self) -> Result<(), StageError> {
        Ok(())
    }

    /// Unwind the stage.
    fn unwind(
        &mut self,
        provider: &Provider,
        input: UnwindInput,
    ) -> Result<UnwindOutput, StageError>;

    /// Post unwind commit hook.
    fn post_unwind_commit(&mut self) -> Result<(), StageError> {
        Ok(())
    }
}`,
    lang: "rust",
    highlight: [1, 37],
    desc: "Reth v2.8.1 · stage.rs L241–308에서 문서 주석을 줄여 옮긴 연속 API입니다. Stage는 준비·실행·되감기와 commit 뒤 hook을 구현하고, provider transaction commit은 Pipeline runner가 수행합니다.",
    annotations: [
      { lines: [5, 5], color: "sky", note: "Stage checkpoint를 식별하는 고유 ID입니다." },
      { lines: [8, 14], color: "amber", note: "외부 입력과 buffer가 준비됐는지 먼저 확인합니다." },
      { lines: [19, 19], color: "emerald", note: "Output을 provider에 쓰고 새 checkpoint를 반환합니다." },
      { lines: [27, 32], color: "rose", note: "잘못된 suffix를 되돌리는 독립 계약입니다." },
    ],
  },
  "execute-commit": {
    path: "reth/crates/stages/api/src/pipeline/mod.rs",
    code: `let stage_id = self.stage(stage_index).id();
let mut made_progress = false;
let target = self.max_block.or(previous_stage);

loop {
    let prev_checkpoint = self.provider_factory.get_stage_checkpoint(stage_id)?;
    let exec_input = ExecInput { target, checkpoint: prev_checkpoint };

    if let Err(err) = self.stage(stage_index).execute_ready(exec_input).await {
        self.event_sender.notify(PipelineEvent::Error { stage_id });
        match self.on_stage_error(stage_id, prev_checkpoint, err)? {
            Some(ctrl) => return Ok(ctrl),
            None => continue,
        };
    }

    let stage_started_at = Instant::now();
    let provider_rw = self.provider_factory.database_provider_rw()?;

    match self.stage(stage_index).execute(&provider_rw, exec_input) {
        Ok(out @ ExecOutput { checkpoint, done }) => {
            // Update stage checkpoint.
            provider_rw.save_stage_checkpoint(stage_id, checkpoint)?;

            // Commit processed data to the database.
            provider_rw.commit()?;

            // Invoke stage post commit hook.
            self.stage(stage_index).post_execute_commit()?;`,
    lang: "rust",
    highlight: [3, 30],
    desc: "Reth v2.8.1 · pipeline/mod.rs L486–554에서 event 통지 부분만 덜어낸 실행 경로입니다. Stage output은 RW provider에 쓰이고, checkpoint 저장 뒤 같은 provider transaction을 commit합니다.",
    annotations: [
      { lines: [3, 7], color: "sky", note: "첫 stage는 max block, 다음 stage는 앞 stage checkpoint를 target으로 받습니다." },
      { lines: [18, 21], color: "amber", note: "하나의 RW provider를 열어 Stage output을 기록합니다." },
      { lines: [23, 27], color: "emerald", note: "새 checkpoint를 같은 transaction에 넣고 commit합니다." },
      { lines: [29, 30], color: "violet", note: "Hook은 durable commit이 끝난 다음 호출됩니다." },
    ],
  },
  "unwind-order": {
    path: "reth/crates/stages/api/src/pipeline/mod.rs",
    code: `prune_modes.ensure_unwind_target_unpruned(latest_block, to, &checkpoints)?;

// Unwind stages in reverse order of execution
let unwind_pipeline = self.stages.iter_mut().rev();

let mut provider_rw =
    self.provider_factory.unwind_provider_rw()?.disable_long_read_transaction_safety();

for stage in unwind_pipeline {
    let stage_id = stage.id();
    let mut checkpoint = provider_rw.get_stage_checkpoint(stage_id)?.unwrap_or_default();

    while checkpoint.block_number > to {
        let input = UnwindInput { checkpoint, unwind_to: to, bad_block };
        let output = stage.unwind(&provider_rw, input);
        match output {
            Ok(unwind_output) => {
                checkpoint = unwind_output.checkpoint;
                provider_rw.save_stage_checkpoint(stage_id, checkpoint)?;`,
    lang: "rust",
    highlight: [1, 19],
    desc: "Reth v2.8.1 · pipeline/mod.rs L365–420의 핵심 연속 경로입니다. Prune 경계를 먼저 검사하고, stage 목록을 역순으로 순회해 output과 checkpoint를 함께 낮춥니다.",
    annotations: [
      { lines: [1, 1], color: "rose", note: "이미 제거한 자료 아래로 무조건 되감지 않습니다." },
      { lines: [3, 4], color: "violet", note: "실행의 역순으로 소비자 stage부터 되돌립니다." },
      { lines: [13, 19], color: "emerald", note: "Stage unwind 결과의 checkpoint를 provider에 저장합니다." },
    ],
  },
  "unwind-commit": {
    path: "reth/crates/stages/api/src/pipeline/mod.rs",
    code: `provider_rw.save_stage_checkpoint(stage_id, checkpoint)?;

// update finalized and safe block if needed
let last_saved_finalized_block_number =
    provider_rw.last_finalized_block_number()?;

if last_saved_finalized_block_number.is_none() ||
    Some(checkpoint.block_number) < last_saved_finalized_block_number
{
    provider_rw.save_finalized_block_number(BlockNumber::from(
        checkpoint.block_number,
    ))?;
}

let last_saved_safe_block_number = provider_rw.last_safe_block_number()?;

if last_saved_safe_block_number.is_none() ||
    Some(checkpoint.block_number) < last_saved_safe_block_number
{
    provider_rw.save_safe_block_number(BlockNumber::from(
        checkpoint.block_number,
    ))?;
}

provider_rw.commit()?;

stage.post_unwind_commit()?;`,
    lang: "rust",
    highlight: [1, 27],
    desc: "Reth v2.8.1 · pipeline/mod.rs L420–463의 commit 경계입니다. 되감은 checkpoint와 필요한 safe/finalized 경계를 provider transaction에 저장하고 commit한 다음 hook을 호출합니다.",
    annotations: [
      { lines: [1, 1], color: "sky", note: "Stage의 되감긴 checkpoint를 저장합니다." },
      { lines: [3, 23], color: "amber", note: "필요하면 safe·finalized 위치도 같은 방향으로 낮춥니다." },
      { lines: [25, 27], color: "emerald", note: "Provider commit이 끝난 뒤 post-unwind hook을 호출합니다." },
    ],
  },
};
