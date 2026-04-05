import WinPostViz from './viz/WinPostViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function WinningPoSt({ onCodeRef }: Props) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WinningPoSt — MineOne() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        매 에폭(30초)마다 VRF 추첨 → 당첨 시 PoSt 증명 → 블록 생성<br />
        WinCount는 포아송 분포 — 스토리지 파워에 비례한 공정 추첨
      </p>
      <div className="not-prose mb-8">
        <WinPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── MineOne Flow ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MineOne() 함수 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MineOne() in miner/miner.go:

func (m *Miner) mineOne(ctx context.Context, base *MiningBase) (*types.BlockMsg, error) {
    // 1. Get randomness from drand beacon
    rand, err := m.api.StateGetRandomnessFromTickets(
        ctx, crypto.DomainSeparationTag_ElectionProofProduction,
        round, nil, base.TipSet.Key())

    // 2. Compute ticket
    ticket, err := m.computeTicket(ctx, &beacon.BeaconEntry{
        Round: brand.Round,
        Data: brand.Data,
    }, base, round-1, mbi)

    // 3. Check if we're a winner
    winner, err := gen.IsRoundWinner(ctx, base.TipSet,
        round, m.Address, rand, ticket, mbi, m.api)
    if winner == nil {
        return nil, nil  // not elected this epoch
    }

    // 4. Generate WinningPoSt
    // - challenge based on beacon
    // - sample sectors randomly
    // - prove spacetime commitment
    // - GPU accelerated (~20-40s)
    winningPost, err := m.epp.ComputeProof(ctx, mbi.Sectors, rand)

    // 5. Build block
    b, err := m.createBlock(ctx, base, ticket, winner,
        winningPost, msgs, ...)

    // 6. Return BlockMsg
    return b, nil
}

// Timing:
// - epoch: 30 seconds
// - election check: ~1-3s
// - ticket computation: <100ms
// - WinningPoSt: 20-40s (CRITICAL)
// - block assembly: 1-3s
// - submission: <1s
// - margin: 5-10s

// WinningPoSt details:
// - challenged sectors: 1 (WinPoSt)
// - random leaves selected
// - Merkle proofs
// - SNARK proof
// - GPU pairing operations

// Failure scenarios:
// - WinningPoSt timeout → miss block
// - invalid proof → rejected
// - network delay → late broadcast
// - corrupt sector → proof fails

// Hardware impact:
// - faster GPU: reduce WinPoSt time
// - NVMe storage: faster sector access
// - fast network: quicker propagation
// - RAM: proof computation`}
        </pre>
        <p className="leading-7">
          MineOne: <strong>ticket → election → WinningPoSt (20-40s) → block</strong>.<br />
          WinningPoSt가 critical path — 30s epoch 예산 중 대부분.<br />
          GPU 성능이 miner competitiveness 결정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 WinningPoSt 20-40s인가</strong> — SNARK proof generation.<br />
          {'Merkle proof: fast (<1s).'}<br />
          SNARK generation: Groth16 + Bellperson, GPU-accelerated.<br />
          epoch 30s 내 완료 필수 → GPU hardware critical.
        </p>
      </div>
    </section>
  );
}
