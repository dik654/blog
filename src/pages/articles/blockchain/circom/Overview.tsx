import CompilerPipelineViz from './viz/CompilerPipelineViz';
import CodePanel from '@/components/ui/code-panel';

const CRATE_CODE = `circom/
 parser/           # LALRPOP 기반 .circom 파싱 → AST
 program_structure/ # Template, Signal, ProgramArchive
 type_analysis/     # 신호 타입 검증, 매개변수 추론
 constraint_generation/ # R1CS 제약 생성 핵심
 dag/               # DAG 기반 제약 최적화
 code_producers/    # .r1cs, .wasm, .sym, C++ 출력
 circom_algebra/    # 유한체 산술 연산
 constant_tracking/ # 상수 전파 최적화
 constraint_list/   # 제약 조건 리스트 관리
 constraint_writers/ # 제약 직렬화`;

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 컴파일 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <CompilerPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Circom</strong>은 zkSNARK 증명 시스템을 위한 산술 회로를 정의하는
          도메인 특화 언어(DSL)입니다. <code>.circom</code> 소스를 파싱하여
          R1CS 제약 조건과 WASM 증인 계산기를 생성하고,
          snarkjs/rapidSnark와 연동하여 증명을 생성합니다.
        </p>
        <CodePanel
          title="circom 컴파일러 크레이트 구조"
          code={CRATE_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '프론트엔드 (파싱 + AST)' },
            { lines: [5, 6], color: 'emerald', note: '제약 생성 핵심' },
            { lines: [7, 8], color: 'amber', note: '최적화 + 출력' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Circom 언어 생태계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Circom Language & Ecosystem
//
// History:
//   2019: iden3 releases Circom 1 (C++ implementation)
//   2022: Circom 2 (Rust rewrite, major overhaul)
//   Today: Circom 2.2.x (stable)
//
// Maintainer: iden3 (Barcelona-based identity/ZK team)
// License: GPL-3.0
// Repo: github.com/iden3/circom

// Key design principles:
//
//   1. Circuit-as-code:
//      Programmer writes circuits like functions
//      Compiler emits R1CS constraints
//
//   2. Non-deterministic computation:
//      <-- assigns value without adding constraint
//      <== assigns value AND adds constraint
//      === adds constraint only (no assignment)
//
//   3. Finite field arithmetic:
//      All math in F_p (default: bn128 scalar field)
//      p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
//
//   4. Explicit witness generation:
//      Compiler emits WASM/C++ witness calculator
//      Runs natively, no circuit constraints
//      Much faster than evaluating constraints

// File types produced:
//
//   .r1cs:
//     Binary R1CS constraint system
//     Used by snarkjs/rapidSnark for proving
//
//   .wasm:
//     WebAssembly witness calculator
//     Runs program, computes all signal values
//
//   .sym:
//     Symbol table (signal names ↔ indices)
//     Useful for debugging
//
//   .cpp:
//     C++ witness calculator (native, faster)
//     Compile with build script for production

// Typical workflow:
//
//   1. Write circuit.circom
//   2. circom circuit.circom --r1cs --wasm --sym
//   3. Feed R1CS to Groth16 / PLONK / ...
//   4. Run WASM on inputs → witness
//   5. Generate proof with witness + proving key
//   6. Verify proof with verification key

// Core Circom constructs:
//
//   signal: wire in the arithmetic circuit
//   template: reusable circuit block (like a class)
//   component: instantiation of a template
//   var: compile-time variable (not a signal!)
//   <==: constrain + assign
//   <--: assign only (non-deterministic)
//   ===: constrain only

// Variable vs Signal distinction:
//
//   var x = 5;
//     → compile-time constant
//     → no constraint generated
//     → disappears from R1CS
//
//   signal x;
//     → runtime signal
//     → participates in constraints
//     → visible in R1CS

// Standard library (circomlib):
//
//   github.com/iden3/circomlib (200+ templates):
//
//   Hash functions:
//     Poseidon, Pedersen, MiMC, Sha256
//   Signatures:
//     EdDSA (Baby Jubjub), ECDSA
//   Merkle trees:
//     binary, sparse, LEAN trees
//   Primitive gadgets:
//     AliasCheck, Num2Bits, Bits2Num
//     LessThan, GreaterThan, IsEqual
//     MultiMux, Switcher
//   Cryptographic helpers:
//     AES, SMT proof, Babyjubjub ops

// Production projects built with Circom:
//
//   Tornado Cash (mixer, 2019)
//   Semaphore (anonymous signaling)
//   MACI (minimum anti-collusion)
//   Hermez Network (zkRollup)
//   Iden3 (self-sovereign identity)
//   RollupNC
//   Dark Forest (zkSNARK game)

// Limitations:
//
//   No native bitwise ops (must Num2Bits first)
//   No strings or bytes
//   All values in F_p (overflow risky!)
//   Tooling weaker than Rust/Go
//   Signal indexing: O(n log n) worst case`}
        </pre>
      </div>
    </section>
  );
}
