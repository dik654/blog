export const C = { pool: '#6366f1', gas: '#f59e0b', ok: '#10b981', err: '#ef4444' };

export const STEPS = [
  { label: '메시지 검증 5단계', body: '1. 서명 검증 (BLS/Secp256k1)' },
  { label: 'GasEstimateMessageGas', body: 'GasLimit: 메시지 실행 시뮬레이션으로 추정' },
  { label: '블록 메시지 선택', body: '마이너가 수익 극대화 메시지 선택 — GasPremium 높은 순서대로' },
];
