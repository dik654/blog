// reth — MEV PayloadBuilder

/// MEV 빌더 — 외부 빌더와 로컬 빌드 비교
pub struct MevPayloadBuilder<Inner> {
    inner: Inner,
    relay_client: RelayClient,
    config: MevConfig,
}

impl<Inner: PayloadBuilder> PayloadBuilder for MevPayloadBuilder<Inner> {
    /// 페이로드 빌드 — 외부 빌더 입찰과 로컬 빌드 비교
    async fn build_payload(
        &self,
        args: BuildArguments,
    ) -> Result<PayloadBuilderOutput> {
        // 1. 로컬 블록 빌드 (fallback)
        let local = self.inner.build_payload(args.clone()).await?;
        let local_value = local.fees();

        // 2. 외부 빌더에서 최적 입찰 요청
        let external = self.relay_client
            .get_header(args.slot, args.parent_hash, args.fee_recipient)
            .await;

        match external {
            Ok(bid) if bid.value > local_value => {
                // 외부 빌더가 더 높은 가치 → 외부 블록 채택
                Ok(PayloadBuilderOutput::from_bid(bid))
            }
            _ => {
                // 로컬이 더 높거나 외부 실패 → 로컬 fallback
                Ok(local)
            }
        }
    }
}
