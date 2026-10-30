// stream/src/encrypted.rs · Commonware v2026.9.0
// 한국어 설명: 현재 시각을 기준으로 오래된 handshake와 지나치게 미래인 handshake를 거를 범위를 만듭니다.
pub fn time_information(&self, ctx: &impl Clock) -> (u64, Range<u64>) {
    fn duration_to_u64(d: Duration) -> u64 {
        u64::try_from(d.as_millis()).expect("duration ms should fit in an u64")
    }
    let current_time_ms = duration_to_u64(ctx.current().epoch());
    let ok_timestamps = (current_time_ms
        .saturating_sub(duration_to_u64(self.max_handshake_age)))
        ..(current_time_ms.saturating_add(duration_to_u64(self.synchrony_bound)));
    (current_time_ms, ok_timestamps)
}

// stream/src/encrypted.rs · listen() 핵심 경로
// 한국어 설명: Listener는 상대가 보낸 static public key를 먼저 읽고 bouncer로 허용 여부를 결정합니다.
let peer = recv_handshake_frame::<S::PublicKey, _>(&mut stream).await?;
if !bouncer(peer.clone()).await {
    return Err(Error::PeerRejected(peer.encode().to_vec()));
}

// 한국어 설명: 허용된 peer의 Syn을 읽고 Context에 namespace·시각 범위·양쪽 identity를 넣어 검증합니다.
let msg1 = recv_handshake_frame::<Syn<S::Signature>, _>(&mut stream).await?;
let (current_time, ok_timestamps) = config.time_information(&ctx);
let (state, syn_ack) = listen_start(
    ctx,
    Context::new(
        &config.namespace,
        current_time,
        ok_timestamps,
        config.signing_key,
        peer.clone(),
    ),
    msg1,
)?;
send_frame(&mut sink, syn_ack.encode(), config.max_message_size).await?;

// 한국어 설명: 마지막 Ack까지 검증해야 peer identity와 encrypted sender·receiver를 반환합니다.
let ack = recv_handshake_frame::<Ack, _>(&mut stream).await?;
let (send, recv) = listen_end(state, ack)?;
Ok((peer, Sender { cipher: send, sink, max_message_size: config.max_message_size, pool: pool.clone() }, Receiver { cipher: recv, stream, max_message_size: config.max_message_size, pool }))
