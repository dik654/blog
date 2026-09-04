import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RAG의 목적은 모델에게 문서를 많이 보여주는 것이 아니라, 답변에서 허가된 원문까지 검증 가능한 경로를 만드는 것입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
            사용자가 “지난달에 바뀐 환불 규정은 무엇인가?”라고 물었을 때 모델 파라미터만으로 답하면 최신성·출처·접근 권한을 확인하기 어렵습니다. Retrieval-Augmented
            Generation(RAG)은 질문에 필요한 외부 문서를 먼저 찾습니다. 선택한 근거를 모델 입력에 넣은 뒤 답변의 각 주장과 원문 위치를 다시 연결합니다.
          </p>
        <p>이 구조는 지식 저장소 자체가 아닙니다. 원문을 가져오지 못하거나, 가져온 문맥에서 정답 부분을 잘라냈거나, 모델이 근거와 다른 말을 하면 여전히 실패합니다. 그래서 ingestion·chunking·index·retrieval·context assembly·generation·citation을 하나의 trace로 관리해야 합니다.</p>
        <p>문서가 적고 안정적이며 한 번에 읽을 수 있다면 long-context prompting이 더 단순할 수 있습니다. 반대로 사실을 바꾸는 것이 아니라 출력 형식이나 말투를 익히게 하려면 <a href="/ai/domain-finetuning">fine-tuning</a>이 맞습니다. RAG는 자주 갱신되는 문서, source-level ACL, citation과 삭제 반영이 중요한 경우에 특히 유용합니다.</p>
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
S(q)&=\underbrace{I_{\mathrm{source}}(q)I_{\mathrm{retrieve}}(q)}_{\text{query 계산}}\\
&\quad I_{\mathrm{context}}(q)I_{\mathrm{support}}(q)
\end{aligned}`}
        operations={[
          { expression: String.raw`I_{\mathrm{source}}(q)I_{\mathrm{retrieve}}(q)`, annotation: ["query이(가) 식의 결과에 기여하는 방식을 계산합니다.","성공에 필요한 네 조건을 indicator로 둡니다."] },
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
      <div id="reading-rag" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Retrieval-Augmented Generation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Lewis 등은 seq2seq parametric memory와 Wikipedia dense index라는 non-parametric memory를 결합했습니다. 그리고 같은
            passage를 sequence 전체에 쓰는 방식과 token마다 passage를 달리할 수 있는 방식을 비교했습니다. 핵심 아이디어는 생성 모델 바깥의 명시적 memory를
            검색해 provenance와 지식 갱신 경로를 마련한 것입니다. 논문의 Wikipedia·knowledge-intensive task 결과가 모든 사내 corpus와 최신
            RAG 구현의 성능을 보장하는 것은 아닙니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2005.11401" target="_blank" rel="noreferrer">문제 정의와 두 RAG formulation 보기</a>
      </div>
    </section>
  );
}
