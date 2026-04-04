export const CA = '#6366f1';
export const CB = '#f59e0b';
export const CG = '#94a3b8';

export const STEPS = [
  { label: '포크 발생: 슬롯 9,288,001에서 두 체인이 분기됩니다', body: '네트워크 지연으로 슬롯 9,288,001에 두 블록(0x3a8f…, 0x7b2c…)이 제안되어 Chain A와 Chain B가 동시에 존재합니다.' },
  { label: '검증자들의 최신 투표(LMD)가 블록으로 날아갑니다', body: 'V1(32 ETH)·V2(32 ETH)·V3(32 ETH)는 Chain A에, V4(32 ETH)·V5(32 ETH)는 Chain B에 투표합니다.' },
  { label: 'GHOST: 누적 가중치 — Chain A: 96 ETH vs Chain B: 64 ETH', body: '각 분기점에서 자식 블록들의 누적 스테이크 합(effective_balance)을 비교하여 무거운 서브트리를 선택합니다.' },
  { label: 'Chain A가 96 ETH로 더 무겁습니다 → 슬롯 9,288,003이 헤드', body: '96 vs 64 ETH — Chain A가 정규 체인이 되며, head=0x3a8f…c1e2가 됩니다.' },
];

// Genesis at bottom-center, chains branch up-left and up-right
export const GX = 210, GY = 272;
// Chain A blocks at x=110, Chain B blocks at x=310
export const AB = [{ id: 'A1', cy: 215, slot: '9288001' }, { id: 'A2', cy: 155, slot: '9288002' }, { id: 'A3', cy: 95, slot: '9288003' }];
export const BB = [{ id: 'B1', cy: 215, slot: '9288001' }, { id: 'B2', cy: 155, slot: '9288002' }, { id: 'B3', cy: 95, slot: '9288003' }];

// Edges: [x1,y1,x2,y2]
export const EDGES: [number, number, number, number][] = [
  [GX, GY, 110, 215], [GX, GY, 310, 215],
  [110, 215, 110, 155], [110, 155, 110, 95],
  [310, 215, 310, 155], [310, 155, 310, 95],
];

// Validators: v on left for Chain A, right for Chain B
export const VOTES = [
  { id: 'V1', vx: 28,  vy: 78,  bx: 84,  by: 95,  s: 'a', d: 0 },
  { id: 'V2', vx: 28,  vy: 118, bx: 84,  by: 95,  s: 'a', d: 0.12 },
  { id: 'V3', vx: 28,  vy: 158, bx: 84,  by: 155, s: 'a', d: 0.24 },
  { id: 'V4', vx: 392, vy: 78,  bx: 336, by: 95,  s: 'b', d: 0.08 },
  { id: 'V5', vx: 392, vy: 118, bx: 336, by: 155, s: 'b', d: 0.2 },
];
