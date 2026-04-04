export const C = { orig: '#8b5cf6', copy: '#0ea5e9', write: '#f59e0b', ok: '#10b981' };

export const STEPS = [
  {
    label: 'Copy() — 참조만 공유',
    body: 'sharedFieldReferences에서 참조 카운트만 증가, 실제 슬라이스 복사 없음',
  },
  {
    label: 'Setter → 깊은 복사 트리거',
    body: '참조 카운트 > 1인 필드에 Setter 호출 시 해당 필드만 deep copy',
  },
  {
    label: '포크 분기 관리',
    body: '각 분기는 변경 필드만 독립 보유 — 10개 분기에도 메모리 ≈ 1.x배',
  },
];
