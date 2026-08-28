import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import type { ReactElement } from "react";

/**
 * 한 mechanism: 출력 C 가 threadblock tile → warp tile → MMA tile 로 좁혀지고,
 * 마지막에 lane 하나가 register 에 드는 accumulator fragment 가 드러나는 과정.
 * 각 장면은 한 층의 분할이다. stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = [
  "C 4096×4096 → threadblock tile",
  "Threadblock tile → warp tile",
  "Warp tile → MMA tile",
  "MMA tile → lane 의 fragment",
] as const;

const NOTES = [
  "C 를 128×128 threadblock tile 로 자르면 32×32 = 1024 개입니다. 한 threadblock 이 tile 하나를 맡고 A 128×K, B K×128 조각을 shared memory 로 올립니다.",
  "Threadblock tile 을 warp 4개가 2×2 로 나눠 각 warp 가 64×64 를 맡습니다. Warp 는 shared memory 의 조각을 register fragment 로 올립니다.",
  "Warp tile 64×64 를 m16n8k16 명령 모양 16×8 로 덮으면 4×8 = 32 개이고, bK 32 를 K 16 으로 두 번 돌아 k-iteration 마다 64 번 명령을 냅니다.",
  "16×8 fp32 accumulator 128개를 32 lane 이 4개씩 듭니다. Lane 5 (몫 1, 나머지 1)는 행 1 과 행 9 의 열 2·3 을 듭니다. 이것이 register fragment 이며 epilogue 가 이 흩어진 모양을 다시 모읍니다.",
] as const;

const VIEW_W = 640;
const VIEW_H = 300;

/** 격자 panel: 왼쪽 큰 사각형 하나에 n×m 격자를 그리고 highlight 칸을 강조한다. */
function Grid({
  x,
  y,
  w,
  h,
  cols,
  rows,
  highlight,
  strong,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  highlight?: { c: number; r: number };
  strong?: boolean;
}) {
  const cw = w / cols;
  const rh = h / rows;
  const lines: ReactElement[] = [];
  for (let c = 1; c < cols; c += 1) {
    lines.push(<line key={`c${c}`} x1={x + c * cw} y1={y} x2={x + c * cw} y2={y + h} className="stroke-border" strokeWidth={strong ? 1 : 0.5} />);
  }
  for (let r = 1; r < rows; r += 1) {
    lines.push(<line key={`r${r}`} x1={x} y1={y + r * rh} x2={x + w} y2={y + r * rh} className="stroke-border" strokeWidth={strong ? 1 : 0.5} />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-muted/40 stroke-foreground/60" strokeWidth={1} />
      {lines}
      {highlight ? (
        <rect x={x + highlight.c * cw} y={y + highlight.r * rh} width={cw} height={rh} className="fill-primary/35 stroke-primary" strokeWidth={1.25} />
      ) : null}
    </g>
  );
}

/** 16×8 MMA tile 의 lane 배치. 각 칸에 lane 번호를 색으로 구분하고 lane 5 의 4칸을 강조한다. */
function MmaTile({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cw = w / 8;
  const rh = h / 16;
  const cells: ReactElement[] = [];
  for (let r = 0; r < 16; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const lane = (r % 8) * 4 + Math.floor(c / 2);
      const mine = lane === 5;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * cw}
          y={y + r * rh}
          width={cw}
          height={rh}
          className={mine ? "fill-primary/70 stroke-background" : lane % 2 === 0 ? "fill-muted stroke-background" : "fill-muted-foreground/25 stroke-background"}
          strokeWidth={0.5}
        />,
      );
    }
  }
  return (
    <g>
      {cells}
      <rect x={x} y={y} width={w} height={h} className="fill-none stroke-foreground/60" strokeWidth={1} />
    </g>
  );
}

