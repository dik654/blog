import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 총이자는 달마다 남은 원금을 더한 넓이입니다.
 * 칸 하나 = 1000만÷12≈83만3333원을 한 달 빌린 이자 = 83만3333×0.5%≈4167원.
 * 만기 일시 12×12=144칸=60만 원, 원금균등 12+11+…+1=78칸=32만5000원, 차이 66칸=27만5000원.
 */
const SCENES = [
  { label: "만기에 한 번에 갚기", summary: "144칸 = 60만 원", note: "1년 내내 원금 1000만 원이 남아 달마다 12칸씩 찹니다. 한 달 이자 5만 원, 12달이면 60만 원입니다." },
  { label: "매달 원금을 같게 갚기", summary: "78칸 = 32만5000원", note: "달마다 83만3333원을 갚아 기둥이 한 칸씩 낮아집니다. 첫 달 12칸은 이자 5만 원, 마지막 달 1칸은 약 4167원이고 모두 78칸입니다." },
  { label: "두 일정의 차이", summary: "66칸 = 27만5000원", note: "금리는 같은 월 0.5%인데 빈 66칸만큼 이자가 적습니다. 일찍 갚은 원금에는 그 뒤로 이자가 붙지 않기 때문입니다." },
] as const;

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const LEVELS = Array.from({ length: 12 }, (_, index) => index + 1);
const CELL_W = 25;
const CELL_H = 11;
const GAP = 2;
const LEFT = 12;
const TOP = 22;
const X = (month: number) => LEFT + (month - 1) * (CELL_W + GAP / 2 + 0.5);
const Y = (level: number) => TOP + (12 - level) * (CELL_H + GAP);
const BOTTOM_Y = Y(1) + CELL_H;

const ACCENT = "#2563eb";
const AMBER = "#d97706";

export default function RepaymentCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="남은 원금과 이자"
      title="같은 연 6%에서 이자가 붙는 칸을 직접 셉니다"
      description="가로는 달, 기둥 높이는 그달 이자를 매길 남은 원금입니다. 칸 하나는 83만3333원을 한 달 빌린 이자, 약 4167원입니다."
      note="1000만 원을 1년 빌리는 가정이며 월 이율을 0.5%로 단순화했습니다. 세금과 수수료는 뺐습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="만기 일시상환과 원금균등 상환의 이자 칸을 세는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 340 ${BOTTOM_Y + 22}`} className="mx-auto mt-3 h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={LEFT} y={14} fontSize={12} fontWeight={700} fill={ACCENT}>{active === 0 ? "매달 1000만 원" : "첫 달 1000만 원"}</text>
          {active >= 1 && (
            <text x={X(12) + CELL_W} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>마지막 달 83만3333원</text>
          )}
          {MONTHS.map((month) =>
            LEVELS.map((level) => {
              const remains = level <= 13 - month;
              if (active === 0) {
                return <rect key={`${month}-${level}`} x={X(month)} y={Y(level)} width={CELL_W} height={CELL_H} rx={2} fill={ACCENT} opacity={0.75} />;
              }
              if (remains) {
                return <rect key={`${month}-${level}`} x={X(month)} y={Y(level)} width={CELL_W} height={CELL_H} rx={2} fill={ACCENT} opacity={0.75} />;
              }
              return (
                <rect
                  key={`${month}-${level}`}
                  x={X(month) + 0.5}
                  y={Y(level) + 0.5}
                  width={CELL_W - 1}
                  height={CELL_H - 1}
                  rx={2}
                  fill="none"
                  stroke={active === 2 ? AMBER : "#94a3b8"}
                  strokeWidth={active === 2 ? 1 : 0.5}
                  strokeDasharray={active === 2 ? undefined : "2 2"}
                />
              );
            }),
          )}
          {MONTHS.map((month) => (
            <text key={month} x={X(month) + CELL_W / 2} y={BOTTOM_Y + 15} textAnchor="middle" fontSize={11} fill="#64748b">{month}</text>
          ))}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
