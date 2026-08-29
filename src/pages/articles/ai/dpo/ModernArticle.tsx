import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import DPOObjective from "../alignment-methods/DPO";
import AlignmentPipelineViz from "../alignment-methods/viz/AlignmentPipelineViz";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Direct Preference Optimization(DPO)은 하나의 prompt와 두 response에서 시작합니다</p>
          <h2 className="text-3xl font-bold tracking-tight">DPO는 reward를 없애는 기법이 아니라 pair의 선호를 policy log-ratio 안에 넣는 방법입니다</h2>
        </header>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 <strong>pairwise preference</strong>부터 고정합니다. 같은 prompt에 답 A와 답 B를 보여 주고, evaluator가 더 낫다고 고른 답을 <strong>chosen</strong>, 다른 답을 <strong>rejected</strong>라고 부릅니다. 이 label은 chosen이 절대적으로 옳다는 증명보다 “이 비교에서는 A를 더 선호했다”는 관측입니다.
          </p>
          <p className="leading-8">
            DPO는 이 pair를 별도 scalar reward model에 먼저 압축하지 않습니다. Trainable policy가 chosen과 rejected에 주는 확률을 고정된 <strong>reference policy</strong>와 각각 비교하고, chosen 쪽의 상대 상승분이 rejected보다 커지게 학습합니다. <Link to="/ai/rlhf">RLHF 글</Link>의 online rollout·reward model·PPO와 다른 지점은 여기에 있습니다.
          </p>
        </div>
        <AlignmentPipelineViz mode="dpo" />
        <ContentBoundary article="dpo" />
      </section>

      <section id="pair-contract" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Pair를 loss에 넣기 전에 네 항목을 한 줄씩 검사합니다</h2>
          <p className="leading-8">긴 tuple을 한 문장에 나열하지 않고, 각 항목이 무엇을 소유하고 무엇을 보장하지 않는지 분리합니다.</p>
        </div>
        <TermBreakdown
          title="DPO example의 형태"
          items={[
            { term: "Prompt · x", description: "Chosen과 rejected가 공유하는 질문·대화 prefix입니다.", example: "동일한 system prompt와 chat template까지 같은 pair여야 합니다.", boundary: "서로 다른 질문의 두 답을 비교 pair로 만들지 않습니다." },
            { term: "Chosen · y⁺", description: "Evaluator가 이 pair에서 더 낫다고 고른 response입니다.", example: "근거를 밝히고 불확실성을 표시한 답 A가 chosen이 될 수 있습니다.", boundary: "Chosen label은 모든 평가 축에서 완전한 정답이라는 뜻이 아닙니다." },
            { term: "Rejected · y⁻", description: "같은 prompt에서 상대적으로 덜 선호된 response입니다.", example: "그럴듯한 사실을 꾸며 낸 답 B가 rejected가 될 수 있습니다.", boundary: "나쁜 답만 모으면 쉬운 shortcut을 배우므로 난이도와 길이를 점검합니다." },
            { term: "Reference · πref", description: "현재 policy가 어느 방향으로 얼마나 이동했는지 재는 고정 checkpoint입니다.", example: "보통 같은 tokenizer·template를 쓰는 SFT checkpoint입니다.", boundary: "Reference에 가깝다는 사실이 안전성이나 사실성을 보장하지 않습니다." },
          ]}
        />
      </section>

      <DPOObjective />

      <section id="evaluation" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>마지막에는 pair accuracy가 아니라 배포 behavior를 다시 봅니다</h2>
          <p className="leading-8">Reference revision·chat template·β·sequence log-prob 집계 방식을 한 실험 receipt에 남깁니다. 그 뒤 길이·문체 shortcut, pair 밖 prompt, 사실성, over-refusal, jailbreak와 base capability regression을 서로 다른 slice로 평가합니다.</p>
          <p className="leading-8">DPO가 PPO보다 운영하기 단순하다는 말은 online generation cluster와 reward serving이 빠진다는 뜻입니다. Preference data 수집·정제, reference forward, independent human audit와 실패 시 rollback까지 사라진다는 뜻은 아닙니다.</p>
        </div>
        <div id="paper-dpo-implementation" className="scroll-mt-20">
          <CitationBlock source="Hugging Face TRL · DPO Trainer" citeKey={2} type="code" href="https://huggingface.co/docs/trl/dpo_trainer">
            <p><strong>문제:</strong> Pairwise objective를 실제 tokenizer·reference·batch 설정으로 옮겨야 합니다.</p>
            <p><strong>핵심 기여:</strong> DPO loss와 reference handling을 구현하는 공개 trainer interface입니다.</p>
            <p><strong>전제:</strong> 사용한 TRL revision, loss variant, chat template와 data formatting을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 구현 선택과 configuration surface를 확인하는 근거입니다.</p>
            <p><strong>비주장:</strong> 특정 default가 모든 model과 dataset에서 최적이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
