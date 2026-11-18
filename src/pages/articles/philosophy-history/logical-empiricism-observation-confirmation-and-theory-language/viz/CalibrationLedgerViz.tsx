import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 10회 중 8회 적중(80%), 실패 2회 모두 표시가 실제보다 1.5도 높음.
 * 시험 3: 표시 21.0(2절) − 1.5 = 실제 19.5(용어 예시) → ‘20도 초과’ 입력 불성립.
 * 다른 실패 1회의 표시값은 글에 없으므로 온도선에 놓지 않는다.
 */
const SCENES = [
  { label: "첫 장부", summary: "8 / 10 = 80%", note: "첫 장부에서는 10회 가운데 8회가 예측과 맞아 적중률이 80%입니다. 칸은 결과별로 모아 놓았고, 어긋난 2회 가운데 하나가 2절의 시험 3입니다." },
  { label: "실패 2회의 공통점", summary: "표시 = 실제 + 1.5도", note: "별도 온도계 기록을 보니 실패 2회 모두 표시 온도가 실제보다 1.5도 높았습니다. 이 기록이 나오면 ‘센서가 정확하다’는 보조 가정이 흔들립니다." },
  { label: "시험 3을 온도선에 놓습니다", summary: "21.0 − 1.5 = 19.5", note: "표시창 21.0도는 20.0을 넘지만, 1.5도를 빼면 실제 온도는 19.5도입니다. 19.5는 20.0보다 크지 않으므로 ‘20도를 넘었다’는 입력 자체가 성립하지 않습니다." },
  { label: "어긋남이 옮겨 간 자리", summary: "법칙의 반례 → 입력 불성립", note: "시험 3은 법칙이 틀린 사례가 아니라 법칙의 조건이 갖춰지지 않은 시험이 됩니다. 다른 실패 1회는 글에 표시값이 없어 실제 온도가 20.0을 넘었는지 이 그림에서 정하지 않았습니다." },
  { label: "그래도 증명은 아닙니다", summary: "새 조건 · 새 예측", note: "보정으로 어긋남을 설명했다고 경보 법칙이 모든 상황에서 참이라고 증명된 것은 아닙니다. 더 넓은 온도와 전원 조건에서 새 예측을 만들고 시험해야 합니다." },
] as const;

const HITS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

/** 온도선 18.5 ~ 22.0도를 SVG x 좌표로 바꿉니다. */
const MIN_T = 18.5;
const MAX_T = 22;
const LEFT = 24;
const RIGHT = 336;
const x = (t: number) => LEFT + ((t - MIN_T) / (MAX_T - MIN_T)) * (RIGHT - LEFT);
const TICKS = [19, 20, 21, 22] as const;

function Cell({ kind, label }: { kind: "hit" | "miss" | "input" | "open"; label: string }) {
  const tone =
    kind === "hit"
      ? "border-green-700/60 bg-green-600/10"
      : kind === "miss"
        ? "border-red-600 bg-red-600/10"
        : kind === "input"
          ? "border-dashed border-amber-600 bg-amber-500/10"
          : "border-dashed border-red-600";
  const mark = kind === "hit" ? "✓" : kind === "miss" ? "✕" : kind === "input" ? "−" : "?";
  return (
    <div className={`flex min-w-0 flex-col items-center rounded border px-0.5 py-1 text-center ${tone}`}>
      <span className="font-mono text-sm font-bold">{mark}</span>
      <span className="text-[10px] leading-4 text-muted-foreground [word-break:keep-all]">{label}</span>
    </div>
  );
}

function Ledger({ step }: { step: number }) {
  const moved = step >= 3;
  return (
    <div className="min-w-0 space-y-2">
      <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
        {HITS.map((hit) => (
          <Cell key={hit} kind="hit" label="맞음" />
        ))}
        <Cell kind={moved ? "input" : "miss"} label={moved ? "시험 3 입력 불성립" : "시험 3 어긋남"} />
        <Cell kind={moved ? "open" : "miss"} label={moved ? "다른 1회 확인 중" : "어긋남"} />
      </div>
      <div className={`grid grid-cols-2 gap-2 text-xs ${step >= 1 ? "" : "opacity-30"}`}>
        <div className="col-start-2 rounded-lg border border-red-600/70 px-2 py-1 leading-5">
          <span className="block text-muted-foreground">별도 온도계 기록</span>
          <span className="font-semibold">실패 2회 모두 표시가 실제보다 1.5도 높음</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-border px-1 py-1">
          <span className="block text-muted-foreground">맞음</span>
          <span className="font-mono font-semibold">8</span>
        </div>
        <div className="rounded-lg border border-border px-1 py-1">
          <span className="block text-muted-foreground">{moved ? "어긋남(미확정)" : "어긋남"}</span>
          <span className="font-mono font-semibold">{moved ? "1" : "2"}</span>
        </div>
        <div className={`rounded-lg border px-1 py-1 ${moved ? "border-amber-600" : "border-border/40 text-muted-foreground/50"}`}>
          <span className="block text-muted-foreground">입력 불성립</span>
          <span className="font-mono font-semibold">{moved ? "1" : "0"}</span>
        </div>
      </div>
    </div>
  );
}

