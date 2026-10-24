import { Link } from "react-router-dom";

const STEPS = [
  { key: "state", label: "이번 입력", detail: "저장소 후보에서 이번 generation이 읽을 token state를 만듭니다.", href: "/cs/ai/context-engineering#overview" },
  { key: "authority", label: "권한 경계", detail: "외부 자료의 문장과 실제 실행 권한을 분리합니다.", href: "/cs/ai/context-instruction-boundaries#overview" },
  { key: "provenance", label: "출처·최신성", detail: "Source·revision·유효 시점·접근 범위를 함께 확인합니다.", href: "/cs/ai/context-provenance-freshness#overview" },
  { key: "memory", label: "기억 수명", detail: "현재 상태·장기 기억·원문 artifact를 수명별로 나눕니다.", href: "/cs/ai/agent-memory-lifecycle#overview" },
  { key: "window", label: "예산·활용", detail: "Token 예산·근거 위치·prefix 계산 재사용을 따로 측정합니다.", href: "/cs/ai/context-window-optimization#overview" },
] as const;

export type ContextStatePathArticle = (typeof STEPS)[number]["key"];
const INDEX: Record<ContextStatePathArticle, number> = { state: 0, authority: 1, provenance: 2, memory: 3, window: 4 };
const QUESTIONS: Record<ContextStatePathArticle, string> = {
  state: "저장된 정보 가운데 무엇이 이번 답을 만드는 실제 context가 됩니까?",
  authority: "읽은 문장이 왜 곧바로 실행 권한이 되어서는 안 됩니까?",
  provenance: "더 비슷하지만 오래된 문서와 현재 정본 중 무엇을 선택해야 합니까?",
  memory: "현재 작업 상태와 여러 session에 남길 기억은 어떻게 구분합니까?",
  window: "128k 안에 들어간 정보가 실제로 쓰이고 최신이라는 사실까지 보장합니까?",
};
const FINDINGS: Record<ContextStatePathArticle, string> = {
  state: "Context는 저장소 전체가 아니라 selector를 통과해 역할과 순서가 있는 message로 직렬화된 이번 generation의 token state입니다.",
  authority: "Instruction은 행동을 설명하고 외부 문서는 자료를 제공합니다. 실제 효과는 schema·권한·정책을 검사하는 runtime만 허용합니다.",
  provenance: "검색 유사도보다 접근 범위와 유효 시점이 먼저입니다. Text와 source·revision·digest를 같은 fragment record로 유지해야 선택을 재현할 수 있습니다.",
  memory: "현재 run의 작업 상태, 장기 기억, 긴 원문 artifact, 반복 절차는 수명과 삭제 책임이 다릅니다. Resume test는 다음 행동까지 복원되는지 확인합니다.",
  window: "Capacity 통과, evidence 활용, freshness, prefix 계산 재사용은 서로 다른 검사입니다. Token 장부가 맞아도 답의 정확성은 별도로 측정해야 합니다.",
};

export function ContextStatePathLocator({ current }: { current: ContextStatePathArticle }) {
  const index = INDEX[current];
  const step = STEPS[index];
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="Context state 경로에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link><span aria-hidden>›</span>
        <Link to="/cs/ai/context-engineering#overview" className="hover:text-primary">Context state</Link><span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{step.label}</strong>
      </nav>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div><span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span><p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p></div>
        <div className="border-l-2 border-primary/45 pl-3"><p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p><Link to={current === "state" ? "/cs/ai" : "/cs/ai/context-engineering#overview"} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">{current === "state" ? "Agent & Tools 전체 학습 지도 ↗" : "저장소에서 이번 generation까지의 Context state ↗"}</Link></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="Context 후보를 선택하고 권한과 출처와 수명과 예산을 검사하는 다섯 단계">
        {STEPS.map((item, position) => <Link key={item.key} to={item.href} aria-current={item.key === current ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${position <= index ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}><span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong><span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span></Link>)}
      </div>
    </aside>
  );
}

export function ContextStatePathMapReturn({ current }: { current: ContextStatePathArticle }) {
  const next = STEPS[INDEX[current] + 1];
  return (
    <aside id="context-state-path-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 Context state 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link to={next?.href ?? "/cs/ai/mcp-protocol"} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">{next ? `다음 단계 · ${next.label}으로 이동 →` : "다음 묶음 · MCP 기초로 이동 →"}</Link>
    </aside>
  );
}
