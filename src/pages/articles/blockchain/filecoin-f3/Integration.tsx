import IntegrationDetailViz from './viz/IntegrationDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Integration({ onCodeRef }: Props) {
  return (
    <section id="integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EC + F3 통합</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC와 F3는 완전히 분리된 레이어<br />
        F3는 별도 goroutine으로 실행 — 비활성화해도 EC의 확률적 확정성 유지
      </p>
      <div className="not-prose mb-8">
        <IntegrationDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── EC + F3 Integration Flow ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Integration Flow 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EC (기존)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Block production per epoch (30s)</li>
              <li>Probabilistic finality</li>
              <li>main <code className="text-xs">lotus-daemon</code>에서 실행</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">F3 (추가)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Finality consensus (별도 subsystem)</li>
              <li>EC와 비동기 실행</li>
              <li>API로 통신</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">Data Flow</h4>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
            <li>EC가 tipset 생성 → ChainStore 저장</li>
            <li>F3가 new tipsets 모니터링</li>
            <li>F3 instance trigger (time/event/adaptive)</li>
            <li>F3 finalize → chain selection 업데이트</li>
            <li>API가 F3 finalized info 노출</li>
          </ol>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Integration Points</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>ChainStore</strong> — shared state</li>
              <li><strong>P2P layer</strong> — gossip infra</li>
              <li><strong>API</strong> — cross-layer queries</li>
              <li><strong>Miner</strong> — F3-aware block building</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Tipset Selection</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Most recent tipset (high quality)</li>
              <li>Sufficient EC depth (e.g., 60 epochs)</li>
              <li>모든 validators visible, no orphans</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Concurrent Instances</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Parallel F3 instances 가능</li>
              <li>Independent finalization</li>
              <li>Chain position 순서 유지</li>
              <li>Bounded lookahead</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Integration: <strong>EC + F3 독립 layers, shared state</strong>.<br />
          EC = block production, F3 = finality.<br />
          parallel F3 instances, time/event-based triggers.
        </p>

        {/* ── F3 API ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3 API &amp; Integration Points</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">F3 API Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-muted p-2">
              <code className="text-xs font-medium">F3GetLatestCert()</code>
              <p className="text-xs text-muted-foreground">latest F3 finalized tipset + commit certificate (bridge/client primary call)</p>
            </div>
            <div className="rounded bg-muted p-2">
              <code className="text-xs font-medium">F3GetCertificate(instance)</code>
              <p className="text-xs text-muted-foreground">specific instance cert, historical lookup</p>
            </div>
            <div className="rounded bg-muted p-2">
              <code className="text-xs font-medium">F3IsRunning()</code>
              <p className="text-xs text-muted-foreground">subsystem status, health monitoring</p>
            </div>
            <div className="rounded bg-muted p-2">
              <code className="text-xs font-medium">F3Participate()</code>
              <p className="text-xs text-muted-foreground">miner participation, storage power vote</p>
            </div>
            <div className="rounded bg-muted p-2 md:col-span-2">
              <code className="text-xs font-medium">F3GetOrRenewParticipationTicket()</code>
              <p className="text-xs text-muted-foreground">ephemeral participation, dynamic validator set</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Use Cases</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Bridge</strong> — poll <code className="text-xs">F3GetLatestCert</code> → verify → update L1</li>
              <li><strong>Explorer/Wallet</strong> — finality status (F3: 2-5min, EC: 7.5h)</li>
              <li><strong>DeFi</strong> — F3 대기 후 large operations, atomic swaps</li>
              <li><strong>State sync</strong> — F3 finalized 기점으로 bootstrap</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Configuration & Monitoring</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-xs">f3_config.toml</p>
              <p className="text-xs"><code className="text-xs">enabled</code>, <code className="text-xs">initial_instance</code>, <code className="text-xs">commit_bootstrap</code>, <code className="text-xs">gossipsub</code>, <code className="text-xs">bootstrap_peers</code></p>
              <p className="font-medium text-xs mt-2">Metrics (Grafana)</p>
              <p className="text-xs"><code className="text-xs">f3_instance_duration</code>, <code className="text-xs">f3_quorum_pct</code>, <code className="text-xs">f3_message_throughput</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          F3 API: <strong>GetLatestCert, GetCertificate, Participate</strong>.<br />
          Bridge/DeFi/Explorer가 API 활용.<br />
          4단계 rollout: devnet → testnet → shadow → enforced.
        </p>

        {/* ── Shadow Mode & Rollout ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Shadow Mode &amp; Rollout Strategy</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">Shadow Mode → Enforced 전환</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
            <div className="rounded bg-muted p-3 text-center">
              <p className="font-medium">1. Shadow</p>
              <p className="text-xs text-muted-foreground">F3 실행, EC enforced, 모니터링</p>
            </div>
            <div className="rounded bg-muted p-3 text-center">
              <p className="font-medium">2. Validation</p>
              <p className="text-xs text-muted-foreground">safety 검증, 파라미터 튜닝</p>
            </div>
            <div className="rounded bg-muted p-3 text-center">
              <p className="font-medium">3. Chain Rule</p>
              <p className="text-xs text-muted-foreground">F3 overrides EC</p>
            </div>
            <div className="rounded bg-muted p-3 text-center">
              <p className="font-medium">4. Enforcement</p>
              <p className="text-xs text-muted-foreground">bridges trust F3</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Enforced Mode</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>F3 finalized tipset → canonical</li>
              <li>EC reorg below F3 finality: impossible</li>
              <li>Dispute resolution: F3 cert</li>
              <li>F3 violators → slashing</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Failure Modes</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>F3 halt</strong> (2/3+ offline) → fallback to EC</li>
              <li><strong>Safety violation</strong> → social consensus</li>
              <li><strong>Liveness issues</strong> → timeout + retry</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Ethereum Casper FFG vs F3</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between"><span>Casper FFG</span><span>Casper above LMD-GHOST, 2-phase</span></div>
              <div className="flex justify-between"><span>Filecoin F3</span><span>GossiPBFT above EC, 5-phase</span></div>
              <p className="text-xs mt-1">유사한 layering 접근 (finality above fork choice)</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Target Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div><span className="text-xs">Finality</span><br /><strong>2-5 min</strong></div>
              <div><span className="text-xs">Instance success</span><br /><strong>99%+</strong></div>
              <div><span className="text-xs">Offline tolerance</span><br /><strong>&lt;5% power</strong></div>
              <div><span className="text-xs">Bridge validation</span><br /><strong>sub-second</strong></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Shadow mode: <strong>F3 run but EC enforced</strong> — production testing.<br />
          Ethereum Casper FFG 접근과 유사.<br />
          enforced 후 bridge/DeFi 생태계 가속.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "shadow mode" 기간을 거치나</strong> — risk management.<br />
          F3 bug 가능 → 직접 enforce하면 mainnet 위험.<br />
          shadow: 모니터링 + 학습 + 파라미터 튜닝.<br />
          Ethereum 2.0 Merge도 유사 접근 (Shadow fork, testnet merge 먼저).
        </p>
      </div>
    </section>
  );
}
