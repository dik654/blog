// reth-stages — HeadersStage::execute() (reth v1.x)
// Pipeline의 첫 번째 Stage — 피어 네트워크에서 블록 헤더를 다운로드

impl<Provider, Downloader> Stage<DB> for HeadersStage<Provider, Downloader>
where
    Provider: DBProvider + HeaderProvider,
    Downloader: HeaderDownloader, // devp2p/eth로 피어와 통신
{
    fn id(&self) -> StageId { StageId::Headers }

    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput> {
        // 1. 다운로드 범위: checkpoint(이전 완료 블록)+1 ~ target(CL이 알려준 tip)
        //    예: checkpoint=#18,399,000, target=#18,400,000 → 1,000개 헤더
        let (start, end) = input.next_block_range().into_inner();

        // 2. 피어에게 GetBlockHeaders 요청 → 응답이 스트림으로 하나씩 도착
        //    devp2p 프로토콜: 여러 피어에 병렬 요청, 가장 빠른 응답 사용
        let mut stream = self.downloader.stream_headers(start..=end);

        let mut batch = Vec::new();
        while let Some(header) = stream.next().await? {
            // 3. 헤더 검증: 위조 방지
            //    - parent_hash가 이전 블록 해시와 일치하는지
            //    - 블록 번호가 연속인지
            //    - 타임스탬프가 부모보다 큰지
            let parent = provider.header_by_number(header.number - 1)?;
            self.consensus.validate_header_against_parent(&header, &parent)?;

            batch.push(header);

            // 4. commit_threshold(기본 10,000)에 도달하면 배치를 DB에 삽입
            //    MDBX 트랜잭션 한 번으로 묶어서 I/O 효율화
            if batch.len() >= self.commit_threshold {
                provider.insert_headers(batch.drain(..))?;
            }
        }
        // 5. 남은 헤더 삽입 + 체크포인트 저장
        //    크래시 후 재시작 시 end 블록부터 이어서 다운로드
        if !batch.is_empty() {
            provider.insert_headers(batch)?;
        }
        Ok(ExecOutput { checkpoint: StageCheckpoint::new(end), done: true })
    }
}
