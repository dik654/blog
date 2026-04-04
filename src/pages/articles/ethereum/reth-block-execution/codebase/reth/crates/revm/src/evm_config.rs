// reth-revm — EvmConfig trait (reth v1.x)

/// EVM 실행 환경 설정 trait
/// 체인별 구현체를 교체하여 환경 커스텀 가능
pub trait EvmConfig: Send + Sync + Unpin + Clone {
    type DefaultExternalContext<'a>; // 체인별 추가 컨텍스트

    /// 블록 환경 변수 설정 (헤더에서 추출)
    /// coinbase: 수수료 수취 주소
    /// basefee: EIP-1559 base fee
    /// prevrandao: Merge 이후 난수 소스
    fn fill_block_env(
        &self,
        block_env: &mut BlockEnv,
        header: &Header,
        after_merge: bool,  // PoS 전환 이후 여부
    ) {
        block_env.number = U256::from(header.number);
        block_env.coinbase = header.beneficiary;      // 수수료 수취인
        block_env.timestamp = U256::from(header.timestamp);
        block_env.gas_limit = U256::from(header.gas_limit);
        block_env.basefee = U256::from(
            header.base_fee_per_gas.unwrap_or(0) // EIP-1559 이전은 0
        );
        if after_merge {
            block_env.difficulty = U256::ZERO;           // PoS: 난이도 없음
            block_env.prevrandao = Some(header.mix_hash); // RANDAO 값
        }
    }

    /// TX 환경 변수 설정 (TX에서 추출)
    /// caller: ecrecover로 복구한 서명자 주소
    /// gas_price: effective_gas_price(basefee) 결과
    fn fill_tx_env(
        &self,
        tx_env: &mut TxEnv,
        tx: &TransactionSigned,
        sender: Address,  // ecrecover로 복구한 주소
    ) {
        tx_env.caller = sender;                   // 서명자 = 발신자
        tx_env.gas_limit = tx.gas_limit();        // TX가 사용할 최대 가스
        tx_env.value = tx.value();                // 전송 ETH 양
        tx_env.data = tx.input().clone();         // 컨트랙트 호출 데이터
        tx_env.nonce = Some(tx.nonce());          // 재사용 방지 넌스
        tx_env.gas_price = U256::from(
            tx.effective_gas_price(None) // basefee 적용 실효 가격
        );
    }
}
