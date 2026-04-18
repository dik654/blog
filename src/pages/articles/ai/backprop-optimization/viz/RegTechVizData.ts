export const STEPS = [
  {
    label: 'Batch Normalization 수식',
    body: 'BN 4단계 파이프라인:\n① batch mean: μ_B = (1/m) Σxᵢ — m개 샘플의 평균\n② batch variance: σ²_B = (1/m) Σ(xᵢ − μ_B)² — 분산 계산\n③ 정규화: x̂ᵢ = (xᵢ − μ_B) / √(σ²_B + ε), ε=1e-5(0 나눗셈 방지)\n④ scale+shift: yᵢ = γ·x̂ᵢ + β — γ, β는 학습 가능한 파라미터\n왜 γ, β? 정규화만 하면 표현력 손실. γ=σ, β=μ로 학습하면 원래 분포 복원 가능.\n장점: 큰 learning rate 사용 가능 / gradient 안정 / 암묵적 정규화 효과.\n주의: batch size < 16이면 μ, σ 추정 불안정 → LayerNorm 사용.',
  },
  {
    label: 'Normalization 변형 비교',
    body: '정규화 대상 차원에 따라 4가지 변형:\nBatchNorm(BN): 같은 feature의 batch 전체를 정규화 → CNN 표준\nLayerNorm(LN): 한 샘플의 모든 feature를 정규화 → Transformer 표준\nGroupNorm(GN): 채널을 G개 그룹으로 묶어 각 그룹 정규화 → small batch에 강건\nRMSNorm: 평균 제거 없이 RMS=√(1/n Σxᵢ²)만으로 정규화 → LLaMA/Gemma 표준\nRMSNorm이 LN보다 연산 절약(mean 불필요), 성능은 유사.\n선택 기준: CNN→BN, Transformer→LN, LLM→RMSNorm, small batch→GN.',
  },
  {
    label: 'Early Stopping',
    body: 'val loss가 상승하기 시작하면 과적합(overfitting) 신호.\npatience = 연속 N epoch 동안 val loss 개선 없으면 훈련 중단.\n예: patience=3, epoch 5에서 val=0.46(best)\nepoch 6: val=0.48(cnt=1) → epoch 7: val=0.52(cnt=2) → epoch 8: val=0.58(cnt=3) → STOP!\nbest epoch(5)의 체크포인트에서 모델 복원.\n장점: 추가 계산 비용 0 — 단지 val loss를 관찰만 하면 됨.\nmin_delta: 개선 판단 기준 (0이면 조금이라도 나빠지면 카운트).\n실전: patience=5~10, 체크포인트 저장 주기와 맞춰 설정.',
  },
  {
    label: 'Data Augmentation — 이미지',
    body: '이미지 변환 파이프라인 — 원본을 다양하게 변형하여 학습 데이터 증가:\nFlip: 좌우 반전(p=0.5) — 대칭적 물체에 효과적\nRotate: ±15도 회전 — 기울어진 입력에 대한 불변성\nCrop: 랜덤 자르기(224×224) — 위치 불변성 + scale 변화\nJitter: 색상(brightness, contrast, saturation) 변형 — 조명 변화 대응\nPyTorch: T.Compose([RandomHorizontalFlip(0.5), RandomRotation(15),\n  ColorJitter(0.2), RandomCrop(224)])\n매 epoch마다 다른 변형 적용 → 실질적으로 데이터 수배 증가 효과.',
  },
  {
    label: '고급 Augmentation',
    body: 'MixUp(Zhang 2018): x̃ = λx₁ + (1−λ)x₂, ỹ = λy₁ + (1−λ)y₂\nλ~Beta(α,α), α=0.2. 두 이미지를 선형 결합 → 결정 경계 평활화.\nCutMix: 이미지의 사각 영역을 다른 이미지로 교체, 라벨도 면적 비율로 혼합.\nMixUp은 전체 블렌딩, CutMix은 영역 교체 → localization 능력 강화.\nNLP: Back-translation(번역 후 재번역), Random masking(토큰 치환)\nAudio: SpecAugment(시간/주파수 축 마스킹)\n자동화: AutoAugment(RL로 정책 탐색), RandAugment(N개 변환 랜덤, 강도 M),\nTrivialAugment(단일 변환, 랜덤 강도) — 하이퍼파라미터 탐색 비용 절약.',
  },
];

export const C = {
  bn: '#3b82f6',
  ln: '#10b981',
  stop: '#ef4444',
  aug: '#f59e0b',
  mix: '#8b5cf6',
  dim: '#94a3b8',
};
