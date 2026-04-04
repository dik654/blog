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
      </div>
    </section>
  );
}
