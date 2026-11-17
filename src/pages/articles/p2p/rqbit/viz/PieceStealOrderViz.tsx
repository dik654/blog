import SceneShell from "./SceneShell";

/**
 * 본문 대응: #peer-piece — PieceTracker::acquire_piece의 선택 순서.
 * B 평균 4초 → 10× 문턱 40초, 3× 문턱 12초. 10× steal → 새 일(priority → queue) → 3× steal → NoneAvailable.
 * 44초·39초는 본문 수치, 10초는 경계를 보이려는 가정.
 */
const AVERAGE = 4;
const TEN_X = AVERAGE * 10;
const THREE_X = AVERAGE * 3;
const AXIS_MAX = 50;

const W = 300;
const H = 92;
const LEFT = 16;
const RIGHT = 284;
const AXIS_Y = 60;
const tx = (seconds: number) => LEFT + (seconds / AXIS_MAX) * (RIGHT - LEFT);

type RowState = "idle" | "pass" | "decide" | "skip";

interface StealScene {
  label: string;
  summary: string;
  note: string;
  elapsed: number | null;
  rows: readonly { state: RowState; text: string }[];
  result: string;
}

const SCENES: readonly StealScene[] = [
  {
    label: "B의 평균이 문턱 두 개를 정합니다",
    summary: "4×10 = 40초 · 4×3 = 12초",
    note: "기준은 기존 owner A가 아니라 일을 가져오려는 B의 평균 piece 시간 4초입니다. 10배와 3배는 v9.0.1 source의 현재 threshold이며 보편적인 BitTorrent 규칙은 아닙니다.",
    elapsed: null,
    rows: [
      { state: "idle", text: "40초 이상 붙잡힌 piece?" },
      { state: "idle", text: "priority → queue에서 찾기" },
      { state: "idle", text: "12초 이상 붙잡힌 piece?" },
    ],
    result: "아직 판단 전",
  },
  {
    label: "A가 44초째 붙잡고 있으면",
    summary: "44 ≥ 40 → 첫 칸에서 결정",
    note: "첫 10× 문턱을 넘었으므로 새 일을 찾기 전에 B가 piece 1을 가져옵니다. Owner는 A에서 B로 바뀌고 시작 시각을 다시 잽니다. A의 같은 piece request는 cancel합니다.",
    elapsed: 44,
    rows: [
      { state: "decide", text: "44 ≥ 40 → steal" },
      { state: "skip", text: "보지 않음" },
      { state: "skip", text: "보지 않음" },
    ],
    result: "Stolen(piece 1, A)",
  },
  {
    label: "39초이고 B가 받을 새 일이 있으면",
    summary: "39 < 40 → 새 일 예약",
    note: "39초는 10× 문턱에 못 미칩니다. 그래서 active stream이 곧 읽을 priority piece, 그다음 일반 queue에서 B가 가진 piece를 찾고, 찾으면 그 piece를 예약합니다. A의 piece 1은 그대로 A가 맡습니다.",
    elapsed: 39,
    rows: [
      { state: "pass", text: "39 < 40 → 다음 칸" },
      { state: "decide", text: "찾음 → 예약" },
      { state: "skip", text: "보지 않음" },
    ],
    result: "Reserved(새 piece)",
  },
  {
    label: "39초이고 새 일이 없으면",
    summary: "39 ≥ 12 → 마지막 칸에서 steal",
    note: "priority piece와 queued piece가 모두 없으면 마지막 3× branch에서 덜 극단적으로 느린 owner까지 다시 봅니다. 39초는 12초를 넘으므로 B가 piece 1을 가져옵니다.",
    elapsed: 39,
    rows: [
      { state: "pass", text: "39 < 40 → 다음 칸" },
      { state: "pass", text: "없음 → 다음 칸" },
      { state: "decide", text: "39 ≥ 12 → steal" },
    ],
    result: "Stolen(piece 1, A)",
  },
  {
    label: "10초이고 새 일이 없으면 (가정)",
    summary: "10 < 12 → 줄 일이 없음",
    note: "10초는 두 문턱 모두에 못 미치는 경계를 보이려고 고른 가정입니다. 새 일도 없고 steal할 piece도 없으므로 B는 이번에 piece를 얻지 못합니다.",
    elapsed: 10,
    rows: [
      { state: "pass", text: "10 < 40 → 다음 칸" },
      { state: "pass", text: "없음 → 다음 칸" },
      { state: "pass", text: "10 < 12 → 해당 없음" },
    ],
    result: "NoneAvailable",
  },
];

