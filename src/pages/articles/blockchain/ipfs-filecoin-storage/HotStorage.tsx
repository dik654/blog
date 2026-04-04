import HotStorageViz from './viz/HotStorageViz';

export default function HotStorage() {
  return (
    <section id="hot-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 핫 스토리지 &amp; Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Cold(PoRep 봉인, 접근 느림) → Hot(PDP, 즉시 접근) 진화.<br />
          Boost가 HTTP 기반 검색, DDO(Direct Data Onboarding), PDP 온체인 증명을 통합
        </p>
      </div>
      <div className="not-prose"><HotStorageViz /></div>
    </section>
  );
}
