import StepViz from '@/components/ui/step-viz';
import ErrorCompareViz from './viz/ErrorCompareViz';
import { overviewSteps } from './OverviewData';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 깊은 신경망이 문제인가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        ResNet(2015) — 층을 쌓을수록 성능이 떨어지는 역설을 해결.<br />
        56층 plain net이 20층보다 train 에러조차 높음 — 기울기 소실이 원인.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={overviewSteps}>
          {(step) => <ErrorCompareViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Degradation Problem의 발견</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// He et al. 2015 - "Deep Residual Learning for Image Recognition"
//
// 관찰된 역설:
//   CIFAR-10 실험 결과
//
//   20층 plain CNN:  train error = 7.5%,  test error = 8.75%
//   56층 plain CNN:  train error = 8.7%,  test error = 9.5%
//
//   → 더 깊은 네트워크가 훈련 에러조차 더 높음!
//   → 과적합(overfitting)이 아님 (test 에러뿐 아니라 train도 높음)
//   → 단순 학습 실패 (optimization failure)
//
// 기존 접근법과의 차이:
//   - 기울기 소실은 BatchNorm/Xavier 초기화로 완화 가능
//   - 그런데도 깊이가 깊어지면 학습 자체가 안 됨
//   → 이를 "Degradation Problem"이라 명명
//
// 핵심 통찰:
//   "56층이 20층보다 나쁠 수 없다 - 추가 36층이 항등 함수만 학습해도"
//   "하지만 SGD로는 그 항등 함수조차 학습하기 어렵다"
//
// 해결책:
//   F(x) = H(x) - x  (잔차 학습)
//   네트워크가 H(x) 대신 잔차 F(x)를 학습
//   항등 함수(skip)는 "공짜"로 제공됨
//
// 결과:
//   ResNet-152가 VGG-19보다 8배 깊지만 파라미터는 적음
//   ImageNet top-5 error 3.57% (SOTA 2015)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">깊이별 성능 변화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Plain Net vs ResNet 성능 비교 (ImageNet, top-1 error)
//
// ┌─────────┬──────────────┬──────────────┐
// │ 층 수   │ Plain Net    │ ResNet       │
// ├─────────┼──────────────┼──────────────┤
// │   18    │   27.94%     │   27.88%     │ (비슷)
// │   34    │   28.54%     │   25.03%     │ (Plain 악화!)
// │   50    │     —        │   22.85%     │
// │  101    │     —        │   21.75%     │
// │  152    │     —        │   21.43%     │
// │ 1202    │     —        │   약간 악화  │ (너무 깊으면 한계)
// └─────────┴──────────────┴──────────────┘
//
// 관찰:
//   - Plain: 18 → 34층 가면 오히려 악화
//   - ResNet: 깊어질수록 계속 개선 (152층까지)
//   - 1200층 시도: 더 개선 없음 (다른 한계 도달)
//
// 학습 곡선 (CIFAR-10):
//   Plain-56:  처음부터 loss 높게 유지
//   ResNet-56: 부드럽게 감소, 낮은 loss 도달
//   ResNet-110: ResNet-56보다 약간 더 나음

// 의의:
//   딥러닝 연구 방향 전환
//   - Skip connection이 Transformer로 이어짐
//   - 2015년 이후 모든 깊은 모델의 기본 빌딩 블록
//   - 피인용 수 10만+ (NeurIPS 역사상 최다)`}
        </pre>
        <p className="leading-7">
          요약 1: ResNet 이전 깊은 CNN은 <strong>Degradation Problem</strong>으로 학습 불가.<br />
          요약 2: He et al.의 통찰 — 네트워크가 <strong>잔차 F(x) = H(x) - x</strong>를 학습.<br />
          요약 3: Skip connection은 <strong>Transformer·LLM의 표준 구조</strong>로 확장됨.
        </p>
      </div>
    </section>
  );
}