const ROW_TITLES = ["① 10× steal", "② 새 일 예약", "③ 3× steal"] as const;

const ROW_STYLE: Record<RowState, string> = {
  idle: "border-border text-muted-foreground",
  pass: "border-border text-muted-foreground",
  decide: "border-[#2563eb] bg-[#2563eb]/10 font-bold text-foreground",
  skip: "border-dashed border-border/60 text-muted-foreground/60",
};

export default function PieceStealOrderViz() {
  return (
    <SceneShell
      eyebrow="piece 선택 순서"
      title="Peer B는 세 칸을 위에서부터 보고 처음 걸린 칸에서 멈춥니다"
      description="Steal은 다른 peer가 오래 붙잡은 in-flight piece의 담당을 B로 옮기는 일입니다. 축은 A가 piece 1을 붙잡은 시간(초)이고, 번호 붙은 세 칸은 rqbit 9.0.1의 확인 순서입니다. B는 unchoke 상태이며 piece 1을 가졌고 lock을 얻을 수 있다고 둡니다."
      ariaLabel="평균 4초인 peer B가 10배 문턱 40초, 새 일 예약, 3배 문턱 12초 순서로 piece를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={tx(THREE_X)} y={AXIS_Y - 14} width={tx(TEN_X) - tx(THREE_X)} height={14} fill="#d97706" opacity={0.14} />
              <rect x={tx(TEN_X)} y={AXIS_Y - 14} width={RIGHT - tx(TEN_X)} height={14} fill="#dc2626" opacity={0.14} />
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, THREE_X, TEN_X, AXIS_MAX].map((tick) => (
                <g key={tick}>
                  <line x1={tx(tick)} x2={tx(tick)} y1={AXIS_Y - 14} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={tx(tick)} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick}초</text>
                </g>
              ))}
              <text x={tx(THREE_X) + 3} y={AXIS_Y - 18} fontSize={11} fill="#b45309">3× = 12초</text>
              <text x={tx(TEN_X) + 3} y={AXIS_Y - 18} fontSize={11} fill="#b91c1c">10× = 40초</text>
              <text x={LEFT} y={AXIS_Y + 30} fontSize={11} fill="#64748b">A가 piece 1을 붙잡은 시간</text>
              {scene.elapsed !== null && (
                <g>
                  <line x1={tx(scene.elapsed)} x2={tx(scene.elapsed)} y1={14} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} />
                  <circle cx={tx(scene.elapsed)} cy={AXIS_Y} r={3.5} fill="#2563eb" />
                  <text x={tx(scene.elapsed)} y={11} textAnchor={scene.elapsed > 30 ? "end" : "start"} dx={scene.elapsed > 30 ? -5 : 5} fontSize={12} fontWeight={700} fill="#2563eb">
                    {scene.elapsed}초
                  </text>
                </g>
              )}
            </svg>
            <div className="min-w-0">
            <ol className="mt-3 space-y-1.5 lg:mt-0">
              {scene.rows.map((row, index) => (
                <li key={ROW_TITLES[index]} className={`grid grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-3 py-2 text-xs leading-5 sm:text-sm ${ROW_STYLE[row.state]}`}>
                  <span className="font-semibold">{ROW_TITLES[index]}</span>
                  <span className="break-keep">{row.text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">결과</span>
              <strong className="font-mono text-[#2563eb]">{scene.result}</strong>
            </p>
            </div>
          </div>
        );
      }}
    />
  );
}
