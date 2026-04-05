import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TxLifecycleSteps from './viz/TxLifecycleSteps';

const STEPS = [
  { label: '트랜잭션 생명주기 전체 흐름', body: 'Cosmos TX → MsgServer → CreateEVM → evm.Call() → Commit → Dispatch.\n6단계를 거쳐 EVM 호출이 Cosmos 상태에 반영된다.' },
  { label: '1단계: MsgCall 수신', body: 'Cosmos SDK의 MsgServer가 MsgCall 메시지를 받는다.\nsender 주소를 EVM address로 변환하고, Cosmos↔EVM 시퀀스 넘버 불일치를 보정.' },
  { label: '2단계: 인자 검증 (validateArguments)', body: 'sender → EVM address 변환, input hex → bytes 디코딩.\nvalue → uint256 변환, accessList·authList 검증.' },
  { label: '3단계: CreateEVM 조립', body: 'go-ethereum의 vm.NewEVM()을 호출.\nBlockContext(CanTransfer, Transfer, GetHash) + StateDB + Precompile을 조립.' },
  { label: '4단계: evm.Call() 실행', body: 'go-ethereum의 EVM 인터프리터가 바이트코드를 실행.\nintrinsic gas 차감 후, opcode별 가스 추적. London 하드포크 refund 적용.' },
  { label: '5단계: StateDB Commit', body: 'Snapshot 스택을 역순으로 커밋 → Cosmos KVStore에 반영.\nSELFDESTRUCT된 계정의 잔액 소각 + 상태 삭제.' },
  { label: '6단계: Cosmos 메시지 디스패치', body: '프리컴파일 execute_cosmos()에서 큐잉된 Cosmos 메시지를 일괄 실행.\n실패 허용(allowFailure) + 콜백(callbackId) 패턴으로 EVM↔Cosmos 양방향 호출.' },
];

