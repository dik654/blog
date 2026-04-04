export interface LookupStep {
  step: number;
  title: string;
  desc: string;
  color: string;
}

export const LOOKUP_STEPS: LookupStep[] = [
  {
    step: 1,
    title: '초기 노드 선택',
    desc: '로컬 Kademlia 버킷에서 target NodeId에 XOR 거리가 가장 가까운 k개(기본 16) 노드를 선택한다.',
    color: '#6366f1',
  },
  {
    step: 2,
    title: 'FIND_NODE 전송',
    desc: '선택된 노드에 FIND_NODE(target) UDP 메시지를 alpha=3 병렬로 전송한다. 응답에는 해당 노드가 알고 있는 가까운 노드 목록이 포함.',
    color: '#0ea5e9',
  },
  {
    step: 3,
    title: '버킷 갱신',
    desc: '응답에서 더 가까운 노드를 발견하면 Kademlia 버킷에 추가하고, 해당 노드에 다시 FIND_NODE를 전송한다.',
    color: '#10b981',
  },
  {
    step: 4,
    title: '수렴 판정',
    desc: '새로운 더 가까운 노드가 발견되지 않으면 lookup 종료. 결과로 target에 가장 가까운 k개 노드를 반환.',
    color: '#f59e0b',
  },
];

export interface DiscMessage {
  name: string;
  direction: string;
  purpose: string;
}

export const DISC_MESSAGES: DiscMessage[] = [
  { name: 'PING', direction: '양방향', purpose: '노드 생존 확인. 응답 없으면 버킷에서 제거' },
  { name: 'PONG', direction: '응답', purpose: 'PING에 대한 응답. 수신 시 해당 노드를 버킷 맨 뒤로 이동' },
  { name: 'FIND_NODE', direction: '요청', purpose: 'target에 가까운 노드 목록 요청' },
  { name: 'NEIGHBOURS', direction: '응답', purpose: 'FIND_NODE에 대한 응답. 최대 16개 노드 반환' },
];
