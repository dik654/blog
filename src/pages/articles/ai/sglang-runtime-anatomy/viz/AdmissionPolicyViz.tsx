import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 4,096칸 KV pool 한 줄에 같은 요청(입력 200, 상한 1,000)을 세 장부로 넣어 본다.
 * 한 mechanism: 아직 쓰지 않은 출력을 몇 칸으로 미리 셈하느냐가 동시에 받는 요청 수를 정한다.
 * 진한 칸은 실제로 KV를 쓴 칸, 옅은 칸은 장부에만 올린 예약이다.
 */
const POOL = 4096;
const W = 460;
const X0 = 10;

const SCENES = ["끝까지 예약", "이번 칸만", "5번째 decode", "SGLang 첫 pass", "SGLang 둘째 pass"] as const;

interface Segment {
  written: number;
  reserved: number;
}

/** 요청 행 하나. count가 있으면 같은 모양의 요청 count개를 한 행으로 접는다. */
interface Row {
  name: string;
  count?: number;
  written: number;
  reserved: number;
  /** 장부에서 덜어 낸 몫(상한 999 − 699.3 = 299.7) */
  cut?: number;
  evicted?: boolean;
  fresh?: boolean;
}

interface SceneState {
  segments: readonly Segment[];
  rows: readonly Row[];
  waiting?: { name: string; need: number; free: number };
  waitingLabel: string;
  note: string;
}

const repeat = (count: number, segment: Segment) => Array.from({ length: count }, () => segment);

const STATES: readonly SceneState[] = [
  {
    segments: repeat(3, { written: 200, reserved: 1000 }),
    rows: ["A", "B", "C"].map((name) => ({ name, written: 200, reserved: 1000 })),
    waiting: { name: "D", need: 1200, free: 496 },
    waitingLabel: "4번째 요청: 1,200칸 필요, 496칸 남음",
    note: "TensorRT-LLM의 기본 정책처럼 입력과 출력 상한을 합친 1,200칸을 받을 때 잡습니다. 세 요청이 3,600칸을 묶지만 지금 쓴 칸은 600칸입니다.",
  },
  {
    segments: repeat(20, { written: 200, reserved: 0 }),
    rows: [{ name: "1–20", count: 20, written: 200, reserved: 0 }],
    waitingLabel: "남은 96칸, decode마다 20칸 필요",
    note: "vLLM처럼 이번 step에 쓸 칸만 요구하면 입력 200칸씩 20개가 들어갑니다. 출력이 자라는 몫은 아무도 잡아 두지 않았습니다.",
  },
  {
    segments: repeat(19, { written: 204, reserved: 0 }),
    rows: [
      { name: "1–19", count: 19, written: 204, reserved: 0 },
      { name: "20", written: 204, reserved: 0, evicted: true },
    ],
    waitingLabel: "20번째 요청 선점: 204칸 반환, 다시 계산할 몫",
    note: "네 번 decode하면 4,080칸이 차고 16칸이 남습니다. 다섯 번째 decode는 20칸이 필요하므로 마지막 요청을 빼고 그 KV를 버립니다.",
  },
  {
    segments: repeat(3, { written: 0, reserved: 1201 }),
    rows: ["A", "B", "C"].map((name) => ({ name, written: 0, reserved: 1201 })),
    waiting: { name: "D", need: 1201, free: 493 },
    waitingLabel: "D는 1,201칸이 필요한데 493칸만 남아 대기",
    note: "SGLang도 새 요청은 입력 200+상한 1,000+page 1칸=1,201칸으로 심사합니다. 첫 pass에서는 끝까지 예약과 같은 3개입니다.",
  },
  {
    segments: [...repeat(3, { written: 200, reserved: 699.3 }), { written: 0, reserved: 1201 }],
    rows: [
      ...["A", "B", "C"].map((name) => ({ name, written: 200, reserved: 699.3, cut: 299.7 })),
      { name: "D", written: 0, reserved: 1201, fresh: true },
    ],
    waiting: { name: "E", need: 1201, free: 197.1 },
    waitingLabel: "E는 1,201칸이 필요한데 197.1칸만 남아 대기",
    note: "실행 중인 A·B·C의 남은 출력 999개는 비율 0.7을 곱해 699.3칸으로 셈합니다. 남은 몫이 1,398.1칸이라 D가 들어오고 4개가 됩니다.",
  },
];

function scale(tokens: number) {
  return (tokens / POOL) * W;
}

/** 요청 행의 가로 눈금: 새 요청 한 개의 최대 장부 1,201칸이 행 전체 폭이다. */
const ROW_MAX = 1201;
const pct = (tokens: number) => `${(tokens / ROW_MAX) * 100}%`;
const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString();

