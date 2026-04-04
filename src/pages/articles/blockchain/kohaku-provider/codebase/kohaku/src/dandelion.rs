use rand::Rng;
use std::time::{SystemTime, UNIX_EPOCH};

/// Dandelion++ 라우터 — TX 발신자 익명화
pub struct DandelionRouter {
    peers: Vec<Peer>,
    epoch_duration: u64,  // 초 단위 (기본 600)
}

impl DandelionRouter {
    /// Stem phase: 에폭 동안 고정된 단일 피어로 전달
    pub async fn send_stem(&self, tx: SignedTx) -> Result<()> {
        let epoch = SystemTime::now()
            .duration_since(UNIX_EPOCH)?.as_secs() / self.epoch_duration;
        let seed = keccak256(&epoch.to_le_bytes());
        let stem_peer = &self.peers[seed[0] as usize % self.peers.len()];
        stem_peer.send(StemMessage { tx, hop: 0 }).await
    }

    /// 릴레이 노드: hop 카운트에 따라 stem 계속 또는 fluff 전환
    pub async fn relay(&self, mut msg: StemMessage) -> Result<()> {
        msg.hop += 1;
        let threshold = thread_rng().gen_range(3..=5);
        if msg.hop >= threshold {
            // Fluff: 모든 피어에 가십 — 발신자 특정 불가
            for peer in &self.peers {
                peer.gossip(FluffMessage { tx: msg.tx.clone() }).await?;
            }
        } else {
            // Stem 계속: 다음 피어로 단일 전달
            let next = &self.peers[thread_rng().gen_range(0..self.peers.len())];
            next.send(msg).await?;
        }
        Ok(())
    }
}
