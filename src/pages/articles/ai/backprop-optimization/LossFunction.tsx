import { Link } from "react-router-dom";
import LossViz from "./viz/LossViz";

export default function LossFunction() {
  return (
    <section id="loss-function" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Loss: 출력 오차를 하나의 scalar로 모으기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          backpropagation을 시작하려면 모델 출력 전체를 최적화할 scalar objective로
          모아야 한다. 회귀에는 MSE·MAE·Huber, 확률 분류에는 cross-entropy가 흔하지만,
          loss는 task 이름보다 출력의 의미와 noise 가정에 맞춰 고른다. KL divergence도
          단순한 “분포용 loss”라기보다 방향과 support를 고려해야 하는 divergence다.
        </p>
      </div>
      <LossViz />
      <div className="not-prose mt-6 rounded-2xl border border-sky-200 bg-sky-50/60 p-5 dark:border-sky-900 dark:bg-sky-950/20">
        <p className="text-sm font-semibold">Cross-entropy와 KL의 정의는 기준 글에 모았습니다</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글에서는 loss에서 gradient가 시작된다는 역할만 다루고, 정보이론·MLE·KL
          방향성은 중복하지 않습니다.
        </p>
        <Link to="/ai/cross-entropy" className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300">Cross-entropy 글 바로 보기 →</Link>
      </div>
    </section>
  );
}
