import SceneShell from "./SceneShell";

/**
 * 본문 대응: #counter-correlation — 같은 DRAM 수치라도 함께 놓는 counter에 따라 가설이 갈린다.
 * A: DRAM 89% + L2 hit 20% → 재사용 부족. B: DRAM 똑같이 높음 + L2 hit 85% → 첫 fetch·write 확인.
 * C: DRAM 20% + long scoreboard → latency를 숨기지 못했을 수 있음.
 */
type Row = { name: string; value: number | null; text: string };

const SCENES = [
  {
    label: "DRAM 하나만 볼 때",
    summary: "DRAM 89% → HBM이 바쁘다",
    rows: [
      { name: "DRAM throughput", value: 89, text: "89%" },
      { name: "L2 hit rate", value: null, text: "아직 안 봄" },
      { name: "long scoreboard", value: null, text: "아직 안 봄" },
    ],
    hypothesis: "HBM이 바쁘다는 사실까지만",
    next: "원인은 아직 없음 · 다른 질문의 counter를 붙인다",
    note: "DRAM throughput 하나는 HBM이 바쁘다는 사실까지만 말합니다. 왜 바쁜지는 다른 질문에 답하는 counter를 옆에 놓아야 좁혀집니다.",
  },
  {
    label: "+ L2 hit 20%",
    summary: "재사용 부족 가설",
    rows: [
      { name: "DRAM throughput", value: 89, text: "89%" },
      { name: "L2 hit rate", value: 20, text: "20%" },
      { name: "long scoreboard", value: null, text: "–" },
    ],
    hypothesis: "L2 요청의 많은 부분이 HBM으로 내려감 → 재사용 부족",
    next: "첫 후보: 재사용을 tile 안으로 옮기기",
    note: "Hit 20%면 L2 요청의 80%가 HBM 쪽으로 내려간다는 첫 근사가 생깁니다. 그래서 재사용 부족 가설을 세우고, 재사용을 tile 안으로 옮기는 변경을 첫 후보로 둡니다.",
  },
  {
    label: "DRAM 똑같이 높고 L2 hit 85%",
    summary: "같은 처방을 바로 못 고름",
    rows: [
      { name: "DRAM throughput", value: 89, text: "앞과 같음" },
      { name: "L2 hit rate", value: 85, text: "85%" },
      { name: "long scoreboard", value: null, text: "–" },
    ],
    hypothesis: "L2에서 대부분 끝나는데도 HBM이 바쁨",
    next: "처음 가져오는 데이터 자체가 많은지, write traffic이 큰지 확인",
    note: "DRAM 수치가 같아도 hit가 85%라면 재사용 부족 처방을 바로 고를 수 없습니다. L2에서 대부분 끝나는데도 HBM이 바쁘다면 처음 가져오는 데이터 자체가 많거나 write traffic이 큰지 확인합니다.",
  },
  {
    label: "DRAM 20% + long scoreboard",
    summary: "bandwidth가 아닐 수 있음",
    rows: [
      { name: "DRAM throughput", value: 20, text: "20%" },
      { name: "L2 hit rate", value: null, text: "–" },
      { name: "long scoreboard", value: null, text: "두드러짐" },
    ],
    hypothesis: "memory latency를 숨기지 못한 경우일 수 있음",
    next: "eligible warp와 독립적인 outstanding request 확인",
    note: "DRAM이 20%로 낮은데 long scoreboard가 두드러지면 bandwidth가 아니라 latency를 숨기지 못한 경우일 수 있습니다. 어느 경우든 상관은 증명이 아니며, 변경 하나 뒤 elapsed와 counter가 함께 움직일 때만 가설을 유지합니다.",
  },
] as const satisfies readonly { label: string; summary: string; rows: readonly Row[]; hypothesis: string; next: string; note: string }[];

function CounterRow({ row }: { row: Row }) {
  const known = row.value !== null;
  const badge = !known && row.text !== "–" && row.text !== "아직 안 봄";
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-[11px] sm:grid-cols-[9rem_minmax(0,1fr)_7.5rem] sm:text-sm">
      <span className="font-mono text-muted-foreground">{row.name}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        {known ? <div className="h-full rounded-sm" style={{ width: `${row.value}%`, backgroundColor: "#2563eb" }} /> : null}
        {badge ? <div className="h-full w-full rounded-sm border border-dashed" style={{ borderColor: "#d97706" }} /> : null}
      </div>
      <span className={`text-right font-mono ${known || badge ? "font-bold" : "text-muted-foreground"}`}>{row.text}</span>
    </div>
  );
}

export default function CounterPairViz() {
  return (
    <SceneShell
      eyebrow="Counter 짝 읽기"
      title="같은 DRAM 수치라도 옆에 놓는 counter에 따라 가설이 갈립니다"
      description="막대는 각 counter의 퍼센트입니다. Long scoreboard는 warp가 global memory 같은 load 결과를 기다리느라 멈춘 stall 이유이며, 본문은 수치 없이 '두드러진다'고만 해 점선으로 표시했습니다."
      ariaLabel="DRAM throughput, L2 hit rate, long scoreboard 조합별로 갈리는 성능 가설"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              {scene.rows.map((row) => <CounterRow key={row.name} row={row} />)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
              <div className="flex min-h-[4.5rem] flex-col justify-center rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "#7c3aed" }}>
                <span className="text-[11px] font-bold" style={{ color: "#7c3aed" }}>가설</span>
                <span className="break-keep leading-6">{scene.hypothesis}</span>
              </div>
              <span aria-hidden className="hidden self-center text-center text-primary sm:block">→</span>
              <div className="flex min-h-[4.5rem] flex-col justify-center rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "#0f766e" }}>
                <span className="text-[11px] font-bold" style={{ color: "#0f766e" }}>다음에 볼 것</span>
                <span className="break-keep leading-6">{scene.next}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
