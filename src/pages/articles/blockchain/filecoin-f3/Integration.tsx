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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EC + F3 Integration Architecture:

// Independent layers:
// EC (existing):
// - block production per epoch
// - 30s per tipset
// - probabilistic finality
// - runs in main lotus-daemon

// F3 (new):
// - finality consensus
// - runs as separate subsystem
// - asynchronous to EC
// - communicates via API

// Data flow:
// 1. EC produces tipset T_epoch
// 2. ChainStore stores tipset
// 3. F3 monitors new tipsets
// 4. F3 triggers instance (periodic)
// 5. F3 finalizes some tipset
// 6. Chain selection updates
// 7. API exposes F3 finalized info

// Key integration points:
// - ChainStore: shared state
// - P2P layer: gossip infrastructure
// - API: cross-layer queries
// - Miner: F3-aware block building

// F3 Instance trigger:
// - time-based: every N minutes
// - event-based: new tipset + threshold
// - adaptive: based on load

// Tipset selection for F3:
// - most recent tipset (high quality)
// - sufficient EC depth (e.g., 60 epochs)
// - 모든 validators visible
// - no orphans

// Concurrent instances:
// - parallel F3 instances 가능
// - independent finalization
// - ordered by chain position
// - bounded lookahead`}
        </pre>
        <p className="leading-7">
          Integration: <strong>EC + F3 독립 layers, shared state</strong>.<br />
          EC = block production, F3 = finality.<br />
          parallel F3 instances, time/event-based triggers.
        </p>

        {/* ── F3 API ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3 API &amp; Integration Points</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// F3 API (Lotus integration):

// Key API methods:
// 1. F3GetLatestCert()
//    - returns latest F3 finalized tipset
//    - with commit certificate
//    - bridge/client primary call
//
// 2. F3GetCertificate(instance)
//    - specific instance cert
//    - historical lookup
//
// 3. F3IsRunning()
//    - F3 subsystem status
//    - health monitoring
//
// 4. F3Participate()
//    - miner participation
//    - storage power vote
//
// 5. F3GetOrRenewParticipationTicket()
//    - ephemeral participation
//    - dynamic validator set

// Use cases:

// 1. Bridge contracts:
//    - poll F3GetLatestCert
//    - verify certificate
//    - update L1 state (Ethereum)
//
// 2. Explorer / Wallet:
//    - show finality status per tipset
//    - F3 finalized: ✓ (2-5 min)
//    - EC finalized: ✓ (7.5 hr)
//
// 3. DeFi contracts:
//    - wait for F3 before large operations
//    - atomic swaps need F3
//    - composability
//
// 4. State sync:
//    - new nodes sync to F3 finalized
//    - skip unfinalized
//    - faster bootstrap

// Configuration:
// f3_config.toml:
// - enabled: true/false
// - initial_instance: start epoch
// - commit_bootstrap: initial validators
// - gossipsub: gossip parameters
// - bootstrap_peers: list

// Monitoring:
// - f3_instance_duration
// - f3_quorum_pct
// - f3_message_throughput
// - grafana dashboards

// 시행 단계:
// - Phase 1 (2024 Q1): devnet
// - Phase 2 (2024 Q2): calibnet (testnet)
// - Phase 3 (2024 H2): mainnet shadow
// - Phase 4 (2025): enforced`}
        </pre>
        <p className="leading-7">
          F3 API: <strong>GetLatestCert, GetCertificate, Participate</strong>.<br />
          Bridge/DeFi/Explorer가 API 활용.<br />
          4단계 rollout: devnet → testnet → shadow → enforced.
        </p>

        {/* ── Shadow Mode & Rollout ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Shadow Mode &amp; Rollout Strategy</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Shadow Mode (F3 rollout):

// Definition:
// - F3 runs in production
// - 결과 노출 but not enforced
// - EC still decides finality
// - 목적: real-world testing

// Benefits:
// - monitor real usage
// - debug Byzantine scenarios
// - tune parameters
// - gather performance data

// Observations tracked:
// - instance success rate
// - finalization time distribution
// - power participation rate
// - Byzantine events
// - network failures

// Transition to enforced:
// 1. Shadow: monitor F3
// 2. Validation: verify safety
// 3. Chain rule: F3 overrides EC
// 4. Enforcement: bridges trust F3

// Enforced mode:
// - F3 finalized tipset → canonical
// - EC reorg below F3 finality: impossible
// - dispute resolution: F3 cert
// - slashing for F3 violators

// Failure modes handled:
// - F3 halt (2/3+ offline)
//   → fallback to EC
// - F3 safety violation
//   → social consensus
// - F3 liveness issues
//   → timeout + retry

// Comparison with Ethereum:
// Ethereum Casper FFG:
// - similar layering approach
// - Casper above LMD-GHOST
// - justify/finalize epochs
//
// Filecoin F3:
// - GossiPBFT above EC
// - QUALITY/CONVERGE/PREPARE/COMMIT/DECIDE
// - 5-phase vs Casper 2-phase

// Long-term vision:
// - single-slot F3 finality (로드맵)
// - sub-second finality
// - IPC subnet integration
// - cross-chain bridges가 표준

// Target metrics:
// - 2-5 min finality
// - 99%+ instance success
// - <5% power offline tolerance
// - sub-second bridge validation`}
        </pre>
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
