const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function P2PStackViz() {
  const stages = [
    ["01 Transport", "연결·handshake", "peer identity와 NodeInfo를 확인"],
    ["02 MConnection", "channel 다중화", "한 연결의 bounded queue를 공정하게 전송"],
    ["03 Switch", "peer lifecycle", "peer 추가·제거와 channel owner를 관리"],
    ["04 Reactor", "protocol dispatch", "mempool·consensus 등 담당자에게 전달"],
  ];
  return <figure data-viz="cometbft-p2p-stack" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">P2P 책임 지도</p><p className="mt-1 text-sm text-muted-foreground">수신했다는 사실과 transaction을 받아들였다는 판단은 서로 다른 receipt입니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-4">
      {stages.map(([step, title, text], i) => <div key={step} className={card}>
        <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-primary">{step}</span><span className="text-xs text-muted-foreground">{i < 3 ? "다음 경계 →" : "도메인 처리"}</span></div>
        <p className="mt-3 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>)}
    </div>
  </figure>;
}

export function ChannelBackpressureViz() {
  const rows = [
    ["consensus", "priority 10", "vote·block part", "queue A"],
    ["mempool", "priority 5", "alice→bob 10", "queue B"],
    ["evidence", "priority 2", "misbehavior", "queue C"],
  ];
  return <figure data-viz="cometbft-channel-backpressure" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">느린 peer 격리</p><p className="mt-1 text-sm text-muted-foreground">각 peer·channel의 bounded queue가 가득 차면 TrySend는 실패하며, caller가 drop·retry·disconnect 정책을 결정합니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <div className="space-y-2">{rows.map(([name, priority, payload, queue]) => <div key={name} className={`${card} flex flex-wrap items-center gap-x-3 gap-y-1`}><span className="font-semibold">{name}</span><span className="rounded-md bg-muted px-2 py-1 text-xs">{priority}</span><span className="min-w-0 break-words text-sm text-muted-foreground">{payload} · {queue}</span></div>)}</div>
      <div className="hidden text-muted-foreground lg:block">→</div>
      <div className={card}><p className="text-xs font-bold text-primary">weighted scheduler</p><p className="mt-2 font-semibold">recentlySent / priority가 가장 작은 channel</p><div className="my-3 h-px bg-border"/><p className="text-sm leading-6 text-muted-foreground">선택된 message를 packet payload ceiling에 맞게 나누어 같은 connection으로 보냅니다. 높은 priority는 절대 지연 보장이 아니라 선택 비율의 힌트입니다.</p></div>
    </div>
  </figure>;
}
