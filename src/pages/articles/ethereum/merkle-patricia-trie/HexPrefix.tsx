import HexPrefixViz from './viz/HexPrefixViz';

export default function HexPrefix() {
  return (
    <section id="hex-prefix" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hex-Prefix 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Extension과 Leaf 모두 [경로, 값/포인터] 형태 — 구분이 필요.<br />
          Hex-Prefix가 첫 번째 니블에 노드 유형과 패리티(홀짝) 정보를 인코딩하여 해결
        </p>
      </div>
      <div className="not-prose"><HexPrefixViz /></div>
    </section>
  );
}
