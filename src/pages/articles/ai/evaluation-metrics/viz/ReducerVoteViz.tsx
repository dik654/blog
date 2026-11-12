import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #reducer — 환자 A 영상 100개(loss 1), B·C 영상 1개씩(loss 0).
 * 행 평균 100/102 ≈ .98, 환자별로 먼저 줄인 뒤 평균 (1+0+0)/3 ≈ .33.
 */
const A_ROWS = 100;
const ROW_TOTAL = A_ROWS + 2;
const ROW_MEAN = A_ROWS / ROW_TOTAL;
const PATIENT_MEAN = (1 + 0 + 0) / 3;

const LOSS_ONE = "#d97706";
const LOSS_ZERO = "#94a3b8";
const ACCENT = "#2563eb";

type Mode = "row" | "patient";

const SCENES: readonly {
  label: string;
  summary: string;
  mode: Mode;
  showUnit: boolean;
  result: number | null;
  note: string;
}[] = [
  {
    label: "관측 행 102개",
    summary: "A 100행 · B 1행 · C 1행",
    mode: "row",
    showUnit: false,
    result: null,
    note: "칸 하나가 영상 한 장, 즉 관측 행 하나입니다. 본문 예처럼 A의 100행은 loss 1, B와 C의 한 행은 loss 0입니다. 판단을 받는 환자는 세 명뿐입니다.",
  },
  {
    label: "행을 바로 평균하면",
    summary: "100 / 102 ≈ .98",
    mode: "row",
    showUnit: false,
    result: ROW_MEAN,
    note: "행마다 한 표를 주면 102표 가운데 100표가 환자 A의 것입니다. 결과 .98은 사실상 환자 A 한 명의 점수이고, B와 C의 결과는 거의 보이지 않습니다.",
  },
  {
    label: "환자 안에서 먼저 줄이기",
    summary: "m_A = 1 · m_B = 0 · m_C = 0",
    mode: "patient",
    showUnit: true,
    result: null,
    note: "Reducer의 첫 단계는 같은 환자에 속한 행을 그 환자의 값 하나로 묶는 것입니다. A의 100행은 모두 1이라 m_A = 1, B와 C는 각각 0입니다. 이제 표는 환자 수만큼, 세 표입니다.",
  },
  {
    label: "환자 세 명을 평균",
    summary: "(1 + 0 + 0) / 3 ≈ .33",
    mode: "patient",
    showUnit: true,
    result: PATIENT_MEAN,
    note: "환자마다 한 표씩 주면 결과는 .33입니다. 같은 loss 102개에서 집계 순서만 바꿨는데 .98과 .33으로 갈립니다. 환자별 결정을 평가하려면 이 순서를 따릅니다.",
  },
];

function Cells({ showUnit }: { showUnit: boolean }) {
  const cell = 9;
  const pitch = 11;
  const gridX = 14;
  const gridY = 26;
  const singles = [
    { name: "B", x: 186 },
    { name: "C", x: 252 },
  ];
  return (
    <svg viewBox="0 0 320 178" role="img" aria-label="환자 A의 관측 100행과 환자 B, C의 관측 1행" className="mx-auto block h-auto w-full max-w-[22rem]">
      <text x={gridX} y="16" className="fill-foreground text-[10px] font-bold">
        환자 A · 100행
      </text>
      {Array.from({ length: A_ROWS }, (_, index) => (
        <rect
          key={index}
          x={gridX + (index % 10) * pitch}
          y={gridY + Math.floor(index / 10) * pitch}
          width={cell}
          height={cell}
          rx="1.5"
          fill={LOSS_ONE}
        />
      ))}
      {singles.map((item) => (
        <g key={item.name}>
          <text x={item.x + 4.5} y="16" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
            {item.name} · 1행
          </text>
          <rect x={item.x} y={gridY + 45} width={cell} height={cell} rx="1.5" fill="none" stroke={LOSS_ZERO} strokeWidth="1" />
        </g>
      ))}
      <g opacity={showUnit ? 1 : 0.12}>
        <line x1={gridX} y1="146" x2={gridX + 9 * pitch + cell} y2="146" stroke={ACCENT} strokeWidth="1" />
        <text x={gridX + 54} y="166" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
          m_A = 1
        </text>
        {singles.map((item) => (
          <g key={item.name}>
            <line x1={item.x - 14} y1="146" x2={item.x + 23} y2="146" stroke={ACCENT} strokeWidth="1" />
            <text x={item.x + 4.5} y="166" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              m_{item.name} = 0
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function VoteBar({ mode }: { mode: Mode }) {
  const shares =
    mode === "row"
      ? [
          { name: "A", votes: A_ROWS, color: LOSS_ONE },
          { name: "B", votes: 1, color: LOSS_ZERO },
          { name: "C", votes: 1, color: "#64748b" },
        ]
      : [
          { name: "A", votes: 1, color: LOSS_ONE },
          { name: "B", votes: 1, color: LOSS_ZERO },
          { name: "C", votes: 1, color: "#64748b" },
        ];
  const total = shares.reduce<number>((sum, item) => sum + item.votes, 0);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-bold">{mode === "row" ? "표 나누기: 행마다 한 표" : "표 나누기: 환자마다 한 표"}</span>
        <span className="font-mono text-muted-foreground">총 {total}표</span>
      </div>
      <div className="mt-1.5 flex h-4 min-w-0 overflow-hidden rounded-sm border border-border">
        {shares.map((item) => (
          <div
            key={item.name}
            className="h-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(item.votes / total) * 100}%`, backgroundColor: item.color }}
          />
        ))}
      </div>
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {shares.map((item) => `${item.name} ${item.votes}표`).join(" · ")}
      </p>
    </div>
  );
}

function ResultBar({ value }: { value: number | null }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs">
      <span className="font-bold">결과</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/50">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(value ?? 0) * 100}%`, backgroundColor: ACCENT }}
        />
      </div>
      <span className="text-right font-mono font-bold">{value === null ? "−" : `.${Math.round(value * 100)}`}</span>
    </div>
  );
}

export default function ReducerVoteViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((item) => item.label);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Reducer 순서"
      title="같은 loss 102개, 집계 순서만 바꾸면 .98과 .33"
      description="Loss는 관측 하나에 매긴 오차 값입니다. 칠한 칸은 loss 1, 빈 칸은 loss 0이며 숫자는 본문 예를 그대로 씁니다. 결과 막대는 0에서 1까지입니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="환자 A 100행, B와 C 1행씩에서 행 평균과 환자 평균 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0 space-y-4">
          <Cells showUnit={scene.showUnit} />
          <VoteBar mode={scene.mode} />
          <ResultBar value={scene.result} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
