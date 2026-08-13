import ExplainedFormula from "@/components/ui/explained-formula";
import SchwartzZippelViz from "./viz/SchwartzZippelViz";

export default function SchwartzZippel() {
  return (
    <section id="schwartz-zippel" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Schwartz–Zippel: 항등식 검사를 확률로 압축하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prover가 두 거대한 다항식 P와 Q가 같다고 주장할 때 모든 계수를
          비교하는 대신, verifier는 예측하기 어려운 r을 고르고 P(r)=Q(r)인지
          확인할 수 있습니다. 거짓 주장의 차이 R=P−Q는 0이 아닌 다항식이므로
          무작위 점에서 우연히 0이 될 가능성이 작다는 것이 핵심입니다.
        </p>
      </div>
      <SchwartzZippelViz />
      <ExplainedFormula
        question="거짓 다항식 항등식이 무작위 검사 한 번을 통과할 확률은 얼마일까요?"
        idea="변수를 하나 고정하면 남은 변수의 다항식이 되고, univariate root bound를 변수별로 귀납 적용합니다. total degree d가 허용하는 나쁜 점의 비율은 최대 d/|S|입니다."
        formula={String.raw`R\not\equiv0,\ \deg R\le d,\ r\xleftarrow{\$}S^m\quad\Longrightarrow\quad \Pr[R(r)=0]\le\frac d{|S|}`}
        terms={[
          {
            symbol: "R",
            name: "difference polynomial",
            description: "P−Q로 만든 0이 아닌 m변수 다항식입니다.",
          },
          {
            symbol: "d",
            name: "total degree",
            description: "각 monomial의 지수 합 가운데 최댓값입니다.",
          },
          {
            symbol: "S",
            name: "challenge set",
            description: "각 좌표를 균등하게 고르는 유한 부분집합입니다.",
          },
          {
            symbol: "r",
            name: "random point",
            description: "S에서 독립적으로 뽑은 m개 좌표입니다.",
          },
        ]}
        assumptions={[
          "R은 challenge를 보기 전에 고정됩니다.",
          "좌표는 S에서 독립·균등하게 선택됩니다.",
          "d/|S|가 1보다 작을 만큼 S가 충분히 큽니다.",
        ]}
        interpretation="degree 3, |S|=101이면 한 번의 false acceptance는 최대 3/101입니다. 동일한 고정 R에 독립 challenge를 t번 쓰면 최대 (3/101)^t지만, challenge 재사용이나 adaptive polynomial에는 그대로 곱할 수 없습니다."
      />
      <div
        id="paper-schwartz-zippel"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · 확률적 항등식 검사
        </p>
        <p className="mt-2 text-sm font-semibold">
          Schwartz (1980), Fast Probabilistic Algorithms for Verification of
          Polynomial Identities
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 symbolic polynomial identity verification의 비용입니다. 논문은
          무작위 평가를 사용한 빠른 검증과 degree에 따른 오류 확률을 분석합니다.
          Bound는 uniformly sampled challenge와 고정된 nonzero polynomial을
          전제로 하며, 암호 프로토콜의 challenge 생성·commitment binding까지
          자동으로 증명하지는 않습니다.
        </p>
        <a
          href="https://doi.org/10.1145/322186.322189"
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
