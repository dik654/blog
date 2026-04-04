import type { CodeRef } from '@/components/code/types';
import attestRaw from './codebase/prysm/validator/client/attest.go?raw';
import poolRaw from './codebase/prysm/beacon-chain/operations/attestations/pool.go?raw';

export const attestCodeRefs: Record<string, CodeRef> = {
  'submit-attestation': {
    path: 'validator/client/attest.go — SubmitAttestation()',
    lang: 'go',
    code: attestRaw,
    highlight: [3, 42],
    desc: 'SubmitAttestation — 위원회 할당 조회 → 데이터 수신 → 슬래싱 체크 → 서명 → 제출',
    annotations: [
      { lines: [7, 11], color: 'violet', note: '위원회 할당 조회 (서브넷 결정)' },
      { lines: [13, 17], color: 'emerald', note: 'AttestationData 수신 (source, target, head)' },
      { lines: [22, 25], color: 'amber', note: '슬래싱 방지 DB 확인' },
      { lines: [27, 30], color: 'sky', note: 'BLS 서명 생성' },
      { lines: [32, 38], color: 'rose', note: '서브넷 계산 + 비콘 노드에 제출' },
    ],
  },
  'attestation-pool': {
    path: 'operations/attestations/pool.go — Pool + SaveAggregated',
    lang: 'go',
    code: poolRaw,
    highlight: [3, 22],
    desc: 'Pool — 집계된/미집계 어테스테이션을 보관하는 풀. 블록 제안 시 참조.',
    annotations: [
      { lines: [6, 9], color: 'violet', note: 'aggregated / unaggregated / forkchoice 슬라이스' },
      { lines: [14, 21], color: 'emerald', note: 'SaveAggregatedAttestation: 집계 검증 후 풀에 추가' },
    ],
  },
  'compute-subnet': {
    path: 'operations/attestations/pool.go — AggregatedAttestations()',
    lang: 'go',
    code: poolRaw,
    highlight: [24, 30],
    desc: 'AggregatedAttestations — 블록 제안 시 최대 128개 집계 어테스테이션 반환',
    annotations: [
      { lines: [27, 28], color: 'violet', note: 'RLock으로 읽기 전용 접근' },
      { lines: [29, 29], color: 'emerald', note: '복사본 반환 (원본 보호)' },
    ],
  },
};
