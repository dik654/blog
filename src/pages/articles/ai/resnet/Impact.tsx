import StepViz from '@/components/ui/step-viz';
import ImageNetTrendViz from './viz/ImageNetTrendViz';
import { impactSteps } from './ImpactData';

export default function Impact() {
  return (
    <section id="impact" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ResNet의 영향</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ILSVRC 2015 우승 — top-5 에러 <strong>3.57%</strong> (인간 5.1% 돌파)<br />
          152층이라는 압도적 깊이로 깊은 네트워크의 시대를 열음
        </p>
        <h3>후속 발전</h3>
        <p>
          <strong>DenseNet</strong>(2017): 모든 층을 연결 → 특성 재사용 극대화<br />
          <strong>ResNeXt</strong>(2017): 그룹 합성곱으로 너비 확장<br />
          <strong>EfficientNet</strong>(2019): 깊이·너비·해상도 동시 스케일링
        </p>
        <p>
          <strong>Transformer</strong>의 스킵 커넥션 = ResNet에서 유래<br />
          Self-Attention + FFN 각 서브레이어에 잔차 연결 적용<br />
          GPT, BERT 등 현대 LLM의 필수 구조가 된 스킵 커넥션
        </p>
        <h3>손실 평면 매끄러움 효과</h3>
        <p>
          스킵 커넥션이 손실 함수의 지형(landscape)을 매끄럽게 만듦<br />
          → 옵티마이저가 더 안정적으로 최적점을 찾을 수 있음
        </p>
      </div>
      <div className="not-prose my-8">
        <StepViz steps={impactSteps}>
          {(step) => <ImageNetTrendViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ResNet의 학계 영향력</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// "Deep Residual Learning for Image Recognition"
// He et al., CVPR 2016
//
// 인용 횟수: 200,000+ (2024년 기준)
//   → 컴퓨터 비전 논문 역대 1위
//   → 전체 AI/ML 논문 최다 인용권
//
// 수상:
//   - CVPR 2016 Best Paper Award
//   - ICCV 2019 Test of Time Award
//
// 벤치마크 성과 (2015):
//   - ILSVRC 2015 Image Classification: 1위
//   - ImageNet Detection: 1위
//   - ImageNet Localization: 1위
//   - COCO Detection: 1위
//   - COCO Segmentation: 1위
//
// 기록적 성능:
//   - ImageNet Top-5 error: 3.57%
//   - 인간 수준(5.1%)을 처음 돌파
//   - 기존 GoogLeNet(6.7%)의 거의 절반

// 후속 영향:
//   - DenseNet (2017): 모든 층 연결
//   - ResNeXt (2017): 그룹 합성곱
//   - SENet (2017): Squeeze-and-Excitation
//   - WideResNet: 깊이 대신 너비 확장
//   - MobileNet: depthwise separable conv
//   - EfficientNet (2019): 복합 스케일링
//
// Transformer 이전:
//   - Transformer (2017)의 encoder block
//   - residual + LayerNorm 구조
//   - ResNet 철학 그대로 계승
//
// 현대 LLM:
//   - GPT, BERT, LLaMA 모든 layer에 skip connection
//   - "Pre-LN" 구조: x + MLP(LN(x))
//   - 100+ layer 학습 가능의 근간`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Loss Landscape 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// "Visualizing the Loss Landscape" (Li et al. 2018)
//
// Plain Network (No Skip):
//   - 비볼록(non-convex), 거친 지형
//   - 여러 지역 최솟값, 넓은 평탄면
//   - 초기값에 민감, 수렴 어려움
//   - "Chaotic" 패턴
//
// ResNet:
//   - 상대적으로 매끄러운 지형
//   - 하나의 큰 바스인(basin)
//   - SGD가 쉽게 최솟값 찾음
//   - "Smooth" 패턴
//
// 시각적 비교:
//   Plain: 뾰족한 산과 깊은 골짜기, 험한 지형
//   ResNet: 부드러운 언덕, 넓은 분지
//
// 이론적 설명:
//   - Skip connection이 손실 함수의 Lipschitz 성질 개선
//   - 더 많은 경로로 평활화 효과
//   - Hessian 고유값 분포가 좁아짐

// 실무 의의:
//   1. 초기화 덜 민감 → 다양한 랜덤 초기값 OK
//   2. 학습률 선택 자유 → lr scheduler 단순화
//   3. 배치 크기 확장 가능 → 대규모 학습 용이
//   4. Fine-tuning 수월 → 전이학습 효과적
//
// Skip connection의 일반화:
//   - Dense connections (DenseNet)
//   - Multi-scale shortcuts (HRNet)
//   - Attention-weighted skip (U-Net++)
//   - Gated skip (Highway Networks)

// "Residual learning is a universal tool"
//   — AI 연구 전반에서 기본 빌딩 블록으로 자리잡음`}
        </pre>
        <p className="leading-7">
          요약 1: ResNet은 <strong>인용 수 20만+</strong>, AI 역사상 가장 영향력 있는 논문 중 하나.<br />
          요약 2: <strong>Loss landscape 평활화</strong>가 skip connection의 본질적 효과.<br />
          요약 3: Transformer·LLM의 모든 residual block은 <strong>ResNet의 직계 후손</strong>.
        </p>
      </div>
    </section>
  );
}
