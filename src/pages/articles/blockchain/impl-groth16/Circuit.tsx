import CircuitViz from './viz/CircuitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Circuit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회로 작성 (Circuit)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Circuit trait — synthesize(&self, cs) 하나만 구현하면 setup/prove/verify 모두에서 재사용
          <br />
          alloc_instance로 공개 변수, alloc_witness로 비공개 변수 할당
          <br />
          enforce(a, b, c)로 곱셈 제약 추가 — 덧셈은 LC 빌더 패턴으로 무료
        </p>
        <p className="leading-7">
          예시: f(x) = x^3 + x + 5 = y — 곱셈 2개 + 덧셈 1개
          <br />
          보조 변수 t1(x^2), t2(x^3)를 도입하여 곱셈마다 제약 하나
          <br />
          마지막 제약에서 .add()로 x와 상수 5를 연결 — 추가 제약 없이 선형결합으로 표현
        </p>
      </div>
      <div className="not-prose mb-8">
        <CircuitViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          LC 빌더 패턴 — .add(coeff, var) 체이닝으로 선형결합을 유연하게 구성
          <br />
          조건문(if-else)도 R1CS로 표현 가능: b·(1-b)=0(부울) + b·(x-y)=t + (y+t)·1=result
          <br />
          is_satisfied()로 회로 디버깅 → which_unsatisfied()로 실패 제약 위치 확인
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Circuit trait 구현 패턴</h3>

        {/* Circuit trait */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Circuit trait</h4>
          <div className="text-sm space-y-1">
            <p><code>Circuit&lt;F: Field&gt;</code> — <code>synthesize(self, cs: &mut CS) -&gt; Result&lt;(), SynthesisError&gt;</code> 하나만 구현</p>
            <p className="text-muted-foreground">동일 코드가 R1CS 생성(setup)과 witness 생성(proving) 모두에 사용</p>
          </div>
        </div>

        {/* ConstraintSystem 인터페이스 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">ConstraintSystem 인터페이스</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-background rounded p-3">
              <p><code>alloc_instance(&mut self, val: F) -&gt; Variable</code> — 공개 변수 할당 (verifier에게 보임)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p><code>alloc_witness(&mut self, val: F) -&gt; Variable</code> — 비공개 변수 할당 (prover만 앎)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p><code>enforce(&mut self, a: LC, b: LC, c: LC)</code> — 곱셈 제약 <code>a * b = c</code> 추가</p>
            </div>
            <div className="bg-background rounded p-3">
              <p><code>ONE</code> — 상수 1을 나타내는 특수 변수 (인덱스 0)</p>
            </div>
          </div>
        </div>

        {/* 예시: CubicCircuit */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">예시: x^3 + x + 5 = 35 증명</h4>
          <div className="text-sm space-y-3">
            <p><code>CubicCircuit&lt;F&gt;</code> — <code>x: Option&lt;F&gt;</code> (witness)</p>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">변수 할당</p>
              <p><code>x</code> = <code>alloc_witness</code>, <code>y</code> = <code>alloc_instance(35)</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">제약 1: x * x = t1</p>
              <p><code>enforce(LC(x), LC(x), LC(t1))</code> — 보조 변수 <code>t1 = x²</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">제약 2: t1 * x = t2</p>
              <p><code>enforce(LC(t1), LC(x), LC(t2))</code> — 보조 변수 <code>t2 = x³</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">제약 3: (t2 + x + 5) * 1 = y</p>
              <p><code>enforce(LC(t2).add(x).add(5·ONE), LC(ONE), LC(y))</code></p>
              <p className="text-muted-foreground">덧셈은 LC 체이닝으로 흡수 — 추가 제약 불필요</p>
            </div>
          </div>
        </div>

        {/* LC 빌더 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Linear Combination 빌더</h4>
          <div className="text-sm">
            <p><code>LC::new().add(coeff₁, var₁).add(coeff₂, var₂).add(coeff₃, var₃)</code></p>
            <p className="text-muted-foreground mt-1">= Σ(coeffᵢ · varᵢ) — 덧셈은 제약 소비 없이 무료</p>
          </div>
        </div>

        {/* Common gadgets */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">공용 가젯 (Common Gadgets)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">Boolean</p>
              <p><code>enforce(b, 1-b, 0)</code></p>
              <p className="text-muted-foreground">b·(1-b)=0 → b ∈ {'{0,1}'}</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Mux (if-else)</p>
              <p><code>enforce(b, true-false, result-false)</code></p>
              <p className="text-muted-foreground">result = b·(T-F) + F</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Range check (n bits)</p>
              <p>각 비트 boolean + 재구성 제약</p>
              <p className="text-muted-foreground">x = Σ bᵢ·2ⁱ</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Equality</p>
              <p><code>enforce(a-b, 1, 0)</code></p>
              <p className="text-muted-foreground">(a-b)·1 = 0</p>
            </div>
          </div>
        </div>

        {/* Dual-use 패턴 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Dual-use 패턴</h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">Setup 모드</p>
              <p><code>x = None</code></p>
              <p className="text-muted-foreground">R1CS 행렬 수집 → ProvingKey 생성</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Prove 모드</p>
              <p><code>x = Some(val)</code></p>
              <p className="text-muted-foreground">witness 계산 + R1CS 기록</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Verify 모드</p>
              <p>회로 불필요</p>
              <p className="text-muted-foreground">verifier는 증명만 확인</p>
            </div>
          </div>
        </div>

        {/* 디버깅 + 프레임워크 */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">디버깅 & 프레임워크</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">디버깅 메서드</p>
              <p><code>is_satisfied()</code> — 모든 제약 만족 여부</p>
              <p><code>which_unsatisfied()</code> — 실패 제약 인덱스</p>
              <p><code>num_constraints()</code> — 회로 크기</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">프로덕션 프레임워크</p>
              <p><strong>arkworks</strong> (Rust) · <strong>bellman</strong> (Zcash) · <strong>circom</strong> (DSL)</p>
              <p><strong>gnark</strong> (Go) · <strong>libsnark</strong> (C++)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
