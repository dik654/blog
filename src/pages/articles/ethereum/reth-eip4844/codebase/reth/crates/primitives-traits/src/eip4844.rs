// reth-primitives-traits — EIP-4844 blob gas (reth v1.x)

/// 초과 blob gas 계산
/// 이전 블록의 excess + used가 target보다 크면 초과분 누적
/// target = 3 blobs × 131,072 = 393,216 gas
pub fn calc_excess_blob_gas(
    parent_excess_blob_gas: u64, // 이전 블록의 초과 blob gas
    parent_blob_gas_used: u64,   // 이전 블록에서 사용한 blob gas
) -> u64 {
    let excess_plus_used =
        parent_excess_blob_gas + parent_blob_gas_used;
    if excess_plus_used < TARGET_BLOB_GAS_PER_BLOCK {
        0 // target 미만이면 초과분 없음
    } else {
        excess_plus_used - TARGET_BLOB_GAS_PER_BLOCK // 초과분 누적
    }
}

/// Blob 가격 = 지수 함수 기반
/// EIP-1559의 선형 조정과 달리 급격한 가격 변동
pub fn calc_blob_fee(excess_blob_gas: u64) -> u128 {
    fake_exponential(
        MIN_BLOB_GASPRICE as u128,        // factor = 1 wei (최소 가격)
        excess_blob_gas as u128,           // num = 초과 blob gas
        BLOB_GASPRICE_UPDATE_FRACTION as u128, // denom = 3,338,477
    )
}

/// 지수 근사 함수: factor × e^(numerator / denominator)
/// Taylor 급수 전개로 정수 연산만 사용
/// 부동소수점 사용 시 노드 간 결과 불일치 → 합의 실패 위험
fn fake_exponential(factor: u128, num: u128, denom: u128) -> u128 {
    let mut i = 1u128;           // Taylor 급수 항 인덱스
    let mut output = 0u128;      // 누적 결과
    let mut numerator_accum = factor * denom; // 초기 누적자

    // numerator_accum이 0에 수렴할 때까지 반복
    while numerator_accum > 0 {
        output += numerator_accum;
        // 다음 항: accum × num / (denom × i)
        numerator_accum = numerator_accum * num / (denom * i);
        i += 1;
    }
    output / denom // 최종 결과 정규화
}
