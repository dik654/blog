import RegularizationViz from './viz/RegularizationViz';
import L1L2Viz from './viz/L1L2Viz';
import DropoutViz from './viz/DropoutViz';

export default function Regularization() {
  return (
    <section id="regularization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정규화 기법</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        과적합(overfitting) 방지 — 의도적 방해로 일반화 성능 향상.<br />
        L1/L2, Dropout, Early Stopping 등 다양한 기법이 존재한다.
      </p>
      <RegularizationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">L1 vs L2 Regularization</h3>
        <p>
          L2 = 원형 제약 (모든 θ 작게 유지), L1 = 마름모 제약 (많은 θ=0, sparse)<br />
          기하학적으로 L1의 꼭짓점이 축 위에 있어 해가 축에 닿음 → feature selection 효과
        </p>
      </div>
      <L1L2Viz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Dropout</h3>
        <p>
          훈련 시 뉴런을 확률 p로 랜덤하게 0으로 만들어 <strong>ensemble 효과</strong> 발생<br />
          Co-adaptation 방지 → 추론 시엔 full network 사용 (inverted dropout: 출력×1/(1−p) 스케일)
        </p>
      </div>
      <DropoutViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Batch Normalization</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Batch Norm 원리
// 각 layer 입력을 batch 단위로 정규화

// 수식 (각 channel/feature별)
// μ_B = (1/m) Σ x_i          (batch mean)
// σ²_B = (1/m) Σ (x_i - μ_B)²   (batch variance)
// x̂_i = (x_i - μ_B) / √(σ²_B + ε)   (정규화)
// y_i = γ · x̂_i + β          (학습 가능 scale + shift)

// 장점
// - Internal Covariate Shift 감소
// - 더 큰 learning rate 가능
// - Regularization 효과 (noise from batch)
// - Vanishing gradient 완화

// 단점
// - Small batch size에서 성능 저하
// - Sequence length 가변 시 문제 (NLP)
// - Train/eval mode 차이 (running stats)

// 대안
// - Layer Norm: feature 차원 정규화 (Transformer 표준)
// - Group Norm: channel 그룹별 (small batch)
// - Instance Norm: sample별 (style transfer)
// - RMSNorm: mean 빼기 없이 (LLM 선호)

import torch.nn as nn

# Batch Norm (CNN)
nn.BatchNorm2d(num_features=64)

# Layer Norm (Transformer)
nn.LayerNorm(normalized_shape=512)

# RMSNorm (LLaMA)
class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(dim))
        self.eps = eps

    def forward(self, x):
        rms = x.pow(2).mean(-1, keepdim=True).sqrt()
        return x * self.weight / (rms + self.eps)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Early Stopping</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Validation loss가 증가하기 시작하면 훈련 중단

class EarlyStopping:
    def __init__(self, patience=10, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = float('inf')
        self.early_stop = False

    def __call__(self, val_loss):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True

# 사용
stopper = EarlyStopping(patience=10)
for epoch in range(100):
    train_loss = train_one_epoch()
    val_loss = validate()
    stopper(val_loss)
    if stopper.early_stop:
        print("Early stopping triggered")
        break

// 장점
// - 간단, 효과적
// - Training time 절약
// - 계산 비용 없음

// 단점
// - Validation set 필요
// - Patience 설정이 중요
// - Validation loss가 noisy할 수 있음`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Data Augmentation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 훈련 데이터를 변형하여 다양성 증가

// 이미지
import torchvision.transforms as T

transform = T.Compose([
    T.RandomHorizontalFlip(p=0.5),
    T.RandomRotation(15),
    T.ColorJitter(brightness=0.2, contrast=0.2),
    T.RandomCrop(224, padding=4),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

// NLP
// - Back-translation (L1 → L2 → L1)
// - Random word masking (BERT-style)
// - Synonym replacement
// - EDA (Easy Data Augmentation)

// Audio
// - Time shifting
// - Speed perturbation
// - SpecAugment (masking on spectrogram)

// 고급 기법
// - MixUp: 두 샘플 선형 결합
// - CutMix: 이미지 영역 교체
// - AutoAugment: 정책 자동 탐색
// - RandAugment: 간단한 random augmentation`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 정규화는 귀납적 편향(inductive bias)</p>
          <p>
            <strong>철학적 관점</strong>:<br />
            - Regularization = "모델에게 특정 가정을 강제"<br />
            - L2: "weights should be small" 가정<br />
            - Dropout: "no single neuron is indispensable" 가정<br />
            - BatchNorm: "features should have similar scale" 가정
          </p>
          <p className="mt-2">
            <strong>조합 전략 (modern DL)</strong>:<br />
            ✓ Always: Weight decay (L2) 작게 (1e-4 ~ 1e-5)<br />
            ✓ Always: Batch/Layer Norm<br />
            ✓ Often: Dropout (0.1 ~ 0.5)<br />
            ✓ Always: Data augmentation<br />
            ✓ Always: Early stopping (safety)
          </p>
          <p className="mt-2">
            <strong>스케일 고려</strong>:<br />
            - 작은 모델: 강한 regularization 필요<br />
            - 대형 LLM: 적은 regularization (데이터 자체로 충분)<br />
            - Transfer learning: regularization 줄이기 (pre-trained 가깝게)
          </p>
        </div>

      </div>
    </section>
  );
}
