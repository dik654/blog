import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Adam + L2 문제 — v가 decay 효과를 약화',
    body: 'L2 정규화: 손실에 (λ/2)·||θ||² 추가 → 그래디언트에 λ·θ 항이 더해짐. g_t = ∇L(θ) + λ·θ.\nAdam에서 이 g_t가 m_t와 v_t에 모두 흡수됨: v_t = β₂·v + (1−β₂)·(∇L + λ·θ)².\n문제: v̂가 커지면 업데이트 크기가 η/√v̂로 줄어듦 → λ·θ의 decay 효과도 함께 축소.\n구체적으로: 그래디언트가 큰 파라미터는 v̂가 크므로 decay가 약해지고, 작은 파라미터는 v̂가 작으므로 decay가 강해짐 → 불균등.\n예: θ₁의 g=10 → v̂≈100 → λ·θ₁/√100 = λ·θ₁/10. θ₂의 g=0.1 → v̂≈0.01 → λ·θ₂/√0.01 = λ·θ₂·10. decay가 1000배 차이.\nLoshchilov & Hutter(2019): 이 문제를 "L2 regularization ≠ weight decay in adaptive methods"로 정식 지적.',
  },
  {
    label: 'AdamW 해법 — decay를 Adam 밖으로 분리',
    body: 'AdamW 수식: θ_(t+1) = θ_t − η · m̂_t/(√v̂_t + ε) − η · λ · θ_t. 두 번째 항이 핵심.\nAdam(L2)와 차이: Adam은 λ·θ를 g에 포함 → v가 왜곡. AdamW는 λ·θ를 Adam 업데이트 바깥에서 별도 적용.\n결과: decay 비율이 모든 파라미터에 균등하게 λ → v̂에 의한 왜곡 없음.\n왜 "decoupled"인가: m̂/(√v̂+ε) = Adam의 적응적 업데이트(방향+크기), λ·θ = weight decay(정규화). 두 관심사를 분리.\n구현: PyTorch AdamW(params, lr=1e-3, weight_decay=0.01). torch.optim.Adam에 weight_decay를 넣으면 L2(잘못된 방식).\n기본값: λ=0.01~0.1, η=1e-3~5e-4. BERT: λ=0.01, GPT-2: λ=0.1, LLaMA: λ=0.1.',
  },
  {
    label: 'LLM 훈련 표준 — warmup + cosine decay',
    body: '3단계 LR 스케줄: ① warmup(전체의 1~5%): η를 0 → η_peak까지 선형 증가. 초기 랜덤 파라미터에서 큰 η는 발산.\n② cosine decay: η_t = η_min + ½(η_peak − η_min)(1 + cos(πt/T)). 부드러운 감소로 fine-grained 수렴.\n③ 최종 LR: η_peak의 10%(η_min = η_peak/10). GPT-3: η_peak=6e-4, η_min=6e-5.\nGPT-3 설정: AdamW(β₁=0.9, β₂=0.95, ε=1e-8), η=6e-4, λ=0.1, warmup 375M 토큰, cosine decay over 300B 토큰.\nBERT 설정: AdamW(β₁=0.9, β₂=0.999), η=1e-4, λ=0.01, warmup 10K steps. fine-tune 시 η=2e-5~5e-5.\nLLaMA-2 설정: AdamW(β₁=0.9, β₂=0.95), η=3e-4, λ=0.1, warmup 2000 steps, cosine to η/10.',
  },
  {
    label: '대안 옵티마이저 — Lion, 8-bit Adam, Shampoo',
    body: 'Lion(2023, Google Brain): θ -= η · sign(β₁·m + (1−β₁)·g). sign만 사용 → ±η 크기 업데이트. m만 저장(v 불필요) → 메모리 AdamW 대비 ~50% 절약.\nLion 주의: sign 기반이라 η를 AdamW의 3~10배 작게(예: 1e-4 → 3e-5). weight_decay는 3~10배 크게.\n8-bit Adam(bitsandbytes): m, v를 FP32 대신 INT8로 양자화. 블록 단위 동적 양자화 → 정밀도 손실 최소. 70B 모델 fine-tune 시 옵티마이저 메모리 4배 절약.\nShampoo(2018, Google): 2차 정보(Hessian 근사) 활용. 파라미터 행렬의 좌·우 프리컨디셔너 L, R 유지 → θ -= η·L·g·R. 수렴 40~60% 빠르지만 연산량 증가.\nAdafactor(2018): v를 행·열 통계로 분해 → 메모리 O(nm) → O(n+m). T5, PaLM 학습에 사용.\nSophia(2023): Hessian 대각 근사로 2차 정보를 저비용 활용. LLM pre-training에서 Adam 대비 2배 빠른 수렴 보고.',
  },
];

export const COLORS = {
  problem: '#ef4444',
  fix: '#10b981',
  llm: '#8b5cf6',
  alt: '#f59e0b',
  dim: '#94a3b8',
};
