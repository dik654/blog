import SigningRootViz from './viz/SigningRootViz';

export default function SigningRoot({ title }: { title: string }) {
  return (
    <section id="signing-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          BLS 서명의 메시지는 <code>signing_root</code>다.
          <br />
          header를 SSZ 직렬화하고 도메인을 결합해서 생성한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> 동일한 signing_root 계산을 사용한다.
          <br />
          도메인이 달라지면 서명이 무효화되므로 크로스체인 리플레이를 방지한다.
        </p>
      </div>
      <div className="not-prose"><SigningRootViz /></div>
    </section>
  );
}
