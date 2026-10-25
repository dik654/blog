import { Link } from "react-router-dom";

const PATH = [
  {
    label: "메시지 접수",
    detail: "채널 정책을 통과한 요청과 답장 경로를 보존",
    href: "#overview",
  },
  {
    label: "Agent 선택",
    detail: "Binding이 workspace와 session의 소유자를 결정",
    href: "#routing-sessions",
  },
  {
    label: "대화 상태",
    detail: "DM scope로 이번 요청이 읽을 기록을 선택",
    href: "#routing-sessions",
  },
  {
    label: "Turn 실행",
    detail: "Provider·model 뒤에 runtime을 골라 loop 실행",
    href: "#runtime-resources",
  },
  {
    label: "효과·답장",
    detail: "Tool 판정과 전달 결과를 서로 다른 증거로 남김",
    href: "#security-reply",
  },
] as const;

export function OpenClawPathLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="에이전트 시스템 지도에서 OpenClaw 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-control-boundaries#overview" className="hover:text-primary">
          에이전트 제어 경계
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">OpenClaw 실행 경로</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            Telegram에서 들어온 한 문장은 누가 받을 Agent와 대화 기록을 찾고, 모델과 도구를 실행한 뒤 어떻게 같은 대화로 돌아올까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/agent-control-boundaries#overview"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            에이전트의 판단·상태·실행 경계 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="OpenClaw 요청 처리의 다섯 구간">
        {PATH.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="min-w-0 bg-background px-3 py-3 text-muted-foreground hover:text-primary"
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-foreground">{item.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function OpenClawPathReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="OpenClaw에서 확인한 사실을 부모 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        Gateway는 들어오고 나가는 대화 경로를 소유하고, binding은 Agent를, session scope는 대화 상태를, runtime은 준비된 turn의 실행을 맡습니다. Tool 권한과 실행 위치도 별도 판정입니다.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">
        이 책임을 나누어 보면 모델이나 runtime을 바꿀 때 확인할 범위와, session 격리·tool 정책·답장 전달에서 따로 확인할 범위를 구분할 수 있습니다.
      </p>
      <Link
        to="/cs/ai/agent-control-boundaries#overview"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        에이전트 제어 경계 지도로 돌아가기 ↗
      </Link>
    </aside>
  );
}
