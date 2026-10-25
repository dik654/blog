import { Link } from "react-router-dom";

const STEPS = [
  { label: "인계", href: "#overview" },
  { label: "선택", href: "#context-assembly" },
  { label: "조립", href: "#context-assembly" },
  { label: "측정", href: "#metrics" },
  { label: "귀속", href: "#failure-attribution" },
  { label: "검증", href: "#ablation-oracle" },
] as const;

export function RagContextAssemblyLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAG 전체 지도에서 문맥 조립과 평가의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/rag-pipeline#generate" className="hover:text-primary">
          RAG 전체 지도
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai/query-transformation-and-adaptive-retrieval#query-transformation-return"
          className="hover:text-primary"
        >
          질의 변환과 재검색
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          문맥 조립과 평가
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념 · 근거에서 답까지
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            검색이 찾은 근거를 제한된 문맥에 어떻게 넣고, 답이 실제로 그 근거를
            사용했는지 어느 단계에서 확인할까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 받는 입력
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            앞 글이 남긴 q-732의 질문 경로, 후보 ID, 충분성 판정과 d-17·d-04를
            그대로 이어서 사용합니다.
          </p>
        </div>
      </div>

      <nav
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="문맥 조립과 평가의 여섯 단계"
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

export function RagContextAssemblyReturn() {
  return (
    <aside
      id="context-assembly-return"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="RAG 전체 지도에 문맥 조립과 평가 결과를 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        전체 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        q-732는 d-17·d-04를 출처 표시와 함께 문맥에 넣었지만, 답변의 세 번째
        주장은 어느 근거도 지지하지 않았습니다. 후보·문맥·주장 지지 기록을 함께
        보면 검색이 아니라 생성 단계에서 처음 실패했다는 사실을 설명할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai/query-transformation-and-adaptive-retrieval#query-transformation-return"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          이전 · 질의 변환과 재검색 ↗
        </Link>
        <Link
          to="/cs/ai/rag-pipeline#generate"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          위 · RAG 전체 지도 ↗
        </Link>
        <Link
          to="/cs/ai/knowledge-graph-construction"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 · Knowledge Graph 구축 ↗
        </Link>
      </div>
    </aside>
  );
}
