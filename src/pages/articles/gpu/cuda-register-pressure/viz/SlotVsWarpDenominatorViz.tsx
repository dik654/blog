import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #occupancy-wave — grid 300 blocks, 132 SM × 2 blocks = 264자리, 다음 회차 36개.
 * 36/264 = 13.636%는 block 자리 이용률. 8 warps/block, 64 warps/SM을 그대로 쓰면(가정)
 * 288/8,448 = 3.409%가 하드웨어 최대 warp 대비 비율이다.
 */
const SM = 132;
const BLOCK_SEATS = SM * 2;
const GRID = 300;
const SECOND_WAVE = GRID - BLOCK_SEATS;
const WARPS_PER_BLOCK = 8;
const HW_WARPS = SM * 64;
const PLACEABLE_WARPS = BLOCK_SEATS * WARPS_PER_BLOCK;
const SECOND_WARPS = SECOND_WAVE * WARPS_PER_BLOCK;
const pct = (part: number, whole: number) => (part / whole) * 100;

function Row({ title, value, children }: { title: string; value: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span>{title}</span>
        <span className="font-mono font-bold text-primary">{value}</span>
      </div>
      <div className="relative mt-1.5 h-6 border border-border bg-background">{children}</div>
    </div>
  );
}

export default function SlotVsWarpDenominatorViz() {
  return (
    <VizFrame
      eyebrow="분모"
      title="같은 36 blocks도 무엇으로 나누느냐에 따라 13.636%와 3.409%가 됩니다"
      description="SM 132개에 2 blocks씩이면 자리는 264개입니다. 첫 막대는 grid 300 blocks의 구성이고, 아래 두 막대는 전체 길이가 각 분모입니다. 진한 부분이 다음 회차에 남은 36 blocks입니다."
      note="아래 줄은 앞의 256-thread block(8 warps)과 SM당 최대 64 warps를 이 예에 그대로 쓴다고 놓은 계산입니다(가정). 특정 profiler metric의 출력이 아닙니다."
    >
      <div className="space-y-4">
        <Row title={`grid ${GRID} blocks: 첫 회차 ${BLOCK_SEATS} + 다음 회차 ${SECOND_WAVE}`} value={`${GRID} blocks`}>
          <div className="absolute inset-y-0 left-0 bg-muted-foreground/25" style={{ width: `${pct(BLOCK_SEATS, GRID)}%` }} />
          <div className="absolute inset-y-0 right-0 bg-primary/50" style={{ width: `${pct(SECOND_WAVE, GRID)}%` }} />
        </Row>
        <Row title={`다음 회차 · block 자리 ${SECOND_WAVE}/${BLOCK_SEATS}`} value="13.636%">
          <div className="absolute inset-y-0 left-0 bg-primary/50" style={{ width: `${pct(SECOND_WAVE, BLOCK_SEATS)}%` }} />
        </Row>
        <Row title={`다음 회차 · 하드웨어 warp ${SECOND_WARPS}/${HW_WARPS.toLocaleString("en-US")} (가정)`} value="3.409%">
          <div className="absolute inset-y-0 left-0 border-r border-dashed border-primary" style={{ width: `${pct(PLACEABLE_WARPS, HW_WARPS)}%` }} />
          <div className="absolute inset-y-0 left-0 bg-primary/50" style={{ width: `${pct(SECOND_WARPS, HW_WARPS)}%` }} />
        </Row>
        <p className="text-xs leading-5 text-muted-foreground">
          세 번째 막대의 점선은 이 설정에서 놓을 수 있는 {PLACEABLE_WARPS.toLocaleString("en-US")} warps, 곧 25% 지점입니다.
        </p>
      </div>
    </VizFrame>
  );
}
