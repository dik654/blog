import SceneShell from "./SceneShell";

/**
 * 본문 대응: #initial-sync Lookahead — 응답 도착 순서와 consumer 전달 순서가 다르다.
 * 네 range를 미리 요청하고, 도착 순서는 109–112 → 101–104 → 105–108 → 113–116으로 가정합니다.
 * 규칙: 첫 machine이거나 앞 machine이 모두 new·scheduled·dataParsed를 벗어났을 때만 sent.
 */
type MachineState = "new" | "scheduled" | "dataParsed" | "sent";

const RANGES = ["101–104", "105–108", "109–112", "113–116"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  states: readonly MachineState[];
  arrived: number | null;
  sentOrder: readonly number[];
  note: string;
}[] = [
  {
    label: "네 range 요청",
    summary: "4개 모두 scheduled",
    states: ["scheduled", "scheduled", "scheduled", "scheduled"],
    arrived: null,
    sentOrder: [],
    note: "Queue는 network I/O를 위해 네 range를 미리 요청할 수 있습니다. 이 예에서는 네 range를 모두 요청해 둔 상태에서 시작합니다. 아직 어떤 응답도 오지 않았으므로 consumer에게 보낸 range는 없습니다.",
  },
  {
    label: "109–112 먼저 도착",
    summary: "보관 · 앞 range 대기",
    states: ["scheduled", "scheduled", "dataParsed", "scheduled"],
    arrived: 2,
    sentOrder: [],
    note: "셋째 range의 응답이 가장 먼저 왔다고 가정합니다. 이 machine은 dataParsed로 응답을 보관하지만, 앞의 101–104와 105–108이 아직 scheduled이므로 보내지 않고 기다립니다.",
  },
  {
    label: "101–104 도착",
    summary: "첫 range라 바로 전달",
    states: ["sent", "scheduled", "dataParsed", "scheduled"],
    arrived: 0,
    sentOrder: [0],
    note: "첫 machine은 앞에 기다릴 range가 없으므로 consumer에게 보냅니다. 109–112는 105–108이 아직 scheduled라 계속 기다립니다.",
  },
  {
    label: "105–108 도착",
    summary: "막혀 있던 109–112도 풀림",
    states: ["sent", "sent", "sent", "scheduled"],
    arrived: 1,
    sentOrder: [0, 1, 2],
    note: "105–108의 앞 machine은 이미 sent이므로 보낼 수 있습니다. 그러면 109–112의 앞 machine 둘이 모두 sent가 되어, 먼저 받아 두었던 109–112도 그 뒤에 전달됩니다.",
  },
  {
    label: "113–116 도착",
    summary: "전달 순서 = slot 순서",
    states: ["sent", "sent", "sent", "sent"],
    arrived: 3,
    sentOrder: [0, 1, 2, 3],
    note: "마지막 range까지 전달됩니다. 도착 순서는 109 → 101 → 105 → 113이었지만 consumer가 받은 순서는 101 → 105 → 109 → 113입니다. Consumer는 이 순서대로 blockchain receiver에 처리를 요청합니다.",
  },
];

const ARRIVAL_ORDER = [2, 0, 1, 3] as const;

const STATE_STYLE: Record<MachineState, string> = {
  new: "border-border text-muted-foreground",
  scheduled: "border-border text-muted-foreground",
  dataParsed: "border-amber-600 text-amber-700 dark:text-amber-400",
  sent: "border-blue-600 text-blue-700 dark:text-blue-400",
};

const STATE_HINT: Record<MachineState, string> = {
  new: "아직 요청 전",
  scheduled: "요청함 · 응답 대기",
  dataParsed: "응답 보관 · 앞 range 대기",
  sent: "consumer로 전달",
};

export default function ArrivalVsSendOrderViz() {
  return (
    <SceneShell
      eyebrow="Lookahead queue · 설명용 4-slot batch"
      title="응답이 도착한 순서가 아니라 앞 range가 풀린 순서로 내보냅니다"
      description="한 줄이 range 하나를 맡은 state machine입니다. scheduled는 요청을 보낸 상태, dataParsed는 응답을 받아 보관한 상태, sent는 consumer에게 넘긴 상태입니다. 도착 순서는 예를 위한 가정입니다."
      ariaLabel="네 range의 응답 도착 순서와 consumer 전달 순서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const arrivedCount = scene.arrived === null ? 0 : (ARRIVAL_ORDER as readonly number[]).indexOf(scene.arrived) + 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid gap-1.5">
              {RANGES.map((range, index) => {
                const state = scene.states[index];
                const justArrived = scene.arrived === index;
                return (
                  <div key={range} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
                    <span className={`font-mono text-xs ${justArrived ? "font-bold text-primary" : "text-muted-foreground"}`}>{range}</span>
                    <div className={`flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-2 py-1 ${STATE_STYLE[state]} ${state === "scheduled" ? "border-dashed" : ""}`}>
                      <strong className="font-mono text-xs">{state}</strong>
                      <span className="break-keep text-right text-[10px] leading-4 sm:text-xs">{justArrived ? `방금 도착 · ${STATE_HINT[state]}` : STATE_HINT[state]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="min-w-0 rounded-lg border border-border p-2">
                <span className="text-[10px] font-bold text-muted-foreground">응답 도착 순서 (가정)</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ARRIVAL_ORDER.map((index, order) => (
                    <span key={index} className={`rounded border px-1 font-mono text-[10px] ${order < arrivedCount ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-dashed border-border text-muted-foreground/50"}`}>
                      {RANGES[index].slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-w-0 rounded-lg border border-border p-2">
                <span className="text-[10px] font-bold text-muted-foreground">consumer 전달 순서</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RANGES.map((range, index) => {
                    const sent = scene.sentOrder.includes(index);
                    return (
                      <span key={range} className={`rounded border px-1 font-mono text-[10px] ${sent ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-dashed border-border text-muted-foreground/50"}`}>
                        {range.slice(0, 3)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
