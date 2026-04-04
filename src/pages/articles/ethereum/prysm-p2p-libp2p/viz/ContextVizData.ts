export const C = { net: '#8b5cf6', disc: '#3b82f6', sec: '#10b981', err: '#ef4444', ok: '#10b981', mesh: '#f59e0b' };

export const STEPS = [
  {
    label: 'CL 노드의 네트워크 요구',
    body: '수만 노드가 12초 안에 블록/어테스테이션을 교환해야 하며 EL의 devp2p는 pub/sub 미지원입니다.',
  },
  {
    label: '문제: 악의적 피어 + 메시지 폭주',
    body: '악의적 피어의 스팸 대량 전송과 대역폭 폭발을 방지하는 피어 품질 관리가 핵심입니다.',
  },
  {
    label: '문제: Eclipse 공격',
    body: '공격자가 모든 연결 슬롯을 점유하면 정상 피어와 격리되어 연결 게이팅이 필요합니다.',
  },
  {
    label: '해결: libp2p 모듈식 스택',
    body: 'Discv5 + Noise + GossipSub + Peer Scoring으로 각 레이어가 독립적으로 교체 가능합니다.',
  },
  {
    label: '해결: Prysm의 p2p.Service 구현',
    body: 'Discv5 → TCP+Noise → GossipSub → Scoring 순서로 초기화하며 Go 구조체 하나에 집중됩니다.',
  },
];
