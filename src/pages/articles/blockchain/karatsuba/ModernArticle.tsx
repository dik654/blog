import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernKaratsubaViz from "./viz/ModernKaratsubaViz";

export default function ModernKaratsubaArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">자리수 곱셈을 계산 그래프로 보기</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Karatsuba는 곱셈 하나를 덧셈으로 바꾼다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          두 n자리 수를 학교식으로 곱하면 모든 자리 쌍을 만나므로 대략 n²개의
          작은 곱이 필요합니다. Karatsuba 곱셈은 수를 높은 절반과 낮은 절반으로
          나눈 뒤, 네 개였던 절반 크기 곱을 세 개로 줄입니다. 덧셈과 임시 공간은
          늘지만 재귀 단계마다 비싼 곱 하나가 사라져 충분히 큰 operand에서는
          전체 복잡도가 낮아집니다.
        </p>
        <p>
          여기서 digit는 십진수 한 자리에 한정되지 않습니다. Big-integer
          library에서는 보통 machine word 묶음인 <strong>limb</strong>을 단위로
          나누며, polynomial이나 extension-field coefficient도 같은 bilinear
          재결합 아이디어를 쓸 수 있습니다. 다만 Fp²의 구체적인 non-residue와
          reduction schedule은 <a className="text-primary hover:underline" href="/crypto/extension-fields#fp2">확장체 구현 글</a>이
          정본입니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> 교차항 x₁y₀+x₀y₁을 두 번 직접 곱하지
          않고 (x₁+x₀)(y₁+y₀)−x₁y₁−x₀y₀에서 얻습니다. 계산량을 없앤 것이
          아니라 multiplication 한 번을 여러 addition·subtraction과 carry 처리로
          교환한 것입니다.
        </aside>
        <ContentBoundary article="karatsuba" />
      </section>

      <section id="naive-mul" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 기준선</p>
          <h2 className="mt-2 text-2xl font-bold">두 조각씩 나누면 원래는 네 번 곱한다</h2>
        </header>
        <p>
          B를 낮은 조각의 자리 크기라고 하겠습니다. 십진수 두 자리씩 나누면 B=100이고 k개의 w-bit limb씩 나누면 B=2^(kw)입니다. x=x₁B+x₀, y=y₁B+y₀를
          그대로 전개하면 높은 항, 낮은 항, 두 교차항이 나옵니다.
        </p>
        <ExplainedFormula
          question="두 조각으로 나눈 두 수를 schoolbook 방식으로 곱하면 어떤 네 곱이 생기는가?"
          idea={<>분배법칙으로 각 조각 쌍을 모두 곱하고 B의 거듭제곱에 맞춰 자리 이동합니다. 이 식이 Karatsuba와 비교할 정확한 기준선입니다.</>}
          formula={String.raw`xy=x_1y_1B^2+(x_1y_0+x_0y_1)B+x_0y_0`}
          annotatedFormula={String.raw`xy=\underbrace{x_1y_1B^2+(x_1y_0+x_0y_1)B+x_0y_0}_{\text{Split radix 계산}}`}
          operations={[
            { expression: String.raw`x_1y_1B^2+(x_1y_0+x_0y_1)B+x_0y_0`, annotation: ["Split radix이(가) 식의 결과에 기여하는 방식을","계산합니다.","분배법칙으로 각 조각 쌍을 모두 곱하고 B의 거듭제곱에 맞춰","자리 이동합니다."] },
          ]}
          terms={[
            { symbol: "x_1,y_1", name: "High halves", description: "각 operand의 높은 자리 조각입니다." },
            { symbol: "x_0,y_0", name: "Low halves", description: "0 이상 B 미만인 낮은 자리 조각입니다." },
            { symbol: "B", name: "Split radix", description: "낮은 조각의 자리 폭에 해당하는 10 또는 2의 거듭제곱입니다." },
            { symbol: "B^2,B", name: "Position shifts", description: "Partial product를 원래 자리 위치로 이동합니다." },
          ]}
          assumptions={["정수에서는 carry를 정확히 전파하고, polynomial에서는 B를 indeterminate로 읽습니다.", "짝수 크기 분할을 설명했지만 홀수 limb는 high 조각을 한 limb 짧게 둘 수 있습니다.", "Operation count는 multiplication·addition·allocation을 분리해서 셉니다."]}
          interpretation="x₁y₁, x₁y₀, x₀y₁, x₀y₀의 네 절반 크기 곱이 필요합니다. 자리 이동은 보통 pointer offset이나 limb 배치로 싸게 처리되지만 carry와 합산은 공짜가 아닙니다."
        />
      </section>

      <section id="karatsuba-trick" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 세 곱 재결합</p>
          <h2 className="mt-2 text-2xl font-bold">합의 곱 하나에서 두 교차항을 함께 꺼낸다</h2>
        </header>
        <ModernKaratsubaViz />
        <ExplainedFormula
          question="Schoolbook의 네 절반 곱과 같은 결과를 세 절반 곱으로 어떻게 계산하는가?"
          idea={<>낮은 항 z₀와 높은 항 z₂는 그대로 계산하고, 두 합을 곱한 값에서 z₀와 z₂를 빼 교차항 z₁을 얻습니다.</>}
          formula={String.raw`z_0=x_0y_0,\quad z_2=x_1y_1,\quad z_1=(x_0+x_1)(y_0+y_1)-z_0-z_2,\quad xy=z_2B^2+z_1B+z_0`}
          annotatedFormula={String.raw`z_0=\underbrace{x_0y_0,\quad z_2=x_1y_1,\quad z_1=(x_0+x_1)(y_0+y_1)-z_0-z_2,\quad xy=z_2B^2+z_1B+z_0}_{\text{Low product 계산}}`}
          operations={[
            { expression: String.raw`x_0y_0,\quad z_2=x_1y_1,\quad z_1=(x_0+x_1)(y_0+y_1)-z_0-z_2,\quad xy=z_2B^2+z_1B+z_0`, annotation: ["Low product이(가) 식의 결과에 기여하는 방식을","계산합니다.","낮은 항 z₀와 높은 항 z₂는 그대로 계산하고, 두 합을","곱한 값에서 z₀와 z₂를 빼 교차항 z₁을 얻습니다."] },
          ]}
          terms={[
            { symbol: "z_0", name: "Low product", description: "낮은 조각끼리의 곱입니다." },
            { symbol: "z_2", name: "High product", description: "높은 조각끼리의 곱입니다." },
            { symbol: "z_1", name: "Cross coefficient", description: "x₁y₀+x₀y₁과 정확히 같은 교차항입니다." },
            { symbol: "B", name: "Split radix", description: "z₂와 z₁을 원래 자리로 옮기는 기준입니다." },
          ]}
          assumptions={["Addition·subtraction과 signed temporary가 정확하며 overflow가 나지 않는 폭을 사용합니다.", "합 x₀+x₁이 한 limb 더 커질 수 있어 buffer와 carry 비용을 포함해야 합니다.", "Field에서 사용할 때 subtraction과 reduction은 해당 field 규칙을 따릅니다."]}
          interpretation="(x₀+x₁)(y₀+y₁)를 전개하면 z₀+z₂+x₁y₀+x₀y₁이므로 두 이미 계산한 항을 빼면 교차항만 남습니다. 세 곱이라는 대수적 동일성은 실제 CPU에서 항상 더 빠르다는 뜻은 아닙니다."
        />
        <p>
          1234와 5678을 B=100으로 나누면 (x₁,x₀)=(12,34),
          (y₁,y₀)=(56,78)입니다. z₂=672, z₀=2652,
          z₁=46·134−672−2652=2840이고, 672·10000+2840·100+2652=
          7,006,652가 됩니다. 일반 곱 12·78과 34·56을 따로 하지 않았다는 점이
          핵심입니다.
        </p>
        <div id="paper-karatsuba-ofman">
          <CitationBlock source="Karatsuba & Ofman · Multiplication of many-digital numbers" citeKey={1} href="https://www.mathnet.ru/eng/dan26729">
            <p><strong>문제:</strong> 다자리 수 곱셈에 필요한 elementary operation 수가 schoolbook의 quadratic growth보다 작을 수 있는지를 다룹니다.</p>
            <p><strong>기여:</strong> Operand 분할과 재결합으로 subquadratic multiplication을 구성한 초기 원문입니다.</p>
            <p><strong>전제와 범위:</strong> 점근적 operation count의 근거이며 현대 CPU의 cutoff, cache, allocation 비용이나 모든 크기의 실측 우위를 주장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="recursive" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 재귀와 정리</p>
          <h2 className="mt-2 text-2xl font-bold">세 개의 절반 문제를 다시 세 개로 나눈다</h2>
        </header>
        <p>
          각 z 곱도 충분히 크다면 같은 분할을 반복할 수 있습니다. 한 단계는 크기
          n/2인 곱 세 개와 O(n)개의 덧셈·carry를 만듭니다. n=2ᵏ라고 두고
          k단계를 펼치면 leaf multiplication은 3ᵏ개입니다. 2ᵏ=n이므로
          3ᵏ=n^(log₂3)이 되어 지수는 약 1.585입니다.
        </p>
        <ExplainedFormula
          question="Karatsuba 재귀의 계산량이 왜 n²이 아니라 n^log₂3이 되는가?"
          idea={<>문제 크기는 매 단계 절반이 되고 subproblem 수는 세 배가 됩니다. 깊이 log₂n에서 leaf 수가 3^log₂n이므로 같은 지수 법칙으로 바꿉니다.</>}
          formula={String.raw`T(n)=3T(n/2)+cn\quad\Longrightarrow\quad T(n)=\Theta\!\left(n^{\log_2 3}\right)\approx\Theta(n^{1.585})`}
          annotatedFormula={String.raw`T(n)=\underbrace{3T(n/2)+cn\quad\Longrightarrow\quad T(n)=\Theta\!\left(n^{\log_2 3}\right)\approx\Theta(n^{1.585})}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`3T(n/2)+cn\quad\Longrightarrow\quad T(n)=\Theta\!\left(n^{\log_2 3}\right)\approx\Theta(n^{1.585})`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","문제 크기는 매 단계 절반이 되고 subproblem 수는 세","배가 됩니다."] },
          ]}
          terms={[
            { symbol: "T(n)", name: "n-limb running cost", description: "같은 backend에서 n 크기 operand 두 개를 곱하는 비용입니다." },
            { symbol: "3T(n/2)", name: "Recursive products", description: "절반 크기의 z₀, z₁, z₂ 곱 세 개입니다." },
            { symbol: "cn", name: "Linear combine cost", description: "분할, 합·차, carry, 재결합을 묶은 선형 항입니다." },
            { symbol: String.raw`\log_2 3`, name: "Growth exponent", description: "문제 크기 2배마다 leaf가 3배 늘어나는 비율입니다." },
          ]}
          assumptions={["두 operand 크기가 비슷하고 재귀가 고정 cutoff에서 basecase로 끝납니다.", "Addition과 carry 비용이 size에 선형이며 memory hierarchy 효과는 c에 숨깁니다.", "Θ 표기는 충분히 큰 n의 성장률이며 작은 입력 latency를 예측하지 않습니다."]}
          interpretation="지수가 2보다 작아 입력이 커질수록 schoolbook 대비 유리해집니다. 증명은 recurrence tree 각 level의 비용을 더하거나 Master theorem의 a=3,b=2,f(n)=Θ(n)을 적용합니다."
        />
        <p>
          이 복잡도는 정수 곱셈의 최종 답이 아닙니다. 더 큰 크기에서는 Toom-Cook,
          FFT 계열로 넘어갈 수 있습니다. 또한 Fp²→Fp⁶→Fp¹² tower에서 보이는
          “4→3”은 recursion depth가 아니라 서로 다른 coefficient algebra에 같은
          bilinear trick을 적용한 것입니다. 구체적인 3×6×3 비용 장부는
          <a className="text-primary hover:underline" href="/crypto/extension-fields">확장체 구현</a>에서
          parameter와 함께 읽어야 합니다.
        </p>
      </section>

      <section id="cost-comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 구현 선택</p>
          <h2 className="mt-2 text-2xl font-bold">Cutoff는 정리가 아니라 target의 측정값이다</h2>
        </header>
        <p>
          작은 n에서는 schoolbook이 단순한 loop, 적은 temporary, 좋은 vectorization
          덕분에 더 빠를 수 있습니다. Karatsuba는 세 recursive call을 만드는 대신
          합·차 buffer와 carry를 추가하므로 crossover는 CPU, limb width, compiler,
          allocator, squaring 여부에 따라 바뀝니다. 따라서 “몇 limb부터”라는 숫자는
          versioned tuning 결과로만 기록해야 합니다.
        </p>
        <div id="paper-gmp-karatsuba">
          <CitationBlock source="GNU MP 6.3.0 · Karatsuba Multiplication" citeKey={2} type="code" href="https://gmplib.org/manual/Karatsuba-Multiplication.html">
            <p><strong>문제:</strong> Production multiprecision implementation에서 split, sign, carry와 threshold를 어떻게 다루는지 설명합니다.</p>
            <p><strong>기여:</strong> 세 곱 공식, odd-size split, addition 비용과 MUL_TOOM22_THRESHOLD가 target tuning 대상임을 문서화합니다.</p>
            <p><strong>전제와 범위:</strong> GMP 6.3.0의 구현 설명입니다. 다른 library·CPU의 cutoff나 암호 field의 constant-time 성질을 대신하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Correctness gate</p><p className="mt-2 text-sm leading-6 text-muted-foreground">0·1·max limb, odd/even size, unequal length, carry cascade를 reference big integer와 비교합니다.</p></div>
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Cost ledger</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Mul·add/sub·temporary bytes·allocation·cache miss를 따로 기록해 “3곱”을 latency와 혼동하지 않습니다.</p></div>
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Paired benchmark</p><p className="mt-2 text-sm leading-6 text-muted-foreground">같은 input distribution에서 cutoff 주변 크기를 warmup하고 p50/p95, code path, CPU frequency를 함께 남깁니다.</p></div>
        </div>
        <p>
          10문항 역검사는 네 곱 전개, 1234×5678 계산, 세 곱 동일성, recurrence
          tree, cutoff 의미, extension-field 재사용 경계를 기초로 묻고, 심화에서는
          odd-limb schedule, n=8 leaf count 증명, overflow 반례, target별 benchmark
          gate를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
