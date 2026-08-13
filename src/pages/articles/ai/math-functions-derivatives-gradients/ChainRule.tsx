import ExplainedFormula from "@/components/ui/explained-formula";
import ChainRuleViz from "./viz/ChainRuleViz";

export default function ChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Chain rule: 연결된 변화율은 곱해진다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원화를 달러로 바꾸고 달러를 유로로 바꾸면, 원화당 유로의 환율은 두 환율의
          곱입니다. 함수 합성도 같습니다. x가 u를 얼마나 바꾸는지와 u가 y를 얼마나
          바꾸는지를 곱하면 x가 y를 얼마나 바꾸는지 얻습니다. Backpropagation은 이 규칙을
          계산 그래프의 뒤쪽부터 반복 적용합니다.
        </p>
      </div>
      <ChainRuleViz />
      <ExplainedFormula
        question="y=(3x+1)²에서 x가 조금 바뀔 때 y는 얼마나 바뀔까요?"
        idea={<>u=3x+1이라는 중간값을 드러내면 바깥 함수의 변화율 2u와 안쪽 함수의 변화율 3을 따로 구해 곱할 수 있습니다.</>}
        formula={String.raw`u=3x+1,\quad y=u^2\qquad\Longrightarrow\qquad \frac{dy}{dx}=\frac{dy}{du}\frac{du}{dx}=2u\cdot3=6(3x+1)`}
        terms={[
          { symbol: String.raw`du/dx`, name: "inner local derivative", description: "x 변화가 중간값 u에 전달되는 배율입니다." },
          { symbol: String.raw`dy/du`, name: "outer local derivative", description: "u 변화가 최종 출력 y에 전달되는 배율입니다." },
          { symbol: String.raw`dy/dx`, name: "composed derivative", description: "전체 경로를 지난 최종 변화 배율입니다." },
        ]}
        assumptions={["안쪽 함수가 해당 x에서, 바깥 함수가 해당 u에서 미분 가능해야 표준 chain rule을 그대로 적용할 수 있습니다.", "여러 경로가 합쳐지는 그래프에서는 각 경로의 기여를 더해야 합니다."]}
        interpretation="x=2이면 u=7이고 바깥 변화율은 14, 안쪽 변화율은 3이므로 전체 변화율은 42입니다."
        title="Local derivative를 재사용하는 이유"
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 아이디어와 적용 경계</h3>
        <p>
          작은 Δx가 Δu를 만들고, 그 Δu가 Δy를 만든다고 두면 Δy/Δx를
          (Δy/Δu)(Δu/Δx)로 나눌 수 있습니다. Δx가 0에 가까워질 때 각 비율이
          derivative에 가까워지므로 곱도 전체 derivative에 가까워집니다. 다만
          <code>y=|u|, u=x</code>를 x=0에서 보면 |x|의 왼쪽 기울기는 −1, 오른쪽은 1이라
          표준 derivative가 없습니다. 기호만 보고 chain rule을 적용해서 0이라고 정하면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
