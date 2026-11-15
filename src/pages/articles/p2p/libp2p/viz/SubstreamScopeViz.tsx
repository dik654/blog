import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #handler-trait — stream multiplexing(한 secure connection을 여러 substream으로 나눔)과
 * protocol negotiation(그 stream의 bytes를 어떤 protocol로 읽을지 고름)은 다른 일이고,
 * stream 실패와 connection 종료는 범위가 다르다. 다른 substream 두 줄은 범위를 보이려는 가정이다.
 */
type Lane = { name: string; proto: string; state: "ok" | "new" | "agreed" | "failed" | "closed" };

const SCENES = [
  {
    label: "다중화: 새 substream",
    summary: "Muxer가 줄 하나를 더 엶",
    conn: "open",
    lanes: [
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "새 substream", proto: "protocol 미정 · bytes 해석 불가", state: "new" },
    ] as Lane[],
    note: "Handler가 OutboundSubstreamRequest를 내면 Muxer가 connection 42 안에 ordered substream을 하나 더 엽니다. 이 단계에서는 줄이 생겼을 뿐, 그 줄의 bytes를 어떤 protocol로 읽을지는 아직 정해지지 않았습니다.",
  },
  {
    label: "협상: protocol 합의",
    summary: "multistream-select → /ipfs/ping/1.0.0",
    conn: "open",
    lanes: [
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "Ping substream", proto: "/ipfs/ping/1.0.0", state: "agreed" },
    ] as Lane[],
    note: "multistream-select가 /ipfs/ping/1.0.0을 합의하면 negotiated stream이 FullyNegotiatedOutbound로 같은 Handler에 돌아옵니다. 줄을 여는 일과 줄의 뜻을 정하는 일은 함께 나타나지만 같은 작업이 아닙니다.",
  },
  {
    label: "stream 하나의 실패",
    summary: "timeout · unsupported · reset",
    conn: "open",
    lanes: [
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "다른 substream", proto: "(가정)", state: "ok" },
      { name: "Ping substream", proto: "협상 timeout · protocol 불일치 · reset", state: "failed" },
    ] as Lane[],
    note: "Negotiation timeout, unsupported protocol, stream reset은 이 substream 하나의 실패입니다. connection 42와 다른 substream은 남아 있으므로 재시도 범위도 이 stream으로 좁힐 수 있습니다.",
  },
  {
    label: "connection close",
    summary: "connection 42 전체 종료",
    conn: "closed",
    lanes: [
      { name: "다른 substream", proto: "(가정)", state: "closed" },
      { name: "다른 substream", proto: "(가정)", state: "closed" },
      { name: "Ping substream", proto: "/ipfs/ping/1.0.0", state: "closed" },
    ] as Lane[],
    note: "connection close는 그 위의 모든 substream을 함께 끝냅니다. stream 실패와 다른 실패로 application에 알려야 재시도 범위를 올바르게 정할 수 있습니다.",
  },
] as const;

const LANE_CLASS: Record<Lane["state"], string> = {
  ok: "border-border bg-background text-muted-foreground",
  new: "border-dashed border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]",
  agreed: "border-[#059669] bg-[#059669]/10 text-[#059669]",
  failed: "border-dashed border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626]",
  closed: "border-dashed border-border/60 bg-background text-muted-foreground/60 line-through",
};

export default function SubstreamScopeViz() {
  return (
    <StepSceneShell
      eyebrow="다중화와 협상"
      title="줄을 여는 일, 줄의 뜻을 정하는 일, 실패가 닿는 범위"
      description="바깥 칸이 Noise로 인증된 connection 42이고, 안쪽 줄 하나가 substream입니다. 위 두 줄은 범위를 보이려고 둔 다른 substream(가정)입니다."
      ariaLabel="connection 42 안의 substream 다중화, protocol 협상, stream 실패와 connection 종료 범위"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const closed = scene.conn === "closed";
        return (
          <div
            className={`min-w-0 rounded-xl border px-3 py-3 sm:px-4 ${
              closed ? "border-dashed border-[#dc2626] bg-[#dc2626]/5" : "border-[#0f766e] bg-[#0f766e]/5"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs font-bold sm:text-sm">
              <span className={closed ? "text-[#dc2626]" : "text-[#0f766e]"}>connection 42 · Bob</span>
              <span className="text-muted-foreground">{closed ? "닫힘" : "열림 · Handler 42"}</span>
            </div>
            <div className="mt-3 space-y-2">
              {scene.lanes.map((lane, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-2 text-[11px] font-semibold leading-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:text-xs ${LANE_CLASS[lane.state]}`}
                >
                  <span className="break-keep">{lane.name}</span>
                  <span className="break-keep font-mono">{lane.proto}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
