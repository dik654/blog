import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① n-gram vs Neural LM — 맥락 한계',
    body:
      'n-gram: P(wₜ | wₜ₋ₙ₊₁, ..., wₜ₋₁) — 직전 n-1개만 참조. bigram(n=2)이면 1단어만.\n' +
      'sparsity: vocab=50K, trigram → 50K³ = 125조 조합 중 대부분 미관측 → smoothing 필수.\n' +
      'Neural LM(Bengio 2003): 고정 창(n=5) + 임베딩 → sparsity 해소, but 창 밖 무시.\n' +
      'RNN LM(Mikolov 2010): hₜ = f(hₜ₋₁, xₜ) — 이론적 무한 맥락, 실질 ~20 step.\n' +
      'Penn Treebank 기준: trigram PP≈140, RNN PP≈80, LSTM PP≈60 — 맥락이 길수록 유리.',
  },
  {
    label: '② Cross-Entropy Loss + Perplexity',
    body:
      'Loss: L = -(1/T) Σₜ log P(wₜ | w₁..wₜ₋₁) — 음의 로그우도 평균.\n' +
      'P(wₜ) = softmax(V·hₜ + c): vocab 전체에 대한 확률 분포. V ∈ R^{|V|×H}.\n' +
      'vocab=10K, H=256이면 V만 2.56M 파라미터 — 전체의 ~60% 차지.\n' +
      'Perplexity: PP = exp(L). PP=100이면 "매 단어마다 100개 후보 중 고르는 수준".\n' +
      'PP=1.0이면 완벽 예측, PP=|V|이면 랜덤. 실무: PP 50-80이면 양호, 30 이하면 우수.',
  },
  {
    label: '③ 생성 전략 — Sampling & Temperature',
    body:
      'Greedy: argmax P(w) — 항상 최고 확률 선택. 반복적이고 단조로운 출력.\n' +
      'Top-k: 상위 k개만 남기고 재정규화. k=50이면 상위 50개 중 샘플링.\n' +
      'Top-p (Nucleus): 누적 확률 ≥ p인 최소 집합에서 샘플링. p=0.9가 일반적.\n' +
      'Temperature: P\'(w) = exp(logit/T) / Z. T=0.7 → 자신감 증가(sharp), T=1.5 → 다양성 증가.\n' +
      'T→0이면 greedy 수렴, T→∞이면 uniform 수렴. 실무: T=0.7~0.9 + top-p=0.9 조합.',
  },
  {
    label: '④ RNN LM의 한계와 Transformer 전환',
    body:
      'RNN LM 한계 1: 순차 처리 O(T) → GPU 병렬화 불가. T=512 문장 1개씩 처리.\n' +
      'Transformer: Self-Attention O(T²) but 모든 위치 동시 계산 → 8×GPU로 수십 배 빠름.\n' +
      'RNN LM 한계 2: 장거리 의존성. "제가 어제 __에서" 50 token 전 "파리"를 기억 못함.\n' +
      'Attention: Query·Keyᵀ로 임의 거리 직접 참조 — 위치 무관 O(1) 접근.\n' +
      'RNN의 유산: 임베딩(Word2Vec), teacher forcing, perplexity 지표 — 모두 Transformer에 계승.',
  },
];

export const NGRAM_C = '#94a3b8';
export const RNN_C = '#6366f1';
export const PRED_C = '#10b981';
export const TEMP_C = '#f59e0b';
export const TRANS_C = '#ec4899';
