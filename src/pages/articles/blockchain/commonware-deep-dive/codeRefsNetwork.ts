import type { CodeRef } from './codeRefsTypes';

export const networkCodeRef: Record<string, CodeRef> = {
  'network-trait': {
    path: 'commonware/runtime/src/lib.rs — Network trait',
    lang: 'rust',
    highlight: [1, 16],
    desc: 'Network — TCP 연결 추상화 trait.\nbind()로 리스너 생성, dial()로 상대 연결.\nListener → accept() → (Sink, Stream) 쌍 반환.',
    code: `/// Interface that any runtime must implement
/// to create network connections.
pub trait Network: Clone + Send + Sync + 'static {
    /// The type of Listener returned when binding.
    /// Accepting returns a Sink and Stream used
    /// to send and receive data.
    type Listener: Listener;

    /// Bind to the given socket address.
    fn bind(&self, socket: SocketAddr)
        -> impl Future<Output = Result<
            Self::Listener, Error
        >> + Send;

    /// Dial the given socket address.
    fn dial(&self, socket: SocketAddr)
        -> impl Future<Output = Result<
            (SinkOf<Self>, StreamOf<Self>), Error
        >> + Send;
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'Clone + Send + Sync — 여러 태스크에서 동시에 연결 가능' },
      { lines: [7, 7], color: 'emerald', note: 'Listener — accept()로 (SocketAddr, Sink, Stream) 튜플 반환' },
      { lines: [10, 13], color: 'amber', note: 'bind() — deterministic에서는 가상 네트워크, tokio에서는 실제 TCP' },
      { lines: [16, 19], color: 'violet', note: 'dial() — SinkOf/StreamOf 타입 별칭으로 Listener에서 Sink/Stream 추출' },
    ],
  },
};
