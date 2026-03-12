import Overview from './bft-comparison/Overview';
import PBFT from './bft-comparison/PBFT';
import HotStuff from './bft-comparison/HotStuff';
import Autobahn from './bft-comparison/Autobahn';
import Comparison from './bft-comparison/Comparison';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[PBFT]</strong> Castro &amp; Liskov, &quot;Practical Byzantine Fault Tolerance&quot;, OSDI 1999
            — 3-phase 프로토콜 (pre-prepare/prepare/commit), 5 메시지 지연, O(n²) 복잡도
          </li>
          <li>
            <strong>[HotStuff]</strong> Yin et al., &quot;HotStuff: BFT Consensus with Linearity and Responsiveness&quot;, PODC 2019
            — 3-phase chained, 7 메시지 지연, O(n) 뷰 체인지, responsiveness 최초 달성
          </li>
          <li>
            <strong>[Autobahn]</strong> Müller et al., &quot;Autobahn: Seamless high speed BFT&quot;, IEEE S&amp;P 2025
            — Fast path 3 / Slow path 5 메시지 지연, hangover-free 복구
          </li>
          <li>
            <strong>[DeepWiki]</strong> deepwiki.com — 각 프로토콜 구현체 코드 분석으로 메시지 지연 수치 검증
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function BFTComparisonArticle() {
  return (
    <>
      <Overview />
      <PBFT />
      <HotStuff />
      <Autobahn />
      <Comparison />
      <References />
    </>
  );
}
