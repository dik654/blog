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
    </section>
  );
}
