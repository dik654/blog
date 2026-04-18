export const STEPS = [
  {
    label: '① MLP 기반 오토인코더 (MNIST)',
    body: 'Encoder: 784 → fc1(256, ReLU) → fc2(128, ReLU) → fc3(64, ReLU) → fc4(32, Linear). 병목 z ∈ R^32.\nDecoder: 32 → fc5(64, ReLU) → fc6(128, ReLU) → fc7(256, ReLU) → fc8(784, Sigmoid).\nSigmoid 출력: σ(x) = 1/(1+e^{-x}) → 범위 [0,1]. MNIST 픽셀값 [0,1]과 직접 대응.\n총 파라미터: 인코더 약 235K + 디코더 약 235K ≈ 470K. MNIST 60K 학습 이미지로 충분히 학습 가능.\n각 층의 역할: 784→256에서 3배 압축(중복 제거), 256→128(패턴 추출), 128→64(구조 추상화), 64→32(핵심 보존).\nBatch 128, Adam lr=1e-3, 50 에포크로 MSE ≈ 0.01 수렴. 재구성 이미지가 원본과 시각적으로 유사.',
  },
  {
    label: '② CNN 기반 Convolutional AE',
    body: 'Encoder: Conv2d(1→16, 3×3, stride=2, pad=1) → ReLU → Conv2d(16→32, 3×3, stride=2) → ReLU → Flatten → Linear(z).\n28×28 → 14×14(stride=2) → 7×7(stride=2) → 32×7×7=1568 → z ∈ R^64. 공간 구조를 보존하며 압축.\nDecoder: ConvTranspose2d로 역과정. 7×7 → 14×14 → 28×28. checkerboard artifact 방지 위해 stride=2 + padding 조정.\nMLP 대비 장점: 인접 픽셀 관계(엣지, 텍스처)를 합성곱 필터가 자동 학습. 파라미터 수도 적음(가중치 공유).\nMLP AE 파라미터 ≈ 470K vs Conv AE ≈ 50K. 10배 적은 파라미터로 유사하거나 더 나은 재구성 품질.\nCIFAR-10(3×32×32): Conv AE MSE 0.008 vs MLP AE MSE 0.025 — 컬러 이미지에서 차이가 더 극적.',
  },
  {
    label: '③ Bottleneck 크기 선택 — underfitting vs overcomplete',
    body: 'k(병목 차원)가 너무 작으면: 필수 정보도 소실 → reconstruction MSE 높음 (underfitting).\nk가 너무 크면(k ≥ n): 항등 함수 학습 가능 → 압축이 안 일어남 (overcomplete).\nOvercomplete AE도 유용: Sparse AE, Denoising AE는 k > n에서도 정규화로 의미 있는 표현 학습.\n경험적 법칙: k ≈ sqrt(n) × 2. MNIST(n=784) → k ≈ 56. 실험으로 10~64 범위 탐색.\n검증 방법: validation set의 reconstruction error를 k 값별로 측정 → elbow point 선택.\n실무 팁: k를 2의 거듭제곱(8, 16, 32, 64)으로 설정하면 GPU 메모리 정렬에 유리.',
  },
  {
    label: '④ 데이터셋별 권장 잠재 차원',
    body: 'MNIST(784차원, 10 클래스): k=10~32. 손글씨 구조가 단순하여 10차원으로도 숫자 구분 가능. k=2면 2D 시각화용.\nCIFAR-10(3072차원, 10 클래스): k=64~128. 컬러+복잡 형태 → 더 많은 잠재 변수 필요.\nCelebA(12288차원, 얼굴): k=128~512. 표정, 조명, 포즈 등 변동 요인이 다양.\nImageNet(150528차원, 1000 클래스): k=256~1024. Stable Diffusion은 latent 4×64×64=16384 사용.\n시계열(센서 데이터): k=8~20. 진동 패턴, 주기성 등 소수 요인으로 설명 가능한 경우 많음.\n결정 기준: 데이터의 본질 차원(intrinsic dimensionality)에 비례. PCA explained variance로 사전 추정 가능.',
  },
];

export const C = {
  enc: '#6366f1',
  lat: '#f59e0b',
  dec: '#10b981',
  cnn: '#8b5cf6',
  warn: '#ef4444',
  ok: '#22c55e',
  muted: '#94a3b8',
};
