import type { CodeRef } from "@/components/code/types";

const NOISE_CONFIG = `impl<T> InboundConnectionUpgrade<T> for Config
where T: AsyncRead + AsyncWrite + Unpin + Send + 'static,
{
    type Output = (PeerId, Output<T>);
    type Error = Error;

    fn upgrade_inbound(self, socket: T, _: Self::Info) -> Self::Future {
        async move {
            let mut state = self.into_responder(socket)?;

            handshake::recv_empty(&mut state).await?;    // ← e
            handshake::send_identity(&mut state).await?;  // → e, ee, s, es + payload
            handshake::recv_identity(&mut state).await?;  // ← s, se + payload

            let (pk, io) = state.finish()?;
            Ok((pk.to_peer_id(), io))
        }.boxed()
    }
}

impl<T> OutboundConnectionUpgrade<T> for Config
where T: AsyncRead + AsyncWrite + Unpin + Send + 'static,
{
    type Output = (PeerId, Output<T>);
    type Error = Error;

    fn upgrade_outbound(self, socket: T, _: Self::Info) -> Self::Future {
        async move {
            let mut state = self.into_initiator(socket)?;

            handshake::send_empty(&mut state).await?;     // → e
            handshake::recv_identity(&mut state).await?;   // ← e, ee, s, es + payload
            handshake::send_identity(&mut state).await?;   // → s, se + payload

            let (pk, io) = state.finish()?;
            Ok((pk.to_peer_id(), io))
        }.boxed()
    }
}`;

const NOISE_FINISH = `pub(crate) fn finish(self) -> Result<(identity::PublicKey, Output<T>), Error> {
    let is_initiator = self.io.codec().is_initiator();
    let (pubkey, framed) = map_into_transport(self.io)?;

    let id_pk = self.id_remote_pubkey
        .ok_or_else(|| Error::AuthenticationFailed)?;

    // DH 공개키에 대한 libp2p ID 키 서명 검증
    let is_valid_signature = self.dh_remote_pubkey_sig.as_ref().is_some_and(|s| {
        id_pk.verify(&[STATIC_KEY_DOMAIN.as_bytes(), pubkey.as_ref()].concat(), s)
    });
    if !is_valid_signature {
        return Err(Error::BadSignature);
    }

    // WebTransport: 인증서 해시 검증 (initiator만)
    if is_initiator {
        if let Some(expected) = self.responder_webtransport_certhashes {
            let ext = self.remote_extensions.ok_or_else(|| {
                Error::UnknownWebTransportCerthashes(expected.clone(), HashSet::new())
            })?;
            // 기대한 certhash가 응답에 모두 포함되어야 함
            if !expected.is_subset(&ext.webtransport_certhashes) {
                return Err(Error::UnknownWebTransportCerthashes(
                    expected, ext.webtransport_certhashes,
                ));
            }
        }
    }

    Ok((id_pk, Output::new(framed)))
}`;

export const noiseCodeRefs: Record<string, CodeRef> = {
  "noise-config": {
    path: "transports/noise/src/lib.rs — Noise XX 핸드셰이크 업그레이드",
    code: NOISE_CONFIG,
    lang: "rust",
    highlight: [1, 44],
    annotations: [
      {
        lines: [13, 16],
        color: "sky",
        note: "Responder: recv_empty → send_identity → recv_identity",
      },
      {
        lines: [35, 38],
        color: "emerald",
        note: "Initiator: send_empty → recv_identity → send_identity",
      },
    ],
    desc: `Noise XX 3-way 핸드셰이크입니다. Inbound는 Responder, Outbound는 Initiator로 3단계 메시지 교환 후 finish()에서 서명 검증 + 암호화 스트림을 반환합니다.`,
  },
  "noise-handshake": {
    path: "transports/noise/src/io/handshake.rs — finish()",
    code: NOISE_FINISH,
    lang: "rust",
    highlight: [1, 34],
    annotations: [
      {
        lines: [8, 16],
        color: "sky",
        note: "서명 검증 — DH 공개키가 상대 libp2p ID 소유인지 확인",
      },
      {
        lines: [19, 30],
        color: "emerald",
        note: "WebTransport certhash — TLS 인증서 해시 교차 검증",
      },
    ],
    desc: `핸드셰이크 최종 검증입니다. STATIC_KEY_DOMAIN + DH 공개키 메시지에 대해 상대 ID 키로 서명을 검증하고, WebTransport에서는 TLS 인증서 해시가 기대값의 부분집합인지 추가 확인합니다.`,
  },
};
