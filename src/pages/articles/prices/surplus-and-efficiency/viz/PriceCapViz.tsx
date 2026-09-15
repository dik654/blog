import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: price-cap 절 — 값을 묶으면 옮겨지는 것과 사라지는 것이 함께 생긴다 */
const SCENES = [
  "묶기 전",
  "값을 5로 묶으면 둘만 나옵니다",
  "옮겨진 것과 사라진 것",
  "누가 받는지를 정하지 않으면",
] as const;

const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
const PRICE = 7;
const CAP = 5;

const csAt = (p: number, q: number) =>
  WTP.slice(0, q).reduce((a, w) => a + (w - p), 0);
const psAt = (p: number, q: number) =>
  MC.slice(0, q).reduce((a, m) => a + (p - m), 0);

const Q_FREE = WTP.filter((w) => w >= PRICE).length;
const Q_CAP = Math.min(
  WTP.filter((w) => w >= CAP).length,
  MC.filter((m) => m <= CAP).length,
);

const CS0 = csAt(PRICE, Q_FREE);
const PS0 = psAt(PRICE, Q_FREE);
const CS1 = csAt(CAP, Q_CAP);
const PS1 = psAt(CAP, Q_CAP);
/** 값이 묶여 못 산 사람 수 */
const UNSERVED = WTP.filter((w) => w >= CAP).length - Q_CAP;
/** 누가 받을지 정하지 않아 낼 수 있던 금액과 무관하게 나뉘는 경우 */
const AVG_WTP = WTP.reduce((a, w) => a + w, 0) / WTP.length;
const CS_RANDOM = Q_CAP * (AVG_WTP - CAP);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const n = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));

const X0 = 96;
const UNIT = 22;

/** 장면마다 보여 줄 세 값 */
const CASES = [
  { cs: CS0, ps: PS0, label: `값 ${PRICE} · 넷이 거래` },
  { cs: CS1, ps: PS1, label: `상한 ${CAP} · 둘만 거래` },
  { cs: CS1, ps: PS1, label: "옮겨진 것과 사라진 것" },
  { cs: CS_RANDOM, ps: PS1, label: "낼 수 있던 금액과 무관하게 나뉘면" },
] as const;

