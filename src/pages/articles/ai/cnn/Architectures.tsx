import CNNArchEvolutionViz from './viz/CNNArchEvolutionViz';
import CodePanel from '@/components/ui/code-panel';

const resnetCode = `import torchvision.models as models

# ResNet-50: 약 2,550만 파라미터
resnet = models.resnet50(pretrained=True)

# Skip Connection (Residual Block)의 핵심:
# output = F(x) + x    ← identity shortcut
# 기울기가 identity 경로를 통해 직접 전파
# → 수백 층도 안정적으로 학습 가능`;

const resAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'torchvision 사전학습 모델' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'Skip Connection 원리' },
];

export default function Architectures() {
  return (
    <section id="architectures" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN 아키텍처의 진화</h2>
      <div className="not-prose mb-8">
        <CNNArchEvolutionViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>핵심 진화 포인트</h3>
        <ul>
          <li>
            <strong>LeNet-5 (1998)</strong> — Yann LeCun이 설계. Conv → Pool → Conv → Pool → FC.
            우편 번호 손글씨 인식에 실용 배치된 최초의 CNN.
          </li>
          <li>
            <strong>AlexNet (2012)</strong> — ImageNet Top-5 에러율 15.3%. GPU 학습,
            ReLU, Dropout, Data Augmentation을 도입하며 딥러닝 붐을 촉발.
          </li>
          <li>
            <strong>VGGNet (2014)</strong> — 3x3 필터만 반복 적용하여 19층까지 깊이를 확장.
            "더 깊은 네트워크 = 더 좋은 성능"이라는 직관을 검증.
          </li>
          <li>
            <strong>ResNet (2015)</strong> — Skip Connection(잔차 연결)으로
            기울기 소실 문제를 근본적으로 해결. 152층 학습에 성공.
          </li>
          <li>
            <strong>EfficientNet (2019)</strong> — NAS로 기본 구조 탐색 후,
            깊이/너비/해상도를 복합 스케일링(Compound Scaling)으로 균형 확장.
          </li>
        </ul>

        <h3>ResNet: Skip Connection의 힘</h3>
        <p>
          ResNet의 핵심 통찰 — "층을 추가해도 최소한 항등 함수는 학습할 수 있어야 한다"<br />
          잔차 블록(Residual Block)은 입력 x를 출력에 직접 더함<br />
          네트워크가 F(x) = H(x) - x (잔차)만 학습하면 됨
        </p>
        <CodePanel title="ResNet Skip Connection" code={resnetCode} annotations={resAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 CNN 아키텍처 상세 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ┌──────────────┬──────┬────────┬────────┬─────────────┐
// │   모델       │ 연도 │ 층 수  │ 파라미터│ ImageNet Top-1│
// ├──────────────┼──────┼────────┼────────┼─────────────┤
// │ LeNet-5      │ 1998 │    7   │   60K  │     N/A     │
// │ AlexNet      │ 2012 │    8   │   60M  │    57.1%    │
// │ VGG-16       │ 2014 │   16   │  138M  │    71.3%    │
// │ VGG-19       │ 2014 │   19   │  143M  │    71.3%    │
// │ GoogLeNet    │ 2014 │   22   │    7M  │    69.8%    │
// │ ResNet-50    │ 2015 │   50   │   26M  │    76.0%    │
// │ ResNet-152   │ 2015 │  152   │   60M  │    77.8%    │
// │ Inception-v3 │ 2015 │   42   │   24M  │    78.8%    │
// │ DenseNet-121 │ 2017 │  121   │    8M  │    74.9%    │
// │ MobileNet-v2 │ 2018 │   53   │  3.5M  │    72.0%    │
// │ EfficientNet │ 2019 │   B0  |  5.3M  │    77.3%    │
// │ ConvNeXt-L   │ 2022 │    L   │  198M  │    84.3%    │
// └──────────────┴──────┴────────┴────────┴─────────────┘

// 핵심 설계 혁신:
//
// AlexNet (2012):
//   - ReLU 활성화 (vs tanh/sigmoid)
//   - Dropout (FC층 과적합 방지)
//   - Data Augmentation
//   - GPU (CUDA) 학습
//
// VGGNet (2014):
//   - 3×3 작은 필터만 사용
//   - 깊이(16-19층)로 성능 개선
//   - 단순하고 균일한 구조
//
// GoogLeNet / Inception (2014):
//   - Inception module: 다양한 kernel 병렬
//   - 1×1 Conv로 채널 차원 축소
//   - Auxiliary classifier (deep supervision)
//
// ResNet (2015):
//   - Skip connection (잔차 학습)
//   - BatchNorm 적극 사용
//   - 152층 학습 성공
//   - 수식: y = F(x) + x
//
// DenseNet (2017):
//   - 모든 이전 층과 연결
//   - 특징 재사용 극대화
//   - 파라미터 효율 우수
//
// EfficientNet (2019):
//   - Compound scaling (depth·width·res 동시)
//   - NAS로 최적 base 모델 탐색
//   - MobileNet 기반
//
// ConvNeXt (2022):
//   - Transformer 설계 원리 수입
//   - 7×7 depthwise conv
//   - LayerNorm, GELU, AdamW
//   - ViT와 유사한 성능`}
        </pre>
        <p className="leading-7">
          요약 1: AlexNet → VGG → ResNet → EfficientNet으로 <strong>깊이·효율·정확도</strong> 순차 발전.<br />
          요약 2: <strong>Skip Connection</strong>이 100층+ 학습을 가능케 한 결정적 혁신.<br />
          요약 3: 2022년 <strong>ConvNeXt</strong>가 Transformer 설계를 역수입하여 CNN 부활.
        </p>
      </div>
    </section>
  );
}
