import { Link } from "react-router-dom";

const STEPS = [
  { key: "protocol", label: "연결", detail: "Host·client·server의 책임과 요청 규칙을 나눕니다.", href: "/cs/ai/mcp-protocol#overview" },
  { key: "primitives", label: "기능", detail: "Tool·Resource·Prompt와 결과 상태를 구분합니다.", href: "/cs/ai/mcp-primitives#overview" },
  { key: "transport", label: "운반", detail: "같은 메시지가 stdio와 HTTP를 지나는 방식을 봅니다.", href: "/cs/ai/mcp-transports#overview" },
  { key: "operations", label: "실행", detail: "권한·중복 방지·실행 영수증으로 끝을 확인합니다.", href: "/cs/ai/mcp-server-operations#overview" },
] as const;

export type McpRequestPathArticle = (typeof STEPS)[number]["key"];
const INDEX: Record<McpRequestPathArticle, number> = { protocol: 0, primitives: 1, transport: 2, operations: 3 };
const QUESTIONS: Record<McpRequestPathArticle, string> = {
  protocol: "AI가 외부 기능을 쓰는 동안 누가 판단하고, 전달하고, 실행합니까?",
  primitives: "티켓을 만드는 Tool은 읽을 자료와 재사용 Prompt와 무엇이 다릅니까?",
  transport: "같은 tools/call 메시지는 로컬 pipe와 원격 HTTP에서 어떻게 이동합니까?",
  operations: "응답이 끊겨도 티켓을 중복 생성하지 않고 실제 결과를 어떻게 확인합니까?",
};
const FINDINGS: Record<McpRequestPathArticle, string> = {
  protocol: "MCP는 Host·client·server 사이의 메시지 계약입니다. 사용자 승인과 서버 권한, 실제 업무 효과는 각 소유자가 따로 판정합니다.",
  primitives: "Tool은 모델이 실행을 제안하는 동작이고 Resource는 URI로 읽는 자료, Prompt는 사용자가 고르는 메시지 틀입니다. Schema 검사는 권한 검사가 아닙니다.",
  transport: "Transport는 JSON-RPC 메시지의 framing·전달·취소 신호를 정합니다. stdio와 HTTP가 달라도 메시지 의미와 외부 효과의 완료 여부는 별도입니다.",
  operations: "쓰기 요청은 현재 권한을 다시 검사하고 안정된 작업 식별자와 실행 영수증을 남겨야 합니다. Timeout은 실패가 아니라 결과 미확인 상태일 수 있습니다.",
};

export function McpRequestPathLocator({ current }: { current: McpRequestPathArticle }) {
  const index = INDEX[current];
  const step = STEPS[index];
  return <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="MCP 요청 경로에서 현재 글의 위치">
    <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"><Link to="/cs/ai" className="hover:text-primary">인공지능</Link><span aria-hidden>›</span><Link to="/cs/ai/mcp-protocol#overview" className="hover:text-primary">MCP 요청</Link><span aria-hidden>›</span><strong className="text-foreground" aria-current="page">{step.label}</strong></nav>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div><span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span><p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p></div>
      <div className="border-l-2 border-primary/45 pl-3"><p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p><Link to={current === "protocol" ? "/cs/ai" : "/cs/ai/mcp-protocol#overview"} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">{current === "protocol" ? "Agent & Tools 전체 학습 지도 ↗" : "MCP 요청 한 건의 전체 경로 ↗"}</Link></div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="외부 기능 요청이 연결과 기능 계약과 운반과 실행을 거치는 네 단계">
      {STEPS.map((item, position) => <Link key={item.key} to={item.href} aria-current={item.key === current ? "step" : undefined} className={`min-w-0 bg-background px-3 py-3 ${position <= index ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}><span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong><span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span></Link>)}
    </div>
  </aside>;
}

export function McpRequestPathMapReturn({ current }: { current: McpRequestPathArticle }) {
  const next = STEPS[INDEX[current] + 1];
  return <aside id="mcp-request-path-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 MCP 요청 지도에 되돌려 놓기">
    <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
    <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
    <Link to={next?.href ?? "/cs/ai/agent-loop-foundations#overview"} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">{next ? `다음 단계 · ${next.label}으로 이동 →` : "다음 묶음 · Agent loop로 이동 →"}</Link>
  </aside>;
}
