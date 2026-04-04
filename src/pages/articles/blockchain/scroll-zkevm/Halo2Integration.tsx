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
      </div>
    </section>
  );
}
