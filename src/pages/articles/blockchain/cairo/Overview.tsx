import CodePanel from '@/components/ui/code-panel';
import CairoPipelineViz from './viz/CairoPipelineViz';
import {
  PIPELINE_CODE, PIPELINE_ANNOTATIONS,
  TYPE_CODE, TYPE_ANNOTATIONS,
} from './OverviewData';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 컴파일 파이프라인'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Cairo</strong>는 StarkWare가 개발한 증명 가능한 프로그램(provable program)
          작성을 위한 언어입니다. Rust 스타일의 소유권 시스템과 felt252 기반 타입 시스템을 갖추며,
          Salsa 쿼리 DB 기반의 증분 컴파일 파이프라인을 통해 CASM으로 변환됩니다.
        </p>
      </div>

      <CairoPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>컴파일 파이프라인 (Database Group 기반)</h3>
        <CodePanel title="Salsa 쿼리 기반 컴파일 단계" code={PIPELINE_CODE}
          annotations={PIPELINE_ANNOTATIONS} />

        <h3>타입 시스템 & felt252</h3>
        <CodePanel title="Cairo 핵심 타입과 소유권" code={TYPE_CODE}
          annotations={TYPE_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cairo 언어 설계 철학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cairo: Provable Programming Language
//
// Goal:
//   Programs whose execution can be efficiently
//   proven using zk-STARKs.
//
// History:
//   Cairo 0 (2019):
//     Python-like syntax
//     Low-level, verbose
//     Direct to CASM
//
//   Cairo 1 (2023):
//     Rust-like syntax
//     Type system, ownership
//     Sierra IR layer added
//     Compiled via Salsa DB
//
//   Cairo 2 (2024):
//     Component-based contracts
//     Improved stdlib
//     Better error messages

// Core primitive: felt252
//
//   Field element in STARK prime field
//   p = 2^251 + 17 * 2^192 + 1
//   ~= 3.6 * 10^75
//
//   All computation lifted to felt252
//   u8, u16, u32, u64, u128, u256 wrap felt252
//   with runtime range checks
//
//   Why felt-first?
//     Native to STARK arithmetic
//     Addition/multiplication cheap in circuits
//     Branching/byte ops expensive

// Linear types (via Drop trait):
//
//   struct Array<T> { ... }
//
//   // By default, moving an Array consumes it
//   fn consume(arr: Array<u8>) { ... }
//
//   // Drop trait allows implicit destruction
//   impl ArrayDrop<T, +Drop<T>> of Drop<Array<T>>;
//
//   // Copy trait for value types
//   #[derive(Copy, Drop)]
//   struct Point { x: felt252, y: felt252 }

// Salsa-based incremental compilation:
//
//   Every computation is a query:
//     file_modules(file) → [modules]
//     module_items(mod) → [items]
//     item_semantic(item) → Semantic
//     function_sierra(fn) → SierraFunction
//     sierra_program() → Program
//
//   Salsa caches query results
//   Invalidates on input changes
//   IDE latency: <100ms for most edits
//
//   Similar to rust-analyzer architecture

// Compilation pipeline:
//
//   1. Parsing:
//      .cairo file → SyntaxGroup AST
//      Error-tolerant (IDE)
//
//   2. Semantic analysis:
//      Name resolution
//      Type inference
//      Trait resolution
//
//   3. Lowering:
//      Structured control flow → blocks
//      SSA-like form
//
//   4. Sierra generation:
//      Lowered MIR → Sierra
//      Safe IR guarantees
//
//   5. Sierra → CASM:
//      Sierra statements → CASM instructions
//      Register allocation for felt cells
//
//   6. Runnable output:
//      CASM program
//      Executed on Cairo VM
//      Trace used for STARK proof`}
        </pre>
      </div>
    </section>
  );
}
