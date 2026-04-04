// reth-stages — BodiesStage::execute() (reth v1.x)
// HeadersStage 다음에 실행 — 헤더에 대응하는 블록 바디(TX 목록)를 다운로드

impl<Provider, Downloader> Stage<DB> for BodiesStage<Provider, Downloader>
where
    Provider: DBProvider + HeaderProvider + BlockBodyProvider,
    Downloader: BodyDownloader, // devp2p/eth로 피어에게 바디 요청
{
    fn id(&self) -> StageId { StageId::Bodies }

    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput> {
        // 1. 바디를 채울 범위: checkpoint+1 ~ target
        //    HeadersStage가 이미 이 범위의 헤더를 DB에 저장한 상태
        let (start, end) = input.next_block_range().into_inner();

        // 2. DB에서 헤더 로드 — 각 헤더의 tx_root를 바디 검증에 사용
        //    HeadersStage가 insert_headers()로 저장한 데이터
        let headers = provider.headers_range(start..=end)?;

        // 3. 피어에게 GetBlockBodies 요청 — 헤더 목록을 넘기면 매칭되는 바디 수신
        //    각 바디 = {transactions: Vec<TX>, ommers: Vec<Header>, withdrawals}
        let mut stream = self.downloader.stream_bodies(headers);

        let mut batch = Vec::new();
        while let Some((header, body)) = stream.next().await? {
            // 4. 무결성 검증: 바디의 TX 목록으로 머클 루트를 계산해서 헤더와 대조
            //    위조된 TX가 섞여 있으면 tx_root가 달라지므로 여기서 걸러짐
            let tx_root = body.calculate_tx_root();
            if tx_root != header.transactions_root {
                return Err(ConsensusError::BodyTransactionRootDiff);
            }
            batch.push((header, body));

            // 5. 배치 삽입 — MDBX 트랜잭션으로 묶어서 효율화
            if batch.len() >= self.commit_threshold {
                provider.insert_block_bodies(batch.drain(..))?;
            }
        }
        // 6. 남은 바디 삽입 + 체크포인트 저장
        if !batch.is_empty() {
            provider.insert_block_bodies(batch)?;
        }
        Ok(ExecOutput { checkpoint: StageCheckpoint::new(end), done: true })
    }
}
