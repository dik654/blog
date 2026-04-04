// reth-stages — ExecutionStage (reth v1.x)
// BodiesStage가 저장한 완성 블록(헤더+바디+sender)을 revm으로 실행

impl<E> Stage<DB> for ExecutionStage<E>
where E: BlockExecutorProvider,
{
    fn id(&self) -> StageId { StageId::Execution }

    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput> {
        // 1. 블록 범위 결정: checkpoint(이전에 처리 완료한 블록)+1 ~ target(CL tip)
        //    예: checkpoint=#18,399,000이면 start=#18,399,001
        let (start, end) = input.next_block_range().into_inner();

        // 2. revm 배치 실행기 생성 — 최신 DB 상태(StateProviderLatest)를 초기 상태로 바인딩
        //    BundleState: 실행 중 발생하는 모든 상태 변경(잔고, 스토리지, 코드)을 인메모리 누적
        let mut executor = self.executor_provider
            .batch_executor(StateProviderLatest::new(provider));

        for block_number in start..=end {
            // 3. DB에서 완성 블록 로드: 헤더(HeadersStage) + 바디(BodiesStage) + sender(SendersStage)
            //    세 Stage가 미리 저장한 데이터를 한 번에 조합
            let block = provider.sealed_block_with_senders(block_number)?
                .ok_or(ProviderError::BlockNotFound)?;

            // 4. revm으로 블록 내 모든 TX 실행 → 상태 변경이 BundleState에 누적
            //    gas 계산, 잔고 이동, 컨트랙트 코드 실행 등 전부 여기서 처리
            executor.execute_and_verify_one((&block).into())?;

            // 5. commit_threshold(기본 10,000블록)마다 BundleState를 DB에 중간 저장
            //    크래시 시 최대 threshold 블록만 재실행하면 됨
            if block_number % self.commit_threshold == 0 {
                executor.finalize().write_to_storage(provider)?;
            }
        }
        // 6. 루프 종료 후 남은 상태 변경을 전부 DB에 기록
        let state = executor.finalize();
        state.write_to_storage(provider)?;

        Ok(ExecOutput { checkpoint: StageCheckpoint::new(end), done: true })
    }
}
