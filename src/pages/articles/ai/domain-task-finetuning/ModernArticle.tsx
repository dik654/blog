import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "../domain-finetuning/DomainAdaptationPathLocator";
import {
  BehaviorReleaseViz,
  DemonstrationContractViz,
  ResponseMaskViz,
  TaskFinetuningTraceViz,
  UpdateScopeViz,
} from "./TaskFinetuningViz";

export default function DomainTaskFinetuningArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="medical-json-behavior"
        className="scroll-mt-20"
      >
        <DomainAdaptationPathLocator current="task-finetuning" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 같은 사실을 알아도 출력 행동은 demonstration으로 따로 가르칩니다
        </h2>

        <TaskFinetuningTraceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의료 문장 <strong>“혈압 120/80, 흉통 부인”</strong>을 읽은 모델이 내용을
            설명할 수는 있지만, 서비스가 요구하는 JSON schema를 자꾸 어긴다고
            가정하겠습니다. 필요한 변화는 새 의료 지식을 외우는 것이 아니라 같은 입력에서
            세 필드와 근거를 내고, 근거가 없으면 추측하지 않는 행동입니다.
          </p>
          <p>
            이 요청 하나를 demonstration으로 만든 뒤 prompt는 채점에서 빼고 response만
            남깁니다. 설명용 response NLL 0.2·0.4·0.8의 평균은 약 0.467입니다.
          </p>
          <p>
            마지막에는 v1과 v2를 네 행동 gate로 비교합니다. 본문의 문장·token 묶음·수치와
            threshold는 계산 순서를 보여 주기 위한 가정 [A]입니다.
          </p>
          <p>
            여기서 supervised fine-tuning은 <em>무엇을 정답 행동으로 채점할지</em> 정합니다.
            Full fine-tuning·LoRA·head-only는 같은 loss가 <em>어느 parameter를 바꿀지</em>
            정합니다. 두 결정을 한 줄의 제품 비교표로 합치면 안 됩니다.
          </p>
        </div>

        <TermBreakdown
          title="한 요청에서 구분할 네 계약"
          items={[
            {
              term: "Input contract",
              description: "System·user role, context source, chat template, truncation 방향을 고정합니다.",
            },
            {
              term: "Target contract",
              description: "JSON schema, label 의미, evidence field, 근거가 없을 때의 null·review 행동을 정합니다.",
            },
            {
              term: "Loss contract",
              description: "Prompt와 response 가운데 어느 token을 채점하고 어떤 reduction을 쓸지 정합니다.",
            },
            {
              term: "Evaluation contract",
              description: "형식·내용·거절·일반 능력을 어떤 split과 threshold에서 판정할지 정합니다.",
              boundary: "평가 계약이 없으면 좋은 checkpoint가 아니라 판정할 수 없는 checkpoint입니다.",
            },
          ]}
        />
        <ContentBoundary article="domain-task-finetuning" />
      </section>

      <section id="demonstration" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 입력과 정답뿐 아니라 거절 행동과 채점 규칙까지 한 revision으로 묶습니다
        </h2>

        <DemonstrationContractViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            설명용 target은 <code>systolic</code>, <code>diastolic</code>,
            <code>chest_pain</code>과 각 값을 뒷받침한 <code>evidence</code>를 냅니다. 같은
            schema 이름을 써도 “흉통 부인”을 <code>false</code>로 둘지, 근거가 없을 때
            <code>null</code>과 human review를 함께 낼지는 데이터 작성 규칙에 따라 달라집니다.
            그래서 행 하나보다 계약 revision이 먼저입니다.
          </p>
          <p>
            긍정 예시만 모으면 모델은 빈 문서에서도 그럴듯한 값을 채울 수 있습니다. 근거가
            없는 문장과 서로 모순된 문장도 demonstration에 포함합니다. 필드가 모호할 때
            원하는 abstention을 target으로 둡니다. 이 designed failure가 있어야 “모름”과 “추출
            성공”을 구분할 수 있습니다.
          </p>
        </div>

        <TermBreakdown
          title="한 demonstration을 다시 만들 수 있게 남길 상태"
          items={[
            { term: "Source span", description: "정답을 뒷받침한 원문 위치와 source revision입니다." },
            { term: "Serialization", description: "Role token, key 순서, whitespace, EOS를 포함한 실제 문자열입니다." },
            { term: "Policy", description: "모호성·충돌·근거 없음에서 null·거절·review 가운데 무엇을 내는지 정한 규칙입니다." },
            { term: "Lineage", description: "원본 record에서 정제 example, shard, training run까지 이어지는 식별자입니다." },
          ]}
        />
      </section>

      <section id="response-loss" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. Prompt는 읽고 response만 채점합니다
        </h2>

        <ResponseMaskViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention mask와 loss mask는 역할이 다릅니다. Prompt 위치의 loss mask를 0으로
            만들어도 뒤의 response token은 앞선 context를 attention으로 읽습니다. Prompt
            token 자체를 맞히는 오차만 gradient 평균에서 빠집니다.
          </p>
          <p>
            그림은 prompt 세 묶음과 response 세 묶음으로 단순화했습니다. 실제 token 개수는
            tokenizer와 chat template에 따라 달라집니다. Training·evaluation·serving에는 같은
            template revision을 사용해야 합니다. 그래야 “assistant 응답만 채점했다”는 설명이
            유지됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="전체 대화는 context로 유지하면서 assistant response token만 평균 loss에 넣으려면 어떻게 합니까?"
          idea={(
            <p>
              각 target 위치에 binary loss mask를 붙입니다. Mask가 1인 token의 NLL만 더한
              뒤 mask 합으로 나눕니다.
            </p>
          )}
          formula={String.raw`N_{\rm resp}=\sum_t m_t,\qquad\mathcal L_{\rm SFT}=-\frac1{N_{\rm resp}}\sum_{t=1}^T m_t\log\pi_\theta(y_t\mid y_{<t})`}
          annotatedFormula={String.raw`\begin{aligned}N_{\rm resp}&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{채점할 response token 수}}\\s_t&=\underbrace{-\log\pi_\theta(y_t\mid y_{<t})}_{\text{관측 target token의 오차}}\\e_t&=\underbrace{m_t s_t}_{\text{prompt 오차는 0, response 오차만 유지}}\\\mathcal L_{\rm SFT}&=\underbrace{\frac1{N_{\rm resp}}\sum_{t=1}^{T}e_t}_{\text{response token당 평균 loss}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_t m_t`,
              annotation: ["Binary mask의 1을 더해", "실제 채점할 response token 수를 계산합니다."],
            },
            {
              expression: String.raw`-\log\pi_\theta(y_t\mid y_{<t})`,
              annotation: ["관측 target token의 확률을 negative log로 바꿔", "틀릴수록 큰 오차를 만듭니다."],
            },
            {
              expression: String.raw`m_t s_t`,
              annotation: ["오차에 mask를 곱해", "Prompt는 context로만 두고 response만 채점합니다."],
            },
            {
              expression: String.raw`\sum_t e_t/N_{\rm resp}`,
              annotation: ["남은 오차를 더하고 유효 token 수로 나눠", "길이를 보정한 평균 loss를 만듭니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`y_t`, name: "Serialized token", description: "Prompt와 response를 합친 sequence의 t번째 관측 token입니다." },
            { symbol: String.raw`m_t`, name: "Response loss mask", description: "채점할 assistant target이면 1, prompt·padding이면 0입니다." },
            { symbol: String.raw`\pi_\theta`, name: "Language-model policy", description: "현재 prefix에서 다음 token distribution을 냅니다." },
            { symbol: String.raw`N_{\rm resp}`, name: "Valid response tokens", description: "Mean reduction의 분모가 되는 mask 합입니다." },
          ]}
          assumptions={[
            "Decoder-only teacher forcing과 response-only mean reduction을 가정합니다.",
            "Chat template과 role token revision을 training·evaluation·serving에서 맞춥니다.",
            "Schema 정확도와 내용의 사실성은 별도 metric으로 판정합니다.",
          ]}
          interpretation="Mask [0,0,0,1,1,1]과 response NLL [0.2,0.4,0.8]이면 loss는 1.4/3≈0.467입니다. 앞 세 묶음은 loss에서 빠지지만 response 확률의 context로 남습니다."
        />
      </section>

      <section id="update-scope" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. 학습 목표를 고정한 뒤 바꿀 parameter 범위만 비교합니다
        </h2>

        <UpdateScopeViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Full fine-tuning, LoRA, head-only를 비교하려면 SFT objective와 example 순서를 먼저
            같게 둡니다. 시작 checkpoint와 seed를 고정합니다. Effective batch, optimizer step,
            evaluation split도 맞춘 뒤 업데이트 범위만 바꿉니다.
          </p>
          <p>
            Trainable parameter가 적어도 wall time과 peak memory가 반드시 줄지는 않습니다.
            Serving latency도 직접 측정해야 합니다. Adapter를 쓸 때는 target module과 rank를
            기록합니다. Checkpoint 저장 방식과 merge 여부도 새 실행 조건입니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 loss에 적용할 세 update scope"
          items={[
            {
              term: "Full fine-tuning",
              description: "Base model의 대부분 또는 모든 trainable weight를 optimizer가 갱신합니다.",
              boundary: "표현력·회귀·optimizer state·checkpoint 비용을 실제 workload에서 함께 측정합니다.",
            },
            {
              term: "LoRA·adapter",
              description: "선택한 module에 작은 trainable update를 붙이고 base weight는 고정합니다.",
              boundary: "Target module·rank·adapter 선택·merge가 새 artifact contract가 됩니다.",
            },
            {
              term: "Frozen encoder·head-only",
              description: "Representation model을 고정하고 작은 task head만 학습합니다.",
              example: "고정 embedding 위의 분류 head처럼 출력 공간이 제한된 작업에 적용할 수 있습니다.",
            },
          ]}
        />
      </section>

      <section id="behavior-release" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          5. 평균 점수 대신 네 행동 gate를 모두 통과시킵니다
        </h2>

        <BehaviorReleaseViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            설명용 v1은 JSON parse와 abstention 기준을 통과합니다. 일반 회귀도 허용 범위
            안입니다. 그러나 factuality가 0.84여서 사전 기준 0.90에 못 미칩니다. 형식이 완벽해도 혈압이나 부정 표현을
            잘못 추출하면 출시할 수 없습니다. v2는 네 기준을 모두 통과해 release 후보로
            남습니다.
          </p>
          <p>
            이 판정은 실제 의료 성능을 주장하지 않습니다. 같은 source span을 기준으로
            blinded evaluation을 해야 합니다. Entity·기관·시기별 slice와 신뢰 구간도 따로
            봅니다. Human review capacity도 운영 전에 확인합니다. Test set이 오염됐거나 evaluation revision이 다르면 결과를 1로
            만들지 않고 <strong>판정 불가</strong>로 멈춥니다.
          </p>
        </div>

        <ExplainedFormula
          question="형식은 통과했지만 내용이 틀린 model을 평균 점수로 출시하지 않으려면 어떻게 합니까?"
          idea={(
            <p>
              각 행동 metric을 사전에 정한 threshold와 비교해 0 또는 1로 만들고, 네 결과를
              곱합니다. 하나라도 0이면 release도 0입니다.
            </p>
          )}
          formula={String.raw`R=\mathbb 1[M_{\rm fmt}\ge\tau_{\rm fmt}]\mathbb 1[M_{\rm fact}\ge\tau_{\rm fact}]\mathbb 1[M_{\rm abst}\ge\tau_{\rm abst}]\mathbb 1[\Delta_{\rm gen}\ge-\varepsilon]`}
          annotatedFormula={String.raw`\begin{aligned}g_f&=\underbrace{\mathbb 1[M_{\rm fmt}\ge\tau_{\rm fmt}]}_{\text{schema gate}}\\g_c&=\underbrace{\mathbb 1[M_{\rm fact}\ge\tau_{\rm fact}]}_{\text{내용·근거 gate}}\\g_a&=\underbrace{\mathbb 1[M_{\rm abst}\ge\tau_{\rm abst}]}_{\text{거절·review gate}}\\g_g&=\underbrace{\mathbb 1[\Delta_{\rm gen}\ge-\varepsilon]}_{\text{일반 능력 회귀 gate}}\\R&=\underbrace{g_f g_c g_a g_g}_{\text{네 gate가 모두 1일 때만 release}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbb 1[M\ge\tau]`,
              annotation: ["각 metric을 미리 정한 threshold와 비교해", "통과는 1, 실패는 0으로 바꿉니다."],
            },
            {
              expression: String.raw`g_f g_c g_a g_g`,
              annotation: ["독립 gate 네 개를 곱해", "한 실패도 높은 다른 점수로 상쇄되지 않게 합니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`M_{\rm fmt}`, name: "Format metric", description: "Parse와 schema validity 비율입니다." },
            { symbol: String.raw`M_{\rm fact}`, name: "Factual metric", description: "Source span과 맞는 값·부정·근거를 낸 비율입니다." },
            { symbol: String.raw`M_{\rm abst}`, name: "Abstention metric", description: "근거 부족·모호성에서 올바르게 멈춘 정도입니다." },
            { symbol: "R", name: "Release decision", description: "모든 gate가 통과할 때만 1인 비보상 판정입니다." },
          ]}
          assumptions={[
            "Threshold는 untouched test를 보기 전에 고정합니다.",
            "각 metric은 entity·time·rare intent slice와 함께 보고합니다.",
            "Human review queue가 넘칠 때의 차단 동작도 target 행동에 포함합니다.",
          ]}
          interpretation="v1의 factuality gate가 0이면 format 1.00이어도 R=0입니다. v2처럼 네 gate가 모두 1일 때만 release 후보가 됩니다."
        />

        <div id="paper-instructgpt" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Ouyang et al. — InstructGPT"
            href="https://arxiv.org/abs/2203.02155"
          >
            Demonstration 기반 supervised fine-tuning과 preference optimization 경로를
            구분해 설명합니다. 이 논문의 annotator·prompt distribution·model 결과가 본문의
            의료 extraction 성능을 입증하지는 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-lora-task" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Hu et al. — LoRA"
            href="https://arxiv.org/abs/2106.09685"
          >
            Frozen weight에 저랭크 trainable update를 붙이는 parameter-efficient 방법입니다.
            같은 data·step·evaluation에서 측정하지 않으면 full fine-tuning보다 낫다고 결론낼
            수 없습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return" data-teach-level="6" className="scroll-mt-20">
        <DomainAdaptationMapReturn current="task-finetuning" />
      </section>

      <section id="self-check" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">6. 스스로 확인하기</h2>
        <ol className="space-y-4 border-y border-border py-5 text-sm leading-7">
          <li><strong>Mask [0,0,0,1,1,1]과 response NLL [0.2,0.4,0.8]의 평균 loss는 얼마입니까?</strong> <span className="text-muted-foreground">(답: 3절)</span></li>
          <li><strong>SFT와 LoRA를 같은 선택 축으로 비교하면 안 되는 이유는 무엇입니까?</strong> <span className="text-muted-foreground">(답: 1·4절)</span></li>
          <li><strong>Format 1.00, factuality 0.84이고 factuality 기준이 0.90이면 release R은 얼마입니까?</strong> <span className="text-muted-foreground">(답: 5절)</span></li>
        </ol>
      </section>
    </div>
  );
}
