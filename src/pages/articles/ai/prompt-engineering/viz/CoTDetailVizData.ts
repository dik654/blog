import type { StepDef } from '@/components/ui/step-viz';

export const COT_C = '#6366f1';
export const SC_C = '#10b981';
export const TOT_C = '#f59e0b';
export const THEORY_C = '#ef4444';

export const VARIANTS_STEPS: StepDef[] = [
  {
    label: 'Standard vs Zero-shot CoT',
    body: 'Standard: Q → A (직접 답)\n예: "Tom has 3 apples. He buys 2 more. How many?" → "5 apples."\n\nZero-shot CoT (Kojima 2022): "Let\'s think step by step" 한 줄 추가\n→ "Tom starts with 3. He buys 2 more. 3+2=5. The answer is 5."\n중간 추론 과정이 생기면서 정확도 급증',
  },
  {
    label: 'Few-shot CoT + Self-Consistency',
    body: 'Few-shot CoT (Wei 2022): 풀이 과정이 포함된 예시 제공\n→ 더 안정적인 추론, 형식도 학습\n\nSelf-Consistency (Wang 2022):\n같은 prompt로 N번 샘플링 (temp=0.7)\n각 reasoning path의 최종 답 추출 → 다수결\n수학 문제 10%+ 정확도 향상',
  },
  {
    label: 'Tree of Thoughts + ReAct',
    body: 'Tree of Thoughts (Yao 2023): 여러 reasoning path를 트리 탐색\n중간 평가·가지치기 → BFS/DFS로 최적 경로\n\nReAct (Yao 2022): Reasoning + Acting 인터리브\nThought → Action → Observation → 반복\n도구 사용과 결합 — 현대 Agent의 기반\n\nGSM8K 성능: Standard 17.9% → CoT 56.9% → SC 74.4% → ToT 76%+',
  },
];

export const THEORY_STEPS: StepDef[] = [
  {
    label: 'CoT가 효과적인 이유: Compute + Decomposition',
    body: '① Compute Allocation — 복잡한 문제에 더 많은 "생각 시간" 제공\nCoT의 intermediate token 각각이 model forward pass\n→ 추가 연산 자원을 암묵적으로 할당\n\n② Decomposition — 큰 문제를 작은 단계로 분해\n각 단계는 모델이 잘 아는 패턴\n조합적 문제를 순차적 해결로 변환',
  },
  {
    label: 'Attention Focus + Emergent Behavior',
    body: '③ Attention Focus — 중간 답안이 다음 attention에 기여\nWorking memory 역할 수행, 에러 전파 줄임\n\n④ Training Data Alignment — 인간 reasoning 텍스트에서 학습\nCoT가 분포 내(in-distribution), natural language reasoning과 유사\n\n⑤ Emergent behavior — 큰 모델에서만 나타남\n< 60B: CoT 효과 미미, ≥ 60B: 크게 향상\n"emergent ability" 임계점 존재',
  },
  {
    label: '한계 + 보완 기법',
    body: '한계:\n잘못된 reasoning도 가능 (confident errors)\n계산 오류 여전, 외부 지식 부족 시 hallucination\n토큰 비용 10배+ 증가\n\n보완 기법:\nCoT + Calculator/Code interpreter — 계산 정확도 보장\nSelf-Verify — 최종 답 검증 단계 추가\nRAG — 외부 지식 주입으로 hallucination 방지\nPAL (Program-Aided Language Models) — 코드로 reasoning',
  },
];
