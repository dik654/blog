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

      <div className="max-w-none mt-6 space-y-5">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cosmos EVM 아키텍처</h3>

        {/* Architecture Layers */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Architecture Layers</h4>
          <p className="text-xs text-muted-foreground mb-3">
            "Ethereum smart contracts on Cosmos SDK chains"
          </p>
          <div className="flex flex-col items-center gap-1 text-xs">
            <span className="px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 font-medium">User Applications (dApps, wallets)</span>
            <span className="text-muted-foreground">↓ JSON-RPC (<code className="text-[11px]">eth_*</code> methods)</span>
            <span className="px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 font-medium">JSON-RPC Server</span>
            <span className="text-muted-foreground">↓ Cosmos TX wrap</span>
            <span className="px-3 py-1.5 rounded bg-purple-500/10 text-purple-400 font-medium">Cosmos SDK Baseapp</span>
            <span className="text-muted-foreground">↓</span>
            <span className="px-3 py-1.5 rounded bg-purple-500/10 text-purple-400 font-medium">Cosmos Modules (x/vm, x/erc20, x/feemarket)</span>
            <span className="text-muted-foreground">↓</span>
            <span className="px-3 py-1.5 rounded bg-green-500/10 text-green-400 font-medium">EVM (go-ethereum fork)</span>
            <span className="text-muted-foreground">↓</span>
            <span className="px-3 py-1.5 rounded bg-amber-500/10 text-amber-400 font-medium">IAVL Tree (Cosmos state)</span>
          </div>
        </div>

        {/* 4 Core Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">x/vm (EVM execution)</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code className="text-[11px]">ApplyMessage()</code> — EVM 실행</li>
              <li>StateDB for EVM state</li>
              <li>Ethereum-compatible opcodes</li>
              <li>Gas metering</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">x/feemarket (EIP-1559)</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Base fee calculation</li>
              <li>Dynamic gas pricing</li>
              <li>Block utilization tracking</li>
              <li>Priority fees</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">x/erc20 (Token bridging)</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code className="text-[11px]">TokenPair</code> mappings</li>
              <li>Cosmos Coin ↔ ERC20</li>
              <li>IBC 호환 자동 변환</li>
              <li>Mint/Burn on conversion</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">x/precisebank (Precision)</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Cosmos: 6 decimals default</li>
              <li>Ethereum: 18 decimals</li>
              <li>Integer + fraction split</li>
              <li>Accurate micro-transfers</li>
            </ul>
          </div>
        </div>

        {/* vs Pure Ethereum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-green-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Evmos 장점</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>IBC 호환성 (Cosmos ecosystem)</li>
              <li>Fast finality (Tendermint BFT)</li>
              <li>Low fees</li>
              <li>Cross-chain native</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold text-red-400 mb-2">Evmos 단점</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Lower TPS than Solana</li>
              <li>Smaller ecosystem than Ethereum</li>
              <li>Validators set 제한적</li>
            </ul>
          </div>
        </div>

        {/* Cosmos EVM Chains + JSON-RPC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">주요 Cosmos EVM 체인</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Evmos', 'Berachain', 'Canto', 'Kava', 'Cronos', 'Injective'].map(c => (
                <span key={c} className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">JSON-RPC Compatibility</h4>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {['eth_getBalance', 'eth_sendTransaction', 'eth_call', 'eth_estimateGas', 'eth_getBlockByNumber'].map(m => (
                <code key={m} className="px-1.5 py-0.5 rounded bg-muted text-[11px]">{m}</code>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">MetaMask, Hardhat, Remix 호환</p>
          </div>
        </div>
      </div>
    </section>
  );
}
