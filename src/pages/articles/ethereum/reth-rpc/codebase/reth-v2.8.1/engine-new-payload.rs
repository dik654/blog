// Reth v2.8.1 · crates/rpc/rpc-engine-api/src/engine_api.rs
// 원문 handler와 내부 함수에 `학습용 주석`만 덧붙였습니다.

async fn new_payload_v4(
    &self,
    payload: ExecutionPayloadV3,
    versioned_hashes: Vec<B256>,
    parent_beacon_block_root: B256,
    requests: RequestsOrHash,
) -> RpcResult<PayloadStatus> {
    trace!(target: "rpc::engine", "Serving engine_newPayloadV4");

    // 학습용 주석: 설정상 허용하지 않은 requests hash 표현은 여기서 거절합니다.
    if requests.is_hash() && !self.inner.accept_execution_requests_hash {
        return Err(EngineApiError::UnexpectedRequestsHash.into());
    }

    let payload = ExecutionData {
        payload: payload.into(),
        sidecar: ExecutionPayloadSidecar::v4(
            CancunPayloadFields { versioned_hashes, parent_beacon_block_root },
            PraguePayloadFields { requests },
        ),
    };

    Ok(self.new_payload_v4_metered(payload).await?)
}

pub async fn new_payload_v4(
    &self,
    payload: PayloadT::ExecutionData,
) -> EngineApiResult<PayloadStatus> {
    let payload_or_attrs = PayloadOrAttributes::<
        '_,
        PayloadT::ExecutionData,
        PayloadT::PayloadAttributes,
    >::from_execution_payload(&payload);

    // 학습용 주석: active fork의 V4 field 계약을 확인한 뒤에만 engine으로 보냅니다.
    self.inner
        .validator
        .validate_version_specific_fields(EngineApiMessageVersion::V4, payload_or_attrs)?;

    // 학습용 주석: 반환값은 canonical 반영 여부가 아니라 PayloadStatus입니다.
    Ok(self.inner.beacon_consensus.new_payload(payload).await?)
}
