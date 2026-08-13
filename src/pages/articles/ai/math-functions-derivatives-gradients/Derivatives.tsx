import ExplainedFormula from "@/components/ui/explained-formula";
import LocalLinearViz from "./viz/LocalLinearViz";

export default function Derivatives() {
  return (
    <section id="derivatives" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Derivative: 두 점의 평균 기울기를 한 점의 기울기로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          두 점을 잇는 직선의 기울기는 출력 변화량을 입력 변화량으로 나눈 평균 변화율입니다.
          두 번째 점을 첫 번째 점에 가까이 옮길수록 그 직선은 곡선에 접하는 선에 가까워집니다.
          이 극한이 derivative이며, 물리에서는 순간 속도, optimization에서는 parameter 변화에
          대한 loss의 민감도로 읽습니다.
        </p>
      </div>
      <LocalLinearViz />
      <ExplainedFormula
        question="f(x)=x²의 x=3에서 순간 기울기는 얼마일까요?"
        idea={<>폭 h만큼 떨어진 두 점의 평균 기울기를 계산한 뒤 h를 0으로 보냅니다. 남는 2x가 각 위치의 local slope입니다.</>}
        formula={String.raw`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}=\lim_{h\to0}(2x+h)=2x,\qquad f'(3)=6`}
        terms={[
          { symbol: "h", name: "작은 입력 변화", description: "0은 아니지만 0에 가까워지는 두 입력 사이의 간격입니다." },
          { symbol: String.raw`f(x+h)-f(x)`, name: "출력 변화", description: "입력을 h만큼 움직였을 때 함수값이 바뀐 양입니다." },
          { symbol: String.raw`f'(x)`, name: "derivative", description: "해당 지점에서 입력 1단위 변화당 출력이 바뀌는 local rate입니다." },
        ]}
        assumptions={["표준 derivative는 해당 지점에서 양쪽 difference quotient가 같은 값에 가까워져야 합니다.", "Derivative는 아주 작은 변화의 local approximation이며 큰 구간의 정확한 변화량을 항상 주지는 않습니다."]}
        interpretation="x=3 근처에서 Δx=0.01이면 Δf≈6×0.01=0.06입니다. 실제 변화 3.01²−3²=0.0601과 가깝지만 완전히 같지는 않습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Local linear approximation</h3>
        <p>
          충분히 작은 변화에서는 매끈한 곡선을 접선처럼 볼 수 있습니다. 그래서
          <code>f(x+Δx) ≈ f(x)+f&apos;(x)Δx</code>가 됩니다. Gradient descent와
          backpropagation은 복잡한 함수를 한 번에 푸는 대신 이 작은 변화의 예측을 반복해서 사용합니다.
        </p>
      </div>
    </section>
  );
}
