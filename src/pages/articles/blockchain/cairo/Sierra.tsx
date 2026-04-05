import CodePanel from '@/components/ui/code-panel';
import SierraTypeViz from './viz/SierraTypeViz';
import {
  SIERRA_CODE, SIERRA_ANNOTATIONS,
  LIBFUNC_CODE, LIBFUNC_ANNOTATIONS,
} from './SierraData';

export default function Sierra({ title }: { title?: string }) {
  return (
    <section id="sierra" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sierra 중간표현 (Safe IR)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Sierra</strong>(Safe Intermediate Representation for Rust-like Assembly)는
          Cairo와 CASM 사이의 중간 표현입니다. 구조적 안전성을 보장하면서
          효율적인 컴파일을 가능하게 하는 핵심 역할을 담당합니다.
        </p>
      </div>

      <SierraTypeViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Sierra 프로그램 구조</h3>
        <CodePanel title="Program 구조체" code={SIERRA_CODE}
          annotations={SIERRA_ANNOTATIONS} />

        <h3>라이브러리 함수 계층 (CoreLibfunc)</h3>
        <CodePanel title="define_libfunc_hierarchy!" code={LIBFUNC_CODE}
          annotations={LIBFUNC_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Sierra 안전성 보장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sierra IR Safety Properties
//
// Key invariant:
//   "Provable sound CASM output"
//
//   Sierra is designed so that ANY valid Sierra
//   program compiles to CASM that ALWAYS produces
//   a valid proof, even if runtime panics.

// Why this matters:
//   Pre-Sierra Cairo (Cairo 0):
//     Compiler could emit CASM that failed mid-execution
//     → unprovable execution trace
//     → denial-of-service vector
//
//   Sierra:
//     Statically prevents this
//     All panics are graceful (return failure branch)
//     Always produces provable trace

// Sierra program structure:
//
//   struct Program {
//     type_declarations: Vec<TypeDeclaration>,
//     libfunc_declarations: Vec<LibfuncDeclaration>,
//     statements: Vec<Statement>,
//     funcs: Vec<Function>,
//   }
//
// Statement forms:
//   Invocation {
//     libfunc_id: LibfuncId,
//     args: Vec<VarId>,
//     branches: Vec<BranchInfo>,
//   }
//   Return { args: Vec<VarId> }

// Libfunc categories (CoreLibfunc enum):
//
//   ApTracking:
//     Manage allocation pointer (ap) offsets
//     Essential for CASM register allocation
//
//   Felt252:
//     add, mul, sub, div
//     const_as_immediate
//
//   Uint32 / Uint64 / Uint128:
//     Arithmetic with range checks
//     overflowing_add, safe_divmod
//
//   Array:
//     new, append, pop_front, len
//     Span operations
//
//   Struct / Enum:
//     construct, deconstruct
//     match (branch on variant)
//
//   Gas:
//     withdraw_gas
//     get_builtin_costs
//     → enforces gas metering at libfunc level
//
//   Storage (Starknet only):
//     storage_read / storage_write
//     storage_base_address_const
//
//   Ec (elliptic curve):
//     ec_point_from_x
//     ec_op, ec_mul

// Branching model:
//
//   Every libfunc has BranchInfo
//   Typical: success + failure branches
//
//   Example: felt252_is_zero
//     branch 0 (Zero): continues with ()
//     branch 1 (NonZero): continues with NonZero<felt252>
//
//   Example: withdraw_gas
//     branch 0 (Success): Gas remains > 0
//     branch 1 (Failure): Not enough gas, halt
//
//   No exceptions — everything is explicit branches

// Type system features:
//
//   Generic types:
//     Array<felt252>, Array<u32>, Array<Point>
//
//   Wrapper types:
//     NonZero<T>: runtime checked, removes div-by-zero
//     Bounded<T>: range-constrained
//     Nullable<T>: optional reference
//
//   Zero-sized types:
//     Unit (())
//     Phantom markers
//
//   Reference types (post Cairo 2):
//     Snapshot<T>: immutable ref
//     @T: read-only borrow

// Compilation guarantees:
//
//   1. Type safety:
//      No implicit conversions
//      All ops typed
//
//   2. Memory safety:
//      Write-once memory model inherited
//      Every cell assigned once
//
//   3. Gas safety:
//      Pre-computed gas costs per libfunc
//      Starknet enforces gas limits
//
//   4. Determinism:
//      No non-deterministic ops
//      Provable execution always

// Sierra → CASM mapping:
//
//   Each libfunc → concrete CASM snippet
//   Snippet pre-audited for correctness
//
//   Example:
//     felt252_add(a, b) → [ap] = a + b; ap++
//     u32_overflowing_add(a, b) →
//       range_check + conditional jumps

// Real-world Sierra use:
//   Every Starknet contract = Sierra
//   Starknet sequencer stores Sierra
//   Client downloads + runs CASM
//   STARK proves CASM trace
//   L1 verifies STARK
//
//   Sierra is the "safe universal IR" for Starknet`}
        </pre>
      </div>
    </section>
  );
}
