import SealingPipelineViz from './viz/SealingPipelineViz';
import ProofArchViz from './viz/ProofArchViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 증명 유형'}</h2>
      <div className="not-prose mb-8">
        <SealingPipelineViz onOpenCode={onCodeRef
          ? (key) => onCodeRef(key, codeRefs[key]) : undefined} />
      </div>
      <div className="not-prose mb-8"><ProofArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin 저장 증명 — <strong>PoRep</strong>(복제 증명)과
          <strong> PoSt</strong>(시공간 증명)
          <br />
          PoRep: 섹터를 물리적으로 저장했음을 증명
          <br />
          PoSt: 시간 경과 후에도 계속 저장 중임을 증명
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('seal-pc1', codeRefs['seal-pc1'])} />
            <span className="text-[10px] text-muted-foreground self-center">seal.rs — PC1</span>
            <CodeViewButton onClick={() => onCodeRef('stacked-graph', codeRefs['stacked-graph'])} />
            <span className="text-[10px] text-muted-foreground self-center">graph.rs</span>
          </div>
        )}

        {/* ── PoRep vs PoSt ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep vs PoSt 구분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin 저장 증명 2가지:

// PoRep (Proof of Replication):
// 목적: "이 sector는 unique 물리 저장"
// 실행 시점: sector 초기화 시 (sealing)
// 횟수: 1회 per sector
// 과정: PC1 → PC2 → C1 → C2 (4-phase)
// 출력: SNARK proof (~200 bytes)
// Duration: 3-6 hours
// GPU: ~30-90 min (C2)
// CPU: ~3-5 hours (PC1)

// PoSt (Proof of SpaceTime):
// 목적: "시간 경과 후 여전히 저장 중"
// 실행 시점: 지속적 (주기적)
// 횟수: 매 24h (WindowPoSt) + election (WinningPoSt)
// 과정: challenge → Merkle proof → SNARK
// 출력: SNARK proof (~200 bytes)

// PoSt 2가지:
// - WindowPoSt:
//   - 24h 주기
//   - all sectors (partitioned)
//   - 10 challenges per sector
//   - miss → slashing
//
// - WinningPoSt:
//   - election 시점
//   - 1 sampled sector
//   - fast (~30-40s)
//   - critical path

// Sector lifecycle with proofs:
// 1. Empty → accumulate pieces
// 2. PreCommit (PoRep PC1+PC2)
// 3. Wait seed (150 epochs)
// 4. Commit (PoRep C1+C2)
// 5. Active → WindowPoSt required
// 6. Deadline (24h windows)
// 7. Termination → finalize

// Cryptographic stack:
// - Stacked DRG (SDR) for PoRep
// - Merkle trees for PoSt
// - SNARK (Groth16) for proofs
// - Poseidon hash (SNARK-friendly)
// - BLS12-381 curve

// Storage power:
// - sector 1 activated → storage power += sector_size
// - WindowPoSt 성공 시 유지
// - fault 감지 시 power 감소

// Economic:
// - initial pledge: 4 FIL per 32GiB
// - block reward: from inflation
// - deal reward: from client payments
// - FIL+ verified: 10x multiplier`}
        </pre>
        <p className="leading-7">
          PoRep = <strong>1회 sealing 증명</strong>, PoSt = <strong>지속 저장 증명</strong>.<br />
          PoRep: 3-6h, PoSt: 24h 주기 + election.<br />
          Groth16 SNARK로 compressed, GPU 가속.
        </p>
      </div>
    </section>
  );
}
