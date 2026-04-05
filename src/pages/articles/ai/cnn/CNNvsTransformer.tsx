import AttentionSupersetViz from './viz/AttentionSupersetViz';

export default function CNNvsTransformer() {
  return (
    <section id="cnn-vs-transformer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN vs Transformer</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Self-Attention: Convolution의 상위집합</h3>
        <p>
          합성곱 — 커널 크기만큼의 <strong>고정된 지역 영역</strong>만 참조<br />
          Self-Attention — 이미지의 <strong>모든 픽셀</strong>을 한 번에 참조 가능<br />
          CNN은 장거리 상호작용을 위해 수십 층을 쌓아야 하지만, Attention은 단일 층에서 가능
        </p>
        <p>
          수학적으로 증명된 정리: <strong>N개 헤드의 Multi-Head Self-Attention은
          √N × √N 크기의 합성곱 커널을 구현할 수 있다</strong><br />
          9개 헤드 → 3×3 커널, 25개 헤드 → 5×5 커널<br />
          즉 Self-Attention은 Convolution을 포함하는 더 일반적인 연산
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionSupersetViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Transformer가 CNN을 대체한 세 가지 이유</h3>

        <p><strong>1. 더 넓은 함수 공간</strong></p>
        <p>
          Self-Attention은 귀납적 편향이 낮아 더 다양한 패턴을 학습 가능<br />
          실제 학습된 ViT의 초기 층을 분석하면, 일부 헤드는 CNN처럼 지역적 패턴을,<br />
          다른 헤드는 CNN이 불가능한 장거리 관계를 동시에 학습
        </p>

        <p><strong>2. 하드웨어 병렬성</strong></p>
        <p>
          2017년 NVIDIA Volta(TensorCore) + Google TPU의 등장<br />
          Transformer는 모든 쿼리 토큰을 <strong>동시에</strong> 처리 가능 = 행렬 곱셈 최적화<br />
          CNN도 커널별 병렬화 가능하지만, 정보 흐름이 지역성에 병목 — 층을 깊이 쌓아야 함
        </p>

        <p><strong>3. 멀티모달리티</strong></p>
        <p>
          CNN의 귀납적 편향은 이미지에 특화 — 텍스트에 적용하면 성능 저하<br />
          Self-Attention은 텍스트, 이미지, 오디오, 비디오를 <strong>동일한 구조</strong>로 처리 가능<br />
          GPT-4, Gemini 같은 멀티모달 모델이 가능한 이유
        </p>

        <h3>그래도 CNN이 살아남는 이유</h3>
        <p>
          <strong>ConvNeXt (2022)</strong> — Transformer의 설계 원리를 CNN에 역수입<br />
          7×7 커널, LayerNorm, GELU 활성화 등을 적용하여 ViT와 동등한 성능 달성<br />
          CNN의 귀납적 편향은 <strong>소규모 데이터</strong>에서 여전히 유리<br />
          모바일/엣지 디바이스에서는 CNN의 <strong>연산 효율성</strong>이 중요
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ViT (Vision Transformer) 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Vision Transformer (Dosovitskiy et al. 2020)
//
// 입력: 224×224×3 이미지
//
// Step 1: Patch Embedding
//   - 16×16 패치로 분할 → 14×14 = 196 patches
//   - 각 패치: 16×16×3 = 768 pixels
//   - Linear projection: 768 → D (e.g. 768)
//   - 결과: (196, 768) sequence
//
// Step 2: Positional Encoding
//   - 학습 가능한 position embedding 추가
//   - [CLS] token 맨 앞에 prepend → (197, 768)
//
// Step 3: Transformer Encoder (L blocks)
//   for each block:
//     Multi-Head Self-Attention
//     MLP (2 layers with GELU)
//     LayerNorm (pre-norm)
//     Residual connections
//
// Step 4: Classification
//   - [CLS] token → Linear → num_classes
//
// ViT 모델 크기:
//   ViT-B/16: 12 layers, 768 dim, 86M params
//   ViT-L/16: 24 layers, 1024 dim, 307M params
//   ViT-H/14: 32 layers, 1280 dim, 632M params

// 핵심 차이 (CNN vs ViT):
//   - CNN: 지역 → 전역 계층
//   - ViT: 모든 패치 → 모든 패치 (1 layer)
//
// 단점:
//   - 데이터 요구량 매우 큼 (JFT-300M 필요)
//   - 소규모 데이터에서 CNN보다 성능 낮음
//   - 위치 정보 명시적 부여 필요`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">하이브리드 & 최신 동향</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CNN + Transformer 하이브리드 모델들
//
// 1. Swin Transformer (2021)
//    - 계층적 구조 (CNN처럼 해상도 감소)
//    - Window-based attention (지역성 도입)
//    - Shifted window로 장거리 연결
//    - Detection/Segmentation SOTA
//
// 2. CoAtNet (2021, Google)
//    - MBConv (depthwise) + Transformer 결합
//    - ImageNet-21K에서 SOTA
//
// 3. MaxViT (2022)
//    - Block attention + Grid attention
//    - 선형 복잡도, 고해상도 가능
//
// 4. ConvNeXt (2022, Meta)
//    - 순수 CNN이지만 Transformer처럼 설계
//    - Depthwise 7×7 conv
//    - LayerNorm, GELU, inverted bottleneck
//    - ViT와 동등 성능
//
// 5. EfficientFormer (2022)
//    - Mobile 친화적 ViT
//    - 지연 최적화

// 벤치마크 추세 (2024):
//   ImageNet-1K에서 SOTA:
//   - EVA-02 (ViT 기반, 89.6%)
//   - InternImage (CNN 기반, 89.6%)
//   - ConvNeXt-V2 (CNN, 88.9%)
//
// 결론:
//   - 둘 다 잘 설계하면 비슷한 성능
//   - 데이터 크기·하드웨어·도메인에 따라 선택
//   - 경계가 흐려지는 중 (하이브리드 대세)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>ViT</strong>는 이미지를 패치 시퀀스로 취급 — 전역 attention이 CNN 수준 RF 즉시 확보.<br />
          요약 2: <strong>Swin·ConvNeXt</strong> 등 하이브리드가 대세 — 지역성과 전역성 장점 결합.<br />
          요약 3: CNN/Transformer <strong>이분법은 깨짐</strong> — 설계 원리가 상호 수렴 중.
        </p>
      </div>
    </section>
  );
}
