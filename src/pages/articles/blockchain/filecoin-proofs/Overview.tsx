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

        {/* ── PoRep vs PoSt 비교 카드 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">PoRep (Proof of Replication)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>목적</strong> — 이 sector는 unique 물리 저장</li>
              <li><strong>시점</strong> — sector 초기화 시 (sealing), 1회</li>
              <li><strong>과정</strong> — <code>PC1 → PC2 → C1 → C2</code> (4-phase)</li>
              <li><strong>출력</strong> — SNARK proof (~200 bytes)</li>
              <li><strong>소요</strong> — 3-6h (CPU PC1 3-5h, GPU C2 30-90min)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">PoSt (Proof of SpaceTime)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>목적</strong> — 시간 경과 후 여전히 저장 중</li>
              <li><strong>시점</strong> — 지속적 (주기적)</li>
              <li><strong>과정</strong> — <code>challenge → Merkle proof → SNARK</code></li>
              <li><strong>출력</strong> — SNARK proof (~200 bytes)</li>
            </ul>
          </div>
        </div>

        {/* ── PoSt 2가지 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">WindowPoSt</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>24h 주기, 모든 sectors (partitioned)</li>
              <li>10 challenges per sector</li>
              <li>miss → <strong>slashing</strong></li>
            </ul>
          </div>
          <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
            <p className="text-sm font-bold text-violet-400 mb-2">WinningPoSt</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>election 시점, 1 sampled sector</li>
              <li>fast (~30-40s)</li>
              <li>블록 생성 critical path</li>
            </ul>
          </div>
        </div>

        {/* ── Sector Lifecycle ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">Sector Lifecycle</p>
          <ol className="text-sm space-y-1 text-foreground/80 list-decimal list-inside">
            <li><code>Empty</code> → accumulate pieces</li>
            <li><code>PreCommit</code> — PoRep PC1 + PC2</li>
            <li><code>Wait seed</code> — 150 epochs</li>
            <li><code>Commit</code> — PoRep C1 + C2</li>
            <li><code>Active</code> → WindowPoSt required</li>
            <li><code>Deadline</code> — 24h windows</li>
            <li><code>Termination</code> → finalize</li>
          </ol>
        </div>

        {/* ── Crypto Stack + Economics ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Cryptographic Stack</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>SDR</strong> — Stacked DRG for PoRep</li>
              <li><strong>Merkle</strong> — trees for PoSt</li>
              <li><strong>Groth16</strong> — SNARK proof system</li>
              <li><strong>Poseidon</strong> — SNARK-friendly hash</li>
              <li><strong>BLS12-381</strong> — elliptic curve</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Economics</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>Initial pledge</strong> — 4 FIL per 32 GiB</li>
              <li><strong>Block reward</strong> — from inflation</li>
              <li><strong>Deal reward</strong> — from client payments</li>
              <li><strong>FIL+ verified</strong> — 10x multiplier</li>
              <li><strong>Storage power</strong> — WindowPoSt 성공 시 유지, fault 시 감소</li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          PoRep = <strong>1회 sealing 증명</strong>, PoSt = <strong>지속 저장 증명</strong>.<br />
          PoRep: 3-6h, PoSt: 24h 주기 + election.<br />
          Groth16 SNARK로 compressed, GPU 가속.
        </p>
      </div>
    </section>
  );
}
