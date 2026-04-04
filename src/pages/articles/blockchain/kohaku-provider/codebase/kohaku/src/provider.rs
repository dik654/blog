use alloy_primitives::{Address, Bytes, U256};
use anyhow::Result;

/// 통합 Provider trait — 각 구현체가 교체 가능
pub trait Provider {
    async fn get_balance(&self, address: Address) -> Result<U256>;
    async fn get_nonce(&self, address: Address) -> Result<u64>;
    async fn call(&self, tx: &TransactionRequest) -> Result<Bytes>;
}

/// Kohaku = Helios(검증) + ORAM(쿼리 프라이버시) + Dandelion(TX 프라이버시)
pub struct KohakuProvider {
    helios: HeliosClient,        // 상태 검증 (경량 클라이언트)
    oram: ORAMProxy,             // 쿼리 프라이버시 (ORAM 배치)
    dandelion: DandelionRouter,  // TX 프라이버시 (Dandelion++)
}

impl Provider for KohakuProvider {
    async fn get_balance(&self, address: Address) -> Result<U256> {
        // 1) ORAM으로 쿼리 — 서버가 어떤 주소를 조회하는지 알 수 없음
        let proof = self.oram.query(|| {
            self.helios.get_proof(address, &[], "latest")
        }).await?;
        // 2) Helios로 Merkle 증명 검증 — RPC 응답 위변조 불가
        let balance = verify_account_proof(&proof)?;
        Ok(balance)
    }

    async fn get_nonce(&self, address: Address) -> Result<u64> {
        let proof = self.oram.query(|| {
            self.helios.get_proof(address, &[], "latest")
        }).await?;
        Ok(verify_nonce_proof(&proof)?)
    }

    async fn call(&self, tx: &TransactionRequest) -> Result<Bytes> {
        // ProofDB 기반 로컬 EVM 실행 — 풀 노드 불필요
        self.helios.eth_call(tx, "latest").await
    }
}
