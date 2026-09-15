import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: settlement-range 의 ExplainedFormula — 합의 구간의 폭과 소멸 */
const SCENES = [
  "같은 기대라면 구간이 열린다",
  "기대가 조금 갈려도 남아 있다",
  "너무 갈리면 구간이 사라진다",
  "소송비용이 크면 같은 차이도 견딘다",
] as const;

/** 판결 금액과 장면별 양측의 승소 기대·소송비용 */
const JUDGMENT = 1000;
const SETUP = [
  { pp: 0.5, pd: 0.5, cp: 80, cd: 80 },
  { pp: 0.6, pd: 0.5, cp: 80, cd: 80 },
  { pp: 0.7, pd: 0.5, cp: 80, cd: 80 },
  { pp: 0.7, pd: 0.5, cp: 150, cd: 150 },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 46;
const SPAN = 384;
const MAXV = 1000;
const toX = (v: number) => X0 + (v / MAXV) * SPAN;
const fmt = (v: number) => v.toLocaleString("ko-KR");
const pct = (p: number) => `${Math.round(p * 1000) / 10}`;

export default function SettlementRangeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const { pp, pd, cp, cd } = SETUP[step];
  const low = pp * JUDGMENT - cp;
  const high = pd * JUDGMENT + cd;
  const open = low < high;
  const gapNeeded = Math.round((pp - pd) * JUDGMENT);

  const NOTES = [
    `판결이 나면 오가는 돈이 ${fmt(JUDGMENT)}이고 양쪽 다 이길 확률을 ${pct(pp)}퍼센트로 봅니다. 소송비용이 각각 ${fmt(cp)}이면 청구하는 쪽은 ${fmt(low)} 이상이면 받아들이고 받는 쪽은 ${fmt(high)} 이하면 내놓으므로, 그 사이가 전부 합의 가능한 금액입니다.`,
    `청구하는 쪽이 ${pct(pp)}퍼센트, 받는 쪽이 ${pct(pd)}퍼센트로 갈려도 구간이 ${fmt(low)}에서 ${fmt(high)}까지 남습니다. 기대의 차이 ${fmt(gapNeeded)}이 두 소송비용의 합 ${fmt(cp + cd)}보다 작기 때문입니다.`,
    `차이가 ${fmt(gapNeeded)}으로 벌어지면 두 소송비용의 합 ${fmt(cp + cd)}을 넘어 구간이 사라집니다. 청구하는 쪽의 최저선이 받는 쪽의 최고선보다 높아져 겹치는 금액이 없습니다. 이때 재판으로 갑니다.`,
    `같은 차이 ${fmt(gapNeeded)}이라도 소송비용이 각각 ${fmt(cp)}이면 합이 ${fmt(cp + cd)}이 되어 다시 구간이 열립니다. 재판이 비쌀수록 서로 양보할 폭이 넓어진다는 뜻입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="합의 구간"
      title="합의할 수 있는 금액의 폭은 소송비용만큼입니다"
      description="재판을 피해서 아끼는 돈이 양보할 수 있는 폭이 됩니다."
      note={`판결 금액을 ${fmt(JUDGMENT)}으로 고정하고 양측의 기대와 소송비용만 바꾼 예입니다. 위험을 대하는 태도와 시간의 값은 넣지 않았습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="합의 가능한 금액의 구간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={X0} y={26} fontSize={9} fill={MUTED}>
                청구하는 쪽 기대 {pct(pp)}% · 받는 쪽 기대 {pct(pd)}% · 소송비용 각 {fmt(cp)}
              </text>

              {open ? (
                <rect x={toX(low)} y={48} width={toX(high) - toX(low)} height={26} fill={OK} fillOpacity={0.25} stroke={OK} strokeWidth={1} />
              ) : (
                <rect x={toX(high)} y={48} width={toX(low) - toX(high)} height={26} fill={WARN} fillOpacity={0.18} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
              )}

              <line x1={toX(low)} y1={40} x2={toX(low)} y2={96} stroke={ACCENT} strokeWidth={1.25} />
              <text x={toX(low)} y={36} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={ACCENT}>
                청구 최저 {fmt(low)}
              </text>
              <line x1={toX(high)} y1={40} x2={toX(high)} y2={96} stroke={WARN} strokeWidth={1.25} />
              <text x={toX(high)} y={112} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={WARN}>
                수용 최고 {fmt(high)}
              </text>

              <line x1={X0} y1={96} x2={X0 + SPAN} y2={96} stroke={MUTED} strokeWidth={1} />
              {[0, 250, 500, 750, 1000].map((tick) => (
                <g key={tick}>
                  <line x1={toX(tick)} y1={92} x2={toX(tick)} y2={100} stroke={MUTED} strokeWidth={1} />
                  <text x={toX(tick)} y={90} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                    {fmt(tick)}
                  </text>
                </g>
              ))}
              <text x={X0 + SPAN} y={128} textAnchor="end" fontSize={8} fill={MUTED}>
                합의 금액
              </text>

              <text x={X0} y={152} fontSize={10} fontWeight={700} fill={open ? OK : WARN}>
                {open
                  ? `합의 가능 구간 ${fmt(low)} ~ ${fmt(high)} · 폭 ${fmt(high - low)}`
                  : "겹치는 금액이 없습니다 · 재판으로 갑니다"}
              </text>
              <text x={X0} y={172} fontSize={9} fill={MUTED}>
                기대의 차이 {fmt(gapNeeded)} {open ? "<" : ">"} 두 소송비용의 합 {fmt(cp + cd)}
              </text>
              <text x={X0} y={190} fontSize={9} fontWeight={700} fill={ACCENT}>
                {open
                  ? "재판을 피해 아끼는 돈이 양보할 폭이 됩니다"
                  : "양쪽이 자기가 이긴다고 보는 정도가 아끼는 돈보다 큽니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
