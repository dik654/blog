import type { CodeRef } from '@/components/code/types';
import syncClientRaw from './codebase/prysm/validator/client/sync_committee.go?raw';
import syncCoreRaw from './codebase/prysm/beacon-chain/core/altair/sync_committee.go?raw';

export const syncCommitteeCodeRefs: Record<string, CodeRef> = {
  'submit-sync-msg': {
    path: 'validator/client/sync_committee.go — SubmitSyncCommitteeMessage()',
    lang: 'go',
    code: syncClientRaw,
    highlight: [3, 35],
    desc: 'SubmitSyncCommitteeMessage — 매 슬롯 헤드 블록 루트에 BLS 서명 후 비콘 노드에 제출',
    annotations: [
      { lines: [8, 11], color: 'violet', note: '현재 헤드 블록 루트 조회' },
      { lines: [13, 18], color: 'emerald', note: 'DomainSyncCommittee 도메인으로 BLS 서명' },
      { lines: [24, 29], color: 'sky', note: 'SyncCommitteeMessage 구성' },
      { lines: [30, 32], color: 'amber', note: '비콘 노드에 gRPC로 제출' },
    ],
  },
  'process-sync-aggregate': {
    path: 'core/altair/sync_committee.go — ProcessSyncAggregate()',
    lang: 'go',
    code: syncCoreRaw,
    highlight: [3, 35],
    desc: 'ProcessSyncAggregate — SyncAggregate 비트필드를 처리하여 보상/패널티 적용',
    annotations: [
      { lines: [9, 11], color: 'violet', note: '현재 싱크 위원회 멤버 목록 조회' },
      { lines: [14, 19], color: 'emerald', note: 'BitAt으로 서명 참여 여부 확인' },
      { lines: [21, 23], color: 'sky', note: '참여자 보상 = totalBalance / 512 / 32' },
      { lines: [25, 27], color: 'amber', note: '참여자에게 보상 지급' },
      { lines: [29, 33], color: 'rose', note: '불참자에게 동일 금액 패널티' },
    ],
  },
};
