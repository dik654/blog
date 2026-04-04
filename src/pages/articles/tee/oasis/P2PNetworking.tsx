import P2PNetworkingViz from './viz/P2PNetworkingViz';
import PeerDiscoveryViz from './viz/PeerDiscoveryViz';

export default function P2PNetworking() {
  return (
    <section id="p2p-networking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis Core는 <strong>libp2p</strong> 기반 P2P 네트워킹을 사용합니다.<br />
          GossipSub(메시 기반 pub/sub)으로 메시지를 전파합니다.<br />
          Peer Manager가 연결을 관리하고, 센트리 노드가 밸리데이터를 DDoS로부터 보호합니다.
        </p>
      </div>

      <P2PNetworkingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>피어 발견 메커니즘</h3>
      </div>
      <PeerDiscoveryViz />
    </section>
  );
}
