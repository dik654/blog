import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Agent vs Chatbot — 5가지 핵심 구성', body: 'Chatbot: input→output, single turn, text only, stateless, reactive\nAgent: task→plan→execute→observe→iterate, multi-step, tool use, stateful, proactive\n\nAgent 5 핵심: ① LLM (brain) ② Tools (hands) ③ Memory (context)\n④ Planning (strategy) ⑤ Feedback (observation)\n\nAgent loop:\nwhile not task_done:\n  thought = llm.think(task, history)\n  action = choose_action(thought) → result = execute(action)\n  history.append(thought, action, result)\n\nAgent types: ReAct, Plan-Execute, Reflection, Multi-agent, Tool-using\nProduction: Claude Code, Cursor, Devin, MultiOn\n\nChallenges: hallucinations, tool misuse, infinite loops, cost, safety' },
];
const visuals = [
  { title: 'Agent vs Chatbot', color: '#6366f1', rows: [
    { label: 'Chatbot', value: 'input → output, single turn, reactive' },
    { label: 'Agent', value: 'plan → execute → observe → iterate' },
    { label: 'LLM + Tools', value: 'brain + hands (function calling)' },
    { label: 'Memory', value: 'short-term + long-term + procedural' },
    { label: 'Production', value: 'Claude Code, Cursor, Devin' },
  ]},
];
export default function OverviewDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
