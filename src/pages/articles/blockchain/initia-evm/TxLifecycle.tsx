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
    </section>
  );
}
