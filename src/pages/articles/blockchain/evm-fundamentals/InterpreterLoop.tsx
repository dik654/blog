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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Pseudo-code for EVM Run() function

function Run(code: bytes, input: bytes, gas: u64) -> ExecutionResult {
    let mut stack = Stack::new();
    let mut memory = Memory::new();
    let mut pc = 0;
    let mut gas_remaining = gas;

    loop {
        // 1) FETCH
        if pc >= code.len() { break; }
        let opcode = code[pc];

        // 2) DECODE
        let op_info = OPCODE_TABLE[opcode];

        // 3) GAS CHECK
        let gas_cost = calculate_gas(opcode, &stack, &memory);
        if gas_remaining < gas_cost {
            return OutOfGas;
        }
        gas_remaining -= gas_cost;

        // 4) STACK CHECK
        if stack.len() < op_info.min_stack_items {
            return StackUnderflow;
        }
        if stack.len() + op_info.stack_change > 1024 {
            return StackOverflow;
        }

        // 5) EXECUTE
        match opcode {
            0x01 => {  // ADD
                let a = stack.pop()?;
                let b = stack.pop()?;
                stack.push(a + b)?;
            }
            0x50 => {  // POP
                stack.pop()?;
            }
            0x56 => {  // JUMP
                let dest = stack.pop()?;
                if code[dest] != 0x5B { return InvalidJump; }
                pc = dest;
                continue;  // skip pc++
            }
            // ... 140+ opcodes
            0x00 => return Stop,
            0xF3 => return Return(memory.read(...)),
            0xFD => return Revert(memory.read(...)),
        }

        // 6) ADVANCE PC
        pc += op_info.pc_increment;
    }

    return Halt;
}`}</pre>

      </div>
    </section>
  );
}
