import { Link } from "react-router-dom";
import TabularViz from "./viz/TabularViz";

export default function Tabular() {
  return (
    <section id="tabular" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Tabular data에서는 값 하나보다 row 전체의 현실성을 보존해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Table에는 나이·금액의 범위, 통화와 시간 단위, category 조합, 합계와 부분합,
          사건의 시간 순서처럼 feature 사이의 제약이 있습니다. 연속 feature 두 개를
          각각 정상 범위 안에서 보간했더라도 “계약 종료일이 시작일보다 빠른 row”처럼
          전체로는 불가능한 sample이 생길 수 있습니다. 따라서 synthetic row는
          column별 histogram만이 아니라 cross-feature constraint와 target relation을
          함께 검사해야 합니다.
        </p>
        <p>
          SMOTE는 minority sample과 이웃 사이를 보간하는 resampling 방법이며 구체적인
          class-imbalance 적용과 평가는 <Link to="/ai/imbalanced-data">불균형 데이터 글</Link>이
          소유합니다. 여기서는 <strong>split 이후 training fold 안에서만</strong>
          neighbor와 synthetic row를 만드는 경계를 기억하면 됩니다. Split 전에
          합성하면 validation sample의 위치 정보가 training data에 섞이는 leakage가
          생깁니다.
        </p>
      </div>
      <div className="not-prose my-8"><TabularViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Time-series에는 시점과 entity boundary가 추가됩니다</h3>
        <p>
          미래 시점의 값으로 과거 sample을 만들거나 같은 사용자의 나중 record를
          이웃으로 사용하면 temporal leakage가 생깁니다. 먼저 entity·time 기준으로
          split하고 그 안에서 허용되는 perturbation을 정의해야 합니다. Feature-wise
          shuffling은 feature–target relation을 끊기 때문에 일반적인 label-preserving
          augmentation이 아니라 별도의 regularization 또는 permutation test로 다룹니다.
        </p>
      </div>
    </section>
  );
}
