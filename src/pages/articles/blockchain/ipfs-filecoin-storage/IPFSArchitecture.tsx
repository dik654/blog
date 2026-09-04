import IPFSNodeViz from "./viz/IPFSNodeViz";
import ContentRoutingFlowViz from "./viz/ContentRoutingFlowViz";

export default function IPFSArchitecture() {
  return (
    <section id="ipfs-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Kubo는 DAG·exchange·routing·transport를 독립된 경계로 조립한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kubo를 하나의 거대한 P2P process로 보면 장애 원인을 찾기 어렵습니다. UnixFS와 IPLD는 file을 DAG block으로 표현하고 blockstore가
          local data를 보관하며 Bitswap·HTTP retrieval이 block을 전송합니다. Libp2p host와 routing system은 peer 연결과
          provider discovery를 담당합니다.
        </p>
        <p>
          Content lookup도 DHT 하나로 끝나지 않습니다. Deployment에 따라
          local routing table, delegated routing과 IPNI 계열 indexer를 조합할
          수 있으므로 “Amino DHT와 indexer를 항상 병렬 호출한다”는 식으로
          고정하면 안 됩니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <IPFSNodeViz />
      </div>
      <div className="not-prose mb-8">
        <ContentRoutingFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>성능은 CID resolve와 block transfer를 분리해 측정한다</h3>
        <p>
          첫 provider를 찾는 시간, 연결 수립, first byte와 전체 transfer를
          따로 기록합니다. Chunk size, provider 수, NAT와 cache 상태가 다르면
          병목도 달라지므로 단일 end-to-end latency만으로 routing과 transport를
          비교하기 어렵습니다.
        </p>
      </div>
    </section>
  );
}
