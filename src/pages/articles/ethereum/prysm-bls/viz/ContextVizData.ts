export const C = { curve: '#8b5cf6', sign: '#10b981', err: '#ef4444', ok: '#10b981', agg: '#f59e0b' };

export const STEPS = [
  {
    label: '검증자 투표 집계',
    body: '수만 개 서명을 하나로 합칠 수 있는 유일한 체계라서 BLS12-381이 선택되었습니다.',
  },
  {
    label: '문제: 블록당 수천 서명 검증',
    body: '개별 검증은 패어링 2회 x 수천 건으로 12초 안에 처리 불가하여 집계 검증이 필수입니다.',
  },
  {
    label: '문제: Rogue-Key 공격',
    body: '공격자가 타인의 pk를 상쇄하는 키를 생성하여 집계 서명을 위조할 수 있습니다.',
  },
  {
    label: '해결: BLS 집계 + FastAggregateVerify',
    body: '동일 메시지에 pk 합산 + 패어링 1회로 수천 서명을 BLST C/asm 바인딩으로 동시 검증합니다.',
  },
  {
    label: '해결: 배치 검증 + PoP 방어',
    body: '서로 다른 (pk,msg) 쌍도 랜덤 계수로 한 번에 검증하고 PoP으로 Rogue-Key를 차단합니다.',
  },
];
