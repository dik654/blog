import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Multi-Agent 6가지 아키텍처', body: '① Role-based Teams: Manager, Researcher, Coder, Tester — 역할별 prompt\n② Debater: Pro vs Con vs Judge — adversarial 검증, bias 감소\n③ Expert Committee: 도메인 전문가 의견 aggregation, voting/consensus\n④ Hierarchical: top-level planner + sub-agents — scalable\n⑤ Sequential Pipeline: A→B→C 각 stage 전문화 (assembly line)\n⑥ Swarm/Mesh: peer-to-peer, no coordinator, emergent behavior\n\nCommunication: message passing | shared memory | blackboard\n\nFrameworks: AutoGen(MS), CrewAI, LangGraph\nChallenges: coordination overhead, infinite loops, N agents × iterations 비용\n\n2024 trends: OpenAI Swarm, Anthropic Claude Teams, MS Magentic-One\nUse cases: code gen+review, research+writing, debate+synthesis' },
];
const visuals = [
  { title: 'Multi-Agent 6 아키텍처', color: '#6366f1', rows: [
    { label: 'Role-based', value: 'Manager, Researcher, Coder, Tester' },
    { label: 'Debater', value: 'Pro vs Con vs Judge (bias 감소)' },
    { label: 'Hierarchical', value: 'top planner + sub-agents (scalable)' },
    { label: 'Pipeline', value: 'A → B → C (assembly line)' },
    { label: 'Swarm', value: 'peer-to-peer, emergent behavior' },
    { label: 'Frameworks', value: 'AutoGen, CrewAI, LangGraph' },
  ]},
];
export default function MultiAgentDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
