import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: '실전 Harness 10대 패턴', body: '① RAG: query → vector DB 검색 → context 주입 → LLM 응답\n② Agent Loop (ReAct): thought+action 반복, tool 사용, iterative\n③ Guarded Chain: 순차 LLM → 중간 검증 → rollback on failure\n④ Multi-Shot Consensus: N번 호출 → 다수결/synthesis → hallucination 감소\n⑤ Critic Loop: generate → self-critique → revise → 반복 → 품질 향상\n⑥ Few-Shot: 예시 포함 → 패턴 학습 → 새 입력에 적용\n⑦ Structured Output: JSON/XML 강제 → Pydantic 검증 → type safety\n⑧ Streaming+Interrupt: 중간 출력 확인 → 잘못된 방향이면 중단 → 토큰 절약\n⑨ Tool-Augmented: LLM이 필요시 tool 호출 → 결과 반영 → 반복 정제\n⑩ Human-in-the-Loop: LLM 제안 → 인간 승인/거부 → 피드백으로 개선\n\nPattern 선택: RAG=지식, Agent=복잡, Critic=품질, Consensus=신뢰성' },
];
const visuals = [
  { title: '10대 Harness 패턴', color: '#6366f1', rows: [
    { label: 'RAG', value: 'query → 검색 → context → LLM' },
    { label: 'Agent (ReAct)', value: 'thought → action → observe → 반복' },
    { label: 'Guarded Chain', value: '순차 LLM + 중간 검증' },
    { label: 'Consensus', value: 'N번 호출 → 다수결 (신뢰성)' },
    { label: 'Critic Loop', value: 'generate → critique → revise' },
    { label: 'HITL', value: 'LLM 제안 → 인간 승인' },
  ]},
];
export default function PatternsDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
