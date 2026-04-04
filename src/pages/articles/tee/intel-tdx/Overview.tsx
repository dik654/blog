import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDX 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Intel TDX(Trust Domain Extensions)는 VM 전체를 하드웨어로 격리합니다.<br />
          기존 OS를 수정하지 않고 기밀 VM(Trust Domain)을 실행할 수 있습니다.<br />
          SGX가 앱 단위 격리라면, TDX는 VM 단위 격리입니다.
        </p>
      </div>
    </section>
  );
}
