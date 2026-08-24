import ExplainedFormula from "@/components/ui/explained-formula";

export default function PolynomialArithmetic() {
  return (
    <section id="polynomial" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        유한체 위 다항식은 두 표현을 오갑니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          다항식은 계수 벡터로 저장하거나 여러 x에서의 평가값으로 저장할 수
          있습니다. 계수 표현은 덧셈과 degree 확인에 편하고, 같은 평가점에서의
          곱은 평가 표현에서 pointwise multiplication이 됩니다. Lagrange 보간과
          NTT는 이 두 표현 사이를 바꾸는 방법입니다.
        </p>
        <p>
          0이 아닌 다항식 A와 B의 곱에서는 degree(AB)=degree(A)+degree(B)가
          성립합니다. 다항식 division은 A=QB+R, degree(R)&lt;degree(B)인 Q와 R을
          유일하게 만듭니다. 이 유일성도 B의 leading coefficient로 나눌 수 있는
          field 위에서 보장됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="degree d 이하 다항식이 서로 다른 점 몇 개에서 0이 될 수 있을까요?"
        idea="root r을 하나 찾으면 (x−r)이 다항식을 나눕니다. root마다 서로 다른 일차 factor가 하나씩 필요하므로 degree보다 많은 root를 가질 수 없습니다."
        formula={String.raw`P\ne0,\ \deg P=d\quad\Longrightarrow\quad |\{r\in F:P(r)=0\}|\le d`}
        annotatedFormula={String.raw`P\ne0,\ \deg P=\underbrace{d\quad\Longrightarrow\quad |\{r\in F:P(r)=0\}|\le d}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`d\quad\Longrightarrow\quad |\{r\in F:P(r)=0\}|\le d`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","root r을 하나 찾으면 (x−r)이 다항식을 나눕니다."] },
        ]}
        terms={[
          {
            symbol: "P",
            name: "polynomial",
            description: "zero polynomial이 아닌 F[x]의 다항식입니다.",
          },
          {
            symbol: "d",
            name: "degree",
            description: "0이 아닌 최고차항의 지수입니다.",
          },
          {
            symbol: "r",
            name: "root",
            description: "P(r)=0을 만족하는 field 원소입니다.",
          },
        ]}
        assumptions={[
          "계수는 field에 속합니다.",
          "P는 모든 계수가 0인 zero polynomial이 아닙니다.",
        ]}
        interpretation="degree 2인 x²−1은 F₇에서 root 1과 6 두 개를 갖습니다. 반면 zero polynomial은 모든 점에서 0이므로 이 bound의 대상이 아닙니다."
      />
    </section>
  );
}
