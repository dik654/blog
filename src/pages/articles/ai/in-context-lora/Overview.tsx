import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const compare = [
  [
    "일반적인 conditional fine-tuning",
    "새 cross-attention module이나 adapter를 추가해 조건 정보를 별도 경로로 주입",
  ],
  [
    "IC-LoRA",
    "조건(reference)과 목표(target)를 같은 attention sequence에 이어붙이고, base model의 self-attention이 이미 가진 in-context 능력만 재사용",
  ],
];

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        새 architecture 대신 self-attention의 in-context 능력을 재사용한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          In-Context LoRA(IC-LoRA)는 diffusion transformer(DiT)를 특정 task에
          맞출 때, 조건(<code>reference</code>)과 목표(<code>target</code>)를
          별도 module로 분리하지 않습니다. 대신 둘을 하나의{" "}
          <code>attention sequence</code>로 이어붙이고, base model이 이미 갖고
          있는 <code>self-attention</code>이 그 안에서 대응 관계를 스스로
          찾게 합니다. 새로 학습하는 것은{" "}
          <Link to="/ai/lora-finetuning">LoRA</Link>의 저랭크 <code>A·B</code>{" "}
          행렬뿐이고, base model weight는 그대로 얼립니다.
        </p>
        <p>
          이 방식이 가능한 이유는{" "}
          <Link to="/ai/attention-theory#self-attention">self-attention</Link>
          이 애초에 sequence 안의 모든 token 쌍을 서로 비교하도록 설계됐기
          때문입니다. Reference와 target을 한 sequence에 넣으면, attention이
          두 구간 사이의 correspondence를 별도 module 없이도 학습할 수 있다.
          이 글은 IC-LoRA의 이 재사용 원리와, 이를 audio-driven talking video
          identity 보존에 적용한 구체 사례인 ID-LoRA(2026)를 함께 다룹니다.
        </p>
        <p>
          여기서 “video attention·FFN에 LoRA를 붙인다”는 말을 실제 module
          범위로 해석하려면 먼저 <Link to="/ai/image-video-lora-architecture">
          Image·Video LoRA architecture</Link>의 spatial·temporal·cross-modal
          구분이 필요합니다. 이 글은 그 target 범위를 전제로 reference와 target을
          한 context에 넣는 조건화 방식에만 집중합니다.
        </p>
      </div>

      <ContentBoundary article="in-context-lora" />

      <div
        id="paper-ic-lora"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · IC-LoRA의 출발점
        </p>
        <p className="mt-2 text-sm font-semibold">
          In-Context LoRA for Diffusion Transformers
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Task마다 새 architecture나 adapter를 만들지 않고 reference와 target을 하나의 attention sequence로 이어붙인 뒤 LoRA만 학습해도
          DiT가 in-context로 조건을 따를 수 있음을 보입니다. 논문이 실험한 DiT·dataset·task 범위를 넘어 모든 in-context LoRA 응용이 같은 품질을
          낸다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2410.23775"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 방법·실험 보기
        </a>
      </div>

      <figure
        data-viz="ic-lora-vs-adapter"
        className="not-prose my-8 grid gap-4 rounded-xl border border-border/75 bg-card p-4 sm:grid-cols-2 sm:p-6"
      >
        {compare.map(([title, body]) => (
          <div key={title} className="rounded-xl border bg-background p-4">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <TermBreakdown
        title="IC-LoRA가 새로 도입하는 두 개념"
        items={[
          {
            term: "in-context LoRA adaptation",
            description:
              "새 cross-attention이나 adapter 없이 base DiT의 self-attention만으로 reference-conditioned 생성을 학습하는 fine-tuning 방식입니다.",
            example:
              "LTX-2 DiT의 video attention·FFN module에만 rank 32 LoRA를 붙이고, reference latent를 같은 attention sequence에 넣는 것만으로 video-to-video task를 학습합니다.",
            boundary:
              "Base model의 attention이 애초에 in-context 능력을 가진 architecture(DiT)가 아니면 이 방식이 성립하지 않습니다.",
          },
          {
            term: "reference-target context concatenation",
            description:
              "Clean reference와 noisy target을 하나의 attention sequence로 이어붙여 in-context 조건화를 구현하는 방법입니다.",
            example:
              "torch.cat([ref_audio_latents, noisy_target_audio], dim=1)로 reference와 target audio latent를 이어붙이면, self-attention이 자동으로 두 구간 사이 대응 관계를 학습합니다.",
            boundary:
              "Sequence 길이가 늘어나는 만큼 attention 연산량도 늘어나며, reference가 길면 target 길이 대비 비용이 커집니다.",
          },
        ]}
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실제 어느 module에, 얼마나 큰 rank로 붙는지 확인한다</h3>
        <p>
          "새 architecture 없이 기존 attention을 재사용한다"는 말이 실제 구현에서는 정확히 어느 weight에 LoRA가 붙고 어느 weight는 그대로 얼어 있는지,
          아래 실제 설정 파일에서 확인할 수 있습니다.
        </p>
      </div>
      <CodeViewButton
        onClick={() => onCodeRef("lora-config", codeRefs["lora-config"])}
      />
    </section>
  );
}
