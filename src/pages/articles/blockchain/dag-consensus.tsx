import Overview from './dag-consensus/Overview';
import Narwhal from './dag-consensus/Narwhal';
import Bullshark from './dag-consensus/Bullshark';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[Narwhal &amp; Tusk]</strong> Danezis et al., &quot;Narwhal and Tusk: A DAG-based Mempool and Efficient BFT Consensus&quot;, EuroSys 2022
            — DAG mempool, 데이터 전파와 합의 분리
          </li>
          <li>
            <strong>[Bullshark]</strong> Spiegelman et al., &quot;Bullshark: DAG BFT Protocols Made Practical&quot;, CCS 2022
            — Partially synchronous DAG 합의, Narwhal 위에 구축
          </li>
          <li>
            <strong>[Sui/Mysticeti]</strong> Babel et al., &quot;Mysticeti: Low-Latency DAG Consensus with Fast Commit Path&quot;, 2024
            — Sui 블록체인의 DAG 합의 진화
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function DAGConsensusArticle() {
  return (
    <>
      <Overview />
      <Narwhal />
      <Bullshark />
      <References />
    </>
  );
}