export default function PriceCapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const c = CASES[s];
  const total = c.cs + c.ps;
  const lost = CS0 + PS0 - total;

  const NOTES = [
    `앞 절의 결과입니다. 값 ${PRICE}에 넷이 거래되고 산 쪽이 ${CS0}, 판 쪽이 ${PS0}을 남겨 합이 ${CS0 + PS0}입니다. 이것이 이 시장에서 만들 수 있는 가장 큰 값입니다.`,
    `값을 ${CAP} 위로 못 받게 묶으면 드는 값이 ${CAP}을 넘는 사람이 만들지 않습니다. 팔려는 쪽이 ${Q_CAP}명으로 줄고 사려는 쪽은 ${WTP.filter((w) => w >= CAP).length}명이라 ${UNSERVED}명이 못 삽니다. 거래는 ${Q_CAP}건만 일어납니다.`,
    `판 쪽이 남기는 것이 ${PS0}에서 ${PS1}으로 ${PS0 - PS1}만큼 줄고 산 쪽은 ${CS0}에서 ${CS1}으로 ${CS1 - CS0}만큼 늡니다. 나간 것보다 들어온 것이 적어서 차이인 ${PS0 - PS1 - (CS1 - CS0)}이 어디로도 가지 않고 사라집니다. 만들어지지 않은 거래의 값입니다.`,
    `앞 계산은 낼 수 있던 금액이 가장 큰 둘이 산다고 둔 것입니다. 값이 묶이면 줄을 서거나 먼저 온 순서로 나뉘는데, 그러면 산 쪽이 남기는 것이 ${n(CS_RANDOM)}으로 내려가 합이 ${n(CS_RANDOM + PS1)}이 됩니다. 사라지는 것이 ${n(CS0 + PS0 - (CS_RANDOM + PS1))}으로 늘어납니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="값을 묶으면 무슨 일이 생기는가"
      title="옮겨지는 것과 사라지는 것이 함께 생깁니다"
      description="한쪽에서 나간 것이 다른 쪽으로 다 가지 않습니다. 만들어지지 않은 거래의 값이 어디로도 가지 않고 없어집니다."
      note="드는 값이 상한을 넘는 쪽이 만들지 않는다고 둔 계산이며, 실제로는 품질을 낮추거나 다른 조건을 붙이는 길이 함께 열립니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가격 상한이 만드는 이전과 소멸"
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
              <text x={14} y={22} fontSize={9} fontWeight={700} fill={ACCENT}>
                {c.label}
              </text>

              <text x={14} y={52} fontSize={8.5} fontWeight={700} fill={MUTED}>
                산 쪽
              </text>
              <rect
                x={X0}
                y={42}
                width={Math.max(c.cs * UNIT, 1)}
                height={16}
                fill={OK}
                fillOpacity={0.35}
                stroke={OK}
                strokeWidth={1}
              />
              <text x={X0 + c.cs * UNIT + 6} y={54} fontSize={10} fontWeight={700} fill={OK}>
                {n(c.cs)}
              </text>

              <text x={14} y={82} fontSize={8.5} fontWeight={700} fill={MUTED}>
                판 쪽
              </text>
              <rect
                x={X0}
                y={72}
                width={Math.max(c.ps * UNIT, 1)}
                height={16}
                fill={ACCENT}
                fillOpacity={0.35}
                stroke={ACCENT}
                strokeWidth={1}
              />
              <text x={X0 + c.ps * UNIT + 6} y={84} fontSize={10} fontWeight={700} fill={ACCENT}>
                {n(c.ps)}
              </text>

              <text x={14} y={112} fontSize={8.5} fontWeight={700} fill={MUTED}>
                사라진 것
              </text>
              <rect
                x={X0}
                y={102}
                width={Math.max(lost * UNIT, 1)}
                height={16}
                fill={WARN}
                fillOpacity={lost > 0 ? 0.35 : 0.08}
                stroke={WARN}
                strokeWidth={1}
                strokeOpacity={lost > 0 ? 1 : 0.3}
                strokeDasharray="3 2"
              />
              <text x={X0 + Math.max(lost, 0) * UNIT + 6} y={114} fontSize={10} fontWeight={700} fill={lost > 0 ? WARN : MUTED}>
                {n(lost)}
              </text>

              <line x1={14} y1={128} x2={456} y2={128} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={14} y={146} fontSize={8.5} fontWeight={700} fill={MUTED}>
                합
              </text>
              <text x={X0} y={146} fontSize={11} fontWeight={700} fill={lost > 0 ? WARN : OK}>
                {n(total)}
              </text>
              <text x={X0 + 40} y={146} fontSize={9} fill={MUTED}>
                묶기 전 {CS0 + PS0}에서 {n(lost)}만큼 줄었습니다
              </text>

              {s >= 2 && (
                <>
                  <text x={14} y={170} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    이동
                  </text>
                  <text x={X0} y={170} fontSize={9} fontWeight={700} fill={ACCENT}>
                    판 쪽에서 {PS0 - PS1} 나감
                  </text>
                  <text x={X0 + 110} y={170} fontSize={9} fontWeight={700} fill={OK}>
                    산 쪽으로 {n(c.cs - CS0)} 들어옴
                  </text>
                  <text x={X0 + 232} y={170} fontSize={9} fontWeight={700} fill={WARN}>
                    나머지 {n(lost)} 소멸
                  </text>
                </>
              )}
              <text x={14} y={192} fontSize={9} fontWeight={700} fill={s === 3 ? WARN : MUTED}>
                {s === 3
                  ? `누가 받을지를 정하지 않으면 사라지는 것이 ${n(CS0 + PS0 - (CS_RANDOM + PS1))}까지 늘어납니다`
                  : s === 1
                    ? `${UNSERVED}명이 값을 낼 뜻이 있는데도 사지 못합니다`
                    : "값을 묶는 것은 나누는 방식을 바꾸는 동시에 전체를 줄입니다"}
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
