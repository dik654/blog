import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EVMFlowSteps from './EVMFlowSteps';

const STEPS = [
  { label: 'EVM 트랜잭션 처리 전체 흐름', body: 'MetaMask → Ante Handler → EVM 실행 → Cosmos 상태 업데이트 → 이벤트 발생.\nKeeper 패턴으로 account/bank/feeMarket 키퍼 조합.' },
  { label: 'MetaMask에서 TX 요청', body: 'JSON-RPC 호환 엔드포인트로 이더리움 표준 TX 수신.\neth_sendTransaction → Cosmos TX로 래핑.' },
  { label: 'Ante Handler: 서명 + 수수료 검증', body: 'Cosmos SDK AnteHandler가 서명 검증 + Gas 확인.\nEIP-1559 Base Fee로 최소 수수료 결정.' },
  { label: 'EVM 실행: 스마트 컨트랙트', body: 'go-ethereum EVM 인스턴스에서 바이트코드 실행.\nApplyMessage() → StateDB → EVM → 결과 반환.' },
  { label: 'Cosmos 상태 업데이트 & 이벤트', body: 'StateDB.Commit()으로 KVStore 반영.\nEVM 로그를 Cosmos 이벤트로 변환하여 인덱서에 전달.' },
];

const CODE_MAP = ['ev-keeper', 'ev-keeper', 'ev-feemarket', 'ev-keeper', 'ev-keeper'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function EVMModule({ onCodeRef }: Props) {
  return (
    <section id="evm-module" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 모듈 (x/vm)</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        EVM 모듈 — Cosmos SDK 체인에서 이더리움 가상머신을 실행하는 핵심 컴포넌트.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <EVMFlowSteps step={step} />
            {onCodeRef && (
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
        <h3 className="text-xl font-semibold mt-6 mb-3">x/vm 모듈 상세</h3>

        {/* Keeper 구조 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Keeper 구조</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="font-medium text-muted-foreground mb-1">Storage</p>
              <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                <li><code className="text-[11px]">storeKey</code> — <code className="text-[11px]">store.StoreKey</code></li>
                <li><code className="text-[11px]">paramstore</code> — <code className="text-[11px]">paramtypes.Subspace</code></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-1">External Keepers</p>
              <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                <li><code className="text-[11px]">accountKeeper</code></li>
                <li><code className="text-[11px]">bankKeeper</code></li>
                <li><code className="text-[11px]">stakingKeeper</code></li>
                <li><code className="text-[11px]">feeMarketKeeper</code></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-1">EVM Config</p>
              <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                <li><code className="text-[11px]">chainID</code> — <code className="text-[11px]">*big.Int</code></li>
                <li><code className="text-[11px]">tracer</code> — <code className="text-[11px]">string</code></li>
                <li><code className="text-[11px]">customPrecompiles</code> — <code className="text-[11px]">map[Address]PrecompiledContract</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* TX Execution Flow */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">TX Execution Flow</h4>
          <div className="space-y-3 text-xs">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">1</span>
              <div>
                <p className="font-medium">MetaMask → JSON-RPC</p>
                <p className="text-muted-foreground"><code className="text-[11px]">eth_sendRawTransaction(signed_tx)</code></p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">2</span>
              <div>
                <p className="font-medium">JSON-RPC Server</p>
                <p className="text-muted-foreground">Ethereum TX unmarshal → Cosmos TX wrap → mempool 제출</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">3</span>
              <div>
                <p className="font-medium">Ante Handler (Cosmos SDK)</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['EthAccountVerificationDecorator', 'EthSigVerificationDecorator (ECDSA)', 'EthGasConsumeDecorator', 'EthIncrementSenderSequenceDecorator', 'EIP-1559 fee validation'].map(d => (
                    <span key={d} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[11px]">{d}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px]">4</span>
              <div>
                <p className="font-medium">ApplyMessage (<code className="text-[11px]">keeper.go</code>)</p>
                <p className="text-muted-foreground">Create EVM instance → Configure StateDB → Execute message → Return result + logs</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">5</span>
              <div>
                <p className="font-medium">State Commit</p>
                <p className="text-muted-foreground"><code className="text-[11px]">StateDB.Commit()</code> → IAVL tree, Events published, Block finalized</p>
              </div>
            </div>
          </div>
        </div>

        {/* StateDB Implementation */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">StateDB Implementation</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted shrink-0">stateDB.GetBalance(addr)</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted">bankKeeper.GetBalance(sdkCtx, addr)</code>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted shrink-0">stateDB.SetState(addr, key, val)</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted">store.Set(prefixKey(addr, key), val)</code>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted shrink-0">stateDB.AddLog(log)</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-muted">Events.Append(convertLog(log))</code>
            </div>
          </div>
        </div>

        {/* EVM Config + Precompiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">EVM Config</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code className="text-[11px]">EvmDenom</code>: <code className="text-[11px]">"aevmos"</code> (18 decimals)</li>
              <li><code className="text-[11px]">EnableCreate</code>: true (contract deployment)</li>
              <li><code className="text-[11px]">EnableCall</code>: true (contract calls)</li>
              <li><code className="text-[11px]">ExtraEIPs</code>: [3855, 3860, ...] (EIPs enabled)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">Precompiles</h4>
            <p className="text-xs text-muted-foreground mb-1">Standard (0x01-0x09): ecrecover, sha256 등</p>
            <p className="text-xs font-medium mt-2 mb-1">Evmos-specific:</p>
            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Staking precompile (delegate, undelegate)</li>
              <li>IBC transfer precompile</li>
              <li>Distribution (rewards)</li>
              <li>Bech32 address conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
