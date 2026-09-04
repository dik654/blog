const layers = [
  {
    label: "연산",
    title: "행렬 곱과 convolution을 병렬화",
    detail:
      "GPU·accelerator는 같은 instruction을 많은 데이터에 적용하는 tensor 연산을 높은 throughput으로 처리합니다.",
    check: "FLOPs보다 kernel utilization 확인",
  },
  {
    label: "메모리",
    title: "읽고 쓰는 byte와 재사용을 줄임",
    detail:
      "큰 모델에서는 arithmetic보다 HBM traffic과 activation 저장이 먼저 병목이 될 수 있습니다.",
    check: "bandwidth·memory peak·cache hit 확인",
  },
  {
    label: "수치",
    title: "mixed precision으로 비용을 낮춤",
    detail:
      "FP16·BF16·FP8은 tensor core를 활용하고 memory traffic을 줄이지만 overflow와 accuracy를 함께 관리해야 합니다.",
    check: "loss scale·overflow·quality regression 확인",
  },
  {
    label: "분산",
    title: "data·tensor·pipeline parallelism을 조합",
    detail:
      "한 device에 들어가지 않는 model과 dataset을 여러 accelerator에 나누되 communication과 idle time을 줄입니다.",
    check: "compute/communication overlap 확인",
  },
] as const;

export default function Acceleration() {
  return (
    <section id="acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝 고속화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          딥러닝의 주요 계산은 matrix multiplication과 convolution처럼 병렬화하기 쉬운 연산이지만 peak FLOPS만 높다고 학습이 자동으로 빨라지지는 않습니다.
          실제 시간은 kernel이 hardware를 얼마나 채우느냐, weight와 activation을 얼마나 자주 메모리에서 옮기느냐, 여러 device가 얼마나 오래 기다리느냐에
          달려 있습니다.
        </p>
      </div>

      <figure data-viz="modern" className="not-prose my-12 min-w-0">
        <figcaption className="mb-5 px-1">
          <p className="text-xs font-bold text-primary">성능 진단 순서</p>
          <p className="text-sm font-bold text-foreground">
            고속화는 네 계층을 함께 맞추는 일
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            제품 세대의 숫자 대신 어디에서 시간이 소비되는지부터 측정합니다.
          </p>
        </figcaption>
        <div data-viz-canvas className="grid gap-6 rounded-xl border border-border/70 bg-muted/15 p-5 sm:grid-cols-2 sm:gap-7 sm:p-7">
          {layers.map((layer, index) => (
            <div
              key={layer.label}
              className="min-w-0 border-l border-border/80 pl-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold text-foreground">
                  {layer.label}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-5 text-foreground">
                {layer.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-foreground/70">
                {layer.detail}
              </p>
              <p className="mt-3 border-t border-border/70 pt-3 text-[11px] font-semibold leading-5 text-muted-foreground">
                측정: {layer.check}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          hardware에 맞는 algorithm이 살아남는다는 뜻
        </h3>
        <p className="leading-7">
          <strong>hardware lottery</strong>는 좋은 아이디어라도 당시 hardware가
          효율적으로 실행하지 못하면 연구와 제품에서 선택되기 어렵다는 관점을
          가리킵니다. Transformer는 RNN보다 sequence 축을 병렬로 학습하기 쉬워
          accelerator 규모 확대와 잘 맞았지만, inference에서는 KV cache와 memory
          bandwidth라는 새로운 비용을 만들었습니다. 따라서 “GPU에 맞아
          성공했다”는 설명은 장점과 새 병목을 함께 봐야 완성됩니다.
        </p>
        <p className="leading-7">
          뒤의 서빙 글에서는 latency와 throughput을, 압축 글에서는 byte와
          precision을, 분산 학습 글에서는 communication을 각각 자세히 다룹니다.
          이 글에서는 특정 GPU의 일시적인 사양표보다 병목을 찾는 순서를
          기억하면 충분합니다.
        </p>
      </div>

      <div
        id="paper-alexnet"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · AlexNet</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          2012년의 전환점은 GPU 하나가 아니라 data·architecture·training
          recipe의 결합이었습니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          AlexNet이 한 실험에 결합한 것은 ImageNet의 대규모 labeled image, 다섯 convolution layer와 두 fully connected layer,
          non-saturating unit, GPU convolution, regularization입니다. 논문이 보여 준 것은 해당 dataset·metric에서 이 조합이 큰 오차
          감소를 냈다는 결과입니다. ReLU나 GPU 하나만 떼어 모든 domain의 성공 원인으로 일반화할 수는 없습니다.
        </p>
      </div>
    </section>
  );
}
