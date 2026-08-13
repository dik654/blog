import VizFrame from "@/components/viz/VizFrame";

const sharedRows = [
  ["Telegram", "사용자 A", "agent:support:main"],
  ["Slack", "사용자 B", "agent:support:main"],
] as const;

const isolatedRows = [
  ["Telegram", "사용자 A", "telegram · A"],
  ["Slack", "사용자 B", "slack · B"],
] as const;

function ScopeRows({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <div className="divide-y divide-border/70 border-y border-border/70">
      {rows.map(([channel, peer, session]) => (
        <div
          key={`${channel}-${peer}`}
          className="grid min-w-0 gap-2 py-4 sm:grid-cols-[5.5rem_5.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-4"
        >
          <span className="text-xs font-bold text-foreground">{channel}</span>
          <span className="text-xs text-muted-foreground">{peer}</span>
          <code className="min-w-0 break-words text-[11px] leading-5 text-primary [overflow-wrap:anywhere]">
            {session}
          </code>
        </div>
      ))}
    </div>
  );
}

export default function ChannelMessageFlowViz() {
  return (
    <VizFrame
      eyebrow="DM session scope"
      title="두 사용자의 DM이 같은 main session으로 모이면 대화 이력이 충돌할 수 있습니다"
      description="main은 개인용 assistant의 채널 간 연속성에는 유용합니다. 여러 사람이 접근하는 inbox에서는 channel과 sender를 함께 key scope에 넣어야 각 대화가 분리됩니다."
      note="격리된 key 표기는 구성 요소를 보여 주는 개념식입니다. 실제 직렬화 형식보다 channel+sender가 별도 session을 선택한다는 점이 핵심입니다."
    >
      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
        <section className="min-w-0">
          <div className="mb-4 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">Default · personal continuity</p>
            <h4 className="mt-1 text-sm font-bold text-foreground">
              <code>dmScope: main</code>
            </h4>
          </div>
          <ScopeRows rows={sharedRows} />
          <dl className="mt-5 grid min-w-0 gap-3 text-xs leading-5">
            <div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3">
              <dt className="font-semibold">History</dt>
              <dd className="text-muted-foreground">A와 B가 같은 transcript context를 읽습니다.</dd>
            </div>
            <div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3">
              <dt className="font-semibold">Risk</dt>
              <dd className="text-muted-foreground">한 사용자의 정보가 다른 사용자 turn에 나타날 수 있습니다.</dd>
            </div>
          </dl>
        </section>

        <section className="min-w-0 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="mb-4 min-w-0">
            <p className="text-xs font-semibold text-primary">Multi-user isolation</p>
            <h4 className="mt-1 text-sm font-bold text-foreground">
              <code>dmScope: per-channel-peer</code>
            </h4>
          </div>
          <ScopeRows rows={isolatedRows} />
          <dl className="mt-5 grid min-w-0 gap-3 text-xs leading-5">
            <div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3">
              <dt className="font-semibold">History</dt>
              <dd className="text-muted-foreground">Channel+sender마다 독립 transcript를 읽습니다.</dd>
            </div>
            <div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3">
              <dt className="font-semibold">Limit</dt>
              <dd className="text-muted-foreground">이는 메시지 context 경계이며 host-admin 격리를 대신하지 않습니다.</dd>
            </div>
          </dl>
        </section>
      </div>
    </VizFrame>
  );
}
