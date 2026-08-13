import VizFrame from "@/components/viz/VizFrame";

const stages = [
  {
    phase: "Ingress",
    owner: "Channel adapter",
    action: "메시지·첨부·sender를 공통 event로 정규화합니다.",
    output: "inbound event · reply route",
  },
  {
    phase: "Access",
    owner: "Gateway",
    action: "채널 인증 뒤 pairing·allowFrom·surface allowlist를 적용합니다.",
    output: "authorized event",
  },
  {
    phase: "Binding",
    owner: "Gateway",
    action: "account·peer·route binding으로 실행할 agent를 결정합니다.",
    output: "agent id",
  },
  {
    phase: "State",
    owner: "Session router",
    action: "dmScope와 대화 출처를 적용해 읽고 쓸 session key를 계산합니다.",
    output: "session state",
  },
  {
    phase: "Turn",
    owner: "Provider · model · runtime",
    action: "Provider 인증과 model 선택을 해석하고 runtime이 준비된 turn을 실행합니다.",
    output: "model output · tool request",
  },
  {
    phase: "Effect",
    owner: "Policy · sandbox",
    action: "Tool 허용 여부와 실행 위치를 판정하고 effect receipt를 남깁니다.",
    output: "observation · receipt",
  },
  {
    phase: "Delivery",
    owner: "Gateway · channel adapter",
    action: "완료된 turn을 처음 보존한 route의 채널 형식으로 전달합니다.",
    output: "reply · delivery receipt",
  },
] as const;

export default function GatewayViz() {
  return (
    <VizFrame
      eyebrow="Gateway route trace"
      title="Inbound route를 보존한 채 access·state·execution 경계를 차례로 통과합니다"
      description="Agent runtime은 이미 준비된 model turn을 실행합니다. 사용자 인증, session 선택, tool 권한, 답장 채널은 Gateway와 host policy가 소유합니다."
      note="Turn 중에는 05와 06이 여러 번 반복될 수 있지만, 새 tool request마다 policy와 sandbox 판정을 다시 적용합니다."
    >
      <ol className="divide-y divide-border/70">
        {stages.map(({ phase, owner, action, output }, index) => (
          <li
            key={phase}
            className="grid min-w-0 gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[2.25rem_5.5rem_10rem_minmax(0,1fr)] sm:gap-5"
          >
            <span className="font-mono text-[11px] font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-xs font-semibold text-muted-foreground">{phase}</p>
            <h4 className="min-w-0 text-sm font-bold leading-5 text-foreground">
              {owner}
            </h4>
            <div className="min-w-0">
              <p className="text-xs leading-5 text-foreground/85">{action}</p>
              <p className="mt-2 break-words font-mono text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                {output}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
