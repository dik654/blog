import TemplateSignalViz from './viz/TemplateSignalViz';
import CodePanel from '@/components/ui/code-panel';

const TEMPLATE_CODE = `// Circom 템플릿 정의
template Multiplier2() {
    signal input a;       // 입력 신호
    signal input b;       // 입력 신호
    signal output c;      // 출력 신호

    c <== a * b;          // 제약 + 대입 동시
}

// 컴포넌트 인스턴스화
component main = Multiplier2();`;

const SIGNAL_CODE = `// 신호 타입 3종
signal input  x;    // 외부에서 주입 (public/private)
signal output y;    // 외부로 노출
signal        z;    // 중간 계산용 (intermediate)

// 배열 신호
signal input in[4];
signal output out[2];

// 태그로 public/private 구분
component main {public [a]} = Circuit();`;

export default function TemplateSignal({ title }: { title?: string }) {
  return (
    <section id="template-signal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '템플릿 & 시그널'}</h2>
      <div className="not-prose mb-8">
        <TemplateSignalViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circom의 핵심 추상화는 <strong>템플릿(Template)</strong>과 <strong>시그널(Signal)</strong>입니다.<br />
          템플릿은 재사용 가능한 회로 블록이고, 시그널은 유한체 위의 값을 나타냅니다.
          <code>{'<=='}</code> 연산자는 제약 생성과 값 대입을 동시에 수행합니다.
        </p>
        <CodePanel
          title="템플릿 & 컴포넌트 기본 구조"
          code={TEMPLATE_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'Input/Output 시그널 선언' },
            { lines: [7, 7], color: 'emerald', note: '<== : 제약 + 대입 동시' },
            { lines: [11, 11], color: 'amber', note: 'main 컴포넌트 인스턴스화' },
          ]}
        />
        <CodePanel
          title="신호 타입 & 가시성"
          code={SIGNAL_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: '3가지 신호 타입' },
            { lines: [7, 8], color: 'emerald', note: '배열 신호 지원' },
            { lines: [11, 11], color: 'amber', note: 'public 태그로 공개 입력 지정' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Template & Signal 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Circom Templates and Signals — Deep Dive
//
// Template vs Function (Circom):
//
//   Template:
//     Generates R1CS constraints
//     Can use signals
//     Instantiated via 'component'
//     Reusable circuit pattern
//
//   Function:
//     Pure computation at compile time
//     Cannot use signals (only vars)
//     Called directly
//     Used for parameters, loop bounds

// Template example:
//
//   template Bits2Num(n) {
//       signal input in[n];
//       signal output out;
//
//       var lc = 0;
//       var e2 = 1;
//       for (var i = 0; i < n; i++) {
//           lc += in[i] * e2;
//           e2 = e2 + e2;
//       }
//       out <== lc;
//   }
//
//   component main = Bits2Num(8);

// Signal types:
//
//   signal input x;
//     External value provided by prover
//     Part of witness
//
//   signal input {public} x;
//     Made public via main component declaration
//     Verified on-chain
//
//   signal output y;
//     Computed by circuit
//     Can be referenced by parent component
//     Often becomes public for parent
//
//   signal z;
//     Intermediate (internal) signal
//     Used for computation
//     Not visible outside

// Signal declaration with tags:
//
//   signal input {binary} bit;
//     Tag: adds implicit boolean constraint
//   signal input {range_4} small;
//     Tag: adds range check to 4 bits
//
//   Tags are enforced through template libraries

// Three assignment operators:
//
//   c <== a * b
//     → assigns c = a*b AND adds constraint: c - a*b = 0
//     → ALWAYS use for linear/quadratic expressions
//
//   c <-- a * b
//     → assigns c = a*b, NO constraint
//     → Use when you'll add constraint later
//     → DANGER: prover can cheat if no constraint follows
//
//   c === a * b  (NEW in Circom 2)
//     → No assignment, just constraint
//     → c must already be assigned
//     → Use for extra constraints

// Common anti-pattern:
//
//   // WRONG — prover can lie about signal values!
//   signal output out;
//   out <-- in / 2;
//
//   // CORRECT — force constraint
//   signal output out;
//   out <-- in / 2;
//   in === out * 2;
//
//   // OR use divide-safe helper:
//   signal output out <== in / 2;  // only if in is even

// Component instantiation:
//
//   component mult = Multiplier2();
//   mult.a <== 3;
//   mult.b <== 7;
//   x <== mult.c;  // x = 21
//
//   Arrays of components:
//     component gates[32];
//     for (var i = 0; i < 32; i++) {
//       gates[i] = XORGate();
//     }

// Public signals declaration:
//
//   component main {public [in, selector]} = MyCircuit();
//
//   'in' and 'selector' become public inputs
//   All other inputs are private (witness)
//   Outputs are automatically public

// Generic templates:
//
//   template Mux(n) {
//     signal input sel[log2(n)];
//     signal input in[n];
//     signal output out;
//     ...
//   }
//
//   component mux = Mux(8);
//   log2(8) = 3 selector bits

// Common template patterns:
//
//   Comparison:
//     IsZero, IsEqual, LessThan, GreaterThan
//
//   Bit decomposition:
//     Num2Bits, Bits2Num
//
//   Selection:
//     Switcher, Mux, MultiMux
//
//   Hashing:
//     Poseidon(n_inputs)
//     MiMCHasher
//     Sha256(n_bits)
//
//   Merkle trees:
//     MerkleTreeInclusionProof(depth)
//     SparseMerkleTree

// Constraint vs computation separation:
//
//   Constraint: relates signals (R1CS)
//   Computation: runs at witness generation
//
//   Prover runs WASM to compute all signals
//   Then R1CS constraints are used for proof
//
//   Example:
//     signal input in;
//     signal output out;
//     out <-- in * in;       // computation
//     out === in * in;       // constraint
//   (or equivalently: out <== in * in)`}
        </pre>
      </div>
    </section>
  );
}
