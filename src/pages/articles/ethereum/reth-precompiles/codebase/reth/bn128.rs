// revm — bn128 프리컴파일 (순수 Rust 구현)

/// BN128 덧셈 (0x06) — 가스: 150
pub fn bn128_add(input: &Bytes, gas_limit: u64) -> PrecompileResult {
    const GAS_COST: u64 = 150;
    if gas_limit < GAS_COST {
        return Err(PrecompileError::OutOfGas);
    }
    let p1 = read_point(&input[..64])?;
    let p2 = read_point(&input[64..128])?;
    let result = p1 + p2;
    Ok(PrecompileOutput::new(GAS_COST, point_to_bytes(result)))
}

/// BN128 스칼라 곱셈 (0x07) — 가스: 6000
pub fn bn128_mul(input: &Bytes, gas_limit: u64) -> PrecompileResult {
    const GAS_COST: u64 = 6000;
    if gas_limit < GAS_COST {
        return Err(PrecompileError::OutOfGas);
    }
    let p = read_point(&input[..64])?;
    let scalar = U256::from_be_bytes::<32>(input[64..96].try_into()?);
    let result = p * scalar;
    Ok(PrecompileOutput::new(GAS_COST, point_to_bytes(result)))
}

/// BN128 페어링 (0x08) — zkSNARK 검증의 핵심
pub fn bn128_pairing(input: &Bytes, gas_limit: u64) -> PrecompileResult {
    let k = input.len() / 192;  // 입력 쌍 개수
    let gas_cost = 34_000 * k as u64 + 45_000;
    if gas_limit < gas_cost {
        return Err(PrecompileError::OutOfGas);
    }
    // 페어링 결과 = 1이면 true (32바이트)
    let success = run_pairing(input, k)?;
    Ok(PrecompileOutput::new(gas_cost, bool_to_bytes32(success)))
}
