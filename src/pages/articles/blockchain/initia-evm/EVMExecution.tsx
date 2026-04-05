import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ExecFlowSteps from './ExecFlowSteps';

const STEPS = [
  { label: 'EVM 트랜잭션 처리 전체 흐름', body: 'Cosmos TX → AnteHandler → StateDB 어댑터 → EVM 실행 → KVStore 반영.\n이더리움과 동일한 EVM 바이트코드 실행, 어댑터 레이어만 추가.' },
  { label: '1단계: Cosmos TX 수신', body: 'MsgEVMCall 또는 MsgEVMCreate 메시지 디코딩.\nCosmos Msg 타입으로 래핑된 EVM 트랜잭션.' },
  { label: '2단계: AnteHandler 검증', body: 'Cosmos 방식의 가스 검증 + 서명 확인.\nEVM 가스 비용은 별도로 opcode 수준에서 추적.' },
  { label: '3단계: StateDB 어댑터 생성', body: 'Cosmos KVStore를 go-ethereum StateDB 인터페이스로 래핑.\nGetBalance → x/bank, GetNonce → x/auth sequence.' },
  { label: '4단계: EVM 실행', body: 'go-ethereum의 evm.Call() 또는 evm.Create() 실행.\nPrecompile: EVM 레거시 + Stateless + Stateful(ICosmos).' },
  { label: '5단계: 상태 커밋', body: 'stateDB.Commit()으로 변경 사항을 Cosmos KVStore에 반영.\nEVM 로그를 Cosmos 이벤트로 변환하여 인덱서에 전달.' },
];

const CODE_MAP = ['mini-msg-server', 'mini-msg-server', 'mini-msg-server', 'mini-statedb', 'mini-precompile', 'mini-msg-server'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function EVMExecution({ onCodeRef }: Props) {
  return (
    <section id="evm-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 실행 흐름</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        MiniEVM 트랜잭션 처리 — Cosmos TX를 EVM 호출로 변환하여 실행.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ExecFlowSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step].replace('mini-', '')}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 실행 단계별 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MiniEVM Transaction Execution Pipeline
//
// Entry point: sdk.Handler (Cosmos Msg handler)
//
// MsgCall message:
//   type MsgCall struct {
//       Sender    string   // bech32 Cosmos address
//       To        string   // hex EVM address or empty for CREATE
//       Value     sdk.Int  // native value (uinit)
//       Input     []byte   // ABI-encoded call data
//       GasLimit  uint64   // EVM gas limit
//       GasPrice  sdk.Int  // fee per unit
//   }

// Step 1: Message routing
//
//   Cosmos TX enters MsgServer:
//     func (k Keeper) Call(ctx, msg *MsgCall) (*MsgCallResponse, error) {
//         // 1. Validate sender
//         sender := sdk.MustAccAddressFromBech32(msg.Sender)
//         evmAddr := cosmosToEVMAddr(sender)
//
//         // 2. Call internal execution
//         return k.executeCall(ctx, evmAddr, msg)
//     }

// Step 2: AnteHandler (Cosmos-level validation)
//
//   Before EVM execution:
//     - Verify signatures
//     - Check account exists, has sequence
//     - Deduct Cosmos-level fees (gas * gasPrice)
//     - Increment sequence (nonce)
//
//   NOTE: EVM internal gas tracking is separate
//     Cosmos collects fee; EVM runs within gasLimit

// Step 3: StateDB adapter creation
//
//   stateDB := NewStateDB(ctx, k.storeKey, k.bankKeeper, k.authKeeper)
//   // Wraps Cosmos KVStore as go-ethereum StateDB
//   // Tracks balance, nonce, storage, code
//   // Supports snapshots for revert
//
//   EVM state operations:
//     stateDB.GetBalance(addr)   -> bank keeper
//     stateDB.GetCode(addr)      -> KVStore
//     stateDB.GetState(addr, k)  -> KVStore storage
//     stateDB.SetState(addr, k, v) -> staged for commit

// Step 4: EVM setup
//
//   blockCtx := vm.BlockContext{
//       CanTransfer: canTransferFunc,
//       Transfer:    transferFunc,
//       GetHash:     getHashFunc,
//       Coinbase:    common.Address{},  // validator reward addr
//       BlockNumber: big.NewInt(ctx.BlockHeight()),
//       Time:        big.NewInt(ctx.BlockTime().Unix()),
//       Difficulty:  big.NewInt(0),       // PoS, no PoW
//       BaseFee:     big.NewInt(0),       // or from x/feemarket
//       GasLimit:    ctx.GasMeter().Limit(),
//   }
//
//   txCtx := vm.TxContext{
//       Origin:   evmAddr,
//       GasPrice: big.NewInt(gasPrice),
//   }
//
//   evm := vm.NewEVM(blockCtx, txCtx, stateDB, chainConfig, vmConfig)
//   // Use go-ethereum's EVM interpreter directly

// Step 5: Execution
//
//   ret, leftoverGas, err := evm.Call(
//       vm.AccountRef(evmAddr),  // caller
//       toAddr,                   // callee
//       input,                    // call data
//       gasLimit,                 // gas
//       value,                    // value
//   )
//
//   EVM interpreter:
//     - Loads bytecode from stateDB
//     - Executes opcodes (ADD, MUL, SSTORE, SLOAD, ...)
//     - Handles internal CALL, DELEGATECALL, CREATE
//     - Charges gas per opcode
//     - Tracks refunds (SELFDESTRUCT, SSTORE revert)

// Step 6: State commit
//
//   if err != nil:
//       // EVM execution failed
//       stateDB.RevertToSnapshot(0)
//       return error
//
//   stateDB.Commit()
//   // Writes all changes to Cosmos KVStore
//   // Emits EVM logs as Cosmos events

// Step 7: Response
//
//   response := MsgCallResponse{
//       Ret:       ret,
//       GasUsed:   gasLimit - leftoverGas,
//       Logs:      stateDB.Logs(),
//   }
//
//   Cosmos SDK wraps this in TxResult
//   Included in block, indexed by nodes

// Gas accounting:
//
//   Two separate gas meters:
//     Cosmos GasMeter: tracks block-level gas
//     EVM gas tracking: per-op EVM gas
//
//   Reconciliation:
//     EVM gasUsed * ? = Cosmos gas consumed
//     (configurable ratio, typically 1:1)
//
//   Gas refund:
//     EVM refunds (SSTORE revert, SELFDESTRUCT)
//     Up to max(gasUsed/5, reducedGas) refundable
//     (EIP-3529 London rules)

// Error handling:
//
//   - Out of gas: revert all state changes
//   - Invalid opcode: revert
//   - REVERT opcode: revert + error message
//   - Panic / system error: revert + log for debugging
//
//   All handled via stateDB snapshots
//   Cosmos Msg returns standard error codes`}
        </pre>
      </div>
    </section>
  );
}
