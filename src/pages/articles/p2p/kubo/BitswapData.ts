export const BITSWAP_STEPS = [
  { label: 'Wantlist 전송' }, { label: '블록 탐색' },
  { label: '블록 전송' }, { label: 'Ledger 업데이트' },
];

export const BITSWAP_ACTORS = ['노드 A', '노드 B', 'Blockstore', 'Ledger'];

export const BITSWAP_MSGS = [
  { from: 0, to: 1, label: 'WANT_HAVE(CID)', step: 0 },
  { from: 1, to: 2, label: 'Has(CID)?', step: 1 },
  { from: 2, to: 1, label: 'Block 반환', step: 1 },
  { from: 1, to: 0, label: 'BLOCK(data)', step: 2 },
  { from: 0, to: 3, label: '+received', step: 3 },
  { from: 1, to: 3, label: '+sent', step: 3 },
];

export const BITSWAP_CODE = `// Bitswap 메시지 처리 핵심 로직
func (bs *Bitswap) ReceiveMessage(ctx context.Context,
  p peer.ID, incoming bsmsg.BitSwapMessage) {
  // HAVE 응답 처리 -- 피어가 블록 보유 확인
  for _, entry := range incoming.Haves() {
    bs.wm.ReceiveFrom(p, entry.Cid)
  }
  // 실제 블록 수신 & 저장
  for _, block := range incoming.Blocks() {
    bs.receiveBlockFrom(p, block)
  }
}`;

export const BITSWAP_ANNOTATIONS = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: 'HAVE 응답으로 피어 매핑' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: '블록 수신 및 Blockstore 저장' },
];
