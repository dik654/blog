export const ROUNDS = [
  {
    round: 1, dir: 'right' as const,
    initiator: 'send_empty()', responder: 'recv_empty()',
    token: '-> e',
    exchange: 'Initiator의 임시 DH 공개키만 전송',
    detail: '아직 어떤 identity도 공개하지 않는다. DH 임시키(e)만 보내 채널 시작.',
    color: '#6366f1',
  },
  {
    round: 2, dir: 'left' as const,
    initiator: 'recv_identity()', responder: 'send_identity()',
    token: '<- e, ee, s, es + payload',
    exchange: 'Responder DH 공개키 + DH(ee, es) 수행 + identity payload',
    detail: 'ee = 양쪽 임시키 DH. es = Initiator 임시키 x Responder 정적키 DH. payload에 identity 공개키 + 서명 포함.',
    color: '#10b981',
  },
  {
    round: 3, dir: 'right' as const,
    initiator: 'send_identity()', responder: 'recv_identity()',
    token: '-> s, se + payload',
    exchange: 'Initiator 정적키 + DH(se) 수행 + identity payload',
    detail: 'se = Responder 임시키 x Initiator 정적키 DH. 이 시점에 양측 모두 인증 완료. HKDF로 세션키 도출.',
    color: '#f59e0b',
  },
];
