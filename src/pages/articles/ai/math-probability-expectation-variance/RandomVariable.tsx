import ExplainedFormula from "@/components/ui/explained-formula";

export default function RandomVariable() {
  return (
    <section id="random-variable" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Random variable: outcome을 계산 가능한 숫자로 바꾸기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Random variable은 무작위로 움직이는 상자라는 뜻이 아니라 outcome에 숫자를 배정하는 함수입니다. 같은 outcome space에서도 “앞면 수”, “보상”, “sample gradient”처럼 질문에 맞는 서로 다른 random variable을 만들 수 있습니다.</p></div>
      <ExplainedFormula
        question="동전 두 번의 결과를 앞면 개수라는 숫자로 바꾸면 어떤 distribution이 생길까요?"
        idea={<>X가 outcome을 받아 앞면 개수를 반환하게 정의합니다. 여러 outcome이 같은 숫자에 대응하면 그 probability mass를 합칩니다.</>}
        formula={String.raw`X(HH)=2,\ X(HT)=X(TH)=1,\ X(TT)=0\quad\Longrightarrow\quad P(X=0,1,2)=\left(\frac14,\frac12,\frac14\right)`}
        terms={[{symbol:"X",name:"random variable",description:"Outcome을 실수값으로 보내는 함수입니다."},{symbol:"P(X=1)",name:"induced probability",description:"X가 1이 되는 outcome들의 probability 합입니다."},{symbol:"0,1,2",name:"support",description:"X가 실제로 가질 수 있는 값들입니다."}]}
        assumptions={["X의 정의는 실험의 probability를 바꾸지 않고 outcome을 숫자로 요약합니다.","Random variable의 이름은 대문자 X, 관측한 값은 소문자 x로 구분하는 경우가 많습니다."]}
        interpretation="X=1은 outcome HT와 TH 두 개를 포함하므로 probability가 1/2입니다."
      />
    </section>
  );
}
