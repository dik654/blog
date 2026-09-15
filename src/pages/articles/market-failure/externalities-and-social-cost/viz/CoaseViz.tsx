import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: bargaining 절 — 권리를 누구에게 주든 수량은 같고 돈의 방향만 다르다 */
const SCENES = [
  "만드는 쪽에 권리가 있으면",
  "피해 쪽에 권리가 있으면",
  "수량은 같고 돈만 반대로 흐릅니다",
  "협상에 값이 들면 갈립니다",
] as const;

/** 넷째 한 개를 두고 벌어지는 일 */
const MAKER_GAIN = 0;
const VICTIM_LOSS = 2;
/** 협상에 드는 값이 이보다 크면 협상이 성사되지 않는다 */
const GAP = VICTIM_LOSS - MAKER_GAIN;
const NEGOTIATION_COST = 3;

const Q_MARKET = 4;
const Q_SOCIAL = 3;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const CASES = [
  {
    right: "만드는 쪽",
    who: "피해 쪽이 돈을 주고 막습니다",
    flow: `피해 쪽 → 만드는 쪽 · ${MAKER_GAIN}에서 ${VICTIM_LOSS} 사이`,
    q: Q_SOCIAL,
    ok: true,
  },
  {
    right: "피해 쪽",
    who: "만드는 쪽이 허락을 사야 합니다",
    flow: `만드는 쪽이 ${VICTIM_LOSS} 이상을 줘야 하는데 얻는 것이 ${MAKER_GAIN}`,
    q: Q_SOCIAL,
    ok: true,
  },
  {
    right: "둘 다",
    who: "어느 쪽이든 넷째는 만들어지지 않습니다",
    flow: "돈의 방향만 반대이고 수량은 같습니다",
    q: Q_SOCIAL,
    ok: true,
  },
  {
    right: "만드는 쪽",
    who: `협상에 ${NEGOTIATION_COST}이 들면 ${GAP}으로는 못 메웁니다`,
    flow: "협상이 성사되지 않아 넷째가 그대로 만들어집니다",
    q: Q_MARKET,
    ok: false,
  },
] as const;

const X0 = 120;

export default function CoaseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const c = CASES[s];

  const NOTES = [
    `넷째 한 개를 만들 권리가 만드는 쪽에 있다고 하겠습니다. 그 한 개로 만드는 쪽이 얻는 것은 ${MAKER_GAIN}이고 피해 쪽이 잃는 것은 ${VICTIM_LOSS}입니다. 피해 쪽이 그 사이의 금액을 주고 만들지 말라고 하면 양쪽 다 낫습니다.`,
    `권리가 피해 쪽에 있으면 만드는 쪽이 허락을 사야 합니다. 피해 쪽은 ${VICTIM_LOSS} 아래로는 팔지 않는데 만드는 쪽이 그 한 개로 얻는 것은 ${MAKER_GAIN}입니다. 살 수 없으니 만들지 않습니다.`,
    `두 경우 모두 넷째가 만들어지지 않고 ${Q_SOCIAL}개에서 멈춥니다. 달라지는 것은 돈이 어느 쪽으로 흐르느냐뿐입니다. 2편에서 교환 비율이 몫만 정했고 4편에서 값이 몫만 정했던 것과 같은 자리입니다.`,
    `협상 자체에 ${NEGOTIATION_COST}이 든다고 하면 달라집니다. 넷째를 막아서 생기는 이득이 ${GAP}뿐이라 그 값을 치르고 협상할 이유가 없습니다. 권리가 만드는 쪽에 있으면 넷째가 그대로 만들어지고, 피해 쪽에 있으면 협상 없이도 막힙니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="권리를 누구에게 줄 것인가"
      title="협상에 값이 들지 않으면 권리를 누구에게 주든 수량이 같습니다"
      description="달라지는 것은 돈의 방향뿐입니다. 협상에 값이 들기 시작하면 그때부터 권리의 위치가 결과를 바꿉니다."
      note="넷째 한 개만 떼어 본 계산입니다. 양쪽이 서로의 숫자를 알고 상대를 특정할 수 있다고 둔 경우입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="권리 배정과 협상의 결과"
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
                넷째 한 개
              </text>
              <text x={X0} y={24} fontSize={9} fill={MUTED}>
                만드는 쪽이 얻는 것 {MAKER_GAIN} · 피해 쪽이 잃는 것 {VICTIM_LOSS}
              </text>

              <line x1={14} y1={36} x2={456} y2={36} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={58} fontSize={8} fontWeight={700} fill={MUTED}>
                권리
              </text>
              <rect
                x={X0}
                y={46}
                width={110}
                height={18}
                fill={ACCENT}
                fillOpacity={0.24}
                stroke={ACCENT}
                strokeWidth={1}
              />
              <text x={X0 + 8} y={59} fontSize={10} fontWeight={700} fill={ACCENT}>
                {c.right}
              </text>

              <text x={14} y={88} fontSize={8} fontWeight={700} fill={MUTED}>
                무슨 일이
              </text>
              <text x={X0} y={88} fontSize={9} fill={MUTED}>
                {c.who}
              </text>

              <text x={14} y={112} fontSize={8} fontWeight={700} fill={MUTED}>
                돈의 흐름
              </text>
              <text x={X0} y={112} fontSize={9} fill={MUTED}>
                {c.flow}
              </text>

              <line x1={14} y1={126} x2={456} y2={126} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={150} fontSize={8} fontWeight={700} fill={MUTED}>
                만들어지는 양
              </text>
              <text x={X0} y={150} fontSize={14} fontWeight={700} fill={c.ok ? OK : WARN}>
                {c.q}개
              </text>
              <text x={X0 + 48} y={150} fontSize={9} fontWeight={700} fill={c.ok ? OK : WARN}>
                {c.ok ? "맞는 수량입니다" : `넷째가 남아 ${VICTIM_LOSS}만큼 깎아먹습니다`}
              </text>

              <text x={14} y={178} fontSize={9} fontWeight={700} fill={s === 2 ? ACCENT : MUTED}>
                {s === 2
                  ? "권리의 위치는 수량이 아니라 누가 돈을 내는지를 정했습니다"
                  : s === 3
                    ? `협상 비용 ${NEGOTIATION_COST}이 이득 ${GAP}보다 커서 협상이 열리지 않습니다`
                    : "상대를 특정할 수 있고 서로의 숫자를 안다고 둔 경우입니다"}
              </text>
              <text x={14} y={194} fontSize={9} fontWeight={700} fill={s === 3 ? WARN : MUTED}>
                {s === 3
                  ? "협상이 막히면 권리를 협상이 성사됐을 때 갔을 쪽에 두는 편이 낫습니다"
                  : "여기까지는 협상에 값이 들지 않는다고 두었습니다"}
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
