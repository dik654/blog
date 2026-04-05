import Halo2CircuitViz from '../components/Halo2CircuitViz';
import ProofPipelineViz from './viz/ProofPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_CODE, CIRCUIT_CODE, COLUMN_CODE } from './OverviewData';
import { crateAnnotations, circuitAnnotations, columnAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 회로 구조'}</h2>
      <div className="not-prose mb-8"><Halo2CircuitViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">증명 파이프라인 흐름</h3>
      <div className="not-prose mb-8"><ProofPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Halo2</strong>(zcash/halo2)는 KZG 다항식 커밋 + PLONKish 산술화 기반의
          ZK 증명 프레임워크입니다. 개발자는 <code>Circuit</code> 트레이트를 구현하여
          회로를 정의하고, <code>create_proof</code>로 증명을 생성합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('plonk-mod', codeRefs['plonk-mod'])} />
            <span className="text-[10px] text-muted-foreground self-center">plonk.rs</span>
            <CodeViewButton onClick={() => onCodeRef('circuit-trait', codeRefs['circuit-trait'])} />
            <span className="text-[10px] text-muted-foreground self-center">circuit.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (halo2_proofs/src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="Circuit 트레이트 (circuit.rs)" code={CIRCUIT_CODE} annotations={circuitAnnotations} />
        <CodePanel title="열 유형과 레이아웃" code={COLUMN_CODE} annotations={columnAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2의 PLONKish 산술화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// PLONKish circuit 구조
// R1CS보다 유연한 제약 시스템

// 회로 = 2차원 그리드 (rows × columns)
//
//         Col_0  Col_1  Col_2  Col_3  ...
// Row_0:    a_0    b_0    c_0    s_0    ...
// Row_1:    a_1    b_1    c_1    s_1    ...
// Row_2:    a_2    b_2    c_2    s_2    ...
// ...

// Column 유형
// 1) Advice: witness values (prover만 알고 있음)
// 2) Instance: public inputs
// 3) Fixed: circuit constant (compile-time)
// 4) Selector: gate 활성화 비트

// Custom gates
// gate = polynomial constraint
// 예: selector_s * (a + b - c) = 0
//     "s 활성화 시 a+b=c 강제"

// Advantages over R1CS
// - Higher-degree polynomials (2차 이상)
// - Multiple constraints per row
// - Column 간 rotation (a(X) · b(X*ω))
// - More expressive → smaller circuits`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2 vs PLONK</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Halo2 = PLONK의 implementation + extensions

// PLONK (2019, Gabizon et al.)
// - Universal trusted setup
// - Polynomial commitment
// - Custom gates

// Halo2 (2020, ZCash)
// - PLONK 기반
// - Lookup arguments 추가 (Plookup)
// - Custom gates 확장
// - Rust 구현 (zcash/halo2)

// 주요 차이점
// 1) Lookup support (essential for zkEVM)
//    - Table 기반 검증
//    - Range check, bytecode 등에 필수

// 2) Flexible proof system
//    - KZG commitment (기본)
//    - IPA commitment (trustless alternative)
//    - 선택 가능

// 3) 생태계
//    - ZCash Orchard (original)
//    - Scroll zkEVM
//    - PSE (Privacy & Scaling Explorations)
//    - Axiom, Taiko`}</pre>

      </div>
    </section>
  );
}
