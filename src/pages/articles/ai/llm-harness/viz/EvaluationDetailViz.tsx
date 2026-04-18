import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'LLM 평가 8가지 방법 + 파이프라인', body: '① Reference-based: BLEU, ROUGE, exact match, semantic similarity\n② Reference-free: perplexity, relevance, coherence, groundedness\n③ LLM-as-Judge: 다른 LLM이 rubric 기반 1-5 점수 (Anthropic, OpenAI)\n④ Unit Tests: 특정 input/output pairs, regression, deterministic\n⑤ Eval Frameworks: OpenAI Evals, DeepEval, Ragas (RAG-specific)\n⑥ A/B Testing: 두 harness 비교, 실 트래픽, 통계적 유의성\n⑦ Red Teaming: adversarial, jailbreak, edge cases, security\n⑧ Production Metrics: latency p50/p99, cost/req, error rate, satisfaction\n\nPipeline: Offline(unit+benchmark) → Pre-prod(red team+LLM judge) → Prod(A/B+metrics)' },
];
const visuals = [
  { title: '평가 8가지 방법', color: '#f59e0b', rows: [
    { label: 'Reference', value: 'BLEU, ROUGE, exact match' },
    { label: 'LLM-as-Judge', value: 'rubric 1-5 점수 (scalable)' },
    { label: 'A/B Testing', value: '두 harness, 실 트래픽 비교' },
    { label: 'Red Teaming', value: 'adversarial, jailbreak, security' },
    { label: 'Production', value: 'latency, cost, error, satisfaction' },
    { label: 'Frameworks', value: 'OpenAI Evals, DeepEval, Ragas' },
  ]},
];
export default function EvaluationDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
