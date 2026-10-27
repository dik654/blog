pub fn calc_next_block_base_fee(
    gas_used: u64,
    gas_limit: u64,
    base_fee: u64,
    base_fee_params: BaseFeeParams,
) -> u64 {
    let elasticity = base_fee_params.elasticity_multiplier;
    let max_change_denominator = base_fee_params.max_change_denominator;

    if elasticity == 0 || max_change_denominator == 0 {
        return base_fee;
    }

    let gas_target = (gas_limit as u128 / elasticity) as u64;

    if gas_target == 0 {
        return base_fee;
    }

    match gas_used.cmp(&gas_target) {
        core::cmp::Ordering::Equal => base_fee,
        core::cmp::Ordering::Greater => {
            base_fee
                + (core::cmp::max(
                    1,
                    base_fee as u128 * (gas_used - gas_target) as u128
                        / (gas_target as u128 * base_fee_params.max_change_denominator),
                ) as u64)
        }
        core::cmp::Ordering::Less => {
            base_fee.saturating_sub(
                (base_fee as u128 * (gas_target - gas_used) as u128
                    / (gas_target as u128 * base_fee_params.max_change_denominator))
                    as u64,
            )
        }
    }
}
