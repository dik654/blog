import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Framework 선택 의사결정 가이드', body: 'Q1 주요 목적:\nRAG 시스템 → LlamaIndex | 범용 Agent → LangChain/LangGraph\nMulti-agent 팀 → CrewAI | Research 자동화 → AutoGen\nSimple prototype → OpenAI SDK 직접\n\nQ2 규모:\nPrototype → LangChain | Production → LangGraph | Enterprise → LangGraph + LangSmith\n\nQ3 팀 스킬:\nPython → LangChain, CrewAI, AutoGen | TypeScript → LangChain.js, Vercel AI SDK\nNo-code → Dify, Flowise\n\n2024 엔터프라이즈 스택:\nLangChain/LangGraph (logic) + LangSmith (observability) + Vector DB + Model + Deploy\n\n대안: Semantic Kernel(C#), Haystack(RAG), DSPy(programmatic), Phidata\n디버깅: LangSmith, Helicone, Langfuse, W&B Weave, Phoenix' },
];
const visuals = [
  { title: 'Framework 선택 가이드', color: '#f59e0b', rows: [
    { label: 'RAG', value: '→ LlamaIndex (문서 인덱싱 최적화)' },
    { label: '범용 Agent', value: '→ LangChain/LangGraph' },
    { label: 'Multi-agent', value: '→ CrewAI (역할 기반)' },
    { label: 'Research', value: '→ AutoGen (대화 기반 협업)' },
    { label: 'Production', value: '→ LangGraph + LangSmith' },
    { label: 'Prototype', value: '→ OpenAI SDK 직접' },
  ]},
];
export default function ComparisonDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
