import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Harness vs Raw LLM — 5가지 구성 요소', body: 'Raw LLM: bare API call → 구조 없음, 안전 없음, 취약\nHarness: structured prompts + tool calling + guardrails + retry + eval + observability\n\n5 components:\n① System Prompt: role, persona, instructions, output format\n② Tools: function calling, APIs, knowledge retrieval, actions\n③ Guardrails: input validation, output filtering, safety, PII detection\n④ Context Management: history summarization, token budget, memory\n⑤ Evaluation: quality checks, regression tests, A/B testing\n\nFrameworks: LangChain, LlamaIndex, Haystack, Semantic Kernel, DSPy\nTrade-offs: more LLM calls + latency vs quality + safety + debuggability' },
];
const visuals = [
  { title: 'Harness 5가지 구성 요소', color: '#6366f1', rows: [
    { label: 'System Prompt', value: 'role, persona, instructions, format' },
    { label: 'Tools', value: 'function calling, APIs, retrieval' },
    { label: 'Guardrails', value: 'input/output validation, safety' },
    { label: 'Context Mgmt', value: 'history, token budget, memory' },
    { label: 'Evaluation', value: 'quality checks, A/B, regression' },
  ]},
];
export default function OverviewDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
