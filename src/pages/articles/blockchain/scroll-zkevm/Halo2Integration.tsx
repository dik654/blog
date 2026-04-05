import Halo2FlowViz from './viz/Halo2FlowViz';
import CodePanel from '@/components/ui/code-panel';
import {
  CIRCUIT_TRAIT_CODE, circuitTraitAnnotations,
  SUBCIRCUIT_TRAIT_CODE, subCircuitAnnotations,
  CELLMANAGER_CODE, cellManagerAnnotations,
} from './Halo2IntegrationData';

export default function Halo2Integration() {
  return (
    <section id="halo2-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Halo2 통합</h2>
      <div className="not-prose mb-8"><Halo2FlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>Halo2</strong> 영지식 증명 백엔드를 사용합니다.<br />
          모든 회로가 <code>Circuit</code> 트레이트를 구현하고,
          <code>SubCircuit</code> 트레이트로 서브회로 간 일관된 인터페이스를 제공합니다.
        </p>
        <CodePanel title="Circuit 트레이트" code={CIRCUIT_TRAIT_CODE}
          annotations={circuitTraitAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">SubCircuit 패턴</h3>
        <CodePanel title="SubCircuit & SubCircuitConfig" code={SUBCIRCUIT_TRAIT_CODE}
          annotations={subCircuitAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">CellManager</h3>
        <p>
          CellManager는 셀 할당을 최적화합니다. EVM Circuit은 <strong>수평 정렬</strong>
          (가장 낮은 컬럼 선택), Keccak Circuit은 <strong>수직 정렬</strong>
          (행을 우선 채우기) 전략을 사용합니다.
        </p>
        <CodePanel title="CellManager — 셀 관리" code={CELLMANAGER_CODE}
          annotations={cellManagerAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2 vs 다른 SNARK</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">SNARK 시스템</th>
                <th className="border border-border px-3 py-2 text-left">Trusted Setup</th>
                <th className="border border-border px-3 py-2 text-left">Proof 크기</th>
                <th className="border border-border px-3 py-2 text-left">Prover 속도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Groth16 (2016)</td>
                <td className="border border-border px-3 py-2">Per-circuit</td>
                <td className="border border-border px-3 py-2">192 bytes</td>
                <td className="border border-border px-3 py-2">빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">PLONK (2019)</td>
                <td className="border border-border px-3 py-2">Universal</td>
                <td className="border border-border px-3 py-2">~500 bytes</td>
                <td className="border border-border px-3 py-2">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Halo2 (2020)</strong></td>
                <td className="border border-border px-3 py-2">Universal (KZG)</td>
                <td className="border border-border px-3 py-2">~1-2 KB</td>
                <td className="border border-border px-3 py-2">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Plonky2 (2022)</td>
                <td className="border border-border px-3 py-2">None (FRI)</td>
                <td className="border border-border px-3 py-2">~50 KB</td>
                <td className="border border-border px-3 py-2">매우 빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">STARKs</td>
                <td className="border border-border px-3 py-2">None</td>
                <td className="border border-border px-3 py-2">~100 KB</td>
                <td className="border border-border px-3 py-2">빠름</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Scroll의 Halo2 선택 이유</p>
          <p>
            <strong>Universal setup</strong>: Circuit 변경 시 재설정 불필요<br />
            <strong>Lookup arguments</strong>: zkEVM table system에 필수<br />
            <strong>PLONKish arithmetization</strong>: 유연한 custom gates<br />
            <strong>활발한 생태계</strong>: ZCash, PSE, Axiom 등 공유
          </p>
        </div>

      </div>
    </section>
  );
}
