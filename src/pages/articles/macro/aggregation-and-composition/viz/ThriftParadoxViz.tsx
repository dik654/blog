import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: spending-is-income·thrift 절 — 다 같이 아끼면 아껴지지 않는다 */
const SCENES = [
  "처음에는 이만큼이 돕니다",
  "모두가 10씩 덜 쓰기로 합니다",
  "그 10은 누군가의 소득이었습니다",
  "소득은 50 줄고 저축은 그대로입니다",
] as const;

/** 소득이 1 늘 때 다시 쓰는 몫 */
const C_RATE = 0.8;
/** 소득과 무관하게 쓰는 몫 */
const AUTO_BEFORE = 20;
const AUTO_AFTER = 10;
/** 소득과 무관하게 결정되는 투자 */
const INVEST = 30;

const solve = (auto: number) => {
  const income = (auto + INVEST) / (1 - C_RATE);
  const spend = C_RATE * income + auto;
  return { income, spend, save: income - spend };
};

const BEFORE = solve(AUTO_BEFORE);
const AFTER = solve(AUTO_AFTER);
const CUT = AUTO_BEFORE - AUTO_AFTER;
const ROUNDS = [0, 1, 2, 3, 4].map((i) => CUT * C_RATE ** i);
const CUMS = ROUNDS.map((_, i) =>
  ROUNDS.slice(0, i + 1).reduce((a, b) => a + b, 0),
);
const TOTAL = CUT / (1 - C_RATE);

const n = (v: number) => (Math.round(v * 10) / 10).toString();
const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 68;
const X0 = 150;

