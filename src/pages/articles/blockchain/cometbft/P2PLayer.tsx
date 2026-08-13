import { CitationBlock } from "../../../../components/ui/citation";
import P2PChannelViz from "./viz/P2PChannelViz";
import { P2P_TABLE_ROWS } from "./P2PLayerData";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

const CELL = "border border-border px-4 py-2";

export default function P2PLayer({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="p2p-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">P2P layer: 한 peer connection을 protocol별 channel로 나눈다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 consensus vote, mempool transaction, block sync와 peer exchange를 서로 다른 <code>Reactor</code>로 나누지만, peer마다 별도의 TCP connection을 여러 개 열지는 않습니다. <code>MConnection</code>이 하나의 authenticated connection을 여러 channel로 multiplex하고, 각 reactor가 자신에게 할당된 channel ID로 message를 주고받습니다.
        </p>
        <p>
          Ethereum execution layer의 devp2p와 consensus layer의 libp2p도 여러 subprotocol을 한 peer 관계 위에서 운반한다는 목적은 비슷합니다. 다만 framing, discovery와 gossip algorithm은 같지 않으므로 “CometBFT가 libp2p를 쓴다”는 식으로 이해하면 안 됩니다. 먼저 channel 경계를 보고 나서 각 reactor의 전파 전략을 살펴보겠습니다.
        </p>
        <CitationBlock
          source="cometbft/p2p/conn/connection.go"
          citeKey={5}
          type="code"
          href="https://github.com/cometbft/cometbft/blob/main/p2p/conn/connection.go"
        >
          <p className="text-xs text-foreground/70">
            <code>MConnection</code>은 단일 TCP 연결 위에 여러 채널을
            멀티플렉싱합니다. 각 <code>Reactor</code>(Consensus, Mempool 등)가
            고유 채널 ID로 등록되어 독립적으로 메시지를 송수신합니다.
          </p>
        </CitationBlock>
      </div>
      <div className="not-prose my-8">
        <P2PChannelViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">P2P 스택 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>계층</th>
                <th className={`${CELL} text-left`}>이더리움</th>
                <th className={`${CELL} text-left`}>CometBFT</th>
              </tr>
            </thead>
            <tbody>
              {P2P_TABLE_ROWS.map((r) => (
                <tr key={r.layer}>
                  <td className={`${CELL} font-medium`}>{r.layer}</td>
                  <td className={CELL}>{r.eth}</td>
                  <td className={CELL}>{r.cmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">Reactor 패턴</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("reactor-receive", codeRefs["reactor-receive"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Reactor.Receive()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("gossip-routines", codeRefs["gossip-routines"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            gossipDataRoutine()
          </span>
        </div>
      </div>
      <div data-viz="cometbft-reactor-channels" className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["0x20", "Mempool", "검증된 transaction 전파"],
          ["0x22", "Consensus", "proposal·prevote·precommit 전파"],
          ["0x30", "Block Sync", "뒤처진 node에 block 전달"],
          ["0x40", "PEX", "알고 있는 peer address 교환"],
          ["0x60", "State Sync", "snapshot metadata와 chunk 동기화"],
        ].map(([channel, reactor, role]) => (
          <article key={channel} className="min-w-0 rounded-xl border bg-card p-4">
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold text-muted-foreground">{channel}</span>
            <strong className="mt-4 block text-sm">{reactor}</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{role}</p>
          </article>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Gossip 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Gossip 전략 — Message Propagation
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                1. Mempool Gossip
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>peer별 별도 goroutine</li>
                <li>last-seen-by-peer 추적 (index)</li>
                <li>new TX → 모든 peer에 방송</li>
                <li>Rate limit: 1MB/peer/sec</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                2. Consensus Gossip
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>매 round마다 새 proposal/votes</li>
                <li>
                  <code>HasVote</code> bitArray로 peer 상태 tracking
                </li>
                <li>peer가 모르는 vote만 전송</li>
                <li>Priority: Proposal &gt; Vote &gt; Heartbeat</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                3. Blockchain Gossip
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>뒤처진 peer에게 블록 전송</li>
                <li>
                  <code>BlockchainReactor.respondToPeer()</code>
                </li>
                <li>한 peer에 연속 블록 전달 (pipelining)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              <code>PeerRoundState</code> — peer별 상태 tracking
            </p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <code>Height</code> / <code>Round</code> / <code>Step</code> —
                peer의 합의 위치
              </span>
              <span>
                <code>Proposal bool</code> — peer가 proposal 보유 여부
              </span>
              <span>
                <code>ProposalBlockParts *bits.BitArray</code> — 받은 block
                parts
              </span>
              <span>
                <code>Prevotes *bits.BitArray</code> — peer가 본 prevotes
              </span>
              <span>
                <code>Precommits *bits.BitArray</code> — peer가 본 precommits
              </span>
              <span>
                <code>CatchupCommit *bits.BitArray</code> — catchup용 commit
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              중복 메시지 최소화 (peer 상태 기반) / 빠른 catchup / 대역폭 효율
              (선택적 전송)
            </p>
          </div>
        </div>
        <p>
          Consensus reactor는 peer별 <code>PeerRoundState</code>를 유지해 상대가 이미 가진 proposal part와 vote를 반복해서 보내지 않습니다. Mempool과 block sync도 각자 cursor와 request state를 사용합니다. 따라서 이 전파 방식의 핵심은 범용 GossipSub mesh가 아니라, protocol state를 아는 reactor가 peer마다 부족한 message를 선택해 직접 보내는 데 있습니다.
        </p>
      </div>
    </section>
  );
}