const CODE_MAP = ['mini-evm-call', 'mini-msg-server', 'mini-msg-server', 'mini-create-evm', 'mini-evm-call', 'mini-statedb', 'mini-dispatch'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function TxLifecycle({ onCodeRef }: Props) {
  return (
    <section id="tx-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트랜잭션 생명주기</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Cosmos TX가 EVM 호출로 변환되어 실행되는 6단계 흐름을 코드 수준으로 추적.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <TxLifecycleSteps step={step} />
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
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 생명주기 코드 레벨 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MiniEVM Transaction Lifecycle — Code Walkthrough
//
// Starting point: Cosmos TX submitted by user
//   containing MsgCall or MsgCreate

// Phase 1: Cosmos BaseApp processing
//
//   user -> RPC -> mempool -> proposer
//   proposer -> BaseApp.CheckTx() -> BaseApp.DeliverTx()
//   DeliverTx -> AnteHandler -> routeMsg -> MsgServer.Call()

// Phase 2: MsgServer.Call() entry
//
//   func (k Keeper) Call(goCtx context.Context, msg *MsgCall)
//     (*MsgCallResponse, error) {
//       ctx := sdk.UnwrapSDKContext(goCtx)
//
//       // Validate arguments
//       sender, err := k.validateArguments(ctx, msg)
//       if err != nil {
//           return nil, err
//       }
//
//       // Execute EVM call
//       resp, err := k.executeCall(ctx, sender, msg)
//       if err != nil {
//           return nil, err
//       }
//
//       return resp, nil
//   }

// Phase 3: validateArguments
//
//   func (k Keeper) validateArguments(ctx, msg) (common.Address, error) {
//       // Convert bech32 to EVM address
//       sender := sdk.MustAccAddressFromBech32(msg.Sender)
//       evmAddr := cosmosToEVMAddr(sender)
//
//       // Verify account exists
//       acc := k.authKeeper.GetAccount(ctx, sender)
//       if acc == nil {
//           return common.Address{}, ErrAccountNotFound
//       }
//
//       // Verify Cosmos/EVM nonce alignment
//       expectedNonce := acc.GetSequence()
//       evmNonce := msg.Nonce
//       if evmNonce != expectedNonce {
//           return common.Address{}, ErrInvalidNonce
//       }
//
//       return evmAddr, nil
//   }

// Phase 4: CreateEVM
//
//   func (k Keeper) createEVM(ctx, sender, msg) (*vm.EVM, *StateDB) {
//       // Build StateDB from Cosmos context
//       stateDB := k.newStateDB(ctx)
//
//       // Build block context
//       blockCtx := vm.BlockContext{
//           BlockNumber: big.NewInt(ctx.BlockHeight()),
//           Time:        big.NewInt(ctx.BlockTime().Unix()),
//           GasLimit:    msg.GasLimit,
//           CanTransfer: core.CanTransfer,
//           Transfer:    core.Transfer,
//           GetHash:     k.getBlockHashFn(ctx),
//       }
//
//       // Build transaction context
//       txCtx := vm.TxContext{
//           Origin:   sender,
//           GasPrice: msg.GasPrice.BigInt(),
//       }
//
//       // Assemble precompiles
//       precompiles := k.precompiles(ctx)
//
//       // Create EVM
//       evm := vm.NewEVM(
//           blockCtx, txCtx, stateDB,
//           k.chainConfig(ctx),
//           vm.Config{ExtraEips: []int{}, Precompiles: precompiles},
//       )
//
//       return evm, stateDB
//   }

// Phase 5: evm.Call() execution
//
//   ret, leftover, err := evm.Call(
//       vm.AccountRef(sender),
//       common.HexToAddress(msg.To),
//       input,
//       msg.GasLimit,
//       value,
//   )
//
//   go-ethereum internal:
//     - Transfer value (if any) via Transfer func
//     - Load callee code from StateDB
//     - Execute opcodes in interpreter loop
//     - Handle nested CALL/CREATE
//     - Track gas per opcode
//     - Handle REVERT, out-of-gas, errors

// Phase 6: StateDB.Commit()
//
//   func (sdb *StateDB) Commit() error {
//       // Write all staged state changes to KVStore
//       for addr, obj := range sdb.dirtyAccounts {
//           // Balance changes applied to bank
//           if obj.balanceDirty {
//               sdb.applyBalanceChange(addr, obj)
//           }
//           // Storage updates to KVStore
//           for slot, val := range obj.dirtyStorage {
//               sdb.kvStore.Set(
//                   storageKey(addr, slot),
//                   val.Bytes(),
//               )
//           }
//           // Code stored if changed
//           if obj.codeDirty {
//               sdb.kvStore.Set(codeKey(addr), obj.code)
//           }
//           // Handle SELFDESTRUCT
//           if obj.suicided {
//               sdb.destroyAccount(addr)
//           }
//       }
//       return nil
//   }

// Phase 7: Cosmos message dispatch
//
//   // After EVM commits, dispatch queued Cosmos msgs
//   queuedMsgs := k.getQueuedMsgs(ctx)
//   for _, qmsg := range queuedMsgs {
//       // Execute via appropriate Cosmos MsgServer
//       result, err := k.executeQueuedMsg(ctx, qmsg)
//
//       // If msg has callback and succeeded:
//       if qmsg.CallbackID != nil && err == nil {
//           k.scheduleCallback(ctx, qmsg, result)
//       }
//
//       // Fail-safe: don't abort whole tx if allowFailure
//       if err != nil && !qmsg.AllowFailure {
//           return ErrCosmosDispatchFailed
//       }
//   }

// Phase 8: Response and events
//
//   // Emit events for indexers
//   ctx.EventManager().EmitEvents([]sdk.Event{
//       sdk.NewEvent("evm_call",
//           sdk.NewAttribute("sender", sender.Hex()),
//           sdk.NewAttribute("gas_used", strconv.Itoa(gasUsed)),
//       ),
//   })
//
//   // Convert EVM logs to Cosmos events
//   for _, log := range stateDB.Logs() {
//       ctx.EventManager().EmitEvent(
//           logToEvent(log),
//       )
//   }
//
//   return &MsgCallResponse{Ret: ret, GasUsed: gasUsed}

// Error handling and rollback:
//
//   On any error:
//     - StateDB snapshots revert automatically
//     - No changes persisted to KVStore
//     - Event emission skipped
//     - Sender still charged for gas used

// Observability:
//   - Cosmos events for all EVM actions
//   - EVM logs embedded as events
//   - Transaction trace available via debug RPC
//   - Full gas accounting exposed`}
        </pre>
      </div>
    </section>
  );
}
