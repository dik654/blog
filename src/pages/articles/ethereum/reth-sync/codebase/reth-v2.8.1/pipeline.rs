// Reth v2.8.1 · d763342f
// crates/stages/api/src/pipeline/mod.rs에서 실행과 unwind 경계를 발췌했습니다.

async fn run_loop_until(
    &mut self,
    last_stage: Option<StageId>,
) -> Result<ControlFlow, PipelineError> {
    self.move_to_static_files()?;

    let mut previous_stage = None;
    for stage_index in 0..self.stages.len() {
        let stage = &self.stages[stage_index];
        let stage_id = stage.id();

        // 앞 stage의 checkpoint를 입력 경계로 다음 stage를 끝까지 실행합니다.
        let next = self.execute_stage_to_completion(previous_stage, stage_index).await?;

        match next {
            ControlFlow::NoProgress { block_number } => {
                if let Some(block_number) = block_number {
                    self.progress.update(block_number);
                }
            }
            ControlFlow::Continue { block_number } => self.progress.update(block_number),
            ControlFlow::Unwind { target, bad_block } => {
                // 검증 실패가 발견되면 전체 pipeline을 안전 지점으로 되돌립니다.
                self.unwind(target, Some(bad_block.block.number))?;
                return Ok(ControlFlow::Unwind { target, bad_block })
            }
        }

        previous_stage = Some(
            self.provider_factory
                .provider()?
                .get_stage_checkpoint(stage_id)?
                .unwrap_or_default()
                .block_number,
        );
    }

    Ok(self.progress.next_ctrl())
}

pub fn unwind(
    &mut self,
    to: BlockNumber,
    bad_block: Option<BlockNumber>,
) -> Result<(), PipelineError> {
    // 실행 의존성의 반대 순서로 stage 결과를 제거합니다.
    let unwind_pipeline = self.stages.iter_mut().rev();

    let mut provider_rw = self.provider_factory.unwind_provider_rw()?;
    for stage in unwind_pipeline {
        let stage_id = stage.id();
        let mut checkpoint = provider_rw
            .get_stage_checkpoint(stage_id)?
            .unwrap_or_default();

        while checkpoint.block_number > to {
            let input = UnwindInput { checkpoint, unwind_to: to, bad_block };
            checkpoint = stage.unwind(&provider_rw, input)?.checkpoint;
            provider_rw.save_stage_checkpoint(stage_id, checkpoint)?;
            provider_rw.commit()?;
        }
    }

    Ok(())
}
