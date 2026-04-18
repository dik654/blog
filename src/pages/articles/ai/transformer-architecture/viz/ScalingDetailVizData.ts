export const C = {
  kaplan: '#6366f1',
  chin: '#10b981',
  llama: '#f59e0b',
  emerg: '#ef4444',
  prac: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Kaplan 2020 -- 멱법칙 정식화',
    body: 'L(N, D, C) = a·N^(-alpha) + b·D^(-beta) + c·C^(-gamma).\nN=파라미터 수, D=데이터 토큰 수, C=연산량(FLOPs).\nalpha=0.076, beta=0.095, gamma=0.050.\n손실은 N, D, C의 멱법칙으로 예측 가능.\n세 요인 중 하나라도 부족하면 병목.\nGPT-3 학습 계획의 이론적 기반.',
  },
  {
    label: '② Chinchilla 2022 -- 최적 N:D 비율',
    body: '고정 연산 예산 C에서 최적: N_opt ~ C^0.5, D_opt ~ C^0.5.\nN과 D를 같은 비율로 스케일링 → N:D = 1:20.\nGPT-3 (175B, 300B tokens): undertrained 판정.\nChinchilla (70B, 1.4T tokens): optimal 설정.\nChinchilla가 GPT-3 성능 초과 — 더 작지만 더 많은 데이터.\nLLM 학습 패러다임 전환: "데이터가 핵심".',
  },
  {
    label: '③ LLaMA와 데이터 반복 -- Chinchilla 초과 학습',
    body: 'LLaMA-2 (7B): 2T tokens — 파라미터당 286배.\nChinchilla 비율(1:20)보다 14배 더 많은 데이터.\n추론 효율 vs 학습 효율 trade-off 의도.\n작은 모델 + 과도 학습 = 배포 시 추론 비용 절감.\nData Repetition (Muennighoff 2023): 4 epochs까지 효과.\n이후 감소 — 독점 데이터 시대의 대안으로 반복 활용.',
  },
  {
    label: '④ Emergent Abilities -- 임계 크기 효과',
    body: 'Wei 2022: 특정 파라미터 임계점에서 급격한 능력 출현.\nFew-shot, Chain-of-Thought, 산술 계산 등.\n작은 모델에는 없다가 갑자기 나타남.\n모델 설계 예산 계획: loss curve 예측 가능.\n최적 N:D 비율 결정 + compute ROI 평가.\nscaling laws가 LLM 경쟁의 전략적 도구.',
  },
];
