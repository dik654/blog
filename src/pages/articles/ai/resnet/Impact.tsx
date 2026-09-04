import { Link } from "react-router-dom";
import InterpretationViz from "./viz/InterpretationViz";

export default function Impact() {
  return (
    <section id="impact" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Residual connection은 공통 primitive가 됐지만 설명 하나로 환원되지는
        않는다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          ResNet은 ImageNet classification뿐 아니라 detection·segmentation backbone으로도 확장됐습니다. identity path는
          ResNeXt·Wide ResNet·DenseNet과 현대 CNN 설계에 영향을 주었습니다. Transformer도 sublayer update를 residual stream에
          더합니다. 다만 convolutional ResNet block을 그대로 옮겨 온 것이라고 단정하기는 어렵습니다. 공유하는 쪽은 residual learning이라는 더 넓은
          parameterization 원리라고 보는 편이 정확합니다.
        </p>
      </div>

      <InterpretationViz />

      <div id="paper-residual-ensemble" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">후속 논문 읽기 · Path 관점</p>
        <p className="mt-2 text-sm font-semibold">Residual Networks Behave Like Ensembles of Relatively Shallow Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Residual network를 서로 다른 길이의 computational path 모음으로 해석하고 lesion 실험으로 짧은 path의 역할을 분석합니다. 유용한 후속
          설명입니다. 다만 trained ResNet이 독립 model의 확률적 ensemble과 정확히 같다는 정의로 읽으면 지나칩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1605.06431" target="_blank" rel="noreferrer">원 논문의 path 전개·lesion 실험 보기</a>
      </div>

      <div id="paper-residual-landscape" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">후속 논문 읽기 · Loss landscape</p>
        <p className="mt-2 text-sm font-semibold">Visualizing the Loss Landscape of Neural Nets</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Filter-wise normalization을 포함한 1D·2D slice로 architecture별 loss surface를 비교하고 skip connection과
          landscape의 관계를 관찰합니다. 물론 2D 그림 하나가 고차원 objective 전체를 완전히 증명하거나 모든 optimizer 경로를 설명해 주지는 못합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1712.09913" target="_blank" rel="noreferrer">원 논문의 시각화 방법·비교 보기</a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>“얕은 network의 ensemble”은 유용한 후속 관점이지 정의가 아니다</h3>
        <p className="leading-8">
          Shortcut을 선택하는 여러 computational path로 network를 전개하면 짧은 path가 gradient에 기여한다는 분석이 나옵니다. residual 구조의
          직관을 넓히는 결과입니다. Loss landscape가 더 부드럽다는 시각화도 optimization 차이를 설명하는 증거입니다. 다만 어느 하나를 ResNet의 유일한 작동
          원리로 단정하지는 않습니다. 원 논문의 degradation 실험·identity mapping ablation·후속 분석은 서로 다른 증거로 구분합니다.
        </p>

        <div id="paper-torchvision-resnet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">공식 구현 읽기 · Torchvision</p>
          <p className="mt-2 text-sm font-semibold">Torchvision ResNet source</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            BasicBlock·Bottleneck의 stride 위치, expansion, projection과
            zero-init residual option을 현재 source에서 확인합니다. 원 논문의 표기와
            현재 library default, 내려받은 checkpoint recipe를 같은 것으로 가정하면 안 됩니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/vision/stable/_modules/torchvision/models/resnet.html" target="_blank" rel="noreferrer">공식 source와 현재 구현 계약 보기</a>
        </div>

        <h3>
          Backbone을 고를 때는 stage feature와 deployment 비용을 함께 본다
        </h3>
        <p className="leading-8">
          Classification top-1만 비교하지 않고 downstream head가 필요한
          resolution, feature pyramid의 stage output, batch size에서의
          normalization, latency와 activation memory를 확인합니다. Pretrained
          checkpoint를 쓸 때는 resize·crop·mean·std 전처리와 model variant를
          함께 가져와야 합니다. CNN 전체의 inductive bias와 modern architecture
          선택은 <Link to="/ai/cnn">CNN 정본 글</Link>, transformer backbone과의
          비교는 <Link to="/ai/vision-transformer">Vision Transformer</Link>에서
          이어집니다.
        </p>

        <h3>
          Residual path도 architecture·data·training recipe를 대신하지 않는다
        </h3>
        <p className="leading-8">
          Skip connection을 추가했다고 generalization이나 robustness가 보장되지는 않습니다. Width, downsampling 위치,
          normalization, augmentation과 optimizer가 함께 결과를 만듭니다. 새 block을 평가할 때는 parameter·FLOPs·activation
          memory와 training budget을 맞춘 plain 또는 기존 residual baseline을 함께 둡니다.
        </p>
      </div>
    </section>
  );
}
