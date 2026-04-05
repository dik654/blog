import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'Cosmos EVM — 4개 핵심 모듈', body: 'Cosmos SDK 체인에 EVM 호환성을 추가하는 플러그앤플레이 솔루션.\ngo-ethereum의 EVM을 Cosmos 모듈(x/vm)로 통합.' },
  { label: 'x/vm: 이더리움 가상머신', body: 'Keeper 패턴으로 accountKeeper, bankKeeper, feeMarketKeeper와 상호작용.\nApplyMessage() → EVM 실행 → Cosmos 상태 업데이트.' },
  { label: 'x/feemarket: EIP-1559 동적 수수료', body: '블록 가스 사용량이 50% 넘으면 Base Fee 상승, 낮으면 하락.\nBaseFeeChangeDenominator + ElasticityMultiplier로 세부 조정.' },
  { label: 'x/erc20: Cosmos Coin ↔ ERC20 변환', body: 'TokenPair로 양방향 매핑 관리.\nIBC 전송 시에도 자동 변환 — 크로스체인 ERC20 토큰 지원.' },
  { label: 'x/precisebank: 18자리 소수점', body: 'Cosmos SDK 표준(6자리)과 이더리움(18자리) 정밀도 차이 해결.\n정수부 + 소수부 분리 → 소액 거래 정확성 보장.' },
];

const CODE_MAP = ['ev-keeper', 'ev-keeper', 'ev-feemarket', 'ev-token-pair', 'ev-keeper'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosmos EVM (Evmos) 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Cosmos SDK 체인에 EVM 호환성을 추가하는 플러그앤플레이 솔루션.<br />
        go-ethereum EVM을 Cosmos 모듈로 통합, 이더리움 스마트 컨트랙트 그대로 실행.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step > 0 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step].replace('ev-', '')}.go
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cosmos EVM 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Evmos / Cosmos EVM Stack
//
// Goal:
//   "Ethereum smart contracts on Cosmos SDK chains"
//
// Architecture Layers:
//
//   User Applications (dApps, wallets)
//     ↓ JSON-RPC (eth_* methods)
//   JSON-RPC Server
//     ↓ Cosmos TX wrap
//   Cosmos SDK Baseapp
//     ↓
//   Cosmos Modules (x/vm, x/erc20, x/feemarket)
//     ↓
//   EVM (go-ethereum fork)
//     ↓
//   IAVL Tree (Cosmos state)

// 4 Core Modules:
//
// 1. x/vm (EVM execution)
//    - ApplyMessage() → EVM 실행
//    - StateDB for EVM state
//    - Ethereum-compatible opcodes
//    - Gas metering
//
// 2. x/feemarket (EIP-1559)
//    - Base fee calculation
//    - Dynamic gas pricing
//    - Block utilization tracking
//    - Priority fees
//
// 3. x/erc20 (Token bridging)
//    - TokenPair mappings
//    - Cosmos Coin ↔ ERC20
//    - IBC 호환 자동 변환
//    - Mint/Burn on conversion
//
// 4. x/precisebank (Precision)
//    - Cosmos: 6 decimals default
//    - Ethereum: 18 decimals
//    - Integer + fraction split
//    - Accurate micro-transfers

// vs Pure Ethereum:
//
//   Evmos 장점:
//   ✓ IBC 호환성 (Cosmos ecosystem)
//   ✓ Fast finality (Tendermint BFT)
//   ✓ Low fees
//   ✓ Cross-chain native
//
//   Evmos 단점:
//   ✗ Lower TPS than Solana
//   ✗ Smaller ecosystem than Ethereum
//   ✗ Validators set 제한적

// 주요 체인 with Cosmos EVM:
//   - Evmos (original)
//   - Berachain
//   - Canto
//   - Kava
//   - Cronos
//   - Injective

// JSON-RPC Compatibility:
//   eth_getBalance, eth_sendTransaction
//   eth_call, eth_estimateGas
//   eth_getBlockByNumber
//   MetaMask, Hardhat, Remix 호환`}
        </pre>
      </div>
    </section>
  );
}
