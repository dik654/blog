// reth-basic-payload-builder — BasicPayloadBuilder (reth v1.x)

impl<Client, Pool, Tasks, Builder> PayloadBuilder<Pool, Client>
    for BasicPayloadJobGenerator<Client, Pool, Tasks, Builder>
where
    Builder: PayloadBuilder<Pool, Client>,
{
    fn build_payload(
        &self,
        args: BuildArguments<Pool, Client>,
    ) -> Result<BuildOutcome, PayloadBuilderError> {
        let mut cumulative_gas = 0u64;          // 현재까지 사용한 가스 합계
        let block_gas_limit = args.config.attributes.gas_limit; // 블록 가스 상한
        let base_fee = args.config.attributes.base_fee(); // 현재 base fee

        // TX 풀에서 best 트랜잭션 가져오기
        // effective_tip 내림차순 정렬된 이터레이터
        let mut best_txs = args.pool.best_transactions_with_attributes(
            BestTransactionsAttributes::new(base_fee, None),
        );

        let mut executed_txs = Vec::new();        // 실행 성공한 TX 목록
        let mut bundle_state = BundleState::default(); // 상태 변경 누적

        // 가스 한도까지 TX 채우기 (greedy 알고리즘)
        while let Some(pool_tx) = best_txs.next() {
            let tx = pool_tx.to_recovered_transaction();

            // 가스 한도 초과 검사 — 넘으면 이 TX 건너뜀
            if cumulative_gas + tx.gas_limit() > block_gas_limit {
                best_txs.mark_invalid(&pool_tx); // 풀에 "이 TX는 안 맞음" 알림
                continue;
            }

            // revm으로 TX 실행 — 실패 시 다음 TX로
            let result = executor.execute_transaction(tx)?;
            cumulative_gas += result.gas_used(); // 실제 사용 가스 누적
            executed_txs.push(tx);               // 성공 TX 기록
        }

        // 실행된 TX + 상태 변경을 BuiltPayload로 패킹
        Ok(BuildOutcome::Better {
            payload: BuiltPayload::new(executed_txs, bundle_state),
        })
    }
}
