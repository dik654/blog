// Source: revm-precompile 43.0.3
// src/hash.rs (focused excerpt)

/// Computes the SHA-256 hash of the input data
pub fn sha256_run(input: &[u8], gas_limit: u64) -> EthPrecompileResult {
    let cost = calc_linear_cost(input.len(), 60, 12);
    if cost > gas_limit {
        Err(PrecompileHalt::OutOfGas)
    } else {
        let output = crypto().sha256(input);
        Ok(EthPrecompileOutput::new(cost, output.to_vec().into()))
    }
}
