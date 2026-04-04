// reth — Flashbots Relay 연동

/// Flashbots 릴레이 클라이언트
pub struct RelayClient {
    endpoint: Url,
    http: reqwest::Client,
    signing_key: SecretKey,
}

impl RelayClient {
    /// 검증자를 릴레이에 등록 (매 에폭마다)
    pub async fn register_validator(
        &self,
        registration: SignedValidatorRegistration,
    ) -> Result<()> {
        self.http.post(format!("{}/eth/v1/builder/validators", self.endpoint))
            .json(&[registration])
            .send().await?;
        Ok(())
    }

    /// 슬롯에 대한 최적 빌더 헤더(입찰) 요청
    pub async fn get_header(
        &self,
        slot: u64,
        parent_hash: B256,
        fee_recipient: Address,
    ) -> Result<SignedBuilderBid> {
        let url = format!(
            "{}/eth/v1/builder/header/{}/{}/{}",
            self.endpoint, slot, parent_hash, fee_recipient
        );
        let resp = self.http.get(&url).send().await?;
        resp.json::<SignedBuilderBid>().await.map_err(Into::into)
    }

    /// 선택된 빌더의 전체 페이로드(블록) 요청
    pub async fn get_payload(
        &self,
        signed_header: SignedBlindedBeaconBlock,
    ) -> Result<ExecutionPayload> {
        self.http.post(format!("{}/eth/v1/builder/blinded_blocks", self.endpoint))
            .json(&signed_header)
            .send().await?.json().await.map_err(Into::into)
    }
}
