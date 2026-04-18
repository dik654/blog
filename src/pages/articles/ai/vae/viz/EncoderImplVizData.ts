export const STEPS = [
  {
    label: 'Encoder 구조: 2개 출력 헤드',
    body: 'fc1: input_dim → hidden_dim (ReLU 활성화).\nfc_mu: hidden_dim → latent_dim (평균 벡터).\nfc_logvar: hidden_dim → latent_dim (로그 분산).\nMNIST 표준: Encoder(784, 400, 20).',
  },
  {
    label: 'log σ²를 쓰는 이유',
    body: '양수 보장: σ² > 0 ⇔ log σ² ∈ R — 네트워크가 자유롭게 실수 출력.\n수치 안정성: sigmoid/softplus 불필요, 기울기 포화 없음.\nKL 효율: KL 공식에 log σ²가 그대로 등장, 추가 변환 불필요.',
  },
  {
    label: '실무 변형',
    body: 'Conv Encoder: CNN으로 이미지 특징 추출.\n깊은 MLP: 4~6층, Dropout·BatchNorm 추가.\nGELU 활성화: ReLU 대비 부드러운 전환.\n출력은 항상 (μ, log σ²) 쌍.',
  },
];
