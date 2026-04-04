import SP1ProofPipelineViz from '../components/SP1ProofPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import { EXECUTOR_CODE, EXEC_MODES, INSTRUCTION_CODE, SYSCALL_CODE } from './ExecutionData';
import { executorAnnotations, instructionAnnotations, syscallAnnotations } from './ExecutionAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Execution({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core Executor &amp; 실행 모드</h2>
      <div className="not-prose mb-8"><SP1ProofPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1 Core Executor는 RISC-V ELF를 로드해 명령어를 순차 실행하고
          증명 생성에 필요한 ExecutionTrace를 생성합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('vm-struct', codeRefs['vm-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">CoreVM 구조체</span>
          <CodeViewButton onClick={() => onCodeRef('vm-advance', codeRefs['vm-advance'])} />
          <span className="text-[10px] text-muted-foreground self-center">advance() 사이클</span>
          <CodeViewButton onClick={() => onCodeRef('opcode-enum', codeRefs['opcode-enum'])} />
          <span className="text-[10px] text-muted-foreground self-center">Opcode 열거형</span>
        </div>
        <CodePanel title="Executor 구조체" code={EXECUTOR_CODE} annotations={executorAnnotations} />
        <h3>실행 모드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {EXEC_MODES.map(m => (
            <div key={m.name} className="rounded-lg border border-border/60 p-3">
              <p className="font-mono font-bold text-sm text-indigo-400">{m.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{m.desc}</p>
            </div>
          ))}
        </div>
        <CodePanel title="명령어 실행 사이클" code={INSTRUCTION_CODE} annotations={instructionAnnotations} />
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('vm-alu', codeRefs['vm-alu'])} />
          <span className="text-[10px] text-muted-foreground self-center">ALU 연산 실행</span>
          <CodeViewButton onClick={() => onCodeRef('vm-ecall', codeRefs['vm-ecall'])} />
          <span className="text-[10px] text-muted-foreground self-center">ECALL 시스템 콜</span>
        </div>
        <p>
          SP1은 SHA256, keccak256, secp256k1, ed25519 등 암호화 연산을
          ECALL 시스템 콜로 가속합니다. 일반 Rust 코드로 이 함수들을 호출하면
          SP1이 자동으로 최적화된 zkVM 프리컴파일로 대체합니다.
        </p>
        <CodePanel title="시스템 콜 (Precompile)" code={SYSCALL_CODE} annotations={syscallAnnotations} />
      </div>
    </section>
  );
}
