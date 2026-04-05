import DiemBFTViz from './viz/DiemBFTViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DiemBFT({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="diembft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DiemBFT v4 합의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DiemBFT v4 — HotStuff 변형, 3-chain commit rule + 리더 평판 시스템<br />
          Round k 블록은 k+2에서 커밋. 장애 리더는 평판 점수에 따라 자동 교체
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-diembft-pipeline', codeRefs['apt-diembft-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              round_manager.rs
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('apt-leader-reputation', codeRefs['apt-leader-reputation'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              leader_reputation.rs
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <DiemBFTViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DiemBFT v4 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DiemBFT v4 Consensus Protocol
//
// Lineage:
//   PBFT (1999) → HotStuff (2018) → LibraBFT v1-3 (2019-2020)
//   → DiemBFT v4 (2021) → Aptos production
//
// Key properties:
//   - BFT with f < n/3 faults
//   - Responsive (don't wait for full timeout if honest)
//   - Linear view change (O(n) not O(n^2))
//   - 3-chain commit rule

// Protocol structure:
//
//   Round = single leader's turn to propose
//   View = attempt at a round (may timeout)
//
//   Pipeline:
//     Round k:   Leader proposes block B_k
//     Round k+1: Validators vote on B_k (QC forms)
//     Round k+2: QC_k references B_k, new leader proposes B_{k+2}
//                B_k becomes COMMITTED (3-chain rule)
//
//   Every block carries QC from round k-1
//   Every 3 consecutive QC'd blocks → commit earliest

// Message flow (per round):
//
//   1. Leader L_k broadcasts:
//      Proposal(B_k, QC_{k-1})
//
//   2. Validators:
//      verify safety rules
//      send Vote(B_k) to L_{k+1}
//
//   3. L_{k+1} collects 2f+1 votes → forms QC_k
//
//   4. L_{k+1} broadcasts Proposal(B_{k+1}, QC_k)
//
//   5. Validators see QC_k → pre-commit B_{k-1}
//      See 3-chain: B_{k-2}, B_{k-1}, B_k → commit B_{k-2}

// Safety rules:
//
//   rule 1 (voting):
//     vote only on one block per round
//
//   rule 2 (locking):
//     only vote on B if B extends locked QC's block
//
//   rule 3 (locking update):
//     update lock to QC.parent if new QC observed
//
//   rule 4 (commit):
//     commit B if see 3 consecutive rounds with QCs

// Leader selection:
//
//   Diem v3: round-robin
//   DiemBFT v4: reputation-based
//
//   Reputation:
//     track validator participation in last N rounds
//     validators that fail to propose → low reputation
//     high-reputation validators elected more often
//
//   Formula:
//     weight_i = f(success_rate_i, total_blocks_i)
//     probability_i = weight_i / sum(weight_j)
//
//   Protects against:
//     - Inactive validators
//     - Slow validators (stragglers)
//     - Grinding attacks

// Timeout handling:
//
//   Local timeout: δ_round
//   If no proposal by timeout:
//     broadcast Timeout(view, locked_QC)
//   Collect 2f+1 timeouts → TC (Timeout Certificate)
//   Next leader proposes using TC

// Performance (mainnet):
//   Block time: ~500ms
//   Commit latency: ~1.5s (3 blocks)
//   Validators: ~150 active
//   Total stake: ~900M APT
//
// Resilience:
//   Honest majority: f < n/3
//   With n=150, f=49 Byzantine validators tolerable
//   Safety preserved regardless of network

// Implementation:
//   aptos-core/consensus/src/:
//     round_manager.rs      // main consensus loop
//     block_store/          // block tree + QCs
//     pending_votes.rs      // vote aggregation
//     liveness/
//       leader_reputation.rs // reputation logic
//       proposer_election.rs // leader selection`}
        </pre>
      </div>
    </section>
  );
}
