import GossipBFTDetailViz from './viz/GossipBFTDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function GossipBFT({ onCodeRef }: Props) {
  return (
    <section id="gossipbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossiPBFT 프로토콜</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        5단계(QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE) 순차 실행<br />
        각 단계에서 2/3+ 스토리지 파워 쿼럼을 확인
      </p>
      <div className="not-prose mb-8">
        <GossipBFTDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── 5-Phase Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5-Phase Protocol 상세</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">5 Phases (~30s each, total ~150s)</h4>
          <div className="space-y-2 text-sm">
            {[
              { phase: '1', name: 'QUALITY', purpose: 'candidate tipset 식별', action: 'QualityVote(tipset, power)', detail: 'all validators 참여, quality score 기반' },
              { phase: '2', name: 'CONVERGE', purpose: 'best candidate 수렴', action: 'ConvergeVote(best_tipset)', detail: '2/3+ power agreement → single leading tipset' },
              { phase: '3', name: 'PREPARE', purpose: 'commitment 준비', action: 'PrepareVote(tipset)', detail: '2/3+ power PREPARE → prepared certificate' },
              { phase: '4', name: 'COMMIT', purpose: 'final commitment', action: 'CommitVote(tipset)', detail: '2/3+ power COMMIT → commit certificate' },
              { phase: '5', name: 'DECIDE', purpose: 'finalization 공표', action: 'Decision(tipset, cert)', detail: 'all honest validators agree → finalized' },
            ].map(p => (
              <div key={p.phase} className="flex items-start gap-3 rounded bg-muted p-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{p.phase}</span>
                <div className="min-w-0">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground ml-2">— {p.purpose}</span>
                  <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">{p.action}</code> / {p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">왜 5 phases? (PBFT는 3)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div><strong>PBFT</strong> — 3 phases (pre-prepare, prepare, commit)</div>
            <div><strong>HotStuff</strong> — 3-4 phases (chained)</div>
            <div><strong>F3</strong> — 5 phases (QUALITY/CONVERGE 추가: tipset 선택 필요)</div>
          </div>
        </div>
        <p className="leading-7">
          5 phases: <strong>QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE</strong>.<br />
          각 phase ~30s, total ~2.5분.<br />
          PBFT 3-phase + quality/converge 추가.
        </p>

        {/* ── Gossip Communication ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip Communication 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Gossip Topology</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>모든 validator equal, <strong>leader 없음</strong></li>
              <li>libp2p gossipsub (topic-based routing)</li>
              <li>mesh degree: 6-12, fanout: 6</li>
              <li>TTL 기반 deduplication (bloom filter, 300s)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Vote 구조체</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">instance</code> — <code className="text-xs">uint64</code> F3 instance ID</li>
              <li><code className="text-xs">round</code> — <code className="text-xs">uint64</code> phase round</li>
              <li><code className="text-xs">phase</code> — <code className="text-xs">Phase</code> (QUALITY/CONVERGE/PREPARE/COMMIT)</li>
              <li><code className="text-xs">sender</code> / <code className="text-xs">power</code> / <code className="text-xs">value</code> / <code className="text-xs">signature</code> (BLS)</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">BLS Aggregation</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 validator BLS sign</li>
              <li>aggregate: O(n) → O(1) signature</li>
              <li>pairing operation으로 single verify</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Propagation</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>log_fanout(n) gossip rounds</li>
              <li>n=1000, fanout=8: ~4 rounds</li>
              <li>각 round ~100-200ms, total ~1-2s</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Instance Lifecycle</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>trigger: new EC tipset + time</li>
              <li>5 phases 순차 실행 → DECIDE</li>
              <li>매 ~2-5분 new instance</li>
              <li>parallel instances 가능</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Gossip: <strong>libp2p gossipsub + BLS aggregation</strong>.<br />
          leader 없음, mesh network, fanout 6-12.<br />
          instance당 5 phases × 30s = ~2.5min.
        </p>

        {/* ── Safety & Liveness 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety &amp; Liveness 증명</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Safety 증명</h4>
            <p className="text-xs text-muted-foreground mb-2">Claim: F3 finalized tipset은 revert 불가</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>가정: f &lt; 1/3 Byzantine, BLS unforgeable, partial sync</li>
              <li>COMMIT 2/3+ power → <code className="text-xs">CommitCertificate</code></li>
              <li>f+1 power는 honest → 같은 값만 commit</li>
              <li>two conflicting finalizations impossible</li>
            </ul>
            <div className="rounded bg-muted p-2 mt-2 text-xs text-muted-foreground">
              <strong>Quorum intersection:</strong> C1, C2 둘 다 2/3+ → intersection 1/3+ → honest가 같은 값 commit → C1.value == C2.value
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Liveness 증명</h4>
            <p className="text-xs text-muted-foreground mb-2">Claim: GST 이후 eventually new tipset finalized</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>QUALITY: honest vote for latest tipset</li>
              <li>CONVERGE: 2/3+ agree on best</li>
              <li>PREPARE: 2/3+ prepare</li>
              <li>COMMIT: 2/3+ commit</li>
              <li>DECIDE: all honest learn → progress</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">각 phase 30s (configurable), catch-up 가능</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">Formal Verification & Audits</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
            <span>TLA+ specification (2023-2024)</span>
            <span>Invariant checking + refinement proofs</span>
            <span>Runtime Verification audit</span>
            <span>Trail of Bits review</span>
          </div>
        </div>
        <p className="leading-7">
          Safety: <strong>quorum intersection (f+1 honest)</strong>.<br />
          Liveness: GST + gossip eventual delivery.<br />
          TLA+ verification + 3rd party audits.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "5 phases"인가 (PBFT는 3)</strong> — tipset selection 복잡성.<br />
          BFT는 단일 proposal 합의, F3는 tipset (여러 blocks) 합의.<br />
          QUALITY = 후보 찾기, CONVERGE = 단일 tipset 결정.<br />
          그 후 PBFT 표준 PREPARE/COMMIT으로 finalize.
        </p>
      </div>
    </section>
  );
}
