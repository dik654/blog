import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">봉인 전체 흐름</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} PC1이 순차적이어야 하는 이유</strong> — 공간-시간 트레이드오프
          <br />
          병렬 사전 계산 가능하면 "저장했다"는 증명이 성립 안 함
          <br />
          순차 의존성이 물리적 저장 공간 사용을 강제
        </p>

        {/* ── 4-Phase Overview ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4-Phase Sealing Pipeline</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoRep 4-Phase Pipeline:

// Phase 1: PreCommit1 (PC1)
// - generate 11 SDR layers
// - SHA256 sequential hashing
// - ~3-5 hours on CPU
// - output: ~352 GiB layer data

// Phase 2: PreCommit2 (PC2)
// - Poseidon hashing (columns)
// - construct tree R (replica tree)
// - GPU accelerated
// - ~30 min
// - output: tree R + comm_r

// [PreCommit submitted on-chain]
// Wait ~150 epochs for seed

// Phase 3: Commit1 (C1)
// - challenge-response
// - VDF random challenge
// - generate Merkle proofs
// - select challenged leaves
// - <1 min

// Phase 4: Commit2 (C2)
// - Groth16 SNARK generation
// - MSM (multi-scalar multiplication)
// - GPU accelerated
// - ~30-90 min
// - output: SNARK proof (~192 bytes)

// [ProveCommit submitted on-chain]

// Hardware:
// - CPU for PC1 (64-core AMD EPYC typical)
// - GPU for PC2, C2 (NVIDIA A100/A6000)
// - NVMe SSD for cache
// - 256+ GB RAM

// Time budget (32 GiB sector):
// - PC1: 3-5h
// - PC2: 30min
// - seed wait: 1.25h
// - C1: <1min
// - C2: 30-90min
// - total: 5-8 hours

// Parallel sectors:
// - CPU: sequential (PC1 bound)
// - GPU: pipeline (PC2, C2)
// - worker specialization
// - typical: 10-20 sectors/day/machine

// Batching:
// - PreCommitBatch: batch multiple PreCommits
// - ProveCommitAggregate: SNARK aggregation
// - gas efficient (critical for profitability)
// - 10x reward via FIL+ verified deals

// Economic:
// - sector revenue: ~$10-30/year (varies)
// - hardware cost: ~$30-50K
// - payback: 2-3 years
// - pledge: 4 FIL per 32 GiB
// - GPU as primary cost factor`}
        </pre>
        <p className="leading-7">
          4 phases: <strong>PC1 (CPU 3-5h) → PC2 (GPU 30m) → wait → C1+C2 (GPU 30-90m)</strong>.<br />
          total 5-8h per sector.<br />
          PreCommitBatch + ProveCommitAggregate로 gas 최적화.
        </p>
      </div>
    </section>
  );
}
