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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">snarkjs 워크플로우 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// snarkjs Complete Workflow
//
// snarkjs: JavaScript-native zkSNARK toolkit
// Author: iden3
// Supports: Groth16, PLONK, FFLONK
// Repo: github.com/iden3/snarkjs

// Full pipeline commands:
//
//   # Phase 1 — Universal Trusted Setup (Powers of Tau)
//   snarkjs powersoftau new bn128 12 pot12_0000.ptau
//     → creates empty accumulator for bn128 curve
//     → 2^12 = 4096 max constraints support
//
//   snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau \\
//     --name="First contribution" -v
//     → contributes randomness (toxic waste!)
//
//   # ... many contributors ...
//
//   snarkjs powersoftau prepare phase2 pot12_final.ptau pot12_prep.ptau
//     → prepares for circuit-specific phase
//
//   # Phase 2 — Circuit-Specific Setup (per circuit)
//   snarkjs groth16 setup circuit.r1cs pot12_prep.ptau circuit_0000.zkey
//   snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey \\
//     --name="contrib 1" -v
//   snarkjs zkey export verificationkey circuit_final.zkey vkey.json
//
//   # Witness Generation
//   node generate_witness.js circuit.wasm input.json witness.wtns
//
//   # Proof Generation
//   snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
//
//   # Verification
//   snarkjs groth16 verify vkey.json public.json proof.json

// Powers of Tau ceremony details:
//
//   Multi-party computation (MPC) setup
//   Each participant contributes randomness
//   As long as ONE participant is honest → secure
//
//   Attack model:
//     If ALL participants collude → can forge proofs
//     With N participants → need all N to collude
//
//   Famous ceremonies:
//     Perpetual Powers of Tau (50+ participants)
//     Zcash Powers of Tau Phase 1 (87 participants)
//     Hermez Network Phase 2 (36 participants)
//
//   Trusted by:
//     Semaphore, Tornado Cash, MACI, all major Circom dApps

// zkey structure:
//
//   .zkey file contains:
//     - Field prime
//     - Circuit R1CS
//     - Proving key (toxic waste needed!)
//     - Alpha, Beta, Gamma, Delta in G1/G2
//     - A, B, C polynomials in Lagrange basis
//     - H polynomial coefficients
//
//   Size: ~100MB for ~1M constraints
//   Proving key NOT compressible (random elements)

// Verification key (vkey):
//   - Alpha, Beta, Gamma, Delta (4 group elements)
//   - IC[] (one per public input + 1 for one)
//   - ~1KB total
//   - Can be embedded in Solidity verifier

// Solidity verifier export:
//
//   snarkjs zkey export solidityverifier final.zkey verifier.sol
//
//   Generates contract with hardcoded vkey
//   verifyProof() function:
//     - Uses EIP-196/197 precompiles
//     - bn128 pairing check
//     - Gas: ~200K per verification
//
//   contract Verifier {
//     function verifyProof(
//       uint[2] a,
//       uint[2][2] b,
//       uint[2] c,
//       uint[] input
//     ) public view returns (bool);
//   }

// Performance characteristics:
//
//   snarkjs (JavaScript, WASM):
//     Prove 1M constraints: ~60 seconds
//     Browser-compatible
//     Good for development
//
//   rapidSnark (C++ native):
//     Prove 1M constraints: ~5-10 seconds
//     Used in production (Polygon ID, Tornado Cash)
//     x86_64 only
//
//   GPU provers:
//     Prove 1M constraints: <1 second
//     Used by rollups (Polygon zkEVM)
//     CUDA-based

// Input JSON format:
//
//   {
//     "in": [1, 2, 3, 4],
//     "leaf": "12345...",
//     "path": [...],
//     "secret": "67890..."
//   }
//
//   All values as strings (BigNumber support)
//   Must match signal names in circuit

// PLONK vs Groth16 in snarkjs:
//
//   Groth16:
//     Proof: 3 group elements (~192 bytes)
//     Verify: 3 pairings
//     CIRCUIT-SPECIFIC setup (new ceremony per circuit)
//     Fast prover (~1x)
//
//   PLONK:
//     Proof: 9 group elements + 6 scalars (~768 bytes)
//     Verify: 2 pairings + commits
//     UNIVERSAL setup (reuse for any circuit <= size)
//     Slower prover (~1.5-2x)
//
//   Use Groth16 for: fixed circuits, minimal proof
//   Use PLONK for: frequent circuit updates, flexibility

// Debugging workflow:
//
//   snarkjs r1cs info circuit.r1cs
//     → shows constraint count, signal count
//
//   snarkjs r1cs print circuit.r1cs circuit.sym
//     → human-readable constraints with signal names
//
//   snarkjs r1cs export json circuit.r1cs circuit.json
//     → JSON format for analysis
//
//   snarkjs wtns check circuit.r1cs witness.wtns
//     → validates witness satisfies all constraints`}
        </pre>
      </div>
    </section>
  );
}
