import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import type { ReactElement } from "react";

/**
 * 한 mechanism: 같은 20개 tile 을 8개 SM 에 wave 단위로 올릴 때 마지막 wave 가 비는 것과,
 * Stream-K 가 k-iteration 을 균등하게 잘라 그 빈 시간을 없애는 과정.
 * 각 장면은 시간축(가로)에 SM 별 배정을 그린 Gantt 한 장. stage 높이는 고정.
 */
const SMS = 8;
const TILES = 20;
const KITERS = 4; // tile 하나의 k-iteration 수
const TOTAL = TILES * KITERS; // 80
const PER_SM = TOTAL / SMS; // 10

const SCENES = [
  "Wave 1 · tile 8개가 SM 8개를 채움",
  "Wave 3 · tile 4개만 남아 SM 4개가 놂",
  "Stream-K · iteration 80개를 10개씩",
  "Fixup · 잘린 tile 의 partial 합치기",
] as const;

const NOTES = [
  "Tile 0~7 이 SM 0~7 에 하나씩 올라갑니다. Tile 하나는 k-iteration 4개(칸 4개)이고, 모든 SM 이 같은 시각에 끝납니다.",
  "Wave 2 가 tile 8~15 를 처리한 뒤 wave 3 에는 tile 16~19 네 개만 남습니다. SM 4~7 은 wave 하나 동안 놀고, slot 24 가운데 20 만 일하니 낭비 17% 입니다.",
  "Stream-K 는 tile 20개 × 4 = 80 iteration 을 SM 8개에 10개씩 줍니다. SM 0 은 tile 0·1 전체와 tile 2 의 앞 절반, SM 1 은 tile 2 의 뒤 절반과 tile 3·4 를 맡아 모두 시각 10 에 끝납니다. 데이터 병렬의 12 보다 짧습니다.",
  "Tile 2·7·12·17 은 두 SM 이 나눠 계산했습니다. 앞 절반을 맡은 SM 이 accumulator 를 workspace 에 쓰고 barrier 를 올리면, 뒤 절반을 맡은 SM 이 그것을 읽어 더한 뒤 epilogue 를 한 번만 실행합니다.",
] as const;

const VIEW_W = 640;
const VIEW_H = 300;
const LEFT = 64;
const TOP = 36;
const ROW_H = 26;
const UNIT_W = 40; // iteration 1개의 폭 (12 iteration = 480px)

function tileClass(tile: number) {
  return tile % 2 === 0 ? "fill-primary/35 stroke-primary/70" : "fill-amber-500/40 stroke-amber-600/70";
}

/** 데이터 병렬 배정: wave w 에서 SM s 는 tile w*8+s 를 맡는다. */
function dataParallel(waves: number) {
  const cells: ReactElement[] = [];
  for (let w = 0; w < waves; w += 1) {
    for (let s = 0; s < SMS; s += 1) {
      const tile = w * SMS + s;
      const x = LEFT + w * KITERS * UNIT_W;
      const y = TOP + s * ROW_H;
      if (tile >= TILES) {
        cells.push(<rect key={`idle-${w}-${s}`} x={x} y={y + 4} width={KITERS * UNIT_W} height={ROW_H - 8} className="fill-none stroke-border" strokeDasharray="3 3" strokeWidth={1} />);
        continue;
      }
      cells.push(<rect key={`t-${w}-${s}`} x={x} y={y + 4} width={KITERS * UNIT_W} height={ROW_H - 8} className={tileClass(tile)} strokeWidth={1} />);
      cells.push(
        <text key={`l-${w}-${s}`} x={x + 6} y={y + ROW_H / 2 + 4} className="fill-foreground font-mono text-[10px]">
          t{tile}
        </text>,
      );
    }
  }
  return cells;
}

