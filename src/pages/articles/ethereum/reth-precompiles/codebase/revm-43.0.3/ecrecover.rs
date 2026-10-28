// Source: revm-precompile 43.0.3
// src/secp256k1.rs (focused excerpt)

pub fn ec_recover_run(input: &[u8], gas_limit: u64) -> EthPrecompileResult {
    const ECRECOVER_BASE: u64 = 3_000;

    if ECRECOVER_BASE > gas_limit {
        return Err(PrecompileHalt::OutOfGas);
    }

    let input = right_pad::<128>(input);

    // `v` must be a 32-byte big-endian integer equal to 27 or 28.
    if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
        return Ok(EthPrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
    }

    let msg = <&B256>::try_from(&input[0..32]).unwrap();
    let recid = input[63] - 27;
    let sig = <&B512>::try_from(&input[64..128]).unwrap();

    let res = crypto().secp256k1_ecrecover(&sig.0, recid, &msg.0).ok();
    let out = res.map(|o| o.to_vec().into()).unwrap_or_default();
    Ok(EthPrecompileOutput::new(ECRECOVER_BASE, out))
}
