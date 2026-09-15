import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: multiplier 절 — 도는 비율이 승수를 정하고 새는 곳이 그것을 깎는다 */
const SCENES = [
  "도는 비율이 불어나는 크기를 정합니다",
  "바퀴마다 얼마씩 남는지 봅니다",
  "새는 곳이 있으면 덜 돕니다",
  "같은 충격인데 결과가 절반입니다",
] as const;

/** 소득이 1 늘 때 다시 쓰는 몫 */
const RATES = [0.5, 0.8, 0.9] as const;
const BASE = 0.8;
/** 다시 쓰는 것 가운데 밖으로 나가는 몫 */
const IMPORT_SHARE = 0.2;
const DOMESTIC = BASE * (1 - IMPORT_SHARE);
/** 처음 주어지는 충격 */
const SHOCK = 10;

const mult = (c: number) => 1 / (1 - c);
const ROUNDS = [0, 1, 2, 3, 4, 5].map((i) => SHOCK * BASE ** i);
const CUMS = ROUNDS.map((_, i) =>
  ROUNDS.slice(0, i + 1).reduce((a, b) => a + b, 0),
);

const n = (v: number) => (Math.round(v * 10) / 10).toString();
const n2 = (v: number) => (Math.round(v * 100) / 100).toString();

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 130;

