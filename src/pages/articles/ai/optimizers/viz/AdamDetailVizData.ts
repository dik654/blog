import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Adam 수식 4단계 — m / v / 편향 보정 / 업데이트',
    body: '① 1차 모멘트: m_t = β₁·m_(t-1) + (1−β₁)·g_t. g_t = ∇L(θ_t). β₁=0.9(기본). 그래디언트의 EMA → 이동 방향.\n② 2차 모멘트: v_t = β₂·v_(t-1) + (1−β₂)·g_t². β₂=0.999(기본). 그래디언트 제곱의 EMA → 크기(분산) 추정.\n③ 편향 보정: m̂_t = m_t/(1−β₁ᵗ), v̂_t = v_t/(1−β₂ᵗ). 초기(t=1~10) m,v가 0으로 편향 → 나누어 보정. t=1일 때 1/(1−0.9¹)=10배 증폭.\n④ 업데이트: θ_(t+1) = θ_t − η · m̂_t / (√v̂_t + ε). η=1e-3(기본), ε=1e-8(0 나눗셈 방지).\n유효 학습률 = η/√v̂ — 그래디언트가 큰 파라미터는 √v̂가 커서 스텝 축소, 작은 파라미터는 확대.',
  },
  {
    label: '직관 — 파라미터별 적응적 학습률',
    body: '핵심: η/(√v̂ + ε)가 파라미터마다 다른 유효 학습률을 생성.\n희소 파라미터(예: 임베딩의 드문 단어): 그래디언트가 간헐적 → v̂ 작음 → 유효 LR 큼 → 큰 스텝으로 빠르게 학습.\n빈번한 파라미터(예: bias, 자주 등장하는 단어): 그래디언트 누적 → v̂ 큼 → 유효 LR 작음 → 안정적 업데이트.\n숫자 예시: 파라미터 A의 v̂=100, 파라미터 B의 v̂=0.01 → 유효 LR 비율 = √0.01/√100 = 0.1/10 = 1/100.\n왜 중요한가: NLP 임베딩 테이블에서 "the"는 매 배치 등장하지만 "serendipity"는 드묾 — 고정 η는 드문 단어 학습 불가.\n이 적응성이 Adam이 SGD를 NLP/Transformer에서 압도하는 핵심 이유.',
  },
  {
    label: 'Adam = Momentum + RMSProp',
    body: 'Momentum(1997): v_t = β·v + ∇L → 방향의 관성. 그래디언트 1차 모멘트 추정.\nRMSProp(2012, Hinton): v_t = β₂·v + (1−β₂)·g² → 크기 적응. 그래디언트 2차 모멘트 추정.\nAdam(2014, Kingma & Ba): 둘을 결합 + 편향 보정 추가. m이 Momentum 역할, v가 RMSProp 역할.\nm̂/(√v̂) 의 의미: 신호 대 잡음비(SNR)에 비례하는 업데이트. m̂ = 신호(평균 방향), √v̂ = 잡음(분산).\n왜 결합이 효과적인가: Momentum만으로는 스케일 적응 불가, RMSProp만으로는 관성 없음 → 둘을 합치면 방향+크기 동시 최적화.\nAdam 기본 하이퍼파라미터: β₁=0.9, β₂=0.999, ε=1e-8, η=1e-3. 대부분의 태스크에서 튜닝 없이 작동.',
  },
  {
    label: '변형들과 메모리 비용',
    body: 'Adam 메모리: 파라미터당 m, v 두 상태 → SGD 대비 3배(θ+m+v). 1B 파라미터 모델: θ=4GB → Adam 상태 8GB 추가 = 총 12GB.\nAdamax: v_t = max(β₂·v_(t-1), |g_t|) — L∞ norm 사용. 그래디언트 spike에 강건, 하이퍼파라미터 덜 민감.\nNadam: Adam + Nesterov momentum. m̂ 대신 β₁·m̂_t + (1−β₁)·g_t/(1−β₁ᵗ) 사용 → look-ahead 효과.\nAdamW: weight decay를 Adam 밖으로 분리(다음 섹션 상세). Transformer 학습 표준.\nLion(2023, Google): sign(m_t)만 사용 → m,v 대신 m만 필요, 메모리 50% 절약. η를 3~10배 줄여야 함.',
  },
];

export const COLORS = {
  adam: '#f59e0b',
  moment: '#3b82f6',
  rmsprop: '#10b981',
  variant: '#8b5cf6',
  dim: '#94a3b8',
};
