import type { CodeRef } from '@/components/code/types';

export const udpCodeRefs: Record<string, CodeRef> = {
  'handle-unknown': {
    path: 'go-ethereum/p2p/discover/v5_udp.go', lang: 'go', highlight: [1, 14],
    desc: 'handleUnknown: 세션 없는 패킷 수신 시 WHOAREYOU 챌린지를 전송한다.\n원래 Nonce를 포함시켜 발신자가 요청을 매칭할 수 있게 한다.',
    code: `func (t *UDPv5) handleUnknown(p *v5wire.Unknown,
    fromID enode.ID, fromAddr netip.AddrPort) {
    challenge := &v5wire.Whoareyou{Nonce: p.Nonce}
    crand.Read(challenge.IDNonce[:])
    if n := t.GetNode(fromID); n != nil {
        challenge.Node = n
        challenge.RecordSeq = n.Seq()
    }
    t.sendResponse(fromID, fromAddr, challenge)
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: '원래 패킷의 Nonce를 챌린지에 포함' },
      { lines: [4, 4], color: 'emerald', note: 'IDNonce: 16바이트 랜덤 챌린지' },
      { lines: [5, 8], color: 'amber', note: '알려진 노드면 ENR 시퀀스 포함' },
    ],
  },
  'handle-whoareyou': {
    path: 'go-ethereum/p2p/discover/v5_udp.go', lang: 'go', highlight: [1, 11],
    desc: 'handleWhoareyou: WHOAREYOU 수신 → Nonce로 원래 호출을 찾고 핸드셰이크 패킷으로 재전송.',
    code: `func (t *UDPv5) handleWhoareyou(p *v5wire.Whoareyou,
    fromID enode.ID, fromAddr netip.AddrPort) {
    c, err := t.matchWithCall(fromID, p.Nonce)
    if err != nil { return }
    c.handshakeCount++
    c.challenge = p
    p.Node = c.node
    t.sendCall(c)
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'Nonce로 원래 호출 매칭' },
      { lines: [5, 5], color: 'amber', note: '핸드셰이크는 호출당 1회 제한' },
      { lines: [6, 8], color: 'emerald', note: 'challenge 세팅 → 핸드셰이크 헤더 인코딩' },
    ],
  },
};
