import ExplainedFormula from "@/components/ui/explained-formula";
import ButterflyViz from "./viz/ButterflyViz";

export default function Butterfly() {
  return (
    <section id="butterfly" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Butterfly는 even·odd 결과를 두 번 재사용한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          coefficient index를 even과 odd로 나누면 f(x)=E(x²)+xO(x²)입니다. ω²가 order n/2인 root이므로 E와 O는 각각 크기 n/2
          transform으로 계산할 수 있고, 결합 단계에서는 같은 두 intermediate로 서로 n/2 떨어진 output을 만듭니다.
        </p>
      </div>
      <ButterflyViz />
      <ExplainedFormula
        question="E[k]와 O[k] 한 쌍에서 NTT output 두 개를 어떻게 얻을까요?"
        idea="half-turn identity ω^(k+n/2)=−ω^k를 사용하면 odd contribution의 부호만 바뀌므로 새 sub-transform 없이 더하기와 빼기로 두 output을 만듭니다."
        formula={String.raw`y_k=E_k+\omega^kO_k,\qquad y_{k+n/2}=E_k-\omega^kO_k`}
        annotatedFormula={String.raw`y_k=\underbrace{E_k+\omega^kO_k,\qquad y_{k+n/2}=E_k-\omega^kO_k}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`E_k+\omega^kO_k,\qquad y_{k+n/2}=E_k-\omega^kO_k`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","half-turn identity ω^(k+n/2)=−ω^k를","사용하면 odd contribution의 부호만 바뀌므로 새","sub-transform 없이 더하기와 빼기로 두"] },
        ]}
        terms={[
          {
            symbol: "E_k",
            name: "even transform",
            description: "짝수 index coefficient의 n/2-point NTT 결과입니다.",
          },
          {
            symbol: "O_k",
            name: "odd transform",
            description: "홀수 index coefficient의 n/2-point NTT 결과입니다.",
          },
          {
            symbol: String.raw`\omega^k`,
            name: "twiddle factor",
            description:
              "odd 부분의 phase를 k번째 output에 맞추는 field 배율입니다.",
          },
          {
            symbol: "y_k,y_{k+n/2}",
            name: "paired outputs",
            description: "같은 intermediate를 공유하는 반대편 두 결과입니다.",
          },
        ]}
        assumptions={[
          "n은 짝수이고 ω는 primitive n-th root입니다.",
          "Radix-2 재귀를 끝까지 쓰려면 n은 2의 거듭제곱입니다.",
        ]}
        interpretation="각 recursion level은 전체 n개 값에 O(n) work를 하고 level은 log₂n개이므로 recurrence T(n)=2T(n/2)+O(n)=O(n log n)입니다."
      />
      <div
        id="paper-cooley-tukey"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · factorization
        </p>
        <p className="mt-2 text-sm font-semibold">
          Cooley &amp; Tukey (1965), An Algorithm for the Machine Calculation of
          Complex Fourier Series
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          composite length의 discrete Fourier sum을 효율적으로 계산하는 것이 문제입니다. 논문은 transform length를 factor에 따라 나누어
          intermediate를 재사용합니다. 원 논문이 다루는 대상은 complex arithmetic입니다. Finite-field에 적용하려면 primitive roots와
          invertible length라는 대수 조건이 더 필요합니다.
        </p>
        <a
          href="https://doi.org/10.1090/S0025-5718-1965-0178586-1"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          논문 원문 보기
        </a>
      </div>
    </section>
  );
}
