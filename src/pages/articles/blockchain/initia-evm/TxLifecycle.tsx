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

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 생명주기 코드 레벨 상세</h3>

        {/* 시작점 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">시작점</h4>
          <p className="text-xs text-muted-foreground">사용자가 <code className="text-xs">MsgCall</code> 또는 <code className="text-xs">MsgCreate</code>를 포함한 Cosmos TX를 제출</p>
        </div>

        {/* Phase 1: BaseApp 처리 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 1: Cosmos BaseApp 처리</h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted/50 px-2 py-1">user</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1">RPC</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1">mempool</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1">proposer</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1"><code className="text-xs">BaseApp.CheckTx()</code></span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1"><code className="text-xs">BaseApp.DeliverTx()</code></span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1">AnteHandler</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1">routeMsg</span>
            <span>→</span>
            <span className="rounded bg-muted/50 px-2 py-1 font-medium text-foreground"><code className="text-xs">MsgServer.Call()</code></span>
          </div>
        </div>

        {/* Phase 2: MsgServer.Call() */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 2: MsgServer.Call() 진입</h4>
          <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
            <p><code className="text-xs">Keeper.Call(goCtx context.Context, msg *MsgCall) (*MsgCallResponse, error)</code></p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              <li><code className="text-xs">sdk.UnwrapSDKContext(goCtx)</code>로 Cosmos 컨텍스트 추출</li>
              <li><code className="text-xs">k.validateArguments(ctx, msg)</code> — 인자 검증 후 sender 주소 반환</li>
              <li><code className="text-xs">k.executeCall(ctx, sender, msg)</code> — EVM 호출 실행</li>
            </ol>
          </div>
        </div>

        {/* Phase 3: validateArguments */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 3: validateArguments</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">주소 변환</span>
              <p className="mt-1"><code className="text-xs">sdk.MustAccAddressFromBech32(msg.Sender)</code> → <code className="text-xs">cosmosToEVMAddr(sender)</code></p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">계정 존재 확인</span>
              <p className="mt-1"><code className="text-xs">authKeeper.GetAccount(ctx, sender)</code>. nil이면 <code className="text-xs">ErrAccountNotFound</code></p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">논스 정합성</span>
              <p className="mt-1"><code className="text-xs">acc.GetSequence()</code>와 <code className="text-xs">msg.Nonce</code> 비교. 불일치 시 <code className="text-xs">ErrInvalidNonce</code></p>
            </div>
          </div>
        </div>

        {/* Phase 4: CreateEVM */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 4: CreateEVM</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">StateDB + BlockContext</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">k.newStateDB(ctx)</code> — Cosmos 컨텍스트에서 StateDB 생성</li>
                <li><code className="text-xs">BlockNumber</code> ← <code className="text-xs">ctx.BlockHeight()</code></li>
                <li><code className="text-xs">Time</code> ← <code className="text-xs">ctx.BlockTime().Unix()</code></li>
                <li><code className="text-xs">CanTransfer</code>, <code className="text-xs">Transfer</code>, <code className="text-xs">GetHash</code> 함수 설정</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">TxContext + 조립</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">Origin = sender</code>, <code className="text-xs">GasPrice = msg.GasPrice.BigInt()</code></li>
                <li><code className="text-xs">k.precompiles(ctx)</code>로 프리컴파일 조립</li>
                <li><code className="text-xs">vm.NewEVM(blockCtx, txCtx, stateDB, chainConfig, vmConfig)</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phase 5: evm.Call() */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 5: evm.Call() 실행</h4>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <p><code className="text-xs">evm.Call(vm.AccountRef(sender), common.HexToAddress(msg.To), input, msg.GasLimit, value)</code> → <code className="text-xs">(ret, leftover, err)</code></p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="rounded bg-muted/50 p-2">Transfer 함수로 밸류 전송</div>
              <div className="rounded bg-muted/50 p-2">StateDB에서 callee 코드 로드</div>
              <div className="rounded bg-muted/50 p-2">인터프리터 루프에서 opcode 실행</div>
              <div className="rounded bg-muted/50 p-2">중첩 CALL/CREATE 처리</div>
              <div className="rounded bg-muted/50 p-2">opcode별 가스 추적</div>
              <div className="rounded bg-muted/50 p-2">REVERT, out-of-gas 에러 처리</div>
            </div>
          </div>
        </div>

        {/* Phase 6: StateDB.Commit() */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 6: StateDB.Commit()</h4>
          <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-2">dirtyAccounts를 순회하며 KVStore에 기록</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded bg-background p-2"><code className="text-xs">balanceDirty</code> → bank에 잔액 변경 적용</div>
              <div className="rounded bg-background p-2"><code className="text-xs">dirtyStorage</code> → <code className="text-xs">kvStore.Set(storageKey(addr, slot), val.Bytes())</code></div>
              <div className="rounded bg-background p-2"><code className="text-xs">codeDirty</code> → <code className="text-xs">kvStore.Set(codeKey(addr), obj.code)</code></div>
              <div className="rounded bg-background p-2"><code className="text-xs">suicided</code> → <code className="text-xs">destroyAccount(addr)</code> 잔액 소각 + 상태 삭제</div>
            </div>
          </div>
        </div>

        {/* Phase 7: Cosmos 메시지 디스패치 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 7: Cosmos 메시지 디스패치</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">큐잉된 메시지 실행</span>
              <p className="mt-1">EVM 커밋 후 <code className="text-xs">k.getQueuedMsgs(ctx)</code>로 프리컴파일이 큐잉한 Cosmos 메시지를 조회. 각 메시지를 해당 Cosmos MsgServer로 실행</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">콜백 + 실패 허용</span>
              <p className="mt-1"><code className="text-xs">CallbackID</code> 존재 + 성공 시 콜백 스케줄링. <code className="text-xs">AllowFailure = false</code>인 메시지 실패 시 <code className="text-xs">ErrCosmosDispatchFailed</code> 반환</p>
            </div>
          </div>
        </div>

        {/* Phase 8: Response & Events */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Phase 8: 응답 & 이벤트</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">이벤트 발행</span>
              <p className="mt-1"><code className="text-xs">EventManager().EmitEvents</code>로 <code className="text-xs">"evm_call"</code> 이벤트 발행 (sender, gas_used 속성). EVM 로그를 <code className="text-xs">logToEvent(log)</code>로 Cosmos 이벤트로 변환</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">응답</span>
              <p className="mt-1"><code className="text-xs">MsgCallResponse{'{Ret: ret, GasUsed: gasUsed}'}</code> 반환</p>
            </div>
          </div>
        </div>

        {/* Error & Observability */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">에러 처리 & 관측성</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">에러 시 롤백</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>StateDB 스냅샷 자동 복원</li>
                <li>KVStore에 변경 사항 미반영</li>
                <li>이벤트 발행 스킵</li>
                <li>sender는 사용한 가스만큼 여전히 차감</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">관측성</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>모든 EVM 액션에 Cosmos 이벤트</li>
                <li>EVM 로그가 이벤트에 내장</li>
                <li>debug RPC를 통한 트랜잭션 트레이스</li>
                <li>전체 가스 회계 노출</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
