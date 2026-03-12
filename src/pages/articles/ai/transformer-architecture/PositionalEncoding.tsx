import PositionalEncodingChart from '../components/PositionalEncodingChart';

export default function PositionalEncoding() {
  return (
    <section id="positional-encoding">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Positional Encoding</h2>
      <p className="text-muted-foreground leading-7 mb-4">
        Transformer는 순서 정보가 없으므로, Positional Encoding을 통해
        토큰의 위치 정보를 주입합니다. 사인/코사인 함수를 사용하는 방식이 원래 논문의 방법입니다.
      </p>
      <div className="rounded-lg border bg-muted/50 p-4 font-mono text-sm space-y-1 mb-6">
        <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>)</div>
        <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)</div>
      </div>
      <PositionalEncodingChart />
    </section>
  );
}
