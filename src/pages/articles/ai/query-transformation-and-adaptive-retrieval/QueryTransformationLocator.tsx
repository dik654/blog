import { Link } from "react-router-dom";

const STEPS = [
  { label: "질문 복원", href: "#problem" },
  { label: "변환 선택", href: "#multi-query" },
  { label: "가상 문서", href: "#hyde" },
  { label: "원리 검색", href: "#step-back" },
  { label: "재검색", href: "#adaptive-loop" },
  { label: "판정 주체", href: "#self-rag-crag" },
] as const;

export function QueryTransformationLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 질의 변환과 적응형 검색의 위치"
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
        <Link
          to="/cs/ai/retrieval-ranking-funnel#retrieval-ranking-return"
          className="hover:text-primary"
        >
          검색과 재정렬
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          질의 변환과 재검색
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 첫 검색 이후
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            첫 검색에서 답의 일부만 찾았다면 질문의 무엇을 바꾸고, 어떤 근거로
            다시 검색을 멈춰야 할까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 넘기는 경계
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            충분하다고 판정한 근거 ID와 반복 기록을 넘긴 뒤의 문맥 조립과 답변
            평가는 다음 글이 맡습니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="질의 변환과 재검색의 여섯 단계"
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

export function QueryTransformationReturn() {
  return (
    <aside
      id="query-transformation-return"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="RAG 전체 지도에 질의 변환 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        q-732는 원문 그대로 검색하지 않았습니다. 대화 맥락으로 대상을 복원하고,
        두 하위 질문으로 나눈 뒤 d-17·d-04를 찾아 반복을 끝냈습니다. 다음 단계는
        이 근거를 제한된 문맥 안에 조립하고 실제 답의 지지 여부를 평가합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/retrieval-ranking-funnel#retrieval-ranking-return"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          이전 · 검색과 재정렬 ↗
        </Link>
        <Link
          to="/cs/ai/rag-pipeline#retrieve"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/rag-context-assembly-and-evaluation"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · 문맥 조립과 평가 ↗
        </Link>
      </div>
    </aside>
  );
}
