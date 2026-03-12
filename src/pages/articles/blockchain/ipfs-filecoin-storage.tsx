import Overview from './ipfs-filecoin-storage/Overview';
import IPFSArchitecture from './ipfs-filecoin-storage/IPFSArchitecture';
import HotStorage from './ipfs-filecoin-storage/HotStorage';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[IPFS 백서]</strong> Benet, &quot;IPFS - Content Addressed, Versioned, P2P File System&quot;, 2014
            — CID, Merkle DAG, Bitswap, DHT 기반 아키텍처
          </li>
          <li>
            <strong>[Kubo GitHub]</strong> github.com/ipfs/kubo
            — Kubo 노드 구조, Bitswap 세션, 라우팅 설정
          </li>
          <li>
            <strong>[Kubo DeepWiki]</strong> deepwiki.com/ipfs/kubo
            — Blockstore/Datastore 구조, IPNI 위임 라우팅
          </li>
          <li>
            <strong>[Boost GitHub]</strong> github.com/filecoin-project/boost
            — Deal Engine, HTTP 검색, Piece Store 인덱싱
          </li>
          <li>
            <strong>[Boost DeepWiki]</strong> deepwiki.com/filecoin-project/boost
            — 핫 스토리지 아키텍처, Graphsync→HTTP 전환
          </li>
          <li>
            <strong>[Filecoin Spec]</strong> spec.filecoin.io
            — 저장 시장, 딜 프로세스, Fil+ DataCap
          </li>
          <li>
            <strong>[IPNI]</strong> github.com/ipni — InterPlanetary Network Indexer, cid.contact
          </li>
          <li>
            <strong>[Kubo 릴리스]</strong> github.com/ipfs/kubo/releases
            — Bitswap Broadcast Reduction (0.36), Sweep Provider (0.38), HTTP 검색 기본화 (0.36)
          </li>
          <li>
            <strong>[PDP 소개]</strong> filecoin.io/blog/posts/introducing-proof-of-data-possession-pdp
            — PDP 챌린지-응답 메커니즘, 160바이트 증명, 가변 컬렉션
          </li>
          <li>
            <strong>[FOC 소개]</strong> filecoin.io/blog/posts/introducing-filecoin-onchain-cloud
            — 3계층 아키텍처 (PDP + Filecoin Pay + Warm Storage Service)
          </li>
          <li>
            <strong>[FOC 문서]</strong> docs.filecoin.cloud
            — PDP 개요, FOC 아키텍처, Curio 노드
          </li>
          <li>
            <strong>[Boost 문서]</strong> boost.filecoin.io
            — LID (YugabyteDB), booster-http/bitswap, Trustless Gateway 사양
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function IPFSFilecoinStorageArticle() {
  return (
    <>
      <Overview />
      <IPFSArchitecture />
      <HotStorage />
      <References />
    </>
  );
}
