import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 300 µs 거래를 처리 함수 안에 넣을 때와 넘길 때를 같은 축에서 비교한다.
 * 함수가 잡는 시간: 안에 넣으면 20+300=320, 넘기면 20. 넘겨도 20+40+300+80=440이 마감 계산에 들어간다(앞 53과 합쳐 493).
 */
const AXIS = 440;
type Bar = { from: number; us: number; text: string; color: string };

const ISR = "#64748b";
const WORK = "#2563eb";

const SCENES = [
  {
    label: "거래까지 함수 안에서",
    summary: "함수가 잡는 시간 20+300 = 320 µs",
    fn: [{ from: 0, us: 20, text: "", color: ISR }, { from: 20, us: 300, text: "센서 거래 300", color: "#d97706" }],
    work: [],
    held: 320,
    total: null,
    note: "처리 함수 안에서 300 µs의 센서 거래까지 기다리면 그동안 낮은 우선순위의 다른 사건이 더 오래 기다릴 수 있습니다. 이 장면의 뒤 구간은 비교에서 뺐습니다.",
  },
  {
    label: "접수만 하고 넘김",
    summary: "함수가 잡는 시간 20 µs",
    fn: [{ from: 0, us: 20, text: "", color: ISR }],
    work: [{ from: 20, us: 40, text: "", color: "#94a3b8" }, { from: 60, us: 300, text: "거래 300", color: WORK }, { from: 360, us: 80, text: "80", color: "#1d4ed8" }],
    held: 20,
    total: null,
    note: "20 µs 안에 접수하고 일반 작업으로 넘깁니다. 작업 깨우기 40 µs와 거래·계산은 일반 작업 줄로 옮겨 갑니다.",
  },
  {
    label: "넘겨도 시간은 사라지지 않습니다",
    summary: "20+40+300+80 = 440 µs",
    fn: [{ from: 0, us: 20, text: "", color: ISR }],
    work: [{ from: 20, us: 40, text: "", color: "#94a3b8" }, { from: 60, us: 300, text: "거래 300", color: WORK }, { from: 360, us: 80, text: "80", color: "#1d4ed8" }],
    held: 20,
    total: 440,
    note: "넘겼다는 말은 끝냈다는 뜻이 아닙니다. 접수 앞의 53 µs와 합치면 53+440=493 µs이고, 이 전체가 마감 계산에 들어갑니다.",
  },
] satisfies readonly { label: string; summary: string; fn: readonly Bar[]; work: readonly Bar[]; held: number; total: number | null; note: string }[];

const pct = (us: number) => `${(us / AXIS) * 100}%`;
const ROW = "grid grid-cols-[5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs";

function Lane({ label, bars }: { label: string; bars: readonly Bar[] }) {
  return (
    <div className={ROW}>
      <span>{label}</span>
      <div className="relative h-7 min-w-0 rounded-sm bg-muted/40">
        {bars.map((bar) => (
          <div
            key={bar.from}
            className="absolute inset-y-0 flex items-center justify-center overflow-hidden whitespace-nowrap rounded-sm text-[11px] font-semibold text-white"
            style={{ left: pct(bar.from), width: pct(bar.us), backgroundColor: bar.color }}
          >
            {bar.text}
          </div>
        ))}
      </div>
      <span />
    </div>
  );
}

export default function ShortIsrViz() {
  return (
    <SceneShell
      eyebrow="접수 시작부터의 시간 · 가정값"
      title="거래를 어디서 기다리느냐에 따라 함수가 잡는 시간이 달라집니다"
      description="우선순위는 먼저 처리할 차례를 정하는 값입니다. 윗줄은 처리 함수, 가운데 줄은 일반 작업입니다. 맨 앞 짧은 회색 칸이 접수 20 µs, 일반 작업의 옅은 칸이 깨우기 40 µs, 끝 칸이 계산 80 µs입니다."
      ariaLabel="센서 거래를 처리 함수 안에 넣을 때와 일반 작업으로 넘길 때 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <Lane label="처리 함수" bars={scene.fn} />
            <Lane label="일반 작업" bars={scene.work} />
            <div className={ROW}>
              <span className="font-bold">함수가 잡는 시간</span>
              <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                <div className="absolute inset-y-0 left-0 rounded-sm border" style={{ width: pct(scene.held), borderColor: "#d97706", backgroundColor: "#d9770622" }} />
              </div>
              <span className="text-right font-mono font-bold">{scene.held}</span>
            </div>
            <div className={ROW}>
              <span className={scene.total === null ? "text-muted-foreground/50" : "font-bold"}>마감 계산에 드는 시간</span>
              <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                {scene.total !== null && <div className="absolute inset-y-0 left-0 rounded-sm border" style={{ width: pct(scene.total), borderColor: WORK, backgroundColor: "#2563eb22" }} />}
              </div>
              <span className={`text-right font-mono font-bold ${scene.total === null ? "invisible" : ""}`}>{scene.total ?? AXIS}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
