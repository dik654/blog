import { CitationBlock } from '../../../../components/ui/citation';
import P2PChannelViz from './viz/P2PChannelViz';
import { MCONNECTION_CODE, P2P_TABLE_ROWS, REACTOR_CODE } from './P2PLayerData';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function P2PLayer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="p2p-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 네트워킹</h2>
      <div className="not-prose mb-8"><P2PChannelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 P2P 레이어는 이더리움의 devp2p/libp2p와 비교됩니다.
          <br />
          이더리움 EL은 devp2p(RLPx)를, CL은 libp2p를 사용합니다.
          <br />
          CometBFT는 자체 <strong>MConnection(멀티플렉스 연결, 단일 TCP 위 다중 채널)</strong> 기반의 Gossip 프로토콜을 사용합니다.
        </p>
        <CitationBlock source="cometbft/p2p/conn/connection.go" citeKey={5} type="code" href="https://github.com/cometbft/cometbft/blob/main/p2p/conn/connection.go">
          <pre className="text-xs overflow-x-auto"><code>{MCONNECTION_CODE}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">MConnection은 단일 TCP 연결 위에 여러 채널을 멀티플렉싱합니다. 각 Reactor(Consensus, Mempool 등)가 고유 채널 ID로 등록되어 독립적으로 메시지를 송수신합니다.</p>
        </CitationBlock>
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
              {P2P_TABLE_ROWS.map(r => (
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
          <CodeViewButton onClick={() => onCodeRef('reactor-receive', codeRefs['reactor-receive'])} />
          <span className="text-[10px] text-muted-foreground self-center">Reactor.Receive()</span>
          <CodeViewButton onClick={() => onCodeRef('gossip-routines', codeRefs['gossip-routines'])} />
          <span className="text-[10px] text-muted-foreground self-center">gossipDataRoutine()</span>
        </div>
        <p>
          CometBFT Reactor들:<br />
          MConnection (멀티플렉스 TCP 연결)<br />
          Channel 0x20: Mempool Reactor<br />
          → 트랜잭션 전파 (이더리움 txpool 역할)<br />
          Channel 0x22: Consensus Reactor<br />
          → Proposal, Prevote, Precommit 전파<br />
          Channel 0x30: Blockchain Reactor<br />
          → 블록 동기화 (이더리움 snap sync 유사)<br />
          Channel 0x40: PEX Reactor<br />
          → 피어 교환 (이더리움 discv5 유사)<br />
          Channel 0x60: State Sync Reactor<br />
          → 상태 스냅샷 동기화
        </p>

        {/* ── Gossip 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip 전략 — Message Propagation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT Gossip 특징 (libp2p GossipSub와 다름)
// Channel별 독립적 전파 로직

// 1. Mempool Gossip:
//    - peer별 별도 goroutine
//    - last-seen-by-peer 추적 (index)
//    - new TX → 모든 peer에 방송 (자기 제외)
//    - Rate limit: 1MB/peer/sec

// 2. Consensus Gossip:
//    - 매 round마다 새 proposal/votes
//    - HasVote bitArray로 peer 상태 tracking
//    - peer가 모르는 vote만 전송 (bandwidth 절약)
//    - Priority: Proposal > Vote > Heartbeat

// 3. Blockchain Gossip:
//    - 뒤처진 peer에게 블록 전송
//    - BlockchainReactor.respondToPeer()
//    - 한 peer에 연속 블록 전달 (pipelining)

// peer별 상태 tracking:
type PeerRoundState struct {
    Height                  int64
    Round                   int32
    Step                    RoundStepType

    StartTime               time.Time
    Proposal                bool              // peer가 proposal 가졌나
    ProposalBlockPartSetHeader  PartSetHeader
    ProposalBlockParts      *bits.BitArray
    ProposalPOLRound        int32

    Prevotes                *bits.BitArray    // peer가 본 prevotes
    Precommits              *bits.BitArray    // peer가 본 precommits
    LastCommitRound         int32
    LastCommit              *bits.BitArray
    CatchupCommitRound      int32
    CatchupCommit           *bits.BitArray
}

// 결과:
// - 중복 메시지 최소화 (peer 상태 기반)
// - 빠른 catchup (뒤처진 peer 신속 동기화)
// - 대역폭 효율 (선택적 전송)`}
        </pre>
        <p className="leading-7">
          CometBFT Gossip은 <strong>peer state tracking 기반</strong>.<br />
          peer가 본 votes/parts 추적 → 필요한 것만 선택 전송.<br />
          GossipSub 대비 단순하지만 효율적인 직접 P2P 전파.
        </p>
      </div>
    </section>
  );
}
