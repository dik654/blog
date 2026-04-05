import PoissonSortitionViz from './viz/PoissonSortitionViz';
import SortitionDetailViz from './viz/SortitionDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Sortition({ onCodeRef }: Props) {
  return (
    <section id="sortition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poisson Sortition</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Filecoin 블록 생성자 선출 — Poisson Sortition 기반<br />
        각 에폭(30초)마다 QualityAdjPower에 비례하여 복수 마이너 동시 당선
      </p>
      <div className="not-prose mb-8"><PoissonSortitionViz /></div>
      <div className="not-prose mb-8">
        <SortitionDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Poisson Sortition 수학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Poisson Sortition 수학적 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Poisson Sortition 알고리즘:

// Goal:
// - 에폭당 expected 5 winners
// - storage power 비례
// - independent decisions (no coordination)
// - Verifiable (VRF-based)

// VRF-based Election:
//
// 1. Draw Randomness:
//    drand_beacon(epoch) = random_bytes(32)
//
// 2. Compute Election Proof:
//    miner_key = miner.worker_private_key
//    msg = "EPOSTVRF" || drand_beacon
//    electionProof = VRF(miner_key, msg)
//
// 3. Check Winning:
//    hashed = SHA256(electionProof)
//    target = miner_power * MaxWinners / total_power
//    if hashed < target_threshold:
//        → winner!
//        wincount = floor(target / max_hash) + 1
//
// 4. WinCount:
//    - 1 win = 1 block
//    - large miner may win multiple
//    - ~5 winners per epoch total

// Poisson distribution:
// P(k winners) = (λ^k * e^-λ) / k!
// where λ = expected_winners = 5
//
// - P(0) = 0.67%
// - P(1) = 3.4%
// - P(5) = 17.5%
// - P(10) = 1.8%
// - P(15) = 0.05%

// Mathematical properties:
// - proportional to power
// - independent per miner
// - unbiased (VRF)
// - verifiable (anyone can check)

// 실제 parameters:
// - WPOSTCHALLENGEWINDOW = 2880 epochs (24h)
// - WPOSTCHALLENGECOUNT = 10
// - expected_winners = 5 per epoch
// - drand beacon: 3s period

// VRF 구현:
// - BLS-based VRF (Filecoin)
// - output: 96 bytes
// - deterministic per (key, msg)
// - unbiasable`}
        </pre>
        <p className="leading-7">
          Poisson Sortition: <strong>VRF + threshold check</strong>.<br />
          expected 5 winners/epoch, storage power 비례.<br />
          independent decision, verifiable, unbiasable.
        </p>

        {/* ── DRAND Beacon ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DRAND Beacon 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DRAND (Distributed Randomness Beacon):
//
// 목적:
// - unbiasable random source
// - bias attack 방어
// - league of entropy (외부 기관)
//
// Filecoin 사용:
// - leader election seed
// - sortition input
// - WinningPoSt challenge

// League of Entropy:
// - Cloudflare, Protocol Labs, UCL, EPFL, ...
// - 18+ operators
// - 3-second period
// - BLS threshold signatures

// DRAND protocol:
// 1. Each operator computes BLS sig
// 2. Aggregate when threshold met
// 3. Publish round signature
// 4. anyone verify against pub_key

// Why external DRAND?
//
// Without DRAND:
// - on-chain randomness biasable
// - miner choose favorable block
// - attacker manipulate
//
// With DRAND:
// - external unbiasable source
// - threshold BFT guarantees
// - Filecoin can't influence
// - strong randomness property

// Integration:
// - chain/beacon package
// - drand client in Lotus
// - round = epoch / 10 (drand updates)
// - cached per epoch

// Security:
// - BLS threshold signature (2/3 operators)
// - no single operator control
// - forward secrecy
// - verifiable

// 실제 성능:
// - DRAND round: 3 seconds
// - Lotus caches rounds
// - low latency impact
// - reliable availability

// 장단점:
// 장점:
// - truly unbiasable
// - strong crypto
// - production ready
//
// 단점:
// - external dependency
// - trust in league of entropy
// - network dependency`}
        </pre>
        <p className="leading-7">
          DRAND: <strong>external unbiasable random beacon</strong>.<br />
          League of Entropy (18+ operators), BLS threshold.<br />
          3s period, Filecoin caches per epoch.
        </p>

        {/* ── WinCount & Rewards ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">WinCount &amp; Rewards</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WinCount 메커니즘:
//
// Individual miner:
// - 1 win = 1 block
// - large miner may win multiple
// - each win = 1 wincount

// Calculation:
// target_threshold(miner) =
//   miner.power / total_power * MaxWinners
//   * MAX_SECTOR_SIZE

// wincount(miner) =
//   if hash < target_threshold:
//     1 + floor((target_threshold - hash) / step)
//   else:
//     0

// Typical values:
// - small miner (1%): wincount = 0 usually
// - medium miner (5%): wincount = 1 often
// - large miner (20%): wincount = 1-2 frequently

// Block reward distribution:
// - each block: reward from inflation
// - ~8 FIL per block (varies by epoch)
// - wincount × reward for miner
// - storage provider economics

// Reward flow:
// 1. Block rewards pool
// 2. distributed to winners per epoch
// 3. vesting: 180 days linear
// 4. slashing: faulty sectors penalty

// 경제:
// - total supply: 2B FIL
// - inflation: decreasing
// - year 1: ~330M FIL
// - year 2024: ~5-8 FIL per block
// - storage pledge: ~4 FIL per 32GiB sector

// Pledge economics:
// - initial pledge per sector
// - locked during sector life
// - released on termination
// - storage collateral required

// Miner profitability:
// Inputs:
// - hardware (CPU+GPU+storage)
// - energy
// - operational costs
// Outputs:
// - block rewards
// - deal rewards (storage deals)
// - retrieval fees

// Verified deals (FIL+):
// - 10x reward multiplier
// - notary system
// - ongoing Filecoin ecosystem`}
        </pre>
        <p className="leading-7">
          WinCount: <strong>1+ per win, 대형 miner 여러 번 win 가능</strong>.<br />
          block reward = wincount × inflation.<br />
          FIL+ verified deals: 10x reward multiplier.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "Poisson" sortition인가</strong> — proportional fairness.<br />
          large miner: P(win) 높음, small miner: P(win) 낮음.<br />
          expected winners (λ=5): 5개 평균, 통계적 variation.<br />
          공정성 + 효율성 + decentralization balance.
        </p>
      </div>
    </section>
  );
}
