export const STEPS = [
  {
    label: 'Decoder 구조: z → 은닉층 → 출력',
    body: 'fc1: latent_dim → hidden_dim (ReLU).\nfc2: hidden_dim → output_dim (sigmoid).\nMNIST: Decoder(20, 400, 784) → 28x28 reshape.',
  },
  {
    label: '출력 분포 선택',
    body: 'Bernoulli: 이진 이미지 — sigmoid + BCE 손실.\nGaussian: 연속 픽셀 — linear + MSE 손실.\nCategorical: 256단계 컬러 — softmax.',
  },
  {
    label: 'Conv Decoder (이미지 생성)',
    body: 'Linear(latent, 4x4x256) → Reshape.\nConvTranspose(256→128, stride=2) → 8x8.\nConvTranspose(128→64, stride=2) → 16x16.\nConvTranspose(64→3, stride=2) → 32x32x3.',
  },
];
