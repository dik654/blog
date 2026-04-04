import SimplexBFTViz from './viz/SimplexBFTViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex 프로토콜 & BFT 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Simplex — Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 합의 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong>
        </p>
        <p className="leading-7">
          4가지 핵심 혁신으로 기존 프로토콜의 한계를 돌파:
          <br />
          <strong>① 즉시 View 전환</strong> — Cert(k,x) 수집 즉시 view k+1로 이동. View-change 전송 불가
          <br />
          <strong>② No-Commit 증명</strong> — n-f View-change = 해당 view에서 결정 없었음 증명
          <br />
          <strong>③ 리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거
          <br />
          <strong>④ 짧은 Timeout</strong> — 6Δ → 3Δ 단축
        </p>
        <p className="leading-7">
          Commonware 구현: <code>consensus::simplex</code>(기본) + <code>consensus::threshold_simplex</code>(VRF+BLS)
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexBFTViz /></div>
    </section>
  );
}
