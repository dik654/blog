/** UpdateTrace Viz — 색상 상수 + step 정의 */

export const C = {
  slot: '#f59e0b',       // 슬롯 순서 (앰버)
  bls: '#6366f1',        // BLS 검증 (인디고)
  finalized: '#10b981',  // finalized 갱신 (에메랄드)
  committee: '#8b5cf6',  // 위원회 교체 (보라)
  optimistic: '#06b6d4', // optimistic 갱신 (시안)
};

export const STEPS = [
  {
    label: '검사 1: 슬롯 순서 — signature_slot > attested > finalized',
    body: '서명 슬롯이 헤더 슬롯보다 커야 한다.\n역순이면 시간 역행 공격 — 미래 슬롯 서명을 미리 뿌려 경량 클라이언트를 속일 수 있다.',
  },
  {
    label: '검사 2: BLS 서명 — verify_sync_committee_sig() 참조',
    body: 'helios-consensus의 5단계와 동일.\n비트맵 필터링 → 정족수 → 공개키 합산 → signing_root → 페어링 비교.',
  },
  {
    label: '반영 1: finalized_header 교체 — 슬롯 비교 후 갱신',
    body: 'update.finalized_header.slot > store.finalized_header.slot이면 교체.\n한 번 finalized되면 되돌릴 수 없다 — 2/3 stake가 보장.',
  },
  {
    label: '반영 2: 위원회 교체 — period 경계 감지',
    body: 'period = slot / 8192. period가 변경되면 current ← next.\n27.3시간(256 에폭)마다 512명이 교체된다.',
  },
  {
    label: '반영 3: optimistic_header — 최신 추적',
    body: 'update.attested_header로 항상 교체.\nfinalized만 사용하면 ~12분 지연. optimistic 추가로 12초 단위 추적이 가능하다.',
  },
];
