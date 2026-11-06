import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — z=100x(가정). (x,y)=(2,−1)은 (z,y)=(200,−1).
 * 기울기 (4,3) → (0.04,3). 4×0.01 = 0.04×1 = 0.04.
 */
interface BarRow {
  label: string;
  value: number;
  text: string;
  color: string;
}
interface Scene {
  label: string;
  summary: string;
  note: string;
  activeRuler: "x" | "z" | "both";
  bars: readonly BarRow[];
}

const X_BAR: BarRow = { label: "x 쪽 성분", value: 4, text: "4", color: "#2563eb" };
const Z_BAR: BarRow = { label: "z 쪽 성분", value: 0.04, text: "0.04", color: "#d97706" };
const Y_BAR: BarRow = { label: "y 쪽 성분", value: 3, text: "3", color: "#64748b" };

const SCENES: readonly Scene[] = [
  { label: "x로 적을 때", summary: "4 × 0.01 = 0.04", activeRuler: "x", bars: [X_BAR, Y_BAR], note: "표시된 구간은 x가 2에서 2.01로 가는 이동입니다. 기울기 (4,3)에서 x 쪽 성분이 y 쪽보다 크고, 성분에 이동을 곱한 1차 변화는 0.04입니다." },
  { label: "z = 100x로 적을 때", summary: "0.04 × 1 = 0.04", activeRuler: "z", bars: [Z_BAR, Y_BAR], note: "같은 구간을 z로 적으면 200에서 201로 가는 1 이동입니다. 같은 위치의 기울기는 (0.04,3)이고 1차 변화는 똑같이 0.04입니다." },
  { label: "크기 순서가 뒤집힙니다", summary: "4 > 3 → 0.04 < 3", activeRuler: "both", bars: [X_BAR, Z_BAR, Y_BAR], note: "함수는 그대로인데 성분의 크기 순서만 바뀌었습니다. 단위를 맞춰 재척도화하거나 이동 거리를 재는 기준을 명시해야 두 방향을 같은 기준으로 비교할 수 있습니다." },
];

function Ruler({ name, start, end, active }: { name: string; start: string; end: string; active: boolean }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2">
      <span className={`font-mono text-sm font-bold ${active ? "text-[#2563eb]" : "text-muted-foreground"}`}>{name}</span>
      <div className="relative h-11">
        <span className="absolute inset-x-0 top-3 border-t border-[#94a3b8]" />
        <span className={`absolute top-[0.45rem] h-2.5 rounded-sm ${active ? "bg-[#2563eb]" : "bg-[#cbd5e1]"}`} style={{ left: "25%", width: "50%" }} />
        <span className={`absolute top-6 -translate-x-1/2 font-mono text-xs ${active ? "font-bold" : "text-muted-foreground"}`} style={{ left: "25%" }}>{start}</span>
        <span className={`absolute top-6 -translate-x-1/2 font-mono text-xs ${active ? "font-bold" : "text-muted-foreground"}`} style={{ left: "75%" }}>{end}</span>
      </div>
    </div>
  );
}

export default function UnitRescaleViz() {
  return (
    <SceneShell
      eyebrow="단위와 기울기"
      title="같은 이동을 다른 눈금으로 적으면 성분이 달라집니다"
      description="가정 f=x²+3y의 같은 위치를 두 눈금으로 적었습니다. 위의 표시 구간은 입력 평면에서 같은 이동이고, 아래 막대는 기울기 성분입니다."
      ariaLabel="x와 z 눈금에서 같은 이동과 기울기 성분 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <Ruler name="x" start="2" end="2.01" active={scene.activeRuler !== "z"} />
            <Ruler name="z" start="200" end="201" active={scene.activeRuler !== "x"} />
            <div className="mt-3 min-h-[5.75rem] space-y-2">
              {scene.bars.map((bar) => (
                <div key={bar.label} className="grid grid-cols-[4.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full min-w-[2px] rounded-sm" style={{ width: `${(bar.value / 4) * 100}%`, backgroundColor: bar.color }} />
                  </div>
                  <span className="text-right font-mono font-bold">{bar.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
