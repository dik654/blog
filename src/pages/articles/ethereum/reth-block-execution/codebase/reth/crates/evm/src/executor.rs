// reth-evm — BlockExecutor trait (reth v1.x)

/// 블록 하나를 실행하는 trait
pub trait BlockExecutor<DB: Database> {
    type Input<'a>;   // 블록 + 실행에 필요한 참조들
    type Output;      // 실행 결과 (receipts, requests 등)
    type Error;       // 실행/검증 에러

    /// 단일 블록 실행 + 결과 검증
    /// 블록 내 모든 TX를 순회하며 revm으로 실행
    fn execute_and_verify_one(
        &mut self,
        input: Self::Input<'_>,
    ) -> Result<Self::Output, Self::Error>;
}

/// 여러 블록을 누적 실행하는 BatchExecutor
/// ExecutionStage가 이 trait을 사용하여 블록 범위를 처리
pub trait BatchExecutor<DB: Database> {
    type Input<'a>;   // 단일 블록 입력
    type Output;      // finalize() 결과 = BundleState

    /// 블록 하나를 실행하고 결과를 내부에 누적
    /// Geth와 달리 매 블록 DB 커밋하지 않음
    fn execute_and_verify_one(
        &mut self,
        input: Self::Input<'_>,
    ) -> Result<(), BlockExecutionError>;

    /// 누적된 상태 변경을 BundleState로 반환
    /// 소유권 이전(self 소비) — 한 번만 호출 가능
    fn finalize(self) -> BundleState;
}

/// BundleState: 실행 결과 상태 변경 컨테이너
/// revm이 블록 실행 후 생성하는 인메모리 캐시
pub struct BundleState {
    /// 변경된 계정 — address → 잔액/nonce/코드/스토리지 변경
    pub state: HashMap<Address, BundleAccount>,
    /// 새로 배포된 컨트랙트 — code_hash → 바이트코드
    pub contracts: HashMap<B256, Bytecode>,
    /// 블록별 되돌리기 정보 — reorg 시 역순 적용
    pub reverts: Vec<Vec<(Address, AccountRevert)>>,
}

impl BundleState {
    /// DB에 상태 변경 기록
    /// AccountChangeSet, StorageChangeSet 테이블에 기록
    pub fn write_to_storage<P: StateWriter>(
        &self,
        provider: &P,
    ) -> Result<(), ProviderError> {
        for (addr, account) in &self.state {
            provider.write_account(*addr, account)?;
        }
        Ok(())
    }
}
