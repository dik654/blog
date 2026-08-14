import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReceptiveFieldViz from "./viz/ReceptiveFieldViz";

export default function InductiveBias() {
  return (
    <section id="inductive-bias" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Equivariance와 invariance, 이론적·실효 receptive field를 구분한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          같은 kernel을 위치에 공유하면 input을 이동했을 때 feature map도 대응해
          이동하는 translation equivariance가 생깁니다. Prediction이 이동 전후에
          완전히 같아지는 invariance와는 다릅니다. Global pooling과 augmentation이
          위치 민감도를 줄일 수 있지만 stride·padding·유한한 image boundary는 정확한
          equivariance를 깨뜨릴 수 있습니다.
        </p>
      </div>
      <ExplainedFormula question="Stride 1의 이상적인 convolution은 input translation에 어떻게 반응할까?" idea={<>Input을 a만큼 이동시키는 operator Tₐ를 먼저 적용해 convolution하든, convolution output을 같은 만큼 이동시키든 결과가 같다는 관계입니다.</>} formula={String.raw`f(T_a\mathbf x)=T_a f(\mathbf x)`} terms={[{symbol:"f",name:"convolutional map",description:"위치에 같은 kernel을 쓰는 stride-1 operator입니다."},{symbol:"T_a",name:"translation",description:"Spatial grid를 a만큼 이동시키는 연산입니다."}]} assumptions={["무한·주기 grid 또는 translation과 일관된 boundary 처리의 이상적 경우입니다.","Stride>1 sampling, zero padding과 nonlinear downsampling은 exact equality를 깨뜨릴 수 있습니다."]} interpretation="Equivariance는 object가 이동하면 feature 위치도 이동한다는 뜻입니다. Classification head가 그 위치를 집계해야 최종 class score의 invariance에 가까워집니다."/>
      <ReceptiveFieldViz />
      <ExplainedFormula question="여러 convolution layer를 지날 때 한 unit이 연결되는 input 범위는 얼마나 넓어질까?" idea={<>현재 layer의 kernel이 이전 feature map에서 늘리는 범위에 이전 layer까지 누적된 jump, 즉 stride 곱을 곱합니다.</>} formula={String.raw`R_l=R_{l-1}+(k_l-1)\delta_l\prod_{m<l}s_m`} terms={[{symbol:"R_l",name:"theoretical receptive field",description:"Layer l unit과 graph상 연결된 input 좌표 범위입니다."},{symbol:String.raw`\prod_{m<l}s_m`,name:"input jump",description:"이전 feature map 한 칸이 원 input에서 떨어진 간격입니다."},{symbol:String.raw`\delta_l`,name:"dilation",description:"해상도를 줄이지 않고 kernel span을 넓힙니다."}]} assumptions={["한 spatial 축의 정규 grid를 다루며 branch·skip 연결은 path별 receptive field를 합쳐 해석합니다.","연결 범위와 실제 gradient 영향의 크기는 다릅니다."]} interpretation="Theoretical receptive field 안의 모든 pixel이 같은 비중으로 쓰인다는 뜻은 아닙니다. Effective receptive field 연구는 실제 영향이 중심에 더 집중될 수 있음을 보였으므로 dense prediction에서는 context와 해상도를 함께 측정합니다."/>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Dilation은 kernel tap 사이를 벌려 해상도를 즉시 낮추지 않고 더 넓은 context를
          읽게 합니다. 다만 sampling pattern이 성기면 gridding artifact가 나타날 수
          있고, stride로 grid를 줄이기 전에 high-frequency 성분을 충분히 제한하지
          않으면 aliasing이 생깁니다. Sampling의 물리적 전제와 구분은
          <Link to="/ai/fft#nyquist-boundary"> FFT 글의 Nyquist 정본</Link>에서 이어집니다.
        </p>
      </div>

      <div id="paper-effective-receptive-field" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 실제 영향 범위</p>
        <p className="mt-2 text-sm font-semibold">Understanding the Effective Receptive Field in Deep Convolutional Neural Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Graph상 연결된 theoretical receptive field와 실제 output에 대한 gradient 영향
          분포를 분리하고, 후자가 전체 범위의 일부에 집중되는 현상을 분석합니다.
          특정 architecture의 분석 결과를 모든 trained CNN의 고정 법칙으로 읽으면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1701.04128" target="_blank" rel="noreferrer">원 논문의 정의·분석·실험 보기</a>
      </div>

      <div id="paper-dilated-convolution" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Dilation</p>
        <p className="mt-2 text-sm font-semibold">Multi-Scale Context Aggregation by Dilated Convolutions</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dense prediction에서 resolution을 유지하면서 multi-scale context를 모으기 위해
          dilated convolution을 구성한 연구입니다. Dilation 하나가 aliasing이나 모든
          segmentation 경계 문제를 자동으로 해결한다는 주장은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1511.07122" target="_blank" rel="noreferrer">원 논문의 구조·context module·평가 보기</a>
      </div>
    </section>
  );
}
