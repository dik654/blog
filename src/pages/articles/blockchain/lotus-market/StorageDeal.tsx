import DealDetailViz from './viz/DealDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StorageDeal({ onCodeRef }: Props) {
  return (
    <section id="storage-deal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스토리지 딜 — HandleDealProposal() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        제안 검증 → 데이터 수신 → 봉인 → 온체인 PublishStorageDeals<br />
        콜래터럴이 데이터 보관의 경제적 인센티브
      </p>
      <div className="not-prose mb-8">
        <DealDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Deal Lifecycle ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Storage Deal Lifecycle</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Storage Deal 16-state FSM:

// Phase 1: Proposal (off-chain)
// State 1: Unknown → StorageDealUnknown
// State 2: ProposalAccepted → provider accepts
// State 3: AwaitingPreCommit

// Phase 2: Data transfer
// State 4: Transferring → data arriving
// State 5: WaitingForData → transfer complete

// Phase 3: Verification
// State 6: Verifying → piece matches proposal
// State 7: Publishing → PublishStorageDeals message

// Phase 4: Sealing
// State 8: StagedForSealing
// State 9: Sealing → sector with piece
// State 10: SealingComplete

// Phase 5: Active
// State 11: Active → deal on chain
// State 12: FinalizingData

// Phase 6: End
// State 13: Expired → duration reached
// State 14: Slashed → provider failed
// State 15: Completed → collateral returned
// State 16: Error → fatal error

// Deal proposal structure:
// type DealProposal struct {
//     PieceCID: CID
//     PieceSize: PaddedPieceSize
//     VerifiedDeal: bool
//     Client: Address
//     Provider: Address
//     Label: string
//     StartEpoch: ChainEpoch
//     EndEpoch: ChainEpoch
//     StoragePricePerEpoch: BigInt
//     ProviderCollateral: BigInt
//     ClientCollateral: BigInt
// }

// PublishStorageDeals:
// - batch multiple deals
// - single on-chain message
// - gas efficient
// - atomic publishing

// Collateral:
// - provider: ProviderCollateral (slashable)
// - client: ClientCollateral (can be withdrawn on expiry)
// - BurnFundsActor: slashed funds destroyed

// Slashing conditions:
// - missed WindowPoSt
// - sector termination early
// - fault declaration
// - penalty = ~ProviderCollateral

// Economic:
// - price: ~0.1-1 FIL per TiB per year
// - collateral: ~4 FIL per 32 GiB sector
// - FIL+: 10x reward for verified deals
// - total Filecoin storage: 1900+ PiB (2024)`}
        </pre>
        <p className="leading-7">
          Deal FSM: <strong>16 states, Proposal → Sealing → Active → End</strong>.<br />
          PublishStorageDeals가 batch로 on-chain 등록.<br />
          ProviderCollateral = slashable (incentive alignment).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 collateral이 slashable인가</strong> — economic security.<br />
          collateral 없으면: provider 데이터 버리고 떠남.<br />
          slashable collateral: 경제적 commitment.<br />
          BurnFundsActor: slashed 자금 destroy → supply 감소.
        </p>
      </div>
    </section>
  );
}
