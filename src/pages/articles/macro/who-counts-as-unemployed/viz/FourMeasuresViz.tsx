import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: four-measures 절 — LU1~LU4. 정의는 19차 ICLS 결의 73항 (c) */
const SCENES = [
  "LU1은 실업자만 셉니다",
  "LU2는 더 일하고 싶은 사람을 더합니다",
  "LU3은 찾기를 그만둔 사람을 더합니다",
  "LU4는 셋을 다 더합니다",
] as const;

/** 앞 그림과 같은 100명 보기 */
const EMPLOYED = 60;
const UNEMPLOYED = 9;
/** 일은 하지만 시간이 모자라 더 일하고 싶은 사람 */
const UNDER_HOURS = 7;
/** 일하고 싶고 당장 가능하지만 찾기를 그만둔 사람 등 */
const POTENTIAL = 8;

const LF = EMPLOYED + UNEMPLOYED;
const EXT_LF = LF + POTENTIAL;

const MEASURES = [
  { id: "LU1", num: UNEMPLOYED, den: LF, parts: ["실업자"] },
  { id: "LU2", num: UNDER_HOURS + UNEMPLOYED, den: LF, parts: ["시간 모자람", "실업자"] },
  { id: "LU3", num: UNEMPLOYED + POTENTIAL, den: EXT_LF, parts: ["실업자", "잠재 노동력"] },
  {
    id: "LU4",
    num: UNDER_HOURS + UNEMPLOYED + POTENTIAL,
    den: EXT_LF,
    parts: ["시간 모자람", "실업자", "잠재 노동력"],
  },
] as const;

const C_UNEMP = "#0ea5e9";
const C_HOURS = "#f59e0b";
const C_POT = "#6366f1";
const MUTED = "#94a3b8";
const INK = "#334155";

const colorOf = (p: string) =>
  p === "실업자" ? C_UNEMP : p === "시간 모자람" ? C_HOURS : C_POT;
const sizeOf = (p: string) =>
  p === "실업자" ? UNEMPLOYED : p === "시간 모자람" ? UNDER_HOURS : POTENTIAL;

export default function FourMeasuresViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;
  const m = MEASURES[s];
  const pct = (m.num / m.den) * 100;

  const NOTES = [
    `가장 널리 쓰이는 숫자입니다. 세 조건을 다 통과한 ${UNEMPLOYED}명을, 일하는 사람 ${EMPLOYED}명과 더한 ${LF}명으로 나눕니다. ${pct.toFixed(1)}%입니다.`,
    `일은 하고 있지만 시간이 모자라 더 일하고 싶은 ${UNDER_HOURS}명을 분자에 더합니다. 이 사람들은 LU1에서는 일하는 사람으로만 세어졌습니다. 분모는 그대로여서 ${pct.toFixed(1)}%가 됩니다.`,
    `일하고 싶지만 찾기를 그만두었거나 당장은 어려운 ${POTENTIAL}명을 더합니다. 이들은 LU1의 세 문 가운데 하나에서 빠졌던 사람들입니다. 분모도 함께 늘어 ${EXT_LF}명이 되고 ${pct.toFixed(1)}%가 됩니다.`,
    `셋을 다 더하면 ${pct.toFixed(1)}%입니다. 같은 사람들을 같은 주에 세었는데 숫자가 ${((MEASURES[0].num / MEASURES[0].den) * 100).toFixed(1)}%에서 ${pct.toFixed(1)}%까지 벌어집니다. 어느 것이 맞는 숫자냐가 아니라 무엇을 묻고 있느냐의 문제입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="네 가지 숫자"
      title="같은 주의 같은 사람들에서 네 가지 숫자가 나옵니다"
      description="분자에 누구를 넣고 분모를 무엇으로 두느냐에 따라 달라지며, 국제 기준은 넷 중 하나만 쓰지 말라고 적어 두었습니다."
      note="LU1~LU4의 정의는 19차 ICLS 결의 73항 (c)입니다. 100명 보기는 설명을 위해 만든 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="LU1에서 LU4까지 분자와 분모가 달라지는 방식"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-none flex-col justify-center">
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
              <text x={20} y={40} fontSize={8} fontWeight={700} fill={MUTED}>
                분자에 들어가는 사람
              </text>
              {m.parts.map((p, i) => {
                const prev = m.parts.slice(0, i).reduce((a, q) => a + sizeOf(q), 0);
                return (
                  <g key={p}>
                    <rect x={20 + prev * 7} y={50} width={sizeOf(p) * 7 - 2} height={22} rx={2} fill={colorOf(p)} opacity={0.8} />
                    <text x={20 + prev * 7 + (sizeOf(p) * 7) / 2} y={84} fontSize={7.5} fontWeight={700} fill={colorOf(p)} textAnchor="middle">
                      {sizeOf(p)}
                    </text>
                  </g>
                );
              })}
              <text x={20} y={100} fontSize={8} fill={INK}>
                {m.parts.join(" + ")} = {m.num}명
              </text>

              <text x={20} y={126} fontSize={8} fontWeight={700} fill={MUTED}>
                분모
              </text>
              <rect x={20} y={134} width={m.den * 2.6} height={18} rx={2} fill={MUTED} opacity={0.35} />
              <text x={24 + m.den * 2.6} y={147} fontSize={8} fontWeight={700} fill={INK}>
                {m.den}명 {m.den === LF ? "(일하는 사람 + 실업자)" : "(거기에 잠재 노동력까지)"}
              </text>

              {/* 네 지표 비교 */}
              <g transform="translate(-24 0)">
                {MEASURES.map((x, i) => {
                  const v = (x.num / x.den) * 100;
                  return (
                    <g key={x.id}>
                      <text x={330} y={44 + i * 26} fontSize={8.5} fontWeight={700} fill={i === s ? INK : MUTED}>
                        {x.id}
                      </text>
                      <rect x={356} y={36 + i * 26} width={v * 3.2} height={12} rx={2} fill={i === s ? C_UNEMP : MUTED} opacity={i === s ? 0.85 : 0.3} />
                      <text x={360 + v * 3.2} y={46 + i * 26} fontSize={8} fontWeight={700} fill={i === s ? C_UNEMP : MUTED}>
                        {v.toFixed(1)}%
                      </text>
                    </g>
                  );
                })}
              </g>

              <text x={20} y={178} fontSize={8.5} fontWeight={700} fill={INK}>
                {m.id} = {m.num} ÷ {m.den} = {pct.toFixed(1)}%
              </text>
              <text x={20} y={192} fontSize={7.5} fill={MUTED}>
                어느 것이 맞느냐가 아니라 무엇을 묻고 있느냐의 문제입니다
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
