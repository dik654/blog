import Overview from './cometbft/Overview';
import ConsensusEngine from './cometbft/ConsensusEngine';
import ABCI from './cometbft/ABCI';
import P2PLayer from './cometbft/P2PLayer';
import MempoolStateSync from './cometbft/MempoolStateSync';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[CometBFT GitHub]</strong> github.com/cometbft/cometbft
            — 소스 코드 기반 아키텍처 분석 (consensus/, p2p/, mempool/, state/)
          </li>
          <li>
            <strong>[CometBFT 공식 문서]</strong> docs.cometbft.com
            — ABCI++ 사양, FinalizeBlock, ExtendVote/VerifyVoteExtension
          </li>
          <li>
            <strong>[Tendermint 논문]</strong> Buchman, &quot;Tendermint: Byzantine Fault Tolerance in the Age of Blockchains&quot;, 2016
            — Tendermint 합의 알고리즘, lock/unlock 메커니즘
          </li>
          <li>
            <strong>[DeepWiki]</strong> deepwiki.com/cometbft/cometbft
            — 4개 ABCI 연결, X25519+chacha20poly1305 암호화, Sentry Node 아키텍처, PartSet 분산
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function CometBFTArticle() {
  return (
    <>
      <Overview />
      <ConsensusEngine />
      <ABCI />
      <P2PLayer />
      <MempoolStateSync />
      <References />
    </>
  );
}
