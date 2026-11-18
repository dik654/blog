import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 셋째 문단 + #picture 첫 문단.
 * 같은 16대를 rack당 4대(DC busbar)와 2대(AC rack PDU)로 나눕니다.
 * DC: 대당 14.5/19kW → rack당 58/76kW, rack 4개. AC: 대당 15/19.7kW → rack당 30/39.4kW, rack 8개.
 * 4절의 예: 기존 전산실이 rack당 30~40kW만 받으면 76kW 피크 rack은 불가능.
 */
const SCALE_MAX = 80;
const BAND_LOW = 30;
const BAND_HIGH = 40;

const LAYOUTS = [
  { key: "dc", title: "DC 고밀도 · rack당 4대", racks: 4, perRack: 4, color: "#2563eb" },
  { key: "ac", title: "AC 저밀도 · rack당 2대", racks: 8, perRack: 2, color: "#0f766e" },
] as const;

const BARS = [
  { layout: 0, label: "DC rack 평균", value: 58, calc: "4×14.5" },
  { layout: 0, label: "DC rack 피크", value: 76, calc: "4×19" },
  { layout: 1, label: "AC rack 평균", value: 30, calc: "2×15" },
  { layout: 1, label: "AC rack 피크", value: 39.4, calc: "2×19.7" },
] as const;

const SCENES = [
  {
    label: "DC 고밀도: rack당 4대",
    summary: "rack 4개 · rack당 58 / 76kW",
    focus: 0,
    note: "16대를 4대씩 넣으면 compute rack은 4개입니다. DC busbar 기준 대당 평균 14.5kW, 피크 19kW이므로 rack 하나가 4×14.5=58kW, 4×19=76kW를 받습니다.",
  },
  {
    label: "AC 저밀도: rack당 2대",
    summary: "rack 8개 · rack당 30 / 39.4kW",
    focus: 1,
    note: "같은 16대를 2대씩 넣으면 rack이 8개입니다. AC rack PDU 기준 대당 값은 15kW·19.7kW로 DC안과 다르고, rack당 2×15=30kW, 2×19.7=39.4kW입니다.",
  },
  {
    label: "현장이 rack당 30~40kW만 받는다면",
    summary: "76kW 피크 → 4대 rack 불가",
    focus: 2,
    note: "4절의 예처럼 기존 전산실이 rack당 30~40kW만 받으면 고밀도안의 76kW 피크는 띠를 훌쩍 넘습니다. 저밀도안의 39.4kW 피크는 띠 안이지만 위쪽 끝에 붙어 있어, 현장이 실제로 보장하는 값을 확인해야 합니다.",
  },
] as const;

function RackRow({ layoutIndex, dim }: { layoutIndex: number; dim: boolean }) {
  const layout = LAYOUTS[layoutIndex];
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-35" : ""}`}>
      <p className="text-xs font-semibold" style={{ color: layout.color }}>
        {layout.title} → rack {layout.racks}개
      </p>
      <div className="mt-2 grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }, (_, rack) => {
          const exists = rack < layout.racks;
          return (
            <div key={rack} className="flex min-w-0 flex-col items-center gap-1">
              <div
                className={`flex h-[2.6rem] w-full max-w-[2.75rem] flex-col justify-end gap-0.5 rounded-md border p-1 ${
                  exists ? "border-border bg-background" : "border-dashed border-border/30"
                }`}
              >
                {exists &&
                  Array.from({ length: layout.perRack }, (_, slot) => (
                    <div key={slot} className="h-[0.4rem] rounded-sm" style={{ backgroundColor: layout.color, opacity: 0.8 }} />
                  ))}
              </div>
              <span className={`text-[10px] ${exists ? "text-muted-foreground" : "text-muted-foreground/30"}`}>R{rack + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RackDensityViz() {
  return (
    <SceneShell
      eyebrow="같은 16대, 다른 rack 수"
      title="서버 16대를 rack에 몇 대씩 넣느냐가 rack당 kW를 정합니다"
      description="작은 칸 하나가 B300 서버 한 대입니다. 아래 막대는 rack 하나가 받는 전력(kW)이며, 3절의 NVIDIA 공개 planning 값(25°C 공급 공기 기준 추정)을 그대로 곱했습니다. 스위치·스토리지·냉각 장치 전력은 들어 있지 않습니다."
      ariaLabel="16대를 rack당 4대로 넣은 DC 고밀도안과 2대로 넣은 AC 저밀도안의 rack 수와 rack당 전력 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showBand = scene.focus === 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <RackRow layoutIndex={0} dim={scene.focus === 1} />
              <RackRow layoutIndex={1} dim={scene.focus === 0} />
            </div>
            <div className="space-y-2">
              {BARS.map((bar) => {
                const layout = LAYOUTS[bar.layout];
                const lit = scene.focus === 2 ? bar.label.endsWith("피크") : scene.focus === bar.layout;
                const over = showBand && lit && bar.value > BAND_HIGH;
                return (
                  <div key={bar.label} className={`grid grid-cols-[5.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-[6.5rem_minmax(0,1fr)_5rem] sm:text-sm ${lit ? "" : "opacity-35"}`}>
                    <span className="font-semibold">{bar.label}</span>
                    <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                      {showBand && (
                        <div
                          className="absolute inset-y-[-3px] border-x border-dashed border-amber-600"
                          style={{ left: `${(BAND_LOW / SCALE_MAX) * 100}%`, width: `${((BAND_HIGH - BAND_LOW) / SCALE_MAX) * 100}%`, backgroundColor: "#d9770622" }}
                        />
                      )}
                      <div
                        className="relative h-full rounded-sm"
                        style={{ width: `${(bar.value / SCALE_MAX) * 100}%`, backgroundColor: over ? "#dc2626" : layout.color }}
                      />
                    </div>
                    <span className={`text-right font-mono ${over ? "font-bold text-red-700 dark:text-red-400" : ""}`}>
                      {bar.value}kW
                      <span className="block text-[10px] font-normal text-muted-foreground">{bar.calc}</span>
                    </span>
                  </div>
                );
              })}
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.25rem] gap-2 text-[10px] text-muted-foreground sm:grid-cols-[6.5rem_minmax(0,1fr)_5rem]">
                <span />
                <div className="relative h-4">
                  {[0, 20, 40, 60, 80].map((tick) => (
                    <span key={tick} className="absolute -translate-x-1/2" style={{ left: `${(tick / SCALE_MAX) * 100}%` }}>
                      {tick}
                    </span>
                  ))}
                </div>
                <span className="text-right">kW</span>
              </div>
              <p className={`text-xs ${showBand ? "text-amber-700 dark:text-amber-400" : "text-transparent"}`} aria-hidden={!showBand}>
                점선 띠 = 현장이 rack당 받는 전력 30~40kW (4절의 예)
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
