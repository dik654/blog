// Reth v2.8.1 · crates/rpc/rpc-builder/src/config.rs
// 필요한 함수만 원문 그대로 발췌하고 `학습용 주석`을 덧붙였습니다.

fn transport_rpc_module_config(&self) -> TransportRpcModuleConfig {
    let mut config = TransportRpcModuleConfig::default()
        .with_config(RpcModuleConfig::new(self.eth_config()));

    // 학습용 주석: --http를 켠 transport에만 HTTP module 선택을 붙입니다.
    if self.http {
        config = config.with_http(
            self.http_api
                .clone()
                .unwrap_or_else(|| RpcModuleSelection::standard_modules().into()),
        );
    }

    // 학습용 주석: WS는 HTTP와 별도 선택을 가질 수 있습니다.
    if self.ws {
        config = config.with_ws(
            self.ws_api
                .clone()
                .unwrap_or_else(|| RpcModuleSelection::standard_modules().into()),
        );
    }

    if self.is_ipc_enabled() {
        config = config.with_ipc(RpcModuleSelection::default_ipc_modules());
    }

    config
}

fn auth_server_config(&self, jwt_secret: JwtSecret) -> Result<AuthServerConfig, RpcError> {
    // 학습용 주석: Engine API는 public HTTP 주소가 아니라 auth 전용 주소를 씁니다.
    let address = SocketAddr::new(self.auth_addr, self.auth_port);

    let mut builder = AuthServerConfig::builder(jwt_secret).socket_addr(address);
    if self.auth_ipc {
        builder = builder
            .ipc_endpoint(self.auth_ipc_path.clone())
            .with_ipc_config(self.ipc_server_builder());
    }
    Ok(builder.build())
}
