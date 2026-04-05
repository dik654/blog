import CodePanel from '@/components/ui/code-panel';
import ConvKernelViz from './viz/ConvKernelViz';
import ConvMeaningViz from './viz/ConvMeaningViz';
import HierarchicalFeatureViz from './viz/HierarchicalFeatureViz';
import { convCode, convAnnotations, poolCode, poolAnnotations } from './ConvolutionLayerData';

export default function ConvolutionLayer() {
  return (
    <section id="convolution-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합성곱 연산의 구성요소</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        작은 필터(3×3)를 이미지 위에서 슬라이딩 → 원소별 곱의 합 계산.<br />
        커널과 유사한 패턴일수록 높은 출력값 → 패턴 감지기 역할.
      </p>
      <ConvKernelViz />

      <h3 className="text-lg font-semibold mt-10 mb-4">합성곱의 의미: 패턴 감지기</h3>
      <ConvMeaningViz />

      <h3 className="text-lg font-semibold mt-10 mb-4">계층적 피처 학습</h3>
      <HierarchicalFeatureViz />

      <div className="mt-8 space-y-4">
        <CodePanel title="PyTorch Conv2d" code={convCode}
          annotations={convAnnotations} />
        <CodePanel title="Pooling & ReLU" code={poolCode}
          annotations={poolAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">합성곱 연산 수식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2D Convolution 수식
//
// 입력: X ∈ R^{H × W × C_in}
// 커널: K ∈ R^{k × k × C_in × C_out}
// 출력: Y ∈ R^{H' × W' × C_out}
//
// Y[i, j, c_out] = Σ_{c_in} Σ_{dx, dy} X[i+dx, j+dy, c_in] × K[dx, dy, c_in, c_out]
//
// 출력 크기 공식:
//   H' = (H - k + 2p) / s + 1
//   W' = (W - k + 2p) / s + 1
//
// 여기서:
//   k = 커널 크기 (예: 3)
//   p = padding (예: 1)
//   s = stride (예: 1 or 2)
//
// 예시 1: 224×224 입력, 3×3 kernel, padding=1, stride=1
//   출력: (224-3+2)/1 + 1 = 224   (크기 유지)
//
// 예시 2: 224×224 입력, 3×3 kernel, padding=1, stride=2
//   출력: (224-3+2)/2 + 1 = 112   (다운샘플링)
//
// 예시 3: 224×224 입력, 7×7 kernel, padding=3, stride=2
//   출력: (224-7+6)/2 + 1 = 112   (ResNet 첫 층)

// 파라미터 개수:
//   Weights: k × k × C_in × C_out
//   Bias: C_out
//   Total: k² × C_in × C_out + C_out
//
// 예: Conv2d(64, 128, kernel=3)
//   3 × 3 × 64 × 128 + 128 = 73,856`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 커널 유형과 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 고전적 필터 예시 (학습 전 수작업 설계)
//
// Sobel X (수평 엣지 감지):
//   [-1  0  1]
//   [-2  0  2]
//   [-1  0  1]
//
// Sobel Y (수직 엣지 감지):
//   [-1 -2 -1]
//   [ 0  0  0]
//   [ 1  2  1]
//
// Gaussian Blur (노이즈 제거):
//   (1/16) ×
//   [1 2 1]
//   [2 4 2]
//   [1 2 1]
//
// Sharpen (경계 강조):
//   [ 0 -1  0]
//   [-1  5 -1]
//   [ 0 -1  0]
//
// CNN의 핵심 통찰:
//   - 이런 커널을 "학습"으로 자동 발견
//   - 첫 층: 엣지 감지기 (Gabor-like filters) 학습
//   - 중간층: 텍스처, 패턴 감지기
//   - 후반층: 객체 부분, 의미 단위

// Pooling 종류:
//
// Max Pooling:
//   - 영역 내 최대값
//   - 특징 위치 어느정도 무시
//   - 가장 흔히 사용
//
// Average Pooling:
//   - 영역 평균
//   - 부드러운 다운샘플링
//
// Global Average Pooling (GAP):
//   - 각 채널 전체 평균 → 1 scalar
//   - FC 대체, 파라미터 제거
//   - ResNet, GoogLeNet 등에서 사용

// Padding 종류:
//   - Zero padding: 주변에 0 채움 (기본)
//   - Reflect: 경계 반사
//   - Replicate: 경계값 복제
//   - Circular: 순환 (FFT 계열)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Y = X * K</strong> 합성곱은 커널 크기·stride·padding으로 출력 크기 결정.<br />
          요약 2: CNN의 본질은 <strong>수작업 필터를 학습으로 대체</strong> — 자동 특성 추출.<br />
          요약 3: <strong>Max/Avg/GAP</strong> pooling이 다운샘플링의 표준 — 용도별로 선택.
        </p>
      </div>
    </section>
  );
}
