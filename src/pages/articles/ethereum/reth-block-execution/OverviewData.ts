export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'revm',
    title: 'revm 채택',
    problem: 'EVM을 Rust로 처음부터 구현하면 수만 줄 코드가 필요하고, 하드포크마다 스펙 변경을 반영해야 한다.',
    solution: 'revm(Rust EVM) 라이브러리를 사용한다. 140+개 옵코드 구현이 검증되어 있고, 하드포크 스펙도 revm 팀이 관리한다.',
    color: '#6366f1',
  },
  {
    id: 'strategy',
    title: 'BlockExecutionStrategy 패턴',
    problem: '이더리움, OP Stack, Polygon 등 체인마다 블록 실행 규칙이 다르다. 시스템 TX, pre/post-execution hook이 각기 다르다.',
    solution: 'trait 기반 Strategy 패턴으로 실행 로직을 교체한다. 핵심 파이프라인은 공유하고, 체인별 차이만 오버라이드한다.',
    color: '#0ea5e9',
  },
  {
    id: 'bundle',
    title: 'BundleState 누적',
    problem: '블록마다 DB에 커밋하면 I/O가 병목이 된다. 초기 동기화 시 수백만 블록을 처리해야 한다.',
    solution: '상태 변경을 인메모리 HashMap(BundleState)에 누적한다. commit_threshold(10K블록)마다 한 번에 DB 기록한다.',
    color: '#10b981',
  },
];
