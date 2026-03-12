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
