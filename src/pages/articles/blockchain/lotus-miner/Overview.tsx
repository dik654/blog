import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마이닝 전체 흐름</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus-Miner의 두 축 — 섹터 봉인(데이터 저장+증명)과 블록 생성(VRF 추첨)<br />
        go-statemachine으로 수천 섹터를 독립 병렬 관리
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── lotus-miner architecture ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">lotus-miner Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// lotus-miner의 두 축:

// Axis 1: Storage (Sealing)
// - sector creation (32 GiB units)
// - PoRep generation (4-phase)
// - deal processing
// - PoSt proving (WindowPoSt)
// - data retention

// Axis 2: Consensus (Block Creation)
// - VRF election per epoch
// - WinningPoSt generation
// - block assembly
// - block signing
// - broadcast

// Architecture components:
// 1. Storage FSM (Finite State Machine)
//    - go-statemachine
//    - per-sector independent states
//    - parallel sealing
//    - 8-state lifecycle
//
// 2. Worker processes
//    - lotus-worker binaries
//    - specialized hardware
//    - sealing operations
//    - network accessible
//
// 3. Miner daemon
//    - consensus participation
//    - VRF election
//    - PoSt scheduling
//    - block production
//
// 4. Markets subsystem
//    - storage deals
//    - retrieval deals
//    - payment channels
//    - FIL+ verified deals

// Hardware requirements:
// - CPU: AMD EPYC 7B13 64-core (typical)
// - GPU: NVIDIA A100/A6000 (SNARK proving)
// - RAM: 512+ GB (PC1 computation)
// - NVMe: 15+ TB (cache)
// - HDD: 100+ TB (sealed sectors)

// Operational costs:
// - hardware: $30-50K initial
// - datacenter: $500-1000/month
// - FIL pledge: ~4 FIL per 32GiB sector
// - bandwidth: 100 Mbps+

// Scaling:
// - horizontal: add workers
// - vertical: better GPUs
// - sector batching: ProveCommit Aggregate
// - economy of scale`}
        </pre>
        <p className="leading-7">
          lotus-miner: <strong>sealing FSM + consensus participation</strong>.<br />
          go-statemachine으로 sectors 병렬 관리.<br />
          hardware: EPYC + A100 + 512GB + NVMe + HDD.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 go-statemachine 사용하나</strong> — concurrent sector management.<br />
          수천 sectors가 동시에 다른 단계 (PC1, PC2, Commit, ...).<br />
          FSM = 각 sector 독립 state + error recovery.<br />
          concurrency + durability 동시 달성.
        </p>
      </div>
    </section>
  );
}
