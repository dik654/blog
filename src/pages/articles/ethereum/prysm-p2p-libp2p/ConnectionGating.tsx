import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ConnectionGating({ onCodeRef: _ }: Props) {
  return (
    <section id="connection-gating" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연결 게이팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <code>ConnectionGater</code>는 libp2p의 인터페이스로, 연결 수립 전·후에 필터링 로직을 삽입한다.
        </p>

        {/* ── ConnectionGater 인터페이스 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ConnectionGater — 5단계 필터링</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p ConnectionGater 인터페이스 (5개 단계)

type ConnectionGater interface {
    // 1. dial 시작 전 (peer.ID 기반)
    InterceptPeerDial(p peer.ID) bool

    // 2. 특정 주소로 dial 전 (multiaddr 기반)
    InterceptAddrDial(p peer.ID, addr multiaddr.Multiaddr) bool

    // 3. 인바운드 accept 전 (소켓 수준)
    InterceptAccept(connAddrs network.ConnMultiaddrs) bool

    // 4. security handshake 후 (peer.ID 확인 후)
    InterceptSecured(dir network.Direction, p peer.ID, conn network.ConnMultiaddrs) bool

    // 5. 전체 연결 upgrade 후 (multiplexer까지)
    InterceptUpgraded(conn network.Conn) (bool, control.DisconnectReason)
}

// Prysm의 구현:
type Gater struct {
    banned        *bannedPeers   // 명시적 ban 목록
    ipLimiter     *RateLimiter    // IP당 연결 제한
    s             *Service
}

// 1단계: peer.ID ban 체크
func (g *Gater) InterceptPeerDial(p peer.ID) bool {
    return !g.banned.Contains(p)
}

// 2단계: 주소 필터링 (사설망, localhost, etc.)
func (g *Gater) InterceptAddrDial(p peer.ID, addr Multiaddr) bool {
    ip, _ := manet.ToIP(addr)
    if ip.IsPrivate() || ip.IsLoopback() || ip.IsMulticast() {
        return false  // 공인 IP만 허용
    }
    return true
}

// 3단계: 인바운드 rate limiting
func (g *Gater) InterceptAccept(connAddrs ConnMultiaddrs) bool {
    remoteIP := extractIP(connAddrs.RemoteMultiaddr())

    // IP당 분당 3회 연결 시도만 허용
    if !g.ipLimiter.Allow(remoteIP) {
        return false
    }
    return true
}`}
        </pre>
        <p className="leading-7">
          5단계 게이팅이 <strong>심층 방어</strong>.<br />
          peer.ID → 주소 → rate limit → 핸드셰이크 → upgrade 각 단계에서 검증.<br />
          악의적 피어를 최대한 빨리 거부 → 리소스 낭비 방지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">게이팅 규칙</h3>
        <ul>
          <li><strong>InterceptPeerDial</strong> — 아웃바운드 연결 시 밴 리스트 확인</li>
          <li><strong>InterceptAccept</strong> — 인바운드 연결 속도 제한 (IP당 N/분)</li>
          <li><strong>InterceptSecured</strong> — 핸드셰이크 후 피어 ID 밴 확인</li>
        </ul>

        {/* ── Eclipse attack 방어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Eclipse Attack 방어 — IP Colocation 탐지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Eclipse Attack:
// 공격자가 타겟 노드의 모든 피어 연결을 자신의 노드로 대체
// → 타겟을 네트워크에서 격리 (eclipse)
// → 타겟에게 잘못된 블록/state 전달 가능

// 방어 1: IP Colocation 패널티
// 같은 /16 서브넷에서 3개 이상 피어 → 점수 감점
func IPColocationPenalty(peers []Peer) float64 {
    ipCount := make(map[string]int)
    for _, p := range peers {
        subnet := p.IP.Mask(/16).String()
        ipCount[subnet]++
    }

    penalty := 0.0
    for _, count := range ipCount {
        if count > 3 {
            // 3개 초과분에 대해 penalty
            penalty -= float64(count-3) * 10
        }
    }
    return penalty
}

// 방어 2: 아웃바운드 비율 유지
// 전체 피어 중 30% 이상이 아웃바운드 (내가 dial한) 연결
// 공격자는 인바운드만 조작 가능 → 아웃바운드 비율이 보호
const MIN_OUTBOUND_RATIO = 0.3

func CheckOutboundRatio(peers []Peer) bool {
    outbound := 0
    for _, p := range peers {
        if p.Direction == OUTBOUND { outbound++ }
    }
    ratio := float64(outbound) / float64(len(peers))
    return ratio >= MIN_OUTBOUND_RATIO
}

// 방어 3: 다양성 요구
// - 여러 ASN (Autonomous System Number)
// - 여러 국가
// - 여러 클라이언트 구현체 (Prysm/Lighthouse/Teku...)

// Prysm의 peer selection 전략:
// 1. ENR discovery로 무작위 탐색
// 2. 위 규칙 적용하여 선별
// 3. 주기적 peer churn (rotation) 수행`}
        </pre>
        <p className="leading-7">
          <strong>Eclipse attack 방어</strong>가 핵심 보안 요구사항.<br />
          IP colocation penalty + 아웃바운드 비율 + 다양성 요구로 3중 방어.<br />
          공격자가 다수 IP 확보해도 노드를 격리하기 어려움.
        </p>

        {/* ── Resource Manager ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Resource Manager — DoS 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p ResourceManager: 리소스 소비 제한
type ResourceManager interface {
    // 스코프별 리소스 예약
    ViewSystem(f func(SystemScope)) error
    ViewPeer(p peer.ID, f func(PeerScope)) error
    ViewProtocol(proto protocol.ID, f func(ProtocolScope)) error
}

// 각 스코프의 리소스 한도:
type Limit struct {
    Streams  int  // 최대 동시 스트림
    Conns    int  // 최대 동시 연결
    FD       int  // 최대 file descriptor
    Memory   int64 // 최대 메모리 (bytes)
}

// 스코프 계층:
// System: 전체 노드 (최상위)
//   ├─ Transient: 설정 중인 연결
//   ├─ Protocol: 각 프로토콜 (/eth2/beacon_chain/...)
//   ├─ Service: GossipSub, RPC 등
//   └─ Peer: 각 피어
//       └─ Connection: 각 TCP 연결
//           └─ Stream: 각 스트림

// Prysm 기본 설정:
systemLimits := Limit{
    Streams: 16384,   // 전체 스트림 상한
    Conns:   512,     // 전체 연결 상한
    Memory:  2 << 30, // 2GB
}

peerLimits := Limit{
    Streams: 32,      // 피어당 32 스트림
    Conns:   2,       // 피어당 2 연결 (inbound + outbound)
    Memory:  8 << 20, // 피어당 8MB
}

// 초과 시:
// - 새 연결 거부
// - 기존 연결 prune (오래된 것부터)
// - prometheus 메트릭 기록

// DoS 방어 시나리오:
// 공격자가 수천 연결 시도 → ResourceManager가 거부
// 공격자가 대량 stream 열기 → 피어당 32개 제한으로 차단
// 공격자가 메모리 exhaustion 시도 → 8MB 제한으로 격리`}
        </pre>
        <p className="leading-7">
          <strong>ResourceManager</strong>가 DoS 공격 방어 — 피어별/시스템별 리소스 한도.<br />
          stream/conn/memory 한도를 스코프별로 부과 → 악의적 피어 격리.<br />
          메모리 exhaustion, fd 고갈 공격 모두 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Eclipse 공격 방어</strong> — 같은 /16 서브넷에서 3개 이상 연결 시 점수를 대폭 감점.<br />
          아웃바운드 연결을 일정 비율 이상 유지해 공격자가 피어 테이블을 장악하기 어렵게 함.<br />
          IP Colocation 패널티가 핵심 방어 메커니즘.
        </p>
      </div>
    </section>
  );
}
