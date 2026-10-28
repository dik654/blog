#[superstruct(
    variants(Base, Electra),
    variant_attributes(
        derive(Serialize, Deserialize, Debug, Clone, Decode,),
        serde(deny_unknown_fields),
        serde(bound = "S: ConsensusSpec"),
    )
)]
#[derive(Serialize, Deserialize, Debug, Clone, Decode)]
#[serde(untagged)]
#[serde(bound = "S: ConsensusSpec")]
#[ssz(enum_behaviour = "transparent")]
pub struct Update<S: ConsensusSpec> {
    pub attested_header: LightClientHeader,
    pub next_sync_committee: SyncCommittee<S>,
    #[superstruct(only(Base), partial_getter(rename = "next_sync_committee_branch_base"))]
    pub next_sync_committee_branch: FixedVector<B256, typenum::U5>,
    #[superstruct(
        only(Electra),
        partial_getter(rename = "next_sync_committee_branch_electra")
    )]
    pub next_sync_committee_branch: FixedVector<B256, typenum::U6>,
    pub finalized_header: LightClientHeader,
    #[superstruct(only(Base), partial_getter(rename = "finality_branch_base"))]
    pub finality_branch: FixedVector<B256, typenum::U6>,
    #[superstruct(only(Electra), partial_getter(rename = "finality_branch_electra"))]
    pub finality_branch: FixedVector<B256, typenum::U7>,
    pub sync_aggregate: SyncAggregate<S>,
    #[serde(with = "serde_utils::u64")]
    pub signature_slot: u64,
}

#[superstruct(
    variants(Bellatrix, Capella, Deneb, Electra),
    variant_attributes(
        derive(Default, Debug, Clone, Serialize, Deserialize, Decode, PartialEq),
        serde(deny_unknown_fields),
    )
)]
#[derive(Debug, Clone, Serialize, Deserialize, Decode, PartialEq)]
#[serde(untagged)]
#[ssz(enum_behaviour = "transparent")]
pub struct LightClientHeader {
    pub beacon: BeaconBlockHeader,
    #[superstruct(only(Capella, Deneb, Electra))]
    pub execution: ExecutionPayloadHeader,
    #[superstruct(only(Capella, Deneb, Electra))]
    pub execution_branch: FixedVector<B256, typenum::U4>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default, Encode, Decode, TreeHash)]
pub struct SyncAggregate<S: ConsensusSpec> {
    pub sync_committee_bits: BitVector<S::SyncCommitteeSize>,
    pub sync_committee_signature: Signature,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct GenericUpdate<S: ConsensusSpec> {
    pub attested_header: LightClientHeader,
    pub sync_aggregate: SyncAggregate<S>,
    pub signature_slot: u64,
    pub next_sync_committee: Option<SyncCommittee<S>>,
    pub next_sync_committee_branch: Option<Vec<B256>>,
    pub finalized_header: Option<LightClientHeader>,
    pub finality_branch: Option<Vec<B256>>,
}

impl<S: ConsensusSpec> From<&Update<S>> for GenericUpdate<S> {
    fn from(update: &Update<S>) -> Self {
        Self {
            attested_header: update.attested_header().clone(),
            sync_aggregate: update.sync_aggregate().clone(),
            signature_slot: *update.signature_slot(),
            next_sync_committee: default_to_none(update.next_sync_committee().clone()),
            next_sync_committee_branch: default_branch_to_none(update.next_sync_committee_branch()),
            finalized_header: default_header_to_none(update.finalized_header().clone()),
            finality_branch: default_branch_to_none(update.finality_branch()),
        }
    }
}
