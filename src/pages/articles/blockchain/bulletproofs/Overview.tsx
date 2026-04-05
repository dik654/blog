import CodePanel from '@/components/ui/code-panel';
import PedersenCommitViz from '../components/PedersenCommitViz';
import BulletproofsArchViz from './viz/BulletproofsArchViz';
import { CRATE_CODE, GENERATORS_CODE } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 핵심 구조'}</h2>
      <div className="not-prose mb-8">
        <PedersenCommitViz />
      </div>
      <div className="not-prose mb-8">
        <BulletproofsArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bulletproofs</strong>(Bünz et al., 2017) — 투명 셋업(trusted setup 불필요) 영지식 증명 시스템<br />
          핵심 — <strong>내적 인수 증명(Inner Product Argument, IPA)</strong><br />
          범위 증명(Range Proof) 크기를 O(n) → O(log n)으로 축소
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('pedersen-gens', codeRefs['pedersen-gens'])} />
            <span className="text-[10px] text-muted-foreground self-center">generators.rs</span>
            <CodeViewButton onClick={() => onCodeRef('generators-chain', codeRefs['generators-chain'])} />
            <span className="text-[10px] text-muted-foreground self-center">GeneratorsChain</span>
          </div>
        )}

        <h3>크레이트 구조 (github.com/dalek-cryptography/bulletproofs)</h3>
        <CodePanel
          title="bulletproofs/src/ 디렉토리 구조"
          code={CRATE_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '핵심 모듈 (기저점, IPA)' },
            { lines: [4, 8], color: 'emerald', note: '범위 증명 MPC 구조' },
            { lines: [12, 13], color: 'amber', note: 'Ristretto255 곡선 사용' },
          ]}
        />

        <h3>PedersenGens & BulletproofGens (generators.rs)</h3>
        <CodePanel
          title="generators.rs 구현"
          code={GENERATORS_CODE}
          annotations={[
            { lines: [3, 7], color: 'sky', note: 'Pedersen 커밋 구조체' },
            { lines: [9, 13], color: 'emerald', note: '멀티스칼라 곱셈으로 커밋' },
            { lines: [17, 22], color: 'amber', note: 'Bulletproof 기저점 쌍' },
            { lines: [25, 32], color: 'violet', note: 'SHAKE256으로 결정론적 생성' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Bulletproofs 역사 및 특성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bulletproofs: Short Proofs for Confidential Transactions
//
// Paper: "Bulletproofs: Short Proofs for Confidential
//         Transactions and More"
// Authors: Bünz, Bootle, Boneh, Poelstra, Wuille, Maxwell (2017)
// Venue: IEEE S&P 2018
//
// Key contribution:
//   O(log n) proof size for range proofs
//   (previously O(n) for Borromean ring signatures)
//   No trusted setup
//
// Mathematical foundation:
//   Discrete logarithm assumption (secp256k1, Ristretto255)
//   Inner Product Argument (IPA)
//   Fiat-Shamir heuristic

// Comparison with other ZK systems:
//
//   Groth16:
//     Size: 192 bytes (3 elements)
//     Prover: fast (O(n))
//     Verifier: O(1) (constant pairings)
//     Setup: CIRCUIT-SPECIFIC trusted setup
//
//   PLONK:
//     Size: ~500 bytes
//     Prover: moderate
//     Verifier: O(1)
//     Setup: UNIVERSAL trusted setup
//
//   STARKs:
//     Size: 50-200 KB
//     Prover: fast
//     Verifier: O(log^2 n)
//     Setup: TRANSPARENT (none)
//     Post-quantum: yes
//
//   Bulletproofs:
//     Size: ~700 bytes (for 64-bit range)
//     Prover: O(n) scalar mults
//     Verifier: O(n) scalar mults
//     Setup: TRANSPARENT (none)
//     Post-quantum: no (DL assumption)

// Applications of Bulletproofs:
//
//   1. Confidential transactions:
//      Monero (since 2018)
//      Mimblewimble / Grin / Beam
//      Hide amounts with range proofs
//
//   2. ZK virtual machines:
//      Secret Network (Cosmos)
//      Some zkVMs
//
//   3. Sidechains:
//      Prove state transitions without revealing
//
//   4. Arbitrary circuits:
//      R1CS → Bulletproofs
//      Less common (slower verifier than Groth16)

// Pedersen Commitment:
//
//   Com(v, r) = v * G + r * H
//     G, H: random generators (fixed)
//     v: value being committed (hidden)
//     r: blinding factor (hides v)
//
//   Properties:
//     - Hiding: without r, cannot recover v
//     - Binding: cannot open to different v' (DL assumption)
//     - Homomorphic: Com(a) + Com(b) = Com(a+b)
//
//   In Bulletproofs:
//     Amount v committed as V = v*G + r*H
//     Prove v in [0, 2^64) without revealing v

// Vector Pedersen (generalized):
//
//   Com(vec_a, vec_b, r) = sum(a_i * G_i)
//                        + sum(b_i * H_i)
//                        + r * H
//
//   Used in range proof construction
//   n pairs of generators for n-bit range

// Generators generation (GeneratorsChain):
//
//   Deterministic from nothing-up-my-sleeve string
//   Uses SHAKE256 XOF (extensible output function)
//
//   def generate_generator(label, index):
//       hasher = SHAKE256()
//       hasher.update(label)
//       hasher.update(index.to_bytes())
//       while True:
//           candidate_bytes = hasher.read(32)
//           point = try_decode_point(candidate_bytes)
//           if point is valid:
//               return point
//
//   Ristretto255 curve for clean point encoding

// Fiat-Shamir transform:
//
//   Interactive protocol:
//     Prover → commit
//     Verifier → challenge (random)
//     Prover → response
//
//   Fiat-Shamir:
//     Challenge = hash(transcript so far)
//     Prover can't predict/cheat the challenge
//     → Non-interactive proof
//
//   Bulletproofs uses:
//     merlin crate (Rust)
//     Strobe protocol framework
//     Domain separation built-in`}
        </pre>
      </div>
    </section>
  );
}
