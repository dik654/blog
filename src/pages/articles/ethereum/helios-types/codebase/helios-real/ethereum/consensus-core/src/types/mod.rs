// a16z/helios 저장소 · ethereum/consensus-core/src/types/mod.rs (main
// branch, commit 43a8c9f, 2026년 8월 기준 이 글이 인용하는 SHA). 전체
// 805줄 중 이 글이 다루는 LightClientStore·BeaconBlockHeader·
// LightClientHeader·SyncAggregate·Update struct 정의만 발췌했습니다.
// BeaconBlock/BeaconBlockBody/attestation 관련 type과 fork-specific
// superstruct 매크로 세부 attribute는 생략했습니다.
// 본문 대응: overview section의 "BeaconBlockHeader.state_root는 BeaconState
// root이며 EVM account trie root가 아니다. 실행 상태 root는 fork별
// LightClientHeader.execution에서 가져온다", core-types section의 네
// 구조체 역할 구분과 B_header=112 bytes, B_aggregate=160 bytes 계산.

// article의 "LightClientStore는 검증을 통과한 결과를 누적하는 local
// state" — validation을 통과한 header·committee만 여기 반영된다
pub struct LightClientStore<S: ConsensusSpec> {
    pub finalized_header: LightClientHeader,
    pub current_sync_committee: SyncCommittee<S>,
    pub next_sync_committee: Option<SyncCommittee<S>>,
    pub optimistic_header: LightClientHeader,
    pub previous_max_active_participants: u64,
    pub current_max_active_participants: u64,
    pub best_valid_update: Option<GenericUpdate<S>>,
}

// article의 "BeaconBlockHeader는 commitment" — article의 B_header=8+8+
// 3·32=112 bytes 계산이 정확히 이 다섯 필드(u64 두 개 + B256 세 개)다.
// state_root는 BeaconState root이지 EVM account trie root가 아니다.
pub struct BeaconBlockHeader {
    #[serde(with = "serde_utils::u64")]
    pub slot: u64,
    #[serde(with = "serde_utils::u64")]
    pub proposer_index: u64,
    pub parent_root: B256,
    pub state_root: B256,
    pub body_root: B256,
}

// article의 "실행 상태 root는 fork별 LightClientHeader.execution에서
// 가져온다" — beacon(BeaconBlockHeader, consensus state_root)과
// execution(ExecutionPayloadHeader, EVM state root)이 별도 필드로
// 분리돼 있다.
pub struct LightClientHeader {
    pub beacon: BeaconBlockHeader,
    #[superstruct(only(Capella, Deneb, Electra))]
    pub execution: ExecutionPayloadHeader,
    #[superstruct(only(Capella, Deneb, Electra))]
    pub execution_branch: FixedVector<B256, typenum::U4>,
}

// article의 "SyncAggregate는 누가 어느 header root에 서명했는지 나타내는
// 증거" — article의 B_aggregate=512/8+96=160 bytes 계산이 정확히 이
// bits(committee size를 bit로 pack)+signature(BLS) 두 필드다.
pub struct SyncAggregate<S: ConsensusSpec> {
    pub sync_committee_bits: BitVector<S::SyncCommitteeSize>,
    pub sync_committee_signature: Signature,
}

// article의 "Update는 검증 후보 메시지" — attested/finalized header와
// 다음 committee, 그 committee/finality를 증명하는 branch, 서명 증거를
// 한 메시지에 담는다. Store에 반영되기 전 검증 대상일 뿐이다.
pub struct Update<S: ConsensusSpec> {
    pub attested_header: LightClientHeader,
    pub next_sync_committee: SyncCommittee<S>,
    pub next_sync_committee_branch: FixedVector<B256, typenum::U5>,
    pub finalized_header: LightClientHeader,
    pub finality_branch: FixedVector<B256, typenum::U6>,
    pub sync_aggregate: SyncAggregate<S>,
    #[serde(with = "serde_utils::u64")]
    pub signature_slot: u64,
}
