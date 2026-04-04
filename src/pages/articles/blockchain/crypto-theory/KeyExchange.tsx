import KeyExchangeViz from './viz/KeyExchangeViz';

export default function KeyExchange() {
  return (
    <section id="key-exchange" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 교환: ECDH</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          안전하지 않은 채널에서 공유 비밀을 수립하는 프로토콜. DH(1976)가 원조, ECDH가 현대 표준.
        </p>
      </div>
      <div className="not-prose"><KeyExchangeViz /></div>
    </section>
  );
}
