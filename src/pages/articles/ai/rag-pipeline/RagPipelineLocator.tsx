import { Link } from "react-router-dom";

const MAP_STEPS = [
  { label: "전체 경로", href: "#overview" },
  { label: "근거 단위", href: "#chunking" },
  { label: "검색 공간", href: "#embedding" },
  { label: "후보 선택", href: "#retrieval" },
  { label: "답변 구성", href: "#generation" },
  { label: "단계별 평가", href: "#evaluation" },
] as const;

const CHILD_MAPS = [
  {
    label: "문서 수집·청킹",
    detail: "원문을 어떤 구조와 위치 정보로 나눠 색인 입력을 만드는지 파고듭니다.",
    href: "/cs/ai/rag-ingestion-and-chunking#problem",
  },
  {
    label: "검색·재순위",
    detail: "BM25·HNSW·RRF·cross-encoder가 후보를 어떻게 줄이는지 파고듭니다.",
    href: "/cs/ai/retrieval-ranking-funnel#retrieval",
  },
  {
    label: "문장 임베딩",
    detail: "질문과 문서가 같은 좌표계에 놓이기 위한 입력·pooling 계약을 확인합니다.",
    href: "/cs/ai/sentence-embeddings#overview",
  },
  {
    label: "Knowledge Graph 구축",
    detail: "여러 문서의 mention과 관계를 검증 가능한 node·edge로 바꾸는 과정을 추적합니다.",
    href: "/cs/ai/knowledge-graph-construction#problem",
  },
] as const;

export function RagPipelineLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="LLM 응용 지도에서 RAG 파이프라인의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai?sub=ai-practical-llm"
          className="hover:text-primary"
        >
          LLM 응용
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          RAG 전체 지도
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 지도
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            답변의 한 주장을 사용자가 읽을 수 있는 최신 원문까지 어떻게
            거슬러 올라가고, 틀렸다면 어느 단계부터 조사할까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 정하지 않는 것
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            Vector DB 제품·생성 모델·실제 SLO는 운영 환경과 측정 결과로
            선택합니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="RAG 파이프라인의 여섯 영역"
      >
        {MAP_STEPS.map((step, index) => (
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

      <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {CHILD_MAPS.map((child) => (
          <Link
            key={child.label}
            to={child.href}
            className="min-w-0 bg-background px-4 py-3 hover:text-primary"
          >
            <span className="text-[10px] font-bold text-primary">
              이 지도에서 더 깊이
            </span>
            <strong className="mt-1 block break-keep text-sm leading-5">
              {child.label}
            </strong>
            <span className="mt-1 block break-keep text-[11px] leading-5 text-muted-foreground">
              {child.detail}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function RagPipelineReturn() {
  return (
    <aside
      id="rag-pipeline-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="RAG 전체 지도에 결론을 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        RAG의 결과는 원문에서 파생 chunk와 색인 manifest를 거쳐
        검색 후보로 이어집니다. 최종 context와 claim, citation도 같은
        추적 기록에 남습니다. 답이 틀리면 이 순서를 거슬러 올라가
        처음 깨진 상태와 그 상태의 소유자를 찾습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai?sub=ai-practical-llm"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          LLM 응용 지도 ↗
        </Link>
        <Link
          to="/cs/ai/rag-ingestion-and-chunking#problem"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · 문서 수집과 청킹 ↗
        </Link>
      </div>
    </aside>
  );
}