export default function CutlassGemmHierarchyAndCuteLayoutsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="CUTLASS GEMM tile hierarchy"
      title="Tile 이 세 번 좁혀지면 lane 하나가 드는 accumulator 조각이 드러납니다"
      description="각 장면은 한 층의 분할입니다. 왼쪽은 그 층의 전체, 오른쪽은 강조된 조각을 다음 층에서 다시 자른 모습입니다. 마지막 장면의 진한 칸은 lane 5 가 register 에 드는 fp32 4개입니다."
      note="128×128×32 threadblock tile, 2×2 warp, Ampere mma.m16n8k16 기준입니다. K 방향 진행과 A·B fragment 는 그리지 않았고, lane 색은 짝·홀 lane 만 구분했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GEMM 출력이 threadblock tile, warp tile, MMA tile, lane fragment 로 좁혀지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full min-w-[32rem]" role="img" aria-label={SCENES[active]}>
              {/* 왼쪽: 이번 층의 전체 */}
              {active === 0 ? <Grid x={24} y={40} w={220} h={220} cols={32} rows={32} highlight={{ c: 9, r: 6 }} /> : null}
              {active === 1 ? <Grid x={24} y={40} w={220} h={220} cols={2} rows={2} highlight={{ c: 0, r: 0 }} strong /> : null}
              {active === 2 ? <Grid x={24} y={40} w={220} h={220} cols={8} rows={4} highlight={{ c: 2, r: 1 }} strong /> : null}
              {active === 3 ? <MmaTile x={64} y={40} w={140} h={220} /> : null}

              {/* 화살표 */}
              <line x1={262} y1={150} x2={318} y2={150} className="stroke-primary" strokeWidth={1.25} />
              <polygon points="318,145 328,150 318,155" className="fill-primary" />

              {/* 오른쪽: 강조된 조각을 다음 층에서 다시 자른 모습 */}
              {active === 0 ? <Grid x={360} y={40} w={220} h={220} cols={2} rows={2} highlight={{ c: 0, r: 0 }} strong /> : null}
              {active === 1 ? <Grid x={360} y={40} w={220} h={220} cols={8} rows={4} highlight={{ c: 2, r: 1 }} strong /> : null}
              {active === 2 ? <MmaTile x={400} y={40} w={140} h={220} /> : null}
              {active === 3 ? (
                <g>
                  <rect x={360} y={70} width={220} height={160} className="fill-none stroke-border" strokeWidth={1} />
                  {[0, 1, 2, 3].map((v) => (
                    <g key={v}>
                      <rect x={376 + v * 52} y={110} width={40} height={40} className="fill-primary/70 stroke-primary" strokeWidth={1} />
                      <text x={396 + v * 52} y={134} textAnchor="middle" className="fill-background font-mono text-[11px]">
                        c{v}
                      </text>
                      <text x={396 + v * 52} y={172} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                        {v < 2 ? `(1,${2 + v})` : `(9,${v})`}
                      </text>
                    </g>
                  ))}
                  <text x={470} y={96} textAnchor="middle" className="fill-foreground font-mono text-[11px]">
                    lane 5 register
                  </text>
                  <text x={470} y={210} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                    (row, col) · fp32 ×4
                  </text>
                </g>
              ) : null}

              {/* 라벨 */}
              <text x={24} y={28} className="fill-foreground font-mono text-[11px]">
                {["C 4096×4096", "threadblock 128×128", "warp 64×64", "mma 16×8"][active]}
              </text>
              <text x={24} y={282} className="fill-muted-foreground font-mono text-[10px]">
                {["32×32 tiles", "2×2 warps", "4×8 mma", "32 lanes × 4"][active]}
              </text>
              <text x={360} y={28} className="fill-foreground font-mono text-[11px]">
                {["threadblock 128×128", "warp 64×64", "mma 16×8", "fragment"][active]}
              </text>
              <text x={360} y={282} className="fill-muted-foreground font-mono text-[10px]">
                {["global → shared", "shared → register", "register → tensor core", "accumulator"][active]}
              </text>
            </svg>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
