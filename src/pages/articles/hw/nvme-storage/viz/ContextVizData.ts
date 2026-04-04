export const C = { m2: '#6366f1', u2: '#f59e0b', e1s: '#10b981', err: '#ef4444', hw: '#71717a' };

export const STEPS = [
  { label: 'NVMe 폼팩터: M.2 vs U.2 vs E1.S 크기·냉각 비교', body: 'M.2(22×80mm): 경량 / U.2(2.5인치, 금속): 핫스왑 / E1.S(차세대): 전력 효율 + 고밀도' },
  { label: 'M.2 발열: 연속 쓰기 시 70→100℃ 쓰로틀링', body: 'M.2 2280: 밀집 기판(1760mm²) → 열 분산 한계, 연속 쓰기 5분 후 속도 70% 감소' },
  { label: 'U.2 / E1.S: 서버 전용 엔터프라이즈 스펙', body: 'U.2: 금속 케이스 + 핫스왑 + 3 DWPD / E1.S: 9.5mm + 고밀도 + 1U 랙 최적화' },
  { label: 'Filecoin NVMe: PC1 순차 쓰기 + PoSt 랜덤 읽기', body: 'PC1: 순차 쓰기 3~5GB/s 필요 / WindowPoSt: 랜덤 읽기 IOPS 중요 → 용도별 선택' },
];
