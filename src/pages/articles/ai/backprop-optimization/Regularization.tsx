import RegularizationViz from './viz/RegularizationViz';
import L1L2Viz from './viz/L1L2Viz';
import DropoutViz from './viz/DropoutViz';
import RegTechViz from './viz/RegTechViz';

export default function Regularization() {
  return (
    <section id="regularization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정규화 기법</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        과적합(overfitting) 방지 — 의도적 방해로 일반화 성능 향상.<br />
        L1/L2, Dropout, Early Stopping 등 다양한 기법이 존재한다.
      </p>
      <RegularizationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">L1 vs L2 Regularization</h3>
        <p>
          L2 = 원형 제약 (모든 θ 작게 유지), L1 = 마름모 제약 (많은 θ=0, sparse)<br />
          기하학적으로 L1의 꼭짓점이 축 위에 있어 해가 축에 닿음 → feature selection 효과
        </p>
      </div>
      <L1L2Viz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Dropout</h3>
        <p>
          훈련 시 뉴런을 확률 p로 랜덤하게 0으로 만들어 <strong>ensemble 효과</strong> 발생<br />
          Co-adaptation 방지 → 추론 시엔 full network 사용 (inverted dropout: 출력×1/(1−p) 스케일)
        </p>
      </div>
      <DropoutViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">BatchNorm · Early Stopping · Data Augmentation</h3>
        <p>
          정규화 수식, Normalization 변형, 조기 종료, 데이터 증강 기법.
        </p>
      </div>
      <RegTechViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 정규화는 귀납적 편향(inductive bias)</p>
          <p>
            <strong>철학적 관점</strong>:<br />
            - Regularization = "모델에게 특정 가정을 강제"<br />
            - L2: "weights should be small" 가정<br />
            - Dropout: "no single neuron is indispensable" 가정<br />
            - BatchNorm: "features should have similar scale" 가정
          </p>
          <p className="mt-2">
            <strong>조합 전략 (modern DL)</strong>:<br />
            ✓ Always: Weight decay (L2) 작게 (1e-4 ~ 1e-5)<br />
            ✓ Always: Batch/Layer Norm<br />
            ✓ Often: Dropout (0.1 ~ 0.5)<br />
            ✓ Always: Data augmentation<br />
            ✓ Always: Early stopping (safety)
          </p>
          <p className="mt-2">
            <strong>스케일 고려</strong>:<br />
            - 작은 모델: 강한 regularization 필요<br />
            - 대형 LLM: 적은 regularization (데이터 자체로 충분)<br />
            - Transfer learning: regularization 줄이기 (pre-trained 가깝게)
          </p>
        </div>

      </div>
    </section>
  );
}
