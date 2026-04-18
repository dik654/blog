import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'LangGraph — State Graph 기반 Agent', body: 'State Graph 개념:\nNodes = 함수 (LLM call, tool use 등)\nEdges = 조건부 라우팅\nState = TypedDict, 각 노드 간 전달\n\nReAct agent 구현:\nagent_node → LLM 호출 → response\ntool_node → tool_calls 실행 → results\nshould_continue → tool_calls 있으면 "tools", 없으면 "end"\n\nworkflow.add_node("agent", agent_node)\nworkflow.add_conditional_edges("agent", should_continue, ...)\nworkflow.add_edge("tools", "agent") ← 사이클!\napp = workflow.compile()\n\n고급 기능: Checkpointing (저장/복원), Human-in-the-loop (인간 승인)\nStreaming (노드별 중간 결과), Parallel execution, Time travel debugging' },
];
const visuals = [
  { title: 'LangGraph State Graph', color: '#10b981', rows: [
    { label: 'Nodes', value: '함수 (LLM call, tool use)' },
    { label: 'Edges', value: '조건부 라우팅 (conditional)' },
    { label: 'State', value: 'TypedDict, 노드 간 전달' },
    { label: 'Cycle', value: 'tools → agent 사이클 지원' },
    { label: 'Features', value: 'Checkpoint, HITL, Streaming' },
  ]},
];
export default function LangGraphDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
