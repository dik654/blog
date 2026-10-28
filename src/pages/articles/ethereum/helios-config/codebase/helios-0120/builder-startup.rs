    pub fn build(self) -> Result<EthereumClient> {
        let base_config = if let Some(network) = self.network {
            network.to_base_config()
        } else {
            let config = self
                .config
                .as_ref()
                .ok_or(eyre!("missing network config"))?;
            config.to_base_config()
        };

        let consensus_rpc = self
            .consensus_rpc
            .or_else(|| self.config.as_ref().map(|c| c.consensus_rpc.clone()))
            .or(base_config.consensus_rpc)
            .ok_or_else(|| eyre!("missing consensus rpc"))?;

        let execution_rpc = self
            .execution_rpc
            .or_else(|| self.config.as_ref().and_then(|c| c.execution_rpc.clone()))
            .or(base_config.execution_rpc);

        let verifiable_api = self
            .verifiable_api
            .or_else(|| self.config.as_ref().and_then(|c| c.verifiable_api.clone()));

        let checkpoint = if let Some(checkpoint) = self.checkpoint {
            Some(checkpoint)
        } else if let Some(config) = &self.config {
            config.checkpoint
        } else {
            None
        };

        let default_checkpoint = if let Some(config) = &self.config {
            config.default_checkpoint
        } else {
            base_config.default_checkpoint
        };

        #[cfg(not(target_arch = "wasm32"))]
        let data_dir = if self.data_dir.is_some() {
            self.data_dir
        } else if let Some(config) = &self.config {
            config.data_dir.clone()
        } else {
            None
        };

        #[cfg(not(target_arch = "wasm32"))]
        let rpc_address = if let Some(addr) = self.rpc_address {
            Some(addr)
        } else if let Some(config) = &self.config {
            config
                .rpc_bind_ip
                .zip(config.rpc_port)
                .map(|(addr, port)| SocketAddr::new(addr, port))
        } else {
            None
        };

        let fallback = if self.fallback.is_some() {
            self.fallback
        } else if let Some(config) = &self.config {
            config.fallback.clone()
        } else {
            None
        };

        let load_external_fallback = if let Some(config) = &self.config {
            self.load_external_fallback || config.load_external_fallback
        } else {
            self.load_external_fallback
        };

        let strict_checkpoint_age = if let Some(config) = &self.config {
            self.strict_checkpoint_age || config.strict_checkpoint_age
        } else {
            self.strict_checkpoint_age
        };

        let database_type = if let Some(config) = &self.config {
            config.database_type.clone()
        } else {
            None
        };

        let config = Config {
            consensus_rpc,
            execution_rpc,
            verifiable_api,
            checkpoint,
            default_checkpoint,
            rpc_bind_ip: None,
            rpc_port: None,
            #[cfg(not(target_arch = "wasm32"))]
            data_dir,
            #[cfg(target_arch = "wasm32")]
            data_dir: None,
            chain: base_config.chain,
            forks: base_config.forks,
            execution_forks: base_config.execution_forks,
            max_checkpoint_age: base_config.max_checkpoint_age,
            fallback,
            load_external_fallback,
            strict_checkpoint_age,
            database_type,
        };

        let config = Arc::new(config);
        let consensus = ConsensusClient::<MainnetConsensusSpec, HttpRpc, DB>::new(
            &config.consensus_rpc,
            config.clone(),
        )?;

        if let Some(verifiable_api) = &config.verifiable_api {
            let block_provider = BlockCache::<Ethereum>::new();
            // Create EIP-2935 historical block provider
            let historical_provider = Eip2935Provider::new();
            let execution = VerifiableApiExecutionProvider::with_historical_provider(
                verifiable_api,
                block_provider,
                historical_provider,
            );
            let execution = CachingProvider::new(execution);

