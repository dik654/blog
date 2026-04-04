export const EITHER_FLOW = [
  { step: 'UpgradeInfo', desc: '/yamux/1.0.0 프로토콜 ID 광고', color: '#f59e0b' },
  { step: 'upgrade_inbound()', desc: '상대 모드에 따라 Server/Client 결정', color: '#10b981' },
  { step: 'Either 래핑', desc: 'yamux012 | yamux013 → Muxer<C>에 보관', color: '#8b5cf6' },
  { step: 'StreamMuxer', desc: 'poll 메서드에서 Either 분기 디스패치', color: '#06b6d4' },
];

export const MODE_DIFF = [
  { mode: 'Server', when: 'inbound 연결 (상대가 dial)', action: 'yamux::Mode::Server', color: '#10b981' },
  { mode: 'Client', when: 'outbound 연결 (내가 dial)', action: 'yamux::Mode::Client', color: '#f59e0b' },
];
