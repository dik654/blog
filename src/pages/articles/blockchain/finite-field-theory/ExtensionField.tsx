import ExtFieldViz from './viz/ExtFieldViz';

export default function ExtensionField() {
  return (
    <section id="extension-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          기존 체에 기약 다항식의 근을 추가하여 더 큰 체 구성 — BN254 페어링에서 필수.
        </p>
      </div>
      <div className="not-prose"><ExtFieldViz /></div>
    </section>
  );
}
