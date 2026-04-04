import type { CodeRef } from '@/components/code/types';

export const protocolRefs: Record<string, CodeRef> = {
  'protocol-handler': {
    path: 'iroh/iroh/src/protocol.rs',
    lang: 'rust',
    highlight: [1, 14],
    desc: 'ProtocolHandler는 모든 iroh 프로토콜의 핵심 트레이트입니다.\non_accepting()으로 0-RTT 등 조기 처리가 가능하고,\naccept()에서 실제 연결 로직을 구현합니다. 각 연결은 독립 tokio 태스크에서 실행됩니다.',
    code: `pub trait ProtocolHandler: Send + Sync + Debug + 'static {
    /// 선택적: Accepting 상태에서 0-RTT 등 조기 처리
    fn on_accepting(
        &self, accepting: Accepting,
    ) -> impl Future<Output = Result<Connection, AcceptError>> + Send {
        async move {
            let conn = accepting.await?;
            Ok(conn)
        }
    }

    /// 필수: 실제 연결 처리 (별도 tokio 태스크에서 실행)
    fn accept(
        &self, connection: Connection,
    ) -> impl Future<Output = Result<(), AcceptError>> + Send;

    /// 라우터 종료 시 정리 작업
    fn shutdown(&self) -> impl Future<Output = ()> + Send {
        async {}
    }
}`,
    annotations: [
      { lines: [2, 10] as [number, number], color: 'sky' as const, note: 'on_accepting: 0-RTT 조기 처리 지점' },
      { lines: [12, 15] as [number, number], color: 'emerald' as const, note: 'accept: 핵심 연결 핸들러 (필수 구현)' },
      { lines: [17, 20] as [number, number], color: 'amber' as const, note: 'shutdown: 그레이스풀 종료' },
    ],
  },
  'router-accept-loop': {
    path: 'iroh/iroh/src/protocol.rs',
    lang: 'rust',
    highlight: [3, 15],
    desc: 'Router의 accept 루프입니다. endpoint.accept()로 들어오는 연결을 받아\nALPN을 확인하고 등록된 핸들러로 라우팅합니다.\n각 연결은 CancellationToken으로 관리되는 독립 태스크에서 처리됩니다.',
    code: `// Router::spawn() 내부 — accept 루프
let run_loop_fut = async move {
    let handler_cancel_token = CancellationToken::new();
    loop {
        tokio::select! {
            biased;
            _ = cancel_token.cancelled() => { break; },
            // incoming 연결 수락 → ALPN 기반 라우팅
            incoming = endpoint.accept() => {
                let Some(incoming) = incoming else { break; };
                let protocols = protocols.clone();
                let token = handler_cancel_token.child_token();
                join_set.spawn(async move {
                    token.run_until_cancelled(
                        handle_connection(incoming, protocols)
                    ).await
                });
            },
        }
    }
    // 종료 순서: shutdown() → cancel accept tasks → close endpoint
    protocols.shutdown().await;
    handler_cancel_token.cancel();
    endpoint.close().await;
};`,
    annotations: [
      { lines: [5, 7] as [number, number], color: 'sky' as const, note: 'biased select: cancel 우선 체크' },
      { lines: [9, 17] as [number, number], color: 'emerald' as const, note: '연결 수락 → child_token으로 독립 태스크 생성' },
      { lines: [21, 24] as [number, number], color: 'amber' as const, note: '그레이스풀 셧다운 순서' },
    ],
  },
};
