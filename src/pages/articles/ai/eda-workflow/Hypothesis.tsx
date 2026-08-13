import HypothesisViz from "./viz/HypothesisViz";

export default function Hypothesis() {
  return (
    <section id="hypothesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EDA의 산출물은 재현 가능한 가설과 다음 실험이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          차트에서 패턴을 발견했다면 “어떤 조건에서 무엇이 달라지고, 이를 어떤
          지표로 확인할 것인가”를 문장으로 남깁니다. 예를 들어 “로봇 수가 적을
          때 지연이 커진다”에서 멈추지 않고, 주문량과 시간대를 통제해도 같은
          관계가 유지되는지와 어떤 validation slice에서 비교할지를 정합니다.
        </p>
        <p>
          관찰된 상관을 원인으로 바꾸어 말하지 않는 것도 중요합니다. 시각화는
          후보 가설을 만드는 도구이고, 반례 slice와 confounder를 확인한 뒤
          feature ablation이나 후속 실험으로 검증해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><HypothesisViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가설에서 피처와 검증 계획을 함께 만든다</h3>
        <p>
          비율·차이·구간화·interaction, 시계열의 lag와 rolling statistic은
          도메인 가설을 모델 입력으로 표현하는 방법입니다. 피처를 만들 때는
          계산 시점에 이용할 수 있는 값만 사용하고, 미래 정보가 섞이지 않도록
          cutoff와 group boundary를 먼저 고정합니다.
        </p>
        <p>
          각 가설에는 사용한 data version, slice, 집계 코드, 예상되는 변화와
          실제 validation 결과를 연결합니다. 효과가 없었던 가설도 남겨 두면
          같은 아이디어를 반복하는 일을 줄이고, 모델 오류가 발견됐을 때 어떤
          전제부터 다시 확인할지 알 수 있습니다.
        </p>
      </div>
    </section>
  );
}
