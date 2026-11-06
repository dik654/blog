import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 주급 10인 지역에서 주당 100이 90으로 바뀔 때 돈 칸이 어디로 가는지.
 * 칸 하나 = 비용 1, 한 줄 = 노동자 한 명의 주급 10. 기계 35 + 석탄 15 + 노동 40 = 90, 남는 10이 절감액입니다.
 */
const SCENES = [
  { label: "사람 방식", summary: "주당 100", note: "노동자 10명에게 주급 10씩, 100칸이 모두 임금입니다." },
  { label: "기계 방식", summary: "주당 90", note: "남은 4명의 임금 40은 그대로입니다. 6명에게 가던 60칸 가운데 35는 기계(상각·이자·수리), 15는 석탄으로 가고 10칸이 남습니다." },
  { label: "두 장부", summary: "기업 −10 · 임금 칸 −60", note: "기업 장부에는 10을 아낀 일로 적힙니다. 같은 변화가 노동자 쪽에서는 6명분 임금 60이 이 공장에서 빠진 일입니다. 6명의 소득은 다른 일을 찾았는지에 달렸고, 이 표에는 없습니다." },
] as const;

type Kind = "wage" | "machine" | "coal" | "saved";

const kindOf = (index: number): Kind => {
  if (index < 40) return "wage";
  if (index < 75) return "machine";
  if (index < 90) return "coal";
  return "saved";
};

const COLORS: Record<Kind, string> = { wage: "#64748b", machine: "#2563eb", coal: "#d97706", saved: "#16a34a" };

const CELL_W = 15;
const CELL_H = 14;
const GAP_X = 2;
const GAP_Y = 3;
const GRID_X = 44;
const TOP = 3;
const W = 320;
const H = TOP + 10 * (CELL_H + GAP_Y) + 2;
const GRID_END = GRID_X + 10 * (CELL_W + GAP_X) - GAP_X;
const rowY = (row: number) => TOP + row * (CELL_H + GAP_Y);

function Group({ from, to, color, text, sub }: { from: number; to: number; color: string; text: string; sub?: string }) {
  const x = GRID_END + 6;
  const mid = (from + to) / 2;
  return (
    <g>
      <line x1={x} x2={x} y1={from} y2={to} stroke={color} strokeWidth={1.25} />
      <text x={x + 6} y={sub ? mid - 2 : mid + 4} fontSize={13} fontWeight={700} fill={color}>{text}</text>
      {sub && <text x={x + 6} y={mid + 13} fontSize={12} fill={color}>{sub}</text>}
    </g>
  );
}

export default function WeeklyCostCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="돈 칸 옮기기"
      title="기업이 아낀 10칸 뒤에서 임금 60칸이 자리를 옮깁니다"
      description="주당 100이 90이 될 때 돈은 어디로 갈까요? 칸 하나가 비용 1이고, 한 줄이 노동자 한 명의 주급 10입니다."
      note="주급 10, 기계 35, 석탄 15, 노동자 4명은 설명용 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="주당 비용 100칸이 임금, 기계, 석탄, 절감액으로 나뉘는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: 10 }, (_, row) => {
            const gone = active >= 1 && row >= 4;
            return (
              <text key={row} x={GRID_X - 6} y={rowY(row) + 11} textAnchor="end" fontSize={12} fill="#64748b" opacity={gone ? 0.55 : 1} textDecoration={gone ? "line-through" : undefined}>
                {row + 1}번
              </text>
            );
          })}
          {Array.from({ length: 100 }, (_, index) => {
            const kind: Kind = active === 0 ? "wage" : kindOf(index);
            const dimmed = active === 2 && kind !== "wage" && kind !== "saved";
            const hollow = kind === "saved";
            return (
              <rect
                key={index}
                x={GRID_X + (index % 10) * (CELL_W + GAP_X)}
                y={rowY(Math.floor(index / 10))}
                width={CELL_W}
                height={CELL_H}
                rx={1.5}
                fill={hollow ? "none" : COLORS[kind]}
                fillOpacity={dimmed ? 0.3 : 1}
                stroke={COLORS[kind]}
                strokeWidth={0.75}
                strokeDasharray={hollow ? "2 2" : undefined}
              />
            );
          })}
          {active === 0 && <Group from={rowY(0)} to={rowY(9) + CELL_H} color={COLORS.wage} text="임금 100" sub="10명 × 10" />}
          {active === 1 && (
            <>
              <Group from={rowY(0)} to={rowY(3) + CELL_H} color={COLORS.wage} text="임금 40" sub="4명 × 10" />
              <Group from={rowY(4)} to={rowY(7) + CELL_H / 2 - 1} color={COLORS.machine} text="기계 35" />
              <Group from={rowY(7) + CELL_H / 2 + 1} to={rowY(8) + CELL_H} color={COLORS.coal} text="석탄 15" />
              <Group from={rowY(9)} to={rowY(9) + CELL_H} color={COLORS.saved} text="절감 10" />
            </>
          )}
          {active === 2 && (
            <>
              <Group from={rowY(0)} to={rowY(3) + CELL_H} color={COLORS.wage} text="남은 4명" sub="임금 40" />
              <Group from={rowY(4)} to={rowY(8) + CELL_H} color="#64748b" text="기계·석탄" sub="50" />
              <Group from={rowY(9)} to={rowY(9) + CELL_H} color={COLORS.saved} text="절감 10" />
            </>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
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