function RequestRow({ row, sceneKey, reduced }: { row: Row; sceneKey: number; reduced: boolean }) {
  return (
    <div className="grid grid-cols-[2.6rem_minmax(0,1fr)_6.2rem] items-center gap-2 sm:grid-cols-[3.2rem_minmax(0,1fr)_8rem]">
      <span className={`font-mono text-[11px] font-bold ${row.evicted ? "text-[#dc2626] line-through" : ""}`}>
        {row.name}
        {row.count ? <span className="font-normal text-muted-foreground"> ×{row.count}</span> : null}
      </span>
      <div className="relative flex h-5 overflow-hidden rounded-[2px] border border-border">
        <span
          className={`h-full ${row.evicted ? "bg-[#dc2626]/25" : "bg-[#2563eb]"}`}
          style={{ width: pct(row.written) }}
        />
        <span className="h-full bg-[#93c5fd]/60" style={{ width: pct(row.reserved) }} />
        {row.cut ? (
          <motion.span
            key={`cut-${sceneKey}`}
            className="h-full border border-dashed border-[#2563eb]/60"
            style={{ width: pct(row.cut) }}
            initial={reduced ? false : { backgroundColor: "rgba(147,197,253,0.6)" }}
            animate={{ backgroundColor: "rgba(147,197,253,0)" }}
            transition={{ delay: reduced ? 0 : 0.4, duration: reduced ? 0 : 0.9 }}
          />
        ) : null}
      </div>
      <span className="text-right font-mono text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
        {row.evicted ? `${row.written} 반환` : `${fmt(row.written)} | ${fmt(row.reserved)}`}
        {row.fresh ? <span className="text-[#2563eb]"> 새로</span> : null}
      </span>
    </div>
  );
}

export default function AdmissionPolicyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const state = STATES[scenes.active];
  const written = state.segments.reduce((sum, s) => sum + s.written, 0);
  const reserved = state.segments.reduce((sum, s) => sum + s.reserved, 0);
  const free = POOL - written - reserved;
  const rects = state.segments.map((segment, index) => {
    const before = state.segments.slice(0, index).reduce((sum, s) => sum + s.written + s.reserved, 0);
    return { x: X0 + scale(before), ww: scale(segment.written), rw: scale(segment.reserved), index };
  });

  return (
    <VizFrame
      eyebrow="Admission ledger"
      title="미래 출력을 몇 칸으로 셈하느냐가 받는 요청 수를 정합니다"
      description="맨 위 막대 하나가 4,096칸 KV pool이고 그 아래 행이 요청 하나입니다. 진한 칸은 KV를 실제로 쓴 칸, 옅은 칸은 장부에만 잡은 예약, 점선은 비율 0.7로 덜어 낸 몫입니다."
      note="입력 200, 출력 상한 1,000, page 1칸, prefix 재사용 없음의 설명용 가정입니다. block 반올림은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 가지 예약 장부로 4,096칸 KV pool을 채우는 모습"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <h4 className="text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0</span>
            <span>4,096칸</span>
          </div>
          <svg viewBox="0 0 480 40" className="mt-1 w-full" role="img" aria-label={`쓴 칸 ${written}, 예약 ${Math.round(reserved * 10) / 10}, 남은 칸 ${Math.round(free * 10) / 10}`}>
            <rect x={X0} y={3} width={W} height={34} rx={2} fill="none" stroke="#9ca3af" strokeWidth={1} />
            {rects.map(({ x, ww, rw, index }) => (
              <g key={index}>
                {ww > 0 ? <rect x={x} y={3} width={Math.max(ww - 0.6, 0.4)} height={34} fill="#2563eb" /> : null}
                {rw > 0 ? (
                  <rect x={x + ww} y={3} width={Math.max(rw - 0.6, 0.4)} height={34} fill="#93c5fd" fillOpacity={0.55} />
                ) : null}
              </g>
            ))}
          </svg>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>요청 행 · 쓴 칸 | 예약 칸</span>
            <span>행 전체 = 1,201칸</span>
          </div>
          {/* 행 수가 장면마다 1~5개로 달라도 아래 요소가 움직이지 않게 다섯 행 높이를 고정한다 */}
          <div className="mt-1 h-[7.375rem] space-y-1">
            {state.rows.map((row) => (
              <RequestRow key={`${scenes.active}-${row.name}`} row={row} sceneKey={scenes.active} reduced={scenes.reducedMotion} />
            ))}
            {state.waiting ? (
              <div className="grid grid-cols-[2.6rem_minmax(0,1fr)_6.2rem] items-center gap-2 sm:grid-cols-[3.2rem_minmax(0,1fr)_8rem]">
                <span className="font-mono text-[11px] font-bold text-muted-foreground">{state.waiting.name} 대기</span>
                <div className="relative h-5 rounded-[2px] border border-dashed border-[#dc2626]/70" style={{ width: pct(state.waiting.need) }}>
                  <span className="absolute inset-y-0 left-0 bg-[#16a34a]/35" style={{ width: `${(state.waiting.free / state.waiting.need) * 100}%` }} />
                </div>
                <span className="text-right font-mono text-[10px] leading-4 text-[#dc2626] sm:text-[11px]">
                  {fmt(state.waiting.need)} &gt; 남은 {fmt(state.waiting.free)}
                </span>
              </div>
            ) : null}
          </div>
          <p className="mt-2 min-h-[2.5rem] text-xs font-bold leading-5 text-foreground sm:min-h-[1.25rem]">{state.waitingLabel}</p>

          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">실행 중</dt>
              <dd className="font-bold text-foreground">{state.segments.length}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">쓴 칸</dt>
              <dd className="font-bold text-foreground">{written.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">예약</dt>
              <dd className="font-bold text-foreground">{(Math.round(reserved * 10) / 10).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 칸</dt>
              <dd className="font-bold text-foreground">{(Math.round(free * 10) / 10).toLocaleString()}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
