import PrimeFieldViz from './viz/PrimeFieldViz';
import PrimeFieldDefViz from './viz/PrimeFieldDefViz';
import MultiplicativeGroupViz from './viz/MultiplicativeGroupViz';
import PrimitiveRootViz from './viz/PrimitiveRootViz';

export default function PrimeField() {
  return (
    <section id="prime-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소수체 & 원시근</h2>
      <div className="not-prose mb-8"><PrimeFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>소수체 정의</h3>
      </div>
      <div className="not-prose mb-8"><PrimeFieldDefViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>곱셈군 Fp*</h3>
      </div>
      <div className="not-prose mb-8"><MultiplicativeGroupViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>원시근 (Primitive Root)</h3>
      </div>
      <div className="not-prose mb-8"><PrimitiveRootViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>ZKP에서의 활용</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'NTT 단위근', desc: 'p-1이 2의 거듭제곱을 인수로 가지면 NTT 가능 (BN254: p-1 = 2²⁸ · ...)' },
            { name: 'Pedersen 생성원', desc: 'g, h를 이산로그 관계 미지인 두 생성원으로 선택' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-semibold text-sm text-indigo-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
