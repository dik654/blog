import { codeRefs } from './codeRefs';
import WinningPostViz from './viz/WinningPostViz';
import type { CodeRef } from '@/components/code/types';

export default function WinningPost({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WinningPoSt: 블록 보상</h2>
      <div className="not-prose mb-8">
        <WinningPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} VRF 추첨의 공정성</strong> — DRAND 분산 랜덤 오라클
          <br />
          SP 파워(저장 용량) 비례 당첨 → 저장량이 곧 채굴력
        </p>

        {/* ── WinningPoSt 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">WinningPoSt 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WinningPoSt Timing & Process:

// Trigger: VRF Election Winner
// - every epoch (~30s)
// - storage power weighted
// - independent check per miner

// Tight Deadline:
// - epoch start → block submit
// - ~40s available for WinningPoSt
// - critical path in block production

// Sampling:
// - 1 sector randomly selected
// - per challenge count: 1 sector
// - partition doesn't apply
// - quick proof

// Process:
// 1. Detect election win
// 2. Get beacon randomness
// 3. Sample sector:
//    sector = hash(beacon) % total_sectors
// 4. Read tree R from disk
// 5. Open Merkle challenges
//    - fewer than WindowPoSt
//    - typically ~20-30 opens
// 6. Generate Groth16 proof
//    - smaller circuit
//    - ~10-20 seconds on A100
// 7. Include in block header
// 8. Broadcast block

// Proof vs WindowPoSt:
// WinningPoSt:
// - 1 sector
// - fewer challenges
// - faster proof
// - smaller circuit

// WindowPoSt:
// - partition (2349 sectors)
// - 10 challenges × 2349
// - slower proof
// - larger circuit

// Critical path:
// - election check: 5s
// - sector load: 5-10s (disk I/O)
// - proof gen: 10-20s
// - block build: 2-3s
// - submit: 1s
// - total: ~25-40s

// Hardware impact:
// - faster GPU: shorter proof time
// - NVMe: faster sector load
// - more RAM: sector cache
// - competitive edge

// Failure modes:
// - timeout: miss block (no reward)
// - corrupt sector: invalid proof
// - network delay: late arrival
// - GPU failure: miss block

// No direct slashing:
// - WinningPoSt miss → no block
// - no economic penalty
// - opportunity cost (missed reward)
// - but reputation metric

// 실측 performance (A100 GPU):
// - WinningPoSt: 15-25 seconds
// - 30 seconds budget (safe)
// - 40 seconds absolute limit

// Economic:
// - block reward: ~5-8 FIL
// - miss opportunity cost: ~$15-25 per block
// - win rate based on storage power`}
        </pre>
        <p className="leading-7">
          WinningPoSt: <strong>1 sector, ~15-25s on A100, tight deadline</strong>.<br />
          critical path in block production.<br />
          miss → no block reward (opportunity cost).
        </p>
      </div>
    </section>
  );
}
