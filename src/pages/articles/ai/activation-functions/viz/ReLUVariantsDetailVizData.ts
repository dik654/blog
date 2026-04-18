import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Leaky/PReLU — 음수 기울기 부여',
    body: 'Leaky ReLU: f(x) = x (x>0), αx (x≤0). α=0.01 고정.\n예: x=−3 → f=0.01×(−3)=−0.03. gradient=0.01 → 작지만 0은 아님 → 뉴런이 살아있다.\nPReLU(He et al., 2015): f(x) = x (x>0), αᵢx (x≤0). αᵢ를 역전파로 학습.\n채널마다 αᵢ가 다른 값으로 수렴 — 어떤 채널은 α≈0.1, 어떤 채널은 α≈0.001.\nImageNet에서 PReLU가 ReLU 대비 top-5 error 0.3~0.5% 개선(He 2015).\n그러나 파라미터 추가 + 과적합 위험 때문에 실무에선 ReLU가 여전히 기본 선택.\n소규모 데이터셋에서는 LeakyReLU(α=0.01 고정)가 PReLU보다 안정적.',
  },
  {
    label: 'ELU/SELU — smooth 곡선으로 mean 이동',
    body: 'ELU(Clevert, 2015): f(x) = x (x>0), α(eˣ−1) (x≤0). 보통 α=1.0.\n예: x=−1 → f=1.0×(e⁻¹−1)=1.0×(0.368−1)=−0.632. x→−∞일 때 f→−α로 포화.\n음수 포화(saturation)가 noise에 대한 robustness 제공 + 평균 출력을 0 근처로 이동.\nSELU(Klambauer, 2017): f(x) = λ·x (x>0), λ·α(eˣ−1) (x≤0).\nα≈1.6733, λ≈1.0507 — 이 수치는 고정점(fixed-point) 방정식에서 수학적으로 유도.\nself-normalizing: 각 층 출력이 평균 0, 분산 1로 자동 수렴 → BatchNorm 불필요.\n단, FC(fully connected) 네트워크 + LeCun init + AlphaDropout 조합에서만 보장.\nCNN/RNN에서는 이론적 전제가 깨져 효과 제한적 — exp 연산 비용도 ReLU 대비 5~10배.',
  },
  {
    label: 'GELU — Transformer 표준 활성함수',
    body: 'GELU(Hendrycks & Gimpel, 2016): f(x) = x · Φ(x). Φ는 표준정규 CDF.\nΦ(x) = P(Z≤x), Z~N(0,1). 직관: "x가 클수록 통과 확률이 높아진다".\n예: x=2 → Φ(2)≈0.977 → f(2)=2×0.977=1.954 (거의 그대로 통과).\nx=−2 → Φ(−2)≈0.023 → f(−2)=−2×0.023=−0.046 (거의 차단).\nΦ는 적분 형태라 직접 계산 비용이 높음 → tanh 근사 사용:\nf(x) ≈ 0.5·x·(1 + tanh(√(2/π)·(x + 0.044715·x³))). 오차 < 0.004.\nBERT, GPT-2/3, T5, ViT가 모두 GELU 채택 — Transformer FFN 표준.\nReLU와의 차이: 음수 입력을 완전히 0으로 자르지 않고 확률적으로 통과시킴 → Dropout과 유사한 stochastic regularization 효과.',
  },
  {
    label: 'Swish/SiLU — NAS가 발견한 비단조 함수',
    body: 'Swish(Ramachandran et al., 2017): f(x) = x · σ(βx). σ는 sigmoid, β는 스케일 파라미터.\nGoogle이 NAS(Neural Architecture Search)로 자동 탐색하여 발견 — 인간 직관이 아닌 최적화 결과.\nSiLU = Swish(β=1): f(x) = x · σ(x) = x / (1 + e⁻ˣ). PyTorch에서 F.silu()로 제공.\n비단조(non-monotonic): x≈−1.28에서 최소값 ≈−0.278. 음수 영역에서 살짝 음수 출력.\n예: x=3 → σ(3)≈0.953 → f=2.858 | x=−1 → σ(−1)≈0.269 → f=−0.269.\n도함수: f\'(x) = σ(x) + x·σ(x)·(1−σ(x)) = σ(x)·(1 + x·(1−σ(x))).\nHard Swish: x·min(max(x+3, 0), 6)/6 — sigmoid 제거로 mobile에서 연산 2배 빠름.\nEfficientNet, MobileNetV3, 초기 LLaMA 실험에서 채택.',
  },
  {
    label: 'GLU → SwiGLU — LLM 2022+ 표준',
    body: 'GLU(Dauphin et al., 2017): f(x) = (W₁·x + b₁) ⊙ σ(W₂·x + b₂).\nW₁은 값(value) 경로, W₂는 gate 경로 — σ 출력이 0~1로 정보 흐름을 제어.\n⊙는 element-wise 곱. gate가 0이면 차단, 1이면 통과 — 선택적 정보 필터링.\nSwiGLU(Shazeer, 2020): gate의 σ를 Swish로 교체.\nf(x) = (W₁·x) ⊙ Swish(W₂·x), 최종 출력 = W₃ · f(x).\nW₁, W₂, W₃ 세 개의 행렬 → 기존 FFN(W₁, W₂) 대비 파라미터 1.5배.\n보상: d_ff를 (2/3)·4d_model로 줄여 총 파라미터 수를 유사하게 유지.\n예: d_model=4096이면 기존 d_ff=16384, SwiGLU d_ff=10922(≈2/3×16384).\nLLaMA(2023), PaLM(2022), Mixtral(2024) 등 최신 LLM의 FFN 표준으로 정착.',
  },
];

export const COLORS = {
  leaky: '#f59e0b',
  elu: '#10b981',
  gelu: '#8b5cf6',
  swish: '#3b82f6',
  glu: '#ef4444',
  dim: '#94a3b8',
};
