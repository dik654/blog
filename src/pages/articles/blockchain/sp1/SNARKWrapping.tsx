import SNARKWrapViz from './viz/SNARKWrapViz';
import CodePanel from '@/components/ui/code-panel';
import {
  SHRINK_CODE, shrinkAnnotations,
  WRAP_CODE, wrapAnnotations, COMPARE,
} from './SNARKWrappingData';

export default function SNARKWrapping() {
  return (
    <section id="snark-wrapping" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK 래핑</h2>
      <div className="not-prose mb-8"><SNARKWrapViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Compressed STARK는 아직 온체인 검증에 너무 큽니다.
          <strong>Shrink → Wrap → Groth16</strong> 3단계를 거쳐
          ~192바이트 SNARK으로 변환하면 이더리움에서 검증 가능합니다.
        </p>
        <CodePanel title="Shrink (필드 전환)" code={SHRINK_CODE}
          annotations={shrinkAnnotations} />
        <CodePanel title="Wrap + Groth16" code={WRAP_CODE}
          annotations={wrapAnnotations} />
        <h3>Groth16 vs PLONK 비교</h3>
      </div>
      <div className="not-prose overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-foreground/60 font-medium">항목</th>
              <th className="text-left py-2 px-3 text-violet-400 font-medium">Groth16</th>
              <th className="text-left py-2 px-3 text-emerald-400 font-medium">PLONK</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map(c => (
              <tr key={c.item} className="border-b border-border/50">
                <td className="py-2 px-3 font-medium text-foreground/70">{c.item}</td>
                <td className="py-2 px-3 text-foreground/80">{c.groth16}</td>
                <td className="py-2 px-3 text-foreground/80">{c.plonk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
