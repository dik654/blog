import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossiPBFT (Filecoin F3)</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GossiPBFT는 Filecoin의 빠른 확정 프로토콜(F3)입니다.<br />
          기존 EC 합의 위에 PBFT 스타일 투표를 추가해 확정 시간을 극적으로 줄입니다
        </p>
        <h3>왜 필요한가</h3>
        <p className="leading-7">
          Filecoin EC는 확정에 약 7.5시간이 걸립니다.<br />
          크로스체인 브릿지, DeFi 등에서는 빠른 확정이 필수입니다.<br />
          💡 F3는 EC를 수정하지 않고 확정 레이어만 추가하는 설계
        </p>
      </div>
    </section>
  );
}
