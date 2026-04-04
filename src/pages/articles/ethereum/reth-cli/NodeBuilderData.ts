export interface BuilderState {
  name: string;
  generic: string;
  desc: string;
  available: string;
  color: string;
  codeKey: string;
}

export const STATES: BuilderState[] = [
  {
    name: 'NodeBuilder',
    generic: '<(), ChainSpec>',
    desc: 'CLI 파싱 직후. DB 타입이 ()로 아직 미설정.',
    available: 'with_types() 호출 가능',
    color: '#6366f1',
    codeKey: 'builder-struct',
  },
  {
    name: 'NodeBuilderWithTypes',
    generic: '<DB, ChainSpec, Types>',
    desc: '노드 타입(Types) 확정. 컴포넌트 설정 대기.',
    available: 'with_components(cb) 호출 가능',
    color: '#f59e0b',
    codeKey: 'builder-states',
  },
  {
    name: 'NodeBuilderWithComponents',
    generic: '<DB, ChainSpec, Types, CB, AO>',
    desc: '모든 컴포넌트 빌더(CB)와 애드온(AO) 설정 완료.',
    available: 'launch() 호출 가능 -- 최종 상태',
    color: '#10b981',
    codeKey: 'builder-final',
  },
];