/** Stream-K 배정: SM s 는 iteration [10s, 10s+10) 를 맡고 tile 경계마다 조각이 갈린다. */
function streamK(showFixup: boolean) {
  const cells: ReactElement[] = [];
  for (let s = 0; s < SMS; s += 1) {
    const start = s * PER_SM;
    const end = start + PER_SM;
    let it = start;
    while (it < end) {
      const tile = Math.floor(it / KITERS);
      const tileEnd = Math.min(end, (tile + 1) * KITERS);
      const partial = it % KITERS !== 0 || tileEnd % KITERS !== 0;
      const x = LEFT + (it - start) * UNIT_W;
      const y = TOP + s * ROW_H;
      cells.push(
        <rect
          key={`sk-${s}-${it}`}
          x={x}
          y={y + 4}
          width={(tileEnd - it) * UNIT_W}
          height={ROW_H - 8}
          className={tileClass(tile)}
          strokeWidth={1}
          strokeDasharray={partial ? "3 2" : undefined}
        />,
      );
      cells.push(
        <text key={`skl-${s}-${it}`} x={x + 6} y={y + ROW_H / 2 + 4} className="fill-foreground font-mono text-[10px]">
          t{tile}
          {partial ? "*" : ""}
        </text>,
      );
      it = tileEnd;
    }
  }
  if (showFixup) {
    // 잘린 tile: 2 (SM0→SM1), 7 (SM2→SM3), 12 (SM4→SM5), 17 (SM6→SM7)
    for (let pair = 0; pair < 4; pair += 1) {
      const from = pair * 2;
      const x1 = LEFT + PER_SM * UNIT_W + 8;
      const y1 = TOP + from * ROW_H + ROW_H / 2;
      const y2 = TOP + (from + 1) * ROW_H + ROW_H / 2;
      cells.push(<line key={`fx-${pair}`} x1={x1} y1={y1} x2={x1} y2={y2 - 6} className="stroke-primary" strokeWidth={1.25} />);
      cells.push(<polygon key={`fxa-${pair}`} points={`${x1 - 4},${y2 - 8} ${x1 + 4},${y2 - 8} ${x1},${y2 - 2}`} className="fill-primary" />);
      cells.push(
        <text key={`fxt-${pair}`} x={x1 + 10} y={y2 - 6} className="fill-muted-foreground font-mono text-[10px]">
          partial → epilogue
        </text>,
      );
    }
  }
  return cells;
}

export default function CutlassCollectivesAndTileSchedulersViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const active = scenes.active;
  const timeUnits = active <= 1 ? 3 * KITERS : PER_SM;

  return (
    <VizFrame
      eyebrow="Tile scheduler · Stream-K"
      title="Tile 을 wave 로 올리면 마지막 wave 가 비고, k-iteration 을 나누면 모두가 같이 끝납니다"
      description="가로는 시간(k-iteration 단위), 세로는 SM 8개입니다. 칸 하나가 k-iteration 하나이고 tile 하나는 칸 4개입니다. 점선 칸은 노는 SM, 점선 테두리 조각은 두 SM 이 나눠 맡은 tile 입니다."
      note="SM 8개·tile 20개·k-iteration 4개로 줄인 예입니다. 본문의 132 SM·1024 tile·64 iteration 도 같은 산수이며, partial 교환의 memory 시간과 CUTLASS 의 hybrid(마지막 wave 만 Stream-K)는 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tile 이 SM 에 wave 단위로 배정되다 Stream-K 로 k-iteration 단위로 잘리는 과정"
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
              {Array.from({ length: SMS }).map((_, s) => (
                <text key={`sm-${s}`} x={8} y={TOP + s * ROW_H + ROW_H / 2 + 4} className="fill-muted-foreground font-mono text-[10px]">
                  SM {s}
                </text>
              ))}
              {/* 시간 눈금 */}
              {Array.from({ length: 13 }).map((_, t) => (
                <line key={`tick-${t}`} x1={LEFT + t * UNIT_W} y1={TOP - 6} x2={LEFT + t * UNIT_W} y2={TOP + SMS * ROW_H} className="stroke-border" strokeWidth={0.5} />
              ))}
              {[0, 4, 8, 12].map((t) => (
                <text key={`tl-${t}`} x={LEFT + t * UNIT_W + 2} y={TOP - 10} className="fill-muted-foreground font-mono text-[10px]">
                  {t}
                </text>
              ))}

              {active === 0 ? dataParallel(1) : null}
              {active === 1 ? dataParallel(3) : null}
              {active === 2 ? streamK(false) : null}
              {active === 3 ? streamK(true) : null}

              {/* 끝나는 시각 */}
              <line x1={LEFT + timeUnits * UNIT_W} y1={TOP - 6} x2={LEFT + timeUnits * UNIT_W} y2={TOP + SMS * ROW_H + 6} className="stroke-foreground" strokeWidth={1.25} />
              <text x={LEFT + timeUnits * UNIT_W - 4} y={TOP + SMS * ROW_H + 22} textAnchor="end" className="fill-foreground font-mono text-[11px]">
                {active <= 1 ? `종료 12 · slot ${active === 0 ? 8 : 24}` : "종료 10 · slot 80"}
              </text>
              <text x={LEFT} y={TOP + SMS * ROW_H + 22} className="fill-muted-foreground font-mono text-[11px]">
                {["wave 1", "wave 1·2·3", "SM 당 10 iteration", "잘린 tile 4개"][active]}
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
