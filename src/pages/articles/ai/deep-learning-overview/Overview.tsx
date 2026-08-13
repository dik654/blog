import DepthCompositionViz from "./viz/DepthCompositionViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        핵심 아이디어: 표현을 배우고 오차로 고친다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          딥러닝은 “층이 많은 신경망”이라는 모양보다{" "}
          <strong>
            어떤 표현을 학습하고, 어떤 오차를 기준으로 파라미터를 고치는가
          </strong>
          로 이해하는 편이 정확합니다. 입력은 여러 층의 작은 함수들을 지나며
          task에 유용한 중간 표현으로 바뀌고, 출력의 loss는 backpropagation을
          통해 각 층의 파라미터를 바꿀 방향으로 전달됩니다.
        </p>
        <p>
          만능 근사 정리(universal approximation theorem)에 따르면 은닉층이 한
          개인 신경망도 뉴런을 충분히 많이 두면 넓은 범위의 연속 함수를 근사할
          수 있습니다. 그러나 이 정리는 주어진 함수에 필요한 뉴런 수, 유한한
          데이터로 그 파라미터를 찾을 수 있는지, 처음 보는 데이터에서도 잘
          작동하는지를 보장하지 않습니다.
        </p>

        <h3>깊이는 중간 계산을 재사용하는 방법이다</h3>
        <p>
          깊은 네트워크는 작은 함수를 여러 단계로 합성합니다. 앞 층에서 만든
          특징을 뒤 층이 다시 사용하므로, 반복되는 compositional structure를 한
          층에 모두 펼쳐 표현할 때보다 훨씬 작은 폭으로 나타낼 수 있는 함수족이
          있습니다. 이미지·언어처럼 부분 구조가 반복해서 결합되는 데이터에서
          깊이가 특히 자연스러운 이유입니다.
        </p>

        <h3>Representation learning은 feature engineering을 없애는 마법이 아니다</h3>
        <p>
          이미지 모델을 예로 들면 초기 층은 edge와 색 대비 같은 국소 패턴에
          반응하고, 중간 층은 이를 texture·part로 조합하며, 뒤쪽 층은 task
          output에 필요한 더 넓은 패턴을 만듭니다. 이처럼 중간 특징을 사람이
          전부 고정하지 않고 objective와 함께 학습하는 과정을{" "}
          <strong>representation learning</strong>이라고 합니다. 다만 어떤
          입력을 주고 어떤 loss와 data augmentation을 쓰는지는 여전히 사람이
          정하며, 그 선택이 모델이 배울 수 있는 표현의 범위를 제한합니다.
        </p>
      </div>

      <DepthCompositionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>깊이만 늘리면 충분하지 않다</h3>
        <p>
          깊이는 표현의 가능성을 늘리지만 gradient가 지나야 할 경로도 길게
          만듭니다. 초기화가 좋지 않거나 activation이 포화되면 앞 층까지 학습
          신호가 거의 도달하지 않을 수 있고, training loss조차 더 얕은 모델보다
          높아지는 optimization degradation도 생깁니다. Residual connection,
          normalization과 optimizer 연구는 이 간극을 줄이기 위해 발전했습니다.
        </p>
        <p>
          따라서 깊이가 주는 <strong>표현 효율</strong>, 실제 data에서 그 표현을
          찾는 <strong>optimization</strong>, 새 data에서도 유지되는{" "}
          <strong>generalization</strong>은 서로 다른 주장입니다. 모델을 비교할
          때는 parameter 수만 맞추지 말고 data budget, training compute,
          regularization과 평가 split도 함께 고정해야 합니다.
        </p>
      </div>

      <div
        id="paper-depth-benefit"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 해설 · Benefits of Depth
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          이론이 보인 것은 모든 문제의 승리가 아니라 특정 함수족의 depth
          separation입니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Telgarsky는 ReLU 등을 포함하는 semi-algebraic gate 조건에서, 깊은
          network가 작은 규모로 표현하는 특정 함수를 훨씬 얕은 network가
          근사하려면 width가 지수적으로 커지는 경우를 구성했습니다. 이는 깊이가
          별도의 표현 자원이라는 근거지만, 현실의 모든 dataset에서 더 깊은
          model이 자동으로 잘 학습되거나 정확해진다는 실험 결론은 아닙니다.
        </p>
      </div>

      <div
        id="paper-deep-learning"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 해설 · Deep Learning review
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          공통 아이디어는 여러 층의 표현과 backpropagation의 결합입니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          LeCun·Bengio·Hinton의 2015년 리뷰는 vision·speech·language의 성과를
          여러 층의 abstraction을 학습하고, 출력 오차로 각 층의 internal
          parameter를 바꾸는 흐름으로 묶었습니다. 다만 이 글은 당시까지의 연구를
          종합한 review이므로 특정 architecture의 보편적 우월성을 검증한 단일
          통제 실험으로 읽으면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
