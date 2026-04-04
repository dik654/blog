import CircuitMapViz from './viz/CircuitMapViz';
import CodePanel from '@/components/ui/code-panel';
import {
  SUBCIRCUIT_MAP_CODE, subcircuitAnnotations,
  SUPER_CIRCUIT_CODE, superCircuitAnnotations,
} from './CircuitOverviewData';

export default function CircuitOverview() {
  return (
    <section id="circuit-overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서브회로 전체 구조</h2>
      <div className="not-prose mb-8"><CircuitMapViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>SuperCircuit</strong>으로 11개 서브회로를 통합합니다.<br />
          EVM Circuit이 오퍼코드를 실행하고, Bytecode/Copy/Keccak/MPT 등이
          각각 코드 무결성, 메모리 복사, 해시, 상태 트리를 병렬 검증합니다.
        </p>
        <p>
          zkTrie는 이더리움의 Hexary MPT 대신 <strong>Sparse Binary Merkle Patricia Trie</strong>를
          사용하며, Poseidon 해시로 SNARK-friendly한 상태 증명을 제공합니다.
        </p>
        <CodePanel title="서브회로 구성" code={SUBCIRCUIT_MAP_CODE}
          annotations={subcircuitAnnotations} />
        <CodePanel title="SuperCircuit — 통합 회로" code={SUPER_CIRCUIT_CODE}
          annotations={superCircuitAnnotations} />
      </div>
    </section>
  );
}
