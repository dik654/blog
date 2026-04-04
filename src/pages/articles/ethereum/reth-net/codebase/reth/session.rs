// reth/crates/net/network/src/session/mod.rs
// SessionManager — TCP 세션 관리, RLPx 핸드셰이크, 라이프사이클

use reth_primitives::PeerId;
use tokio::net::TcpStream;
use tokio::sync::mpsc;

/// SessionManager — 모든 피어 세션을 관리하는 중앙 매니저.
/// tokio 비동기 런타임 위에서 수천 개 세션을 단일 스레드로 처리.
pub struct SessionManager {
    /// 활성 세션 맵 (PeerId → 세션 핸들)
    active_sessions: HashMap<PeerId, SessionHandle>,
    /// 보류 중인 세션 (핸드셰이크 진행 중)
    pending_sessions: HashMap<PeerId, PendingSession>,
    /// 세션 이벤트 수신 채널
    session_rx: mpsc::Receiver<SessionEvent>,
    /// 최대 동시 세션 수
    max_sessions: usize,
    /// RLPx 비밀키 (ECIES 핸드셰이크용)
    secret_key: SecretKey,
}

/// 세션 이벤트 — 연결/해제/메시지 수신
pub enum SessionEvent {
    /// RLPx 핸드셰이크 완료, 세션 활성화
    SessionEstablished { peer_id: PeerId, capabilities: Vec<Cap> },
    /// 세션 종료 (정상 또는 에러)
    SessionClosed { peer_id: PeerId, reason: Option<DisconnectReason> },
    /// eth-wire 메시지 수신
    IncomingMessage { peer_id: PeerId, message: EthMessage },
}

impl SessionManager {
    /// 새 아웃바운드 연결 시작 → RLPx 핸드셰이크 → 세션 등록
    pub async fn dial(&mut self, peer_id: PeerId, addr: SocketAddr) {
        let stream = TcpStream::connect(addr).await.unwrap();
        // 1. ECIES 핸드셰이크 (auth → ack → 프레임 암호화 키 공유)
        // 2. Hello 메시지 교환 (프로토콜 버전, capabilities)
        // 3. 활성 세션으로 등록
        todo!()
    }
}
