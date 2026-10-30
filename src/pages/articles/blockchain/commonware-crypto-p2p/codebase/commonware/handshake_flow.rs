// cryptography/src/handshake.rs · Commonware v2026.9.0
// 한국어 설명: Dialer는 현재 시각·상대 identity·임시 공개키를 transcript에 넣고 서명합니다.
pub fn dial_start<S: Signer, P: PublicKey>(
    rng: impl CryptoRng,
    ctx: Context<S, P>,
) -> (DialState<P>, Syn<<S as Signer>::Signature>) {
    let Context {
        current_time,
        ok_timestamps,
        my_identity,
        peer_identity,
        mut transcript,
    } = ctx;
    let esk = SecretKey::new(rng);
    let epk = esk.public();
    let sig = transcript
        .commit(current_time.encode())
        .commit(peer_identity.encode())
        .commit(epk.encode())
        .sign(&my_identity);
    transcript.commit(my_identity.public_key().encode());
    (
        DialState {
            esk,
            peer_identity,
            transcript,
            ok_timestamps,
        },
        Syn {
            time_ms: current_time,
            epk,
            sig,
        },
    )
}

// 한국어 설명: SynAck의 시각과 서명을 검증한 뒤 shared secret과 transcript에서 방향별 cipher를 만듭니다.
pub fn dial_end<P: PublicKey>(
    state: DialState<P>,
    msg: SynAck<<P as Verifier>::Signature>,
) -> Result<(Ack, SendCipher, RecvCipher), Error> {
    let DialState {
        esk,
        peer_identity,
        mut transcript,
        ok_timestamps,
    } = state;
    if !ok_timestamps.contains(&msg.time_ms) {
        return Err(Error::InvalidTimestamp(msg.time_ms, ok_timestamps));
    }
    if !transcript
        .commit(msg.time_ms.encode())
        .commit(msg.epk.encode())
        .verify(&peer_identity, &msg.sig)
    {
        return Err(Error::HandshakeFailed);
    }
    let Some(shared) = esk.exchange(&msg.epk) else {
        return Err(Error::HandshakeFailed);
    };
    shared
        .secret
        .expose(|secret| transcript.commit(secret.as_ref()));
    let recv = RecvCipher::new(transcript.noise(LABEL_CIPHER_L2D));
    let send = SendCipher::new(transcript.noise(LABEL_CIPHER_D2L));
    let confirmation_l2d = transcript.fork(LABEL_CONFIRMATION_L2D).summarize();
    let confirmation_d2l = transcript.fork(LABEL_CONFIRMATION_D2L).summarize();
    if msg.confirmation != confirmation_l2d {
        return Err(Error::HandshakeFailed);
    }

    // 한국어 설명: Dialer의 confirmation을 Ack에 넣고, 이 방향에 맞춘 send·recv cipher를 돌려줍니다.
    Ok((
        Ack {
            confirmation: confirmation_d2l,
        },
        send,
        recv,
    ))
}

// 한국어 설명: Listener는 마지막 Ack confirmation이 예상값과 같을 때만 연결용 cipher를 공개합니다.
pub fn listen_end(state: ListenState, msg: Ack) -> Result<(SendCipher, RecvCipher), Error> {
    if msg.confirmation != state.confirmation {
        return Err(Error::HandshakeFailed);
    }
    Ok((state.send, state.recv))
}
