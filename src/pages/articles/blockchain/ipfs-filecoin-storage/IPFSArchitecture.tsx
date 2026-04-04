import IPFSNodeViz from './viz/IPFSNodeViz';
import ContentRoutingFlowViz from './viz/ContentRoutingFlowViz';

export default function IPFSArchitecture() {
  return (
    <section id="ipfs-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS Kubo 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Kubo — IPFS 공식 Go 구현체. API, Core(UnixFS/DAG/IPNS), Exchange(Bitswap), Network(libp2p) 4계층 구조.<br />
          콘텐츠 라우팅은 Amino DHT + IPNI 인덱서 병렬 탐색
        </p>
      </div>
      <div className="not-prose mb-8"><IPFSNodeViz /></div>
      <div className="not-prose"><ContentRoutingFlowViz /></div>
    </section>
  );
}
