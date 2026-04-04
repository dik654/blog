// reth/crates/rpc/rpc-engine-api/src/engine_api.rs
// EngineApi — CL(Beacon) ↔ EL(Reth) Engine API 구현

use reth_primitives::{B256, U64};
use reth_rpc_types::engine::*;

/// EngineApi — Engine API 메서드 구현.
/// CL(Lighthouse 등)이 EL(Reth)에 블록 검증/생성을 요청하는 인터페이스.
/// JWT 토큰으로 인증된 연결만 허용 (외부 접근 차단).
pub struct EngineApi<Provider, EngineT> {
    /// 상태 및 블록 데이터 접근 provider
    provider: Provider,
    /// 페이로드 빌더 (새 블록 생성)
    payload_builder: PayloadBuilderHandle<EngineT>,
    /// Beacon 엔진 핸들 (포크초이스 업데이트 전달)
    beacon_engine_handle: BeaconEngineHandle,
}

impl<Provider, EngineT> EngineApi<Provider, EngineT> {
    /// forkchoice_updated — CL이 최신 head/safe/finalized 알림.
    /// 페이로드 빌드 시작 트리거도 포함.
    pub async fn forkchoice_updated(
        &self,
        state: ForkchoiceState,        // head, safe, finalized 해시
        payload_attrs: Option<PayloadAttributes>,  // 블록 생성 요청
    ) -> Result<ForkchoiceUpdated> {
        // 1. head 블록 유효성 확인
        // 2. canonical chain 업데이트
        // 3. payload_attrs가 있으면 → 페이로드 빌드 시작
        todo!()
    }

    /// new_payload — CL이 새 블록 페이로드 검증 요청.
    pub async fn new_payload(
        &self,
        payload: ExecutionPayload,
    ) -> Result<PayloadStatus> {
        // EVM 실행 → 상태 루트 검증 → VALID/INVALID 응답
        todo!()
    }
}
