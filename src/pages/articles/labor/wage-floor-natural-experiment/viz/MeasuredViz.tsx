import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: what-happened 절 — Card·Krueger 1994 Table 3(780쪽)과 Table 7(788쪽)의 숫자 */
const SCENES = [
  "올리지 않은 쪽이 오히려 줄었습니다",
  "안에서 갈라 봐도 같은 방향입니다",
  "그런데 값은 반대로 움직였습니다",
  "두 셈 중 어느 쪽도 다 맞히지 못합니다",
] as const;

/** Table 3, 3행: 가게당 정규 환산 인원의 변화와 표준오차 */
const BY_STATE = [
  { label: "그대로 둔 쪽", change: -2.16, se: 1.25, n: null },
  { label: "올린 쪽", change: 0.59, se: 0.54, n: null },
] as const;
const DIFF = { change: 2.76, se: 1.36 };

/** Table 3, 3행 (iv)~(vi): 올린 쪽을 처음 시작임금으로 가른 세 묶음 */
const BY_WAGE = [
  { label: "시작 4.25", change: 1.32, se: 0.95, n: 101 },
  { label: "4.26~4.99", change: 0.87, se: 0.84, n: 140 },
  { label: "5.00 이상", change: -2.04, se: 1.14, n: 73 },
] as const;

/** Table 7 (i): 한 끼 값의 로그 변화에 붙은 계수 */
const PRICE = { pct: 3.2, coef: 0.033, se: 0.014 };

const UP = "#0ea5e9";
const DOWN = "#ef4444";
const INK = "#334155";
const MUTED = "#94a3b8";
const MARK = "#6366f1";

const BASE = 106;
const UNIT = 13;
const yOf = (v: number) => BASE - v * UNIT;

