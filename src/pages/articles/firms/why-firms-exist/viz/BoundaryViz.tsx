import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: boundary·what-moves 절 — 경계는 두 값이 같아지는 자리에서 멈춘다 */
const SCENES = [
  "여섯 단계를 전부 시장에서 삽니다",
  "안으로 들이면 단계마다 값이 다릅니다",
  "두 값이 같아지는 자리에서 멈춥니다",
  "시장 쪽 값이 오르면 경계가 밀립니다",
] as const;

/** 시장에서 한 단계를 사 올 때 드는 값. 상대를 찾고 따지고 약속을 묶는 몫입니다. */
const MARKET = 4;
/** 시장 쪽 값이 오른 경우(장면 4) */
const MARKET_HIGH = 5;
/** 안으로 들였을 때 그 단계를 다루는 값. 들일수록 가팔라집니다. */
const INSIDE = [1, 2, 3, 4, 5, 6] as const;

/** 안쪽 값이 시장 값을 넘지 않는 마지막 단계 수 */
const boundaryAt = (market: number) =>
  INSIDE.filter((c) => c <= market).length;

const N_IN = boundaryAt(MARKET);
const N_IN_HIGH = boundaryAt(MARKET_HIGH);

/** 전부 시장에서 살 때와 경계까지 들였을 때의 합계 */
const ALL_MARKET = MARKET * INSIDE.length;
const MIXED =
  INSIDE.slice(0, N_IN).reduce((a, b) => a + b, 0) +
  MARKET * (INSIDE.length - N_IN);
const SAVED = ALL_MARKET - MIXED;

const IN_FILL = "#6366f1";
const OUT_FILL = "#0ea5e9";
const LINE = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const COL = 62;
const X0 = 108;
const BASE = 150;
const UNIT = 15;

export default function BoundaryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const s = scenes.active;

  const market = s === 3 ? MARKET_HIGH : MARKET;
  /** 장면 2는 아직 고르지 않고 여섯 단계를 전부 안에서 다뤘을 때의 값만 보입니다 */
  const nIn =
    s === 0 ? 0 : s === 1 ? INSIDE.length : s === 3 ? N_IN_HIGH : N_IN;

  const NOTES = [
    `생산이 여섯 단계를 거친다고 해 봅니다. 단계마다 상대를 찾고 물건이 약속대로인지 따지고 약속을 묶는 데 ${MARKET}이 듭니다. 전부 시장에서 사 오면 ${ALL_MARKET}입니다.`,
    `같은 단계를 조직 안으로 들이면 값이 달라집니다. 첫 단계는 ${INSIDE[0]}로 싸지만 들일수록 가팔라져 여섯째는 ${INSIDE[5]}입니다. 안에서는 지시로 조정하는데, 다룰 것이 늘수록 무엇을 어디에 둘지 틀리는 몫이 커지기 때문입니다.`,
    `그래서 안쪽 값이 시장 값 ${MARKET}을 넘지 않는 ${N_IN}단계까지만 들이고 나머지 ${INSIDE.length - N_IN}단계는 시장에 둡니다. 합계가 ${ALL_MARKET}에서 ${MIXED}로 ${SAVED}만큼 줄었습니다. 경계는 누가 정한 것이 아니라 두 값이 같아지는 자리입니다.`,
    `시장 쪽 값이 ${MARKET_HIGH}까지 오르면 — 상대를 찾기 어려워지거나 약속을 강제하기 힘들어지면 — 같은 셈이 ${N_IN_HIGH}단계까지를 안으로 들입니다. 안쪽은 하나도 좋아지지 않았는데 경계가 ${N_IN}단계에서 ${N_IN_HIGH}단계로 밀렸습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="조직의 경계"
      title="경계는 안에서 하나 더 다루는 값이 밖에서 사 오는 값과 같아지는 자리입니다"
      description="안쪽 값은 들일수록 오르고 바깥 값은 그대로이므로, 둘이 만나는 곳에서 조직이 커지기를 멈춥니다."
      note="단계 여섯 개로 줄인 예이고 숫자는 관계를 보이기 위한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="조직 안에서 다루는 값과 시장에서 사 오는 값의 비교"
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
              <text x={14} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                생산 단계
              </text>
              {INSIDE.map((_, i) => (
                <text
                  key={`h${i}`}
                  x={X0 + i * COL}
                  y={24}
                  fontSize={8}
                  fontWeight={700}
                  fill={MUTED}
                  textAnchor="middle"
                >
                  {i + 1}단계
                </text>
              ))}

              {/* 시장 값 가로선 */}
              <line
                x1={X0 - 28}
                y1={BASE - market * UNIT}
                x2={X0 + 5 * COL + 28}
                y2={BASE - market * UNIT}
                stroke={OUT_FILL}
                strokeWidth={1.25}
                strokeDasharray="5 3"
              />
              <text
                x={14}
                y={BASE - market * UNIT + 3}
                fontSize={8.5}
                fontWeight={700}
                fill={OUT_FILL}
              >
                시장 {market}
              </text>

              {/* 막대. 장면 1에서는 아직 안쪽 값을 보이지 않고 전부 시장 값으로 둡니다 */}
              {INSIDE.map((c, i) => {
                const inside = i < nIn;
                const cost = inside ? c : market;
                const h = cost * UNIT;
                return (
                  <g key={`b${i}`}>
                    <rect
                      x={X0 + i * COL - 17}
                      y={BASE - h}
                      width={34}
                      height={h}
                      rx={2}
                      fill={inside ? IN_FILL : OUT_FILL}
                      opacity={inside ? 0.85 : 0.22}
                    />
                    <text
                      x={X0 + i * COL}
                      y={BASE - h - 5}
                      fontSize={8.5}
                      fontWeight={700}
                      fill={inside ? IN_FILL : MUTED}
                      textAnchor="middle"
                    >
                      {cost}
                    </text>
                    <text
                      x={X0 + i * COL}
                      y={BASE + 13}
                      fontSize={8}
                      fill={inside ? IN_FILL : OUT_FILL}
                      textAnchor="middle"
                    >
                      {inside ? "안" : "밖"}
                    </text>
                  </g>
                );
              })}

              {/* 경계선 */}
              {nIn > 0 && nIn < INSIDE.length && (
                <g>
                  <line
                    x1={X0 + nIn * COL - COL / 2}
                    y1={30}
                    x2={X0 + nIn * COL - COL / 2}
                    y2={BASE + 18}
                    stroke={LINE}
                    strokeWidth={1.25}
                  />
                  <text
                    x={X0 + nIn * COL - COL / 2 + 4}
                    y={38}
                    fontSize={8.5}
                    fontWeight={700}
                    fill={LINE}
                  >
                    경계
                  </text>
                </g>
              )}

              <line
                x1={X0 - 28}
                y1={BASE}
                x2={X0 + 5 * COL + 28}
                y2={BASE}
                stroke={MUTED}
                strokeWidth={0.75}
              />

              <text x={14} y={178} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `전부 밖에 두면 ${ALL_MARKET}`
                  : s === 1
                    ? "안쪽 값은 들일수록 가팔라집니다"
                    : s === 2
                      ? `${N_IN}단계까지 안으로 · 합계 ${MIXED} · ${SAVED} 줄었습니다`
                      : `시장이 ${MARKET_HIGH}이면 ${N_IN_HIGH}단계까지 안으로 · 경계가 한 칸 밀렸습니다`}
              </text>
              <text x={14} y={192} fontSize={8} fill={MUTED}>
                안쪽 값이 시장 값을 넘는 단계부터는 들이지 않는 편이 낫습니다
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
