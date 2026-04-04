export const C = { net: '#8b5cf6', disc: '#3b82f6', sec: '#10b981', mesh: '#f59e0b', score: '#ef4444', gate: '#ec4899' };

export const STEPS = [
  { label: '왜 libp2p인가', body: 'CL은 pub/sub + 피어 스코어링이 필요해 devp2p 대신 libp2p 선택' },
  { label: '① Discv5 UDP 탐색', body: 'UDP로 ENR을 교환하고 부트노드에서 Kademlia 테이블 구축' },
  { label: '② TCP + Noise 핸드셰이크', body: 'Noise 프로토콜로 암호화 채널 수립, TLS 대비 왕복 1회' },
  { label: '③ GossipSub 메시 조인', body: '연결 후 GossipSub 1.1 메시에 참여하여 토픽 구독' },
  { label: '④ 피어 스코어링', body: 'Topic Score + IP Colocation + Behaviour Penalty 합산' },
  { label: '⑤ 연결 게이팅 & 속도 제한', body: '점수 미달 피어 차단 + 인바운드 속도 제한으로 Eclipse 공격 방어' },
];

export const NODES = [
  { id: 'libp2p', label: 'libp2p Host', x: 240, y: 10 },
  { id: 'discv5', label: 'Discv5 (UDP)', x: 30, y: 80 },
  { id: 'noise', label: 'Noise (TCP)', x: 240, y: 80 },
  { id: 'gossip', label: 'GossipSub', x: 450, y: 80 },
  { id: 'scoring', label: 'Peer Scoring', x: 130, y: 170 },
  { id: 'gating', label: 'Conn Gater', x: 340, y: 170 },
  { id: 'peers', label: '피어 풀', x: 240, y: 250 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'UDP' },
  { from: 0, to: 2, label: 'TCP' },
  { from: 2, to: 3, label: '구독' },
  { from: 1, to: 4, label: 'ENR 수집' },
  { from: 3, to: 4, label: '토픽 점수' },
  { from: 4, to: 5, label: '임계값' },
  { from: 5, to: 6, label: '수락/거부' },
];
