import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "loop",
    label: "단일 실행",
    detail: "한 agent가 판단·도구·관찰을 반복합니다.",
    href: "/cs/ai/agent-loop-foundations#overview",
  },
  {
    key: "delegation",
    label: "위임 계약",
    detail: "어떤 판단과 결과물을 다른 agent에게 맡길지 정합니다.",
    href: "/cs/ai/agent-delegation-contracts#overview",
  },
  {
    key: "implementation",
    label: "실행 계약",
    detail: "Worker 결과·합류·재시도를 실행 상태로 고정합니다.",
    href: "/cs/ai/multi-agent-implementation#overview",
  },
  {
    key: "boundary",
    label: "확장 경계",
    detail: "Hook·guardrail·verifier의 실행 권한을 분리합니다.",
    href: "/cs/ai/agent-extension-boundaries#overview",
  },
] as const;

export function AgentDelegationImplementationLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="에이전트 위임에서 실행 계약으로 내려가는 학습 경로"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai/agent-delegation-contracts#overview"
          className="hover:text-primary"
        >
          에이전트 위임
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          실행 계약
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            실무
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            여러 worker가 만든 결과를 누락·충돌·중복 실행 없이 어떻게 하나의 완료 상태로 합칩니까?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            시작할 개념 앵커
          </p>
          <Link
            to="/cs/ai/agent-delegation-contracts#parallel-merge"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            위임 결과의 artifact·receipt·join 조건 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"
        aria-label="단일 실행에서 위임과 실행 계약을 거쳐 확장 경계로 가는 네 단계"
      >
        {STEPS.map((item, index) => {
          const current = item.key === "implementation";
          return (
            <Link
              key={item.key}
              to={item.href}
              aria-current={current ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                current
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {item.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                {item.detail}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function AgentDelegationImplementationReturn() {
  return (
    <aside
      id="agent-delegation-implementation-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="실행 계약에서 확인한 사실을 에이전트 위임 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        위임은 worker 호출로 끝나지 않습니다. 같은 input snapshot에서 나온 receipt를 모아 필수 결과의 누락과 artifact 충돌을 검사하고, 재실행해도 외부 효과가 한 번만 남을 때 완료로 판정합니다.
      </p>
      <Link
        to="/cs/ai/agent-extension-boundaries#overview"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        다음 주제 · Hook·guardrail·verifier의 실행 경계 →
      </Link>
    </aside>
  );
}
