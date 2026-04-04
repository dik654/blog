export const roadmapSteps = [
  {
    label: 'Step 1: R1-Distill',
    status: 'done' as const,
    desc: 'DeepSeek-R1에서 추론 데이터 증류 → 350k Mixture-of-Thoughts 데이터셋 + OpenR1-Distill-7B',
  },
  {
    label: 'Step 2: R1-Zero (RL)',
    status: 'active' as const,
    desc: 'GRPO 알고리즘으로 순수 강화학습 기반 추론 능력 학습 파이프라인 구축',
  },
  {
    label: 'Step 3: E2E Pipeline',
    status: 'planned' as const,
    desc: '기본 모델 → SFT → RL 튜닝 전체 과정을 통합한 end-to-end 파이프라인',
  },
];

export const benchmarks = [
  { name: 'AIME 2024', openr1: 52.7, deepseek: 51.3 },
  { name: 'MATH-500', openr1: 89.0, deepseek: 93.5 },
  { name: 'GPQA Diamond', openr1: 52.8, deepseek: 52.4 },
  { name: 'LiveCodeBench v5', openr1: 39.4, deepseek: 37.4 },
];

export const projectTree = `open-r1/
├── src/open_r1/
│   ├── sft.py          # SFT 학습
│   ├── grpo.py         # GRPO 강화학습
│   ├── generate.py     # 합성 데이터 생성
│   ├── rewards.py      # 보상 함수
│   └── utils/          # 유틸리티
├── recipes/            # YAML 훈련 레시피
├── scripts/            # 평가 스크립트
└── slurm/              # 클러스터 실행`;
