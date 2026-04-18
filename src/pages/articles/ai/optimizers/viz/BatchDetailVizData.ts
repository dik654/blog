import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '3가지 변형 — Full Batch vs SGD vs Mini-batch',
    body: 'Full Batch GD: ∇L = (1/N)Σᵢ∇L(xᵢ). N=전체 데이터(예: 5만). 한 스텝에 정확한 그래디언트 → 안정적이지만, 메모리에 전체 데이터 적재 필요.\nSGD: ∇L ≈ ∇L(x_rand). 1개 샘플로 추정 → 분산 σ²가 매우 큼. 스텝당 O(1)이라 빠르지만 수렴 경로가 불안정.\nMini-batch: ∇L ≈ (1/B)Σ_b∇L(x_b). B=배치 크기(32~256). 분산 = σ²/B로 B에 비례해 감소.\n왜 Mini-batch가 표준인가: GPU는 행렬 병렬연산에 최적화 — B=1이든 B=32이든 연산 시간 거의 동일(SIMD). 32배 데이터를 같은 시간에 처리.\n예: CIFAR-10(5만 샘플), B=128 → 에폭당 390 업데이트. Full Batch는 에폭당 1 업데이트 → 390배 느린 수렴.\n핵심 트레이드오프: B↑ → 그래디언트 분산↓, 하지만 스텝 수↓ + 메모리↑ + 일반화↓(sharp minima).',
  },
  {
    label: '배치 크기 효과 — 작을수록 탐색, 클수록 안정',
    body: 'Small(8~32): 그래디언트 노이즈가 크면 손실 지형의 sharp minima를 탈출 → flat minima에 수렴 → 테스트 일반화 우수(Keskar et al., 2017).\nMedium(64~256): GPU 코어 활용률 80%+ 달성. 노이즈와 안정성의 최적 균형 → 대부분 실험의 기본값.\nLarge(512~8K): 그래디언트 추정이 정확해져 수렴 안정적, 하지만 sharp minima에 수렴할 확률 증가 → 일반화 갭(generalization gap) 발생.\n해결: LR 선형 스케일링 — B가 k배 → η도 k배. 예: B=256, η=0.1 → B=8192, η=3.2.\nVery Large(32K+): 선형 스케일링이 불안정 → LARS(layer-wise adaptive), LAMB(layer-wise Adam) 필요.\nGPT-3 사례: 배치 32K 토큰, LAMB 없이 gradient accumulation으로 달성. 초반 warmup 필수.',
  },
  {
    label: 'Gradient Accumulation — 작은 메모리로 큰 배치 시뮬레이션',
    body: '원리: N개 미니배치의 그래디언트를 합산(∇L_accum += ∇L_i)하고, N스텝마다 한 번 θ 업데이트.\n유효 배치: effective_batch = N × micro_batch. 예: micro=4, N=8 → effective=32.\n수학적으로 B=32를 한 번에 계산하는 것과 동일 — (1/32)Σ∇L = (1/8)Σ(1/4·Σ∇L_micro).\n왜 필요한가: 7B 파라미터 LLM + 시퀀스 2048 → 단일 샘플 활성화 메모리만 ~12GB. B=32는 384GB 필요 → 단일 GPU 불가.\n구현 주의: loss를 N으로 나눠야 함(loss /= N). 안 나누면 유효 LR이 N배 → 발산.\nBatchNorm과의 충돌: BN 통계는 micro_batch 기준으로 계산 → 작은 micro_batch에서 BN 불안정. GroupNorm/LayerNorm 사용 권장.',
  },
  {
    label: '실전 권장 — 태스크별 배치 크기 + LR 스케일링',
    body: '태스크별 권장: CNN(ResNet): B=128~512, η=0.1. Transformer(BERT): B=32~128, η=1e-4~3e-4. LLM(GPT): micro=1~4 + accumulation → effective 32K+.\nLR 선형 규칙: η_new = η_base × (B_new/B_base). 예: B=256→1024이면 η ×4. Goyal et al.(2017) FAIR 논문에서 제안.\nLR sqrt 규칙: η_new = η_base × √(B_new/B_base). 대규모 배치(B>4K)에서 선형보다 안전. Hoffer et al.(2017).\nwarmup 필수: 큰 배치에서 초기 η가 크면 파라미터가 랜덤 초기값 근처에서 발산. 5~10% 스텝을 warmup에 할당.\nGPU VRAM: 활성화 메모리(activation) + 파라미터 + 옵티마이저 상태 합산. VRAM의 50~80% 사용이 sweet spot — 100%에 가까우면 OOM 위험.\n배치 크기 탐색: 2의 거듭제곱(32, 64, 128...)이 GPU 텐서 코어 정렬에 유리 → 비2의배수 대비 10~20% 처리량 차이.',
  },
];

export const COLORS = {
  full: '#3b82f6',
  sgd: '#ef4444',
  mini: '#10b981',
  accum: '#8b5cf6',
  dim: '#94a3b8',
};
