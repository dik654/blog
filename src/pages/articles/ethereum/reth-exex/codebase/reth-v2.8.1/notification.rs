// Source excerpt: Reth v2.8.1
// crates/exex/types/src/notification.rs

pub enum ExExNotification<N: NodePrimitives> {
    // Canonical chain이 뒤집히지 않고 새 구간만 이어졌습니다.
    ChainCommitted { new: Arc<Chain<N>> },

    // 기존 canonical 구간과 이를 대신할 새 구간을 함께 보냅니다.
    ChainReorged {
        old: Arc<Chain<N>>,
        new: Arc<Chain<N>>,
    },

    // 기존 canonical 구간만 취소됐습니다.
    ChainReverted { old: Arc<Chain<N>> },
}

impl<N: NodePrimitives> ExExNotification<N> {
    pub fn committed_chain(&self) -> Option<Arc<Chain<N>>> {
        match self {
            Self::ChainCommitted { new } |
            Self::ChainReorged { old: _, new } => Some(new.clone()),
            Self::ChainReverted { .. } => None,
        }
    }

    pub fn reverted_chain(&self) -> Option<Arc<Chain<N>>> {
        match self {
            Self::ChainReorged { old, new: _ } |
            Self::ChainReverted { old } => Some(old.clone()),
            Self::ChainCommitted { .. } => None,
        }
    }
}
