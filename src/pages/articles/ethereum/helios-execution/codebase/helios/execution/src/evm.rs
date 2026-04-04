use revm::{
    db::ProofDB, primitives::*, Evm,
};
use ethers::types::{
    Address, H256, U256, Bytes,
};

// 본문 대응: Step0 — EvmProvider 구조체, RPC 클라이언트 + 블록 태그 보유
pub struct EvmProvider {
    rpc: RpcClient,   // RPC 엔드포인트 (Alchemy, Infura 등)
    block: BlockTag,  // latest, finalized, 또는 특정 블록 번호
}

impl EvmProvider {
    // 본문 대응: Step0 — call() 전체 흐름
    // ProofDB 생성 → revm 빌드 → transact() → output 추출
    pub async fn call(
        &self, tx: &CallRequest,
    ) -> Result<Bytes> {
        // 본문 대응: Step1 — ProofDB가 lazy proof loading 담당
        // EVM이 주소에 접근할 때마다 get_proof 요청, 캐시 저장
        let db = ProofDB::new(
            &self.rpc, self.block,
        );
        // 본문 대응: Step0 — revm 빌더 패턴
        // with_db(db)로 ProofDB 주입, with_tx_env로 트랜잭션 설정
        let mut evm = Evm::builder()
            .with_db(db)
            .with_tx_env(tx.into())
            .build();
        // 본문 대응: Step0 — EVM 로컬 실행
        // Reth와 동일한 revm 엔진, DB 레이어만 다름
        let result = evm.transact()?;
        Ok(result.output())
    }

    // 본문 대응: Step2 — estimate_gas() = call() + 10% 안전 마진
    // 블록 간 상태 변동(nonce, balance)으로 예측과 실제 가스가 달라질 수 있음
    pub async fn estimate_gas(
        &self, tx: &CallRequest,
    ) -> Result<u64> {
        // call()과 동일한 ProofDB + revm 경로
        let db = ProofDB::new(
            &self.rpc, self.block,
        );
        let mut evm = Evm::builder()
            .with_db(db)
            .with_tx_env(tx.into())
            .build();
        let result = evm.transact()?;
        // 본문 대응: Step2 — gas_used에 10% 마진 추가
        // estimate 시점 != 실행 시점, 상태 변동 흡수용
        let gas = result.gas_used();
        let with_margin = gas + gas / 10; // +10%
        Ok(with_margin)
    }
}
