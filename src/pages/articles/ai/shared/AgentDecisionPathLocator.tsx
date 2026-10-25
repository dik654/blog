import { Link } from "react-router-dom";

const STEPS = [
  { key: "observe", label: "관찰", detail: "현재 상태와 실행 결과를 다음 판단의 입력으로 남깁니다.", href: "/cs/ai/agent-loop-foundations#overview" },
  { key: "plan", label: "계획", detail: "목표를 단계로 나누고 관찰이 달라지면 다시 계획합니다.", href: "/cs/ai/agent-plan-replanning#overview" },
  { key: "search", label: "탐색", detail: "정해진 예산 안에서 후보를 만들고 평가해 하나를 고릅니다.", href: "/cs/ai/search-based-reasoning-and-test-time-compute#overview" },
  { key: "verify", label: "검증", detail: "선택한 답과 실제 효과를 독립된 근거로 확인합니다.", href: "/cs/ai/agent-verification#overview" },
] as const;

export type AgentDecisionPathArticle = (typeof STEPS)[number]["key"];
const INDEX: Record<AgentDecisionPathArticle, number> = { observe: 0, plan: 1, search: 2, verify: 3 };
const QUESTIONS: Record<AgentDecisionPathArticle, string> = {
  observe: "에이전트는 실행했다고 말하는 대신 무엇을 다시 확인해야 합니까?",
  plan: "처음 세운 계획이 틀렸을 때 어떤 상태를 근거로 다시 나눕니까?",
  search: "같은 생성 예산으로 후보를 병렬 생성할지, 중간에 가지치기할지 어떻게 정합니까?",
  verify: "가장 그럴듯한 후보가 실제로 맞고 실행 결과도 남았는지 어떻게 확인합니까?",
};
const FINDINGS: Record<AgentDecisionPathArticle, string> = {
  observe: "관찰값은 다음 선택의 입력입니다. 파일·테스트·외부 효과가 바뀌었는지 확인하지 않으면 순환은 말뿐인 반복이 됩니다.",
  plan: "계획은 고정 목록이 아니라 현재 상태에 대한 가설입니다. 관찰이 예상과 다르면 남은 단계와 종료 조건을 다시 계산해야 합니다.",
  search: "추가 생성 횟수만 늘린다고 정답이 보장되지 않습니다. 후보가 갈라지는 시점과 verifier가 실제 정답을 구별하는 범위가 성능과 비용을 함께 정합니다.",
  verify: "검증은 모델의 확신과 분리된 증거를 남깁니다. 결정적 검사·환경 관찰·사람 승인을 효과의 위험도에 맞게 배치해야 합니다.",
};

export function AgentDecisionPathLocator({ current }: { current: AgentDecisionPathArticle }) {
  const index = INDEX[current];
  const step = STEPS[index];
  return <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="에이전트 판단 경로에서 현재 글의 위치">
    <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"><Link to="/cs/ai" className="hover:text-primary">인공지능</Link><span aria-hidden>›</span><Link to="/cs/ai/agent-loop-foundations#overview" className="hover:text-primary">에이전트 판단</Link><span aria-hidden>›</span><strong className="text-foreground" aria-current="page">{step.label}</strong></nav>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div><span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span><p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p></div>
      <div className="border-l-2 border-primary/45 pl-3"><p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p><Link to="/cs/ai/agent-loop-foundations#overview" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">한 번의 판단이 끝나는 전체 경로 ↗</Link></div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="에이전트가 관찰하고 계획하고 탐색하고 검증하는 네 단계">
      {STEPS.map((item, position) => <Link key={item.key} to={item.href} aria-current={item.key === current ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${position <= index ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}><span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong><span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span></Link>)}
    </div>
  </aside>;
}

export function AgentDecisionPathMapReturn({ current }: { current: AgentDecisionPathArticle }) {
  return <aside id="agent-decision-path-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 에이전트 판단 지도에 되돌려 놓기">
    <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
    <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
    <Link to="/cs/ai/agent-delegation-contracts#overview" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 글 · 다른 에이전트에게 판단을 맡기는 경계 →</Link>
  </aside>;
}
