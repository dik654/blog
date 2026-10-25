import { Link } from "react-router-dom";

const EXTENSIONS = [
  { label: "Hook", detail: "정해진 사건에 자동으로 반응", href: "/cs/ai/agent-extension-boundaries#hook" },
  { label: "Skill", detail: "반복 작업의 순서와 자료를 제공", href: "/cs/ai/skills-anatomy#overview" },
  { label: "Guardrail", detail: "요청과 실행의 허용 여부를 판정", href: "/cs/ai/agent-extension-boundaries#guardrail" },
  { label: "Verifier", detail: "실제 결과가 기준을 만족하는지 확인", href: "/cs/ai/agent-extension-boundaries#verifier" },
] as const;

export function SkillWorkflowLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="에이전트 확장 경계에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-extension-boundaries#map" className="hover:text-primary">에이전트 확장 경계</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">Skill 확대</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">요청과 맞는 Skill은 어떻게 발견되고, 실제 도구와 권한을 바꾸지 않은 채 작업 절차를 실행합니까?</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to="/cs/ai/agent-extension-boundaries#map" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">Hook · Skill · Guardrail · Verifier의 네 책임 ↗</Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="에이전트 확장의 네 책임">
        {EXTENSIONS.map((item, index) => (
          <Link key={item.label} to={item.href} aria-current={item.label === "Skill" ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${item.label === "Skill" ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}>
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function SkillWorkflowMapReturn() {
  return (
    <aside id="skill-workflow-map-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 에이전트 확장 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">Skill은 요청과 맞는 작업 지식을 단계적으로 펼칩니다. 실제 데이터와 동작은 Tool·MCP가 제공하고, 권한과 승인은 실행 환경이 계속 판정하며, 결과 합격은 별도 검증이 맡습니다.</p>
      <Link to="/cs/ai/agent-frameworks#overview" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 주제 · 반복 실행을 framework가 맡는 경우 →</Link>
    </aside>
  );
}
