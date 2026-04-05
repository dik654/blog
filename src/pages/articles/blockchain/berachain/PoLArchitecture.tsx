import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PoLSteps from './PoLSteps';

const STEPS = [
  { label: 'PoL 플라이휠 전체 구조', body: '유동성 제공 → BGT 보상 → 검증자 위임 → 블록 생성 → BGT 배분 → 재투자.\n3토큰 모델: BERA(가스) + BGT(거버넌스, 양도불가) + HONEY(스테이블).' },
  { label: '1단계: DeFi 프로토콜에 유동성 제공', body: '사용자가 DEX, 대출 풀에 유동성을 공급.\nEthereum PoS와 달리 스테이킹이 아닌 유동성 기여로 보안 확보.' },
  { label: '2단계: Reward Vault에서 BGT 수령', body: '유동성 공급 대가로 BGT(Bera Governance Token)를 보상.\nBGT는 양도 불가 — 위임만 가능하여 투기 방지.' },
  { label: '3단계: 검증자에게 BGT 위임', body: 'BGT 홀더가 원하는 검증자에게 위임(boost).\n검증자의 투표 파워 = 위임받은 BGT 총량.' },
  { label: '4단계: 블록 생성 & BGT 배분', body: '검증자가 블록 제안 시 게이지 가중치에 따라 BGT를 프로토콜에 배분.\n프로토콜은 유동성 유치를 위해 검증자에게 인센티브 제공.' },
  { label: '5단계: 선순환 (플라이휠)', body: '프로토콜 인센티브 → 검증자 → 위임자 → 다시 유동성 제공.\n네트워크 보안 = 스테이킹 + DeFi TVL 합산.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function PoLArchitecture({ onCodeRef }: Props) {
  return (
    <section id="pol-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Liquidity (PoL)</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        이더리움 PoS — ETH 스테이킹으로 보안 확보.<br />
        Berachain PoL — 유동성 제공으로 보안 확보하는 새로운 합의 경제 모델.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <PoLSteps step={step} />
            {onCodeRef && step >= 3 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('bk-block-builder', codeRefs['bk-block-builder'])} />
                <span className="text-[10px] text-muted-foreground">block_builder.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Proof of Liquidity 경제 모델</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof of Liquidity Economic Model
//
// Problem with traditional PoS:
//   Stakers lock ETH/SOL → earn yield
//   Capital sits idle (just secures network)
//   DeFi protocols compete with staking for capital
//   → Liquidity fragmentation
//
// PoL solution:
//   Liquidity providers EARN consensus power
//   Capital simultaneously:
//     - Provides DEX/lending liquidity (productive)
//     - Secures network (via BGT delegation)
//   → Unified economic flywheel

// Token roles:
//
//   BERA (gas token):
//     Users pay gas in BERA
//     Transfers, swaps, normal ERC-20 behavior
//     Max supply: ~500M
//
//   BGT (governance, soulbound):
//     Earned BY: providing LP, depositing to reward vaults
//     Soulbound: cannot sell/transfer
//     Use 1: Delegate to validators (increases their weight)
//     Use 2: Burn for BERA (1:1 ratio)
//     Use 3: Governance voting
//
//   HONEY (stablecoin):
//     Overcollateralized stablecoin
//     Mint by depositing whitelisted assets
//     Pegged to $1 via BeraBorrowing

// Liquidity flywheel:
//
//   Step 1: User LP to BEX pool (BERA/HONEY)
//           → Pool receives 100 HONEY + 50 BERA
//
//   Step 2: User stakes LP tokens in Reward Vault
//           → Earns BGT at rate set by governance
//
//   Step 3: BGT accrues to user's address (soulbound)
//           → 100 BGT earned over 7 days
//
//   Step 4: User delegates BGT to chosen validator
//           → Validator V has more voting weight
//
//   Step 5: Validator V more likely to be block proposer
//           → Earns block rewards, gas fees
//
//   Step 6: Validator V emits BGT to incentivized protocols
//           → e.g., 50% to BEX, 30% to BEND, 20% to X
//
//   Step 7: Protocols distribute these BGT as LP rewards
//           → Back to Step 1 (more liquidity)

// Validator selection:
//
//   Weight(V) = sum of BGT delegated to V
//
//   Probability of being proposer = Weight(V) / Total_BGT
//
//   Delegation is revocable (epoch boundary)
//   Bad validators lose delegations fast

// Governance pools (gauges):
//
//   BGT holders vote on gauges:
//     "Which protocols should validators reward?"
//
//   Validator then emits BGT per-block to:
//     - Winning gauges (per vote)
//     - Proportional to vote weight
//
//   Protocols incentivize BGT holders to vote for them
//     (pay bribes via external rewards, airdrops, etc.)
//
//   Similar to Curve's veCRV gauge system

// Comparison with PoS chains:
//
//   Ethereum PoS:
//     Stake = lock ETH in Beacon Chain
//     Yield = ~4% APR
//     Capital efficiency: LOW (just sits)
//
//   Berachain PoL:
//     "Stake" = provide DeFi liquidity
//     Yield = LP fees + BGT rewards
//     Capital efficiency: HIGH (used in DeFi)
//
//   Trade-off:
//     PoL complexity higher
//     Risk: BGT volatility affects security
//     Risk: validator-protocol collusion

// BGT → BERA burn mechanism:
//
//   User can: burn X BGT → receive X BERA
//     Only one way: BGT → BERA (not reverse)
//
//   Incentive:
//     Keep BGT to earn validator rewards
//     OR cash out via burn → BERA
//
//   Economic effect:
//     BGT supply increases (from emissions)
//     BERA supply increases when BGT burned
//     Net BERA inflation tied to BGT emission

// Reward Vaults:
//
//   contract RewardVault {
//     function stake(uint256 amount) // deposit LP tokens
//     function withdraw(uint256 amount)
//     function getReward() // claim BGT
//     function notifyRewardAmount(uint256 reward)
//   }
//
//   Multiple vaults per asset
//   Each vault incentivized by different protocols
//   Validators allocate BGT emissions across vaults

// Security assumptions:
//
//   Honest majority (BFT): 2/3+ validators honest
//   Honest capital: 2/3+ of BGT delegated to honest validators
//
//   If malicious whale delegates 1/3+ BGT:
//     → 1/3+ validator weight captured
//     → Can halt chain (not rewrite)
//   If 2/3+ BGT malicious:
//     → Safety violation possible

// Real economic protocols on Berachain:
//   BEX: DEX (Balancer fork)
//   BEND: lending market
//   BERPS: perpetuals
//   InfraRed: liquid BGT staking
//   Kodiak: concentrated liquidity`}
        </pre>
      </div>
    </section>
  );
}
