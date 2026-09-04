import ExplainedFormula from "@/components/ui/explained-formula";

export default function PrimeField() {
  return (
    <section id="prime-field" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">소수체의 나눗셈과 곱셈군</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fₚ에서는 정수를 계산한 뒤 p로 나눈 나머지를 취합니다. p가 소수이면 1,…,p−1 가운데 어떤 값도 p와 공약수를 갖지 않으므로 extended Euclidean
          algorithm이 ax+py=1을 만드는 x를 찾습니다. 이 x mod p가 a의 곱셈 역원입니다. 합성수 modulus에서는 zero divisor가 생길 수 있어 같은 결론이
          성립하지 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Fₚ에서 0이 아닌 a로 어떻게 나눌까요?"
        idea="Fermat의 소정리 a^(p−1)=1의 양변에서 a 한 개를 분리하면 a^(p−2)가 a의 역원입니다. 구현에서는 exponentiation 또는 extended Euclidean algorithm을 선택합니다."
        formula={String.raw`a^{-1}\equiv a^{p-2}\pmod p,\qquad b/a\equiv b\,a^{-1}\pmod p`}
        annotatedFormula={String.raw`\underbrace{a^{-1}\equiv a^{p-2}\pmod p,\qquad b/a\equiv b\,a^{-1}\pmod p}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`a^{-1}\equiv a^{p-2}\pmod p,\qquad b/a\equiv b\,a^{-1}\pmod p`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Fermat의 소정리 a^(p−1)=1의 양변에서 a 한 개를","분리하면 a^(p−2)가 a의 역원입니다."] },
        ]}
        terms={[
          {
            symbol: "p",
            name: "prime modulus",
            description: "field의 원소 수인 소수입니다.",
          },
          {
            symbol: "a",
            name: "divisor",
            description: "0이 아닌 field 원소입니다.",
          },
          {
            symbol: "a^{-1}",
            name: "multiplicative inverse",
            description: "a·a⁻¹=1을 만족하는 유일한 원소입니다.",
          },
          {
            symbol: "b/a",
            name: "field division",
            description: "정수 몫이 아니라 b에 a의 역원을 곱한 값입니다.",
          },
        ]}
        assumptions={[
          "p는 소수이고 a≠0입니다.",
          "모든 equality는 Fₚ, 즉 mod p에서 읽습니다.",
        ]}
        interpretation="F₇에서 3⁻¹=3⁵=5이고 6/3=6·5=30≡2입니다. modulus 8에서는 2·4=0인 zero divisor가 있어 2의 역원이 없으므로 F₈을 정수 mod 8로 만들 수 없습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Fₚ*는 p−1개 원소를 가진 cyclic group입니다</h3>
        <p>
          0을 뺀 Fₚ*는 곱셈에 대해 순환군(cyclic group)입니다. 어떤 생성원 g의 거듭제곱은 모든 0이 아닌 원소를 한 번씩 방문합니다. 원소 a의 order는 aᵈ=1이
          되는 가장 작은 양의 d이며 Lagrange theorem에 따라 d는 p−1을 나눕니다. 생성원은 order가 정확히 p−1인 원소입니다.
        </p>
      </div>

      <ExplainedFormula
        question="후보 g가 Fₚ* 전체를 생성하는지 어떻게 검사할까요?"
        idea="p−1의 각 서로 다른 소인수 q마다 g를 (p−1)/q번 거듭제곱했을 때 1이 아니면, g의 order가 어느 proper divisor에도 갇힐 수 없습니다."
        formula={String.raw`g\text{ is primitive}\iff g^{(p-1)/q}\not\equiv1\pmod p\quad\text{for every prime }q\mid(p-1)`}
        annotatedFormula={String.raw`\underbrace{g\text{ is primitive}\iff g^{(p-1)/q}\not\equiv1\pmod p\quad\text{for every prime }q\mid(p-1)}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`g\text{ is primitive}\iff g^{(p-1)/q}\not\equiv1\pmod p\quad\text{for every prime }q\mid(p-1)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","p−1의 각 서로 다른 소인수 q마다"] },
        ]}
        terms={[
          {
            symbol: "g",
            name: "generator candidate",
            description: "Fₚ*의 후보 원소입니다.",
          },
          {
            symbol: "q",
            name: "prime divisor",
            description: "p−1을 나누는 서로 다른 소인수입니다.",
          },
          {
            symbol: "p−1",
            name: "group order",
            description: "Fₚ*의 전체 원소 수입니다.",
          },
        ]}
        assumptions={[
          "p−1의 서로 다른 소인수를 알고 있어야 합니다.",
          "g는 0이 아닌 Fₚ 원소입니다.",
        ]}
        interpretation="F₁₇에서 g=3은 q=2에 대해 3⁸=16≠1이므로 order 16이고 생성원입니다. NTT의 크기 n 단위근은 n|(p−1)일 때 g^((p−1)/n)로 얻습니다."
      />
    </section>
  );
}
