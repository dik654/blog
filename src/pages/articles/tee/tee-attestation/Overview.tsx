import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원격 증명(Remote Attestation)은 TEE 내부 코드의 신뢰성을 원격으로 검증하는 메커니즘입니다.<br />
          "이 코드가 정말 TEE 안에서 실행 중인가?"에 대한 암호학적 증명을 제공합니다.
        </p>
      </div>
    </section>
  );
}
