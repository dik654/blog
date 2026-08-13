import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BackboneComparisonViz from "./viz/BackboneComparisonViz";

export default function Backbone() {
  return (
    <section id="backbone" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Backbone은 이름이 아니라 spatial prior·pretraining·실측 budget의 조합으로 고릅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CNN은 가까운 pixel에 같은 kernel을 반복 적용하는 translation equivariance를
          구조에 넣습니다. ViT는 image를 patch token으로 바꾸고 self-attention으로
          먼 patch 관계를 직접 계산합니다. 둘 중 하나가 언제나 우세한 것이 아니라,
          target data의 양과 구조, pretrained recipe, image resolution과 runtime이
          함께 결과를 만듭니다. ViT 내부 계산은 <Link to="/ai/vision-transformer">Vision Transformer 글</Link>에서
          자세히 이어집니다.
        </p>
      </div>
      <ExplainedFormula
        question="Image resolution을 두 배로 키우면 CNN과 global-attention ViT의 계산 부담은 왜 다르게 커질까?"
        idea={<>정사각 image 한 변을 r, patch 한 변을 P라고 두면 token 수 N은 (r/P)²입니다. Convolution은 대략 pixel 수에 비례하지만 global attention의 pairwise score는 N²개라서, 해상도 상승 비용이 훨씬 가파를 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
N&=\left(\frac rP\right)^2,\\
C_{\mathrm{conv}}&\propto r^2 d w^2,\\
C_{\mathrm{attn}}&\propto N^2h=\left(\frac rP\right)^4h.
\end{aligned}`}
        terms={[
          { symbol: "r", name: "input side length", description: "정사각형으로 단순화한 입력 image의 높이·너비이며 pixel 단위입니다." },
          { symbol: "P", name: "patch side length", description: "ViT가 한 token으로 묶는 patch의 한 변 길이입니다." },
          { symbol: "d,w", name: "depth and width", description: "CNN block 수와 channel scale을 단순화한 변수입니다." },
          { symbol: "h", name: "attention representation width", description: "Attention score와 value 계산에 쓰이는 hidden dimension의 규모입니다." },
        ]}
        assumptions={["복잡도 비교를 위한 지배항이며 kernel fusion·memory traffic·local attention은 생략했습니다.", "CNN 식은 같은 stage pattern에서 spatial area·depth·channel scaling의 경향만 나타냅니다.", "실제 latency는 FLOPs와 같지 않으므로 target runtime에서 batch별로 측정합니다."]}
        interpretation="r을 두 배로 키우면 이 단순식에서 convolution spatial cost는 약 4배, global attention score cost는 약 16배가 됩니다. 그래서 resolution은 architecture와 분리된 무료 hyperparameter가 아닙니다."
      />
      <ExplainedFormula
        question="EfficientNet의 compound scaling은 depth·width·resolution을 어떻게 같은 budget 축으로 묶었을까?"
        idea={<>한 축만 크게 키우지 않고 compound coefficient φ가 증가할 때 세 축을 정해진 비율로 함께 늘립니다. αβ²γ²≈2 조건은 φ가 1 증가할 때 계산량이 대략 두 배가 되도록 잡은 원 논문의 설계 근사입니다.</>}
        formula={String.raw`\begin{aligned}
d&=\alpha^\phi,\qquad w=\beta^\phi,\\
r&=\gamma^\phi,\\
\alpha\beta^2\gamma^2&\approx2,\qquad \alpha,\beta,\gamma\ge1.
\end{aligned}`}
        terms={[
          { symbol: "φ", name: "compound coefficient", description: "모델 family에서 전체 resource scale을 한 단계씩 키우는 공통 축입니다." },
          { symbol: "α,β,γ", name: "scaling constants", description: "Baseline search에서 정한 depth·width·resolution 증가 비율입니다." },
          { symbol: "d,w,r", name: "relative scales", description: "Baseline 대비 network depth, channel width와 input resolution의 배율입니다." },
        ]}
        assumptions={["원 논문이 MobileNet·ResNet scaling 관찰과 NAS baseline 위에서 제안한 heuristic입니다.", "αβ²γ²≈2는 convolutional cost 근사이며 임의 architecture의 정확한 FLOP·latency 공식이 아닙니다.", "Target task에서는 pretrained weight와 supported resolution을 포함한 실제 후보를 다시 비교합니다."]}
        interpretation="Compound scaling의 핵심은 EfficientNet이라는 이름이 아니라 제한된 resource에서 세 capacity 축의 균형을 찾는 것입니다. 이 식만으로 target hardware의 최적 모델을 결정할 수는 없습니다."
      />
      <div className="not-prose my-8"><BackboneComparisonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Input contract도 pretrained model의 일부입니다</h3>
        <p>
          Weight와 함께 nominal resolution, resize·crop interpolation, channel order,
          mean·standard deviation, classifier label order를 가져옵니다. Grayscale이나
          multispectral input에서 첫 layer를 바꾼다면 pretrained handoff가 달라진
          별도 후보입니다. FLOPs·parameter 수로 미리 거른 뒤 실제 batch size에서
          warmup을 제외한 p50·p95 latency, throughput과 peak memory를 측정합니다.
        </p>
      </div>
      <div id="paper-efficientnet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · EfficientNet</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Tan과 Le는 fixed resource에서 depth·width·resolution을 균형 있게 키우는 compound scaling을 제안하고 MobileNet·ResNet과 NAS로 만든 EfficientNet family에서 평가했습니다. 이 결과는 α·β·γ나 B7이 모든 target dataset·accelerator에서 최적이라는 보장이 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v97/tan19a.html" target="_blank" rel="noreferrer">Scaling 식과 실험 범위 보기</a>
      </div>
      <div id="paper-convnext" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · ConvNeXt</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Liu 등은 ResNet에서 출발해 training recipe와 macro·micro design을 단계적으로 modernize하여 standard ConvNet이 Transformer 계열과 경쟁할 수 있음을 보였습니다. 여러 변경이 누적된 결과이므로 특정 block 하나의 보편적 우월성으로 해석하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html" target="_blank" rel="noreferrer">단계별 modernization과 ablation 보기</a>
      </div>
      <div id="paper-vit" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Vision Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Dosovitskiy 등은 image patch를 token sequence로 바꾸고 표준 Transformer encoder를 large-scale supervised pretraining한 뒤 image benchmarks로 transfer했습니다. 원 논문의 data scale과 pretraining 조건을 작은 target dataset의 scratch training 주장으로 바꾸면 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openreview.net/forum?id=YicbFdNTTy" target="_blank" rel="noreferrer">Patch representation과 pretraining 조건 보기</a>
      </div>
    </section>
  );
}
