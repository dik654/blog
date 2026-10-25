import { Link } from "react-router-dom";

const STEPS = [
  { label: "원문", href: "#problem" },
  { label: "추출", href: "#extraction" },
  { label: "정규화", href: "#schema-guided-extraction" },
  { label: "식별", href: "#dedup" },
  { label: "검증", href: "#validation" },
  { label: "기록", href: "#pipeline" },
] as const;

export function KnowledgeGraphConstructionLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 Knowledge Graph 구축의 위치"
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
        <strong className="text-foreground" aria-current="page">
          Knowledge Graph 구축
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 원문에서 그래프까지
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            서로 다른 문서에 나온 이름·대명사·약칭을 어떻게 같은 대상으로 묶고,
            원문까지 되짚을 수 있는 관계로 기록할까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 정하지 않는 것
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            Graph DB 제품, 실제 matcher와 임계값은 데이터·오류 비용을 측정한 뒤
            실무 글에서 선택합니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="Knowledge Graph 구축의 여섯 단계"
      >
        {STEPS.map((step, index) => (
          <a
            key={`${step.label}-${index}`}
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

export function KnowledgeGraphConstructionReturn() {
  return (
    <aside
      id="knowledge-graph-construction-return"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="RAG 전체 지도에 Knowledge Graph 구축 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        문서 세 건의 mention 7개는 같은 사람을 가리키는 세 표기를 U-42로
        합친 뒤 node 5개·edge 4개가 됐습니다. 각 edge에 source_id와 추출 버전을
        남겼으므로 다음 검색 단계는 관계를 걸어가면서도 원문을 다시 확인할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/rag-context-assembly-and-evaluation#context-assembly-return"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          이전 · 문맥 조립과 평가 ↗
        </Link>
        <Link
          to="/cs/ai/rag-pipeline#retrieval"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/graphrag-community-and-multihop-search"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · GraphRAG 검색 ↗
        </Link>
      </div>
    </aside>
  );
}
