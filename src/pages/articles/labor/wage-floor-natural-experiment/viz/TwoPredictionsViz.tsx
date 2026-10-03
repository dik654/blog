import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview 절 — 층위 B. 이름 없이 세 덩어리만 세운다 */
const SCENES = [
  "한쪽만 바닥을 올렸습니다",
  "첫 번째 셈은 줄어든다고 합니다",
  "두 번째 셈은 늘 수도 있다고 합니다",
  "그래서 세어 보면 셋 중 하나입니다",
] as const;

/** 1992년 뉴저지 법이 올린 시간당 바닥. 펜실베이니아는 그대로였습니다. */
const OLD = 4.25;
const NEW = 5.05;
const STORES = 410;
const MONTHS = "7~8";

const RAISED = "#6366f1";
const SAME = "#94a3b8";
const DOWN = "#ef4444";
const UP = "#0ea5e9";
const INK = "#334155";
const MUTED = "#94a3b8";

export default function TwoPredictionsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = scenes.active;

  const NOTES = [
    `한 시간에 ${OLD}달러를 받던 사람이 ${NEW}달러를 받게 되었습니다. 바로 옆 주에서는 같은 일을 하는 사람이 그대로 ${OLD}달러를 받았습니다. 두 곳의 가게 ${STORES}곳을 바뀌기 직전에 한 번, ${MONTHS}달 뒤에 한 번 세었습니다.`,
    `값이 오르면 덜 산다는 셈을 그대로 적용하면, 바닥을 올린 쪽에서 일자리가 줄어야 합니다. 이 셈은 사는 쪽이 여럿이라는 전제 위에 서 있습니다.`,
    `사는 쪽이 하나뿐이면 셈이 달라집니다. 바닥을 걸어 두는 것이 오히려 더 쓰게 만드는 구간이 생깁니다. 두 셈은 같은 자리에서 반대 방향을 가리킵니다.`,
    `그러면 세어 보면 됩니다. 줄었거나, 그대로이거나, 늘었거나 셋 중 하나입니다. 이 글의 마지막 부품이 실제로 센 숫자이고, 결과는 두 셈 중 어느 쪽도 그대로 맞히지 못했습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="세어 볼 자리"
      title="한쪽만 바닥을 올린 자리를 찾으면 두 셈 중 어느 쪽이 맞는지 세어 볼 수 있습니다"
      description="값이 오르면 덜 산다는 셈과 사는 쪽이 하나일 때의 셈이 같은 자리에서 반대를 가리키므로, 둘을 가르는 것은 숫자입니다."
      note="여기서는 아직 어느 셈도 이름을 붙이지 않습니다. 이름은 다음 세 부품에서 하나씩 붙입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한쪽만 최저 바닥을 올린 비교와 두 가지 예측"
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
              {/* 두 쪽 */}
              <g>
                <rect x={26} y={34} width={132} height={96} rx={4} fill={RAISED} opacity={0.1} stroke={RAISED} strokeWidth={1.25} />
                <text x={92} y={28} fontSize={8.5} fontWeight={700} fill={RAISED} textAnchor="middle">
                  바닥을 올린 쪽
                </text>
                <text x={92} y={60} fontSize={8} fill={MUTED} textAnchor="middle">
                  시간당 바닥
                </text>
                <text x={92} y={84} fontSize={15} fontWeight={700} fill={RAISED} textAnchor="middle">
                  {OLD} → {NEW}
                </text>
                <text x={92} y={106} fontSize={8} fill={INK} textAnchor="middle">
                  같은 업종 가게들
                </text>

                <rect x={176} y={34} width={132} height={96} rx={4} fill={SAME} opacity={0.1} stroke={SAME} strokeWidth={1.25} />
                <text x={242} y={28} fontSize={8.5} fontWeight={700} fill={SAME} textAnchor="middle">
                  그대로 둔 쪽
                </text>
                <text x={242} y={60} fontSize={8} fill={MUTED} textAnchor="middle">
                  시간당 바닥
                </text>
                <text x={242} y={84} fontSize={15} fontWeight={700} fill={SAME} textAnchor="middle">
                  {OLD} → {OLD}
                </text>
                <text x={242} y={106} fontSize={8} fill={INK} textAnchor="middle">
                  바로 옆, 같은 업종
                </text>
              </g>

              {/* 세는 시점 */}
              <g>
                <line x1={26} y1={146} x2={308} y2={146} stroke={MUTED} strokeWidth={0.75} />
                <circle cx={26} cy={146} r={3} fill={INK} />
                <circle cx={308} cy={146} r={3} fill={INK} />
                <text x={26} y={162} fontSize={8} fill={INK}>
                  바뀌기 직전에 한 번
                </text>
                <text x={308} y={162} fontSize={8} fill={INK} textAnchor="end">
                  {MONTHS}달 뒤 한 번 더
                </text>
                <text x={167} y={142} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                  가게 {STORES}곳
                </text>
              </g>

              {/* 예측 상자 */}
              <g>
                <text x={340} y={28} fontSize={8} fontWeight={700} fill={MUTED}>
                  올린 쪽의 일자리
                </text>

                <rect x={340} y={38} width={118} height={38} rx={4}
                  fill={DOWN} opacity={s === 1 ? 0.22 : 0.07}
                  stroke={DOWN} strokeWidth={s === 1 ? 1.25 : 0.75} />
                <text x={399} y={54} fontSize={8.5} fontWeight={700} fill={s === 1 ? DOWN : MUTED} textAnchor="middle">
                  첫 번째 셈
                </text>
                <text x={399} y={68} fontSize={8} fill={s === 1 ? DOWN : MUTED} textAnchor="middle">
                  줄어듭니다
                </text>

                <rect x={340} y={84} width={118} height={38} rx={4}
                  fill={UP} opacity={s === 2 ? 0.22 : 0.07}
                  stroke={UP} strokeWidth={s === 2 ? 1.25 : 0.75} />
                <text x={399} y={100} fontSize={8.5} fontWeight={700} fill={s === 2 ? UP : MUTED} textAnchor="middle">
                  두 번째 셈
                </text>
                <text x={399} y={114} fontSize={8} fill={s === 2 ? UP : MUTED} textAnchor="middle">
                  늘 수도 있습니다
                </text>

                <rect x={340} y={130} width={118} height={32} rx={4}
                  fill={INK} opacity={s === 3 ? 0.16 : 0.05}
                  stroke={INK} strokeWidth={s === 3 ? 1.25 : 0.75} />
                <text x={399} y={150} fontSize={8.5} fontWeight={700} fill={s === 3 ? INK : MUTED} textAnchor="middle">
                  세어 본 숫자
                </text>
              </g>

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `바닥만 다르고 나머지는 되도록 같은 두 쪽을 나란히 둡니다`
                  : s === 1
                    ? "값이 오르면 덜 산다 — 사는 쪽이 여럿이라는 전제 위의 셈입니다"
                    : s === 2
                      ? "사는 쪽이 하나면 바닥이 오히려 더 쓰게 만드는 구간이 있습니다"
                      : "두 셈이 반대를 가리키므로 가르는 것은 숫자뿐입니다"}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                두 셈에 이름을 붙이는 것은 다음 세 부품에서 합니다
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
