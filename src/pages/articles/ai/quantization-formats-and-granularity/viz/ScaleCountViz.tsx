import SceneShell from "./QuantSceneShell";

/**
 * 본문 대응: #granularity — 4096×4096 weight matrix(원소 16,777,216개)의 scale 개수.
 * 한 행(출력 channel 하나) = 원소 4096개. 행 하나를 몇 조각으로 나누는지 × 4096행.
 * per-tensor 1 · per-channel 4096×1 = 4,096 · group 128: 4096×32 = 131,072 ·
 * NVFP4 block 16: 4096×256 = 1,048,576 (+ tensor scale 1).
 */
const ROWS = 4096;

const SCENES = [
  {
    label: "Per-tensor",
    summary: "scale 1개",
    perRow: 0,
    count: 1,
    formula: "행렬 전체가 1개를 공유",
    note: "원소 16,777,216개가 scale 하나를 함께 씁니다. 그림의 한 행도 다른 4095행과 같은 scale을 씁니다. 한 원소의 outlier가 전체 range를 정합니다.",
  },
  {
    label: "Per-channel",
    summary: "4,096행 × 1 = 4,096",
    perRow: 1,
    count: 4096,
    formula: "4,096행 × 행마다 1개",
    note: "출력 channel(행)마다 scale을 하나씩 둡니다. 원소 4096개가 scale 하나를 공유합니다.",
  },
  {
    label: "Group-wise 128",
    summary: "4,096행 × 32 = 131,072",
    perRow: 32,
    count: 131072,
    formula: "4,096행 × (4,096 ÷ 128 = 32조각)",
    note: "한 행을 원소 128개씩 32조각으로 나눕니다. 행마다 scale이 32개라 행 수 4096을 곱하면 131,072개입니다.",
  },
  {
    label: "NVFP4식 block 16",
    summary: "4,096행 × 256 = 1,048,576 (+1)",
    perRow: 256,
    count: 1048576,
    formula: "4,096행 × (4,096 ÷ 16 = 256조각) + tensor scale 1",
    note: "한 행을 원소 16개씩 256조각으로 나눕니다. Block scale 1,048,576개에, block scale들을 정규화하는 tensor scale 1개가 더해집니다. 원소 16개마다 scale 하나입니다.",
  },
] as const;

const W = 400;
const LOG_MAX = 7;

function RowStrip({ pieces }: { pieces: number }) {
  const cuts = pieces <= 1 ? [] : Array.from({ length: pieces - 1 }, (_, i) => ((i + 1) * W) / pieces);
  return (
    <svg viewBox={`0 0 ${W} 28`} role="img" aria-label={pieces <= 1 ? "한 행 전체가 한 조각" : `한 행이 ${pieces}조각`} className="block h-auto w-full">
      <rect x="0.5" y="4" width={W - 1} height="20" fill={pieces === 0 ? "#94a3b8" : "#2563eb"} opacity={pieces === 0 ? 0.25 : 0.18} stroke="#2563eb" strokeWidth="1" />
      {cuts.map((x) => (
        <line key={x} x1={x} x2={x} y1="4" y2="24" stroke="#2563eb" strokeWidth={pieces > 64 ? 0.5 : 1} />
      ))}
    </svg>
  );
}

export default function ScaleCountViz() {
  return (
    <SceneShell
      eyebrow="Scale 개수"
      title="한 행을 몇 조각으로 나누느냐에 4,096행을 곱하면 scale 개수가 된다"
      description="4096×4096 weight matrix에서 한 행(출력 channel 하나, 원소 4096개)을 띠로 그렸습니다. 세로선이 scale 경계입니다. 아래 막대는 네 방식의 scale 개수를 10배마다 같은 길이가 되는 log 눈금으로 비교합니다."
      ariaLabel="per-tensor, per-channel, group-wise, block 방식의 scale 개수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">한 행 = 원소 {ROWS.toLocaleString("en-US")}개</p>
              <div className="mt-1">
                <RowStrip pieces={scene.perRow} />
              </div>
              <p className="mt-1 break-keep font-mono text-xs font-semibold">{scene.formula}</p>
            </div>
            <div className="space-y-2">
              {SCENES.map((item, index) => {
                const width = Math.max(1, (Math.log10(item.count) / LOG_MAX) * 100);
                const on = index === active;
                return (
                  <div key={item.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs">
                    <span className={on ? "font-bold" : "text-muted-foreground"}>{item.label}</span>
                    <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: on ? "#2563eb" : "#94a3b8" }} />
                    </div>
                    <span className={`text-right font-mono ${on ? "font-bold" : "text-muted-foreground"}`}>{item.count.toLocaleString("en-US")}</span>
                  </div>
                );
              })}
              <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] gap-2 text-[11px] text-muted-foreground">
                <span />
                <div className="relative h-4 font-mono">
                  <span className="absolute left-0">1</span>
                  <span className="absolute -translate-x-1/2" style={{ left: `${(3 / LOG_MAX) * 100}%` }}>10³</span>
                  <span className="absolute right-0">10⁷</span>
                </div>
                <span />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
