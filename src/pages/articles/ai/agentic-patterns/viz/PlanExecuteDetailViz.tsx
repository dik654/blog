import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Plan-Execute + Reflection 패턴', body: 'Plan-Execute:\n1. Planner LLM → [step1, step2, ...] 계획 생성\n2. Executor가 각 step 순차 실행, 실패 시 replan\n3. 최종 결과 반환\n\nvs ReAct: ReAct=매 턴 thought-action | P&E=plan once, execute many\nBenefits: less LLM calls, clear progress, parallelizable\nLimitations: rigid plan, needs replan mechanism\n\nReflection:\nActor(초안) → Critic(평가) → Refiner(개선) → 반복\nSelf-correction, catches errors, quality ↑\n예: code review, essay editing, answer refinement\n\nCombined: plan→execute→reflect→replan → 가장 강력하지만 비용 높음\nProduction: LangGraph StateGraph, CrewAI, AutoGen, Claude Extended Thinking' },
];
const visuals = [
  { title: 'Plan-Execute + Reflection', color: '#f59e0b', rows: [
    { label: 'Plan', value: 'planner LLM → step 목록 생성' },
    { label: 'Execute', value: '각 step 순차 실행, 실패시 replan' },
    { label: 'Reflect', value: 'Actor → Critic → Refiner 루프' },
    { label: 'vs ReAct', value: 'plan once, execute many (효율)' },
    { label: 'Combined', value: 'plan+execute+reflect → 최고 품질' },
  ]},
];
export default function PlanExecuteDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
