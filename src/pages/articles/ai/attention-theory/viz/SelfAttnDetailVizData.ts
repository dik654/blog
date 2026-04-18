import type { StepDef } from '@/components/ui/step-viz';

export const C = { q: '#6366f1', k: '#10b981', v: '#f59e0b', mask: '#ef4444', muted: '#64748b' };

/* BERT-base dimensions */
export const D_MODEL = 768;
export const N_HEADS = 12;
export const D_K = 64;

/* Complexity comparison */
export const COMPLEXITY = [
  { model: 'RNN', time: 'O(n·d²)', parallel: '✗' },
  { model: 'Self-Attn', time: 'O(n²·d)', parallel: '✓' },
];

/* Multi-head parameter count */
export const PARAMS_QKV = 12 * 3 * (768 * 64); // 1,769,472
export const PARAMS_WO = 768 * 768;            // 589,824
export const PARAMS_TOTAL = PARAMS_QKV + PARAMS_WO; // 2,359,296

/* Head roles */
export const HEAD_ROLES = [
  { id: 0, role: '구문 (S-V)' },
  { id: 1, role: '의미 (유의어)' },
  { id: 2, role: '위치 (직전)' },
  { id: 3, role: '공참조' },
];

/* Causal mask 4x4 */
export const MASK_4x4 = [
  [0.5, -Infinity, -Infinity, -Infinity],
  [0.2, 0.6, -Infinity, -Infinity],
  [0.1, 0.3, 0.4, -Infinity],
  [0.1, 0.2, 0.3, 0.4],
];

export const STEPS: StepDef[] = [
  {
    label: 'Self-Attention: Q, K, V 선형 투영',
    body: '입력 X ∈ R^{n×768}. 세 가중치 행렬 W_Q, W_K, W_V ∈ R^{768×64}.\nQ = X·W_Q, K = X·W_K, V = X·W_V — 각각 (n, 64) 외거.\n같은 X에서 Q, K, V 모두 파생 → "Self" Attention.\nW_Q는 "무엇을 찾을까", W_K는 "나는 무엇인가", W_V는 "내 정보"를 학습.\n다른 투영이 같은 토큰을 다른 역할로 변환하는 핵심.',
  },
  {
    label: 'Attention 행렬 계산: O(n²) 병렬',
    body: 'scores = Q·Kᵀ/√64 → (n, n) 행렬. 모든 위치 쌍 유사도.\nA = softmax(scores, axis=-1) → 각 행이 확률 분포.\noutput = A·V → (n, 64). 가중 합산된 값.\n복잡도: 시간 O(n²·d), 메모리 O(n²).\nRNN O(n·d²) 순차 vs Self-Attn O(n²·d) 병렬. n<d일 때 이득.',
  },
  {
    label: 'Multi-Head: 병렬 헤드 × 12',
    body: '각 헤드는 독립 W_Qʲ, W_Kʲ, W_Vʲ 보유. dₖ = 768/12 = 64.\n헤드 0: 구문 관계 (S-V). 헤드 1: 의미 관계 (유의어).\n헤드 2: 위치 관계 (직전 토큰). 헤드 3: 공참조 (대명사-선행어).\nConcat(head₀..head₁₁) · W_O → 768차원 복원.\n파라미터: QKV 1,769,472 + W_O 589,824 = 약 236만.',
  },
  {
    label: 'Causal Mask: 미래 차단',
    body: '디코더 전용. mask[i][j] = -∞ if j>i.\nsoftmax(-∞) = 0 → 미래 토큰 정보 차단.\nGPT 스타일 autoregressive 학습의 핵심.\n하삼각 행렬: 위치 i는 0..i까지만 참조 가능.\nBERT(encoder)= mask 없음, GPT(decoder)= causal mask 적용.',
  },
];
