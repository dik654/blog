import { Link } from "react-router-dom";

const STEPS = [
  { key: "scope", label: "범위", detail: "에이전트가 스스로 고를 수 있는 대상과 효과를 먼저 제한합니다.", href: "/cs/ai/agent-control-boundaries#overview" },
  { key: "guard", label: "검사", detail: "요청·응답·도구 호출을 각 상태가 생긴 자리에서 다시 검사합니다.", href: "/cs/ai/llm-guardrails-and-output-validation#overview" },
  { key: "threat", label: "위협", detail: "신뢰하지 않는 지시와 오염된 데이터가 들어오는 경로를 구분합니다.", href: "/cs/ai/prompt-injection-poisoning-and-data-protection#injection-vectors" },
  { key: "isolate", label: "격리", detail: "검사를 우회해도 프로세스와 장치에 미치는 영향을 좁게 가둡니다.", href: "/cs/ai/agent-sandbox-security#overview" },
] as const;

export type AgentSafetyPathArticle = (typeof STEPS)[number]["key"];
const INDEX: Record<AgentSafetyPathArticle, number> = { scope: 0, guard: 1, threat: 2, isolate: 3 };
const QUESTIONS: Record<AgentSafetyPathArticle, string> = {
  scope: "에이전트가 잘못 판단해도 바꿀 수 없는 범위를 어디에 둡니까?",
  guard: "입력이 안전해 보여도 응답과 실제 실행을 어디서 다시 검사합니까?",
  threat: "사용자·문서·도구 결과에 섞인 지시를 어떻게 서로 다른 신뢰 수준으로 다룹니까?",
  isolate: "정책 검사를 우회한 코드가 호스트와 다른 작업에 미치는 영향을 어떻게 제한합니까?",
};
const FINDINGS: Record<AgentSafetyPathArticle, string> = {
  scope: "탐색 범위와 실행 권한은 다릅니다. 잘 찾았다는 사실만으로 더 넓은 효과를 허용하지 않습니다.",
  guard: "입력 허용은 전체 요청의 승인이 아닙니다. 새로 생긴 응답과 도구 호출을 각각 검사하고, 최종 외부 효과는 실행 범위와 영수증으로 다시 확인해야 합니다.",
  threat: "지시는 사용자 입력뿐 아니라 검색 문서와 도구 결과에서도 들어옵니다. 출처의 신뢰 수준과 실행 권한을 분리해야 피해 범위를 줄일 수 있습니다.",
  isolate: "필터가 모든 공격을 막는다고 가정하지 않습니다. syscall·파일·네트워크·GPU 경계를 별도로 제한해야 우회 뒤의 영향을 가둘 수 있습니다.",
};

export function AgentSafetyPathLocator({ current }: { current: AgentSafetyPathArticle }) {
  const index = INDEX[current];
  const step = STEPS[index];
  return <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="에이전트 안전 학습 경로에서 현재 글의 위치">
    <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"><Link to="/cs/ai" className="hover:text-primary">인공지능</Link><span aria-hidden>›</span><Link to="/cs/ai/agent-control-boundaries#overview" className="hover:text-primary">에이전트 안전</Link><span aria-hidden>›</span><strong className="text-foreground" aria-current="page">{step.label}</strong></nav>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div><span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span><p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p></div>
      <div className="border-l-2 border-primary/45 pl-3"><p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p><Link to="/cs/ai/agent-control-boundaries#overview" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">판단이 실제 효과가 되기 전의 경계 ↗</Link></div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="에이전트 안전을 범위와 검사와 위협과 격리로 나누는 네 단계">
      {STEPS.map((item, position) => <Link key={item.key} to={item.href} aria-current={item.key === current ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${position <= index ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}><span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong><span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span></Link>)}
    </div>
  </aside>;
}

export function AgentSafetyPathMapReturn({ current }: { current: AgentSafetyPathArticle }) {
  return <aside id="agent-safety-path-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 에이전트 안전 지도에 되돌려 놓기">
    <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
    <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
    <Link to="/cs/ai/prompt-injection-poisoning-and-data-protection#injection-vectors" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 글 · 지시와 데이터가 오염되는 경로 →</Link>
  </aside>;
}
