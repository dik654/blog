import VizFrame from "@/components/viz/VizFrame";

const controls = [
  {
    control: "Tool policy",
    question: "무엇을 호출할 수 있는가?",
    owns: "tool profile · allow/deny · agent별 override",
    doesNot: "실행 위치를 sandbox 안팎으로 정하지 않습니다.",
  },
  {
    control: "Sandbox",
    question: "허용된 tool을 어디에서 실행하는가?",
    owns: "mode · scope · workspace access · bind visibility",
    doesNot: "Tool allowlist를 넓히거나 host 권한을 자동으로 주지 않습니다.",
  },
  {
    control: "Elevated",
    question: "Sandboxed exec를 host에서 실행해도 되는가?",
    owns: "exec-only escape · sender allowlist · approval mode",
    doesNot: "금지된 exec를 허용하거나 다른 tool을 새로 부여하지 않습니다.",
  },
] as const;

const receipt = [
  ["Identity", "agent · session · sender"],
  ["Decision", "tool · arguments · allow/deny source"],
  ["Location", "sandbox · gateway/node host · workspace access"],
  ["Effect", "approval · result/error · timestamp"],
] as const;

export default function ChannelFlowViz() {
  return (
    <VizFrame
      eyebrow="Execution responsibility ledger"
      title="Tool policy, sandbox, elevated는 각각 허용 대상·실행 위치·예외를 맡습니다"
      description="세 제어를 하나의 보안 스위치로 취급하면 ‘sandbox라서 모든 tool이 안전하다’거나 ‘elevated가 deny를 우회한다’는 잘못된 결론에 도달합니다."
    >
      <div className="divide-y divide-border/70">
        {controls.map(({ control, question, owns, doesNot }, index) => (
          <section
            key={control}
            className="grid min-w-0 gap-4 py-5 first:pt-0 sm:grid-cols-[2.25rem_8rem_minmax(0,1fr)] sm:gap-6"
          >
            <span className="font-mono text-[11px] font-semibold text-primary">
              C{index + 1}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-foreground">{control}</h4>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{question}</p>
            </div>
            <dl className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                  Owns
                </dt>
                <dd className="mt-2 text-xs leading-5 text-foreground/85">{owns}</dd>
              </div>
              <div className="min-w-0 border-l border-border pl-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Does not grant
                </dt>
                <dd className="mt-2 text-xs leading-5 text-muted-foreground">{doesNot}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-6 border-t border-border pt-6">
        <h4 className="text-sm font-bold text-foreground">Effect receipt</h4>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
          결과만 남기지 말고 어떤 identity와 policy가 어디에서 side effect를 만들었는지 함께 기록합니다.
        </p>
        <dl className="mt-5 grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {receipt.map(([name, value]) => (
            <div key={name} className="min-w-0 border-l border-border pl-3">
              <dt className="text-xs font-semibold text-foreground">{name}</dt>
              <dd className="mt-2 break-words font-mono text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </VizFrame>
  );
}
