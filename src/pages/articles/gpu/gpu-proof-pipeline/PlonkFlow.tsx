import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import PlonkFlowViz from './viz/PlonkFlowViz';
import { plonkPipelineCode, plonkVsGroth16 } from './PlonkFlowData';

export default function PlonkFlow() {
  return (
    <section id="plonk-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONK GPU 파이프라인</h2>
      <div className="not-prose mb-8"><PlonkFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PLONK은 5라운드 프로토콜입니다. Groth16과 달리 <strong>Universal SRS</strong>를 사용하므로
          회로마다 새 CRS를 만들 필요가 없습니다.
          <br />
          대신 라운드마다 NTT와 MSM을 반복 호출합니다. 총 MSM 10회, NTT 11회 이상입니다.
        </p>
        <CitationBlock source="PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge"
          citeKey={3} type="paper" href="https://eprint.iacr.org/2019/953">
          <p className="text-xs">
            PLONK 증명자는 각 라운드에서 Fiat-Shamir 챌린지를 받아 다음 라운드의 다항식을 구성합니다.<br />
            Round 3의 몫 다항식은 차수 3n이므로 3등분하여 각각 별도 MSM으로 커밋합니다.
          </p>
        </CitationBlock>
        <CodePanel title="PLONK 5-Round GPU 커널 호출" code={plonkPipelineCode} annotations={[
          { lines: [3, 7], color: 'sky', note: 'Round 1: Wire 커밋 (최대 MSM)' },
          { lines: [9, 11], color: 'emerald', note: 'Round 2: 순열 커밋' },
          { lines: [13, 17], color: 'amber', note: 'Round 3: 몫 다항식 (NTT 집중)' },
          { lines: [19, 20], color: 'violet', note: 'Round 4: 스칼라 평가 (CPU)' },
          { lines: [22, 24], color: 'rose', note: 'Round 5: KZG 오프닝 (MSM)' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 vs PLONK GPU 패턴</h3>
        <p>
          Groth16은 소수의 대규모 MSM을 한꺼번에 실행하는 <strong>burst형</strong> 패턴입니다.
          <br />
          PLONK은 균일한 크기의 NTT+MSM을 반복하는 <strong>stream형</strong> 패턴입니다.
          <br />
          GPU 스케줄링 관점에서 PLONK이 더 예측 가능하고, 파이프라인 최적화가 용이합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">Groth16</th>
                <th className="border border-border px-4 py-2 text-left">PLONK</th>
              </tr>
            </thead>
            <tbody>
              {plonkVsGroth16.map((r) => (
                <tr key={r.metric}>
                  <td className="border border-border px-4 py-2 font-medium">{r.metric}</td>
                  <td className="border border-border px-4 py-2">{r.groth16}</td>
                  <td className="border border-border px-4 py-2">{r.plonk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
