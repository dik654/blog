import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "./DomainAdaptationPathLocator";
import {
  DomainAdaptationTraceViz,
  EvidenceMissingViz,
  GapOwnershipMap,
  InterventionFunnelViz,
} from "./DomainDecisionViz";
import { DOMAIN_ADAPTATION_FIXTURE as FIXTURE } from "./calculations";

const STATE_BOUNDARIES = [
  {
    state: "요청 context",
    contains: "현재 문서 passage·source revision·요청 지시",
    changedBy: "Prompt·retrieval pipeline",
    check: "응답이 사용한 문서 revision을 연결할 수 있는가",
  },
  {
    state: "모델 가중치",
    contains: "학습 corpus에서 반복된 언어·표현 패턴",
    changedBy: "Pretraining·continued pretraining",
    check: "같은 문체의 held-out 문장을 더 잘 예측·이해하는가",
  },
  {
    state: "행동 update",
    contains: "원하는 응답·label·schema·abstention 예시",
    changedBy: "SFT 또는 다른 task objective",
    check: "새 input에서도 target 행동을 재현하는가",
  },
  {
    state: "실행 환경",
    contains: "VRAM·latency·throughput·artifact loading 계약",
    changedBy: "Serving 설정·압축·update 범위",
    check: "품질을 유지하며 배포 한도를 지키는가",
  },
] as const;

export default function DomainAdaptationDecisionArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="current-policy-question"
        className="scroll-mt-20"
      >
        <DomainAdaptationPathLocator current="decision-map" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 도메인 실패는 잘못된 상태의 위치부터 찾습니다
        </h2>

        <DomainAdaptationTraceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고객이 “{FIXTURE.request}”라고 묻는 상황을 가정하겠습니다. Base model은
            이전 규정을 답하고 근거를 연결하지 못합니다. 이 사례에서 먼저 바꿀 것은
            model weight가 아니라 요청 시점의 외부 context입니다.
          </p>
          <p>
            검색기가 <code>{FIXTURE.sourceRevision}</code> 문서를 찾아 passage와
            revision을 넣으면 같은 model weight가 현재 조항과 근거를 함께 반환할 수
            있습니다. 이 흐름을 retrieval-augmented generation, 줄여서 RAG라고
            부릅니다. 반대로 전문 문체를 계속 잘못 읽거나 원하는 출력 행동을 반복해서
            어기는 문제라면 바꿔야 할 상태가 다릅니다.
          </p>
          <p>
            요청·revision·후보 점수는 설명을 위한 가정 [A]이며 실제 서비스 측정값이
            아닙니다. 이 글은 어떤 제품을 도입할지 확정하지 않고, 실패를 어느 상태의
            문제로 읽어야 하는지 설명합니다.
          </p>
        </div>
        <ContentBoundary article="domain-finetuning" />
      </section>

      <section id="diagnose" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 관찰한 실패를 네 상태 위치로 나눕니다
        </h2>

        <GapOwnershipMap />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            최신 사실을 모르는 문제와 전문 문장을 읽지 못하는 문제는 겉으로 모두
            오답처럼 보입니다. 그래서 같은 실패 sample에 현재 문서를 넣어 보고,
            출력 지시만 바꿔 보고, runtime 제약도 따로 재야 합니다. 한 변화만 적용한
            반례가 어느 상태에서 문제가 생겼는지 좁혀 줍니다.
          </p>
          <p>
            오늘 바뀐 규정과 출처는 외부 문서에 두는 편이 자연스럽습니다. 특허 문장
            구조처럼 unlabeled corpus에 반복되는 패턴은 continued pretraining 후보가
            됩니다. 사실은 맞지만 JSON schema를 어긴다면 input과 desired response가
            있는 SFT 후보로 넘어갑니다. VRAM과 latency는 지식 문제가 아니므로 serving
            설정과 update 범위를 따로 검토합니다.
          </p>
          <p>
            한 요청에 여러 문제가 겹칠 수도 있습니다. RAG로 현재 사실을 넣어도 출력
            행동이 계속 틀린다면 RAG와 SFT를 조합할 수 있습니다. 다만 두 방법이
            조합된다는 사실은 둘이 같은 책임을 가진다는 뜻이 아닙니다.
          </p>
        </div>
      </section>

      <section id="state-boundary" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. 학습 목표와 업데이트 범위를 같은 축으로 비교하지 않습니다
        </h2>

        <div className="not-prose overflow-hidden border-y border-border">
          <div className="hidden grid-cols-[9rem_1.2fr_1fr_1.2fr] gap-3 border-b border-border bg-muted/25 px-4 py-3 text-[10px] font-black text-muted-foreground sm:grid">
            <span>상태</span><span>담긴 내용</span><span>바꾸는 과정</span><span>확인할 결과</span>
          </div>
          {STATE_BOUNDARIES.map((row) => (
            <div key={row.state} className="grid gap-2 border-b border-border px-3 py-4 last:border-b-0 sm:grid-cols-[9rem_1.2fr_1fr_1.2fr] sm:gap-3 sm:px-4">
              <strong className="text-sm">{row.state}</strong>
              <span className="break-keep text-xs leading-5">{row.contains}</span>
              <span className="break-keep text-xs font-semibold leading-5 text-primary">{row.changedBy}</span>
              <span className="break-keep text-xs leading-5 text-muted-foreground">{row.check}</span>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            RAG는 요청 시점의 context를 바꿉니다. Continued pretraining은 unlabeled
            corpus로 language-model objective를 이어 가며 weight를 바꿉니다. SFT는
            input과 원하는 response의 예시로 행동을 학습합니다. 세 이름은 서로 다른
            상태와 학습 신호를 가리킵니다.
          </p>
          <p>
            PEFT는 또 다른 축입니다. LoRA처럼 base weight 대부분을 고정하고 작은
            update만 학습하는 방법은 “무엇을 학습할지”가 아니라 “어느 parameter를
            바꿀지”를 정합니다. 그래서 SFT objective를 LoRA update로 학습할 수도
            있으며, SFT와 PEFT를 경쟁 방법처럼 한 줄에 놓으면 판단이 흐려집니다.
          </p>
        </div>
      </section>

      <section id="candidates" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. 후보를 모두 만든 뒤 hard requirement부터 적용합니다
        </h2>

        <InterventionFunnelViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 사례는 현재 문서 revision을 반환해야 합니다. 따라서 source를 연결하지
            못하는 후보는 target 점수가 높아도 먼저 탈락합니다. 남은 후보에는 설명용
            target gain 3 이상, general change -1 이상, cost 3 이하를 적용합니다.
          </p>
          <p>
            RAG와 RAG+SFT는 품질 조건을 통과하지만 조합의 cost는 4라서 예산 3을
            넘습니다. 그래서 모든 조건을 만족하는 가장 작은 후보인 RAG를 고릅니다.
            실제 환경에서는 gain·회귀·비용 단위와 임계값을 결과를 보기 전에 정해야
            하며, 지금 수치는 선택 순서만 보여 주는 가정 [A]입니다.
          </p>
        </div>

        <ExplainedFormula
          question="요구 조건과 품질 한도를 모두 만족하는 가장 작은 개입을 어떻게 고릅니까?"
          idea={(
            <p>
              현재 근거, target gain, general regression, 예산을 모두 통과한 집합을
              먼저 만듭니다. 그 집합 안에서 비용과 복잡도가 작은 후보를 고릅니다.
            </p>
          )}
          formula={String.raw`\mathcal E=\{a:H(a)=1,\Delta_t(a)\ge g_{\min},\Delta_g(a)\ge-\varepsilon,C(a)\le B\},\qquad a^*=\operatorname*{arg\,min}_{a\in\mathcal E}C(a)`}
          annotatedFormula={String.raw`\begin{aligned}\mathcal H&=\underbrace{\{a:H(a)=1\}}_{\text{현재 근거를 반환하는 후보}}\\\mathcal Q&=\underbrace{\{a\in\mathcal H:\Delta_t(a)\ge g_{\min},\Delta_g(a)\ge-\varepsilon\}}_{\text{target·회귀 조건 통과}}\\\mathcal E&=\underbrace{\{a\in\mathcal Q:C(a)\le B\}}_{\text{예산 안의 후보}}\\a^*&=\underbrace{\operatorname*{arg\,min}_{a\in\mathcal E}C(a)}_{\text{통과 후보 중 가장 작은 비용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`H(a)=1`,
              annotation: ["요청이 반드시 요구한 현재 근거를 확인해", "점수로 보상할 수 없는 후보를 먼저 제거합니다."],
            },
            {
              expression: String.raw`\Delta_t(a)\ge g_{\min},\Delta_g(a)\ge-\varepsilon`,
              annotation: ["목표 개선과 일반 능력 회귀를 각각 비교해", "한 점수가 다른 실패를 가리지 못하게 합니다."],
            },
            {
              expression: String.raw`C(a)\le B`,
              annotation: ["같은 단위로 정한 비용을 예산과 비교해", "실행할 수 없는 후보를 제거합니다."],
            },
            {
              expression: String.raw`\operatorname*{arg\,min}_{a\in\mathcal E}C(a)`,
              annotation: ["모든 조건을 통과한 후보 안에서만", "비용과 복잡도가 작은 개입을 고릅니다."],
            },
          ]}
          terms={[
            { symbol: "H(a)", name: "Hard requirement", description: "이 사례에서는 현재 source revision을 답과 연결하는 조건입니다." },
            { symbol: String.raw`\Delta_t`, name: "Target gain", description: "같은 validation에서 baseline보다 늘어난 목표 지표입니다." },
            { symbol: String.raw`\Delta_g`, name: "General change", description: "같은 general suite에서 baseline보다 변한 값입니다." },
            { symbol: "C(a), B", name: "Cost and budget", description: "학습·서빙·운영 비용과 허용 예산입니다." },
          ]}
          assumptions={[
            "후보는 같은 base·validation split·평가 revision에서 비교합니다.",
            "Hard requirement와 threshold는 결과를 보기 전에 고정합니다.",
            "설명용 cost 1–4는 실제 금액이나 GPU 시간을 뜻하지 않습니다.",
          ]}
          interpretation="설명용 후보에서 RAG만 현재 근거, target gain 3 이상, general change -1 이상, cost 3 이하를 모두 만족합니다. 따라서 RAG를 선택하지만 이 결과를 다른 서비스의 측정값으로 재사용할 수는 없습니다."
        />

        <CalculationWalkthrough
          title="다섯 후보가 하나로 줄어드는 계산"
          question="설명용 조건을 어떤 순서로 적용해 RAG를 남깁니까?"
          scope="모든 점수와 비용은 선택 절차를 설명하기 위한 가정 [A]입니다."
          steps={[
            {
              label: "후보 생성",
              expression: "Prompt, RAG, continued pretraining, SFT, RAG+SFT",
              result: "5개",
              reason: "실패를 바꿀 수 있는 상태 위치별 개입을 먼저 빠짐없이 적습니다.",
            },
            {
              label: "현재 근거 조건",
              expression: "H(a)=1",
              result: "RAG, RAG+SFT · 2개",
              reason: "현재 source revision을 답과 연결하지 못하는 세 후보를 뺍니다.",
            },
            {
              label: "품질 조건",
              expression: "target ≥ 3, general ≥ -1",
              result: "2개 유지",
              reason: "두 후보 모두 설명용 gain과 회귀 한도를 통과합니다.",
            },
            {
              label: "예산 조건",
              expression: "cost ≤ 3",
              result: "RAG · 1개",
              reason: "RAG+SFT의 cost 4를 빼면 RAG의 cost 2만 남습니다.",
            },
          ]}
          conclusion="높은 target 점수부터 고르는 대신, 보상할 수 없는 요구 조건과 회귀·예산을 먼저 통과시킨 뒤 가장 작은 개입을 선택합니다."
          caveats={[
            "실제 hard requirement와 임계값은 서비스 위험·SLO·데이터 권리에 따라 달라집니다.",
            "한 후보가 탈락해도 그 메커니즘 자체가 나쁘다는 뜻은 아닙니다. 이 요청의 상태 위치와 맞지 않는다는 뜻입니다.",
          ]}
        />
      </section>

      <section id="failure" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          5. 현재 근거가 없으면 성공한 답처럼 보이지 않게 끝냅니다
        </h2>

        <EvidenceMissingViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            RAG를 선택해도 검색 결과가 항상 있는 것은 아닙니다. 현재 문서가 없거나
            revision이 맞지 않으면 생성기가 base weight의 기억으로 답을 채울 수
            있지만, 그 답은 최신성 요구를 증명하지 못합니다.
          </p>
          <p>
            그래서 이 개념 경계에서의 실패 동작은 답을 만드는 것이 아니라
            <code>evidence_status=missing</code>으로 끝내는 것입니다. 실제 서비스에서
            재시도, human review, 사용자 문구를 어떻게 운영할지는 별도 실무 글과
            runbook에서 정합니다.
          </p>
        </div>
      </section>

      <section id="branches" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          6. 세부 글은 지도에서 남은 질문을 하나씩 엽니다
        </h2>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          <Link to="/cs/ai/continued-pretraining#overview" className="min-w-0 bg-background px-4 py-5 hover:bg-muted/25">
            <span className="text-[10px] font-black text-primary">언어 패턴</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Continued pretraining</strong>
            <span className="mt-2 block break-keep text-xs leading-5 text-muted-foreground">Corpus mixture가 weight와 forgetting을 어떻게 바꾸는지 엽니다.</span>
          </Link>
          <Link to="/cs/ai/domain-task-finetuning#overview" className="min-w-0 bg-background px-4 py-5 hover:bg-muted/25">
            <span className="text-[10px] font-black text-primary">출력 행동</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Task fine-tuning</strong>
            <span className="mt-2 block break-keep text-xs leading-5 text-muted-foreground">Demonstration과 loss mask가 행동을 어떻게 학습하는지 엽니다.</span>
          </Link>
          <Link to="/cs/ai/domain-data-governance#overview" className="min-w-0 bg-background px-4 py-5 hover:bg-muted/25">
            <span className="text-[10px] font-black text-primary">근거 경계</span>
            <strong className="mt-2 block break-keep text-sm leading-6">데이터 경계</strong>
            <span className="mt-2 block break-keep text-xs leading-5 text-muted-foreground">Group·time·rights가 주장 가능한 범위를 어떻게 제한하는지 엽니다.</span>
          </Link>
        </div>

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            이 글에서 RAG는 현재 사실을 외부 context에 두는 경계까지만 닫았습니다.
            Chunking·embedding·retrieval·generation의 내부 과정은
            <Link to="/cs/ai/rag-pipeline#overview"> RAG pipeline 글</Link>에서 더
            깊이 들어갑니다. LoRA의 저랭크 update는
            <Link to="/cs/ai/lora-finetuning#lora"> LoRA 글</Link>에서 다룹니다.
          </p>
        </div>
      </section>

      <section id="evidence" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          7. 논문은 각 메커니즘을 증명하지만 이 선택표를 대신하지 않습니다
        </h2>

        <div className="not-prose space-y-5">
          <CitationBlock type="paper" citeKey={1} source="Lewis et al. — Retrieval-Augmented Generation" href="https://arxiv.org/abs/2005.11401">
            Parametric memory와 검색한 non-parametric memory를 결합한 원 연구 [O]입니다. 논문의 Wikipedia index와 task 결과가 모든 최신성·citation 요구를 자동으로 보장한다는 뜻은 아닙니다.
          </CitationBlock>
          <CitationBlock type="paper" citeKey={2} source="Gururangan et al. — Don’t Stop Pretraining" href="https://aclanthology.org/2020.acl-main.740/">
            RoBERTa를 네 domain과 여덟 classification task에서 DAPT·TAPT로 적응한 연구 [O]입니다. 이 결과를 모든 decoder LLM과 도메인에 그대로 일반화하지 않습니다.
          </CitationBlock>
          <CitationBlock type="paper" citeKey={3} source="Ouyang et al. — InstructGPT" href="https://arxiv.org/abs/2203.02155">
            Human-written demonstration으로 supervised baseline을 학습한 pipeline [O]입니다. 논문의 prompt·annotator·model 범위가 모든 업무 행동을 대표하지는 않습니다.
          </CitationBlock>
          <CitationBlock type="paper" citeKey={4} source="Hu et al. — LoRA" href="https://arxiv.org/abs/2106.09685">
            Frozen base weight에 저랭크 trainable update를 붙이는 방법 [O]입니다. Trainable parameter 감소만으로 실제 latency·memory·품질 우위를 확정할 수는 없습니다.
          </CitationBlock>
        </div>
      </section>

      <DomainAdaptationMapReturn current="decision-map" />

      <section id="review" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">8. 다음 실패에서 바꿀 상태를 고릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>오늘 바뀐 규정과 문서 revision이 필요할 때 model weight부터 바꾸지 않는 이유는 무엇입니까? (답: 1·3절)</li>
            <li>SFT objective를 LoRA로 학습할 수 있는 이유는 두 이름이 어떤 다른 질문에 답하기 때문입니까? (답: 3절)</li>
            <li>Target gain이 가장 큰 continued pretraining 후보가 설명용 사례에서 선택되지 않는 이유는 무엇입니까? (답: 4절)</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
