export const STEPS = [
  { label: '전결합층(FC)이란?', body: '모든 입력 뉴런이 모든 출력 뉴런과 연결 — 입력 크기에 비례해 파라미터 폭발' },
  { label: 'FC: 이미지 평탄화', body: '2D 이미지를 1D 벡터로 펼침 → 공간 정보(인접 픽셀 관계) 완전 소실' },
  { label: 'FC: 파라미터 폭발', body: '28×28 이미지 → 784 입력, 128 뉴런이면 100,352개 가중치. 224×224×3이면 약 1,920만 개' },
  { label: 'CNN: 지역 연결', body: '3×3 필터가 작은 영역만 봄 → 공간 구조 보존, 파라미터 수 극적 감소' },
];

export const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };
export const GRID = 5; // 5x5 simplified pixel grid
export const PIX = 10;
export const GAP = 2;