export default function MeasuredViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const rows = s === 1 ? BY_WAGE : BY_STATE;
  const x0 = s === 1 ? 70 : 92;
  const col = s === 1 ? 74 : 104;

  const NOTES = [
    `가게 하나당 정규 환산 인원이 그대로 둔 쪽에서는 ${BY_STATE[0].change}명 줄었고 올린 쪽에서는 ${BY_STATE[1].change}명 늘었습니다. 차이는 ${DIFF.change}명이고 표준오차는 ${DIFF.se}입니다. 정규 환산은 시간제 한 사람을 반 사람으로 세는 방식입니다.`,
    `올린 쪽 안에서 처음 시작임금으로 갈라도 방향이 같습니다. 법에 걸려 반드시 올려야 했던 ${BY_WAGE[0].n}곳은 ${BY_WAGE[0].change}명 늘었고, 이미 ${BY_WAGE[2].label.replace(" 이상", "")}달러 이상을 주던 ${BY_WAGE[2].n}곳은 ${BY_WAGE[2].change}명 줄었습니다. 가장 세게 올려야 했던 쪽이 가장 많이 늘었습니다.`,
    `여기서 두 번째 셈도 막힙니다. 사는 쪽이 하나여서 더 쓰게 된 것이라면 더 많이 만들어 값이 내려가야 합니다. 그런데 한 끼 값은 올린 쪽에서 ${PRICE.pct}% 더 올랐습니다. 사람도 늘고 값도 오른 것은 어느 쪽 셈으로도 잘 맞지 않습니다.`,
    `논문 자신의 결론이 그렇습니다. 교과서 셈의 핵심 예측은 확인되지 않았고, 사는 쪽이 하나라는 셈도 값의 움직임을 설명하지 못합니다. 답이 바뀐 것이 아니라 두 설명 모두 부족하다는 것이 재 본 결과입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="재 본 숫자"
      title="올린 쪽에서 일자리가 줄지 않았고, 값은 오히려 더 올랐습니다"
      description="가게당 정규 환산 인원의 변화와 한 끼 값의 변화를 같은 기간·같은 업종에서 나란히 둔 결과입니다."
      note="Card·Krueger(1994) 표 3(780쪽)과 표 7(788쪽)의 값입니다. 괄호 안은 표준오차입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="주별·시작임금별 고용 변화와 값의 변화"
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
              <line x1={34} y1={BASE} x2={330} y2={BASE} stroke={MUTED} strokeWidth={0.75} />
              <text x={30} y={BASE + 3} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="end">
                0
              </text>
              <text x={34} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                가게당 사람 수의 변화
              </text>

              {s <= 1 &&
                rows.map((r, i) => {
                  const up = r.change >= 0;
                  const h = Math.abs(r.change) * UNIT;
                  const x = x0 + i * col;
                  return (
                    <g key={r.label}>
                      {/* 항목명은 위쪽 머리글에 두어 음수 막대 아래 글자가 쌓이지 않게 합니다 */}
                      <text x={x} y={42} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                        {r.label}
                      </text>
                      {r.n && (
                        <text x={x} y={53} fontSize={7.5} fill={MUTED} textAnchor="middle">
                          {r.n}곳
                        </text>
                      )}
                      <rect
                        x={x - 26}
                        y={up ? BASE - h : BASE}
                        width={52}
                        height={h}
                        rx={2}
                        fill={up ? UP : DOWN}
                        opacity={0.75}
                      />
                      <text x={x} y={up ? BASE - h - 6 : BASE + h + 13} fontSize={9.5} fontWeight={700} fill={up ? UP : DOWN} textAnchor="middle">
                        {r.change > 0 ? "+" : ""}
                        {r.change}
                      </text>
                      <text x={x} y={up ? BASE - h - 17 : BASE + h + 24} fontSize={7.5} fill={MUTED} textAnchor="middle">
                        ({r.se})
                      </text>
                    </g>
                  );
                })}

              {s === 0 && (
                <g>
                  <text x={352} y={50} fontSize={8} fontWeight={700} fill={MUTED}>
                    두 쪽의 차이
                  </text>
                  <text x={352} y={74} fontSize={17} fontWeight={700} fill={MARK}>
                    +{DIFF.change}
                  </text>
                  <text x={352} y={90} fontSize={8} fill={MUTED}>
                    표준오차 {DIFF.se}
                  </text>
                  <text x={352} y={112} fontSize={8} fill={INK}>
                    줄었다는 예측과
                  </text>
                  <text x={352} y={124} fontSize={8} fill={INK}>
                    방향이 반대입니다
                  </text>
                </g>
              )}

              {s >= 2 && (
                <g>
                  <text x={34} y={56} fontSize={8} fontWeight={700} fill={MUTED}>
                    한 끼 값의 변화 (올린 쪽 − 그대로 둔 쪽)
                  </text>
                  <rect x={34} y={70} width={PRICE.pct * 46} height={26} rx={2} fill={DOWN} opacity={0.65} />
                  <text x={34 + PRICE.pct * 46 + 8} y={88} fontSize={13} fontWeight={700} fill={DOWN}>
                    +{PRICE.pct}%
                  </text>
                  <text x={34} y={112} fontSize={8} fill={MUTED}>
                    계수 {PRICE.coef} · 표준오차 {PRICE.se}
                  </text>
                  <text x={34} y={132} fontSize={8.5} fontWeight={700} fill={INK}>
                    {s === 2
                      ? "사람이 늘었다면 값은 내려가야 했습니다"
                      : "사람은 줄지 않았고 값은 올랐습니다"}
                  </text>
                  {s === 3 && (
                    <g>
                      <rect x={34} y={142} width={140} height={22} rx={3} fill={DOWN} opacity={0.12} stroke={DOWN} strokeWidth={1} />
                      <text x={104} y={157} fontSize={8} fontWeight={700} fill={DOWN} textAnchor="middle">
                        첫 번째 셈 ✗
                      </text>
                      <rect x={186} y={142} width={140} height={22} rx={3} fill={DOWN} opacity={0.12} stroke={DOWN} strokeWidth={1} />
                      <text x={256} y={157} fontSize={8} fontWeight={700} fill={DOWN} textAnchor="middle">
                        두 번째 셈 ✗
                      </text>
                    </g>
                  )}
                </g>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? `올린 쪽 +${BY_STATE[1].change} · 그대로 둔 쪽 ${BY_STATE[0].change} · 차이 +${DIFF.change}`
                  : s === 1
                    ? `가장 세게 올려야 했던 ${BY_WAGE[0].n}곳이 +${BY_WAGE[0].change}로 가장 많이 늘었습니다`
                    : s === 2
                      ? `값은 올린 쪽이 ${PRICE.pct}% 더 올랐습니다`
                      : `재 본 결과는 두 셈 중 어느 쪽도 그대로 맞히지 못했습니다`}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                정규 환산은 시간제 한 사람을 반 사람으로 세는 방식입니다
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
