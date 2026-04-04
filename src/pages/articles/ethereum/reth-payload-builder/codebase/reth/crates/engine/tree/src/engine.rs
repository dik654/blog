// reth engine — forkchoice_updated 처리 (reth v1.x)

impl<T: EngineTypes> EngineApiTreeHandler<T> {
    fn on_forkchoice_updated(
        &mut self,
        state: ForkchoiceState,    // head/safe/finalized 해시
        attrs: Option<T::PayloadAttributes>, // 블록 생성 속성 (없으면 검증만)
    ) -> EngineApiResult<ForkchoiceUpdated> {
        // 1. head_block_hash 검증 — 알려진 블록인지 확인
        let head = self.find_canonical_header(state.head_block_hash)?;

        // 2. safe / finalized 블록 검증 — 일관성 확인
        self.ensure_consistent_state(state)?;

        // 3. canonical 체인 갱신 — 포크 선택 결과를 DB에 반영
        self.update_canonical_chain(head)?;

        // 4. payload 속성이 있으면 빌드 시작
        //    속성 포함 = CL이 "이 슬롯에서 블록을 제안하라"는 신호
        let payload_id = if let Some(attributes) = attrs {
            let id = self.payload_builder.send_new_payload(
                head.clone(),   // 부모 블록
                attributes,     // timestamp, prevrandao, withdrawals 등
            )?;
            Some(id) // 나중에 GetPayload로 조회할 ID
        } else {
            None // 검증 전용 — 블록 생성 없음
        };

        Ok(ForkchoiceUpdated {
            payload_status: PayloadStatus::new(
                PayloadStatusEnum::Valid, // head가 유효함을 CL에 알림
                Some(state.head_block_hash),
            ),
            payload_id, // CL이 GetPayload에 사용
        })
    }
}
