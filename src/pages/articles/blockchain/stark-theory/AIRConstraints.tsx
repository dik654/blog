import M from '@/components/ui/math';
import AIRConstraintViz from './viz/AIRConstraintViz';

export default function AIRConstraints() {
  return (
    <section id="air-constraints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AIR 제약 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          실행 추적의 무결성을 다항식 등식으로 표현 &mdash; 전이 제약 + 경계 제약.
        </p>
      </div>
      <div className="not-prose"><AIRConstraintViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AIR (Algebraic Intermediate Representation)</h3>

        {/* 두 종류의 제약 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">AIR = 다항식 제약으로 표현된 연산</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">1. Transition Constraints (전이 제약)</p>
              <p className="text-xs text-muted-foreground mt-1">모든 연속 row 쌍에 대해 성립 &mdash; "step i에서 step i+1로 어떻게 변해야 하는가?"</p>
              <div className="mt-2 space-y-1">
                <M display>{'\\underbrace{C_1(x)}_{\\text{제약 다항식 1}} = \\underbrace{a(\\omega \\cdot x)}_{\\text{다음 행의 a}} - \\underbrace{b(x)}_{\\text{현재 행의 b}} = 0'}</M>
                <p className="text-sm text-muted-foreground mt-2">
                  <M>C_1(x)</M>: 전이 제약 다항식 &mdash; <M>a</M>의 다음 값이 현재 <M>b</M>와 같아야 함.{' '}
                  <M>\omega</M>: 실행 도메인의 생성원(generator) &mdash; <M>\omega \cdot x</M>는 다음 row를 가리킴.
                </p>
                <M display>{'\\underbrace{C_2(x)}_{\\text{제약 다항식 2}} = \\underbrace{b(\\omega \\cdot x)}_{\\text{다음 행의 b}} - \\underbrace{a(x)}_{\\text{현재 a}} - \\underbrace{b(x)}_{\\text{현재 b}} = 0'}</M>
                <p className="text-sm text-muted-foreground mt-2">
                  <M>C_2(x)</M>: 피보나치 점화식 <M>b' = a + b</M>를 다항식으로 인코딩.{' '}
                  <M>x</M>: 실행 도메인 <M>D</M> 위의 평가점(evaluation point).
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2"><M>x \in D \setminus \{'{'}\omega^T\{'}'}</M> 에서 성립 &mdash; 마지막 행은 "다음 행"이 없으므로 제외</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">2. Boundary Constraints (경계 제약)</p>
              <p className="text-xs text-muted-foreground mt-1">특정 row에 대해 성립 &mdash; 초기값, 최종값 조건</p>
              <div className="mt-2 space-y-1">
                <M display>{'\\underbrace{a(\\omega^0)}_{\\text{첫 번째 행의 a}} = 1 \\quad \\text{(초기 a=1)}'}</M>
                <M display>{'\\underbrace{b(\\omega^0)}_{\\text{첫 번째 행의 b}} = 1 \\quad \\text{(초기 b=1)}'}</M>
                <M display>{'\\underbrace{b(\\omega^T)}_{\\text{마지막 행의 b}} = \\underbrace{\\text{expected}}_{\\text{공개 입력값}} \\quad \\text{(출력 체크)}'}</M>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <M>\omega^0 = 1</M>: 도메인의 첫 번째 점(row 0).{' '}
                <M>\omega^T</M>: 도메인의 마지막 점(row T) &mdash; <M>T</M>는 실행 추적 길이.{' '}
                경계 제약은 초기/최종 상태를 고정하여 올바른 프로그램 실행을 보장.
              </p>
            </div>
          </div>
        </div>

        {/* Constraint Polynomial & Composition */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">Constraint Polynomial &amp; Composition</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Vanishing Polynomial로 나누기</p>
              <M display>{'\\underbrace{V(x)}_{\\text{소거 다항식}} = \\prod_i \\underbrace{(x - \\omega^i)}_{\\text{각 도메인 점에서 0}} \\quad \\text{(valid 인덱스 전체)}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>V(x)</M> (Vanishing Polynomial): 실행 도메인 <M>D</M>의 모든 점에서 0이 되는 다항식.{' '}
                <M>\omega^i</M>: 도메인의 <M>i</M>번째 점.{' '}
                <M>\prod_i</M>: 모든 도메인 점에 대한 곱 &mdash; 실제로는 <M>x^n - 1</M>로 효율적 계산.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <M>{'\\underbrace{C(x) / V(x)}_{\\text{몫 다항식 Q(x)}}'}</M>가 low-degree polynomial &hArr; <M>C(x)</M>가 도메인의 모든 점에서 0 &hArr; 모든 제약을 만족.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Composition Polynomial</p>
              <p className="text-xs text-muted-foreground mb-2">모든 제약을 verifier 챌린지 <M>\alpha_i</M>로 하나로 결합</p>
              <M display>{'\\underbrace{C_{\\text{comp}}(x)}_{\\text{합성 다항식}} = \\sum_i \\underbrace{\\alpha_i}_{\\text{랜덤 챌린지}} \\cdot \\underbrace{\\frac{C_i(x)}{V_i(x)}}_{\\text{제약 i의 몫}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>C_{'{\\text{comp}}'}(x)</M>: 합성 다항식(Composition Polynomial) &mdash; 여러 제약을 하나의 다항식으로 결합.{' '}
                <M>\alpha_i</M>: Verifier가 보낸 랜덤 계수 &mdash; Prover가 개별 제약을 속이는 것을 방지(Schwartz-Zippel 보조정리).{' '}
                <M>C_i(x)</M>: <M>i</M>번째 제약 다항식. <M>V_i(x)</M>: 해당 제약의 소거 다항식.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Prover가 <M>C_{'{\\text{comp}}'}</M>에 commit &rarr; Verifier가 FRI로 low-degree 검증.{' '}
                <M>C_{'{\\text{comp}}'}</M>이 낮은 차수 &hArr; 모든 <M>C_i(x)/V_i(x)</M>가 다항식 &hArr; 모든 제약이 성립.
              </p>
            </div>
          </div>
        </div>

        {/* AIR DSL 예시 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">AIR DSL 예시 (Cairo-like pseudocode)</p>
          <div className="rounded border bg-card p-3 text-sm">
            <div className="space-y-1 text-xs font-mono">
              <p className="text-muted-foreground">air FibonacciAir {'{'}</p>
              <p className="ml-4">columns {'{'} <code>a</code>, <code>b</code> {'}'}</p>
              <p className="ml-4 mt-2 text-muted-foreground">transition {'{'}</p>
              <p className="ml-8"><code>next(a) == b</code></p>
              <p className="ml-8"><code>next(b) == a + b</code></p>
              <p className="ml-4 text-muted-foreground">{'}'}</p>
              <p className="ml-4 mt-2 text-muted-foreground">boundary {'{'}</p>
              <p className="ml-8"><code>first(a) == 1</code></p>
              <p className="ml-8"><code>first(b) == 1</code></p>
              <p className="ml-8"><code>last(b) == public_input</code></p>
              <p className="ml-4 text-muted-foreground">{'}'}</p>
              <p className="text-muted-foreground">{'}'}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">&rarr; 자동으로 polynomial constraints 생성</p>
          </div>
        </div>

        {/* 실무 프레임워크 + 복잡 연산 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">AIR 프레임워크 &amp; 복잡 연산</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">실무 프레임워크</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Cairo AIR (StarkWare)</p>
                <p>Winterfell AIR (Rust)</p>
                <p>Stone (Cairo 후속)</p>
                <p>Plonky3 (Polygon)</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">복잡 연산의 AIR</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Hash function (Poseidon, Rescue)</p>
                <p>Elliptic curve ops</p>
                <p>Memory access</p>
                <p>Range checks</p>
                <p>Bitwise operations (비용 높음)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
