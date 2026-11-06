import SceneShell from "./SceneShell";

/**
 * 본문 대응: #excluding — 입어료 4를 받으면 들어오는 문턱이 4에서 8로 올라 네 척에서 멈춘다.
 * 한 척이 건지는 값 = 12 − B. 걷힌 입어료 = 4척 × 4 = 16.
 */
const BOATS = [1, 2, 3, 4, 5, 6, 7, 8];
const perBoat = (boats: number) => 12 - boats;
const BOAT_COST = 4;
const FEE = 4;

const W = 360;
const H = 170;
const LEFT = 62;
const RIGHT = 6;
const TOP = 16;
const BASE = 148;
const Y_MAX = 12;
const STEP = (W - LEFT - RIGHT) / BOATS.length;
const BAR = 26;
const y = (value: number) => BASE - (value / Y_MAX) * (BASE - TOP);

const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#94a3b8";
const LABEL = "#64748b";

const SCENES = [
  { label: "입어료가 없으면", summary: "문턱 4 → 여덟 척", threshold: BOAT_COST, entered: 8, note: "배 값 4가 문턱입니다. 4 이상을 건지는 한 들어올 이유가 있으므로 여덟 척까지 옵니다." },
  { label: "한 척에 4를 받으면", summary: "문턱 4 + 4 = 8 → 네 척", threshold: BOAT_COST + FEE, entered: 4, note: "한 척이 건지는 값에서 배 값 4와 입어료 4를 빼고 남아야 들어옵니다. 네 척이면 8 − 8 = 0이고, 다섯 척이면 7이라 모자라 멈춥니다. 맞는 척수와 같습니다." },
  { label: "걷힌 입어료", summary: "4척 × 4 = 16", threshold: BOAT_COST + FEE, entered: 4, note: "걷힌 16은 호수가 네 척일 때 남기던 16, 여덟 척까지 가면서 사라졌던 그 16입니다." },
] as const;

export default function EntryFeeStopViz() {
  return (
    <SceneShell
      eyebrow="빼놓을 수 있게 되면"
      title="입어료는 들어오는 문턱을 8로 올려 네 척에서 멈추게 합니다"
      description="입어료는 호수 주인이 배 한 척을 들여보내며 받는 값입니다. 막대는 배가 그 척수일 때 한 척이 건지는 값이고, 문턱은 들어오려면 건져야 하는 값입니다. 막대가 문턱 이상이면 그 척수까지 들어옵니다."
      note="본문의 예대로 주인을 정하고 배 한 척에 4씩 받는다고 둔 계산입니다."
      ariaLabel="입어료 유무에 따른 들어오는 배의 수와 걷힌 입어료"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div key={scene} className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${item.label}: ${item.summary}`}>
              {BOATS.map((boats, index) => {
                const inside = boats <= item.entered;
                const value = perBoat(boats);
                const bx = LEFT + index * STEP + (STEP - BAR) / 2;
                return (
                  <g key={boats}>
                    <rect
                      x={bx}
                      y={y(value)}
                      width={BAR}
                      height={BASE - y(value)}
                      rx={2}
                      fill={inside ? BLUE : "none"}
                      fillOpacity={inside ? 0.85 : 0}
                      stroke={inside ? BLUE : SLATE}
                      strokeWidth={1}
                      strokeDasharray={inside ? undefined : "3 3"}
                    />
                    <text x={bx + BAR / 2} y={BASE - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={inside ? "#ffffff" : LABEL}>{value}</text>
                    <text x={bx + BAR / 2} y={BASE + 15} textAnchor="middle" fontSize={12} fill={LABEL}>{boats}척</text>
                  </g>
                );
              })}
              <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke={SLATE} strokeWidth={1} />
              <line x1={LEFT - 4} x2={W - RIGHT} y1={y(BOAT_COST)} y2={y(BOAT_COST)} stroke={item.threshold === BOAT_COST ? AMBER : SLATE} strokeWidth={item.threshold === BOAT_COST ? 1.25 : 1} />
              <text x={LEFT - 8} y={y(BOAT_COST) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={item.threshold === BOAT_COST ? AMBER : LABEL}>배 값 4</text>
              {item.threshold > BOAT_COST && (
                <g>
                  <line x1={LEFT - 4} x2={W - RIGHT} y1={y(item.threshold)} y2={y(item.threshold)} stroke={AMBER} strokeWidth={1.25} />
                  <text x={LEFT - 8} y={y(item.threshold) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>4 + 4 = 8</text>
                </g>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-4 gap-1.5" aria-label="네 척이 낸 입어료">
              {[0, 1, 2, 3].map((slot) => {
                const shown = scene === 2;
                const hidden = scene === 0;
                return (
                  <span
                    key={slot}
                    className={`rounded-lg border px-1 py-1.5 text-center text-xs leading-5 ${hidden ? "invisible" : shown ? "border-primary bg-background font-bold text-primary" : "border-border bg-background text-muted-foreground"}`}
                  >
                    배 {slot + 1} · {FEE}
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