function Thermometer() {
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="온도선 위에 기준 20.0도, 표시 21.0도, 실제 19.5도를 놓은 그림">
        <rect x={x(20)} y={30} width={RIGHT - x(20)} height={56} fill="#2563eb" opacity={0.08} />
        <text x={x(21.1)} y={24} fontSize={12} fill="#2563eb">
          20.0 초과 구간
        </text>
        <line x1={LEFT} y1={86} x2={RIGHT} y2={86} stroke="#64748b" strokeWidth={1} />
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} y1={82} x2={x(tick)} y2={90} stroke="#64748b" strokeWidth={1} />
            <text x={x(tick)} y={106} fontSize={12} textAnchor="middle" fill="#64748b">
              {tick}
            </text>
          </g>
        ))}
        <line x1={x(20)} y1={30} x2={x(20)} y2={86} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
        <circle cx={x(21)} cy={60} r={6} fill="#dc2626" />
        <text x={x(21)} y={48} fontSize={12} textAnchor="middle" fill="#dc2626">
          표시 21.0
        </text>
        <circle cx={x(19.5)} cy={60} r={6} fill="#16a34a" />
        <text x={x(19.5)} y={48} fontSize={12} textAnchor="middle" fill="#16a34a">
          실제 19.5
        </text>
        <line x1={x(21) - 9} y1={60} x2={x(19.5) + 11} y2={60} stroke="#64748b" strokeWidth={1} markerEnd="url(#calib-arrow)" />
        <text x={(x(21) + x(19.5)) / 2} y={76} fontSize={11} textAnchor="middle" fill="#64748b">
          −1.5
        </text>
        <text x={180} y={130} fontSize={12} textAnchor="middle" fill="#64748b">
          온도(도) · 시험 3
        </text>
        <defs>
          <marker id="calib-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#64748b" />
          </marker>
        </defs>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs leading-5">
        <div className="rounded-lg border border-red-600/70 px-2 py-1">
          <span className="block text-muted-foreground">표시만 보면</span>
          <span className="font-semibold">21.0 &gt; 20.0 → 입력 성립, 울려야 함</span>
        </div>
        <div className="rounded-lg border border-green-700/70 px-2 py-1">
          <span className="block text-muted-foreground">보정하면</span>
          <span className="font-semibold">19.5 ≤ 20.0 → 입력 불성립</span>
        </div>
      </div>
    </div>
  );
}

function Untested() {
  return (
    <div className="min-w-0 space-y-2 text-xs sm:text-sm">
      <div className="rounded-lg border border-border px-2 py-2">
        <span className="block text-muted-foreground">지금까지 시험한 범위</span>
        <span className="font-semibold">지금까지의 10회 (맞음 8 · 시험 3 입력 불성립 · 1회 미확정)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-dashed border-primary px-2 py-2">
          <span className="block text-muted-foreground">아직 시험 안 함</span>
          <span className="font-semibold">더 넓은 온도</span>
        </div>
        <div className="rounded-lg border border-dashed border-primary px-2 py-2">
          <span className="block text-muted-foreground">아직 시험 안 함</span>
          <span className="font-semibold">다른 전원 조건</span>
        </div>
      </div>
      <p className="rounded-lg border border-primary bg-primary/10 px-2 py-2 text-center font-semibold">새 예측을 먼저 적고 → 그 조건에서 시험</p>
    </div>
  );
}

export default function CalibrationLedgerViz() {
  return (
    <SceneShell
      eyebrow="보정 전후의 장부"
      title="표시 21.0도가 실제 19.5도로 바뀌면 실패가 다른 칸으로 옮겨 갑니다"
      description="✓는 예측과 맞은 시험, ✕는 어긋난 시험, −는 ‘20도 초과’라는 입력이 갖춰지지 않은 시험, ?는 아직 정하지 않은 시험입니다. 숫자는 2·3절과 용어 예시의 값을 그대로 씁니다."
      ariaLabel="열 번의 경보 시험에서 적중 8회와 실패 2회, 센서 1.5도 오차, 시험 3의 실제 온도 19.5도, 실패의 재분류, 남은 시험 조건을 보이는 다섯 장면"
      scenes={SCENES}
      render={(active) => (active === 2 ? <Thermometer /> : active === 4 ? <Untested /> : <Ledger step={active} />)}
    />
  );
}
