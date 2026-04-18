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

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 실행 단계별 상세</h3>

        {/* MsgCall 메시지 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">MsgCall 메시지 구조</h4>
          <p className="text-xs text-muted-foreground mb-2">진입점: <code className="text-xs">sdk.Handler</code> (Cosmos Msg handler)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">Sender string</code> — bech32 Cosmos 주소</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">To string</code> — hex EVM 주소 (CREATE 시 빈 값)</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">Value sdk.Int</code> — 네이티브 밸류 (uinit)</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">Input []byte</code> — ABI 인코딩 콜 데이터</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">GasLimit uint64</code> — EVM 가스 한도</div>
            <div className="rounded bg-muted/50 p-2"><code className="text-xs">GasPrice sdk.Int</code> — 단위당 수수료</div>
          </div>
        </div>

        {/* Step 1: Message routing */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 1: 메시지 라우팅</h4>
          <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>Cosmos TX가 <code className="text-xs">MsgServer</code>로 진입. <code className="text-xs">Keeper.Call(ctx, msg *MsgCall)</code>에서 sender를 <code className="text-xs">sdk.MustAccAddressFromBech32</code>로 파싱하고, <code className="text-xs">cosmosToEVMAddr(sender)</code>로 EVM 주소 변환 후 <code className="text-xs">k.executeCall(ctx, evmAddr, msg)</code> 호출</p>
          </div>
        </div>

        {/* Step 2: AnteHandler */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 2: AnteHandler (Cosmos 레벨 검증)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">EVM 실행 전 검증</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>서명 검증</li>
                <li>계정 존재 + 시퀀스 확인</li>
                <li>Cosmos 레벨 수수료 차감 (<code className="text-xs">gas * gasPrice</code>)</li>
                <li>시퀀스(논스) 증가</li>
              </ul>
            </div>
            <div className="rounded border-l-2 border-amber-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">주의: 이중 가스 구조</span>
              <p className="mt-1">EVM 내부 가스 추적은 별도. Cosmos가 수수료를 징수하고, EVM은 <code className="text-xs">gasLimit</code> 내에서 실행</p>
            </div>
          </div>
        </div>

        {/* Step 3: StateDB adapter */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 3: StateDB 어댑터 생성</h4>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <p><code className="text-xs">NewStateDB(ctx, k.storeKey, k.bankKeeper, k.authKeeper)</code> — Cosmos KVStore를 go-ethereum <code className="text-xs">StateDB</code> 인터페이스로 래핑. 잔액, 논스, 스토리지, 코드를 추적하고 스냅샷을 통한 롤백 지원</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-muted/50 p-2"><code className="text-xs">GetBalance(addr)</code> → bank keeper</div>
              <div className="rounded bg-muted/50 p-2"><code className="text-xs">GetCode(addr)</code> → KVStore</div>
              <div className="rounded bg-muted/50 p-2"><code className="text-xs">GetState(addr, k)</code> → KVStore storage</div>
              <div className="rounded bg-muted/50 p-2"><code className="text-xs">SetState(addr, k, v)</code> → 커밋 대기</div>
            </div>
          </div>
        </div>

        {/* Step 4: EVM setup */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 4: EVM 셋업</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">BlockContext</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">CanTransfer</code>, <code className="text-xs">Transfer</code>, <code className="text-xs">GetHash</code> — 전송/해시 함수</li>
                <li><code className="text-xs">Coinbase</code> — 검증자 보상 주소</li>
                <li><code className="text-xs">BlockNumber</code> ← <code className="text-xs">ctx.BlockHeight()</code></li>
                <li><code className="text-xs">Time</code> ← <code className="text-xs">ctx.BlockTime().Unix()</code></li>
                <li><code className="text-xs">Difficulty = 0</code> (PoS, PoW 없음)</li>
                <li><code className="text-xs">BaseFee = 0</code> (또는 x/feemarket)</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">TxContext + EVM 생성</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">Origin</code> ← <code className="text-xs">evmAddr</code> (발신자)</li>
                <li><code className="text-xs">GasPrice</code> ← 메시지의 가스 가격</li>
              </ul>
              <p className="mt-2"><code className="text-xs">vm.NewEVM(blockCtx, txCtx, stateDB, chainConfig, vmConfig)</code> — go-ethereum EVM 인터프리터를 직접 사용</p>
            </div>
          </div>
        </div>

        {/* Step 5: Execution */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 5: EVM 실행</h4>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <p><code className="text-xs">evm.Call(vm.AccountRef(evmAddr), toAddr, input, gasLimit, value)</code> → <code className="text-xs">(ret []byte, leftoverGas uint64, err error)</code></p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="rounded bg-muted/50 p-2">StateDB에서 바이트코드 로드</div>
              <div className="rounded bg-muted/50 p-2">opcode 실행 (ADD, MUL, SSTORE, SLOAD ...)</div>
              <div className="rounded bg-muted/50 p-2">내부 CALL, DELEGATECALL, CREATE 처리</div>
              <div className="rounded bg-muted/50 p-2">opcode별 가스 차감</div>
              <div className="rounded bg-muted/50 p-2">리펀드 추적 (SELFDESTRUCT, SSTORE revert)</div>
            </div>
          </div>
        </div>

        {/* Step 6-7: Commit & Response */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Step 6-7: 상태 커밋 & 응답</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">커밋</span>
              <p className="mt-1">실패 시 <code className="text-xs">stateDB.RevertToSnapshot(0)</code>으로 전체 롤백. 성공 시 <code className="text-xs">stateDB.Commit()</code>으로 모든 변경을 Cosmos KVStore에 기록하고 EVM 로그를 Cosmos 이벤트로 변환</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">응답</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">Ret []byte</code> — 반환 데이터</li>
                <li><code className="text-xs">GasUsed = gasLimit - leftoverGas</code></li>
                <li><code className="text-xs">Logs</code> — <code className="text-xs">stateDB.Logs()</code></li>
              </ul>
              <p className="mt-1">Cosmos SDK가 <code className="text-xs">TxResult</code>로 래핑, 블록에 포함 후 노드에서 인덱싱</p>
            </div>
          </div>
        </div>

        {/* Gas Accounting */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">가스 회계</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">이중 가스 미터</span>
              <p className="mt-1">Cosmos GasMeter: 블록 레벨 가스 추적. EVM gas: opcode별 EVM 가스 추적</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">조정</span>
              <p className="mt-1">EVM gasUsed를 Cosmos gas로 환산 (설정 가능한 비율, 일반적으로 1:1)</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">리펀드</span>
              <p className="mt-1">SSTORE revert, SELFDESTRUCT의 EVM 리펀드. <code className="text-xs">max(gasUsed/5, reducedGas)</code>까지 환불 가능 (EIP-3529 London 규칙)</p>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">에러 처리</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><span className="font-medium text-foreground">Out of gas</span> — 전체 상태 변경 롤백</div>
            <div className="rounded bg-muted/50 p-2"><span className="font-medium text-foreground">Invalid opcode</span> — 롤백</div>
            <div className="rounded bg-muted/50 p-2"><span className="font-medium text-foreground">REVERT opcode</span> — 롤백 + 에러 메시지</div>
            <div className="rounded bg-muted/50 p-2"><span className="font-medium text-foreground">Panic / 시스템 에러</span> — 롤백 + 디버그 로그</div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">모든 에러는 StateDB 스냅샷으로 처리. Cosmos Msg는 표준 에러 코드를 반환</p>
        </div>
      </div>
    </section>
  );
}
