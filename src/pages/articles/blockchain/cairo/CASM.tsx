import CodePanel from '@/components/ui/code-panel';
import CASMMapViz from './viz/CASMMapViz';
import {
  CASM_CODE, CASM_ANNOTATIONS,
  MAPPING_CODE, MAPPING_ANNOTATIONS,
} from './CASMData';

export default function CASM({ title }: { title?: string }) {
  return (
    <section id="casm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CASM 생성 & 레지스터 모델'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>CASM</strong>(Cairo Assembly) 생성은 컴파일 파이프라인의 마지막 단계로,
          Sierra 중간표현을 Cairo VM에서 실행 가능한 저수준 어셈블리 명령어로 매핑합니다.
          <code>cairo-lang-sierra-to-casm</code> crate가 이를 담당합니다.
        </p>
      </div>

      <CASMMapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>compile() — CASM 생성 메인 루프</h3>
        <CodePanel title="Sierra → CASM 컴파일 과정" code={CASM_CODE}
          annotations={CASM_ANNOTATIONS} />

        <h3>매핑 규칙 & 레지스터 모델</h3>
        <CodePanel title="Sierra→CASM 매핑 & 최적화" code={MAPPING_CODE}
          annotations={MAPPING_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CASM 실행 모델</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cairo Assembly (CASM) Execution
//
// CPU registers:
//   pc (program counter) — instruction pointer
//   ap (allocation pointer) — next free memory cell
//   fp (frame pointer) — current call frame base
//
// Memory model:
//   Write-once (immutable after write)
//   Addressable by integer offset
//   No mutation means no write-after-write hazards
//   Makes proving much simpler

// Instruction format (3-operand):
//
//   Each instruction:
//     dst op0 res_op op1 pc_update ap_update opcode
//
//   Most common:
//     [ap] = [ap-2] + [ap-1]; ap++
//     [ap] = [fp+3]; ap++
//     jmp rel 5

// Core operations:
//
//   1) assert_eq (universal):
//      [ap] = something; ap++
//      Creates a memory cell with constraint
//
//   2) jmp (relative/absolute):
//      jmp rel N          — pc += N
//      jmp abs addr       — pc = addr
//      jmp rel N if [ap-1] != 0  — conditional
//
//   3) call / ret:
//      call rel N: push (pc, fp), pc += N, fp = ap
//      ret: pc, fp = *fp, *(fp+1)
//
//   4) hint (off-circuit):
//      %{ ... python code ... %}
//      Doesn't appear in trace
//      Provides non-deterministic inputs
//      Verifier reconstructs from trace

// Example: if/else compilation:
//
//   Sierra:
//     match val {
//       0 => do_zero(),
//       _ => do_other(),
//     }
//
//   CASM:
//     %{ memory[ap] = val %}       # hint
//     [ap] = [ap] + 0; ap++         # dummy alloc
//     jmp rel <other_branch> if [ap-1] != 0
//     # zero_branch:
//     call rel <do_zero>
//     jmp rel <end>
//     # other_branch:
//     call rel <do_other>
//     # end:

// Cairo VM execution:
//
//   1. Load program → memory segment 0
//   2. Initialize: pc = entry_point, ap = end_of_code
//   3. Loop:
//      read instruction at [pc]
//      decode operands
//      compute result
//      write to memory (append-only)
//      update pc, ap, fp per instruction flags
//   4. Stop when pc = final_pc

// Trace generation:
//
//   For each step:
//     record (pc, ap, fp) triple
//     record memory accesses
//
//   Trace columns:
//     pc[], ap[], fp[]
//     mem_addr[], mem_value[]
//     instruction[], operands[]
//
//   Trace length = 2^k (padded for STARK)

// Optimizations in CASM generator:
//
//   1) ap tracking:
//      Compiler tracks ap offsets statically
//      Can use [ap-k] instead of [fp+k]
//      Reduces pointer indirection
//
//   2) Constant folding:
//      const 3 + const 5 → immediate 8
//      Saves memory cells
//
//   3) Common subexpression elimination:
//      Same felt computation reused
//
//   4) Tail call optimization:
//      return x(y) → jmp to x instead of call/ret
//
//   5) Inline small functions:
//      Reduces call overhead
//      At cost of code size

// Memory segments:
//
//   Segment 0: Program (instructions)
//   Segment 1: Execution (runtime data)
//   Segment 2+: Builtins
//     pedersen, range_check, ecdsa, bitwise, keccak, poseidon
//
// Each builtin segment has fixed cell structure
// Allows vectorized proof generation

// Performance:
//   Cairo VM: ~20K steps/sec (Rust)
//   Stwo prover: proves millions of steps/sec
//   Key bottleneck: prover, not VM execution`}
        </pre>
      </div>
    </section>
  );
}
