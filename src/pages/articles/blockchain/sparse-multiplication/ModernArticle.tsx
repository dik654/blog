import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernSparseViz from "./viz/ModernSparseViz";

export default function ModernSparseMultiplicationArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">0의 위치를 계산 자원으로 바꾸기</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Sparse multiplication은 값이 아니라 support를 먼저 읽는다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Polynomial이나 extension-field 원소를 coefficient 배열로 표현할 때 대부분의
          자리가 0이라면, dense 곱셈처럼 모든 자리 쌍을 계산할 필요가 없습니다.
          <strong>Sparse multiplication</strong>은 0이 아닌 coefficient의 위치 집합,
          즉 <strong>support</strong>를 알고 있는 operand에 맞춰 partial product만
          생성하고 reduction합니다. Pairing의 Miller loop에서는 line evaluation이
          선택한 twist와 basis에서 특정 Fp¹² slot만 채우기 때문에 이 최적화를 반복해서
          사용할 수 있습니다.
        </p>
        <p>
          하지만 “0이 많다”는 관찰만으로 전용 함수를 호출하면 안 됩니다. 어느 slot이
          0인지, 그 pattern이 protocol과 field profile에서 항상 유지되는지, coefficient
          order가 같은지를 먼저 고정해야 합니다. Pattern이 runtime마다 달라지는 일반
          sparse matrix와, `mul_by_014`처럼 type과 호출 지점이 고정한 pairing field
          schedule은 서로 다른 구현 문제입니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> Dense operand의 모든 coefficient를 sparse
          operand의 0이 아닌 coefficient하고만 곱합니다. 줄어드는 것은 후보
          multiplication 수이며, addition·non-residue reduction·load·temporary까지
          같은 비율로 줄어든다고 단정할 수 없습니다.
        </aside>
        <ContentBoundary article="sparse-multiplication" />
      </section>

      <section id="why-sparse" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 희소 표현</p>
          <h2 className="mt-2 text-2xl font-bold">Coefficient 값과 위치를 함께 저장한다</h2>
        </header>
        <p>
          Polynomial A(x)=∑aᵢxⁱ의 dense 표현은 degree까지 모든 coefficient를 저장합니다.
          Sparse 표현은 aᵢ≠0인 (i,aᵢ)만 저장합니다. 예를 들어 B(x)=5+7x²의 dense
          배열은 [5,0,7,0]처럼 보일 수 있지만 support는 Sᴮ=&#123;0,2&#125;입니다. 이 정보가
          compile-time에 고정돼 있으면 branch 없이 전용 straight-line schedule을 만들
          수 있고, runtime sparse라면 index 검사·indirection 비용이 추가됩니다.
        </p>
        <ExplainedFormula
          question="두 coefficient 표현을 곱을 때 어떤 출력 위치에 어떤 partial product가 더해지는가?"
          idea={<>지수 i와 j의 항을 곱하면 x^(i+j)가 되므로, 0이 아닌 support 쌍만 순회해 같은 출력 index에 누적합니다.</>}
          formula={String.raw`c_k=\sum_{\substack{i\in S_A,\,j\in S_B\\i+j=k}}a_ib_j,\qquad N_{\mathrm{mul}}=|S_A|\,|S_B|`}
          terms={[
            { symbol: "S_A,S_B", name: "Supports", description: "각 operand에서 coefficient가 0이 아닌 index 집합입니다." },
            { symbol: "a_i,b_j", name: "Nonzero coefficients", description: "Support가 가리키는 실제 field 값입니다." },
            { symbol: "c_k", name: "Output coefficient", description: "지수 합이 k인 partial product를 모두 더한 값입니다." },
            { symbol: "N_{\mathrm{mul}}", name: "Candidate scalar products", description: "Reduction 전 support pair의 개수입니다." },
          ]}
          assumptions={["0 판정은 coefficient field에서 정확하며, secret sparsity를 branch로 노출하지 않습니다.", "표시한 count는 coefficient multiplication 후보만 세고 addition·reduction·memory 비용은 제외합니다.", "Quotient field에서는 degree가 defining relation을 넘은 항을 추가로 reduction합니다."]}
          interpretation="Dense 길이가 dA+1, dB+1이면 모든 slot을 순회하는 비용과 support product를 비교할 수 있습니다. 다만 support pair 여러 개가 같은 k로 모이거나 quotient reduction에서 섞이므로 output nonzero 수가 |SA||SB|와 같다는 뜻은 아닙니다."
        />
        <ModernSparseViz />
        <p>
          A=1+2x+3x²+4x³, B=5+7x²라면 8개의 실제 곱으로
          5+10x+22x²+34x³+21x⁴+28x⁵를 얻습니다. Dense 길이 4 두 개를 기계적으로
          곱하면 16개 후보를 만들지만, B의 1·3번 slot이 0임을 알고 있으면 그 열을
          전부 생략할 수 있습니다.
        </p>
      </section>

      <section id="how-sparse" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Extension-field lowering</p>
          <h2 className="mt-2 text-2xl font-bold">Fp¹² slot 이름은 tower profile에 종속된다</h2>
        </header>
        <p>
          Pairing 구현은 Fp¹² 원소를 Fp² coefficient 여섯 개로 볼 수 있지만, 그 여섯
          slot의 order와 basis unit은 구현이 선택한 Fp²→Fp⁶→Fp¹² tower에 달려
          있습니다. Miller line ℓ(P)는 twist에서 base field point P로 평가한 뒤 특정
          세 slot만 채울 수 있습니다. 이때 dense accumulator f에 line을 곱하는 전용
          함수는 입력 세 coefficient만 받고 나머지가 정확히 0이라는 contract를 코드
          구조로 보존합니다.
        </p>
        <p>
          예를 들어 arkworks의 pinned Fp12 model에는 `mul_by_034`와 `mul_by_014`가
          따로 있습니다. 숫자 0·1·4는 보편적인 pairing 표준이 아니라 그 source의
          coefficient layout을 가리킵니다. 다른 twist, 다른 tower, 다른 serialization
          order에 이름만 복사하면 계산은 type-check를 통과해도 잘못된 field 원소가
          됩니다. 따라서 <a className="text-primary hover:underline" href="/crypto/extension-fields#overview">tower layout</a>과
          non-residue를 먼저 고정하고 basis unit vector로 확인해야 합니다.
        </p>
        <div id="paper-arkworks-sparse-source">
          <CitationBlock source="arkworks algebra 0.5.0 · Fp12 sparse multiplication" citeKey={1} type="code" href="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs">
            <p><strong>문제:</strong> Fp12 accumulator에 알려진 sparse coefficient pattern을 곱할 때 generic multiplication의 불필요한 하위 연산을 피합니다.</p>
            <p><strong>기여:</strong> Pinned commit에서 `mul_by_034`·`mul_by_014`가 받는 slot과 Fp6 sparse helper로 내려가는 실제 schedule을 제공합니다.</p>
            <p><strong>전제와 범위:</strong> ark-ff 0.5.0 API와 commit 7ad88c46…의 2-over-3-over-2 model에 한정됩니다. 모든 curve·tower의 slot pattern이나 constant-time·speedup을 일반화하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="cost-saving" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 비용 모델</p>
          <h2 className="mt-2 text-2xl font-bold">부분 곱 수와 end-to-end latency를 분리한다</h2>
        </header>
        <p>
          Dense×sparse의 일차 비교는 coefficient multiplication 수에서 시작하지만,
          최종 선택은 더 넓은 장부가 필요합니다. Fp² multiplication 안의 base-field
          mul/add, non-residue 곱, lazy reduction 범위, temporary register, load/store,
          instruction-level parallelism을 함께 세어야 합니다. Sparse schedule의 dependency
          chain이 길면 곱셈 수가 적어도 hardware utilization이 나빠질 수 있습니다.
        </p>
        <ExplainedFormula
          question="Miller loop 전체에서 sparse 전용 곱셈이 절약할 수 있는 시간의 상한을 어떻게 읽는가?"
          idea={<>전체 시간 가운데 line multiplication이 차지하는 비율만 개선 대상입니다. 그 부분을 s배 빠르게 해도 나머지 시간은 그대로이므로 Amdahl 형태의 상한이 생깁니다.</>}
          formula={String.raw`S_{\mathrm{total}}\le \frac{1}{(1-f)+f/s}`}
          terms={[
            { symbol: "f", name: "Optimized fraction", description: "기준 구현 시간 중 sparse line multiplication이 차지한 비율입니다." },
            { symbol: "s", name: "Local speedup", description: "같은 input에서 해당 부분만 전용 schedule로 빨라진 배수입니다." },
            { symbol: "S_{\mathrm{total}}", name: "End-to-end speedup", description: "Miller loop 또는 pairing 전체 wall time의 개선 배수입니다." },
          ]}
          assumptions={["Baseline과 candidate가 같은 curve·field profile·input·correctness를 사용합니다.", "f는 profiler로 측정하고 local optimization이 다른 구간의 cache·parallelism을 바꾸지 않는 근사입니다.", "식은 upper-bound cost model이며 보안성과 수치 정확성을 평가하지 않습니다."]}
          interpretation="f=0.4이고 line multiply만 2배 빨라져도 전체 상한은 1/(0.6+0.2)=1.25배입니다. Partial-product count 2배 감소를 pairing 2배 향상으로 보고하면 안 되는 이유입니다."
        />
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">층</th><th className="p-3">세어야 할 항목</th><th className="p-3">검산</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">대수</td><td className="p-3">Support pair·Fp2 mul/add·non-residue·reduction</td><td className="p-3">Generic Fp12 product parity</td></tr>
              <tr><td className="p-3 font-medium text-foreground">구현</td><td className="p-3">Load/store·temporary bytes·branch·instruction dependency</td><td className="p-3">Pinned source와 coefficient order</td></tr>
              <tr><td className="p-3 font-medium text-foreground">시스템</td><td className="p-3">Line step 비율 f·Miller total·pairing total</td><td className="p-3">Profiler counter와 paired benchmark</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="in-miller" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · Miller loop 적용</p>
          <h2 className="mt-2 text-2xl font-bold">반복되는 line shape를 전용 schedule에 묶는다</h2>
        </header>
        <p>
          Miller loop의 한 step은 accumulator를 제곱하고 line evaluation을 곱하는
          형태입니다. Loop parameter bit에 따라 doubling line만 쓰거나 addition line을
          하나 더 곱합니다. Sparse optimization은 이 line operand의 구조를 이용할 뿐,
          loop 길이·point update·final exponentiation을 없애지 않습니다.
        </p>
        <ExplainedFormula
          question="Sparse line multiplication은 Miller recurrence의 어느 위치를 바꾸는가?"
          idea={<>Accumulator 제곱과 point update는 유지하고, dense f에 sparse line ℓ를 곱하는 한 연산을 profile-specific helper로 낮춥니다.</>}
          formula={String.raw`f_{i+1}=f_i^2\,\ell_i(P)\quad\leadsto\quad f_{i+1}=\operatorname{mul\_by\_support}(f_i^2;\,\ell_{s_1},\ell_{s_2},\ell_{s_3})`}
          terms={[
            { symbol: "f_i", name: "Miller accumulator", description: "현재 loop까지 line function 값을 누적한 dense Fp12 원소입니다." },
            { symbol: String.raw`\ell_i(P)`, name: "Evaluated line", description: "Twist point 연산의 line을 base-field point P에서 평가해 embedding한 sparse 원소입니다." },
            { symbol: "s_1,s_2,s_3", name: "Pinned support slots", description: "선택 curve·twist·tower가 정한 nonzero coefficient 위치입니다." },
          ]}
          assumptions={["P·Q가 검증된 subgroup point이고 Miller algorithm과 signed loop parameter가 고정돼 있습니다.", "Line embedding과 sparse helper가 같은 tower basis·coefficient order·non-residue를 사용합니다.", "세 slot 표기는 설명용이며 실제 support 수와 index는 target profile source를 따릅니다."]}
          interpretation="바뀌는 것은 ℓ와의 multiplication schedule입니다. Pairing bilinearity, subgroup validation, final exponentiation correctness를 이 최적화만으로 증명할 수는 없습니다."
        />
        <div id="paper-efficient-bilinear-pairings">
          <CitationBlock source="Aranha et al. · Efficient Implementation of Bilinear Pairings" citeKey={2} href="https://eprint.iacr.org/2012/408">
            <p><strong>문제:</strong> BN curve의 optimal-Ate pairing을 실제 processor에서 빠르게 구현할 때 extension-field arithmetic과 line multiplication 비용을 줄입니다.</p>
            <p><strong>기여:</strong> Degree-12 extension의 sparse multiplication과 reduction·coordinate 선택을 포함한 구현·측정 범위를 제시합니다.</p>
            <p><strong>전제와 범위:</strong> 논문의 curve family, tower, coordinate, platform과 benchmark 조건에 귀속됩니다. 해당 수치를 현재 CPU나 다른 pairing-friendly curve에 그대로 옮길 수 없습니다.</p>
          </CitationBlock>
        </div>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> Curve/tower/profile SHA를
          고정하고 zero·one·basis unit·random dense×declared-sparse를 generic product와
          비교합니다. Wrong slot, supposedly-zero slot에 nonzero를 넣은 negative fixture,
          Miller trace와 official pairing vector를 통과한 뒤에만 operation count와 p50/p95를
          비교합니다.
        </aside>
        <p>
          10문항 역검사는 support와 dense 표현, 4×2 수치 곱, convolution index,
          quotient reduction, pairing line sparsity, 비용 장부를 기초로 확인합니다. 심화에서는
          secret-dependent sparsity 반례, coefficient-order mismatch, Amdahl 상한, generic
          parity를 포함한 release matrix를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
