import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernFrobeniusViz from "./viz/ModernFrobeniusViz";

export default function ModernFrobeniusArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">유한체의 p제곱 구조</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Frobenius는 큰 거듭제곱을 basis 변환으로 바꾼다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Pairing의 final exponentiation에는 xᵖ, x^(p²)처럼 지수가 매우 큰 연산이
          반복됩니다. 일반 square-and-multiply로 계산하면 비싸지만, characteristic p인
          finite field에서는 <strong>Frobenius map</strong> φ(x)=xᵖ가 덧셈과 곱셈을
          보존하는 자기동형사상입니다. Extension field를 고정된 basis로 표현하면 이
          map을 coefficient 재배열, 부호 변경, 미리 계산한 상수 곱으로 실행할 수 있습니다.
        </p>
        <p>
          Characteristic p라는 말은 1을 p번 더하면 0이 된다는 뜻입니다. 그래서 binomial coefficient C(p,i)가 0&lt;i&lt;p에서 p의 배수이고
          (a+b)ᵖ=aᵖ+bᵖ가 됩니다. Base field Fp에서는 aᵖ=a이지만 extension field Fpᵏ에서는 coefficient가 고정돼도 추가한 basis 원소가
          움직이므로 φ가 nontrivial합니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> “p제곱을 생략”하는 것이 아닙니다. 선택한
          irreducible polynomial과 tower basis에서 p제곱이 각 basis unit을 어디로
          보내는지 미리 계산한 뒤, runtime에는 그 linear action만 적용합니다.
        </aside>
        <ContentBoundary article="frobenius-optimization" />
      </section>

      <section id="coeff-rearrange" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 자기동형사상</p>
          <h2 className="mt-2 text-2xl font-bold">왜 x↦xᵖ가 field 연산을 보존하는가</h2>
        </header>
        <ExplainedFormula
          question="Characteristic p field에서 p제곱 map이 덧셈과 곱셈을 보존하는 이유는 무엇인가?"
          idea={<>Binomial expansion의 가운데 coefficient가 모두 p의 배수라 field 안에서 0이 됩니다. 곱셈은 exponent 법칙으로 바로 보존됩니다.</>}
          formula={String.raw`\varphi(x)=x^p,\qquad \varphi(a+b)=(a+b)^p=a^p+b^p,\qquad \varphi(ab)=a^pb^p`}
          annotatedFormula={String.raw`\varphi(x)=\underbrace{x^p,\qquad \varphi(a+b)=(a+b)^p=a^p+b^p,\qquad \varphi(ab)=a^pb^p}_{\text{Frobenius map 계산}}`}
          operations={[
            { expression: String.raw`x^p,\qquad \varphi(a+b)=(a+b)^p=a^p+b^p,\qquad \varphi(ab)=a^pb^p`, annotation: ["Frobenius map이(가) 식의 결과에 기여하는 방식을","계산합니다.","Binomial expansion의 가운데","coefficient가 모두 p의 배수라 field 안에서"] },
          ]}
          terms={[
            { symbol: "p", name: "Characteristic prime", description: "Base field Fp의 소수 modulus입니다." },
            { symbol: String.raw`\varphi`, name: "Frobenius map", description: "Field 원소를 p제곱하는 함수입니다." },
            { symbol: "a,b", name: "Field elements", description: "Fp 또는 그 extension Fp^k의 임의 원소입니다." },
          ]}
          assumptions={["Field의 characteristic이 소수 p이며 exponentiation과 addition이 같은 field 안에서 수행됩니다.", "Fp^k는 irreducible polynomial quotient로 구성돼 모든 nonzero 원소에 inverse가 있습니다.", "구현 representation이 Montgomery form이어도 map 전후의 mathematical field identity는 같아야 합니다."]}
          interpretation="φ는 0과 1, 덧셈, 곱셈을 보존합니다. Finite field에서는 bijection이므로 automorphism입니다. 이 성질만으로 특정 coefficient table이나 memory layout이 맞다는 결론은 나오지 않습니다."
        />
        <p>
          증명 아이디어를 한 단계 더 내려가면, (a+b)ᵖ의 가운데 항에는 C(p,i)aⁱb^(p−i)가 붙습니다. p가 소수라 C(p,i)는 p로 나누어떨어져 characteristic
          p field에서는 0입니다. finite set에서 xᵖ map의 kernel은 0뿐이므로 injective이고 finite set의 injective map은
          surjective입니다. 합성수 modulus ring에서는 같은 논리로 automorphism이라고 부르지 못합니다.
        </p>
        <ExplainedFormula
          question="Fp^k에서 Frobenius를 몇 번 적용하면 원래 원소로 돌아오는가?"
          idea={<>Fp^k의 모든 nonzero 원소는 크기 p^k−1인 multiplicative group에 있으므로 x^(p^k−1)=1이고, 0에도 식이 성립합니다.</>}
          formula={String.raw`\varphi^j(x)=x^{p^j},\qquad \varphi^k(x)=x^{p^k}=x`}
          annotatedFormula={String.raw`\varphi^j(x)=\underbrace{x^{p^j},\qquad \varphi^k(x)=x^{p^k}=x}_{\text{Full cycle 계산}}`}
          operations={[
            { expression: String.raw`x^{p^j},\qquad \varphi^k(x)=x^{p^k}=x`, annotation: ["Full cycle이(가) 식의 결과에 기여하는 방식을","계산합니다.","Fp^k의 모든 nonzero 원소는 크기 p^k−1인","multiplicative group에 있으므로"] },
          ]}
          terms={[
            { symbol: "k", name: "Extension degree", description: "Fp 위 vector-space dimension이며 field 크기는 p^k입니다." },
            { symbol: "j", name: "Frobenius power", description: "Map을 반복 적용한 횟수입니다." },
            { symbol: String.raw`\varphi^k`, name: "Full cycle", description: "모든 Fp^k 원소를 고정하는 identity map입니다." },
          ]}
          assumptions={["x는 정확히 Fp^k의 원소이고 field profile이 실행 중 바뀌지 않습니다.", "k는 ambient extension degree이며 subfield 원소는 더 짧은 cycle을 가질 수 있습니다.", "Cycle identity는 coefficient order 검산 하나이지 전체 pairing correctness 증명은 아닙니다."]}
          interpretation="Fp12에서는 φ^12(x)=x를 negative test로 쓸 수 있습니다. 그러나 어떤 x는 Fp2 같은 subfield에 있어 더 일찍 돌아오므로 한 test vector의 정확한 cycle 길이가 항상 12라는 뜻은 아닙니다."
        />
      </section>

      <section id="why-free" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 비용을 낮추는 방법</p>
          <h2 className="mt-2 text-2xl font-bold">Basis unit의 p제곱을 table로 고정한다</h2>
        </header>
        <p>
          x=∑cᵢeᵢ로 적으면 cᵢ는 base-field coefficient이고 eᵢ는 tower basis unit입니다. cᵢᵖ=cᵢ이므로 φ(x)=∑cᵢeᵢᵖ입니다. 결국
          runtime에 필요한 것은 각 eᵢᵖ를 같은 basis로 다시 나타내는 coefficient뿐입니다. Tower가 special form이면 이 matrix action은
          permutation과 conjugation, constant multiplication 몇 개로 줄어듭니다.
        </p>
        <ModernFrobeniusViz />
        <p>
          “Frobenius가 무료다”라는 말은 full variable×variable Fp12 multiplication이나 수천 bit exponentiation보다 싸다는 상대적
          표현입니다. 실제 구현에는 Fp2 conjugation과 precomputed coefficient load, constant multiplication, memory
          access가 그대로 남습니다. power j에 쓸 table index는 j mod k입니다. table이 다른 non-residue나 coefficient order에서
          만들어졌다면 그럴듯한 오답이 나옵니다.
        </p>
        <div id="paper-arkworks-frobenius-source">
          <CitationBlock source="arkworks algebra 0.5.0 · Fp12 Frobenius source" citeKey={1} type="code" href="https://github.com/arkworks-rs/algebra/blob/7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c/ff/src/fields/models/fp12_2over3over2.rs">
            <p><strong>문제:</strong> Fp12 quadratic extension에서 p-power action을 generic exponentiation 없이 실행합니다.</p>
            <p><strong>기여:</strong> Pinned source의 degree 12, Frobenius coefficient table, `power % 12` dispatch와 base-field coefficient 적용 seam을 보여 줍니다.</p>
            <p><strong>전제와 범위:</strong> ark-ff 0.5.0 commit 7ad88c46…의 generic 2-over-3-over-2 model에 한정됩니다. BN254의 실제 상수는 curve profile source와 함께 고정해야 합니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="in-final-exp" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Final exponentiation</p>
          <h2 className="mt-2 text-2xl font-bold">지수를 p의 다항식으로 분해해 cheap map을 끼운다</h2>
        </header>
        <p>
          Pairing의 Miller output을 order r인 target group으로 보내려면 (p^k−1)/r만큼 거듭제곱합니다. k=12인 BN 계열에서는 p^12−1의
          factorization을 이용해 easy part와 hard part를 나눕니다. Easy part는 inverse, conjugation, Frobenius와 적은
          multiplication으로 처리하고 hard part는 curve parameter에 맞춘 addition chain과 cyclotomic squaring을 씁니다.
        </p>
        <ExplainedFormula
          question="Embedding degree 12의 final exponent를 어떤 두 부분으로 나눌 수 있는가?"
          idea={<>p^12−1을 (p^6−1)(p^6+1)로 나누고 p^6+1=(p^2+1)(p^4−p^2+1)을 사용합니다. Target subgroup order r이 마지막 cyclotomic factor를 나누는 profile에서 앞 두 factor를 easy part로 처리합니다.</>}
          formula={String.raw`\frac{p^{12}-1}{r}=(p^6-1)(p^2+1)\cdot\frac{p^4-p^2+1}{r}`}
          annotatedFormula={String.raw`\frac{p^{12}-1}{r}=\underbrace{(p^6-1)(p^2+1)\cdot\frac{p^4-p^2+1}{r}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`(p^6-1)(p^2+1)\cdot\frac{p^4-p^2+1}{r}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","p^12−1을 (p^6−1)(p^6+1)로 나누고","p^6+1=(p^2+1)(p^4−p^2+1)을 사용합니다."] },
          ]}
          terms={[
            { symbol: "p", name: "Base-field characteristic", description: "Pairing-friendly curve가 정의된 prime field의 modulus입니다." },
            { symbol: "r", name: "Target subgroup order", description: "G1, G2와 pairing target subgroup이 공유하는 prime order입니다." },
            { symbol: "(p^6-1)(p^2+1)", name: "Easy part", description: "Conjugation·inverse·Frobenius를 활용하기 좋은 factor입니다." },
            { symbol: "(p^4-p^2+1)/r", name: "Hard part", description: "Curve family parameter와 addition chain 최적화가 필요한 factor입니다." },
          ]}
          assumptions={["대상 curve의 embedding degree가 12이고 r이 p^4−p^2+1을 나누는 profile입니다.", "Miller output이 0이 아니며 field inverse와 conjugation contract가 맞습니다.", "다른 embedding degree나 curve family에는 다른 factorization과 chain이 필요합니다."]}
          interpretation="Frobenius는 p의 거듭제곱 factor를 싸게 처리하게 하지만 hard part 전체를 없애지는 않습니다. 이 factorization을 모든 Fp12 사용 사례의 보편 exponent schedule로 쓰면 안 됩니다."
        />
        <div id="paper-final-exponentiation">
          <CitationBlock source="Scott et al. · On the final exponentiation for calculating pairings" citeKey={2} href="https://eprint.iacr.org/2008/490">
            <p><strong>문제:</strong> Miller loop 최적화 뒤 상대적으로 커진 final exponentiation 비용을 pairing-friendly curve 구조로 줄입니다.</p>
            <p><strong>기여:</strong> Easy/hard factorization과 Frobenius·curve-family parameter를 결합한 exponentiation 전략을 분석합니다.</p>
            <p><strong>전제와 범위:</strong> 논문이 다룬 ordinary pairing-friendly curve와 parameterization에 귀속되며, 임의 field·curve·현대 library의 최적 chain이나 고정 speedup을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="concrete" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 작은 예와 release gate</p>
          <h2 className="mt-2 text-2xl font-bold">F3²에서는 conjugation을 손으로 검산할 수 있다</h2>
        </header>
        <p>
          F3[u]/(u²+1)을 보겠습니다. u²=−1=2이고 φ(a+bu)=(a+bu)³입니다. 가운데 binomial 항은 characteristic 3에서 사라지고
          u³=u·u²=2u이므로 φ(a+bu)=a−bu입니다. x=1+u라면 φ(x)=1+2u이고 다시 적용하면 φ²(x)=1+u로 돌아옵니다. 이 작은 예 하나로 coefficient
          conjugation과 degree-2 cycle을 한꺼번에 확인합니다.
        </p>
        <ExplainedFormula
          question="F3²의 x=1+u에 Frobenius를 적용한 결과를 어떻게 손으로 확인하는가?"
          idea={<>Characteristic 3에서 (1+u)^3=1+u^3이고, defining relation u²=2를 한 번 적용해 u³=2u로 줄입니다.</>}
          formula={String.raw`\varphi(1+u)=(1+u)^3=1+u^3=1+2u,\qquad \varphi^2(1+u)=1+u`}
          annotatedFormula={String.raw`\varphi(1+u)=\underbrace{(1+u)^3=1+u^3=1+2u,\qquad \varphi^2(1+u)=1+u}_{\text{Frobenius 계산}}`}
          operations={[
            { expression: String.raw`(1+u)^3=1+u^3=1+2u,\qquad \varphi^2(1+u)=1+u`, annotation: ["Frobenius이(가) 식의 결과에 기여하는 방식을","계산합니다.","Characteristic 3에서","(1+u)^3=1+u^3이고, defining relation"] },
          ]}
          terms={[
            { symbol: "u", name: "Extension basis unit", description: "u²+1=0, 즉 u²=2를 만족하는 새 원소입니다." },
            { symbol: String.raw`\varphi`, name: "Frobenius", description: "이 degree-2 field에서 세제곱하는 map입니다." },
            { symbol: "2u", name: "Conjugated coefficient", description: "F3에서 −u와 같은 표현입니다." },
          ]}
          assumptions={["u²+1은 F3에서 root가 없어 irreducible이므로 quotient가 9원소 field입니다.", "Coefficient는 매 연산 뒤 mod 3으로 환원합니다.", "이 단순 부호 반전은 degree-2 예이며 Fp12 전체 slot에 그대로 적용하지 않습니다."]}
          interpretation="두 번 적용해 원래 값으로 돌아오고, 직접 세제곱한 결과와 table 결과가 같아야 합니다. F5에서 u²+1은 reducible하므로 같은 표기를 field 예로 재사용할 수 없습니다."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Parameter receipt</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            p와 tower polynomial, non-residue, basis order, table, library SHA를 묶어 하나의 profile ID로 만듭니다.
          </p></div>
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Algebra parity</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            Basis unit과 random x, product 보존, φ^12, 그리고 independent x^(p^j)를 비교합니다.
          </p></div>
          <div className="rounded-lg border border-border bg-card p-4"><p className="text-sm font-semibold">Performance last</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            Correctness와 pairing vector가 맞은 뒤에 exponentiation과 Frobenius의 mul/load/cycle을 같은 target에서 측정합니다.
          </p></div>
        </div>
        <p>
          10문항 역검사에서는 characteristic p와 Freshman&apos;s dream, F3² conjugation, φ^k cycle, coefficient table,
          “무료”라는 표현의 경계를 기초로 확인합니다. 심화에서는 automorphism 증명과 reducible quotient 반례, degree-12 exponent
          factorization, wrong-table release fixture를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
