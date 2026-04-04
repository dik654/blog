import type { CodeRef } from '@/components/code/types';

import updateRs from './codebase/helios/consensus/src/update.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  // 본문 대응: ValidateUpdate 섹션 — 전체 validate 함수
  'hl-validate': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [5, 43],
    desc: 'validate_update — 슬롯 순서 검사 + BLS 서명 검증.',
    annotations: [
      { lines: [18, 24], color: 'sky', note: '검사 1: signature_slot > attested_header.slot (시간 역행 방지)' },
      { lines: [25, 38], color: 'emerald', note: '검사 2: verify_sync_committee_sig() — 5단계 BLS 파이프라인' },
      { lines: [39, 41], color: 'rose', note: '검증 실패 시 Err("BLS verify failed") 반환' },
    ],
  },

  // 본문 대응: ApplyUpdate 섹션 — 전체 apply 함수
  'hl-apply': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [47, 75],
    desc: 'apply_update — finalized_header 갱신 + 위원회 교체 + optimistic 갱신.',
    annotations: [
      { lines: [51, 59], color: 'sky', note: '반영 1: finalized_header 슬롯 비교 후 교체 (되돌릴 수 없음)' },
      { lines: [60, 68], color: 'emerald', note: '반영 2: period 경계면 current ← next 위원회 교체' },
      { lines: [69, 74], color: 'amber', note: '반영 3: optimistic_header 항상 최신으로 교체' },
    ],
  },

  // 본문 대응: UpdateTrace 검사 1 — 슬롯 순서 + BLS 검증 (상세)
  'hl-validate-slot': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [17, 43],
    desc: 'validate_update — 검사 1~2 상세. 슬롯 순서 비교로 시간 역행 공격을 차단하고, verify_sync_committee_sig()로 BLS 서명을 검증한다.',
    annotations: [
      { lines: [18, 20], color: 'sky', note: '검사 1: 서명 시점(signature_slot) > 서명 대상(attested_header.slot)' },
      { lines: [21, 24], color: 'rose', note: '역순이면 Err — 미래 슬롯 서명 공격 차단' },
      { lines: [25, 31], color: 'amber', note: '5단계 파이프라인 설명: bits → filter → agg_pk → root → pairing' },
      { lines: [32, 38], color: 'emerald', note: '검사 2: verify_sync_committee_sig() 호출 — 각 인자 의미 주석' },
    ],
  },

  // 본문 대응: UpdateTrace 반영 1~2 — finalized + 위원회
  'hl-apply-finalized': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [47, 68],
    desc: 'apply_update — 반영 1~2. finalized 슬롯 비교 후 교체, period 경계 감지 시 위원회 512명 전체 교체.',
    annotations: [
      { lines: [51, 54], color: 'sky', note: '반영 1: 슬롯 비교 — update.slot=8000064 > store.slot=8000000' },
      { lines: [55, 59], color: 'emerald', note: 'finalized 교체 — 2/3 stake 보장, 되돌릴 수 없음' },
      { lines: [60, 63], color: 'amber', note: '반영 2: period = slot/8192, 경계 넘으면 교체' },
      { lines: [64, 68], color: 'rose', note: 'current ← next_sync_committee (512명 전체 교체)' },
    ],
  },

  // 본문 대응: UpdateTrace 반영 3 — optimistic_header
  'hl-apply-optimistic': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [69, 75],
    desc: 'apply_update — 반영 3. optimistic_header를 조건 없이 항상 최신으로 교체. eth_getBlockByNumber("latest") 응답에 사용.',
    annotations: [
      { lines: [69, 72], color: 'sky', note: '반영 3: 조건 없이 항상 교체 — 최신 헤더가 곧 optimistic' },
      { lines: [73, 74], color: 'emerald', note: 'store.optimistic_header = update.attested_header.clone()' },
    ],
  },

  // 본문 대응: UpdateTrace 검사 2 — signing_root 도메인 분리 (참고용)
  'hl-signing-root': {
    path: 'helios/consensus/src/update.rs',
    code: updateRs,
    lang: 'rust',
    highlight: [25, 38],
    desc: 'signing_root — DOMAIN_SYNC_COMMITTEE(0x07) + fork_version(0x04) + genesis_root로 3중 보호. 다른 도메인 서명 재사용 방지.',
    annotations: [
      { lines: [29, 30], color: 'sky', note: 'signing_root 계산: DOMAIN_SYNC=0x07 + fork_version' },
      { lines: [32, 38], color: 'emerald', note: 'verify_sync_committee_sig() — fork_version 인자로 도메인 분리' },
    ],
  },
};
