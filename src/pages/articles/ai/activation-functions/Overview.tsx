import LinearVsNonlinearViz from "./viz/LinearVsNonlinearViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          신경망의 한 층은 입력에 weight를 곱하고 bias를 더하는 선형 변환부터
          수행한다. 그런데 선형 변환만 여러 번 이어 붙이면 전체 계산도 다시
          하나의 선형 변환으로 합쳐진다. 층을 깊게 쌓더라도 XOR, 이미지의 곡선
          경계, 언어 문맥처럼 비선형인 패턴을 표현할 수 없는 이유다.
        </p>
        <p className="leading-7">
          <strong>activation function</strong>은 선형 변환 뒤에 비선형성을
          추가한다. 각 층이 입력 공간을 다른 방식으로 구부리고 다시 조합할 수
          있게 되면서, network 전체가 훨씬 복잡한 함수를 표현할 수 있다. 만능
          근사 정리(universal approximation theorem)는 이 표현력이 충분히 넓어질
          수 있다는 이론적 배경을 제공하지만, 실제 학습이 쉽거나 효율적이라는
          뜻은 아니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <LinearVsNonlinearViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          활성화 함수 필수 요건
        </h3>
        <p className="leading-7">
          가장 중요한 조건은 비선형성이다. gradient descent로 학습하려면 거의
          모든 지점에서 유용한 gradient를 제공해야 하며, 계산 비용과 출력 범위,
          zero-centered 여부도 optimization에 영향을 준다. ReLU처럼 한 점에서
          미분되지 않아도 subgradient를 정해 학습할 수 있으므로 “모든 지점에서
          미분 가능해야 한다”를 절대 조건으로 볼 필요는 없다.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">선택 기준은 목적에 따라 달라진다</h3>
        <p className="leading-7">
          초기 threshold와 sigmoid 계열에서 ReLU, GELU, SwiGLU로 선택지가 넓어진
          과정은 단순한 세대교체가 아니다. 각 함수는 gradient 흐름, 계산 비용,
          gating 방식에서 서로 다른 장단점을 지니므로 CNN과 Transformer 등
          architecture와 학습 조건에 따라 선택이 달라진다.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          정리하면 activation function은 network에 비선형 표현력을 더하는 동시에
          gradient가 어떤 형태로 흐를지를 결정한다. ReLU는 양수 구간에서
          gradient를 보존하고 계산이 단순해 깊은 network 학습을 크게 도왔지만,
          모든 기울기 소실을 해결하지는 않는다. 따라서 architecture의 관례를
          출발점으로 삼되 실제 training stability와 validation 성능을 함께
          확인해야 한다.
        </p>
      </div>
    </section>
  );
}
