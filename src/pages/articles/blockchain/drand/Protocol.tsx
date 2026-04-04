import ProtocolViz from './viz/ProtocolViz';

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS 임계값 서명 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BLS 임계값 서명(t-of-n) 기반. 결정론적 성질 덕분에 같은 입력에 대해 유일한 서명 존재
        </p>
      </div>
      <div className="not-prose"><ProtocolViz /></div>
    </section>
  );
}
