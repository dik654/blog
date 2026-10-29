// Reth v2.8.1 · crates/rpc/rpc-builder/src/auth.rs
// 원문 server start 경로에 `학습용 주석`만 덧붙였습니다.

// 학습용 주석: JWT가 사용자 HTTP middleware보다 먼저 request를 감쌉니다.
let middleware =
    tower::ServiceBuilder::new().layer(AuthHttpLayer::new(secret, http_middleware));

let rpc_middleware = RpcServiceBuilder::default().layer(rpc_middleware);

// 학습용 주석: 인증을 통과한 request만 JSON-RPC module까지 전달됩니다.
let server = ServerBuilder::new()
    .set_config(server_config.build())
    .set_http_middleware(middleware)
    .set_rpc_middleware(rpc_middleware)
    .build(socket_addr)
    .await
    .map_err(|err| RpcError::server_error(err, ServerKind::Auth(socket_addr)))?;

let local_addr = server
    .local_addr()
    .map_err(|err| RpcError::server_error(err, ServerKind::Auth(socket_addr)))?;

let handle = server.start(module.inner.clone());
