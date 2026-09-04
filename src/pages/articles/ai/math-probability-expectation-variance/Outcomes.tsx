import ExplainedFormula from "@/components/ui/explained-formula";

export default function Outcomes() {
  return (
    <section id="outcomes" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Outcome과 probability distribution: 무엇이 일어날 수 있는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
            실험은 결과가 아직 정해지지 않은 절차이고 outcome은 실제로 나온 결과 하나입니다. 가능한 outcome 전체를 sample space라고 부릅니다. 질문이 정해지면 그
            질문을 만족하는 outcome들을 event라는 부분집합으로 묶습니다.
          </p>
        <p>
            Probability distribution은 각 outcome에 0 이상인 mass를 배정하며 전체 합은 1이어야 합니다. 서로 겹치지 않는 outcome이나 event의
            probability는 더할 수 있지만 겹치는 event를 더할 때는 intersection을 두 번 세지 않도록 빼야 합니다.
          </p>
      </div>
      <ExplainedFormula
        question="공정한 동전을 두 번 던질 때 가능한 결과와 확률을 어떻게 적을까요?"
        idea={<>두 번의 순서를 보존해 네 outcome을 만들고, 서로 겹치지 않는 outcome의 probability를 합하면 전체 1이 됩니다.</>}
        formula={String.raw`\Omega=\{HH,HT,TH,TT\},\qquad P(\omega)=\frac14,\qquad \sum_{\omega\in\Omega}P(\omega)=1`}
        terms={[{symbol:"\\Omega",name:"sample space",description:"실험에서 가능한 모든 outcome의 집합입니다."},{symbol:"\\omega",name:"outcome",description:"실험을 한 번 수행해 실제로 관측한 결과 하나입니다."},{symbol:"P(\\omega)",name:"probability mass",description:"해당 outcome이 나타날 상대적 가능성입니다."},{symbol:"A",name:"event",description:"질문을 만족하는 outcome을 모은 sample space의 부분집합입니다."}]}
        assumptions={["두 toss가 공정하고 서로 독립이라고 가정합니다.","HT와 TH처럼 순서가 다른 결과를 서로 다른 outcome으로 셉니다."]}
        interpretation="앞면이 정확히 한 번 나오는 event는 {HT,TH}이므로 probability는 1/4+1/4=1/2입니다."
      />
    </section>
  );
}
