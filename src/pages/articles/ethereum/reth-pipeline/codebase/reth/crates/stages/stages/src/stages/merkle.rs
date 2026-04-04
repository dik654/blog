// reth-stages — MerkleStage::execute() (reth v1.x)
// ExecutionStage 다음에 실행 — 실행 결과가 올바른지 상태 루트로 최종 검증
// 이유: TX 실행 결과를 머클 루트로 압축, 블록 헤더와 대조해서 위변조 검출

impl<Provider> Stage<DB> for MerkleStage<Provider>
where Provider: DBProvider + TrieProvider,
{
    fn id(&self) -> StageId { StageId::MerkleExecute }

    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput> {
        // 1. PrefixSet 로드 — ExecutionStage가 write_to_storage() 시 기록한 데이터
        //    "어떤 account/storage 키가 변경되었는지"의 접두사 목록
        //    전체 트라이를 탐색하지 않고, 변경된 서브트리만 식별하기 위한 인덱스
        let prefix_sets = provider.changed_prefix_sets(
            input.checkpoint().block_number, // 이전 MerkleStage 완료 지점
            input.target(),                  // CL tip — 여기까지의 변경분
        )?;

        // 2. 증분 상태 루트 계산 — 변경된 서브트리만 재해시
        //    기존 DB의 트라이 노드 + PrefixSet으로 변경 경로만 골라서 계산
        //    전체 재계산 대비 10~100배 빠름
        let state_root = StateRoot::overlay_root(
            provider,            // DB에 저장된 기존 트라이 노드 접근
            prefix_sets.clone(), // 변경된 키 접두사 → 해당 경로만 재계산
        )?;

        // 3. 검증: 계산한 루트 vs 블록 헤더의 state_root 비교
        //    HeadersStage가 저장한 헤더에서 정답 루트를 가져옴
        let target_header = provider.header_by_number(input.target())?
            .ok_or(ProviderError::HeaderNotFound)?;

        // 불일치 = ExecutionStage의 실행 결과가 잘못됨 → 전체 동기화 실패
        if state_root != target_header.state_root {
            return Err(StageError::Validation {
                block: input.target(),
                error: ConsensusError::BodyStateRootDiff {
                    got: state_root,
                    expected: target_header.state_root,
                },
            });
        }
        Ok(ExecOutput { checkpoint: StageCheckpoint::new(input.target()), done: true })
    }
}
