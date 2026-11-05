import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "20건이면 사건별 판단이 쌉니다",
  "100건에서 두 비용이 만납니다",
  "500건이면 미리 정한 선이 쌉니다",
  "어긋남이 커지면 결론이 바뀝니다",
] as const;

const C_RULE = 1000;
const C_STANDARD = 12;
const MISS_LOW = 2;
const MISS_HIGH = 8;
const CASES = [20, 100, 500] as const;
const N_FLIP = 200;
const MAX = 6200;

const ruleCost = (n: number, miss: number) => C_RULE + n * miss;
const standardCost = (n: number) => n * C_STANDARD;
const breakEven = (miss: number) => C_RULE / (C_STANDARD - miss);
const fmt = (value: number) =>
  Math.abs(value - Math.round(value)) < 1e-9
    ? `${Math.round(value)}`
    : value.toFixed(1);

function CostRow({
  label,
  formula,
  value,
  winner,
}: {
  label: string;
  formula: string;
  value: number;
  winner: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_4rem] sm:items-center">
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{formula}</p>
      </div>
      <div className="h-4 min-w-0 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            winner ? "bg-emerald-500" : "bg-rose-500/75"
          }`}
          style={{ width: `${Math.max((value / MAX) * 100, 1.5)}%` }}
        />
      </div>
      <p className={`text-left text-sm font-black sm:text-right ${winner ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        {fmt(value)}
      </p>
    </div>
  );
}

export default function RuleOrStandardViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;
  const miss = step === 3 ? MISS_HIGH : MISS_LOW;
  const n = step === 3 ? N_FLIP : CASES[step];
  const rule = ruleCost(n, miss);
  const standard = standardCost(n);
  const cross = breakEven(miss);
  const ruleWins = rule < standard;
  const equal = rule === standard;

  const notes = [
    `한 해 ${n}건이면 미리 선을 정한 총비용은 ${fmt(rule)}이고, 사건별 판단은 ${fmt(standard)}입니다. 반복이 적어 제정 비용 ${C_RULE}을 회수하지 못합니다.`,
    `${n}건에서는 두 값이 ${fmt(rule)}으로 같습니다. 사건 하나에서 아끼는 ${C_STANDARD - miss}을 ${n}번 모아 제정 비용 ${C_RULE}을 정확히 메웁니다.`,
    `${n}건에서는 ${fmt(rule)} 대 ${fmt(standard)}입니다. 제정 비용은 한 번만 들지만 사건별 판단 비용은 계속 붙습니다.`,
    `${n}건에서 어긋남 손해를 ${MISS_LOW}에서 ${miss}로 높이면 미리 정한 쪽이 ${fmt(ruleCost(n, MISS_LOW))}에서 ${fmt(rule)}으로 커집니다. 그래서 원래의 승자가 바뀝니다.`,
  ] as const;

  return (
    <VizFrame
      documentFlow
      eyebrow="비용 장부"
      title="사안 수와 어긋남을 바꾸면 더 싼 방식도 바뀝니다"
      description="막대 길이는 두 방식의 총비용입니다. 초록색이 현재 장면에서 더 싼 쪽입니다."
      note={`제정 비용 ${C_RULE}, 사건당 판단 비용 ${C_STANDARD}, 기본 어긋남 손해 ${MISS_LOW}을 둔 가상 단위입니다. 실제 금액이나 통계가 아닙니다.`}
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사안 수와 어긋남 손해에 따른 규칙과 기준의 총비용"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[31rem] py-1 sm:min-h-[26rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 text-base font-bold text-foreground">{SCENES[step]}</h4>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/35 p-3 text-sm sm:grid-cols-3">
            <p><span className="block text-xs text-muted-foreground">사안 수</span><strong>{n}건</strong></p>
            <p><span className="block text-xs text-muted-foreground">사건당 어긋남</span><strong>{miss}</strong></p>
            <p className="col-span-2 sm:col-span-1"><span className="block text-xs text-muted-foreground">비용이 만나는 수</span><strong>{fmt(cross)}건</strong></p>
          </div>

          <div className="mt-5 space-y-5">
            <CostRow
              label="미리 선을 정함"
              formula={`${C_RULE} + ${n}×${miss}`}
              value={rule}
              winner={ruleWins || equal}
            />
            <CostRow
              label="사건마다 판단함"
              formula={`${n}×${C_STANDARD}`}
              value={standard}
              winner={!ruleWins || equal}
            />
          </div>

          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.05] px-4 py-3">
            <p className="text-xs font-bold text-muted-foreground">이 장면의 판정</p>
            <p className="mt-1 text-sm font-black text-primary">
              {equal
                ? "두 방식의 총비용이 같습니다."
                : ruleWins
                  ? "미리 선을 정하는 쪽이 더 쌉니다."
                  : "사건마다 판단하는 쪽이 더 쌉니다."}
            </p>
          </div>

          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {notes[step]}
          </p>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
