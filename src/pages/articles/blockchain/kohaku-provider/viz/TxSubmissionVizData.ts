export const C = {
  stem: '#6366f1', relay: '#10b981', fluff: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1~2: 에폭 & Stem 피어 선택',
    body: 'let epoch = now() / EPOCH_DURATION\nlet stem_peer = peers.select_deterministic(epoch_seed)\n에폭 동안 고정된 단일 피어. 경로 안정성 확보.',
  },
  {
    label: 'Line 3: Stem 전송 시작',
    body: 'stem_peer.send(StemMessage { tx, hop: 0 })\n첫 번째 홉. 서명된 TX를 단일 피어에만 전달.',
  },
  {
    label: 'Line 4~5: 릴레이 노드 — hop 카운트',
    body: 'msg.hop += 1\nif msg.hop >= random(3..=5)\n각 릴레이 노드가 독립적으로 전환 임계값을 결정.',
  },
  {
    label: 'Line 6~9: Fluff 전환 — 전체 가십',
    body: 'for peer in connected_peers { peer.gossip(FluffMessage) }\n임계값 초과 → 모든 피어에 동시 전파.\n관찰자는 Fluff 시작 노드만 보인다. 원래 발신자는 알 수 없다.',
  },
];
