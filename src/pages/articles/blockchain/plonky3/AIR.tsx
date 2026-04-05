import AIRTraceViz from '../components/AIRTraceViz';
import CodePanel from '@/components/ui/code-panel';
import { windowAccessCode, keccakAirCode } from './AIRData';
import { quotientProverCode } from './AIRData2';
import { windowAnnotations, keccakAnnotations, quotientAnnotations } from './AIRAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function AIR({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="air" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'AIR — Algebraic Intermediate Representation'}</h2>
      <div className="not-prose mb-8"><AIRTraceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3의 AIR은 <strong>트레이스 행렬</strong>에 대한 다항식 제약을 표현합니다.<br />
          각 행이 하나의 실행 단계이며, <code>current</code>·<code>next</code> 행 접근으로
          전이 제약(transition constraints)을 표현합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-keccak-air', codeRefs['p3-keccak-air'])} />
            <span className="text-[10px] text-muted-foreground self-center">keccak-air/air.rs</span>
          </div>
        )}
        <CodePanel title="WindowAccess & AirBuilder (air/src/air.rs)" code={windowAccessCode} annotations={windowAnnotations} />
        <CodePanel title="KeccakAir 예시 (keccak-air/src/air.rs)" code={keccakAirCode} annotations={keccakAnnotations} />
        <CodePanel title="제약 평가 → 몫 다항식 (uni-stark)" code={quotientProverCode} annotations={quotientAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">AIR vs R1CS vs PLONKish</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 세 가지 arithmetization 비교

// R1CS (Rank-1 Constraint System)
// - (A·x) × (B·x) = (C·x)
// - Matrix form
// - Groth16, Marlin에 사용
// - 각 constraint은 rank-1 equation

// PLONKish (Halo2)
// - Custom gates with rotations
// - q(X) · gate(X) = 0
// - Flexible column types
// - Lookup support

// AIR (Algebraic Intermediate Representation)
// - Transition system (row by row)
// - State machine representation
// - Rotation for "next row" access
// - Natural for sequential computation

// AIR 예시: Fibonacci
// Each row: (a, b) where b = next a
// Transition: a[i+1] = b[i], b[i+1] = a[i] + b[i]
//
// Constraints:
// next.a - current.b = 0       (shift)
// next.b - current.a - current.b = 0   (fibonacci)

// 적합 use case
// R1CS: general-purpose circuits
// PLONKish: lookup-heavy circuits (zkEVM)
// AIR: state machines (zkVM, hash, permutation)

// Plonky3의 혁신
// - AIR + logUp lookup 결합
// - AIR의 간결함 + PLONKish의 lookup
// - zkVM에 최적`}</pre>

      </div>
    </section>
  );
}
