import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RagPipelineLocator } from "./RagPipelineLocator";
import OverviewViz from "./viz/OverviewViz";
import RagOwnershipViz from "./viz/RagOwnershipViz";
import RagPipelineFlowViz from "./viz/RagPipelineFlowViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <RagPipelineLocator />
      <RagPipelineFlowViz />
      <h2 className="mb-6 text-2xl font-bold">답에서 원문까지</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
            사용자가 “지난달에 바뀐 환불 규정은 무엇인가?”라고 물었을 때 모델 파라미터만으로 답하면 최신성·출처·접근 권한을 확인하기 어렵습니다. Retrieval-Augmented
            Generation(RAG)은 질문에 필요한 외부 문서를 먼저 찾습니다. 선택한 근거를 모델 입력에 넣은 뒤 답변의 각 주장과 원문 위치를 다시 연결합니다.
          </p>
        <p>
          RAG라고 해서 원문을 자동으로 올바르게 찾는 것은 아닙니다. 원문을
          가져오지 못하거나, 가져온 문맥에서 정답 부분을 잘라내거나, 모델이
          근거와 다른 말을 하면 여전히 실패합니다.
        </p>
        <p>
          그래서 문서 수집, 분할, 색인, 검색을 한 요청의 기록으로
          연결해야 합니다. 모델에 넘긴 문맥과 생성한 답, 인용한 원문도
          같은 기록에서 이어져야 합니다.
        </p>
        <p>문서가 적고 안정적이며 한 번에 읽을 수 있다면 long-context prompting이 더 단순할 수 있습니다. 반대로 사실을 바꾸는 것이 아니라 출력 형식이나 말투를 익히게 하려면 <a href="/cs/ai/domain-finetuning">fine-tuning</a>이 맞습니다. RAG는 자주 갱신되는 문서, source-level ACL, citation과 삭제 반영이 중요한 경우에 특히 유용합니다.</p>
      </div>
      <ContentBoundary article="rag-pipeline" />
      <ExplainedFormula
        question="최종 답이 틀렸을 때 어느 단계부터 조사해야 할까요?"
        idea={<>성공에 필요한 네 조건을 indicator로 둡니다. 곱이 0이면 앞 단계부터 확인해 첫 실패 지점을 찾습니다. 이 식은 독립 확률을 곱하는 식이 아니라, 필수 조건이 모두 참인지 표현한 진단 계약입니다.</>}
        formula={String.raw`\begin{aligned}
S(q)&=I_{\mathrm{source}}(q)I_{\mathrm{retrieve}}(q)\\
&\quad I_{\mathrm{context}}(q)I_{\mathrm{support}}(q)
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
S(q)&=\underbrace{I_{\mathrm{source}}(q)}_{\text{corpus에 근거 있음}}\underbrace{I_{\mathrm{retrieve}}(q)}_{\text{검색에 걸림}}\\
&\quad \underbrace{I_{\mathrm{context}}(q)}_{\text{prompt에 남음}}\underbrace{I_{\mathrm{support}}(q)}_{\text{답이 근거로 확인}}
\end{aligned}`}
        operations={[
          { expression: String.raw`I_{\mathrm{source}}(q)I_{\mathrm{retrieve}}(q)`, annotation: ["최신 허가 문서가 corpus에 있고", "candidate set에 들어와야 1·1", "규정이 없으면 첫 항부터 0"] },
          { expression: String.raw`I_{\mathrm{context}}(q)I_{\mathrm{support}}(q)`, annotation: ["검색됐어도 예산 때문에 빠지면 0", "→ generator 말고 context assembly 수정", "답이 근거·citation과 맞아야 마지막 1"] },
        ]}
        terms={[
          { symbol: "q", name: "query", description: "사용자의 질문과 요청 시점·권한을 포함한 평가 단위입니다." },
          { symbol: "I_source", name: "source available", description: "정답을 뒷받침하는 최신 허가 문서가 corpus에 있으면 1입니다." },
          { symbol: "I_retrieve", name: "retrieved", description: "그 문서가 candidate set 안에 들어오면 1입니다." },
          { symbol: "I_context", name: "context retained", description: "정답 span이 최종 prompt에 실제로 남으면 1입니다." },
          { symbol: "I_support", name: "answer supported", description: "최종 주장이 제공된 근거에서 확인되고 citation이 맞으면 1입니다." },
        ]}
        assumptions={["각 indicator의 판정 기준과 평가 label을 미리 고정합니다.", "ACL 위반 문서는 관련성이 높아도 source available로 세지 않습니다.", "S=1은 사실 근거의 최소 조건이며 문체·유용성·안전성 전체를 보장하지 않습니다."]}
        interpretation="최신 규정이 corpus에 없으면 첫 항부터 0이므로 generator를 교체할 이유가 없습니다. 문서는 검색됐지만 prompt 예산 때문에 빠졌다면 context assembly를 고쳐야 합니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <RagOwnershipViz />
      <AlgorithmBlock
        title="한 요청을 역추적하는 순서 — 설명용 의사코드"
        input={[
          "request=q-731, user=u-42, role=employee, requested_at=09:30",
          "answer claim c2와 citation chunk c-8f31",
        ]}
        steps={[
          {
            code: "claim c2 → citation c-8f31",
            note: "먼저 답변의 주장이 실제 citation ID와 연결됐는지 확인합니다.",
          },
          {
            code: "c-8f31 → policy-v17 §4.2 offset 1180:1540",
            note: "Chunk manifest에서 원문 revision과 위치를 복원합니다.",
          },
          {
            code: "authorize(u-42, employee, policy-v17, requested_at)",
            note: "검색 시점뿐 아니라 검증 시점에도 문서 권한과 유효 시점을 확인합니다.",
          },
          {
            code: "assert active_alias → index-v42 → corpus policy-v17",
            note: "Query encoder와 색인 manifest가 같은 좌표계와 corpus snapshot을 가리키는지 확인합니다.",
          },
          {
            code: "record first_failed_stage or support_receipt",
            note: "처음 깨진 단계의 소유자에게 수정 책임을 연결하고, 모두 통과하면 지원 근거를 남깁니다.",
          },
        ]}
        output="claim c2가 policy-v17의 허가된 원문으로 확인되거나, 처음 실패한 단계와 소유자가 기록됩니다."
      />
      <div id="reading-rag" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Retrieval-Augmented Generation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Lewis 등은 seq2seq parametric memory와 Wikipedia dense index라는
          non-parametric memory를 결합했습니다. 같은 passage를 sequence
          전체에 쓰는 방식과 token마다 passage를 달리하는 방식도
          비교했습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          생성 모델 밖의 명시적 memory를 검색해 provenance와 지식
          갱신 경로를 만든 것이 핵심입니다. 다만 논문의 결과가 모든
          사내 corpus와 최신 RAG 구현의 성능을 보장하지는 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2005.11401" target="_blank" rel="noreferrer">문제 정의와 두 RAG formulation 보기</a>
      </div>
    </section>
  );
}
