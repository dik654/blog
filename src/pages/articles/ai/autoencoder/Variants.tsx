import VariantsViz from './viz/VariantsViz';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">변형</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Denoising(노이즈 강인), Sparse(희소 특징), VAE(확률 분포 생성).<br />
        각 변형은 기본 오토인코더에 제약 조건을 추가한 것.
      </p>
      <VariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 변형 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Denoising Autoencoder (DAE)
//    아이디어: 오염된 입력 → 원본 복원
//    x_noisy = x + noise
//    loss = ||x - decoder(encoder(x_noisy))||²
//
//    장점:
//      - 단순 복사 방지 (over-fitting 억제)
//      - Robust 표현 학습
//      - 노이즈 제거 응용 직접 가능
//
//    노이즈 유형:
//      - Gaussian noise
//      - Masking noise (일부 dropout)
//      - Salt-and-pepper noise
//
// 2. Sparse Autoencoder
//    아이디어: 활성화되는 뉴런 수 제한
//    L_total = MSE + λ·Σ |z_i|  (L1 regularization)
//    또는 KL(ρ || ρ̂_j) 활용
//
//    장점:
//      - 해석 가능한 특징 추출
//      - overcomplete 설정에서도 의미 학습
//      - edge detector 같은 특징 발견 (V1 뉴런 유사)
//
// 3. Contractive Autoencoder (CAE)
//    아이디어: 입력 변화에 둔감한 z 학습
//    L_total = MSE + λ·||J_enc(x)||_F²
//
//    Jacobian Frobenius norm penalty
//    → 지역적으로 invariant한 표현
//
// 4. Variational Autoencoder (VAE)
//    아이디어: 잠재 공간에 확률 분포 제약
//    Encoder 출력: μ(x), σ(x) (정규분포 파라미터)
//    z ~ N(μ, σ²)
//    L = Reconstruction + β·KL(q(z|x) || p(z))
//
//    장점:
//      - 연속적 잠재 공간
//      - 샘플링으로 생성 가능
//      - 생성 모델로 확장
//
// 5. Adversarial Autoencoder (AAE)
//    아이디어: GAN + AE 결합
//    Discriminator가 z 분포를 target에 맞춤
//    → VAE 대체 (KL 없이 prior 강제)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">변형별 특성 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ┌──────────────┬──────────┬──────────┬──────────┐
// │    변형      │  목적    │ 추가 제약│  활용    │
// ├──────────────┼──────────┼──────────┼──────────┤
// │ Vanilla AE   │ 압축     │ 없음     │ 임베딩   │
// │ Denoising AE │ robust   │ noise    │ 노이즈제거│
// │ Sparse AE    │ 해석성   │ L1/KL    │ 특징추출 │
// │ Contractive  │ robust   │ Jacobian │ invariant│
// │ VAE          │ 생성     │ KL div   │ 생성모델 │
// │ β-VAE        │ disentan.│ β·KL     │ 제어가능 │
// │ VQ-VAE       │ 이산 z   │ codebook │ 언어모델 │
// │ MAE          │ SSL      │ masking  │ 사전학습 │
// └──────────────┴──────────┴──────────┴──────────┘
//
// 선택 가이드:
//   단순 차원 축소     → Vanilla AE
//   이미지 전처리      → Denoising AE
//   특징 시각화       → Sparse AE
//   이미지 생성        → VAE / VQ-VAE
//   대규모 사전학습    → MAE
//   해석 가능 AI       → β-VAE
//
// 조합 사례:
//   Sparse + Denoising → 로버스트 특징 학습
//   VQ-VAE + Transformer → DALL-E, Parti
//   VAE + Diffusion → Latent Diffusion Models`}
        </pre>
        <p className="leading-7">
          요약 1: 각 변형은 <strong>손실 함수 또는 구조에 제약</strong> 추가 — 목적에 맞게 선택.<br />
          요약 2: <strong>VAE</strong>는 생성 모델의 관문, <strong>VQ-VAE</strong>는 이미지-언어 연결 고리.<br />
          요약 3: 2022년 이후 <strong>MAE 스타일 masking</strong>이 자기지도 학습의 표준.
        </p>
      </div>
    </section>
  );
}
