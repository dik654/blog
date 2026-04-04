export const C = {
  slot: '#f59e0b', bls: '#6366f1', err: '#ef4444',
};

export const STEPS = [
  {
    label: 'Line 9~13: 슬롯 순서 검사',
    body: 'signature_slot > attested_header.slot\n서명 슬롯이 헤더 슬롯보다 커야 함 (미래 서명 불가).',
  },
  {
    label: 'Line 15~24: BLS 서명 검증',
    body: 'verify_sync_committee_sig() 호출.\n참여 비트맵 → 공개키 합산 → 페어링 비교.',
  },
  {
    label: 'Line 25~27: 실패 시 에러 반환',
    body: 'BLS 검증 실패 → Err("BLS verify failed").\n위변조된 Update 거부.',
  },
];
