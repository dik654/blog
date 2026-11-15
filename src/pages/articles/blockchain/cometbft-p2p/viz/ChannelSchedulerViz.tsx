import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mconnection ExplainedFormula — 두 pending channel의 R/p 비교.
 * consensus R=2000·p=10 → 200, mempool R=600·p=5 → 120 → mempool 선택.
 * mempool이 400 bytes 전송 → R=1000 → 200(같아짐). 0.8 감쇠 → 1600/10=160, 800/5=160.
 */
const SCALE = 220;

const SCENES = [
  {
    label: "비율 비교",
    summary: "200 대 120 → mempool",
    consensus: 2000,
    mempool: 600,
    pick: "mempool",
    note: "Consensus channel의 priority가 10으로 더 높지만 최근 전송량 R이 2,000입니다. 2000/10=200이고 mempool은 600/5=120입니다. 더 작은 120의 mempool이 이번 packet을 보냅니다.",
  },
  {
    label: "보낸 만큼 증가",
    summary: "600 + 400 = 1000 → 200",
    consensus: 2000,
    mempool: 1000,
    pick: "tie",
    note: "Mempool이 400 bytes를 보내면 R이 1,000이 되고 비율은 1000/5=200으로 consensus와 같아집니다. 다음 선택에서 다시 경쟁하며, 비율이 같으면 channels slice에서 먼저 만난 pending channel이 남습니다.",
  },
  {
    label: "주기적 감쇠",
    summary: "×0.8 → 160 대 160",
    consensus: 1600,
    mempool: 800,
    pick: "tie",
    note: "updateStats가 모든 R을 0.8배로 줄입니다. 2000→1600, 1000→800이 되어 두 비율이 함께 160으로 내려갑니다. 오래된 전송량은 옅어지지만 상대적 weight는 유지됩니다. 이 비율은 선택 순서일 뿐 대역폭이나 지연 예약이 아닙니다.",
  },
] as const;

function Row({ name, r, p, chosen, tie }: { name: string; r: number; p: number; chosen: boolean; tie: boolean }) {
  const ratio = r / p;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
      <div className="min-w-0">
        <span className={`block font-bold ${chosen ? "text-primary" : ""}`}>{name}</span>
        <span className="block font-mono text-muted-foreground">p = {p}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-4 min-w-0 flex-1 rounded-sm bg-muted/40">
            <div
              className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(ratio / SCALE) * 100}%`, backgroundColor: chosen ? "#2563eb" : "#94a3b8" }}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-mono font-bold">{ratio}</span>
        </div>
        <span className="mt-1 block font-mono text-muted-foreground">
          R {r.toLocaleString("en-US")} ÷ p {p} = {ratio}
          {chosen && !tie ? " · 선택" : ""}
          {tie ? " · 동률" : ""}
        </span>
      </div>
    </div>
  );
}

export default function ChannelSchedulerViz() {
  return (
    <SceneShell
      eyebrow="Channel 선택"
      title="Priority가 높아도 최근에 많이 보냈으면 순서를 양보합니다"
      description="R은 channel이 최근 보낸 framing bytes를 주기적으로 줄여 가며 쌓은 값, p는 ChannelDescriptor의 priority입니다. 막대는 R/p이고 더 짧은 쪽이 다음 packet을 보냅니다. 숫자는 본문의 예입니다."
      ariaLabel="consensus와 mempool channel의 R 나누기 p 비교와 전송, 감쇠 뒤의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tie = scene.pick === "tie";
        return (
          <div className="space-y-4">
            <Row name="consensus" r={scene.consensus} p={10} chosen={false} tie={tie} />
            <Row name="mempool 0x30" r={scene.mempool} p={5} chosen={scene.pick === "mempool"} tie={tie} />
            <p className="text-xs text-muted-foreground">막대 끝 = R/p · 축 0–{SCALE}</p>
          </div>
        );
      }}
    />
  );
}
