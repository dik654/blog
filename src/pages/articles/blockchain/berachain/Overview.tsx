import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BeaconKitCompareViz from './viz/BeaconKitCompareViz';

const STEPS = [
  { label: '이더리움 Beacon Chain vs BeaconKit 전체 비교', body: 'BeaconKit — 이더리움 Beacon Chain 스펙을 CometBFT 위에서 구현.\nEngine API로 이더리움 EL 클라이언트(geth/reth)를 그대로 재활용.' },
  { label: 'CL: Casper FFG → CometBFT', body: '이더리움의 확률적 최종성(2 에폭, ~12.8분) 대신 CometBFT의 즉시 최종성(1 블록). reorg 발생 불가.' },
  { label: '포크 선택: LMD-GHOST → 불필요', body: 'BFT 합의에서는 포크가 발생하지 않으므로 포크 선택 규칙 자체가 불필요. 아키텍처 단순화.' },
  { label: 'P2P: libp2p → MConnection', body: 'Tendermint의 MConnection 멀티플렉싱 P2P. 기존 Cosmos 생태계의 피어 디스커버리/가십과 호환.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Berachain BeaconKit 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Berachain — Proof of Liquidity(PoL) 합의를 사용하는 EVM 호환 블록체인.<br />
        BeaconKit 프레임워크 — 이더리움 EL+CL 아키텍처를 Cosmos에 가장 직접적으로 이식.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <BeaconKitCompareViz />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('bk-service', codeRefs['bk-service'])} />
                <span className="text-[10px] text-muted-foreground">service.go</span>
                <CodeViewButton onClick={() => onCodeRef('bk-state-processor', codeRefs['bk-state-processor'])} />
                <span className="text-[10px] text-muted-foreground">state_processor.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Berachain 아키텍처 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Berachain Architecture
//
// Foundation:
//   EVM L1 with Proof of Liquidity (PoL)
//   Built on BeaconKit (CometBFT + Ethereum spec)
//   Launch: Mainnet 2025 Q1
//
// Key components:
//   Execution Layer: Reth or Geth (Ethereum clients)
//   Consensus Layer: BeaconKit (not Prysm/Lighthouse)
//   Consensus Engine: CometBFT (not Casper FFG)
//   Economic model: PoL (not PoS)

// Three-token system:
//
//   BERA:
//     Native gas token
//     Used for: transactions, EVM gas
//     Transferable
//     Similar to ETH on Ethereum
//
//   BGT (Bera Governance Token):
//     Soulbound (non-transferable)
//     Earned via liquidity provision
//     Used for: delegation to validators, governance
//     Can only convert TO BERA (burn BGT → mint BERA)
//     CANNOT convert BERA → BGT
//
//   HONEY:
//     Native stablecoin (overcollateralized)
//     Minted from whitelisted assets (USDC, pyUSD)
//     Used in: DEX pools, lending markets
//     Peg maintained by arbitrage + collateral

// BeaconKit vs other Cosmos EVM:
//
//   Evmos / Cronos:
//     EVM bolted onto Cosmos SDK modules
//     Account model differs from Ethereum
//     Custom fee market (x/feemarket)
//
//   BeaconKit (Berachain):
//     True Ethereum architecture
//     Engine API between CL and EL
//     Uses geth/reth unchanged
//     Validator keys: BLS (Ethereum spec)
//     Withdrawal credentials: Ethereum format
//     Gasper-equivalent but BFT finality

// Why BeaconKit?
//
//   Maximal Ethereum compatibility:
//     ✓ Same EL client (geth, reth, nethermind)
//     ✓ Same Engine API (fork choice decoupled)
//     ✓ Same RPC methods (eth_*)
//     ✓ Same precompiles
//     ✓ Same EVM opcodes
//
//   Cosmos benefits:
//     ✓ Instant finality (1 block, not 2 epochs)
//     ✓ No reorgs (BFT safety)
//     ✓ IBC compatibility (via future bridges)
//     ✓ Faster iteration (CometBFT updates)

// Finality comparison:
//
//   Ethereum PoS:
//     - Epoch = 32 slots = ~6.4 min
//     - Finality = 2 epochs = ~12.8 min
//     - Can reorg up to finality
//
//   Berachain BeaconKit:
//     - Block time = ~2 sec
//     - Finality = 1 block (BFT)
//     - No reorgs possible
//     - 2/3+ honest validators needed

// Engine API:
//
//   Method: engine_forkchoiceUpdatedV3
//     CL tells EL: "build block on head X"
//     EL returns: payload_id
//
//   Method: engine_getPayloadV3
//     CL asks: "give me built payload"
//     EL returns: ExecutionPayload
//
//   Method: engine_newPayloadV3
//     CL asks: "validate this payload"
//     EL returns: {status: VALID | INVALID}
//
//   BeaconKit calls these during:
//     PrepareProposal → forkchoiceUpdated + getPayload
//     ProcessProposal → newPayload
//     FinalizeBlock → forkchoiceUpdated (finalize head)

// Use cases:
//
//   1. DeFi primitives:
//      BEX (native DEX)
//      BERPS (perpetuals)
//      BEND (lending)
//
//   2. Liquid staking:
//      Stake BGT derivatives (iBGT, etc.)
//
//   3. EVM dApps:
//      Uniswap, Aave ports
//      Any Ethereum dApp deploys unchanged`}
        </pre>
      </div>
    </section>
  );
}
