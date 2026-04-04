export const C = { cli: '#6366f1', comp: '#f59e0b', err: '#ef4444', ok: '#10b981', builder: '#8b5cf6' };

export const STEPS = [
  {
    label: '노드 실행 = 수십 개 서비스 조합',
    body: '`reth node` 하나로 Pool, Network, Executor 등 수십 개 서비스가 시작됩니다.',
  },
  {
    label: '문제: 서비스 간 의존성',
    body: '초기화 순서가 중요하며 잘못된 순서는 런타임 패닉을 유발합니다.',
  },
  {
    label: '문제: 커스텀 노드 불가',
    body: '단일 구현만 지원하면 OP Stack L2 등 커스텀 노드에 별도 포크가 필요합니다.',
  },
  {
    label: '해결: NodeBuilder typestate 패턴',
    body: '제네릭 타입으로 빌드 상태를 추적하여 필수 컴포넌트 누락을 컴파일 시점에 포착합니다.',
  },
  {
    label: '해결: trait impl 교체로 커스텀 노드',
    body: 'Executor나 Pool을 trait 교체만으로 커스텀 가능하며 op-reth가 이 방식입니다.',
  },
];
