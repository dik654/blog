// reth/crates/exex/exex/src/notification.rs + manager
// Live sync with ExEx — 새 블록 처리 후 확장 모듈에 이벤트 전파

use reth_primitives::{SealedBlockWithSenders, Receipt};
use tokio::sync::broadcast;

/// ExExNotification — 블록 실행 결과를 ExEx 확장에 전달하는 이벤트.
/// 인덱서, 브릿지, 분석 도구 등이 노드 내부에서 실시간 처리.
pub enum ExExNotification {
    /// 새 블록이 체인에 커밋됨
    ChainCommitted {
        new: Arc<Chain>,    // 커밋된 블록 + 상태 변경
    },
    /// 체인 reorg 발생 — 이전 체인 제거, 새 체인 추가
    ChainReorged {
        old: Arc<Chain>,    // 제거된 블록들
        new: Arc<Chain>,    // 새로 추가된 블록들
    },
    /// 블록이 되감기됨 (되돌리기)
    ChainReverted {
        old: Arc<Chain>,    // 되감긴 블록들
    },
}

/// ExExManager — ExEx 확장 모듈 생명주기 관리
pub struct ExExManager {
    /// 등록된 ExEx 확장 핸들 목록
    exex_handles: Vec<ExExHandle>,
    /// 알림 브로드캐스트 채널
    notification_tx: broadcast::Sender<ExExNotification>,
}

impl ExExManager {
    /// 블록 커밋 시 모든 ExEx에 알림 전파
    pub fn notify_commit(&self, chain: Arc<Chain>) {
        let _ = self.notification_tx.send(
            ExExNotification::ChainCommitted { new: chain }
        );
    }
}
