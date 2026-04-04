export const C = { net: '#6366f1', err: '#ef4444', ok: '#10b981', peer: '#f59e0b', enc: '#8b5cf6' };

export const STEPS = [
  {
    label: 'EL 노드가 피어를 찾고 블록/TX를 교환',
    body: 'P2P 네트워크 없이는 동기화, TX 전파, 블록 전파 모두 불가능합니다.',
  },
  {
    label: '문제: 수천 피어 동시 관리',
    body: '각 연결에 TCP + 암호화 + 프로토콜 협상이 필요하며 악의적 피어 차단이 핵심입니다.',
  },
  {
    label: '문제: goroutine 기반 오버헤드',
    body: 'Geth는 연결마다 goroutine을 생성하여 수천 연결 시 컨텍스트 스위칭이 누적됩니다.',
  },
  {
    label: '해결: tokio 비동기 + SessionManager',
    body: 'epoll/kqueue 기반 단일 이벤트 루프로 수천 세션을 하나의 tokio 런타임에서 처리합니다.',
  },
  {
    label: '4계층 네트워크 스택',
    body: 'Discovery(UDP) → TCP → RLPx Encrypt(ECIES) → eth-wire Protocol로 각 계층이 독립 동작합니다.',
  },
];