export default function MultiplierLeakViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `소득이 1 늘 때 다시 쓰는 몫을 절반으로 두면 불어나는 크기가 ${n(mult(0.5))}배이고, ${BASE}으로 두면 ${n(mult(BASE))}배, ${RATES[2]}로 두면 ${n(mult(RATES[2]))}배입니다. 다시 쓰는 몫이 1에 가까워질수록 이 크기가 가파르게 커집니다.`,
    `${BASE}인 경우를 바퀴별로 보겠습니다. 처음 ${SHOCK}이 주어지면 다음 바퀴에 ${n(ROUNDS[1])}, 그다음에 ${n(ROUNDS[2])}, ${n(ROUNDS[3])}이 이어집니다. 여섯 바퀴까지 더하면 ${n(CUMS[5])}이고, 끝까지 가면 ${n(SHOCK * mult(BASE))}에서 멈춥니다.`,
    `그런데 다시 쓰는 것이 전부 안에서 돌지는 않습니다. 쓰는 것 가운데 ${Math.round(IMPORT_SHARE * 100)}퍼센트가 밖에서 만든 물건이라면 안에서 도는 몫은 ${BASE} 곱하기 ${1 - IMPORT_SHARE}인 ${n2(DOMESTIC)}입니다. 세금도 저축도 같은 자리에서 샙니다.`,
    `그러면 불어나는 크기가 ${n(mult(BASE))}배에서 ${n(mult(DOMESTIC))}배로 내려갑니다. 같은 ${SHOCK}이 ${n(SHOCK * mult(BASE))}이 되는 대신 ${n(SHOCK * mult(DOMESTIC))}이 됩니다. 새는 자리가 어디에 얼마나 있는지를 모르면 이 숫자를 낼 수 없습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="한 번이 몇 번이 되는가"
      title="한 번의 지출은 도는 비율만큼 불어나고 새는 만큼 깎입니다"
      description="다시 쓰이는 몫이 클수록 크게 불어나고, 그 가운데 밖으로 나가는 몫이 있으면 그만큼 일찍 멈춥니다."
      note="값과 이자율이 움직이지 않고 다시 쓰는 몫이 소득 구간마다 같다고 둔 계산입니다. 실제로는 둘 다 움직입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="도는 비율과 새는 곳이 정하는 크기"
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
              {s === 0 && (
                <>
                  <text x={14} y={30} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    다시 쓰는 몫
                  </text>
                  {RATES.map((c, i) => (
                    <text
                      key={`c${i}`}
                      x={X0 + i * 96}
                      y={30}
                      fontSize={10.5}
                      fontWeight={700}
                      fill={c === BASE ? ACCENT : MUTED}
                    >
                      {c}
                    </text>
                  ))}

                  <text x={14} y={64} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    안 도는 몫
                  </text>
                  {RATES.map((c, i) => (
                    <text
                      key={`l${i}`}
                      x={X0 + i * 96}
                      y={64}
                      fontSize={10}
                      fontWeight={700}
                      fill={MUTED}
                    >
                      {n(1 - c)}
                    </text>
                  ))}

                  <line
                    x1={14}
                    y1={80}
                    x2={456}
                    y2={80}
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeOpacity={0.4}
                  />

                  <text x={14} y={108} fontSize={8.5} fontWeight={700} fill={OK}>
                    불어나는 크기
                  </text>
                  {RATES.map((c, i) => (
                    <text
                      key={`m${i}`}
                      x={X0 + i * 96}
                      y={108}
                      fontSize={12}
                      fontWeight={700}
                      fill={c === BASE ? OK : MUTED}
                    >
                      {n(mult(c))}배
                    </text>
                  ))}

                  <text x={14} y={140} fontSize={9} fontWeight={700} fill={OK}>
                    안 도는 몫의 역수입니다 · 그 몫이 작아질수록 가파르게 커집니다
                  </text>
                </>
              )}

              {s >= 1 && s <= 1 && (
                <>
                  <text x={14} y={30} fontSize={8} fontWeight={700} fill={MUTED}>
                    몇째 바퀴
                  </text>
                  {ROUNDS.map((_, i) => (
                    <text
                      key={`h${i}`}
                      x={110 + i * 58}
                      y={30}
                      fontSize={8}
                      fontWeight={700}
                      fill={MUTED}
                    >
                      {i + 1}째
                    </text>
                  ))}

                  <text x={14} y={60} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                    그 바퀴의 금액
                  </text>
                  {ROUNDS.map((v, i) => (
                    <text
                      key={`r${i}`}
                      x={110 + i * 58}
                      y={60}
                      fontSize={10.5}
                      fontWeight={700}
                      fill={ACCENT}
                    >
                      {n(v)}
                    </text>
                  ))}

                  <text x={14} y={90} fontSize={8.5} fontWeight={700} fill={OK}>
                    거기까지 합
                  </text>
                  {CUMS.map((v, i) => (
                    <text
                      key={`u${i}`}
                      x={110 + i * 58}
                      y={90}
                      fontSize={10}
                      fontWeight={700}
                      fill={OK}
                    >
                      {n(v)}
                    </text>
                  ))}

                  <line
                    x1={14}
                    y1={106}
                    x2={456}
                    y2={106}
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeOpacity={0.4}
                  />

                  <text x={14} y={134} fontSize={9} fontWeight={700} fill={OK}>
                    끝까지 가면 {n(SHOCK * mult(BASE))}에서 멈춥니다 · 여섯 바퀴에 이미 {n(CUMS[5])}입니다
                  </text>
                </>
              )}

              {s >= 2 && (
                <>
                  <text x={14} y={30} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    다시 쓰는 몫
                  </text>
                  <text x={X0} y={30} fontSize={10.5} fontWeight={700} fill={ACCENT}>
                    {BASE}
                  </text>

                  <text x={14} y={58} fontSize={8.5} fontWeight={700} fill={WARN}>
                    그중 밖으로 나가는
                  </text>
                  <text x={X0} y={58} fontSize={10.5} fontWeight={700} fill={WARN}>
                    {IMPORT_SHARE}
                  </text>
                  <text x={X0 + 66} y={58} fontSize={8.5} fill={MUTED}>
                    밖에서 만든 물건을 사는 몫입니다
                  </text>

                  <text x={14} y={86} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    안에서 도는 몫
                  </text>
                  <text x={X0} y={86} fontSize={10.5} fontWeight={700} fill={OK}>
                    {BASE} &times; {1 - IMPORT_SHARE} = {n2(DOMESTIC)}
                  </text>

                  <line
                    x1={14}
                    y1={102}
                    x2={456}
                    y2={102}
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeOpacity={0.4}
                  />

                  <text x={14} y={130} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    불어나는 크기
                  </text>
                  <text x={X0} y={130} fontSize={11} fontWeight={700} fill={MUTED}>
                    {n(mult(BASE))}배
                  </text>
                  <text x={X0 + 56} y={130} fontSize={11} fontWeight={700} fill={MUTED}>
                    &rarr;
                  </text>
                  <text x={X0 + 88} y={130} fontSize={11} fontWeight={700} fill={WARN}>
                    {n(mult(DOMESTIC))}배
                  </text>

                  {s === 3 && (
                    <>
                      <text x={14} y={158} fontSize={8.5} fontWeight={700} fill={MUTED}>
                        같은 {SHOCK}이 낳는 것
                      </text>
                      <text x={X0} y={158} fontSize={11} fontWeight={700} fill={MUTED}>
                        {n(SHOCK * mult(BASE))}
                      </text>
                      <text x={X0 + 56} y={158} fontSize={11} fontWeight={700} fill={MUTED}>
                        &rarr;
                      </text>
                      <text x={X0 + 88} y={158} fontSize={11} fontWeight={700} fill={WARN}>
                        {n(SHOCK * mult(DOMESTIC))}
                      </text>
                    </>
                  )}
                </>
              )}

              <text
                x={14}
                y={182}
                fontSize={9}
                fontWeight={700}
                fill={s >= 2 ? WARN : OK}
              >
                {s === 3
                  ? "새는 자리가 어디에 얼마나 있는지를 모르면 이 숫자를 낼 수 없습니다"
                  : s === 2
                    ? "세금도 저축도 같은 자리에서 샙니다"
                    : s === 1
                      ? "한 바퀴마다 같은 비율로 작아지므로 합이 유한합니다"
                      : "이 크기는 불어나는 속도가 아니라 멈추는 자리입니다"}
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
