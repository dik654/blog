export const N = 6; // 표시용 n_shards 축소
export const K1 = 2; // primary source symbols (n-2f)
export const K2 = 4; // secondary source symbols (n-f)

export const encodeSteps = [
  { label: '① 원본 블롭 배치', desc: '블롭을 k₁×k₂ 메시지 행렬로 채웁니다.' },
  { label: '② 행 방향 RS 인코딩', desc: '각 행을 n_shards개로 확장 → Secondary 슬라이버' },
  { label: '③ 열 방향 RS 인코딩', desc: '각 열을 n_shards개로 확장 → Primary 슬라이버' },
  { label: '④ 슬라이버 배포', desc: '노드 i: { Primary[i], Secondary[n-1-i] } 쌍 보유' },
];

export type Cell = { row: number; col: number };

export const isSource = (r: number, c: number) => r < K1 && c < K2;
export const isRowRepair = (r: number, c: number) => r < K1 && c >= K2;
export const isColRepair = (r: number, _c: number) => r >= K1;

export const getCellColor = (r: number, c: number, step: number) => {
  if (step === 0) {
    if (isSource(r, c)) return 'bg-blue-500 text-white';
    return 'bg-muted text-muted-foreground';
  }
  if (step === 1) {
    if (isSource(r, c)) return 'bg-blue-500 text-white';
    if (isRowRepair(r, c)) return 'bg-green-400 text-white';
    return 'bg-muted text-muted-foreground';
  }
  if (step === 2) {
    if (isSource(r, c)) return 'bg-blue-500 text-white';
    if (isRowRepair(r, c)) return 'bg-green-400 text-white';
    if (isColRepair(r, c)) return 'bg-orange-400 text-white';
  }
  if (step === 3) {
    if (isSource(r, c)) return 'bg-blue-500 text-white';
    if (isRowRepair(r, c)) return 'bg-green-400 text-white';
    if (isColRepair(r, c)) return 'bg-orange-400 text-white';
  }
  return 'bg-muted text-muted-foreground';
};
