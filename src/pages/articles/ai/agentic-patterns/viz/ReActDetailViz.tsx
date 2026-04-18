import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'ReAct — Thought → Action → Observation 루프', body: 'Prompt template:\n"You have tools: search, calculator, read_file\nUse: Thought → Action → Observation → ... → Final Answer"\n\n예시:\nThought: "Seoul 2024 인구 검색 필요"\nAction: search("Seoul population 2024")\nObservation: "9.6 million in 2024"\nFinal Answer: "Seoul 인구는 960만"\n\nKey insight: reasoning이 action을 guide, observation이 next reasoning 갱신\n\nvs CoT: 생각만, 외부 정보 없음\nvs Pure Action: reasoning 설명 없음\n\nBenefits: transparent reasoning, grounded, error recovery\nLimitations: verbose (token 많음), stuck 가능, good prompting 필요\nVariants: Few-shot/Zero-shot ReAct, Self-Ask, ReWOO\nCost: multiple LLM calls, token count grows' },
];
const visuals = [
  { title: 'ReAct Loop', color: '#10b981', rows: [
    { label: 'Thought', value: '추론 — "무엇을 할지 생각"' },
    { label: 'Action', value: '도구 호출 — search, calculator' },
    { label: 'Observation', value: '결과 확인 — tool output' },
    { label: 'Final Answer', value: '반복 후 최종 답변' },
    { label: 'vs CoT', value: 'CoT=생각만 | ReAct=생각+행동+관찰' },
  ]},
];
export default function ReActDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
