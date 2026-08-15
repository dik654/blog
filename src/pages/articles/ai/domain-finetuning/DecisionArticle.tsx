import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DomainDecisionViz } from "./viz/ModernDomainAdaptationViz";

export default function DomainAdaptationDecisionArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">도메인 적응은 학습 방법이 아니라 부족한 능력을 찾는 진단에서 시작합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">“우리 문서에서 성능이 낮다”는 말만으로는 원인을 알 수 없습니다. 전문 문체를 읽지 못하는지, 최신 사실을 갖고 있지 않은지, 이미 아는 내용을 원하는 JSON으로 내지 못하는지, 아니면 GPU memory가 부족한지부터 나눠야 합니다.</p><p>원인이 다르면 해결책도 달라집니다. 그래서 이 글은 방법 이름을 외우기보다 실패 sample에서 <strong>무엇이 부족한지</strong>를 증거로 분리하고 가장 작은 개입을 고르는 순서를 설명합니다.</p></div>
      <TermBreakdown title="먼저 하나씩 구분할 네 종류의 gap" items={[
        { term: "Language·style gap", description: "전문 용어·문장 구조·문서 형식의 token pattern을 충분히 학습하지 못한 상태입니다.", example: "특허 claim 문장을 일반 문장처럼 잘못 끊습니다.", boundary: "최신 사실 하나를 모르는 문제와는 다릅니다." },
        { term: "Fact freshness gap", description: "질문에 필요한 사실이 학습 시점 이후 생겼거나 출처와 함께 갱신되어야 하는 상태입니다.", example: "오늘 바뀐 약가와 최신 사내 규정.", boundary: "Weight에 다시 넣기보다 retrieval이 자연스러운 경우가 많습니다." },
        { term: "Behavior gap", description: "내용은 알지만 schema·label·abstention·tool-call 규칙대로 출력하지 못하는 상태입니다.", example: "정답 문장은 맞지만 요구한 JSON key를 빠뜨립니다." },
        { term: "System gap", description: "품질보다 latency·VRAM·throughput·배포 환경이 실제 병목인 상태입니다.", example: "Full fine-tuning checkpoint는 좋지만 한 장의 GPU에 올라가지 않습니다.", boundary: "학습 데이터를 늘려 해결할 문제는 아닙니다." },
      ]} />
      <DomainDecisionViz />
      <ContentBoundary article="domain-finetuning" />
    </section>

    <section id="evidence" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">방법을 고르기 전에 같은 실패를 재현하는 작은 baseline을 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>먼저 base model, domain prompt, retrieval을 붙인 조건을 같은 sample에 실행합니다. Retrieval만으로 정답과 citation이 회복되면 freshness gap의 증거입니다. Retrieval 뒤에도 전문 문장을 잘못 읽으면 language gap 가설이 남습니다. 정답 내용은 맞지만 serialization만 틀리면 behavior gap으로 좁힙니다.</p><p>이때 test는 열지 않습니다. 진단과 방법 선택은 validation slice에서 끝내고 마지막 일반화 보고만 untouched test에서 수행합니다.</p></div>
    </section>

    <section id="candidates" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">RAG와 weight adaptation은 저장 위치부터 다릅니다</h2>
      <TermBreakdown title="후보는 작은 개입부터 한 줄씩 올립니다" items={[
        { term: "Prompt", description: "Model weight와 외부 index를 바꾸지 않고 instruction·few-shot example로 행동을 유도합니다." },
        { term: "RAG", description: "질문 시점에 외부 문서를 검색해 context와 source를 model에 제공합니다.", example: "오늘 약가 문서를 조회하고 답 옆에 문서 revision을 남깁니다." },
        { term: "Continued pretraining", description: "Unlabeled domain corpus의 token distribution을 weight에 다시 학습합니다.", boundary: "특정 최신 사실의 출처·삭제·즉시 갱신에는 불리합니다." },
        { term: "SFT", description: "Input과 원하는 response example로 schema·label·abstention 같은 행동을 학습합니다." },
        { term: "PEFT", description: "Base weight 대부분을 고정하고 LoRA 등 작은 trainable parameter만 업데이트합니다.", boundary: "PEFT는 목적이 아니라 업데이트 범위이며 RAG·SFT와 같은 축의 이름이 아닙니다." },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>RAG는 지식을 외부 artifact에 두므로 출처를 보이고 즉시 교체할 수 있습니다. Weight adaptation은 반복되는 언어·행동 pattern을 model 내부에 넣지만 어느 training row가 특정 답을 만들었는지 바로 추적하기 어렵습니다. 이 차이를 먼저 이해해야 최신성 문제에 무조건 fine-tuning하는 일을 피할 수 있습니다.</p></div>
    </section>

    <section id="release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">가장 높은 점수가 아니라 제약 안의 가장 작은 개입을 고릅니다</h2>
      <ExplainedFormula question="Target gain을 얻으면서 일반 능력 회귀와 운영 비용을 제한하려면 무엇을 선택하나요?" idea={<p>같은 validation에서 후보마다 target gain·general change·cost를 측정합니다. 먼저 회귀와 예산 제약을 통과한 후보만 남기고, 그 안에서 target gain이 큰 가장 단순한 개입을 선택합니다.</p>} formula={String.raw`a^*=\operatorname*{arg\,max}_{a\in\mathcal A}\Delta_{\rm target}(a)\quad\text{s.t.}\quad\Delta_{\rm general}(a)\ge-\varepsilon,\;C(a)\le B`} annotatedFormula={String.raw`\begin{aligned}\mathcal E&=\underbrace{\{a\in\mathcal A:\Delta_{\rm general}(a)\ge-\varepsilon\}}_{\text{일반 능력 회귀 한도 통과}}\\\mathcal F&=\underbrace{\{a\in\mathcal E:C(a)\le B\}}_{\text{학습·서빙 예산 통과}}\\a^*&=\underbrace{\operatorname*{arg\,max}_{a\in\mathcal F}\Delta_{\rm target}(a)}_{\text{통과 후보 중 target gain 선택}}\end{aligned}`} operations={[
        { expression: String.raw`\Delta_{\rm general}(a)\ge-\varepsilon`, annotation: ["일반 능력 변화와 허용 하락을 비교해", "회귀가 큰 후보를 먼저 제거"] },
        { expression: String.raw`C(a)\le B`, annotation: ["학습·latency·memory 비용을 합의한 단위로 재고", "운영 불가능한 후보를 제거"] },
        { expression: String.raw`\operatorname*{arg\,max}_{a\in\mathcal F}\Delta_{\rm target}(a)`, annotation: ["두 gate를 통과한 후보 안에서만", "target 개선이 가장 큰 개입을 선택"] },
      ]} terms={[
        { symbol: String.raw`\mathcal A`, name: "Intervention candidates", description: "No-op·prompt·RAG·continued pretraining·SFT·PEFT 후보 집합입니다." },
        { symbol: String.raw`\Delta_{\rm target}`, name: "Target gain", description: "같은 target validation에서 base 대비 증가한 주지표입니다." },
        { symbol: String.raw`\Delta_{\rm general}`, name: "General change", description: "일반 회귀 suite의 base 대비 변화이며 음수는 하락입니다." },
        { symbol: String.raw`\varepsilon`, name: "Regression budget", description: "결과를 보기 전에 합의한 일반 능력 하락 한도입니다." },
        { symbol: "C(a), B", name: "Cost and budget", description: "학습비·latency·VRAM·운영 복잡도와 허용 예산입니다." },
      ]} assumptions={["모든 후보는 같은 base·split·seed·evaluation revision에서 비교합니다.", "회귀 한도와 비용 단위는 test를 보기 전에 고정합니다.", "Safety·privacy 같은 비보상 조건은 별도 hard gate로 둡니다."]} interpretation="RAG와 DAPT가 같은 gain이라면 freshness·citation·rollback 요구를 더 싸게 만족하는 RAG가 먼저일 수 있습니다. 복잡한 학습이 기술적으로 가능하다는 사실은 선택 근거가 아닙니다." />
      <div id="paper-rag" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Lewis et al. — Retrieval-Augmented Generation" href="https://arxiv.org/abs/2005.11401">Parametric memory와 검색한 non-parametric memory를 결합한 RAG의 원 연구입니다. 논문의 Wikipedia index·tasks 결과가 모든 최신성·citation 요구를 자동으로 해결한다는 뜻은 아닙니다.</CitationBlock></div>
      <div id="paper-lora" className="not-prose mt-6 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Hu et al. — LoRA" href="https://arxiv.org/abs/2106.09685">Base weight를 고정하고 저랭크 update를 학습하는 parameter-efficient adaptation입니다. Trainable parameter가 적다는 사실만으로 end-to-end latency·memory·품질이 항상 우월하다는 뜻은 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}
