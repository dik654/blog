import ExplainedFormula from "@/components/ui/explained-formula";
import DyingReLUViz from "./viz/DyingReLUViz";
import ReLUViz from "./viz/ReLUViz";

export default function ReLU() {
  return (
    <section id="relu" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ReLU: 양수 구간을 그대로 통과시키기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ReLU는 음수 입력을 0으로 만들고 양수 입력은 그대로 통과시킨다. 양수 구간의
          derivative가 1이므로 sigmoid나 tanh처럼 큰 양수에서 포화하지 않고, 함수와
          derivative 계산도 단순하다. 이런 성질 덕분에 deep convolutional network의
          학습을 실용적으로 만드는 데 중요한 역할을 했다.
        </p>
      </div>
      <ExplainedFormula
        question="양수 신호는 포화시키지 않고 음수 신호만 간단히 차단하려면?"
        idea={<>0보다 큰 입력에는 identity를 적용해 local derivative 1을 유지하고, 음수에는 0을 반환해 sparse activation을 만듭니다.</>}
        formula={String.raw`\operatorname{ReLU}(x)=\max(0,x),\qquad \operatorname{ReLU}'(x)=\begin{cases}1,&x>0\\0,&x<0\end{cases}`}
        terms={[
          { symbol: String.raw`\max(0,x)`, name: "rectification", description: "음수는 0으로 자르고 양수는 크기를 바꾸지 않고 통과시킵니다." },
          { symbol: "1", name: "positive local derivative", description: "양수 영역에서는 upstream gradient를 local scale로 줄이지 않습니다." },
          { symbol: "0", name: "negative local derivative", description: "음수 영역에서는 해당 뉴런을 통한 backward signal이 끊깁니다." },
        ]}
        assumptions={["x=0에는 표준 derivative가 없으며 framework가 subgradient convention을 정합니다.", "양수 구간의 derivative 1이 전체 network의 vanishing gradient를 없앤다는 뜻은 아닙니다."]}
        interpretation="Positive pre-activation에서는 포화하지 않지만, 학습 내내 negative에 머문 unit은 output과 gradient가 모두 0이 되어 dying ReLU가 될 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ReLU가 vanishing gradient를 완전히 없애는 것은 아니다. gradient는 weight
          matrix와 normalization, depth를 거치며 여전히 커지거나 작아질 수 있다.
          또한 한 뉴런의 pre-activation이 계속 음수이면 출력과 local gradient가 모두
          0이 되어 다시 활성화되기 어려운 <strong>dying ReLU</strong>가 생길 수 있다.
        </p>
        <h3>문제가 생겼을 때 확인할 것</h3>
        <p>
          너무 큰 learning rate나 부적절한 initialization은 activation 분포를 음수
          쪽으로 밀 수 있다. He initialization과 normalization으로 분포를 점검하고,
          필요하면 음수 구간에 작은 기울기를 남기는 Leaky ReLU 같은 변형을 고려한다.
          gradient clipping은 exploding gradient를 제한하는 도구이지 dying ReLU의
          직접적인 해법으로 보기는 어렵다.
        </p>
      </div>
      <div id="paper-relu" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20">
        <h3>논문으로 확인하기: rectifier가 겨냥한 문제</h3>
        <p>
          Nair와 Hinton의 연구는 ReLU가 모든 깊은 모델에서 최선이라고 증명한 논문이
          아니라, restricted Boltzmann machine의 hidden unit을 rectified linear unit으로
          바꿨을 때의 표현과 학습 결과를 제시한 초기 근거입니다. 이후 CNN의 성과와
          초기화 연구가 합쳐지며 rectifier가 널리 쓰였다는 범위를 구분해야 합니다.
        </p>
      </div>
      <ReLUViz />
      <div className="mt-8"><DyingReLUViz /></div>
    </section>
  );
}
