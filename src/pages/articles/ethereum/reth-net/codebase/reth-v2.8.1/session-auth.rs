// Reth v2.8.1 · crates/net/network/src/session/mod.rs
// Source excerpts from authenticate_stream at commit d763342fa185e4e90ee79dc65f6a5706168b0bcb.
let authenticated_peer_id = stream.inner().remote_id();

let (mut p2p_stream, their_hello) = match stream.handshake(hello).await {
    Ok(stream_res) => stream_res,
    Err(err) => {
        return PendingSessionEvent::Disconnected {
            remote_addr,
            session_id,
            direction,
            error: Some(PendingSessionHandshakeError::Eth(err.into())),
        }
    }
};

// ECIES proved possession of this key. Hello may not rename the connection.
if their_hello.id != authenticated_peer_id {
    let _ = p2p_stream.disconnect(DisconnectReason::UnexpectedHandshakeIdentity).await;
    return PendingSessionEvent::Disconnected {
        remote_addr,
        session_id,
        direction,
        error: Some(PendingSessionHandshakeError::UnexpectedHandshakeIdentity(
            GotExpected { got: their_hello.id, expected: authenticated_peer_id }.into(),
        )),
    }
}

let eth_version = match p2p_stream.shared_capabilities().eth_version() {
    Ok(version) => version,
    Err(err) => {
        return PendingSessionEvent::Disconnected {
            remote_addr,
            session_id,
            direction,
            error: Some(PendingSessionHandshakeError::Eth(err.into())),
        }
    }
};

status.set_eth_version(eth_version);

// After the ETH Status handshake succeeds, the pending session can be established.
PendingSessionEvent::Established {
    session_id,
    remote_addr,
    local_addr,
    peer_id: authenticated_peer_id,
    capabilities: Arc::new(Capabilities::from(their_hello.capabilities)),
    status: Arc::new(their_status),
    conn,
    direction,
    client_id: their_hello.client_version,
    peer_listen_port,
}
