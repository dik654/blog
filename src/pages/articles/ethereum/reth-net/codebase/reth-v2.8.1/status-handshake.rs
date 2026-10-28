// Reth v2.8.1 · crates/net/eth-wire/src/handshake.rs
// Source excerpt from EthereumEthHandshake::eth_handshake at commit d763342f.
let their_msg_res = unauth.next().await;
let their_msg = match their_msg_res {
    Some(Ok(msg)) => msg,
    Some(Err(e)) => return Err(EthStreamError::from(e)),
    None => {
        unauth.disconnect(DisconnectReason::DisconnectRequested).await?;
        return Err(EthStreamError::EthHandshakeError(EthHandshakeError::NoResponse));
    }
};

if their_msg.len() > MAX_MESSAGE_SIZE {
    unauth.disconnect(DisconnectReason::ProtocolBreach).await?;
    return Err(EthStreamError::MessageTooBig(their_msg.len()));
}

let version = status.version();
let their_status_message =
    ProtocolMessage::<EthNetworkPrimitives>::decode_status(version, &mut their_msg.as_ref())?;

if status.genesis() != their_status_message.genesis() {
    unauth.disconnect(DisconnectReason::ProtocolBreach).await?;
    return Err(EthHandshakeError::MismatchedGenesis(
        GotExpected { expected: status.genesis(), got: their_status_message.genesis() }.into(),
    )
    .into());
}

if status.version() != their_status_message.version() {
    unauth.disconnect(DisconnectReason::ProtocolBreach).await?;
    return Err(EthHandshakeError::MismatchedProtocolVersion(GotExpected {
        got: their_status_message.version(),
        expected: status.version(),
    })
    .into());
}

if *status.chain() != *their_status_message.chain() {
    unauth.disconnect(DisconnectReason::ProtocolBreach).await?;
    return Err(EthHandshakeError::MismatchedChain(GotExpected {
        got: *their_status_message.chain(),
        expected: *status.chain(),
    })
    .into());
}

fork_filter
    .validate(their_status_message.forkid())
    .map_err(EthHandshakeError::InvalidFork)?;

Ok(UnifiedStatus::from_message(their_status_message))
