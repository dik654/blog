import type { StepDef } from '@/components/ui/step-viz';

export const PRINCIPLE_C = '#6366f1';
export const EXAMPLE_C = '#10b981';
export const HISTORY_C = '#f59e0b';
export const ERA_C = '#ef4444';

export const PRINCIPLES_STEPS: StepDef[] = [
  {
    label: '원칙 1-2: Clarity + Context',
    body: '① Clarity (명확성) — 구체적이고 모호하지 않은 지시\n나쁜 예: "좋은 글을 써줘"\n좋은 예: "500자 기술 블로그 글, 3개 섹션, 각 150자"\n→ 원하는 출력 형식을 명시할수록 LLM 출력이 예측 가능\n\n② Context (컨텍스트) — 배경 정보, 도메인, 목적 설명\n"전자상거래 사이트의 제품 설명" 같이 타겟 독자·상황을 명시\nLLM은 주어진 맥락에 맞춰 어조와 전문성 수준을 자동 조정',
  },
  {
    label: '원칙 3-4: Examples + Role',
    body: '③ Examples (예시) — 입출력 쌍 제공 (Few-shot)\n원하는 스타일/포맷 시연 + 엣지 케이스 포함\n1-shot만으로도 형식 일관성이 크게 향상\n\n④ Role Assignment (역할 부여)\n"너는 경험 많은 Python 개발자다"\n전문성·어조·관점을 설정하여 일관성 유지\nLLM이 해당 도메인의 학습 데이터를 우선 참조하게 됨',
  },
  {
    label: '원칙 5-6: Structure + Iteration',
    body: '⑤ Structure (구조화) — 번호·불릿·XML 태그 활용\n지시/컨텍스트/질문을 명확히 구분\n섹션 헤더로 가독성 확보 → LLM 파싱 정확도 ↑\n\n⑥ Iteration (반복 개선) — 초안 → 테스트 → 개선\nA/B 테스트로 어떤 프롬프트가 더 나은지 비교\n에러 패턴 분석하여 점진적으로 정교화',
  },
  {
    label: 'LLM 입력 구조 — 6개 블록 템플릿',
    body: '[시스템 메시지] 역할·배경·제약\n[컨텍스트] 배경 지식·참고 자료\n[지시] 구체적 태스크 기술\n[예시 (Few-shot)] Input: ... → Output: ...\n[입력] 실제 질문/데이터\n[출력 형식] JSON/XML 스키마 명시\n→ 이 6개를 순서대로 채우면 대부분의 프롬프트 커버 가능',
  },
];

export const HISTORY_STEPS: StepDef[] = [
  {
    label: '2018-2020: GPT-1 → GPT-3, In-context Learning 혁명',
    body: '2018 GPT-1 — 태스크별 fine-tuning이 필수였던 시대\n2019 GPT-2 — zero-shot 가능성 처음 제시, 그러나 실용성 부족\n2020 GPT-3 (175B) — In-context learning 혁명\nFew-shot으로 fine-tuning 대체, "prompt engineering" 용어 등장\nBrown et al. 2020: 예시 몇 개만 주면 모델이 패턴을 즉시 학습',
  },
  {
    label: '2021-2022: Instruction Tuning + Chain-of-Thought',
    body: '2021 — T0, Flan-T5: instruction tuning으로 zero-shot 성능 향상\n2022 Chain-of-Thought (Wei et al.) — "Let\'s think step by step"\n수학·논리 문제에서 GSM8K 3배 성능 (17.9% → 56.9%)\nSelf-Consistency (Wang et al.) — 다수결로 추가 10%+ 향상\n2022 InstructGPT / ChatGPT — RLHF로 지시 따르기 강화',
  },
  {
    label: '2023-2024: 고급 기법 폭발 + Agent 시대',
    body: '2023 — Tree of Thoughts, ReAct, Self-Refine, Constitutional AI\n추론 깊이와 도구 사용을 결합한 고급 기법 폭발\n2024 Agent 시대 — Tool use + Multi-step reasoning\nXML prompting (Claude), Structured output (function calling)\n모델 크기보다 prompt/harness 품질이 production 성능 좌우',
  },
  {
    label: '현재: System prompt > User prompt',
    body: 'LLM 성능이 prompt보다 모델 크기에 의존하는 비율 증가\n그러나 production에서는 프롬프트 엔지니어링이 여전히 핵심\nSystem prompt가 User prompt보다 중요 — 모든 턴에 적용\nOutput format 제어가 파이프라인 자동화의 핵심\n6대 원칙을 체계적으로 적용하면 동일 모델에서 2-3배 성능 차이',
  },
];
