export const C = { final: '#8b5cf6', ok: '#10b981', err: '#ef4444', just: '#f59e0b', ws: '#0ea5e9' };

export const STEPS = [
  {
    label: '"확정된" 블록이 있어야 안전',
    body: '거래소와 DeFi가 안전하게 자금을 처리하려면 절대 뒤집히지 않는 블록이 필요합니다.',
  },
  {
    label: '문제: LMD-GHOST만으로는 부족',
    body: 'LMD-GHOST는 현재 최선 헤드만 알 뿐 경제적 최종성이 없습니다.',
  },
  {
    label: '문제: 2/3 연속 투표 필요',
    body: '확정에는 2/3 투표가 2에폭 연속으로 필요하며 네트워크 지연 시 finality가 지연됩니다.',
  },
  {
    label: '해결: Casper FFG 2단계',
    body: 'Justified(2/3 투표, 아직 가역) → Finalized(연속 에폭 후 확정, 슬래싱 없이 불가역)입니다.',
  },
  {
    label: '해결: Weak Subjectivity',
    body: '오래 오프라인이던 노드가 --checkpoint-sync-url로 약 2주 이내에 안전하게 복귀합니다.',
  },
];
