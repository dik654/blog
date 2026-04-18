import SimpleStepViz from '@/components/viz/SimpleStepViz';
import { PATTERN_STEPS, AGENT_STEPS } from './MemoryDetailVizData';

const patternVisuals = [
  { title: 'Buffer · Window · Summary', color: '#6366f1', rows: [
    { label: '① Buffer', value: '모든 turn 저장 — 완전, 토큰 초과 위험' },
    { label: '② Window', value: '최근 N turn — 토큰 제어, 초기 손실' },
    { label: '③ Summary', value: 'LLM 요약 — 토큰 절약, 품질 의존' },
    { label: '적합', value: 'Buffer: <10턴, Window: 챗봇, Summary: 긴 대화' },
  ]},
  { title: 'Vector · KG · Hybrid', color: '#10b981', rows: [
    { label: '④ Vector', value: 'embedding → 유사 검색 — 장기 메모리' },
    { label: '⑤ Knowledge Graph', value: 'Entity/Relation → Graph DB — 구조화' },
    { label: '⑥ Hybrid (권장)', value: 'Buffer(5) + Summary + Vector 결합' },
    { label: '핵심', value: '각 장점 결합 → 실전 최적 조합' },
  ]},
  { title: 'LangChain + 2024 트렌드', color: '#f59e0b', rows: [
    { label: 'LangChain', value: 'Buffer/Window/Summary/Vector Memory' },
    { label: 'Claude/GPT', value: 'Custom instructions + Knowledge files' },
    { label: '2024', value: 'Extended memory, Persistent profiles' },
    { label: '방향', value: 'Cross-session learning, Episodic memory' },
  ]},
];

const agentVisuals = [
  { title: 'Agent Memory 4계층', color: '#f59e0b', rows: [
    { label: 'Working', value: 'current conversation, temp vars (실시간)' },
    { label: 'Short-term', value: 'recent interactions, TTL: hours-days' },
    { label: 'Long-term', value: 'user prefs, past decisions (permanent)' },
    { label: 'Procedural', value: 'how-to, learned skills, tool patterns' },
    { label: '검색', value: 'recent[-10] + long.search(5) + procedural' },
  ]},
  { title: 'MemGPT + 생체 모델', color: '#ef4444', rows: [
    { label: 'MemGPT', value: 'OS-inspired: RAM(context) + disk(외부)' },
    { label: 'Paging', value: '컨텍스트 창 한계를 가상 메모리로 극복' },
    { label: 'Letta', value: 'MemGPT 후속 — persistent agents' },
    { label: 'Mem0', value: 'hybrid memory framework' },
  ]},
];

export function PatternViz() {
  return <SimpleStepViz steps={PATTERN_STEPS} visuals={patternVisuals} />;
}

export function AgentMemViz() {
  return <SimpleStepViz steps={AGENT_STEPS} visuals={agentVisuals} />;
}
