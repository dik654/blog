import InterpreterLoopViz from './viz/InterpreterLoopViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function InterpreterLoop({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="interpreter-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터프리터 루프 (Run)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM.Run()이 바이트코드를 한 opcode씩 실행하는 핵심 루프
          <br />
          매 사이클: <strong>Fetch → Decode → Gas → Execute → pc++</strong>
        </p>
      </div>
      <div className="not-prose">
        <InterpreterLoopViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Interpreter Loop 구조</h3>
        <p className="text-sm text-muted-foreground mb-3">
          <code className="text-xs bg-muted px-1 py-0.5 rounded">Run(code, input, gas)</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">ExecutionResult</code> &mdash; 초기화 후 loop 진입
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">초기 상태</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">stack</code></p>
            <p className="text-sm text-muted-foreground">Stack::new()</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">memory</code></p>
            <p className="text-sm text-muted-foreground">Memory::new()</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">pc</code></p>
            <p className="text-sm text-muted-foreground">0</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">gas_remaining</code></p>
            <p className="text-sm text-muted-foreground">전달받은 gas</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">루프 단계 (매 사이클)</h4>
        <div className="grid grid-cols-1 gap-3 not-prose mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">1. FETCH</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">pc &gt;= code.len()</code>이면 루프 종료 &mdash; 아니면 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">opcode = code[pc]</code></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">2. DECODE</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">OPCODE_TABLE[opcode]</code>에서 실행 정보 조회</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">3. GAS CHECK</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">calculate_gas(opcode, &amp;stack, &amp;memory)</code> &mdash; 부족하면 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">OutOfGas</code> 반환</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">4. STACK CHECK</p>
            <p className="text-sm text-muted-foreground">스택 항목 부족 &rarr; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">StackUnderflow</code> / 깊이 1024 초과 &rarr; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">StackOverflow</code></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">5. EXECUTE</p>
            <p className="text-sm text-muted-foreground">opcode별 분기 실행 &mdash; 140+ opcodes</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-4">
            <p className="font-semibold text-sm mb-1">6. ADVANCE PC</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">pc += op_info.pc_increment</code></p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">EXECUTE 분기 예시</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">ADD</code> (0x01)</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">pop a, pop b, push(a+b)</code></p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">POP</code> (0x50)</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">stack.pop()</code></p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">JUMP</code> (0x56)</p>
            <p className="text-sm text-muted-foreground">dest pop &rarr; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">code[dest] != JUMPDEST</code>이면 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">InvalidJump</code>, 아니면 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">pc = dest</code></p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">종료 opcodes</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">STOP</code>(0x00), <code className="text-xs bg-background/50 px-1 py-0.5 rounded">RETURN</code>(0xF3), <code className="text-xs bg-background/50 px-1 py-0.5 rounded">REVERT</code>(0xFD)</p>
          </div>
        </div>

      </div>
    </section>
  );
}
