use ssz_derive::{Decode, Encode};
use tree_hash_derive::TreeHash;

#[derive(Encode, Decode, TreeHash)]
pub struct BeaconBlockHeader {
    pub slot: u64,
    pub proposer_index: u64,
    pub parent_root: B256,
    pub state_root: B256,
    pub body_root: B256,
}

#[derive(Encode, Decode)]
pub struct SyncAggregate {
    pub sync_committee_bits:
        Bitvector<512>,
    pub sync_committee_signature:
        BlsSignature,
}

#[derive(Encode, Decode)]
pub struct LightClientUpdate {
    pub attested_header:
        BeaconBlockHeader,
    pub next_sync_committee:
        SyncCommittee,
    pub next_sync_committee_branch:
        Vec<B256>,
    pub finalized_header:
        BeaconBlockHeader,
    pub finality_branch: Vec<B256>,
    pub sync_aggregate:
        SyncAggregate,
    pub signature_slot: u64,
}

#[derive(Clone)]
pub struct LightClientStore {
    pub finalized_header:
        BeaconBlockHeader,
    pub current_sync_committee:
        SyncCommittee,
    pub next_sync_committee:
        Option<SyncCommittee>,
    pub optimistic_header:
        BeaconBlockHeader,
    pub previous_max_active:
        u64,
    pub current_max_active:
        u64,
}
