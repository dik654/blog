fn process_payload_attributes(
    &mut self,
    attributes: T::PayloadAttributes,
    head: &N::BlockHeader,
    state: ForkchoiceState,
) -> OnForkChoiceUpdated {
    if let Err(err) =
        self.payload_validator.validate_payload_attributes_against_header(&attributes, head)
    {
        warn!(target: "engine::tree", %err, ?head, "Invalid payload attributes");
        return OnForkChoiceUpdated::invalid_payload_attributes()
    }

    let payload_build = self.payload_builds.acquire();

    let resources = self
        .payload_validator
        .payload_builder_resources(
            state.head_block_hash,
            head,
            attributes.timestamp(),
            &mut self.state,
        )
        .with_lease(PayloadBuilderLease::new(payload_build));

    let pending_payload_id = self.payload_builder.send_new_payload(BuildNewPayload {
        parent_hash: state.head_block_hash,
        attributes,
        resources,
    });

    OnForkChoiceUpdated::updated_with_pending_payload_id(
        PayloadStatus::new(PayloadStatusEnum::Valid, Some(state.head_block_hash)),
        pending_payload_id,
    )
}
