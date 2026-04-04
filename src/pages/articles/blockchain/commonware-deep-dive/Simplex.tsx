import SimplexViz from './viz/SimplexViz';

export default function Simplex() {
  return (
    <section id="simplex" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex Consensus</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong> 계보의 최신 합의
        </p>
        <p className="leading-7">
          4가지 핵심 혁신:
          <br />
          <strong>즉시 View 전환</strong> — Cert(k, x) 수집 즉시 view k+1로 이동. 기존처럼 머무르며 View-change 전송 불가
          <br />
          <strong>No-Commit 증명</strong> — n-f개 View-change(k) = 해당 view에서 결정 없었음을 증명
          <br />
          <strong>리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거. 리더는 즉시 제안
          <br />
          <strong>짧은 Timeout</strong> — View-change timeout 6Δ → 3Δ로 단축
        </p>
        <p className="leading-7">
          Commonware의 <code>consensus::simplex</code>가 프로덕션 구현
          <br />
          <code>consensus::threshold_simplex</code> — VRF + BLS 임계 서명 추가 변형
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexViz /></div>
    </section>
  );
}
