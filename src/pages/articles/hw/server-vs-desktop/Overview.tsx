import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 부품이 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 vs 데스크톱 부품 <strong>근본적 차이</strong>.<br />
          CPU, 메인보드, 안정성 기능 비교.<br />
          Filecoin mining, 24/7 infra에서 서버 부품 필수 이유.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">설계 철학 차이</h3>
        <ul className="leading-7">
          <li><strong>Desktop (consumer)</strong> — 1 사용자, interactive. 8~16h/day 가동. single failure = 불편. 달러당 성능 우선, 조용/컴팩트/스타일.</li>
          <li><strong>Server (professional)</strong> — N 사용자, batch/service. 24/7 가동. single failure = 매출 손실. 신뢰성 + 확장성 우선, 시끄럽고 모듈러, 산업형.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 차이</h3>
        <ul className="leading-7">
          <li><strong>품질</strong> — Desktop consumer-grade 3년 보증, Server enterprise-grade 5~7년 보증.</li>
          <li><strong>부품</strong> — Desktop 게이밍/생산성 최적화, Server throughput + 신뢰성 최적화.</li>
          <li><strong>Redundancy</strong> — Desktop single path, Server dual PSU + ECC + hot-swap.</li>
          <li><strong>관리</strong> — Desktop 로컬 (keyboard + monitor), Server 원격 (IPMI, KVM over IP).</li>
          <li><strong>냉각</strong> — Desktop open-air 조용, Server 고 RPM fan + rack 최적화.</li>
          <li><strong>전력</strong> — Desktop 500~850W, Server 1000~3000W + redundant.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 비교 (유사 compute)</h3>
        <ul className="leading-7">
          <li>Desktop workstation — $3K~$5K</li>
          <li>동급 Server — $8K~$15K</li>
          <li>신뢰성 프리미엄 — 2~3배</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Desktop 적합 용도</h3>
        <ul className="leading-7">
          <li>홈 랩</li>
          <li>단일 사용자 ML</li>
          <li>경량 crypto mining</li>
          <li>개발 머신</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Server 필요 용도</h3>
        <ul className="leading-7">
          <li>24/7 Filecoin mining</li>
          <li>프로덕션 DB</li>
          <li>웹 서비스</li>
          <li>엔터프라이즈 워크로드</li>
          <li>멀티테넌트 compute</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">중간 tier — HEDT</h3>
        <p className="leading-7">
          High-End Desktop. Threadripper / Xeon W. 일부 서버 기능 + desktop 폼팩터. $5K~$10K 가격대.
        </p>
        <p className="leading-7">
          설계 철학: <strong>Desktop (performance/$) vs Server (reliability + scale)</strong>.<br />
          24/7 operation + failure = revenue loss → server parts 필수.<br />
          HEDT가 중간 tier (Threadripper, Xeon W).
        </p>
      </div>
    </section>
  );
}
