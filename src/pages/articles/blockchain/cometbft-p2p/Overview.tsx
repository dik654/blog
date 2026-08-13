import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P stack은 peer discovery와 channel별 message routing을 분리한다</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Peer discovery·연결·protocol dispatch를 서로 다른 lifecycle로 나누어
        읽는다.
        번들된 MConnection·Switch·Reactor 코드는 legacy P2P 스택의 구체적
        예이며, 최신 CometBFT의 libp2p 경로와 혼동하지 않는다.
      </p>
      <div className="not-prose">
        <ContextViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── P2P 3계층 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Legacy P2P의 3계층</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Layer 1: MConnection
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>단일 TCP connection 위 다중화</li>
              <li>
                N개 channel (<code className="text-xs">channelID</code> 1 byte)
              </li>
              <li>
                <code className="text-xs">sendRoutine</code>/
                <code className="text-xs">recvRoutine</code> goroutine
              </li>
              <li>설정값에 따른 rate limiting과 채널 스케줄링</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Layer 2: Switch
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Reactor 등록 및 dispatch</li>
              <li>
                Peer 연결 관리 (<code className="text-xs">DialPeer</code>,{" "}
                <code className="text-xs">AcceptPeer</code>)
              </li>
              <li>Broadcast (모든 peer)</li>
              <li>
                <code className="text-xs">PeerSet</code> 관리
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Layer 3: Reactor
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 reactor가 channel ID 소유</li>
              <li>
                <code className="text-xs">Receive(Envelope)</code> 핸들러
              </li>
              <li>
                <code className="text-xs">AddPeer</code>/
                <code className="text-xs">RemovePeer</code> 이벤트
              </li>
              <li>gossip 로직 구현</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              ConsensusReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x22</code> — proposal/vote
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              MempoolReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x20</code> — TX gossip
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              BlockchainReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x30</code> — block sync
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              PEXReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x40</code> — peer exchange
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              StateSyncReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x60</code> — snapshot sync
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              EvidenceReactor
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">0x38</code> — evidence gossip
            </p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              Outgoing 경로
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <code className="text-xs">Reactor.Send(peer, chID, msg)</code>
              </p>
              <p>
                → <code className="text-xs">Peer.Send(chID, msg)</code>
              </p>
              <p>
                → <code className="text-xs">MConnection.Send(chID, bytes)</code>
              </p>
              <p>
                → <code className="text-xs">sendRoutine</code> goroutine → TCP
                write
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              Incoming 경로
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                TCP read → <code className="text-xs">recvRoutine</code>{" "}
                goroutine
              </p>
              <p>
                →{" "}
                <code className="text-xs">
                  MConnection.onReceive(chID, bytes)
                </code>
              </p>
              <p>
                → <code className="text-xs">Switch.recvRoutine</code>
              </p>
              <p>
                → <code className="text-xs">Reactor.Receive(Envelope)</code>
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          legacy 경로에서는 <strong>MConnection·Switch·Reactor</strong>가 전송,
          peer lifecycle, domain message를 나누어 담당한다.
          libp2p 경로는 transport·stream·peer 요소가 달라지나, 핵심 문제는 같다.
          각 프로토콜의 메시지를 분리하고 느린 피어가 합의·멤풀·동기화를 함께
          막지 않게 하는 것이다.
        </p>
      </div>
    </section>
  );
}
