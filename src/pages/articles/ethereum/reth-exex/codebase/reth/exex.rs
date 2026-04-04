// reth-exex — Execution Extensions

/// ExEx가 수신하는 알림 타입
pub enum ExExNotification {
    /// 새 체인이 커밋됨 (정상 블록 추가)
    ChainCommitted { new: Arc<Chain> },
    /// 체인 리오그 발생 (되돌림)
    ChainReverted { old: Arc<Chain> },
    /// 리오그 + 새 체인 (old → new 교체)
    ChainReorged { old: Arc<Chain>, new: Arc<Chain> },
}

/// ExEx 실행 컨텍스트 — 노드 내부 리소스 접근
pub struct ExExContext<Node: FullNodeComponents> {
    pub head: Head,
    pub config: NodeConfig,
    pub reth_config: reth_config::Config,
    pub provider: Node::Provider,
    pub pool: Node::Pool,
    pub notifications: ExExNotifications,
    pub events: EventSender,
}

/// ExExManager — 등록된 ExEx들에 알림을 fan-out
pub struct ExExManager {
    exex_handles: Vec<ExExHandle>,
    finished_height: watch::Sender<FinishedExExHeight>,
}

impl ExExManager {
    /// 파이프라인에서 블록 실행 후 호출
    pub fn send_notification(&self, notification: ExExNotification) {
        for handle in &self.exex_handles {
            let _ = handle.sender.send(notification.clone());
        }
    }

    /// 모든 ExEx가 처리 완료한 최소 블록 높이
    pub fn min_finished_height(&self) -> BlockNumber {
        self.exex_handles.iter()
            .map(|h| h.finished_height)
            .min().unwrap_or(0)
    }
}
