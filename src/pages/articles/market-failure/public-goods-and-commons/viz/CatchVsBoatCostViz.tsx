import SceneShell from "./SceneShell";

/**
 * 본문 대응: #congestion — 남던 16이 어디로 갔는가. 건진 값 T(B) = B(12 − B)와 배 값 4B의 간격이 남는 몫이다.
 * 4척 32−16=16, 5척 35−20=15, 6척 36−24=12, 8척 32−32=0.
 */
const COST = 4;
const catchAt = (boats: number) => boats * (12 - boats);
const costAt = (boats: number) => COST * boats;

const W = 360;
const H = 226;
const LEFT = 30;
const RIGHT = 16;
const TOP = 14;
const BASE = 196;
const Y_MAX = 40;
const x = (boats: number) => LEFT + (boats / 8) * (W - LEFT - RIGHT);
const y = (value: number) => BASE - (value / Y_MAX) * (BASE - TOP);
const BOATS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const SLATE = "#94a3b8";
const LABEL = "#64748b";
const BEST = 4;

const SCENES = [
  { label: "네 척", boats: 4, summary: "32 − 16 = 16", note: "한 척이 8을 건지니 네 척이 32를 건지고 배 값은 16입니다. 두 선의 간격이 호수가 남기는 것이고 여기서 16으로 가장 큽니다." },
  { label: "다섯 척", boats: 5, summary: "35 − 20 = 15", note: "건진 값은 3 늘지만 배 값이 4 늘어 간격이 15로 좁아집니다. 다섯째 배 자신은 7을 건지고 4를 써서 3이 남으니 들어옵니다." },
  { label: "여섯 척", boats: 6, summary: "36 − 24 = 12", note: "한 척이 6을 건져 건진 값이 36으로 가장 많은 자리입니다. 그래도 배 값을 빼면 12라 네 척의 16보다 적습니다." },
  { label: "여덟 척", boats: 8, summary: "32 − 32 = 0", note: "건진 값은 네 척일 때와 같은 32입니다. 배 값만 16에서 32로 두 배가 되어 간격이 0이 됩니다. 물고기 값이 줄어서가 아니라 배 값이 늘어서 사라진 것입니다." },
] as const;

const line = (pick: (boats: number) => number) => BOATS.map((boats) => `${x(boats)},${y(pick(boats))}`).join(" ");

function Stat({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-2 py-1.5 text-center">
      <span className="block text-xs text-muted-foreground">{name}</span>
      <span className="block font-mono text-base font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

export default function CatchVsBoatCostViz() {
  return (
    <SceneShell
      eyebrow="사라진 16"
      title="남던 몫은 물고기가 줄어서가 아니라 배 값이 늘어서 사라집니다"
      description="가로축이 배의 수, 위쪽 곡선이 호수 전체가 건진 값, 아래쪽 직선이 배 값의 합입니다. 두 선 사이의 간격이 호수가 남기는 것입니다."
      note="한 척이 12에서 척수를 뺀 만큼 건지고 배 한 척에 4가 든다고 둔 본문의 예입니다."
      ariaLabel="배의 수에 따른 호수 전체의 건진 값과 배 값 합계, 그 간격"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const boats = item.boats;
        const caught = catchAt(boats);
        const spent = costAt(boats);
        const net = caught - spent;
        return (
          <div key={scene} className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${item.label}: ${item.summary}`}>
              {[0, 16, 32].map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke={SLATE} strokeWidth={1} strokeOpacity={tick === 0 ? 1 : 0.35} />
                  <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill={LABEL}>{tick}</text>
                </g>
              ))}
              {BOATS.slice(1).map((value) => (
                <text key={value} x={x(value)} y={BASE + 15} textAnchor="middle" fontSize={12} fontWeight={value === boats ? 700 : 400} fill={value === boats ? BLUE : LABEL}>{value}</text>
              ))}
              <text x={W - RIGHT} y={BASE + 28} textAnchor="end" fontSize={12} fill={LABEL}>배의 수(척)</text>

              <polyline points={line(catchAt)} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <polyline points={line(costAt)} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <text x={x(0.25)} y={y(37)} fontSize={12} fontWeight={700} fill={BLUE}>건진 값</text>
              <text x={x(5.1)} y={y(12)} fontSize={12} fontWeight={700} fill={AMBER}>배 값의 합</text>

              {boats !== BEST && (
                <g>
                  <line x1={x(BEST)} x2={x(BEST)} y1={y(catchAt(BEST))} y2={y(costAt(BEST))} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
                  <text x={x(BEST) - 4} y={y(24) + 4} textAnchor="end" fontSize={12} fill={LABEL}>16</text>
                </g>
              )}
              {net > 0 && (
                <g>
                  <line x1={x(boats)} x2={x(boats)} y1={y(caught)} y2={y(spent)} stroke={GREEN} strokeWidth={1.25} />
                  <text x={x(boats) + 5} y={y((caught + spent) / 2) + 4} fontSize={12} fontWeight={700} fill={GREEN}>{net}</text>
                </g>
              )}
              <circle cx={x(boats)} cy={y(caught)} r={3.5} fill={BLUE} />
              <circle cx={x(boats)} cy={y(spent)} r={3.5} fill={net === 0 ? BLUE : AMBER} />
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Stat name="건진 값" value={caught} color={BLUE} />
              <Stat name="배 값의 합" value={spent} color={AMBER} />
              <Stat name="남는 것" value={net} color={GREEN} />
            </div>
          </div>
        );
      }}
    />
  );
}
