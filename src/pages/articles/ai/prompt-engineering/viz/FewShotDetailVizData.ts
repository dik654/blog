import type { StepDef } from '@/components/ui/step-viz';

export const SHOT_C = '#6366f1';
export const DIVERSITY_C = '#10b981';
export const ICL_C = '#f59e0b';
export const THEORY_C = '#ef4444';

export const DESIGN_STEPS: StepDef[] = [
  {
    label: 'N-shot: 0 → 1에서 가장 큰 점프',
    body: '0-shot: 예시 없음, 지시만 → 형식 불일치 빈발\n1-shot: 1개 예시 → 가장 큰 개선 (형식 학습)\n3-5 shot: 실무 표준 — 비용 대비 효과 최적\n10+ shot: 수확 체감, context window 부담 증가\nGPT-3 SuperGLUE: 0-shot 67.5 → 1-shot 71.9 (+4.4) → 32-shot 73.2 (+1.3)',
  },
  {
    label: '다양성 + 형식 일관성',
    body: '나쁜 예 (감정 분석): 긍정 3개만 → 부정 예시 없음\n좋은 예: "최고 영화"→긍정, "지루한 2시간"→부정, "그럭저럭"→중립\n다양한 카테고리 커버 + 엣지 케이스 포함\n\n형식 규칙: 모든 예시가 같은 포맷 사용\n라벨 이름 통일 (POSITIVE vs positive), 구분자 일관 (":" vs "→")',
  },
  {
    label: '순서 효과 (Recency Bias) + 동적 선택',
    body: 'LLM은 최근 예시에 더 영향받음 (Recency Bias)\n대표 예시를 마지막에 배치하거나 순서 셔플로 편향 완화\nA/B 테스트로 최적 순서 탐색\n\n동적 예시 선택 (Retrieval): 질문과 유사한 예시를 k-NN 임베딩 검색\nDynamic prompting — 질문마다 최적 예시 조합이 달라짐',
  },
];

export const ICL_STEPS: StepDef[] = [
  {
    label: 'ICL 이론: Bayesian Meta-Learning + Gradient Simulation',
    body: 'Brown et al. 2020: "모델이 런타임에 예시로부터 패턴 학습"\n파라미터 업데이트 없음 — purely attention/forward-pass 기반\n\n이론 1) Bayesian Meta-Learning: 사전학습 = 태스크 분포 학습, ICL = 특정 태스크 추론\n이론 2) Gradient Descent Simulation: Transformer attention이 implicit gradient\n각 예시 처리 = 1-step 업데이트 (Akyurek 2022, Von Oswald 2023)',
  },
  {
    label: 'Induction Heads + 형식이 라벨보다 중요',
    body: 'Induction Heads (Olsson 2022, Anthropic)\n특정 attention head가 "A→B, C→D" 같은 매핑 패턴 복사\n\n놀라운 발견 (Min et al. 2022):\n라벨을 랜덤 셔플해도 성능 유지!\n→ 형식/분포가 라벨 정확도보다 중요\n→ 예시의 "구조"가 진짜 역할을 수행',
  },
  {
    label: 'Claude Few-shot 최적화',
    body: 'Claude 3 Few-shot 권장사항:\nXML 태그로 예시 구분 — <example>...</example>\nSystem prompt에 예시 배치 (매 턴 반복)\n\nZero-shot vs Few-shot 비교 (GPT-3 175B, SuperGLUE):\n0-shot: 67.5 | 1-shot: 71.9 (+4.4) | 32-shot: 73.2 (+1.3)\n가장 큰 개선은 0→1 shot, 이후 수확 체감',
  },
];
