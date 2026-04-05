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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">x/vm 모듈 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// x/vm Module (EVM on Cosmos SDK)
//
// Keeper 구조:
//
// type Keeper struct {
//     storeKey     store.StoreKey
//     paramstore   paramtypes.Subspace
//
//     // External keepers
//     accountKeeper    types.AccountKeeper
//     bankKeeper       types.BankKeeper
//     stakingKeeper    types.StakingKeeper
//     feeMarketKeeper  types.FeeMarketKeeper
//
//     // EVM config
//     chainID      *big.Int
//     tracer       string
//
//     // Precompiled contracts
//     customPrecompiles map[common.Address]vm.PrecompiledContract
// }

// TX Execution Flow:
//
// 1. MetaMask → JSON-RPC
//    eth_sendRawTransaction(signed_tx)
//
// 2. JSON-RPC Server
//    unmarshal Ethereum TX
//    wrap in Cosmos TX
//    submit to mempool
//
// 3. Ante Handler (Cosmos SDK)
//    - EthAccountVerificationDecorator
//    - EthSigVerificationDecorator (ECDSA)
//    - EthGasConsumeDecorator
//    - EthIncrementSenderSequenceDecorator
//    - EIP-1559 fee validation
//
// 4. ApplyMessage (keeper.go)
//    - Create EVM instance
//    - Configure StateDB
//    - Execute message
//    - Return result + logs
//
// 5. State Commit
//    StateDB.Commit() → IAVL tree
//    Events published
//    Block finalized

// StateDB Implementation:
//
//   stateDB.GetBalance(addr)
//     → bankKeeper.GetBalance(sdkCtx, addr)
//
//   stateDB.SetState(addr, key, value)
//     → store.Set(prefixKey(addr, key), value)
//
//   stateDB.AddLog(log)
//     → Events.Append(convertLog(log))

// EVM Config:
//   EvmDenom: "aevmos" (18 decimals)
//   EnableCreate: true (contract deployment)
//   EnableCall: true (contract calls)
//   ExtraEIPs: [3855, 3860, ...] (EIPs enabled)

// Precompiles:
//   Standard (0x01-0x09): ecrecover, sha256, etc.
//   Evmos-specific:
//     - Staking precompile (delegate, undelegate)
//     - IBC transfer precompile
//     - Distribution (rewards)
//     - Bech32 address conversion`}
        </pre>
      </div>
    </section>
  );
}
