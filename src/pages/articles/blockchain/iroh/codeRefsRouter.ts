import type { CodeRef } from '@/components/code/types';

export const routerRefs: Record<string, CodeRef> = {
  'handle-connection': {
    path: 'iroh/iroh/src/protocol.rs',
    lang: 'rust',
    highlight: [1, 18],
    desc: '개별 연결 처리 함수입니다. incoming → accept → ALPN 추출 → 핸들러 조회 순서로\n진행됩니다. ALPN은 TLS 핸드셰이크 중 협상되므로 핸드셰이크 전에는 알 수 없습니다.',
    code: `async fn handle_connection(
    incoming: Incoming, protocols: Arc<ProtocolMap>,
) {
    // 1) QUIC 연결 수락
    let mut accepting = match incoming.accept() {
        Ok(conn) => conn,
        Err(err) => { warn!("accepting failed: {err:#}"); return; }
    };
    // 2) TLS 핸드셰이크 중 ALPN 프로토콜 식별
    let alpn = match accepting.alpn().await {
        Ok(alpn) => alpn,
        Err(err) => { warn!("invalid handshake: {err:#}"); return; }
    };
    // 3) ALPN으로 등록된 핸들러 조회
    let Some(handler) = protocols.get(&alpn) else {
        warn!("unsupported ALPN protocol"); return;
    };
    // 4) on_accepting → accept 순서로 핸들러 실행
    match handler.on_accepting(accepting).await {
        Ok(connection) => {
            if let Err(err) = handler.accept(connection).await {
                warn!("connection ended with error: {err}");
            }
        }
        Err(err) => warn!("accepting ended with error: {err}"),
    }
}`,
    annotations: [
      { lines: [5, 8] as [number, number], color: 'sky' as const, note: 'QUIC 연결 수락 (Incoming → Accepting)' },
      { lines: [10, 13] as [number, number], color: 'emerald' as const, note: 'TLS 핸드셰이크에서 ALPN 추출' },
      { lines: [15, 17] as [number, number], color: 'amber' as const, note: 'ALPN → ProtocolMap에서 핸들러 조회' },
      { lines: [19, 25] as [number, number], color: 'violet' as const, note: 'on_accepting → accept 파이프라인' },
    ],
  },
};
