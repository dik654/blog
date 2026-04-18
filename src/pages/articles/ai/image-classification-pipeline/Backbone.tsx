import BackboneComparisonViz from './viz/BackboneComparisonViz';

export default function Backbone() {
  return (
    <section id="backbone" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">백본 선택: EfficientNet, ConvNeXt, ViT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>백본</strong>(Backbone) — 이미지에서 특징(feature)을 추출하는 인코더 네트워크<br />
          분류기(classifier head)는 단순 FC layer이므로, 성능의 80%는 백본이 결정<br />
          ImageNet pretrained 가중치를 로드한 뒤 타겟 데이터에 fine-tuning하는 전이학습(Transfer Learning)이 기본
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">EfficientNet — Compound Scaling</h3>
        <p>
          2019년 Google Brain, Tan & Le 제안<br />
          핵심 아이디어: 깊이(depth), 너비(width), 해상도(resolution) 세 축을 <strong>하나의 계수 φ</strong>로 동시 스케일링<br />
          depth = α^φ, width = β^φ, resolution = γ^φ (α·β²·γ² ≈ 2로 FLOPS 제약)<br />
          NAS(Neural Architecture Search)로 B0 기본 구조를 탐색하고, φ만 바꿔 B0→B7 자동 생성<br />
          B4: 파라미터 19M으로 Top-1 83.0% — ResNet-152(60M) 대비 3배 효율적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ConvNeXt — Modernized CNN</h3>
        <p>
          2022년 Meta, Liu et al. 제안 — "순수 CNN도 Transformer만큼 강할 수 있는가?"<br />
          ResNet-50을 출발점으로 Swin Transformer의 설계 기법을 하나씩 이식<br />
          (1) 7×7 depthwise convolution (Swin의 7×7 윈도우에 대응)<br />
          (2) LayerNorm으로 BatchNorm 대체 (Transformer 관행)<br />
          (3) GELU 활성화 함수 (ReLU 대체)<br />
          (4) Inverted Bottleneck — 채널을 4배 확장 후 축소 (MLP 비율 4× 모방)<br />
          결과: ConvNeXt-XL이 Swin-L과 동등(87.8% vs 87.3%) — CNN의 귀납 편향이 장점
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ViT — Patch-based Self-Attention</h3>
        <p>
          2020년 Google, Dosovitskiy et al. — 이미지를 NLP처럼 시퀀스로 처리<br />
          이미지를 P×P 패치(기본 16×16)로 분할 → 각 패치를 선형 투영하여 토큰 생성<br />
          위치 임베딩(Position Embedding)을 더한 뒤 표준 Transformer 인코더에 입력<br />
          [CLS] 토큰의 최종 표현으로 분류 — CNN의 지역적 귀납 편향(locality) 없이 전역 수용야(global receptive field) 확보<br />
          ImageNet-21K(1400만장) pretrain 시 88.6% (ViT-L) — 소규모 데이터에선 과적합 위험
        </p>
      </div>
      <div className="not-prose my-8">
        <BackboneComparisonViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">timm 라이브러리로 백본 로드</h3>
        <p>
          <strong>timm</strong>(PyTorch Image Models) — Ross Wightman이 관리하는 800+ pretrained 모델 허브<br />
          한 줄로 모델 생성: timm.create_model("efficientnet_b4", pretrained=True, num_classes=N)<br />
          pretrained=True → ImageNet-1K(또는 21K) 가중치 자동 다운로드<br />
          num_classes=N → 마지막 FC layer를 타겟 클래스 수로 교체
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">선택 기준 요약</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          데이터 &lt; 5K → EfficientNet-B3/B4 (작은 모델, pretrained 의존도 높음)<br />
          데이터 5K~50K → ConvNeXt-Base (CNN 안정성, 학습 쉬움)<br />
          데이터 50K+ → ViT-Base/Large (대규모 데이터에서 attention이 빛남)<br />
          확신 없으면 → EfficientNet-B4로 시작, 시간 여유 있으면 ConvNeXt 추가 실험
        </p>
      </div>
    </section>
  );
}
