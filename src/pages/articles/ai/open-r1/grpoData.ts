export const grpoSteps = [
  {
    label: '1. 프롬프트 입력',
    body: '수학/코딩 문제 프롬프트가 GRPO 트레이너에 입력됩니다. 시스템 프롬프트로 추론 형식을 지정할 수 있습니다.',
  },
  {
    label: '2. 다중 응답 생성 (G=4)',
    body: 'vLLM 백엔드로 동일 프롬프트에서 4개의 응답을 병렬 샘플링합니다. temperature=0.7, top_p=0.9로 다양성을 확보합니다.',
  },
  {
    label: '3. 보상 점수 계산',
    body: '각 응답에 accuracy(0.7) + format(0.2) + tag_count(0.1) 가중치로 보상 점수를 산출합니다.',
  },
  {
    label: '4. 상대적 어드밴티지',
    body: '그룹 내 보상을 정규화하여 상대적 어드밴티지를 계산합니다. PPO와 달리 별도 베이스라인 모델이 불필요합니다.',
  },
  {
    label: '5. 정책 업데이트',
    body: 'KL 발산 계수(0.1)로 제한된 정책 그래디언트 업데이트. 높은 보상의 응답은 확률 증가, 낮은 보상은 감소합니다.',
  },
];

export const ppoVsGrpo = [
  { feature: '비교 방식', ppo: '절대적 보상 기준', grpo: '그룹 내 상대적 비교' },
  { feature: '안정성', ppo: '보상 스케일에 민감', grpo: '보상 스케일에 강건' },
  { feature: '효율성', ppo: '개별 응답 최적화', grpo: '그룹 단위 최적화' },
  { feature: '수렴성', ppo: '불안정할 수 있음', grpo: '더 안정적 수렴' },
];

export const grpoHyperparams = [
  { param: 'learning_rate', value: '3.0e-6' },
  { param: 'num_sample_generations', value: '4' },
  { param: 'response_length', value: '2048' },
  { param: 'temperature', value: '0.7' },
  { param: 'kl_coeff', value: '0.1' },
];
