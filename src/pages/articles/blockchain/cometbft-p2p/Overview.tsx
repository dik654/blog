import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 스택 전체 구조</h2>
      <p className="text-sm text-muted-foreground mb-4">
        CometBFT P2P — MConnection(다중화) → Switch(피어 관리) → Reactor(메시지 핸들러) 3계층.<br />
        아래 step을 넘기며 각 계층의 역할과 소스 코드를 추적한다.
      </p>
      <div className="not-prose"><ContextViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── P2P 3계층 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">P2P 3계층 아키텍처</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Layer 1: MConnection</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>단일 TCP connection 위 다중화</li>
              <li>N개 channel (<code className="text-xs">channelID</code> 1 byte)</li>
              <li><code className="text-xs">sendRoutine</code>/<code className="text-xs">recvRoutine</code> goroutine</li>
              <li>Rate limiting (500KB/s default)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Layer 2: Switch</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Reactor 등록 및 dispatch</li>
              <li>Peer 연결 관리 (<code className="text-xs">DialPeer</code>, <code className="text-xs">AcceptPeer</code>)</li>
              <li>Broadcast (모든 peer)</li>
              <li><code className="text-xs">PeerSet</code> 관리</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Layer 3: Reactor</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 reactor가 channel ID 소유</li>
              <li><code className="text-xs">Receive(Envelope)</code> 핸들러</li>
              <li><code className="text-xs">AddPeer</code>/<code className="text-xs">RemovePeer</code> 이벤트</li>
              <li>gossip 로직 구현</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">ConsensusReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x22</code> — proposal/vote</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">MempoolReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x20</code> — TX gossip</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">BlockchainReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x30</code> — block sync</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">PEXReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x40</code> — peer exchange</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">StateSyncReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x60</code> — snapshot sync</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">EvidenceReactor</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">0x38</code> — evidence gossip</p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Outgoing 경로</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">Reactor.Send(peer, chID, msg)</code></p>
              <p>→ <code className="text-xs">Peer.Send(chID, msg)</code></p>
              <p>→ <code className="text-xs">MConnection.Send(chID, bytes)</code></p>
              <p>→ <code className="text-xs">sendRoutine</code> goroutine → TCP write</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Incoming 경로</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>TCP read → <code className="text-xs">recvRoutine</code> goroutine</p>
              <p>→ <code className="text-xs">MConnection.onReceive(chID, bytes)</code></p>
              <p>→ <code className="text-xs">Switch.recvRoutine</code></p>
              <p>→ <code className="text-xs">Reactor.Receive(Envelope)</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          P2P는 <strong>3계층 (MConnection/Switch/Reactor)</strong>.<br />
          Reactor가 channel ID로 메시지 타입 구분 → 독립 처리.<br />
          outgoing/incoming 양방향 goroutine으로 I/O 처리.
        </p>
      </div>
    </section>
  );
}
