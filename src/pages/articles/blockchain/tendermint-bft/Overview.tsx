import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tendermint BFT 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tendermint BFT(2014, Kwon) — PBFT를 블록체인에 최적화한 프로토콜.<br />
          Propose → Prevote → Precommit → Commit 라운드 기반 합의.<br />
          CometBFT(구 Tendermint Core)로 발전하여 Cosmos 생태계의 핵심 엔진
        </p>
        <p>
          이 아티클에서는 프로토콜 흐름, Polka 잠금 메커니즘,<br />
          단일 슬롯 확정성, PBFT 대비 개선점을 분석
        </p>
      </div>
    </section>
  );
}
