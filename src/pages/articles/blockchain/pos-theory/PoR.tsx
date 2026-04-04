import PoRFlowViz from './viz/PoRFlowViz';

export default function PoR() {
  return (
    <section id="por" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Retrievability (PoR)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          저장자가 파일을 실제로 보유하고 요청 시 반환 가능함을 증명하는 프로토콜.<br />
          검증자는 파일 전체를 다운로드하지 않고도 무결성을 확인
        </p>
      </div>
      <div className="not-prose"><PoRFlowViz /></div>
    </section>
  );
}
