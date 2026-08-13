import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ArchitectureBottleneckViz from "./viz/ArchitectureBottleneckViz";

export default function Architectures() {
  return (
    <section id="architectures" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CNN architecture는 서로 다른 bottleneck을 줄여 왔다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          LeNet은 convolution·subsampling·classifier를 실용적으로 연결했고,
          AlexNet은 GPU·ReLU·augmentation을 결합해 ImageNet 규모의 학습을
          보여 줬습니다. VGG는 작은 kernel을 반복해 depth를 키웠지만 계산량이
          컸으며, ResNet은 identity shortcut으로 깊은 plain network에서 나타난
          optimization degradation을 완화했습니다. 이 역사는 단순한 순위표가 아니라
          각 세대가 어떤 bottleneck을 줄였는지 중심으로 읽어야 합니다.
        </p>
      </div>
      <ArchitectureBottleneckViz />

      <div id="paper-alexnet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 대규모 학습 recipe</p>
        <p className="mt-2 text-sm font-semibold">ImageNet Classification with Deep Convolutional Neural Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          5개 convolution layer와 3개 fully connected layer에 GPU 구현·ReLU·data
          augmentation·dropout을 결합해 ImageNet에서 큰 개선을 보고했습니다. 이를
          convolution 하나의 단독 효과로 해석하지 말고 data·compute·regularization이
          함께 바뀐 system 결과로 읽어야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" target="_blank" rel="noreferrer">원 논문의 architecture·training·평가 보기</a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <Link to="/ai/resnet">ResNet의 residual path</Link>는 정본 글에서 자세히
          다룹니다. 여기서는 MobileNet의 depthwise separable convolution이 dense
          convolution의 spatial filtering과 channel mixing을 분리하면서 비용식을
          어떻게 바꾸는지 살펴봅니다.
        </p>
      </div>
      <ExplainedFormula question="Depthwise separable convolution은 dense k×k convolution의 multiply-add 비용을 어떻게 나눌까?" idea={<>Depthwise 단계는 input channel마다 k×k spatial filter 하나를 쓰고, 1×1 pointwise 단계가 channel을 Cout개로 섞습니다.</>} formula={String.raw`\begin{aligned}C_{dense}&=HWk^2C_{in}C_{out}\\C_{sep}&=HW(k^2C_{in}+C_{in}C_{out})\end{aligned}`} terms={[{symbol:"HW",name:"output positions",description:"간단한 비교를 위해 input·output spatial size가 같다고 둡니다."},{symbol:"k^2C_{in}",name:"depthwise cost",description:"각 input channel의 독립 spatial filtering 비용입니다."},{symbol:"C_{in}C_{out}",name:"pointwise cost",description:"한 위치에서 channel을 선형 결합하는 1×1 convolution 비용입니다."}]} assumptions={["Batch·bias·normalization·memory access와 hardware kernel efficiency는 제외한 MAC 근사입니다.","FLOPs 감소가 같은 비율의 latency 감소를 보장하지 않습니다."]} interpretation="Cout이 크면 dense 대비 비용을 크게 줄일 수 있지만 channel interaction은 pointwise 단계에만 모입니다. Mobile 배포에서는 parameter 수보다 실제 accelerator의 depthwise kernel·memory bandwidth를 측정해야 합니다."/>

      <div id="paper-mobilenet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 연산 분해</p>
        <p className="mt-2 text-sm font-semibold">MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Depthwise separable convolution과 width·resolution multiplier로 accuracy와
          계산 예산을 조절했습니다. 논문의 MAC 감소율이 특정 device에서 같은 latency
          감소율을 보장하지는 않으므로 실제 kernel과 memory access를 따로 측정해야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1704.04861" target="_blank" rel="noreferrer">원 논문의 비용식·실험 보기</a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ConvNeXt는 Transformer 시대의 stage ratio·normalization·activation·large
          kernel 같은 선택을 pure CNN에 차례로 적용했습니다. 이는 CNN의 핵심이
          특정한 3×3-ReLU-pooling template가 아니라 local shared operator라는 점을
          보여 줍니다.
        </p>
      </div>
      <div id="paper-convnext" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 현대화한 pure CNN</p>
        <p className="mt-2 text-sm font-semibold">A ConvNet for the 2020s</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          ResNet 계열 baseline에 macro design·ResNeXt·inverted bottleneck·large kernel
          등을 단계적으로 적용해 ConvNeXt를 구성했습니다. 여러 변경을 누적한 결과이므로
          large kernel 하나만의 보편적 우위를 증명한 실험으로 읽으면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2201.03545" target="_blank" rel="noreferrer">원 논문의 단계별 modernization 보기</a>
      </div>
    </section>
  );
}
