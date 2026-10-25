import { Link } from "react-router-dom";

const STEPS = [
  { label: "원문", href: "#problem" },
  { label: "구조", href: "#parsing" },
  { label: "고정 경계", href: "#chunking" },
  { label: "의미 경계", href: "#semantic-chunking" },
  { label: "문맥", href: "#contextual-retrieval" },
  { label: "반영", href: "#pipeline" },
] as const;

export function RagIngestionLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 문서 수집과 청킹의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/rag-pipeline#chunking" className="hover:text-primary">
          RAG 전체 지도
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          문서 수집과 청킹
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 검색 단위
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            환불 규정 v17 한 건이 들어왔을 때, 어떤 기록을 남겨야 답변의
            chunk를 원문까지 다시 찾을 수 있을까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 넘기는 경계
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            완성된 chunk payload를 넘긴 뒤의 embedding·후보 검색·답변 조립은
            다음 글들이 맡습니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="문서 수집과 청킹의 여섯 단계"
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

export function RagIngestionReturn() {
  return (
    <aside
      id="rag-ingestion-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="RAG 전체 지도에 문서 수집 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        검색 단위는 글자 묶음만으로 끝나지 않습니다. 원문 revision·위치·권한,
        분할 설정, 선택적 문맥 prefix가 함께 기록된 chunk manifest여야 갱신과
        삭제, 답변 인용을 같은 원문까지 추적할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/rag-pipeline#chunking"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/document-parsing-and-table-extraction"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · 문서 구조 파싱 ↗
        </Link>
      </div>
    </aside>
  );
}
