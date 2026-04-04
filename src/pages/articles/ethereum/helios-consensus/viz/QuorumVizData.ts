export const C = {
  pass: '#10b981', fail: '#ef4444', check: '#6366f1',
};

export const STEPS = [
  {
    label: 'Line 20~23: 2/3 정족수 검사',
    body: 'if participants.len() * 3 < pks.len() * 2\n참여자가 전체의 2/3 미만이면 서명 거부.',
  },
  {
    label: '왜 2/3인가',
    body: 'BFT 안전성 조건: f < n/3 악의적 노드 허용.\n2/3 이상 참여 = 정직한 다수가 서명에 포함됨을 보장.',
  },
];
