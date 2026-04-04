export const W = 380;
export const H = 160;
export const NODE_A = { x: 50, y: 80 };
export const NAT_A  = { x: 130, y: 80 };
export const RELAY  = { x: 190, y: 40 };
export const NAT_B  = { x: 250, y: 80 };
export const NODE_B = { x: 330, y: 80 };
export const BOX_W = 60;
export const BOX_H = 28;

export const STEPS = [
  {
    label: '① Discovery: NodeId로 주소 요청',
    body: 'Discovery에 NodeId 쿼리 → relay URL + 직접 주소 수신',
  },
  {
    label: '② Relay 경유 CallMeMaybe 전송',
    body: 'relay 경유로 후보 주소 목록 전달 → 동시 Ping 요청',
  },
  {
    label: '③ 양방향 Ping/Pong (hole punching)',
    body: '양 노드가 동시 Ping → NAT 매핑 생성 → 홀 관통',
  },
  {
    label: '④ 직접 UDP 연결 수립',
    body: 'Pong으로 경로 확인 → 직접 UDP 전환, relay 비활성화',
  },
];
