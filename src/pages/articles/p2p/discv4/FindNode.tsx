import CodePanel from '@/components/ui/code-panel';

const FINDNODE_STRUCTS = `type Findnode struct {
    Target     Pubkey   // 찾고 싶은 대상의 64바이트 공개키
    Expiration uint64
    Rest []rlp.RawValue
}

type Neighbors struct {
    Nodes      []Node   // 최대 12개 노드 (MaxNeighbors)
    Expiration uint64
    Rest []rlp.RawValue
}

const MaxNeighbors = 12  // 1280바이트 패킷 제한에 맞춘 상한`;

const FINDNODE_FUNC = `func (t *UDPv4) findnode(toid enode.ID, toAddrPort netip.AddrPort,
    target v4wire.Pubkey) ([]*enode.Node, error) {
    t.ensureBond(toid, toAddrPort)

    nodes := make([]*enode.Node, 0, bucketSize)
    nreceived := 0
    rm := t.pending(toid, toAddrPort.Addr(), v4wire.NeighborsPacket,
        func(r v4wire.Packet) (matched bool, requestDone bool) {
            reply := r.(*v4wire.Neighbors)
            for _, rn := range reply.Nodes {
                nreceived++
                n, err := t.nodeFromRPC(toAddrPort, rn)
                if err != nil { continue }
                nodes = append(nodes, n)
            }
            return true, nreceived >= bucketSize
        })
    t.send(toAddrPort, toid, &v4wire.Findnode{
        Target: target, Expiration: uint64(time.Now().Add(expiration).Unix()),
    })
    err := <-rm.errc
    if errors.Is(err, errTimeout) && rm.reply != nil { err = nil }
    return nodes, err
}`;

const HANDLE_FINDNODE = `func (t *UDPv4) handleFindnode(h *packetHandlerV4, from netip.AddrPort,
    fromID enode.ID, mac []byte) {
    req := h.Packet.(*v4wire.Findnode)
    target := enode.ID(crypto.Keccak256Hash(req.Target[:]))
    closest := t.tab.findnodeByID(target, bucketSize, preferLive).entries

    p := v4wire.Neighbors{Expiration: uint64(time.Now().Add(expiration).Unix())}
    for _, n := range closest {
        p.Nodes = append(p.Nodes, nodeToRPC(n))
        if len(p.Nodes) == v4wire.MaxNeighbors {
            t.send(from, fromID, &p)
            p.Nodes = p.Nodes[:0]  // 12개씩 분할 전송
        }
    }
    if len(p.Nodes) > 0 { t.send(from, fromID, &p) }
}`;

export default function FindNode() {
  return (
    <section id="findnode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FindNode / Neighbors</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia lookup의 핵심 RPC입니다. Target 공개키에 가까운 노드들을 요청하면, 상대방이 자신의 라우팅 테이블에서 가장 가까운 노드들을 <strong>Neighbors</strong> 패킷으로 응답합니다.
        </p>
        <CodePanel title="Findnode & Neighbors 구조체 -- v4wire.go" code={FINDNODE_STRUCTS} startLine={75} annotations={[
          { lines: [76, 76], color: 'sky', note: '64바이트 secp256k1 공개키' },
          { lines: [82, 82], color: 'emerald', note: '패킷 크기 1280B 제한으로 최대 12개' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">요청 측: 다중 패킷 수집</h3>
        <p>
          16개(bucketSize) 노드를 채울 때까지 <strong>여러 Neighbors 패킷</strong>을 수집합니다.
          <code>replyMatcher</code> 콜백이 <code>requestDone=false</code>를 반환하면 큐에서 제거되지 않아 추가 응답을 계속 받습니다.<br />
          타임아웃이 발생해도 하나라도 응답이 있었으면 에러를 무시합니다.
        </p>
        <CodePanel title="findnode() -- v4_udp.go:320" code={FINDNODE_FUNC} startLine={320} annotations={[
          { lines: [322, 322], color: 'sky', note: 'bond가 없으면 먼저 ping/pong 수행' },
          { lines: [334, 334], color: 'emerald', note: 'bucketSize(16)개 수신 시 완료' },
          { lines: [340, 340], color: 'amber', note: '타임아웃이어도 응답이 있으면 성공 처리' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">응답 측: 12개씩 분할 전송</h3>
        <p>
          라우팅 테이블에서 XOR 거리 기준 가장 가까운 노드를 찾고, MaxNeighbors(12)개 단위로 패킷을 나눠 전송합니다.
          bond가 없는 요청은 <code>verifyFindnode</code>에서 거절하여 DDoS 증폭을 차단합니다.
        </p>
        <CodePanel title="handleFindnode -- v4_udp.go:751" code={HANDLE_FINDNODE} startLine={751} annotations={[
          { lines: [757, 757], color: 'sky', note: 'Target 공개키를 keccak256으로 node ID 변환' },
          { lines: [763, 763], color: 'emerald', note: '12개 도달 시 즉시 전송 후 버퍼 초기화' },
        ]} />
      </div>
    </section>
  );
}
