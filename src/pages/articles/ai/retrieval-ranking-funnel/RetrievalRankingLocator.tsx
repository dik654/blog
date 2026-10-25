import { Link } from "react-router-dom";

const STEPS = [
  { label: "검색 범위", href: "#overview" },
  { label: "후보", href: "#retrieval" },
  { label: "깊이", href: "#hybrid-depth" },
  { label: "정교화", href: "#late-interaction" },
  { label: "평가", href: "#ranking-evaluation" },
  { label: "반환", href: "#retrieval-ranking-return" },
] as const;

export function RetrievalRankingLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 검색과 재정렬의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/rag-pipeline#retrieve" className="hover:text-primary">
          RAG 전체 지도
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          검색과 재정렬
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 후보 좁히기
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            한 질의가 들어왔을 때, 정답 후보는 어느 단계에서 사라질 수 있고
            뒤의 재정렬기는 왜 그 누락을 복구하지 못할까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 넘기는 경계
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            최종 순위와 근거 ID를 넘긴 뒤의 문맥 조립과 답변 생성은 다음
            글들이 맡습니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="검색과 재정렬의 여섯 단계"
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

export function RetrievalRankingReturn() {
  return (
    <aside
      id="retrieval-ranking-return"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="RAG 전체 지도에 검색과 재정렬 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        검색 결과는 단순한 문서 목록이 아닙니다. 요청자에게 허용된 검색 범위,
        검색기별 후보와 순위, 융합 설정, 재정렬 범위, 최종 근거 ID를 함께 남긴
        기록이어야 누락과 오답의 첫 원인을 찾을 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/rag-pipeline#retrieve"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/query-transformation-and-adaptive-retrieval"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · 질의 변환과 적응형 검색 ↗
        </Link>
      </div>
    </aside>
  );
}
