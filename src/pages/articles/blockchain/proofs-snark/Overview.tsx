import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK 개요</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Filecoin = 최대 GPU 소비 체인</strong> — 전체 블록체인 네트워크 중
          <br />
          가장 많은 GPU 컴퓨팅 소비. 수만 SP가 매일 수십만 건 SNARK 증명 생성
        </p>

        {/* ── SNARK in Filecoin ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin의 SNARK 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin SNARK 사용처:
//
// 1. PoRep (C2 phase):
//    - sealing proof
//    - per sector (once)
//    - ~30-90 min GPU
//
// 2. WindowPoSt:
//    - continuous proving
//    - per partition per 24h
//    - ~30 min per partition GPU
//
// 3. WinningPoSt:
//    - election proofs
//    - per epoch (if elected)
//    - ~20-40s GPU
//
// 4. Aggregate proofs:
//    - ProveCommitAggregate
//    - multi-sector batching
//    - gas efficient

// Scale:
// - network daily: ~100K+ proofs
// - per SP: 10-100s per day
// - aggregate GPU time: thousands of hours
// - "most GPU-intensive blockchain"

// Why SNARK?
// 1. Compact proofs:
//    - Groth16: 192 bytes
//    - on-chain verification efficient
//    - constant size
//
// 2. Zero-knowledge:
//    - don't reveal data
//    - just prove "I know it"
//    - privacy preserving
//
// 3. Non-interactive:
//    - single message
//    - verifier doesn't need interaction
//    - suitable for blockchain

// Trade-offs:
// Advantages:
// - constant proof size
// - fast verification
// - non-interactive
//
// Disadvantages:
// - expensive proof generation
// - trusted setup (Groth16)
// - specific circuit compilation

// Alternatives considered:
// - STARK: no trusted setup, but larger proofs
// - PLONK: universal setup, slower prover
// - Groth16: smallest proofs, fastest verify
// - Filecoin choice: Groth16 (2020)

// Future directions:
// - Halo2: no trusted setup
// - Nova: incremental proofs
// - MoCash: aggregation
// - SupraSeal: optimized Groth16

// 네트워크 영향:
// - GPU demand: 수요 큼
// - AI/ML과 경쟁
// - H100 품귀
// - SP profitability: GPU efficiency 중요`}
        </pre>
        <p className="leading-7">
          Filecoin SNARK: <strong>PoRep C2, WindowPoSt, WinningPoSt</strong>.<br />
          일일 100K+ proofs, AI/ML GPU와 경쟁.<br />
          Groth16 선택: 192B proofs, fast verify.
        </p>
      </div>
    </section>
  );
}
