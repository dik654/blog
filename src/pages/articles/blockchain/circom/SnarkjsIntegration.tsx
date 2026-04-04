import SnarkjsFlowViz from './viz/SnarkjsFlowViz';
import CodePanel from '@/components/ui/code-panel';

const WORKFLOW_CODE = `// 1. Powers of Tau 세레모니
await snarkjs.powersOfTau.newAccumulator("bn128", 12, "pot.ptau");
await snarkjs.powersOfTau.contribute("pot.ptau", "pot1.ptau", "contrib");
await snarkjs.powersOfTau.preparePhase2("pot1.ptau", "pot_final.ptau");

// 2. 회로별 키 생성
await snarkjs.zKey.newZKey("circuit.r1cs", "pot_final.ptau", "circuit.zkey");
await snarkjs.zKey.contribute("circuit.zkey", "circuit_final.zkey", "contrib2");
const vKey = await snarkjs.zKey.exportVerificationKey("circuit_final.zkey");

// 3. 증인 계산 (WASM)
const wc = await circomlib.WitnessCalculatorBuilder(wasmBuffer);
const witness = await wc.calculateWitness(input);

// 4. 증명 생성 & 검증
const { proof, publicSignals } = await snarkjs.groth16.prove(zkey, witness);
const valid = await snarkjs.groth16.verify(vKey, publicSignals, proof);`;

export default function SnarkjsIntegration({ title }: { title?: string }) {
  return (
    <section id="snarkjs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'snarkjs 통합'}</h2>
      <div className="not-prose mb-8">
        <SnarkjsFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circom 컴파일 결과물(<code>.r1cs</code>, <code>.wasm</code>, <code>.sym</code>)은
          snarkjs와 연동하여 완전한 zkSNARK 증명 시스템을 구축합니다.<br />
          Powers of Tau 세레모니부터 Groth16 증명/검증까지의 전체 워크플로우입니다.
        </p>
        <CodePanel
          title="snarkjs 전체 워크플로우"
          code={WORKFLOW_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: 'Powers of Tau 신뢰 셋업' },
            { lines: [7, 9], color: 'emerald', note: '회로별 증명키/검증키 생성' },
            { lines: [12, 13], color: 'amber', note: 'WASM 기반 증인 계산' },
            { lines: [16, 17], color: 'violet', note: 'Groth16 증명 & 검증' },
          ]}
        />
      </div>
    </section>
  );
}
