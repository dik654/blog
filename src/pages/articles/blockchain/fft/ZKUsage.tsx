import ExplainedFormula from "@/components/ui/explained-formula";

export default function ZKUsage() {
  return (
    <section id="zk-usage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Padding·representation·memory traffic이 실제 선택을 정한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          coefficient 길이가 각각 Lₐ,Lᵦ인 두 다항식의 linear product에는 Lₐ+Lᵦ−1개 coefficient가 필요합니다. Transform length가 더
          작으면 high-degree coefficient가 xⁿ=1 관계로 앞쪽에 감겨 cyclic convolution이 되므로 보통은 필요한 길이 이상인 지원 radix 크기로
          zero-padding합니다.
        </p>
        <p>
          예를 들어 A=1+x²와 B=1+x의 linear product는 1+x+x²+x³입니다. 길이 3
          transform을 쓰면 quotient ring에서 x³=1로 환원되어 2+x+x²가 나오므로
          원래 coefficient를 잃습니다. 결과 길이 4를 담는 n=4 domain을 선택해야
          이 wrap-around가 사라집니다.
        </p>
      </div>
      <ExplainedFormula
        question="두 다항식의 linear product를 NTT로 계산할 때 transform length를 어떻게 정할까요?"
        idea="곱의 최대 degree를 담을 수 있을 만큼 evaluation points를 확보하고, 두 input을 같은 길이로 padding한 뒤 transform·pointwise product·inverse를 수행합니다."
        formula={String.raw`n\ge L_a+L_b-1,\qquad c=\operatorname{INTT}_n\!\left(\operatorname{NTT}_n(a)\odot\operatorname{NTT}_n(b)\right)`}
        annotatedFormula={String.raw`n\ge L_a+L_b-1,\qquad c=\underbrace{\operatorname{INTT}_n\!\left(\operatorname{NTT}_n(a)\odot\operatorname{NTT}_n(b)\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\operatorname{INTT}_n\!\left(\operatorname{NTT}_n(a)\odot\operatorname{NTT}_n(b)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","곱의 최대 degree를 담을 수 있을 만큼","evaluation points를 확보하고, 두 input을","같은 길이로 padding한 뒤"] },
        ]}
        terms={[
          {
            symbol: "L_a,L_b",
            name: "coefficient lengths",
            description: "두 input polynomial의 저장된 계수 개수입니다.",
          },
          {
            symbol: "n",
            name: "domain size",
            description:
              "field가 지원하고 결과 길이 이상인 transform length입니다.",
          },
          {
            symbol: String.raw`\odot`,
            name: "pointwise product",
            description: "같은 evaluation index끼리 곱하는 O(n) 연산입니다.",
          },
          {
            symbol: "c",
            name: "linear product",
            description: "길이 Lₐ+Lᵦ−1인 coefficient 결과입니다.",
          },
        ]}
        assumptions={[
          "같은 field·root·ordering·normalization 계약을 사용합니다.",
          "n은 field가 지원하는 root order이며 결과 길이 이상입니다.",
        ]}
        interpretation="길이 3과 2의 곱에는 최소 n=4가 필요합니다. n=3으로 계산하면 x³ 이상의 항이 상수항 쪽으로 감겨 다른 polynomial product가 됩니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>프로버에서는 transform 횟수보다 전체 data movement를 봅니다</h3>
        <p>
          PLONK 계열은 witness의 coefficient/evaluation form 변환과 quotient 계산, coset evaluation에서 여러 NTT를 수행합니다.
          FRI 계열은 low-degree extension을 위해 큰 evaluation domain을 만듭니다. “증명 시간의 몇 퍼센트” 같은 숫자는 protocol과 domain
          size, field arithmetic, batch, CPU/GPU와 memory layout에 따라 달라지므로 보편값으로 쓰지 않습니다. 실제 선택은
          forward/inverse 횟수와 permutation pass, twiddle storage를 놓고 field multiplication throughput과 host-
          device transfer, end-to-end trace까지 함께 보고 판단합니다.
        </p>
        <h3>구현 검증 체크리스트</h3>
        <p>
          작은 vector에서는 direct O(n²) NTT와 fast NTT를 비교하고 INTT(NTT(a))=a round trip을 검사합니다. 이어서 random
          polynomial product를 schoolbook result와 비교한 뒤 natural/bit-reversed order와 inverse normalization을 API
          contract에 기록합니다. Benchmark는 같은 input·field·transform direction·batch에서 kernel time과 end-to-end time을
          함께 측정합니다.
        </p>
      </div>
    </section>
  );
}
