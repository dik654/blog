import CodePanel from '@/components/ui/code-panel';
import {
  MEMORY_CODE, MEMORY_ANNOTATIONS,
  BUILTIN_CODE, BUILTIN_ANNOTATIONS,
} from './MemoryData';

export default function Memory({ title }: { title?: string }) {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '메모리 시스템 & 빌트인'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          S-two Cairo의 메모리 시스템은 증명 생성 효율을 위해 특별히 설계되었습니다.<br />
          이중 저장 시스템으로 작은 값과 큰 값을 분리 관리하며,
          빌트인 세그먼트는 SIMD 병렬 처리를 위해 2의 거듭제곱 크기로 패딩됩니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이중 저장 메모리 (Small / F252)</h3>
        <CodePanel title="Memory 구조체 & MemoryValue" code={MEMORY_CODE}
          annotations={MEMORY_ANNOTATIONS} />

        <h3>빌트인 세그먼트 시스템</h3>
        <CodePanel title="BuiltinSegments & 패딩" code={BUILTIN_CODE}
          annotations={BUILTIN_ANNOTATIONS} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cairo 메모리 모델과 빌트인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cairo Memory Model
//
// Key property: nondeterministic read-only memory
//
//   Memory is a function M: N → F_p
//   Once written, a cell is fixed for the execution
//   Cannot be overwritten
//   Prover picks M values satisfying all constraints
//
// Benefits:
//   Proofs simpler (no write-after-write)
//   Parallel execution easier
//   Consistent trace column structure
//
// Costs:
//   Data structures must append (no mutation)
//   Arrays become append-only
//   Dicts use "squash" pattern at end

// Memory segments:
//
//   Segment IDs are relocatable during proof:
//     segment 0: program code
//     segment 1: execution stack
//     segment 2: pedersen builtin
//     segment 3: range_check builtin
//     segment 4: ecdsa builtin
//     segment 5: bitwise builtin
//     segment 6: keccak builtin
//     segment 7: poseidon builtin
//     segment 8+: user data
//
//   Relocation happens at finalization:
//     Each segment's start computed
//     All (segment, offset) → absolute addr

// Dual-storage memory (Stwo Cairo):
//
//   Small values (fit in u32/u64):
//     Stored compactly
//     O(1) packing
//
//   Large values (full felt252):
//     Stored in dedicated F252 buffer
//     Tagged with pointer
//
//   Why split?
//     Most memory cells hold small ints (offsets, gas)
//     STARK columns much cheaper for u32 than felt252
//     2-3x memory savings typical

// Builtin semantics:
//
//   Builtins are specialized co-processors
//   Each one exposes a fixed "cell signature":
//     pedersen:     (x, y) → h(x, y)    (3 cells per op)
//     range_check:  x → checks x < 2^128 (1 cell per op)
//     ecdsa:        (pub_x, msg, r, s) → valid? (5 cells)
//     bitwise:      (x, y) → (x&y, x|y, x^y) (5 cells)
//     keccak:       input state → output state (16 cells in, 16 out)
//     poseidon:     (x, y, z) → permuted (3+3 cells)
//
//   Cairo compiler emits code that:
//     1. Writes inputs to builtin segment
//     2. Reads outputs assuming builtin "fills"
//     3. Prover provides outputs nondeterministically
//     4. Prover's AIR for builtin verifies correctness

// Padding to 2^k:
//
//   STARK requires trace length = 2^k
//   Builtin segments padded to 2^k * cell_count
//
//   Example:
//     39 pedersen invocations used
//     Next power of 2: 64
//     Padding: 25 dummy hashes (of zeros)
//
//   Cost: ~30-60% builtin segment waste typical
//   Proved anyway (prover still works on dummy cells)

// Gas accounting:
//
//   Each libfunc has hardcoded gas cost
//   Costs updated via Starknet governance
//
//   Typical costs:
//     felt252_add: 0
//     felt252_mul: 0
//     pedersen_hash: 32
//     poseidon_hash: 20
//     storage_read: 50
//     storage_write: 100
//     syscall overhead: 100
//
//   Accumulated via withdraw_gas libfunc
//   If gas exhausted: execution halts with GasExhausted

// AccessedCells counter (important for gas):
//
//   Each unique memory access = 1 cell
//   Pedersen hash = 3 memory accesses
//   Storage read = 3 memory + 50 gas overhead
//
// Why this matters:
//   Prover cost ~ linear in accessed cells
//   Gas pricing reflects this
//   Avoids DoS from pathological programs

// Reference implementation:
//   stwo-cairo/stwo_cairo_prover/src/memory/
//     memory.rs — Memory struct
//     builtins.rs — builtin segments
//     addr_to_id.rs — relocation table`}
        </pre>
      </div>
    </section>
  );
}
