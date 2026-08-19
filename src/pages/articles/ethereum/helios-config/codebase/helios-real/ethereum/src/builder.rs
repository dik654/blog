// a16z/helios 저장소 · ethereum/src/builder.rs (main branch, commit
// 43a8c9f, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 313줄 중 build()의
// field-resolution 부분만 발췌했습니다. consensus/execution provider
// 조립과 Store 초기화 뒷부분은 생략했습니다.
// 본문 대응: client-init section의 "EthereumClientBuilder::build()는
// network 또는 custom config에서 base fields를 정하고, explicit builder
// 값이 있으면 endpoint, checkpoint, data directory와 bind address를
// 덮어쓴 뒤 조립한다".

impl<DB: Database> EthereumClientBuilder<DB> {
    pub fn build(self) -> Result<EthereumClient> {
        // article의 "network 또는 custom config에서 base fields를 정하고"
        let base_config = if let Some(network) = self.network {
            network.to_base_config()
        } else {
            let config = self.config.as_ref().ok_or(eyre!("missing network config"))?;
            config.to_base_config()
        };

        // article의 "explicit builder 값이 있으면... endpoint를 덮어쓴다"
        // — self.consensus_rpc(explicit builder 값)가 없을 때만 config
        // fallback을 쓴다. unwrap_or_else 패턴이 이 우선순위를 만든다.
        let consensus_rpc = self.consensus_rpc.unwrap_or_else(|| {
            self.config.as_ref().expect("missing consensus rpc").consensus_rpc.clone()
        });

        let execution_rpc = self
            .execution_rpc
            .or_else(|| self.config.as_ref().and_then(|c| c.execution_rpc.clone()));

        // article의 "checkpoint를 덮어쓴다" — explicit builder checkpoint
        // 우선, 없으면 config, 그마저 없으면 None
        let checkpoint = if let Some(checkpoint) = self.checkpoint {
            Some(checkpoint)
        } else if let Some(config) = &self.config {
            config.checkpoint
        } else {
            None
        };

        // article의 "data directory를 덮어쓴다"
        #[cfg(not(target_arch = "wasm32"))]
        let data_dir = if self.data_dir.is_some() {
            self.data_dir
        } else if let Some(config) = &self.config {
            config.data_dir.clone()
        } else {
            None
        };

        // article의 "bind address를 덮어쓴다"
        #[cfg(not(target_arch = "wasm32"))]
        let rpc_address = if let Some(addr) = self.rpc_address {
            Some(addr)
        } else if let Some(config) = &self.config {
            config.rpc_bind_ip.zip(config.rpc_port).map(|(addr, port)| SocketAddr::new(addr, port))
        } else {
            None
        };

        // ... consensus client·execution provider 조립, Store 초기화는
        // 생략. article의 "여기까지는 construction이며 verified head를
        // 확보했다는 뜻이 아니다"가 정확히 이 지점을 가리킨다 ...
    }
}
