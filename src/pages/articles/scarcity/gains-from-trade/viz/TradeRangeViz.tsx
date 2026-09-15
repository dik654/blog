import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: trade-range 절의 ExplainedFormula — 두 기회비용 사이에서만 교환이 성립한다 */
const SCENES = [
  "1.5면 둘 다 남습니다",
  "0.8이면 나루가 거부합니다",
  "2.4면 가온이 거부합니다",
  "옮기는 값이 붙으면 구간이 줍니다",
] as const;

/** 케이크 한 개의 기회비용(빵 판) — 가온이 비싸고 나루가 싸다 */
const C_HIGH = 2;
const C_LOW = 1;
/** 한 번에 주고받는 케이크 개수 */
const Q = 2;

/** 장면마다의 교환 비율과 옮기는 데 드는 값 */
const CASES = [
  { x: 1.5, t: 0 },
  { x: 0.8, t: 0 },
  { x: 2.4, t: 0 },
  { x: 1.25, t: 0.5 },
] as const;

const gainHigh = (x: number, t: number) => Q * (C_HIGH - x - t);
const gainLow = (x: number) => Q * (x - C_LOW);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const num = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? `${r}` : `${r}`;
};
const signed = (v: number) => `${v > 0 ? "+" : ""}${num(v)}`;

/** 비율 0~3을 x좌표로 */
const AX0 = 70;
const AXW = 340;
const px = (r: number) => AX0 + (r / 3) * AXW;

export default function TradeRangeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const s = scenes.active;
  const { x, t } = CASES[s];
  const upper = C_HIGH - t;
  const gH = gainHigh(x, t);
  const gL = gainLow(x);
  const ok = gH > 0 && gL > 0;

  const NOTES = [
    `케이크 한 개를 빵 ${num(CASES[0].x)}판에 바꾸면 가온은 ${signed(gainHigh(CASES[0].x, 0))}판, 나루는 ${signed(gainLow(CASES[0].x))}판어치가 남습니다. 둘을 더한 ${num(Q * (C_HIGH - C_LOW))}판은 비율을 어디에 두든 변하지 않습니다. 비율은 이득의 크기가 아니라 나누는 몫만 정합니다.`,
    `빵 ${num(CASES[1].x)}판은 나루가 직접 만들 때의 값 ${num(C_LOW)}판보다 적습니다. 그 값에 넘기면 ${signed(gainLow(CASES[1].x))}판이라 직접 만드는 편이 나으므로 나루가 거부합니다. 가온에게는 더 좋은 조건이지만 성립하지 않습니다.`,
    `빵 ${num(CASES[2].x)}판은 가온이 직접 만들 때의 값 ${num(C_HIGH)}판을 넘습니다. 그 값에 사면 ${signed(gainHigh(CASES[2].x, 0))}판이라 직접 만드는 편이 나으므로 이번에는 가온이 거부합니다. 구간은 양쪽에서 막혀 있습니다.`,
    `옮기고 재고 지키는 데 케이크 한 개당 빵 ${num(CASES[3].t)}판이 든다고 하면 가온이 받아들일 수 있는 상한이 ${num(upper)}판으로 내려와 구간이 절반으로 줍니다. 이 값이 ${num(C_HIGH - C_LOW)}판을 넘으면 구간 자체가 사라집니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="어떤 비율에서 교환이 성립하는가"
      title="두 사람의 기회비용 사이에서만 교환이 성립합니다"
      description="그 구간 밖의 비율은 한쪽이 직접 만드는 편이 나아서 거부합니다."
      note="케이크 두 개를 한 번에 주고받는 경우로 고정한 예입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="교환이 성립하는 비율 구간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={AX0} y={22} fontSize={8.5} fontWeight={700} fill={MUTED}>
                케이크 한 개를 빵 몇 판에 바꾸는가
              </text>

              <rect
                x={px(C_LOW)}
                y={40}
                width={Math.max(px(upper) - px(C_LOW), 1)}
                height={22}
                fill={OK}
                fillOpacity={0.16}
                stroke={OK}
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              <line x1={AX0} y1={62} x2={AX0 + AXW} y2={62} stroke={MUTED} strokeWidth={1} />

              {[0, 1, 2, 3].map((r) => (
                <g key={r}>
                  <line x1={px(r)} y1={62} x2={px(r)} y2={67} stroke={MUTED} strokeWidth={0.75} />
                  <text x={px(r)} y={78} textAnchor="middle" fontSize={8} fill={MUTED}>
                    {r}판
                  </text>
                </g>
              ))}

              <text x={px(C_LOW)} y={36} textAnchor="middle" fontSize={8} fontWeight={700} fill={MUTED}>
                하한 {num(C_LOW)}
              </text>
              <text x={px(upper)} y={36} textAnchor="middle" fontSize={8} fontWeight={700} fill={MUTED}>
                상한 {num(upper)}
              </text>
              <text x={AX0 + AXW} y={22} textAnchor="end" fontSize={7.5} fill={MUTED}>
                {t > 0
                  ? `하한은 나루의 값 ${num(C_LOW)} · 상한은 가온의 값 ${num(C_HIGH)}에서 옮기는 값 ${num(t)}을 뺀 것`
                  : `하한은 나루의 값 · 상한은 가온의 값`}
              </text>

              <line x1={px(x)} y1={34} x2={px(x)} y2={70} stroke={ok ? OK : WARN} strokeWidth={1.25} />
              <circle cx={px(x)} cy={62} r={3.5} fill={ok ? OK : WARN} />
              <text
                x={px(x)}
                y={94}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={ok ? OK : WARN}
              >
                {num(x)}판
              </text>

              <text x={AX0} y={122} fontSize={8.5} fontWeight={700} fill={MUTED}>
                남는 것 (빵 판 기준)
              </text>
              {[
                { name: "가온", g: gH, formula: `${num(Q)} × (${num(C_HIGH)} − ${num(x)}${t > 0 ? ` − ${num(t)}` : ""})` },
                { name: "나루", g: gL, formula: `${num(Q)} × (${num(x)} − ${num(C_LOW)})` },
              ].map((row, i) => {
                const y = 140 + i * 20;
                return (
                  <g key={row.name}>
                    <text x={AX0} y={y} fontSize={9} fontWeight={700} fill={MUTED}>
                      {row.name}
                    </text>
                    <text x={AX0 + 36} y={y} fontSize={9} fill={MUTED}>
                      {row.formula}
                    </text>
                    <text
                      x={AX0 + 176}
                      y={y}
                      fontSize={10}
                      fontWeight={700}
                      fill={row.g > 0 ? OK : WARN}
                    >
                      {signed(row.g)}
                    </text>
                    <text
                      x={AX0 + 218}
                      y={y}
                      fontSize={8.5}
                      fontWeight={700}
                      fill={row.g > 0 ? OK : WARN}
                    >
                      {row.g > 0 ? "받아들입니다" : "거부합니다"}
                    </text>
                  </g>
                );
              })}
              <text x={AX0} y={182} fontSize={9} fontWeight={700} fill={ok ? ACCENT : WARN}>
                {ok
                  ? `둘을 더하면 ${num(gH + gL)}판이고, 이 값은 ${num(Q)} × (${num(C_HIGH)} − ${num(C_LOW)}${t > 0 ? ` − ${num(t)}` : ""})로 비율과 무관합니다`
                  : "한쪽이 거부하므로 교환이 일어나지 않습니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
