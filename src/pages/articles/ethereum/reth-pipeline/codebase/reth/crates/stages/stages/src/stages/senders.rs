// reth-stages — SendersStage::execute() (reth v1.x)
// BodiesStage 다음에 실행 — TX 서명에서 sender 주소를 복구
// 이유: 이더리움 TX에는 sender가 명시되지 않음 → 서명에서 역산해야 함

impl<Provider> Stage<DB> for SendersStage<Provider>
where Provider: DBProvider + TransactionProvider,
{
    fn id(&self) -> StageId { StageId::SenderRecovery }

    fn execute(&mut self, provider: &Provider, input: ExecInput) -> Result<ExecOutput> {
        // 1. 범위 결정: checkpoint+1 ~ target
        //    BodiesStage가 이 범위의 TX를 이미 DB에 저장한 상태
        let (start, end) = input.next_block_range().into_inner();

        // 2. DB에서 TX 서명 로드 — BodiesStage가 insert_block_bodies()로 저장한 데이터
        //    각 TX에는 (v, r, s) ECDSA 서명이 포함
        let transactions = provider.transactions_by_block_range(start..=end)?;

        // 3. rayon par_iter로 멀티코어 병렬 ecrecover 실행
        //    secp256k1 서명 복구: (v, r, s) + tx_hash → sender 공개키 → 주소
        //    CPU 집약적 작업이라 병렬화 효과가 큼 (10만 TX → 수초)
        let senders: Vec<Address> = transactions
            .par_iter()
            .map(|tx| {
                tx.recover_signer()
                    .ok_or(StageError::SenderRecoveryFailed)
            })
            .collect::<Result<Vec<_>>>()?;

        // 4. 복구된 sender 주소를 DB TxSenders 테이블에 저장
        //    ExecutionStage에서 msg.sender 조회 시 이 데이터 사용
        provider.insert_transaction_senders(
            start,
            transactions.iter().map(|tx| tx.hash()),
            senders,
        )?;

        Ok(ExecOutput { checkpoint: StageCheckpoint::new(end), done: true })
    }
}
