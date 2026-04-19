import P2PNetworkingViz from './viz/P2PNetworkingViz';
import PeerDiscoveryViz from './viz/PeerDiscoveryViz';
import Libp2pStackViz from './viz/Libp2pStackViz';
import Discovery4StepViz from './viz/Discovery4StepViz';
import SentryArchViz from './viz/SentryArchViz';

export default function P2PNetworking() {
  return (
    <section id="p2p-networking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>libp2p</strong> 기반 모듈러 네트워킹 스택<br />
          <strong>GossipSub</strong>(메시 기반 pub/sub)로 Commitment·Tx 전파<br />
          <strong>Peer Manager</strong>가 연결 풀 관리, <strong>Sentry 노드</strong>가 검증인을 DDoS로부터 보호<br />
          <strong>2가지 네트워크 분리</strong>: Consensus P2P + Runtime P2P (per-ParaTime)
        </p>
      </div>

      <P2PNetworkingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">libp2p 스택 구성</h3>
      </div>
      <div className="not-prose mb-4"><Libp2pStackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Gossipsub 토픽 — 메시지 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">토픽</th>
                <th className="border border-border px-3 py-2 text-left">메시지</th>
                <th className="border border-border px-3 py-2 text-left">네트워크</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/consensus/tx</code></td>
                <td className="border border-border px-3 py-2">합의 트랜잭션 mempool</td>
                <td className="border border-border px-3 py-2">Consensus</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/consensus/block</code></td>
                <td className="border border-border px-3 py-2">제안 블록</td>
                <td className="border border-border px-3 py-2">Consensus</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/commit</code></td>
                <td className="border border-border px-3 py-2">Executor commitment</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/tx</code></td>
                <td className="border border-border px-3 py-2">Runtime 트랜잭션 pool</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>oasis/runtime/{'{id}'}/proposal</code></td>
                <td className="border border-border px-3 py-2">배치 제안</td>
                <td className="border border-border px-3 py-2">Runtime</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">피어 발견 메커니즘</h3>
      </div>
      <PeerDiscoveryViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mb-4"><Discovery4StepViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Sentry Architecture — 검증인 보호</h3>
      </div>
      <div className="not-prose mb-4"><SentryArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Per-ParaTime P2P 분리</p>
          <p>
            <strong>왜 분리했나</strong>:<br />
            - 각 ParaTime은 독립된 tx pool 보유<br />
            - ParaTime별 boostrap·topology 구성<br />
            - 악성 ParaTime의 gossip spam이 다른 ParaTime에 전파 차단
          </p>
          <p className="mt-2">
            <strong>비용</strong>:<br />
            ✗ 노드당 n개 libp2p 호스트 운영<br />
            ✗ Peer discovery 중복<br />
            ✗ 메모리·소켓 사용량 증가
          </p>
          <p className="mt-2">
            <strong>trade-off 수용</strong>: 격리 이점이 오버헤드 상회<br />
            - 멀티 ParaTime 아키텍처의 핵심 보안 속성<br />
            - Cosmos IBC relayer와 유사한 분리 원칙
          </p>
        </div>

      </div>
    </section>
  );
}
