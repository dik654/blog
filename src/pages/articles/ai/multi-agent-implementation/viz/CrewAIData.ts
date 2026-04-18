import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Agent — 역할 + 목표 + 도구로 정의',
    body: 'Agent(role="품질 분석가", goal="불량 원인 파악", tools=[search, analyze]). 각 에이전트는 명확한 역할과 전문 도구를 갖는다.',
  },
  {
    label: 'Task — 설명 + 기대 출력 + 담당 에이전트',
    body: 'Task(description="센서 데이터에서 이상 패턴을 분석하라", expected_output="이상 유형 + 심각도", agent=analyst). 작업 단위가 명확하게 분리된다.',
  },
  {
    label: 'Crew — 에이전트 팀 + 프로세스 정의',
    body: 'Crew(agents=[searcher, analyst, decider], tasks=[t1,t2,t3], process=Process.sequential). 팀 구성과 실행 순서를 하나로 묶는다.',
  },
  {
    label: 'Sequential vs Hierarchical',
    body: 'Sequential: 작업이 순서대로 실행, 이전 결과가 다음 입력. Hierarchical: 매니저 에이전트가 작업을 동적으로 분배. 제조: Sequential이 감사 추적에 유리.',
  },
];

export const CREW_AGENTS = [
  { role: '매뉴얼 검색', icon: '🔍', color: '#6366f1', tools: ['VectorDB', 'WebSearch'] },
  { role: '데이터 분석', icon: '📊', color: '#10b981', tools: ['PandasTool', 'PlotTool'] },
  { role: '의사결정', icon: '⚡', color: '#f59e0b', tools: ['ReportGen', 'AlertTool'] },
];

export const PROCESS_TYPES = [
  { name: 'Sequential', desc: 'T1→T2→T3 순차', pros: '예측 가능, 감사 추적', cons: '유연성 부족' },
  { name: 'Hierarchical', desc: '매니저가 동적 분배', pros: '유연한 작업 배분', cons: '매니저 의존도' },
];