export default function ThriftParadoxViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `한 해 동안 도는 돈을 ${n(BEFORE.income)}이라 하겠습니다. 그중 ${n(BEFORE.spend)}이 다시 쓰이고 ${n(BEFORE.save)}이 남습니다. 남은 ${n(BEFORE.save)}은 투자로 쓰이는 ${INVEST}과 같은데, 쓰이지 않은 것이 갈 곳은 그것뿐이기 때문입니다.`,
    `이제 모두가 앞날이 걱정되어 ${CUT}씩 덜 쓰기로 합니다. 각자에게는 옳은 판단입니다. 덜 쓰면 더 남으니까요. 그런데 이 시장에는 앞 글들에 없던 것이 하나 있습니다. 내가 쓰지 않은 ${CUT}은 누군가가 받지 못한 ${CUT}입니다.`,
    `그래서 첫 바퀴에 ${n(ROUNDS[0])}이 빠지고, 그만큼 소득이 준 사람이 다음 바퀴에 ${n(ROUNDS[1])}을 덜 씁니다. 그다음이 ${n(ROUNDS[2])}, ${n(ROUNDS[3])}입니다. 바퀴가 다 돌면 ${n(TOTAL)}이 빠집니다.`,
    `결과는 소득 ${n(BEFORE.income)}이 ${n(AFTER.income)}으로 줄어든 것입니다. 그런데 남는 것은 ${n(BEFORE.save)}에서 ${n(AFTER.save)}으로 하나도 달라지지 않았습니다. 비율로는 ${pct(BEFORE.save / BEFORE.income)}에서 ${pct(AFTER.save / AFTER.income)}으로 올랐는데 금액은 그대로입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="전부 합치면"
      title="각자 아끼면 남지만 다 같이 아끼면 소득이 줄어듭니다"
      description="내가 쓰지 않은 만큼이 남이 받지 못한 만큼이라, 모두가 동시에 아끼면 아껴지는 대신 소득이 줄어듭니다."
      note="소득이 1 늘 때 0.8을 다시 쓰고 투자가 소득과 무관하게 정해진다고 둔 계산입니다. 값과 이자율은 움직이지 않는다고 두었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="다 같이 아낄 때의 소득과 저축"
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
              {s !== 2 && (
                <>
                  <text x={X0} y={26} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    아끼기 전
                  </text>
                  <text
                    x={X0 + COL * 1.6}
                    y={26}
                    fontSize={8.5}
                    fontWeight={700}
                    fill={s === 3 ? WARN : MUTED}
                    fillOpacity={s === 3 ? 1 : 0.3}
                  >
                    아낀 뒤
                  </text>

                  {[
                    ["한 해 도는 소득", BEFORE.income, AFTER.income],
                    ["그중 다시 쓰이는", BEFORE.spend, AFTER.spend],
                    ["남는 것", BEFORE.save, AFTER.save],
                    ["투자로 쓰이는", INVEST, INVEST],
                  ].map(([label, a, b], r) => (
                    <g key={r as number}>
                      <text
                        x={14}
                        y={52 + r * 24}
                        fontSize={8.5}
                        fontWeight={700}
                        fill={MUTED}
                      >
                        {label as string}
                      </text>
                      <text
                        x={X0}
                        y={52 + r * 24}
                        fontSize={10.5}
                        fontWeight={700}
                        fill={ACCENT}
                      >
                        {n(a as number)}
                      </text>
                      <text
                        x={X0 + COL * 1.6}
                        y={52 + r * 24}
                        fontSize={10.5}
                        fontWeight={700}
                        fill={s === 3 ? (r === 2 ? OK : WARN) : MUTED}
                        fillOpacity={s === 3 ? 1 : 0.2}
                      >
                        {n(b as number)}
                      </text>
                    </g>
                  ))}
                </>
              )}

              {s === 2 && (
                <>
                  <text x={14} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                    몇째 바퀴
                  </text>
                  {ROUNDS.map((_, i) => (
                    <text
                      key={`h${i}`}
                      x={110 + i * 66}
                      y={26}
                      fontSize={8}
                      fontWeight={700}
                      fill={MUTED}
                    >
                      {i + 1}째
                    </text>
                  ))}

                  <text x={14} y={56} fontSize={8.5} fontWeight={700} fill={WARN}>
                    덜 쓰이는 금액
                  </text>
                  {ROUNDS.map((v, i) => (
                    <text
                      key={`r${i}`}
                      x={110 + i * 66}
                      y={56}
                      fontSize={10.5}
                      fontWeight={700}
                      fill={WARN}
                    >
                      {n(v)}
                    </text>
                  ))}

                  <text x={14} y={86} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    거기까지 합
                  </text>
                  {CUMS.map((v, i) => (
                    <text
                      key={`c${i}`}
                      x={110 + i * 66}
                      y={86}
                      fontSize={10}
                      fontWeight={700}
                      fill={MUTED}
                    >
                      {n(v)}
                    </text>
                  ))}

                  <line
                    x1={14}
                    y1={102}
                    x2={456}
                    y2={102}
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeOpacity={0.4}
                  />

                  <text x={14} y={126} fontSize={9} fontWeight={700} fill={WARN}>
                    바퀴가 다 돌면 {n(TOTAL)}이 빠집니다 · 처음 줄인 것은 {CUT}뿐이었습니다
                  </text>
                  <text x={14} y={150} fontSize={8.5} fill={MUTED}>
                    한 바퀴마다 {C_RATE}씩 작아지므로 {CUT}을 {n(1 - C_RATE)}로 나눈 만큼에서 멈춥니다
                  </text>
                </>
              )}

              <text
                x={14}
                y={176}
                fontSize={9}
                fontWeight={700}
                fill={s === 3 ? WARN : s === 2 ? MUTED : OK}
              >
                {s === 3
                  ? `소득은 ${n(TOTAL)} 줄었는데 남는 것은 ${n(BEFORE.save)} 그대로입니다`
                  : s === 2
                    ? "내가 쓰지 않은 만큼이 남이 받지 못한 만큼입니다"
                    : s === 1
                      ? `각자에게는 옳은 판단입니다 · 덜 쓰면 더 남습니다`
                      : `남는 것 ${n(BEFORE.save)}은 투자로 쓰이는 ${INVEST}과 같습니다`}
              </text>

              <text x={14} y={194} fontSize={8.5} fill={MUTED}>
                {s === 3
                  ? `비율로는 ${pct(BEFORE.save / BEFORE.income)}에서 ${pct(AFTER.save / AFTER.income)}으로 올랐습니다`
                  : "쓰이지 않은 것이 갈 곳은 투자뿐입니다"}
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
