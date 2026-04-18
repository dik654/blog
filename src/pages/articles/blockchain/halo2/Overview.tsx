import M from '@/components/ui/math';
import Halo2CircuitViz from '../components/Halo2CircuitViz';
import ProofPipelineViz from './viz/ProofPipelineViz';

export default function Overview({ title }: { title?: string }) {
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
        {/* 크레이트 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">크레이트 구조 (halo2_proofs/src/)</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>plonk/</code></p>
              <p className="text-xs text-muted-foreground mt-1">keygen, prover, verifier &mdash; 증명 파이프라인 핵심</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>circuit.rs</code></p>
              <p className="text-xs text-muted-foreground mt-1"><code>Circuit</code> 트레이트, <code>Layouter</code>, <code>Region</code> 정의</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>poly/</code></p>
              <p className="text-xs text-muted-foreground mt-1">다항식 연산 &mdash; FFT, KZG/IPA commitment</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>transcript.rs</code></p>
              <p className="text-xs text-muted-foreground mt-1">Fiat-Shamir 트랜스크립트 (Blake2b / Poseidon)</p>
            </div>
          </div>
        </div>

        {/* Circuit 트레이트 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">Circuit 트레이트 (circuit.rs)</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>{'type Config'}</code></p>
              <p className="text-xs text-muted-foreground mt-1">회로가 사용하는 열/게이트 설정 묶음 &mdash; <code>configure()</code>에서 반환</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>{'fn configure(meta: &mut ConstraintSystem<F>) -> Self::Config'}</code></p>
              <p className="text-xs text-muted-foreground mt-1">열 선언, custom gate 등록, lookup 추가 &mdash; keygen 시점에 1회 호출</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>{'fn synthesize(config: Self::Config, layouter: impl Layouter<F>)'}</code></p>
              <p className="text-xs text-muted-foreground mt-1">witness 할당 + 제약 배치 &mdash; keygen과 proving 양쪽에서 호출</p>
            </div>
          </div>
        </div>

        {/* 열 유형 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">열 유형과 레이아웃</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">Advice</p>
              <p className="text-xs text-muted-foreground mt-1">witness 값 &mdash; prover만 알고 있는 비밀 입력</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">Instance</p>
              <p className="text-xs text-muted-foreground mt-1">public input &mdash; 검증자도 볼 수 있는 공개 값</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300">Fixed</p>
              <p className="text-xs text-muted-foreground mt-1">회로 상수 &mdash; compile-time에 확정</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-purple-300">Selector</p>
              <p className="text-xs text-muted-foreground mt-1">gate 활성화 비트 &mdash; 0 또는 1, 행별 gate on/off</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2의 PLONKish 산술화</h3>
        <p>
          PLONKish 회로는 2차원 그리드(rows x columns)로 구성됩니다.
          R1CS가 단일 곱셈 게이트만 표현하는 것과 달리, PLONKish는 임의 차수의 다항식 제약을 허용합니다.
        </p>

        {/* PLONKish 그리드 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-sky-400 mb-3">PLONKish 그리드 (rows x columns)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="p-2 text-muted-foreground"></th>
                  <th className="p-2 text-sky-300">Col_0 (advice)</th>
                  <th className="p-2 text-sky-300">Col_1 (advice)</th>
                  <th className="p-2 text-emerald-300">Col_2 (instance)</th>
                  <th className="p-2 text-purple-300">Col_3 (selector)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-b border-border/30"><td className="p-2 text-muted-foreground">Row 0</td><td className="p-2">a₀</td><td className="p-2">b₀</td><td className="p-2">c₀</td><td className="p-2">s₀</td></tr>
                <tr className="border-b border-border/30"><td className="p-2 text-muted-foreground">Row 1</td><td className="p-2">a₁</td><td className="p-2">b₁</td><td className="p-2">c₁</td><td className="p-2">s₁</td></tr>
                <tr><td className="p-2 text-muted-foreground">Row 2</td><td className="p-2">a₂</td><td className="p-2">b₂</td><td className="p-2">c₂</td><td className="p-2">s₂</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Gate */}
        <div className="not-prose rounded-lg border-l-4 border-l-purple-500 bg-card p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-2">Custom Gate &mdash; 다항식 제약</p>
          <M display>{'s(X) \\cdot \\bigl(a(X) + b(X) - c(X)\\bigr) = 0'}</M>
          <p className="text-xs text-muted-foreground mt-2">
            selector <M>{'s'}</M> 가 1인 행에서 <M>{'a + b = c'}</M> 를 강제.
            rotation을 사용하면 <M>{'a(X) \\cdot b(X \\cdot \\omega)'}</M> 처럼 인접 행 참조 가능
          </p>
        </div>

        {/* R1CS 대비 장점 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">PLONKish vs R1CS</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">고차 다항식</p>
              <p className="text-xs text-muted-foreground mt-1">R1CS는 2차(bilinear)만 가능, PLONKish는 임의 차수 제약</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">행당 다중 제약</p>
              <p className="text-xs text-muted-foreground mt-1">R1CS는 행당 1개, PLONKish는 여러 gate를 한 행에 적용</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Column Rotation</p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'a(X \\cdot \\omega^k)'}</M> 로 k행 떨어진 셀 참조 &mdash; 상태 전파 표현</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">더 작은 회로</p>
              <p className="text-xs text-muted-foreground mt-1">표현력이 높아 동일 로직을 더 적은 행/열로 구현</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2 vs PLONK</h3>

        {/* PLONK vs Halo2 비교 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">PLONK (2019, Gabizon et al.)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Universal trusted setup &mdash; 하나의 setup으로 다양한 회로 사용</li>
              <li>Polynomial commitment 기반 증명</li>
              <li>Custom gates 도입 &mdash; 고정된 덧셈/곱셈 게이트를 넘어 확장</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Halo2 (2020, ZCash) &mdash; PLONK 확장</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Lookup arguments 추가 (Plookup) &mdash; 테이블 검증으로 range check 효율화</li>
              <li>Custom gates 확장 &mdash; 고차 다항식 + rotation 조합</li>
              <li>Rust 구현 (<code>zcash/halo2</code>)</li>
            </ul>
          </div>
        </div>

        {/* 주요 차이점 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">핵심 차이점</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Lookup 지원</p>
              <p className="text-xs text-muted-foreground mt-1">zkEVM에 필수 &mdash; range check, bytecode 검증에 사용</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">유연한 커밋 스킴</p>
              <p className="text-xs text-muted-foreground mt-1">KZG(trusted setup) 또는 IPA(trustless) 선택 가능</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">생태계</p>
              <p className="text-xs text-muted-foreground mt-1">ZCash Orchard, Scroll zkEVM, PSE, Axiom, Taiko</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
