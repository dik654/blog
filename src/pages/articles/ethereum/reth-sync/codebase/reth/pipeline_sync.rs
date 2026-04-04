// reth/crates/stages/stages/src/stages/mod.rs + pipeline
// Full sync — Pipeline 실행, 모든 Stage를 최신 블록까지 진행

use reth_primitives::BlockNumber;

/// Pipeline — Stage들의 순서 실행 관리자.
/// 각 Stage가 tip까지 진행되면 다음 Stage로 넘어간다.
pub struct Pipeline<DB> {
    /// 등록된 Stage 목록 (순서대로 실행)
    stages: Vec<Box<dyn Stage<DB>>>,
    /// 현재 파이프라인 진행 상태
    progress: PipelineProgress,
    /// 동기화 목표 블록 (CL에서 받은 tip)
    tip: Option<BlockNumber>,
}

/// Stage trait — 각 동기화 단계의 인터페이스
pub trait Stage<DB>: Send + Sync {
    /// 스테이지 실행 — input 범위의 블록을 처리
    fn execute(&mut self, input: ExecInput)
        -> Result<ExecOutput>;
    /// 되감기 — reorg 시 특정 블록까지 롤백
    fn unwind(&mut self, input: UnwindInput)
        -> Result<UnwindOutput>;
}

impl<DB> Pipeline<DB> {
    /// 전체 파이프라인 실행
    /// Headers → Bodies → Execution → Merkle 순으로 진행
    pub fn run(&mut self) -> Result<()> {
        loop {
            for stage in &mut self.stages {
                let output = stage.execute(ExecInput {
                    target: self.tip,
                    checkpoint: self.progress.checkpoint,
                })?;
                self.progress.update(output.checkpoint);
                if !output.done { break; }
            }
            if self.progress.is_complete() { break; }
        }
        Ok(())
    }
}
