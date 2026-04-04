import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import Groth16FlowViz from './viz/Groth16FlowViz';
import { groth16PipelineCode, groth16StepBreakdown } from './Groth16FlowData';

export default function Groth16Flow() {
  return (
    <section id="groth16-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 GPU 파이프라인</h2>
      <div className="not-prose mb-8"><Groth16FlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16 증명은 5단계로 구성됩니다.
          <br />
          <strong>Witness 계산</strong>만 CPU에서 실행되고, 나머지는 전부 GPU에서 처리합니다.
          <br />
          핵심은 3번의 대규모 MSM입니다. 각각 n개 포인트를 처리하므로 GPU 활용률이 높습니다.
        </p>
        <CitationBlock source="Groth16 — On the Size of Pairing-based Non-interactive Arguments"
          citeKey={2} type="paper" href="https://eprint.iacr.org/2016/260">
          <p className="text-xs">
            Groth16 증명자는 A, B, C 세 원소를 생성합니다. A와 C는 G1 위의 점이고
            B는 G2 위의 점입니다. 각 원소의 계산에 n-크기 MSM이 필요합니다.
          </p>
        </CitationBlock>
        <CodePanel title="Groth16 GPU 커널 호출 순서" code={groth16PipelineCode} annotations={[
          { lines: [3, 4], color: 'sky', note: 'CPU 전용: witness 계산' },
          { lines: [6, 9], color: 'emerald', note: 'GPU NTT: 3회 다항식 평가' },
          { lines: [11, 13], color: 'violet', note: 'GPU INTT: H(x) 몫 다항식' },
          { lines: [15, 18], color: 'amber', note: 'GPU MSM: 증명 원소 (병목)' },
          { lines: [23, 25], color: 'rose', note: 'Host-Device 전송 패턴' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">단계별 시간 비중</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">단계</th>
                <th className="border border-border px-4 py-2 text-left">장치</th>
                <th className="border border-border px-4 py-2 text-left">비중</th>
                <th className="border border-border px-4 py-2 text-left">설명</th>
              </tr>
            </thead>
            <tbody>
              {groth16StepBreakdown.map((r) => (
                <tr key={r.step}>
                  <td className="border border-border px-4 py-2 font-medium">{r.step}</td>
                  <td className="border border-border px-4 py-2">{r.device}</td>
                  <td className="border border-border px-4 py-2">{r.pct}</td>
                  <td className="border border-border px-4 py-2">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          CRS(Common Reference String)를 GPU 메모리에 상주시키면 H2D 전송 비용을 제거할 수 있습니다.
          <br />
          rapidsnark, gnark 등 프로덕션 증명자는 이 전략을 기본으로 사용합니다.
        </p>
      </div>
    </section>
  );
}
