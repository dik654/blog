// reth-consensus-common — 헤더 blob gas 검증 (reth v1.x)

/// 블록 헤더의 blob gas 필드를 검증
/// 블록 본체의 blob gas 합계와 헤더 값이 일치해야 함
pub fn validate_cancun_gas<B: Block>(block: &SealedBlock<B>)
    -> Result<(), ConsensusError>
{
    let header_blob_gas_used = block.blob_gas_used()
        .ok_or(ConsensusError::BlobGasUsedMissing)?;
    let total_blob_gas = block.body().blob_gas_used();
    if total_blob_gas != header_blob_gas_used {
        return Err(ConsensusError::BlobGasUsedDiff(GotExpected {
            got: header_blob_gas_used,
            expected: total_blob_gas,
        }));
    }
    Ok(())
}

/// EIP-4844 헤더 독립 검증 (부모 블록 불필요)
/// 1) blob_gas_used 필드 존재 확인
/// 2) parent_beacon_block_root 존재 확인
/// 3) blob_gas_used가 DATA_GAS_PER_BLOB(131072)의 배수인지
/// 4) 최대 허용 blob gas 초과 여부
pub fn validate_4844_header_standalone<H: BlockHeader>(
    header: &H,
    blob_params: BlobParams,
) -> Result<(), ConsensusError>
{
    let blob_gas_used = header.blob_gas_used()
        .ok_or(ConsensusError::BlobGasUsedMissing)?;

    // Cancun 이후 beacon block root 필수
    if header.parent_beacon_block_root().is_none() {
        return Err(ConsensusError::ParentBeaconBlockRootMissing)
    }

    // blob_gas_used는 반드시 131,072의 배수
    // → 각 blob이 정확히 131,072 gas 소비
    if !blob_gas_used.is_multiple_of(DATA_GAS_PER_BLOB) {
        return Err(ConsensusError::BlobGasUsedNotMultipleOfBlobGasPerBlob {
            blob_gas_used, blob_gas_per_blob: DATA_GAS_PER_BLOB
        })
    }

    // 블록당 최대 blob gas 초과 확인
    // max = max_blob_count × DATA_GAS_PER_BLOB
    if blob_gas_used > blob_params.max_blob_gas_per_block() {
        return Err(ConsensusError::BlobGasUsedExceedsMaxBlobGasPerBlock {
            blob_gas_used,
            max_blob_gas_per_block: blob_params.max_blob_gas_per_block()
        })
    }
    Ok(())
}

/// Cancun 포크 활성 시 blob gas 검증 호출
pub fn post_merge_hardfork_fields<B, ChainSpec>(
    block: &SealedBlock<B>, chain_spec: &ChainSpec
) -> Result<(), ConsensusError>
{
    // ... ommer hash, shanghai withdrawals 검증 ...
    if chain_spec.is_cancun_active_at_timestamp(block.timestamp()) {
        validate_cancun_gas(block)?; // Cancun 활성 시 blob gas 검증
    }
    Ok(())
}
