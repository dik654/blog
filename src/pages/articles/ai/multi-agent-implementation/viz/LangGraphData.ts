import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'StateGraph — 상태 객체가 그래프를 관통한다',
    body: 'TypedDict로 공유 상태를 정의한다. 모든 노드가 이 상태를 읽고 수정한다. messages, current_agent, result 등이 핵심 필드.',
  },
  {
    label: '노드와 엣지 — add_node + add_edge로 그래프 구축',
    body: 'add_node("분석", analyze_fn)로 노드 등록. add_edge("분석", "판단")으로 연결. add_conditional_edges로 조건부 라우팅.',
  },
  {
    label: '조건부 라우팅 — 상태에 따라 다음 노드 결정',
    body: 'router 함수가 상태를 보고 "분석" 또는 "검색"을 반환한다. should_continue 패턴으로 루프 종료 조건을 설정한다.',
  },
  {
    label: '체크포인트 — 상태 저장으로 재개 가능',
    body: 'SqliteSaver, MemorySaver로 매 노드 실행 후 상태를 저장한다. 오류 발생 시 마지막 체크포인트에서 재개. Human-in-the-loop도 이 위에 구현.',
  },
];

export const STATE_FIELDS = [
  { name: 'messages', type: 'list[BaseMessage]', desc: '대화 이력' },
  { name: 'current_agent', type: 'str', desc: '현재 활성 에이전트' },
  { name: 'result', type: 'dict', desc: '최종 결과물' },
];

export const GRAPH_NODES = [
  { id: 'router', label: '라우터', x: 220, y: 20, color: '#8b5cf6' },
  { id: 'search', label: '검색', x: 100, y: 100, color: '#6366f1' },
  { id: 'analyze', label: '분석', x: 220, y: 100, color: '#10b981' },
  { id: 'decide', label: '판단', x: 340, y: 100, color: '#f59e0b' },
  { id: 'end', label: '종료', x: 220, y: 180, color: '#64748b' },
];

export const GRAPH_EDGES = [
  { from: 'router', to: 'search', label: '검색 필요' },
  { from: 'router', to: 'analyze', label: '분석 필요' },
  { from: 'search', to: 'analyze', label: '' },
  { from: 'analyze', to: 'decide', label: '' },
  { from: 'decide', to: 'end', label: '완료' },
  { from: 'decide', to: 'router', label: '추가 필요' },
];
