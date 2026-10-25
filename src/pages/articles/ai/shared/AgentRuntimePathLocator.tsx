import { Link } from "react-router-dom";

const PATH = [
  { label: "실행 반복", detail: "판단·도구·관측을 한 요청 안에서 반복", href: "/cs/ai/agent-loop-foundations#overview" },
  { label: "작업 지식", detail: "반복 작업의 순서와 자료를 필요할 때 로딩", href: "/cs/ai/skills-anatomy#overview" },
  { label: "실행 수명", detail: "상태·중단·재개를 프로세스 밖까지 유지", href: "/cs/ai/agent-frameworks#overview" },
  { label: "도구 선택", detail: "같은 환불 사례로 후보와 직접 구현을 비교", href: "/cs/ai/agent-runtime-selection#comparison" },
  { label: "제품 하네스", detail: "워크스페이스·권한·검증을 실제 제품으로 통합", href: "/cs/ai/claude-code#overview" },
] as const;

function RuntimePath({ current }: { current: "실행 수명" | "도구 선택" }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="에이전트 실행 수명의 다섯 단계">
      {PATH.map((item, index) => {
        const selected = item.label === current;
        return (
          <Link key={item.label} to={item.href} aria-current={selected ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${selected ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-primary"}`}>
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function AgentRuntimePathLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="에이전트 실행 수명 지도에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-control-boundaries#overview" className="hover:text-primary">에이전트 제어 경계</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">실행 수명 확대</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">사람의 승인을 기다리거나 실행 프로세스가 중단돼도 같은 요청을 어디서부터 이어야 합니까?</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to="/cs/ai/agent-control-boundaries#overview" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">Workflow·Loop·Checkpoint의 제어 경계 ↗</Link>
        </div>
      </div>

      <RuntimePath current="실행 수명" />
    </aside>
  );
}

export function AgentRuntimePathReturn() {
  return (
    <aside id="agent-runtime-path-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 에이전트 실행 수명 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">새 worker는 마지막 checkpoint에서 완료되지 않은 node를 다시 실행할 수 있습니다. 외부 효과는 같은 작업 key로 기존 결과를 먼저 확인하고, 영수증을 검증한 뒤 완료 상태에 연결합니다.</p>
      <Link to="/cs/ai/agent-runtime-selection#comparison" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 주제 · 같은 환불 사례로 Runtime 선택하기 →</Link>
    </aside>
  );
}

export function AgentRuntimeSelectionLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="에이전트 실행 수명 지도에서 현재 실무 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-control-boundaries#overview" className="hover:text-primary">에이전트 제어 경계</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-frameworks#overview" className="hover:text-primary">상태·중단·재개</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">Runtime 선택</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">실무</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">A-104 환불을 안전하게 재개하려면 직접 구현과 네 Runtime 후보를 어떤 근거로 비교해야 합니까?</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">시작할 개념 앵커</p>
          <Link to="/cs/ai/agent-frameworks#langchain" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">Checkpoint·Replay·외부 효과 경계 ↗</Link>
        </div>
      </div>

      <RuntimePath current="도구 선택" />
    </aside>
  );
}

export function AgentRuntimeSelectionReturn() {
  return (
    <aside id="agent-runtime-selection-return" className="not-prose my-8 border-y border-border py-5" aria-label="Runtime 선택 결과를 실행 수명 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">선택 결과</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">후보 이름보다 A-104의 상태·승인·재개·외부 효과를 누가 소유하는지 먼저 적습니다. 같은 실패를 주입해 직접 구현보다 복구 가능성이 나아질 때만 Runtime을 채택하고, 진행 중인 checkpoint를 되돌릴 수 있는 이관 경로를 함께 확정합니다.</p>
      <Link to="/cs/ai/claude-code#overview" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 주제 · Runtime을 실제 제품 하네스에 연결하기 →</Link>
    </aside>
  );
}
