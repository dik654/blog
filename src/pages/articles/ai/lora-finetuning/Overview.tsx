import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ExplainedFormula from "@/components/ui/explained-formula";
import PeftCompareViz from "./viz/PeftCompareViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        7B base를 고정하고 20M adapter만 학습해도 base forward는 남습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Parameter 70억 개짜리 base model에 trainable adapter 2천만 개를 붙인 사례를
          봅니다. LoRA는 base를 고정하고 선택한 linear layer의 변화량을 두 작은 행렬로
          학습합니다.
        </p>
        <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
        <ol>
          <li>Optimizer가 70억 개 base parameter를 모두 업데이트할까요?</li>
          <li>Gradient와 optimizer state는 주로 2천만 adapter parameter에 필요할까요?</li>
          <li>Forward도 adapter 2천만 개만 지나므로 base 계산이 사라질까요?</li>
        </ol>
        <p>
          답은 <strong>아니요, 예, 아니요</strong>입니다. 가장 먼저 줄어드는 것은
          trainable parameter·gradient·optimizer state·task별 저장량입니다. Frozen base의
          forward와 activation은 남으므로 20M/7B 비율만큼 전체 계산이 줄지는 않습니다.
        </p>
      </div>
      <div className="not-prose my-8"><PeftCompareViz /></div>
      <ContentBoundary article="lora-finetuning" />
      <ProgressiveDetail
        title="이 글은 어떤 순서로 LoRA를 설명하나요?"
        preview="Base와 adapter의 경계를 잡은 뒤 rank·QLoRA·데이터·배포 artifact 순서로 내려갑니다."
      >
        <p>
          먼저 low-rank update의 shape와 capacity를 계산합니다. 그다음 QLoRA의 저장·연산·학습 precision을 분리하고 chat template과 loss
          mask가 실제 학습 sequence를 어떻게 정하는지 확인합니다. 마지막에는 merge, requantization과 serving artifact의 검증 경계를 다룹니다.
        </p>
        <p>
          어떤 adaptation 방법을 고를지는
          <a href="/cs/ai/domain-finetuning"> 도메인 적응 정본</a>, 행렬 rank가
          처음이라면 <a href="/cs/ai/math-matrices-svd">행렬·SVD 정본</a>을 먼저
          참고할 수 있습니다.
        </p>
        <p>
          이 글의 target-module 원칙을 이미지·영상 diffusion model에 적용할
          때는 <a href="/cs/ai/image-video-lora-architecture">Image·Video LoRA
          architecture</a>로 이어집니다. 같은 LoRA 수식을 쓰더라도 spatial,
          temporal, cross-modal path 가운데 무엇을 학습하는지는 host model이
          결정합니다.
        </p>
      </ProgressiveDetail>
      <ExplainedFormula
        question="Full fine-tuning과 LoRA에서 실제로 업데이트되는 파라미터 집합은 어떻게 다를까요?"
        idea={<>Loss는 같은 model output에서 계산할 수 있지만 gradient를 적용하는 집합이 다릅니다. Full fine-tuning은 모든 base parameter를, LoRA는 adapter와 명시적으로 저장한 module만 optimizer에 넘깁니다.</>}
        formula={String.raw`\begin{aligned}
\Theta_{\mathrm{train}}^{\mathrm{full}}&=\Theta_{\mathrm{base}}\\
\Theta_{\mathrm{train}}^{\mathrm{LoRA}}&=\{A_m,B_m:m\in\mathcal T\}\\
&\quad\cup\Theta_{\mathrm{save}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\Theta_{\mathrm{train}}^{\mathrm{full}}&=\underbrace{\Theta_{\mathrm{base}}}_{\text{base 7B 전부}}\\\Theta_{\mathrm{train}}^{\mathrm{LoRA}}&=\underbrace{\{A_m,B_m:m\in\mathcal T\}}_{\text{target module의 adapter 20M}}\\&\quad\cup\underbrace{\Theta_{\mathrm{save}}}_{\text{의도적으로 함께 학습}}\end{aligned}`}
        operations={[
          { expression: String.raw`\Theta_{\mathrm{base}}`, annotation: ["full fine-tuning은 70억 개 base 전부를", "optimizer에 넘겨 gradient·state를 둡니다"] },
          { expression: String.raw`\{A_m,B_m:m\in\mathcal T\}`, annotation: ["LoRA는 고른 linear module의", "작은 두 행렬만 학습해 약 2천만 개", "base forward·activation은 그대로 남습니다"] },
          { expression: String.raw`\cup\Theta_{\mathrm{save}}`, annotation: ["classifier·embedding 일부처럼", "adapter 밖에서 따로 저장할 module입니다"] },
        ]}
        terms={[
          { symbol: "Theta_base", name: "base parameters", description: "Pretrained checkpoint의 전체 weight와 bias입니다." },
          { symbol: "T", name: "target modules", description: "LoRA update를 삽입하기로 한 실제 linear module 경로 집합입니다." },
          { symbol: "A_m,B_m", name: "adapter matrices", description: "Target module m에서 학습하는 두 low-rank 행렬입니다." },
          { symbol: "Theta_save", name: "modules to save", description: "Classifier·embedding 일부처럼 adapter 밖에서 의도적으로 학습·저장하는 module입니다." },
        ]}
        assumptions={["Optimizer가 받는 parameter의 requires_grad와 실제 checkpoint 저장 목록을 모두 확인합니다.", "Frozen base의 dropout·normalization buffer 등 train/eval state는 parameter freeze와 별도로 관리합니다.", "Trainable set이 작다고 activation memory와 base forward cost가 같은 비율로 줄지는 않습니다."]}
        interpretation="전체 7B weight 중 adapter 20M만 학습하면 optimizer state와 gradient는 주로 20M에만 필요하지만, forward/backward에서 base network를 통과하고 activation을 보존하는 비용은 남습니다."
      />
    </section>
  );
}
