import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 공간 ÷ inode 수 = 16KiB가 손익분기.
 * 파일이 쌓이면 두 장부가 함께 차고, 평균 크기가 어느 쪽이 먼저 끝나는지 정한다.
 * 6.4KiB: 6,553,600개에서 inode 100%, 블록 40GiB=40%. 16KiB: 둘 다 100%.
 * 32KiB(가정): 100GiB ÷ 32KiB = 3,276,800개에서 블록 100%, inode 50%.
 */
const AXIS_MAX = 36;
const BREAK_EVEN = 16;

const STATES = [
  { size: 6.4, files: "6,553,600개", inodePct: 100, blockPct: 40, blockText: "40GiB · 40%", inodeText: "6,553,600개 · 100%", first: "inode가 먼저 바닥남" },
  { size: 16, files: "6,553,600개", inodePct: 100, blockPct: 100, blockText: "100GiB · 100%", inodeText: "6,553,600개 · 100%", first: "둘이 같은 순간에 바닥남" },
  { size: 32, files: "3,276,800개", inodePct: 50, blockPct: 100, blockText: "100GiB · 100%", inodeText: "3,276,800개 · 50%", first: "블록이 먼저 바닥남" },
];

const SCENES = [
  { label: "평균 6.4KiB", summary: "inode 100% · 블록 40%", note: "inode가 끝나는 순간 블록은 6,553,600 × 6.4KiB = 40GiB입니다. 9절 사례 B의 평균 크기이며, df의 Use%는 분모가 달라 43%로 나옵니다(8·9절)." },
  { label: "평균 16KiB", summary: "inode 100% · 블록 100%", note: "6,553,600 × 16KiB = 100GiB입니다. 두 막대가 같은 파일 수에서 끝나므로 이 크기가 손익분기입니다." },
  { label: "평균 32KiB (가정)", summary: "inode 50% · 블록 100%", note: "100GiB ÷ 32KiB = 3,276,800개에서 블록이 먼저 끝납니다. 그때 inode는 절반이 남아 있습니다. 32KiB는 손익분기의 반대쪽을 보이려고 고른 값입니다." },
];

function Meter({ label, pct, color, text }: { label: string; pct: number; color: string; text: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className="font-bold">{label}</span>
        <span className="font-mono text-muted-foreground">{text}</span>
      </div>
      <div className="mt-1 h-4 rounded-sm bg-muted/60">
        <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function InodeThresholdViz() {
  return (
    <SceneShell
      eyebrow="먼저 끝나는 장부"
      title="평균 파일 크기가 어느 장부가 먼저 끝나는지 정합니다"
      description="위 눈금은 평균 파일 크기이고, 아래 두 막대는 파일이 쌓이다가 먼저 한쪽이 다 찬 순간의 사용량입니다. 앞 문단의 가정대로 메타데이터는 0으로 두고, 예약 5%도 빼지 않은 100GiB 전체로 계산합니다."
      ariaLabel="평균 파일 크기에 따라 inode와 블록 중 먼저 바닥나는 쪽"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="relative h-5 text-[11px]">
                <span className="absolute left-0 top-0 font-semibold" style={{ color: "#7c3aed" }}>inode 먼저</span>
                <span className="absolute right-0 top-0 font-semibold" style={{ color: "#2563eb" }}>블록 먼저</span>
              </div>
              <div className="relative h-5">
                <div className="absolute inset-x-0 top-2 h-px bg-border" />
                <div className="absolute top-0 h-5 w-px" style={{ left: `${(BREAK_EVEN / AXIS_MAX) * 100}%`, backgroundColor: "#64748b" }} />
                <div className="absolute top-0 h-5 w-2 -translate-x-1/2 rounded-sm" style={{ left: `${(state.size / AXIS_MAX) * 100}%`, backgroundColor: "#dc2626" }} />
              </div>
              <div className="relative mt-1 h-5 font-mono text-[11px] text-muted-foreground">
                <span className="absolute -translate-x-1/2" style={{ left: `${(BREAK_EVEN / AXIS_MAX) * 100}%` }}>16KiB</span>
                <span className="absolute left-0">0</span>
                <span className="absolute right-0">36KiB</span>
              </div>
            </div>
            <p className="text-sm font-bold">파일 {state.files}에서 {state.first}</p>
            <Meter label="inode" pct={state.inodePct} color="#7c3aed" text={state.inodeText} />
            <Meter label="블록" pct={state.blockPct} color="#2563eb" text={state.blockText} />
          </div>
        );
      }}
    />
  );
}
