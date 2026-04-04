// reth-stages-api — Pipeline (reth v1.x)

pub struct Pipeline<N: NodeTypesWithDB> {
    /// 실행할 Stage 목록 — Headers→Bodies→Senders→Execution→Merkle 순서
    /// PipelineBuilder가 조립 시 고정, 런타임에 변경 불가
    stages: Vec<Box<dyn Stage<N::DB>>>,
    /// CL(Lighthouse 등)이 FCU로 알려준 목표 블록 해시
    /// 이 해시까지 따라잡아야 동기화 완료 — None이면 아직 CL과 미연결
    tip: Option<B256>,
    /// 디버그/테스트용 최대 블록 제한 — 프로덕션에서는 None
    max_block: Option<BlockNumber>,
    /// 각 Stage별 체크포인트(=마지막 처리 블록)를 추적하는 구조체
    /// MDBX StageCheckpoints 테이블에서 로드/저장
    progress: PipelineProgress,
}

impl<N: NodeTypesWithDB> Pipeline<N> {
    pub async fn run(&mut self) -> Result<ControlFlow> {
        loop {
            // 모든 스테이지를 순서대로 실행 (Headers → Bodies → … → Merkle)
            for stage in &mut self.stages {
                let input = ExecInput {
                    // tip: CL이 알려준 목표 해시 → "여기까지 처리하라"
                    target: self.tip,
                    // checkpoint: 이 Stage가 마지막으로 처리한 블록 번호 (DB에서 로드)
                    // 크래시 후 재시작 시 이 지점부터 이어서 처리
                    checkpoint: self.progress.checkpoint(stage.id()),
                };
                // Stage::execute() 호출 — 각 Stage 구현체가 작업 수행
                let output = stage.execute(&self.provider, input)?;
                // 체크포인트 갱신 — DB에 기록해서 크래시 복구 가능
                self.progress.update(stage.id(), output.checkpoint);

                if !output.done {
                    // 아직 target까지 도달 못함 → 이번 루프 중단, 다음 루프에서 이어서
                    break;
                }
            }
            // 모든 스테이지가 done=true → CL tip까지 동기화 완료
            if self.progress.all_done() {
                return Ok(ControlFlow::NoProgress);
            }
        }
    }
}
