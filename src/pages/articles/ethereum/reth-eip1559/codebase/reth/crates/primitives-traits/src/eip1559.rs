// reth-primitives-traits — EIP-1559 base fee 계산 (reth v1.x)

/// 다음 블록의 base fee를 계산한다.
/// u128 산술로 오버플로 없이 처리 (Geth의 big.Int 대비 힙 할당 없음)
pub fn calc_next_block_base_fee(
    gas_used: u64,    // 이전 블록의 가스 사용량
    gas_limit: u64,   // 이전 블록의 가스 한도
    base_fee: u64,    // 이전 블록의 base fee
    base_fee_params: BaseFeeParams, // elasticity(2), denominator(8)
) -> u64 {
    // gas_target = gas_limit / elasticity → 가스 사용 목표 (보통 50%)
    let gas_target = gas_limit / base_fee_params.elasticity_multiplier;

    if gas_used == gas_target {
        // 목표 정확히 일치 → base fee 유지
        return base_fee;
    }

    if gas_used > gas_target {
        // 목표 초과 → base fee 인상
        let gas_used_delta = gas_used - gas_target; // 초과 가스량
        let base_fee_delta = std::cmp::max(
            // u128 캐스팅: base_fee × delta가 u64 범위 초과 가능
            (base_fee as u128 * gas_used_delta as u128
                / gas_target as u128
                / base_fee_params.base_fee_change_denominator as u128) as u64,
            1, // 최소 1 wei 증가 보장 — 0 변동 방지
        );
        base_fee + base_fee_delta
    } else {
        // 목표 미달 → base fee 인하
        let gas_used_delta = gas_target - gas_used; // 미달 가스량
        let base_fee_delta =
            (base_fee as u128 * gas_used_delta as u128
                / gas_target as u128
                / base_fee_params.base_fee_change_denominator as u128) as u64;
        // saturating_sub: 0 이하로 내려가지 않도록 보호
        base_fee.saturating_sub(base_fee_delta)
    }
}
