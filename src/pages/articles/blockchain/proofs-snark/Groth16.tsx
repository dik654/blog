import { codeRefs } from './codeRefs';
import Groth16Viz from './viz/Groth16Viz';
import type { CodeRef } from '@/components/code/types';

export default function Groth16({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="groth16" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 증명/검증</h2>
      <div className="not-prose mb-8">
        <Groth16Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Trusted Setup의 비용</strong> — Groth16은 회로별 CRS 필요
          <br />
          Filecoin은 2020년 대규모 Powers of Tau 세레모니 진행
          <br />
          회로 변경 시 새로운 세레모니 필요
        </p>

        {/* ── Groth16 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 Proof System</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Groth16 (Jens Groth, 2016):

// Structure:
// - Pairing-based SNARK
// - QAP (Quadratic Arithmetic Program)
// - Common Reference String (CRS)
// - Trusted setup required

// Components:
// 1. Circuit → R1CS (Rank-1 Constraint System)
// 2. R1CS → QAP (Quadratic Arithmetic Program)
// 3. QAP evaluation → witness
// 4. CRS + witness → proof

// Proof structure:
// π = (A, B, C) ∈ G1 × G2 × G1
// - A ∈ G1: 48 bytes (BLS12-381 compressed)
// - B ∈ G2: 96 bytes
// - C ∈ G1: 48 bytes
// - total: 192 bytes

// Verification:
// e(A, B) == e(α, β) · e(Σ a_i · IC_i, γ) · e(C, δ)
// - 3 pairing operations
// - ~5-10ms on modern CPU
// - constant time

// Key generation (Setup):
// - input: circuit
// - output: proving key + verifying key
// - uses random τ, α, β, γ, δ
// - toxic waste must be destroyed

// Proving:
// - input: proving key + witness
// - 3 MSMs over G1/G2
// - most expensive step
// - ~95% time here

// Verifying:
// - input: verifying key + proof + public inputs
// - 3 pairings + scalar multiplications
// - fast (~10ms)
// - constant cost

// BLS12-381 curve:
// - 381-bit prime
// - pairing-friendly
// - ~128-bit security
// - widely adopted (Ethereum 2.0, Filecoin, Zcash)

// Filecoin circuits:
// - Stacked DRG circuit
// - Merkle proof circuit
// - Poseidon circuit
// - custom R1CS

// Circuit sizes (32 GiB PoRep):
// - constraints: ~10^8
// - witness elements: ~10^8
// - proving key: ~100 GiB
// - verifying key: ~10 KB

// Trusted Setup:
// - Filecoin Phase 1: Powers of Tau (2020)
// - Filecoin Phase 2: per-circuit (2020)
// - 1000+ participants
// - multi-party computation
// - at least 1 honest → secure

// Security:
// - if trusted setup compromised:
//   - can forge proofs
//   - but doesn't reveal witnesses
// - Filecoin's setup: large ceremony
// - distributed trust`}
        </pre>
        <p className="leading-7">
          Groth16: <strong>192-byte proofs, 3 pairings verify</strong>.<br />
          pairing-based SNARK, BLS12-381 curve.<br />
          Filecoin 2020 trusted setup (Powers of Tau ceremony).
        </p>
      </div>
    </section>
  );
}
