import Overview from './filecoin-lotus/Overview';
import ConsensusProofs from './filecoin-lotus/ConsensusProofs';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[Filecoin 백서]</strong> Protocol Labs, &quot;Filecoin: A Decentralized Storage Network&quot;, 2017
            — Expected Consensus, PoRep/PoSt, Tipset 구조
          </li>
          <li>
            <strong>[Lotus GitHub]</strong> github.com/filecoin-project/lotus
            — 노드 구성 (daemon/miner/worker/boost), 체인 동기화 프로토콜
          </li>
          <li>
            <strong>[FIP-0086: F3]</strong> Filecoin Improvement Proposal — Fast Finality (F3) 프로토콜, GossiPBFT 기반
          </li>
          <li>
            <strong>[FVM 사양]</strong> spec.filecoin.io — FVM 아키텍처, WASM 런타임, FEVM/SputnikVM, 하이퍼바이저 설계
          </li>
          <li>
            <strong>[DeepWiki]</strong> deepwiki.com/filecoin-project/lotus
            — 평균 5 리더/에포크, Tipset 상태 실행, 슬래싱 조건
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function FilecoinLotusArticle() {
  return (
    <>
      <Overview />
      <ConsensusProofs />
      <References />
    </>
  );
}
