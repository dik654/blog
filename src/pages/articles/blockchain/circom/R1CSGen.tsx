import R1CSGenViz from './viz/R1CSGenViz';
import CodePanel from '@/components/ui/code-panel';

const BUILD_CODE = `pub fn build_circuit(
  program: ProgramArchive,
  config: BuildConfig
) -> BuildRes {
  // 1. 인스턴스화: 템플릿 → 컴포넌트
  let (exe, warnings) = instantiation(
    &program, flags, &config.prime
  )?;

  // 2. 내보내기: ExecutedProgram → DAG + VCP
  let (dag, vcp, warnings) = export(
    exe, program, flags
  )?;

  // 3. 최적화: DAG 기반 제약 단순화
  if config.flag_f {
    sync_dag_and_vcp(&mut vcp, &mut dag);
  } else {
    simplification_process(&mut vcp, dag, &config);
  }
}`;

export default function R1CSGen({ title }: { title?: string }) {
  return (
    <section id="r1cs-gen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'R1CS 제약 생성'}</h2>
      <div className="not-prose mb-8">
        <R1CSGenViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>constraint_generation</code> 모듈은 Circom 컴파일러의 핵심입니다.<br />
          파싱된 AST를 실제 R1CS(Rank-1 Constraint System) 제약으로 변환하며,
          DAG 기반 최적화로 불필요한 제약을 제거합니다.
        </p>
        <CodePanel
          title="build_circuit — 제약 생성 진입점"
          code={BUILD_CODE}
          annotations={[
            { lines: [5, 8], color: 'sky', note: '템플릿 인스턴스화 (재귀적)' },
            { lines: [11, 14], color: 'emerald', note: 'DAG + VCP 구조로 변환' },
            { lines: [17, 21], color: 'amber', note: 'DAG 기반 제약 최적화' },
          ]}
        />
        <h3>R1CS 제약 형식</h3>
        <p>
          모든 제약은 <strong>A * B = C</strong> 형태입니다.
          <code>{'c <== a * b'}</code>는 단일 R1CS 제약으로 변환되지만,
          <code>{'c <== a * b + d'}</code>는 중간 시그널을 추가하여 두 개의 제약으로 분해됩니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">제약 생성 파이프라인 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Circom → R1CS Compilation Pipeline
//
// Architecture:
//
//   .circom source
//     ↓ LALRPOP parser
//   AST (program_structure)
//     ↓ Type analysis
//   Typed AST
//     ↓ Instantiation (recursive unrolling)
//   Executed program (concrete templates)
//     ↓ DAG construction
//   Constraint DAG + Variable CP
//     ↓ Simplification
//   Optimized DAG
//     ↓ Serialization
//   .r1cs binary file

// 1) Parsing:
//
//   LALRPOP: LR(1) parser generator
//   Produces AST node types:
//     Template, Function, Component
//     Statement (IfThenElse, While, Block, ...)
//     Expression (Variable, Number, Call, ...)

// 2) Type analysis:
//
//   Infers signal types
//   Checks parameter counts
//   Validates signal vs var usage
//   Detects dimensional mismatches

// 3) Instantiation:
//
//   Unrolls all loops (static bounds required)
//   Instantiates templates with concrete parameters
//   Each component becomes fully expanded
//
//   template Multiplier(n) {
//     signal input in[n];
//     signal output out;
//     ...
//   }
//
//   component main = Multiplier(3);
//   → unrolls to fully concrete 3-input circuit

// 4) DAG construction:
//
//   Each constraint represented as:
//     A: linear combination of signals
//     B: linear combination of signals
//     C: linear combination of signals
//     meaning: <A, s> * <B, s> = <C, s>
//
//   Signals are nodes
//   Constraints are hyper-edges (3 signal sets)
//
//   Why DAG?
//     Enables efficient simplification
//     Detects redundant constraints
//     Allows linear combination merging

// 5) Simplification (optimization):
//
//   Pass A: remove unused signals
//     Delete signals not feeding any output
//
//   Pass B: linear constraint elimination
//     If x = sum(k_i * s_i), substitute x everywhere
//     Eliminates intermediate signals
//
//   Pass C: detect always-true constraints
//     0 = 0 removed
//     Constants propagated
//
//   Pass D: custom gate recognition (advanced)
//     Groups constraints into templates

// 6) Serialization:
//
//   .r1cs binary format (iden3/r1csfile spec):
//     Header: field prime, constraint count, signal count
//     Constraint section: for each constraint, 3 linear combos
//     Map section: signal index → label string
//
//   .sym: witness calculator debug info
//   .json (optional): human-readable constraints

// Constraint generation rules:
//
//   c <== a * b
//     → 1 R1CS constraint: a * b = c
//
//   c <== a + b
//     → 1 LINEAR constraint
//        a + b - c = 0 (all in A column, B = 1)
//     → Actually ZERO R1CS (can be absorbed)
//
//   c <== (a + b) * (d + e)
//     → 1 R1CS:
//        A = a + b, B = d + e, C = c
//
//   c <== a * b + d
//     → 2 R1CS:
//        aux = a * b  (A=a, B=b, C=aux)
//        c = aux + d  (linear, absorbed)
//
//   c <== a * b * d  (TRIPLE mult)
//     → 2 R1CS:
//        aux = a * b
//        c = aux * d

// Linear constraint optimization:
//
//   Circom tracks "linear combinations" as first-class:
//     LC = { s1: k1, s2: k2, ... }
//     meaning: sum(k_i * s_i)
//
//   When possible, LCs merged into A or B columns
//   Reduces R1CS constraint count by ~30-50%

// DAG optimization example:
//
//   Input (4 signals):
//     signal a, b, c, d;
//     d === a + b + c
//     c === 2 * b
//
//   DAG sees:
//     c is linear in b
//     d is linear in (a, b, c) = linear in (a, b)
//
//   Optimization: eliminate c
//     d = a + b + 2b = a + 3b
//
//   Final: 1 constraint (d = a + 3b) vs 2 original

// Real-world numbers:
//
//   Semaphore v4 (identity proof):
//     Raw constraints: ~12,000
//     After optimization: ~8,500
//     ~30% reduction
//
//   Tornado Cash:
//     Merkle proof depth 20
//     Raw: ~24,000 constraints
//     Optimized: ~12,000
//     50% reduction

// Build configuration flags:
//
//   --O0: no optimization (fast compile)
//   --O1: basic optimization (default)
//   --O2: full simplification (slow, smaller R1CS)
//   -f (--fast): skip some optimizations`}
        </pre>
      </div>
    </section>
  );
}
