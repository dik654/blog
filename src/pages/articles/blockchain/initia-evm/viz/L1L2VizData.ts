export const C = {
  l1: '#6366f1',
  evm: '#0ea5e9',
  move: '#10b981',
  wasm: '#f59e0b',
  bridge: '#ec4899',
};

export const STEPS = [
  {
    label: 'Initia L1: Cosmos SDK + MoveVM 기반 메인 체인',
    body: '합의, 결산, IBC 허브 역할을 수행하며 모든 Minitia L2의 보안을 파생합니다.',
  },
  {
    label: 'Minitia L2: EVM/MoveVM/WasmVM 선택 가능한 롤업',
    body: 'MiniEVM, MiniMove, MiniWasm 중 하나를 선택하여 L2를 구성합니다.',
  },
  {
    label: 'OPinit: 옵티미스틱 브릿지로 L1↔L2 통신',
    body: 'Optimistic Rollup 보안 레이어로 L1↔L2 간 상태 검증을 담당합니다.',
  },
  {
    label: 'Enshrined Liquidity: L1에서 직접 유동성 공급',
    body: 'L1 내장 유동성으로 모든 Minitia가 공유 풀에 접근할 수 있습니다.',
  },
];

export const L2_BOXES = [
  { x: 30, label: 'Minitia EVM', vm: 'MiniEVM', color: C.evm, delay: 0 },
  { x: 145, label: 'Minitia Move', vm: 'MiniMove', color: C.move, delay: 0.1 },
  { x: 260, label: 'Minitia Wasm', vm: 'MiniWasm', color: C.wasm, delay: 0.2 },
] as const;
