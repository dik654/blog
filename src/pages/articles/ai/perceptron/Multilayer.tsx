import MultilayerViz from "./viz/MultilayerViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Multilayer() {
  return (
    <section id="multilayer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">다층 perceptron은 중간 표현을 학습합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          XOR은 원래 입력 평면에서 직선 하나로 분리할 수 없습니다. 하지만 은닉층이 서로 다른 경계를 만든 뒤 그 결과를 새 feature로 출력하면 다음 층에서는 선형 분리가
          가능해집니다. 다층 perceptron(MLP)의 핵심은 여러 affine transform 사이에 activation을 두어 입력 공간을 단계적으로 다시 표현하는 데 있습니다.
          단순히 뉴런 수를 늘리는 것으로는 되지 않습니다.
        </p>
        <p>
          예를 들어 두 은닉 뉴런이 OR과 NAND에 가까운 중간 feature를 만들고 출력층이 둘을 AND처럼 결합하면 XOR을 구성할 수 있습니다. 실제 학습에서는 사람이 이
          weight를 직접 정하지 않습니다. loss를 줄이는 backpropagation이 비슷한 중간 경계를 찾습니다.
        </p>
      </div>
      <MultilayerViz />
      <ExplainedFormula
        question="여러 affine layer를 쌓는 것만으로 XOR을 해결할 수 있을까?"
        idea={<>중간에 nonlinearity가 없으면 matrix multiplication과 bias가 다시 하나의 affine transform으로 합쳐집니다. 깊이는 늘어도 결정 경계 종류는 그대로입니다.</>}
        formula={String.raw`f(x)=W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)=W'x+b'`}
        annotatedFormula={String.raw`f(x)=\underbrace{W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)=W'x+b'}_{\text{오른쪽 항으로 결과 계산}}`}
        operations={[
          { expression: String.raw`W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)=W'x+b'`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","중간에 nonlinearity가 없으면 matrix","multiplication과 bias가 다시 하나의","affine transform으로 합쳐집니다."] },
        ]}
        terms={[
          { symbol: "W_1,b_1", name: "first affine layer", description: "입력을 중간 dimension으로 옮깁니다." },
          { symbol: "W_2,b_2", name: "second affine layer", description: "중간 값을 output space로 옮깁니다." },
          { symbol: "W',b'", name: "collapsed layer", description: "두 layer를 정확히 대체하는 하나의 affine transform입니다." },
        ]}
        assumptions={["두 layer 사이에 activation이나 normalization 같은 nonlinear operation이 없습니다."]}
        interpretation="따라서 MLP의 표현력은 layer 개수만이 아니라 affine transform 사이에 놓인 nonlinear activation에서 나옵니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Activation이 없으면 깊이는 표현력을 늘리지 못합니다</h3>
        <p>
          두 선형 변환을 연달아 적용해도 하나의 선형 변환으로 합칠 수 있습니다. 층 사이에 ReLU, sigmoid, tanh 같은 비선형 activation이 없다면 층을 여러 개
          쌓아도 XOR 문제는 그대로 남습니다. Activation은 출력 범위뿐 아니라 backward에서 전달되는 gradient 크기도 바꿉니다. 모델 깊이와 학습 안정성을 함께
          고려해 선택해야 하는 이유입니다.
        </p>
        <h3>Universal approximation과 효율적인 학습은 다른 주장입니다</h3>
        <p>
          Universal Approximation Theorem은 적절한 activation과 충분한 폭을 가진 network가 넓은 범위의 연속 함수를 원하는 오차 안에서 근사할 수
          있음을 말합니다. 그러나 필요한 뉴런 수, 데이터 양, optimizer가 실제 해를 찾는 과정까지 보장하지는 않습니다. 깊은 network는 앞 층의 feature를 재사용해
          계층적인 함수를 더 효율적으로 표현할 수 있습니다. 다만 문제 구조와 맞지 않으면 깊이 자체가 이점이 되지 않습니다.
        </p>
        <h3>현대 모델에서도 MLP는 feature 변환을 맡습니다</h3>
        <p>
          CNN의 classifier와 Transformer block의 feed-forward network처럼 MLP는 지금도 핵심 구성 요소입니다. CNN이나 attention이 공간·token 사이의 정보 이동 경로를 설계한다면, MLP는 각 위치에서 feature를 확장하고 다시 섞는 범용 계산을 담당합니다.
        </p>
      </div>
      <div
        id="paper-universal-approximation"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 해설 · Universal approximation
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          정리는 network를 학습시키는 방법이 아니라 해가 존재하는 함수족을
          설명합니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Cybenko는 continuous sigmoidal nonlinearity와 compact domain 같은 조건에서 단일 hidden layer의 finite linear
          combination이 연속 함수를 원하는 오차 안으로 uniform approximation할 수 있음을 보였습니다. 필요한 hidden unit 수, 유한 sample에서의
          generalization, optimizer가 그 parameter를 찾는 시간은 이 존재성 정리가 보장하지 않습니다.
        </p>
      </div>
    </section>
  );
}
