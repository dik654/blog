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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>ConnectionGater</code> 인터페이스 — 5단계 필터링</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><code>InterceptPeerDial(p peer.ID) bool</code> — dial 시작 전, <code>peer.ID</code> 기반 차단</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80"><code>InterceptAddrDial(p peer.ID, addr Multiaddr) bool</code> — 특정 주소로 dial 전, multiaddr 기반</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><code>InterceptAccept(connAddrs ConnMultiaddrs) bool</code> — 인바운드 accept 전, 소켓 수준</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80"><code>InterceptSecured(dir, p, conn) bool</code> — security handshake 후, <code>peer.ID</code> 확인 후</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">5</span>
                <div className="text-foreground/80"><code>InterceptUpgraded(conn Conn) (bool, DisconnectReason)</code> — 전체 연결 upgrade 후(multiplexer까지)</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Prysm <code>Gater</code> 구현</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80 mb-3">
              <span><code>banned: *bannedPeers</code> — ban 목록</span>
              <span><code>ipLimiter: *RateLimiter</code> — IP당 제한</span>
              <span><code>s: *Service</code> — P2P 서비스 참조</span>
            </div>
            <div className="space-y-1 text-sm text-foreground/70">
              <p><strong>1단계:</strong> <code>InterceptPeerDial</code> — <code>banned.Contains(p)</code>로 ban 체크</p>
              <p><strong>2단계:</strong> <code>InterceptAddrDial</code> — <code>IsPrivate()</code> / <code>IsLoopback()</code> / <code>IsMulticast()</code> 필터 → 공인 IP만 허용</p>
              <p><strong>3단계:</strong> <code>InterceptAccept</code> — IP당 분당 3회 연결 시도만 허용 (<code>ipLimiter.Allow</code>)</p>
            </div>
          </div>
        </div>
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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs font-bold text-red-400 mb-1">Eclipse Attack</p>
            <p className="text-sm text-foreground/80">공격자가 타겟 노드의 모든 피어 연결을 자기 노드로 대체 → 타겟을 네트워크에서 격리(eclipse) → 잘못된 블록/state 전달 가능.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">방어 1: IP Colocation 패널티</p>
              <p className="text-sm text-foreground/80">같은 <code>/16</code> 서브넷에서 3개 이상 피어 → <code>(count-3) * 10</code> 점수 감점. <code>IPColocationPenalty()</code></p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">방어 2: 아웃바운드 비율 유지</p>
              <p className="text-sm text-foreground/80">전체 피어 중 30% 이상 아웃바운드(내가 dial한) 연결 유지. 공격자는 인바운드만 조작 가능 → 아웃바운드가 보호막.</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-1">방어 3: 다양성 요구</p>
              <p className="text-sm text-foreground/80">여러 ASN(Autonomous System Number) + 여러 국가 + 여러 클라이언트 구현체(Prysm/Lighthouse/Teku).</p>
            </div>
          </div>
          <p className="text-xs text-foreground/60">Prysm peer selection — ENR discovery 무작위 탐색 → 위 규칙 적용 선별 → 주기적 peer churn(rotation) 수행.</p>
        </div>
        <p className="leading-7">
          <strong>Eclipse attack 방어</strong>가 핵심 보안 요구사항.<br />
          IP colocation penalty + 아웃바운드 비율 + 다양성 요구로 3중 방어.<br />
          공격자가 다수 IP 확보해도 노드를 격리하기 어려움.
        </p>

        {/* ── Resource Manager ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Resource Manager — DoS 방어</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>ResourceManager</code> 인터페이스 — 리소스 소비 제한</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80 mb-3">
              <span><code>ViewSystem(f func(SystemScope))</code></span>
              <span><code>ViewPeer(p peer.ID, f func(PeerScope))</code></span>
              <span><code>ViewProtocol(proto, f func(ProtocolScope))</code></span>
            </div>
            <p className="text-xs font-bold text-foreground/70 mb-1"><code>Limit</code> 구조체 — 스코프별 한도</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-foreground/70">
              <span><code>Streams: int</code> — 최대 동시 스트림</span>
              <span><code>Conns: int</code> — 최대 동시 연결</span>
              <span><code>FD: int</code> — 최대 file descriptor</span>
              <span><code>Memory: int64</code> — 최대 메모리(bytes)</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">스코프 계층</p>
            <p className="text-sm text-foreground/70 font-mono">System(전체 노드) → Transient / Protocol / Service / Peer → Connection → Stream</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">System Limits</p>
              <p className="text-sm text-foreground/80"><code>Streams: 16384</code> / <code>Conns: 512</code> / <code>Memory: 2GB</code></p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">Peer Limits</p>
              <p className="text-sm text-foreground/80"><code>Streams: 32</code> / <code>Conns: 2</code>(inbound+outbound) / <code>Memory: 8MB</code></p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">수천 연결 시도 → 거부</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">대량 stream → 피어당 32 제한</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">메모리 exhaustion → 8MB 격리</div>
          </div>
        </div>
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
