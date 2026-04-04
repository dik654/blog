// reth-primitives-traits — effective_tip_per_gas (reth v1.x)

impl Transaction {
    /// 실효 팁(priority fee) 계산
    /// = min(max_priority_fee_per_gas, max_fee_per_gas - base_fee)
    /// TX 풀의 CoinbaseTipOrdering이 이 함수로 우선순위 결정
    pub fn effective_tip_per_gas(&self, base_fee: Option<u64>) -> Option<u64> {
        let base_fee = base_fee?; // base_fee 없으면 None

        // max_fee가 base_fee보다 작으면 유효하지 않은 TX
        // → BaseFee 서브풀에서 base fee 하락 대기
        let max_fee = self.max_fee_per_gas();
        if max_fee < base_fee as u128 {
            return None; // 현재 블록에 포함 불가
        }

        // EIP-1559 TX: min(priority_fee, max_fee - base_fee)
        // 사용자가 설정한 한도 내에서 실효 팁 결정
        let priority_fee = self.max_priority_fee_per_gas().unwrap_or(0);
        let effective_max_fee = max_fee - base_fee as u128;
        Some(std::cmp::min(priority_fee, effective_max_fee as u64))
    }

    /// Legacy TX: gas_price - base_fee가 곧 tip
    /// EIP-1559 이전 TX도 동일한 인터페이스로 처리
    pub fn effective_gas_price(&self, base_fee: Option<u64>) -> u128 {
        match base_fee {
            Some(base_fee) => {
                // tip + base_fee = 실효 가스 가격
                self.effective_tip_per_gas(Some(base_fee))
                    .map(|tip| tip as u128 + base_fee as u128)
                    .unwrap_or(self.gas_price()) // 계산 불가 시 원래 가격
            }
            None => self.gas_price(), // base_fee 없는 환경
        }
    }
}
