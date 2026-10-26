import { Link } from "react-router-dom";

const STEPS = [
  { label: "검색 인덱스", href: "#index" },
  { label: "Community", href: "#community" },
  { label: "세 검색 방식", href: "#search-modes" },
  { label: "Local", href: "#local-search" },
  { label: "Global·DRIFT", href: "#global-and-drift" },
  { label: "Multi-hop 경계", href: "#multihop" },
] as const;

export function GraphRagSearchLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 GraphRAG 검색의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/rag-pipeline#retrieval" className="hover:text-primary">
          RAG 전체 지도
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai/knowledge-graph-construction#knowledge-graph-construction-return"
          className="hover:text-primary"
        >
          Knowledge Graph 구축
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          GraphRAG 검색
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 그래프에서 답변 문맥까지
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            kg-v43을 받은 뒤, 질문에 맞는 entity·관계·원문·community report를
            어떤 순서로 골라 답변 문맥으로 만들까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 정하지 않는 것
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            실제 제품 채택, 검색 품질 목표, token 예산과 갱신 주기는 대상 데이터로
            측정한 뒤 실무 글에서 확정합니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="GraphRAG 검색의 여섯 단계"
      >
        {STEPS.map((step, index) => (
          <a
            key={step.label}
            href={step.href}
            className="min-h-11 bg-background px-3 py-3 text-xs font-semibold hover:text-primary"
          >
            <span className="mr-2 font-mono text-[9px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export function GraphRagSearchReturn() {
  return (
    <aside
      id="graphrag-search-return"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="RAG 전체 지도에 GraphRAG 검색 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        kg-v43은 질문 전에 community report와 entity embedding을 더한 검색 인덱스가
        됩니다. 질문 시점에는 호출자가 local·global·DRIFT 중 하나를 고르고, 각 방식이
        서로 다른 자료를 token 예산 안에 넣어 LLM의 답변 문맥을 만듭니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/knowledge-graph-construction#knowledge-graph-construction-return"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          이전 · Knowledge Graph 구축 ↗
        </Link>
        <Link
          to="/cs/ai/rag-pipeline#retrieval"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/lora-finetuning"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · LoRA 미세조정 ↗
        </Link>
      </div>
    </aside>
  );
}
