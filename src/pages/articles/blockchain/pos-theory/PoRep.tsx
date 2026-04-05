import PoRepFlowViz from './viz/PoRepFlowViz';

export default function PoRep() {
  return (
    <section id="porep" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Replication (PoRep)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          원본 데이터의 고유하고 독립적인 물리적 복제본을 생성했음을 증명.<br />
          Sybil 공격(하나의 복제본으로 여러 저장을 주장)을 방지
        </p>
      </div>
      <div className="not-prose"><PoRepFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof of Replication (PoRep):

// Definition (Filecoin whitepaper 2017):
// "Prove that N physical replicas of data
//  are distinctly stored"

// Problem solved:
// Sybil attack:
// - storage provider claims N replicas
// - but stores only 1
// - receives N × reward
// - cheats the system

// PoRep prevents:
// - each replica physically unique
// - N replicas = N storage spaces
// - can't deduplicate

// Filecoin PoRep:
// - 4-phase sealing
// - Stacked DRG encoding
// - SNARK proof
// - 3-6 hours per sector

// Sealing process:
// 1. Original data D
// 2. replica_id = hash(prover || sector || ticket || D)
// 3. SDR encoding (11 layers, sequential)
// 4. Merkle commitments
// 5. SNARK proof

// Key properties:
// - unique per (prover, sector):
//   same D → different sealed output
// - time-bound creation:
//   takes hours to generate
// - space-time bound:
//   must store intermediate data
// - costly to fake:
//   economical infeasibility

// Challenge-response:
// - during sealing: prover commits
// - verifier checks commitment
// - on-chain proof submission
// - cryptographic binding

// Relationships:
// PoRep → PoSt (extension)
// - PoRep: one-time replication proof
// - PoSt: continuous time-based proof
// - PoSt uses PoRep's sealed sectors

// Attack mitigation:
// 1. Generation attack:
//    regenerate data on-demand
//    → SDR sequential makes slow
//
// 2. Sybil attack:
//    pretend multiple replicas
//    → unique sealing prevents
//
// 3. Outsourcing attack:
//    rent storage elsewhere
//    → costly, time-bound

// Proof size:
// - pre-SNARK: MBs
// - post-SNARK: 192 bytes
// - constant size (Groth16)
// - efficient on-chain verification`}
        </pre>
        <p className="leading-7">
          PoRep: <strong>unique physical replication 증명 (Sybil 방어)</strong>.<br />
          Filecoin = SDR + SNARK, 3-6h per sector.<br />
          replica_id 고유화 + sequential encoding 강제.
        </p>
      </div>
    </section>
  );
}
