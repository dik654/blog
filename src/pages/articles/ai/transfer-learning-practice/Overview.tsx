import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Transfer learning은 source에서 배운 함수를 target 문제의 출발점으로 쓰는 것입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          고양이·자동차를 구분하도록 학습한 image encoder는 edge와 texture를 이미
          표현할 수 있고, 일반 문서로 학습한 language model은 단어와 문장 관계를
          이미 담고 있습니다. 새 task는 이 representation을 그대로 쓸지, 일부만
          고칠지, 전부 다시 조정할지를 결정합니다. 가져오는 것은 정답 자체가
          아니라 <strong>parameter initialization과 preprocessing contract</strong>입니다.
        </p>
        <p>
          첫 baseline은 pretrained backbone을 고정하고 새 head만 학습하는 fixed
          feature입니다. 여기서 input·label·metric이 정상임을 확인한 뒤 upper
          blocks, 전체 model 순으로 trainable scope를 넓힙니다. “label이 몇 개면
          full fine-tuning” 같은 고정 임계값 대신 source–target 차이, 반복 분산,
          memory·wall time과 target validation gain으로 단계마다 판단합니다.
        </p>
        <p>
          Training loop·checkpoint는 <Link to="/ai/training-pipeline">학습 파이프라인 글</Link>,
          learning-rate schedule 자체는 <Link to="/ai/lr-scheduling">scheduler 글</Link>의
          정본을 재사용합니다. 여기서는 pretrained state의 어느 부분을 바꾸는지와
          negative transfer를 어떻게 판별하는지에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="transfer-learning-practice" />
      <ExplainedFormula
        question="Pretrained backbone과 새 task head는 target data에서 어떤 함수로 학습될까?"
        idea={<>Source에서 얻은 θsrc로 representation f를 시작하고, 새 head φ는 target label에 맞게 초기화합니다. Fixed feature는 θ를 고정하고 φ만, full fine-tuning은 둘 다 target empirical risk로 조정합니다.</>}
        formula={String.raw`\begin{aligned}\hat y_i&=g_{\phi}(f_{\theta}(x_i)),\\\theta_0&=\theta_{\mathrm{src}},\quad \phi_0=\phi_{\mathrm{new}},\\\mathcal L_t(\theta,\phi)&=\frac1n\sum_{i=1}^{n}\ell(\hat y_i,y_i),\\(\theta^*,\phi^*)&=\arg\min_{\theta,\phi}\mathcal L_t(\theta,\phi).\end{aligned}`}
        terms={[
          { symbol: "f_θ", name: "backbone · encoder", description: "Source pretraining에서 시작해 input을 representation으로 바꾸는 함수입니다." },
          { symbol: "g_φ", name: "target head", description: "Representation을 새 task의 class·score로 바꾸는 출력 함수입니다." },
          { symbol: "θ_src", name: "pretrained state", description: "Source data와 objective가 만든 backbone 초기 parameter입니다." },
          { symbol: "ℓ", name: "target loss", description: "Target label 의미에 맞춰 정한 sample별 학습 오차입니다." },
          { symbol: "ℒ_t", name: "target empirical risk", description: "Target train split에서 sample별 loss를 평균한 실제 최적화 목적입니다." },
        ]}
        assumptions={["Checkpoint architecture·input normalization·tokenizer·label mapping을 확인합니다.", "Target train/validation/test split은 adaptation 전에 고정합니다.", "Fixed feature에서는 최적화 변수에서 θ를 제외하고 partial fine-tuning에서는 선택한 block만 포함합니다."]}
        interpretation="Transfer learning의 핵심 선택은 pretrained 여부가 아니라 target loss가 θ의 어느 부분까지 바꾸도록 허용할지입니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div id="docs-transfer-tutorial" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 예제 따라 읽기 · PyTorch Transfer Learning</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">공식 tutorial은 ImageNet pretrained ConvNet을 initialization으로 전체 fine-tuning하는 경우와 마지막 layer만 학습하는 fixed feature extractor를 구분합니다. Ant·bee 소규모 image classification 예제의 결과를 다른 modality와 domain의 보편적 우월성으로 일반화해서는 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" target="_blank" rel="noreferrer">현재 tutorial의 두 시나리오 보기</a>
      </div>
    </section>
  );
}
