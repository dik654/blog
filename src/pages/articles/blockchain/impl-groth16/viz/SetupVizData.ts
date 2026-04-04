export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Toxic waste 생성 — τ, α, β, γ, δ',
    body: '5개 랜덤 Fr — setup 후 반드시 삭제, 이 값을 알면 위조 증명 가능',
  },
  {
    label: 'QAP 다항식을 τ에서 평가 → 커브 포인트',
    body: 'QAP 다항식을 τ에서 평가 → 커브 포인트로 인코딩 (ECDLP로 τ 역추출 불가)',
  },
  {
    label: 'IC (공개) vs L (비공개) 분리',
    body: '공개 변수 → ic[j]=[lcⱼ/γ]₁(검증키), 비공개 → l[j]=[lcⱼ/δ]₁(증명키)',
  },
  {
    label: 'h_query — h(x) 계수 결합용 키',
    body: 'h_query[i]=[τⁱ·t(τ)/δ]₁ — h(x) 계수와 곱하면 QAP 만족 증거 생성',
  },
];

export const STEP_REFS = [
  'groth16-setup', 'groth16-pk', 'groth16-ic-l', 'groth16-vk',
];
export const STEP_LABELS = [
  'groth16.rs — setup() toxic waste', 'groth16.rs — ProvingKey query', 'groth16.rs — IC vs L', 'groth16.rs — h_query + VerifyingKey',
];
