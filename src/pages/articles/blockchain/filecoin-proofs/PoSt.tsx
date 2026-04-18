import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function PoSt({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'PoSt — 시공간 저장 증명'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PoSt</strong>(Proof of Spacetime) — 봉인된 섹터의 지속 저장 증명
          <br />
          <strong>WindowPoSt</strong>(24시간 주기, 모든 섹터) vs
          <strong> WinningPoSt</strong>(블록 생성 시, 당첨 섹터)
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('window-post', codeRefs['window-post'])} />
            <span className="text-[10px] text-muted-foreground self-center">window_post.rs</span>
            <CodeViewButton onClick={() => onCodeRef('fallback-vanilla', codeRefs['fallback-vanilla'])} />
            <span className="text-[10px] text-muted-foreground self-center">vanilla.rs</span>
          </div>
        )}
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Poseidon 선택 이유</strong> — BLS12-381 스칼라체 위 연산
          <br />
          Groth16 회로 내 SHA256 대비 10배 이상 게이트 절약
        </p>

        {/* ── PoSt 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoSt 메커니즘 상세</h3>

        {/* ── WindowPoSt vs WinningPoSt ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">WindowPoSt (24h 주기)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>모든 active sectors 대상</li>
              <li>partition 분할 (~2349 sectors/partition)</li>
              <li><strong>10 random challenges</strong> per sector</li>
              <li>deadline-based: <code>24h / 48 = 30min</code> windows</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">WinningPoSt (leader election)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>trigger: VRF election winner</li>
              <li>1 random sector sampled</li>
              <li>tight deadline (~40s)</li>
              <li>블록 생성에 사용, faster proof gen</li>
            </ul>
          </div>
        </div>

        {/* ── WindowPoSt 프로세스 ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">WindowPoSt 프로세스</p>
          <ol className="text-sm space-y-1 text-foreground/80 list-decimal list-inside">
            <li><strong>Challenge 생성</strong> — deadline 시작 시, random drand-based, per partition</li>
            <li><strong>Leaf 선택</strong> — each sector에 10 leaf</li>
            <li><strong>Merkle proof</strong> — open leaves + sibling hashes + root verification</li>
            <li><strong>SNARK proof</strong> — Groth16, GPU accelerated</li>
            <li><strong>On-chain submission</strong> — <code>SubmitWindowedPoSt</code> message, within deadline</li>
          </ol>
        </div>

        {/* ── Poseidon + Merkle Trees ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">Poseidon Hash</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SNARK-friendly hash (MDS + S-box design)</li>
              <li>BLS12-381 field operations</li>
              <li>회로 내 SHA256 대비 <strong>3-5x faster</strong></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Merkle Tree Types</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>base tree</code> — on data</li>
              <li><code>tree C</code> — on column commitments</li>
              <li><code>tree T_aux</code> — on tree C</li>
              <li>nested depth ~20-30</li>
            </ul>
          </div>
        </div>

        {/* ── Proof Components + On-chain ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Proof Components</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Merkle path for each challenge</li>
              <li>column commitments</li>
              <li><code>replica_id</code></li>
              <li>SNARK wrapping (Groth16)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">On-chain Verification</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SNARK verifier in VM (pairing operations)</li>
              <li>Groth16 verify, batch verification</li>
              <li>verification: ~5ms per partition</li>
            </ul>
          </div>
        </div>

        {/* ── Fault + Slashing ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-bold text-red-400 mb-2">Fault Handling</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>missed WindowPoSt → fault fee per epoch</li>
              <li>7-day recovery window</li>
              <li>미복구 시 termination penalty</li>
              <li>skipped sectors — penalty paid, recovery 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-bold text-red-400 mb-2">Slashing Conditions</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>missed PoSt</strong> → fault fee</li>
              <li><strong>wrong proof</strong> → termination</li>
              <li><strong>double-signing</strong> → termination + slash</li>
            </ul>
          </div>
        </div>

        {/* ── Performance ── */}
        <div className="not-prose rounded-lg border border-border bg-muted/50 p-4 my-4">
          <p className="text-sm font-bold text-foreground mb-2">Performance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-foreground/80">
            <div><strong>~30 min</strong><br />WindowPoSt per partition</div>
            <div><strong>parallel</strong><br />multi-GPU partitions</div>
            <div><strong>~5 ms</strong><br />verification per partition</div>
            <div><strong>moderate</strong><br />on-chain gas cost</div>
          </div>
        </div>

        <p className="leading-7">
          WindowPoSt (24h) + WinningPoSt (election).<br />
          <strong>10 challenges per sector</strong>, Merkle + SNARK.<br />
          Poseidon hash (SNARK-friendly, 3-5x faster than SHA256).
        </p>
      </div>
    </section>
  );
}
