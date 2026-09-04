const milestones = [
  {
    period: "1943–1958",
    title: "계산 가능한 뉴런과 퍼셉트론",
    detail:
      "뉴런을 논리 계산으로 단순화하고, Rosenblatt의 퍼셉트론이 데이터로 weight를 조정하는 학습 규칙을 제시했습니다.",
  },
  {
    period: "1969–1986",
    title: "단층의 한계에서 다층 학습으로",
    detail:
      "XOR 같은 선형 분리 불가능 문제와 계산 자원의 제약이 드러났고, backpropagation이 hidden representation을 학습하는 실용적 경로를 열었습니다.",
  },
  {
    period: "1989–2011",
    title: "CNN·LSTM과 표현 학습의 축적",
    detail:
      "LeNet, LSTM, unsupervised pretraining처럼 이미지와 sequence에 맞는 구조가 발전했지만 데이터와 compute가 여전히 병목이었습니다.",
  },
  {
    period: "2012–현재",
    title: "대규모 데이터·accelerator·architecture의 결합",
    detail:
      "AlexNet 이후 GPU 학습이 보편화됐고, residual network와 Transformer가 더 큰 모델을 안정적으로 학습하는 기반을 만들었습니다.",
  },
] as const;

export default function History() {
  return (
    <section id="history" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝의 초기 역사</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          딥러닝의 역사는 하나의 알고리즘이 갑자기 등장한 이야기가 아닙니다. 미분 가능한 network, 충분한 데이터, 병렬 hardware와 안정적인 optimization이 서로 다른
          시기에 축적되다가 함께 작동하기 시작한 과정입니다. 연구 침체를 특정 논문이나 한 사람의 선택으로만 설명하면 이 상호작용을 놓칩니다.
        </p>
      </div>

      <figure data-viz="modern" className="not-prose my-12 min-w-0">
        <figcaption className="mb-5 px-1">
          <p className="text-xs font-bold text-primary">병목의 이동</p>
          <p className="text-sm font-bold text-foreground">
            네 시기로 보는 발전 흐름
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            각 시기마다 이전 방법이 폐기된 것이 아니라 다음 규모의 학습 조건이 하나씩 더해졌습니다.
          </p>
        </figcaption>
        <div data-viz-canvas className="grid gap-6 rounded-xl border border-border/70 bg-muted/15 p-5 sm:grid-cols-2 sm:gap-7 sm:p-7">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.period}
              className="min-w-0 border-l border-border/80 pl-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {milestone.period}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-5 text-foreground">
                {milestone.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-foreground/70">
                {milestone.detail}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          2012년의 변화는 세 조건이 동시에 맞은 결과다
        </h3>
        <p className="leading-7">
          AlexNet은 ImageNet 규모의 labeled data, GPU에서 병렬화한 convolution,
          ReLU와 data augmentation 같은 training recipe를 함께 사용했습니다.
          성능 향상을 “GPU가 빨라서” 또는 “새 activation 하나 덕분에”라고만
          설명할 수 없는 이유입니다. 이후에도 model quality는 architecture뿐
          아니라 data pipeline, numerical precision과 distributed system을 함께
          설계할 때 확장됐습니다.
        </p>
        <p className="leading-7">
          역사적 인물 목록을 외우기보다 어떤 병목이 다음 변화를 만들었는지 보는
          편이 이후 글을 이해하는 데 유용합니다. 단층의 표현 한계는 다층
          network로, 긴 gradient path는 residual connection으로, 순차 계산의
          병목은 attention과 병렬 학습으로 이어졌습니다.
        </p>
      </div>
    </section>
  );
}
