import MNISTViz from './viz/MNISTViz';
import MnistInfoViz from './viz/MnistInfoViz';
import MlpTrainViz from './viz/MlpTrainViz';
import MnistParamsViz from './viz/MnistParamsViz';

export default function MNIST() {
  return (
    <section id="mnist" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손글씨 숫자 인식</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MNIST — 28×28 흑백 이미지, 0~9 숫자 10클래스 분류.<br />
        784→50→100→10 구조의 3층 신경망으로 정확도 ~97% 달성.
      </p>
      <MNISTViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MNIST 데이터셋 상세</h3>
        <p>
          LeCun 1998 Modified NIST — 딥러닝의 "Hello World"
        </p>
      </div>
      <MnistInfoViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">3-layer MLP 훈련 파이프라인</h3>
        <p>
          데이터 전처리 → 모델 정의 → 훈련 루프 → 평가까지 전체 흐름.
        </p>
      </div>
      <MlpTrainViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">파라미터 수 계산 & MNIST 해결 역사</h3>
        <p>
          784→50→100→10 구조로 총 45,360 파라미터 (Layer 1이 87% 차지)<br />
          Linear → MLP → LeNet(CNN) → ResNet → Human 수준으로 진화
        </p>
      </div>
      <MnistParamsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MNIST가 여전히 교육 표준인 이유</p>
          <p>
            <strong>교육적 가치</strong>:<br />
            - 데이터 크기 적절 (빠른 실험)<br />
            - 의미 명확 (직관적)<br />
            - GPU 없이도 훈련 가능<br />
            - 다양한 방법 비교 용이
          </p>
          <p className="mt-2">
            <strong>한계 인식</strong>:<br />
            ✗ 이미 "풀린" 문제 (99%+ 정확도)<br />
            ✗ 실제 세계 대비 단순<br />
            ✗ Overfitting 위험 (모델 크기 대비 데이터 작음)<br />
            → "MNIST solved" ≠ "CV solved"
          </p>
          <p className="mt-2">
            <strong>MNIST 이후 벤치마크</strong>:<br />
            - CIFAR-10/100: natural images<br />
            - ImageNet: 1M 이미지, 1000 classes<br />
            - COCO: object detection<br />
            - Fashion-MNIST: "MNIST replacement"<br />
            - Korean MNIST, EMNIST 등 변형
          </p>
        </div>

      </div>
    </section>
  );
}
