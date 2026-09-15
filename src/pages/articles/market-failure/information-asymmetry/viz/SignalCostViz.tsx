import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: signaling 절 — 값비싼 표시가 유형을 갈라내지만 그 값은 남지 않는다 */
const SCENES = [
  "구별할 수 없으면 둘 다 평균을 받습니다",
  "표시를 얻는 값이 유형마다 다릅니다",
  "두 단위를 요구하면 갈라집니다",
  "그런데 합은 줄었습니다",
] as const;

/** 일을 실제로 해내는 양 */
const HIGH = 12;
const LOW = 6;
/** 표시 한 단위를 얻는 데 드는 값 */
const COST_HIGH = 1;
const COST_LOW = 4;
/** 요구하는 표시의 단위 수 */
const S = 2;

const POOLED = (HIGH + LOW) / 2;
const NET_HIGH = HIGH - COST_HIGH * S;
const IMITATE_LOW = HIGH - COST_LOW * S;
const PAIR_SEPARATE = NET_HIGH + LOW;
const PAIR_POOLED = 2 * POOLED;
const BURNED = PAIR_POOLED - PAIR_SEPARATE;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 150;
const X1 = 290;

export default function SignalCostViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `한쪽은 일을 ${HIGH}만큼 해내고 다른 쪽은 ${LOW}만큼 해내는데 겉으로는 구별되지 않습니다. 절반씩 섞여 있다고 하면 값은 평균인 ${POOLED}에 맞춰지고, 잘하는 쪽은 ${HIGH - POOLED}만큼 덜 받고 못하는 쪽은 ${POOLED - LOW}만큼 더 받습니다.`,
    `여기에 표시를 하나 둡니다. 자격증이든 학위든 일 자체를 조금도 잘하게 만들지 않지만 얻는 데 값이 드는 것입니다. 중요한 것은 그 값이 잘하는 쪽에게 한 단위당 ${COST_HIGH}이고 못하는 쪽에게 ${COST_LOW}이라는 점입니다.`,
    `표시 ${S}단위를 갖춘 사람에게만 ${HIGH}을 준다고 해 보겠습니다. 잘하는 쪽은 ${HIGH} − ${COST_HIGH * S} = ${NET_HIGH}이라 안 갖추고 ${LOW}을 받는 것보다 낫습니다. 못하는 쪽은 ${HIGH} − ${COST_LOW * S} = ${IMITATE_LOW}이라 ${LOW}보다 못하므로 따라오지 않습니다.`,
    `갈라지긴 했는데 둘을 합치면 ${NET_HIGH} + ${LOW} = ${PAIR_SEPARATE}입니다. 섞여 있을 때는 ${PAIR_POOLED}이었으니 ${BURNED}이 줄었고, 그 ${BURNED}이 바로 표시를 얻는 데 들어간 값입니다. 일을 해내는 양은 하나도 늘지 않았습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="갈라내는 값"
      title="표시가 유형을 갈라내지만 그 값은 어디에도 남지 않습니다"
      description="얻는 값이 유형마다 달라야 표시가 갈라내고, 갈라내는 데 쓴 값만큼 전체가 줄어듭니다."
      note="두 유형이 절반씩 섞여 있는 경우로 줄인 예입니다. 표시가 일을 해내는 양을 전혀 바꾸지 않는다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="표시 비용과 갈라짐"
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
              <text x={X0} y={26} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                잘하는 쪽
              </text>
              <text x={X1} y={26} fontSize={8.5} fontWeight={700} fill={MUTED}>
                못하는 쪽
              </text>

              <text x={14} y={50} fontSize={8.5} fontWeight={700} fill={MUTED}>
                실제로 해내는 양
              </text>
              <text x={X0} y={50} fontSize={10.5} fontWeight={700} fill={ACCENT}>
                {HIGH}
              </text>
              <text x={X1} y={50} fontSize={10.5} fontWeight={700} fill={MUTED}>
                {LOW}
              </text>

              <g opacity={s === 0 ? 1 : 0.25}>
                <text x={14} y={74} fontSize={8.5} fontWeight={700} fill={MUTED}>
                  섞여 있으면 받는 값
                </text>
                <text x={X0} y={74} fontSize={10.5} fontWeight={700} fill={s === 0 ? WARN : MUTED}>
                  {POOLED}
                </text>
                <text x={X1} y={74} fontSize={10.5} fontWeight={700} fill={s === 0 ? OK : MUTED}>
                  {POOLED}
                </text>
                <text x={X1 + 60} y={74} fontSize={8.5} fill={MUTED}>
                  {s === 0 ? `잘하는 쪽이 ${HIGH - POOLED} 덜 받습니다` : ""}
                </text>
              </g>

              <line
                x1={14}
                y1={86}
                x2={456}
                y2={86}
                stroke={MUTED}
                strokeWidth={0.75}
                strokeOpacity={0.4}
              />

              {s >= 1 && (
                <>
                  <text x={14} y={110} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    표시 한 단위에 드는 값
                  </text>
                  <text x={X0} y={110} fontSize={10.5} fontWeight={700} fill={OK}>
                    {COST_HIGH}
                  </text>
                  <text x={X1} y={110} fontSize={10.5} fontWeight={700} fill={WARN}>
                    {COST_LOW}
                  </text>
                </>
              )}

              {s >= 2 && (
                <>
                  <text x={14} y={134} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    {S}단위를 갖추면
                  </text>
                  <text x={X0} y={134} fontSize={10} fontWeight={700} fill={OK}>
                    {HIGH} &minus; {COST_HIGH * S} = {NET_HIGH}
                  </text>
                  <text x={X1} y={134} fontSize={10} fontWeight={700} fill={WARN}>
                    {HIGH} &minus; {COST_LOW * S} = {IMITATE_LOW}
                  </text>

                  <text x={14} y={156} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    안 갖추면
                  </text>
                  <text x={X0} y={156} fontSize={10} fontWeight={700} fill={MUTED}>
                    {LOW}
                  </text>
                  <text x={X1} y={156} fontSize={10} fontWeight={700} fill={OK}>
                    {LOW}
                  </text>

                  <text x={14} y={176} fontSize={9} fontWeight={700} fill={s === 3 ? MUTED : OK}>
                    잘하는 쪽은 갖추고 못하는 쪽은 안 갖춰 둘이 갈라집니다
                  </text>
                </>
              )}

              {s === 3 && (
                <>
                  <text x={14} y={194} fontSize={9} fontWeight={700} fill={WARN}>
                    둘을 합치면 {PAIR_SEPARATE}이라 섞여 있을 때의 {PAIR_POOLED}보다 {BURNED}만큼 적습니다
                  </text>
                  <text x={X1 + 60} y={134} fontSize={8.5} fill={WARN}>
                    따라오지 않습니다
                  </text>
                </>
              )}

              {s === 1 && (
                <text x={14} y={134} fontSize={9} fontWeight={700} fill={ACCENT}>
                  이 값이 유형마다 달라야 표시가 무슨 일이든 할 수 있습니다
                </text>
              )}
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
