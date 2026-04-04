import type { Annotation } from '@/components/ui/code-panel';

export const headerCode = `#[derive(Encode, Decode, TreeHash)]
pub struct BeaconBlockHeader {
    pub slot: u64,
    pub proposer_index: u64,
    pub parent_root: B256,
    pub state_root: B256,
    pub body_root: B256,
}`;

export const headerAnnotations: Annotation[] = [
  { lines: [1, 1], color: 'sky', note: 'SSZ + Merkle derive' },
  { lines: [3, 4], color: 'emerald', note: '슬롯·제안자 식별' },
  { lines: [5, 7], color: 'amber', note: '3개 루트 해시' },
];

export const updateCode = `pub struct LightClientUpdate {
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
}`;

export const updateAnnotations: Annotation[] = [
  { lines: [2, 3], color: 'sky', note: '증명된 헤더' },
  { lines: [4, 7], color: 'emerald', note: '다음 위원회 + 증명' },
  { lines: [8, 10], color: 'amber', note: '최종성 헤더 + 증명' },
  { lines: [11, 13], color: 'violet', note: 'BLS 서명' },
];
