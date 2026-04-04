import CodePanel from '@/components/ui/code-panel';

const PING_STRUCT = `type Ping struct {
    Version    uint         // 항상 4
    From, To   Endpoint     // 발신자/수신자 IP:Port
    Expiration uint64       // Unix timestamp, 20초 후 만료
    ENRSeq     uint64       // EIP-868: 로컬 ENR 시퀀스 번호
    Rest []rlp.RawValue     // 전방 호환성을 위한 여분 필드
}

type Pong struct {
    To         Endpoint     // ping 발신자의 UDP 주소 (NAT 감지용)
    ReplyTok   []byte       // ping 패킷의 hash (매칭용)
    Expiration uint64
    ENRSeq     uint64       // 응답자의 ENR 시퀀스
    Rest []rlp.RawValue
}`;

const ENSURE_BOND = `func (t *UDPv4) ensureBond(toid enode.ID, toaddr netip.AddrPort) {
    tooOld := time.Since(t.db.LastPingReceived(toid, toaddr.Addr())) > bondExpiration
    if tooOld || t.db.FindFails(toid, toaddr.Addr()) > maxFindnodeFailures {
        rm := t.sendPing(toid, toaddr, nil)
        <-rm.errc
        time.Sleep(respTimeout) // 상대방 pong 처리 대기
    }
}`;

const SEND_PING = `func (t *UDPv4) sendPing(toid enode.ID, toaddr netip.AddrPort, callback func()) *replyMatcher {
    req := t.makePing(toaddr)
    packet, hash, err := v4wire.Encode(t.priv, req)
    // ...
    rm := t.pending(toid, toaddr.Addr(), v4wire.PongPacket, func(p v4wire.Packet) (bool, bool) {
        matched := bytes.Equal(p.(*v4wire.Pong).ReplyTok, hash)
        if matched && callback != nil { callback() }
        return matched, matched
    })
    t.localNode.UDPContact(toaddr)
    t.write(toaddr, toid, req.Name(), packet)
    return rm
}`;

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ping/Pong 핸드셰이크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          두 노드가 통신하려면 먼저 <strong>bond</strong>(유대)를 형성해야 합니다.
          bond = "상대가 실제로 해당 IP에서 응답한다"는 증거입니다.<br />
          FINDNODE 요청 전 반드시 bond가 필요하며, 이를 통해 DDoS 증폭 공격을 방지합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Ping / Pong 구조체</h3>
        <CodePanel title="v4wire.Ping & Pong -- v4wire.go" code={PING_STRUCT} startLine={50} annotations={[
          { lines: [54, 54], color: 'sky', note: 'EIP-868 확장: ENR 시퀀스 교환' },
          { lines: [60, 60], color: 'emerald', note: 'Pong.To로 NAT 뒤의 외부 주소 탐지' },
          { lines: [61, 61], color: 'amber', note: 'ReplyTok = ping hash, 요청-응답 매칭' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">ensureBond: bond 보장 흐름</h3>
        <p>
          <code>ensureBond()</code>는 FINDNODE/ENRRequest 전에 호출됩니다.<br />
          마지막 ping 수신이 <strong>24시간</strong>(bondExpiration)을 초과했거나, 실패 횟수가 5회를 넘으면 ping을 보내고 pong을 기다립니다.
        </p>
        <CodePanel title="ensureBond -- v4_udp.go:597" code={ENSURE_BOND} startLine={597} annotations={[
          { lines: [598, 598], color: 'sky', note: 'bondExpiration = 24시간' },
          { lines: [601, 601], color: 'emerald', note: 'ping 전송 후 pong 대기' },
          { lines: [602, 602], color: 'amber', note: 'respTimeout(500ms) 동안 상대 처리 대기' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">sendPing: 요청-응답 매칭</h3>
        <p>
          ping 패킷의 hash를 <code>pending()</code> 콜백에 캡처합니다.
          pong이 도착하면 <code>ReplyTok == hash</code>인지 대조하여 매칭합니다.<br />
          매칭 성공 시 <code>errc</code> 채널에 nil이 전달되어 대기 중인 goroutine이 해제됩니다.
        </p>
        <CodePanel title="sendPing -- v4_udp.go:241" code={SEND_PING} startLine={241} annotations={[
          { lines: [246, 248], color: 'sky', note: 'Pong.ReplyTok == ping hash 비교' },
          { lines: [250, 250], color: 'emerald', note: 'IP tracker에 접촉 기록' },
        ]} />
      </div>
    </section>
  );
}
