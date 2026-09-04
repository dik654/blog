import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ContextStateViz } from "./viz/ModernContextEngineeringViz";

export default function ContextEngineeringFoundationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Context는 저장된 정보 전체가 아니라 이번 generation이 실제로 읽는 token state입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">Model weight에는 학습된 일반 패턴이 들어 있고, document store에는 필요할지 모르는 자료가 있습니다. 그러나 현재 답을 만들 때 model이 직접 읽는 것은 request에 직렬화된 system instruction·user task·retrieved fragment·message history·tool result뿐입니다. 이 유한한 token 집합을 <strong>inference context state</strong>라고 부릅니다.</p>
          <p>외부 저장소에 문서가 있다는 것과 그 문서가 context에 들어왔다는 것은 다릅니다. 검색이 실패하거나 selector가 제외했거나 serialization 전에 권한 검사를 통과하지 못했다면 model은 그 정보를 현재 답에 사용할 수 없습니다.</p>
        </div>
        <TermBreakdown
          title="Context와 혼동하기 쉬운 네 저장 위치"
          description="한 용어를 한 줄씩 읽고, 이번 inference에서 model이 직접 읽는지 확인합니다."
          items={[
            { term: "Model weights", description: "Training으로 고정된 parameter입니다. 현재 ticket·최신 policy 원문을 자동으로 담는 request memory가 아닙니다.", boundary: "Weight에 일반 지식이 있을 수 있어도 현재 source revision이나 user consent를 증명하지 않습니다." },
            { term: "External store", description: "Vector DB·file·database·artifact storage처럼 후보 정보를 보관하는 장소입니다.", example: "policy-v7.pdf가 저장돼 있지만 검색되지 않았다면 이번 답의 context가 아닙니다." },
            { term: "Context candidate", description: "현재 task와 관련 있을 가능성이 있어 selector가 평가하는 fragment입니다.", boundary: "후보라는 이유만으로 ACL·freshness·trust를 통과한 것은 아닙니다." },
            { term: "Inference context state", description: "Provider message와 tool schema 형태로 직렬화되어 이번 generation이 실제로 읽는 token sequence입니다.", example: "system 규칙 2k + user task 1k + policy fragment 4k + 최근 tool result 3k" },
          ]}
        />
        <ContextStateViz />
        <ContentBoundary article="context-engineering" />
      </section>

      <section id="context-state" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Context state는 source를 고른 뒤 순서를 가진 message로 직렬화합니다</h2>
        <ExplainedFormula
          question="여러 저장소의 정보가 어떻게 이번 generation의 context가 되나요?"
          idea={<p>
            먼저 task·권한·freshness 조건으로 후보를 선택하고 그 결과를 instruction과 data의 역할이 보존되는 순서로 직렬화합니다. 단순 합집합이 아니라 두 단계의
            변환입니다.
          </p>}
          formula={String.raw`C_t=\operatorname{serialize}(\operatorname{select}(S_t;q_t,A_t,F_t))`}
          annotatedFormula={String.raw`\begin{aligned}E_t&=\underbrace{\operatorname{select}(S_t;q_t,A_t,F_t)}_{\substack{\text{task 관련성·권한·freshness로}\\\text{이번에 읽을 fragment만 선택}}}\\C_t&=\underbrace{\operatorname{serialize}(I_t,U_t,E_t,H_t,O_t)}_{\substack{\text{instruction·user·evidence·history·tool 결과를}\\\text{역할과 순서를 보존한 token state로 변환}}}\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{select}(S_t;q_t,A_t,F_t)`, annotation: ["후보 저장소에서", "task·권한·freshness를 통과한 fragment만 선택"] },
            { expression: String.raw`\operatorname{serialize}(I_t,U_t,E_t,H_t,O_t)`, annotation: ["선택 결과를 역할별로 배열해", "model이 읽는 token sequence로 변환"] },
          ]}
          terms={[
            { symbol: String.raw`S_t`, name: "Candidate store", description: "시점 t에 읽을 수 있는 문서·memory·artifact 후보입니다." },
            { symbol: String.raw`q_t`, name: "Current task", description: "이번 generation이 해결해야 할 질문과 acceptance condition입니다." },
            { symbol: String.raw`A_t`, name: "Authorization state", description: "현재 caller가 읽을 수 있는 source scope입니다." },
            { symbol: String.raw`F_t`, name: "Freshness rule", description: "유효 version·시점·expiry를 판단하는 규칙입니다." },
            { symbol: String.raw`C_t`, name: "Inference context state", description: "이번 generation에 전달된 최종 token sequence입니다." },
          ]}
          assumptions={["Provider의 실제 chat·tool serialization과 tokenizer를 사용합니다.", "선택 단계는 source identity·ACL·freshness metadata를 잃지 않습니다.", "Context에 들어왔다는 사실은 해당 fragment가 참이라는 보장이 아닙니다."]}
          interpretation="Store에 100만 token이 있어도 selector가 policy-v7 4k와 최근 tool receipt 2k만 고르면 model이 직접 읽는 external evidence는 그 6k입니다."
        />
      </section>

      <section id="curation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Curation lifecycle은 select→inject→compact→isolate 순서로 반복됩니다</h2>
        <TermBreakdown
          title="Context curation의 네 동사"
          items={[
            { term: "Select", description: "현재 판단에 필요한 source만 relevance·authority·freshness 조건으로 고릅니다.", example: "모든 HR 문서 대신 현재 국가·고용형태에 맞는 policy section을 선택합니다." },
            { term: "Inject", description: "선택한 fragment를 instruction과 data가 섞이지 않게 label·source와 함께 message에 넣습니다." },
            { term: "Compact", description: "오래된 원문을 줄이되 objective·decision·unresolved issue·artifact identity·next action을 보존합니다.", boundary: "문장이 자연스럽게 짧아졌다는 것과 state가 충실하다는 것은 다릅니다." },
            { term: "Isolate", description: "Tenant·task·sub-agent 사이에서 섞이면 안 되는 history와 memory를 별도 scope에 둡니다.", boundary: "긴 window 하나에 모든 기록을 넣는 것은 isolation이 아닙니다." },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">다음 네 글은 context 후보가 실제 판단 근거가 되는 각 경계를 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Instruction과 data의 권한 분리, retrieval fragment의 provenance, memory의 수명과 compaction, token budget·position·cache는 서로 다른 실패 owner입니다. 이 기초 글은 네 문제를 한꺼번에 최적화하지 않고 context state와 lifecycle까지만 소유합니다.</p></div>
        <div id="paper-anthropic-context-engineering" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock type="paper" citeKey={1} source="Anthropic — Effective context engineering for AI agents" href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">
            Context를 sampling 시점의 유한 token state로 보고 just-in-time retrieval·compaction·structured note를 선택하는 engineering 관점을 설명합니다. 공개된 Anthropic 제품 경험을 모든 model·task의 정량 법칙으로 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
