import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'AI Agent 역사 (2022-2024) + 3세대', body: '2022.10 ReAct (Princeton+Google): Reasoning + Acting 결합, tool use 기초 패러다임\n2023.03 LangChain: 최초 범용 에이전트 프레임워크, tool use 표준화\n2023.04 AutoGPT, BabyAGI: Goal-driven, 자율 작업 수행\n2023.06 ReAct+Reflection: Self-critique 통합, 오류 수정\n2023.10 AutoGen (MS): Multi-agent 대화, Human-in-the-loop\n2024.01 LangGraph: State graph 기반, Cyclic workflows\n2024.03 CrewAI: Role-based agents, Team collaboration\n2024 Claude Computer Use: GUI automation\n2024 OpenAI Assistants API: Managed agent service\n\n3세대 Agent Architecture:\nGen 1 (2022): Single-step tool use\nGen 2 (2023): Multi-step planning (ReAct)\nGen 3 (2024): Multi-agent + long-horizon planning' },
];
const visuals = [
  { title: 'Agent 역사 + 3세대', color: '#6366f1', rows: [
    { label: '2022', value: 'ReAct — Reasoning + Acting 기반' },
    { label: '2023', value: 'LangChain, AutoGPT, AutoGen' },
    { label: '2024', value: 'LangGraph, CrewAI, Claude Use' },
    { label: 'Gen 1', value: 'Single-step tool use' },
    { label: 'Gen 2', value: 'Multi-step planning (ReAct)' },
    { label: 'Gen 3', value: 'Multi-agent + long-horizon' },
  ]},
];
export default function TimelineDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
