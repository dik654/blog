import CNNPipelineViz from './viz/CNNPipelineViz';
import FCLimitViz from './viz/FCLimitViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>합성곱 신경망(Convolutional Neural Network, CNN)</strong> — 이미지 인식 분야에 혁명을 가져온 딥러닝 아키텍처<br />
          2012년 AlexNet이 ImageNet 대회에서 압도적 성능을 기록하며 딥러닝 시대를 개막<br />
          이후 컴퓨터 비전의 핵심 도구로 자리잡음
        </p>

        <h3>왜 전결합층(FC)만으로는 부족한가?</h3>
        <p>
          <strong>전결합층(FC, Fully Connected)</strong>이란?<br />
          입력의 <strong>모든 뉴런</strong>이 다음 층의 <strong>모든 뉴런</strong>과 연결되는 가장 기본적인 신경망 구조<br />
          각 연결마다 고유한 가중치(weight)가 존재 → 입력 크기에 비례하여 파라미터 수가 폭발적으로 증가
        </p>
        <p>
          28×28 흑백 이미지 = 784개 픽셀, 224×224 컬러 이미지 = <strong>150,528개</strong> 입력<br />
          FC 128 뉴런이면 784×128 = <strong>100,352개</strong> 파라미터 (28×28만으로도)<br />
          2D 이미지를 1D로 펼치는 순간 <strong>공간적 구조(인접 픽셀 관계)</strong>가 완전히 소실됨
        </p>
      </div>
      <div className="not-prose mt-4 mb-8">
        <FCLimitViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>CNN의 핵심 아이디어</h3>
        <ul>
          <li><strong>지역 연결(Local Connectivity)</strong> — 각 뉴런이 입력의 작은 영역(수용야)만 봄</li>
          <li><strong>가중치 공유(Weight Sharing)</strong> — 동일한 필터를 전체 이미지에 적용, 파라미터 대폭 감소</li>
          <li><strong>평행 이동 불변성(Translation Invariance)</strong> — 객체가 어디 있든 동일하게 감지</li>
        </ul>
        <p>
          이 세 가지 원리로 CNN은 전결합망 대비 파라미터 수를 수백~수천 배 감소<br />
          이미지의 공간 패턴을 효과적으로 학습 가능
        </p>
      </div>
      <div className="not-prose mt-8">
        <CNNPipelineViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FC vs CNN 파라미터 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 파라미터 수 비교 (224×224×3 컬러 이미지 입력)
//
// FC 첫 번째 층 (128 뉴런 기준):
//   입력 크기: 224 × 224 × 3 = 150,528
//   가중치: 150,528 × 128 = 19,267,584
//   편향: 128
//   합계: ~1,920만 파라미터
//
// CNN 첫 번째 층 (Conv 32 filters, 3×3 커널):
//   필터당 가중치: 3 × 3 × 3 = 27
//   필터 32개: 27 × 32 = 864
//   편향: 32
//   합계: 896 파라미터
//
// 비율: 1,920만 ÷ 896 ≈ 21,428배 감소
//
// 이것이 가능한 이유: 가중치 공유(weight sharing)
// - FC: 각 입력-출력 연결마다 별도 가중치
// - CNN: 동일 필터를 이미지 전체에 슬라이딩 (공유)
//
// 추가 이점:
//   - 특성 지역성(local feature): 근방 픽셀만 결합
//   - 위치 불변(translation invariant): 어디서든 같은 패턴 감지
//   - 메모리 절감: GPU에서 대형 모델 학습 가능
//   - 과적합 감소: 파라미터 적으면 일반화 좋음`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">CNN 연산 흐름 표준</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 전형적인 CNN 파이프라인 (분류 모델)
//
// Input: (B, 3, 224, 224)           # 배치×채널×H×W
//
// Conv Block 1:
//   Conv2d(3 → 64, k=3, p=1) → ReLU
//   Conv2d(64 → 64, k=3, p=1) → ReLU
//   MaxPool2d(2)               → (B, 64, 112, 112)
//
// Conv Block 2:
//   Conv2d(64 → 128, k=3, p=1) → ReLU
//   Conv2d(128 → 128, k=3, p=1) → ReLU
//   MaxPool2d(2)               → (B, 128, 56, 56)
//
// Conv Block 3:
//   Conv2d(128 → 256, k=3, p=1) → ReLU
//   Conv2d(256 → 256, k=3, p=1) → ReLU
//   MaxPool2d(2)               → (B, 256, 28, 28)
//
// Classifier:
//   GlobalAvgPool              → (B, 256, 1, 1)
//   Flatten                    → (B, 256)
//   Linear(256 → num_classes)
//   Softmax
//
// 핵심 패턴:
//   - 공간 해상도 감소 (224→112→56→28→1)
//   - 채널 수 증가 (3→64→128→256)
//   - 저수준→고수준 특성 추상화
//   - GAP으로 파라미터 대폭 절감`}
        </pre>
        <p className="leading-7">
          요약 1: CNN은 <strong>지역성·가중치 공유·계층 구조</strong>로 이미지 구조를 보존.<br />
          요약 2: FC 대비 <strong>수천~수만 배 파라미터 감소</strong> — 학습 가능한 범위 극적 확대.<br />
          요약 3: "<strong>해상도↓ + 채널수↑</strong>" 패턴이 표준 — 추상화 수준 상승의 직접 구현.
        </p>
      </div>
    </section>
  );
}
