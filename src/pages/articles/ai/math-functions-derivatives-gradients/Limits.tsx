import ExplainedFormula from "@/components/ui/explained-formula";

export default function Limits() {
  return (
    <section id="limits" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">극한: 그 점의 값이 아니라 가까워질 때의 행동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          극한(limit)은 입력이 어떤 값에 가까워질 때 출력이 어디에 가까워지는지를 묻습니다.
          그 지점에서 함수값이 없거나 다른 값이어도 주변의 일관된 움직임은 말할 수 있습니다.
          미분에서 변화 간격 h를 정확히 0으로 놓으면 0으로 나누게 되므로, h가 0은 아니지만
          계속 가까워지는 상황을 극한으로 표현합니다.
        </p>
      </div>
      <ExplainedFormula
        question="x=1을 직접 넣으면 0/0이 되는데도 주변의 값은 어디로 모일까요?"
        idea={<>분자와 분모에 공통으로 들어 있는 x−1을 x≠1인 주변에서 약분합니다. 점 하나의 계산 실패와 주변의 추세를 구분하는 예입니다.</>}
        formula={String.raw`\lim_{x\to 1}\frac{x^2-1}{x-1}=\lim_{x\to 1}(x+1)=2`}
        terms={[
          { symbol: String.raw`x\to1`, name: "approach", description: "x가 1과 같다는 뜻이 아니라 양쪽에서 1에 한없이 가까워진다는 뜻입니다." },
          { symbol: String.raw`\lim`, name: "limit", description: "주변 입력의 출력이 가까워지는 목표값을 묻습니다." },
          { symbol: "2", name: "극한값", description: "x=1에서 원래 분수의 함수값과 별개로 주변 값이 모이는 곳입니다." },
        ]}
        assumptions={["x=1 자체가 아니라 x≠1인 충분히 가까운 점의 행동을 봅니다.", "왼쪽과 오른쪽에서 다가간 값이 같아야 하나의 양쪽 극한이 존재합니다."]}
        interpretation="x=0.9이면 1.9, x=0.99이면 1.99, x=1.01이면 2.01입니다. 직접 대입의 0/0은 극한이 없다는 결론이 아닙니다."
      />
    </section>
  );
}
