import JITCompileViz from './viz/JITCompileViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function NativeCompilation({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="native-compilation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VM 네이티브 컴파일 (JIT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          asmjit로 EVM 바이트코드 → x86-64 네이티브 변환<br />
          인터프리터 대비 2.01배, evmone 대비 1.57배. 첫 실행은 인터프리터, 이후 캐시
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-jit-compile', codeRefs['monad-jit-compile'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              jit_compiler.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <JITCompileViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">JIT Compilation 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EVM JIT Compilation
//
// EVM Bytecode → x86-64 Native
//
// Compilation Pipeline:
//
//   1. Parse EVM bytecode
//      256-bit stack machine ops
//      ADD, PUSH, MLOAD, SSTORE, etc.
//
//   2. Intermediate Representation
//      Basic blocks
//      Control flow graph
//      Stack depth tracking
//
//   3. Optimization passes
//      Dead code elimination
//      Constant folding
//      Stack → register allocation
//      Inline simple opcodes
//
//   4. Code generation (asmjit)
//      Generate x86-64 assembly
//      Register allocation
//      Function calling convention
//
//   5. Machine code execution
//      Direct CPU execution
//      No interpreter overhead

// Optimizations:
//
//   Stack Operations:
//     EVM: push/pop 256-bit values
//     JIT: CPU registers (x86 XMM)
//     → 10x faster
//
//   Arithmetic:
//     EVM: 256-bit add via library
//     JIT: 4x 64-bit adds + carry
//     → Vectorizable
//
//   Memory Access:
//     EVM: allocate byte arrays
//     JIT: stack-allocated buffers
//     → No malloc per op
//
//   Branch Prediction:
//     Hot path optimization
//     Inlining small functions
//     Loop unrolling

// Bytecode Cache:
//
//   First execution: interpreter (warm up)
//   Compile in background (thread pool)
//   Subsequent: use compiled native code
//
//   Cache key: bytecode hash
//   Cache eviction: LRU
//   Invalidation: code never changes (immutable)

// Performance Results (Monad benchmarks):
//   Simple transfer: 2.01x speedup
//   Complex contract: 1.5-3x speedup
//   vs evmone (also fast): 1.57x

// vs Other EVMs:
//
//   go-ethereum:
//     Interpreter in Go
//     Slowest baseline
//
//   reth/erigon:
//     Interpreter in Rust
//     Optimized but not JIT
//
//   evmone:
//     C++ interpreter
//     Most optimized non-JIT
//
//   Monad JIT:
//     Native code execution
//     Fastest current

// Alternatives:
//   - AOT compilation (ahead of time)
//   - Interpreter with SIMD
//   - Hardware accel (RISC-V ZkEVM)`}
        </pre>
      </div>
    </section>
  );
}
