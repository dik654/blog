import PayloadSceneShell from "./PayloadSceneShell";

/**
 * 본문 대응: #selection — pool 순서는 탐색 순서일 뿐이고, 남은 gas에 안 들어가는 거래는
 * dependent 거래와 함께 빠지며, gas·blob·encoded size는 한 점수로 합치지 않는다.
 * 숫자: #candidate 예시의 block gas limit 100,000과 거래 gas 21,000·40,000·30,000(합 91,000).
 * X(gas limit 50,000)와 X+1, 그리고 pool이 내준 순서는 설명용 가정이다.
 * 21,000 + 40,000 = 61,000 → 남은 39,000 < 50,000 → X 제외 → 61,000 + 30,000 = 91,000.
 */
const LIMIT = 100000;
const AXIS_MAX = 120000;

type Status = "wait" | "in" | "skip" | "drop";
type Check = "pass" | "fail" | "none" | "na";

interface Tx {
  id: string;
  gas: number;
  blob: boolean;
}

const POOL: readonly Tx[] = [
  { id: "A", gas: 21000, blob: false },
  { id: "B", gas: 40000, blob: false },
  { id: "X", gas: 50000, blob: false },
  { id: "X+1", gas: 0, blob: false },
  { id: "C", gas: 30000, blob: true },
];

interface SceneSpec {
  label: string;
  summary: string;
  note: string;
  status: readonly Status[];
  focus: number;
  used: number;
  overflow: number;
  checks: readonly [Check, Check, Check];
  texts?: readonly [string, string, string];
}

const SCENES: readonly SceneSpec[] = [
  {
    label: "첫 거래 A",
    summary: "0 + 21,000 ≤ 100,000",
    note: "Builder는 현재 pool이 내준 순서대로 거래를 하나씩 봅니다. A의 gas가 남은 공간에 들어가므로 실행하고, 사용량은 21,000이 됩니다.",
    status: ["in", "wait", "wait", "wait", "wait"],
    focus: 0,
    used: 21000,
    overflow: 0,
    checks: ["pass", "none", "pass"],
  },
  {
    label: "둘째 거래 B",
    summary: "21,000 + 40,000 = 61,000",
    note: "B도 들어갑니다. 이제 block gas limit 100,000 중 남은 공간은 39,000입니다.",
    status: ["in", "in", "wait", "wait", "wait"],
    focus: 1,
    used: 61000,
    overflow: 0,
    checks: ["pass", "none", "pass"],
  },
  {
    label: "X 초과",
    summary: "61,000 + 50,000 = 111,000 > 100,000",
    note: "X의 gas limit 50,000(가정)은 남은 39,000보다 큽니다. pool에서 C보다 앞에 있었어도 포함되지 않습니다. X와 X에 의존하는 거래(같은 sender의 다음 nonce인 X+1, 가정)가 iterator에서 함께 빠집니다.",
    status: ["in", "in", "skip", "drop", "wait"],
    focus: 2,
    used: 61000,
    overflow: 50000,
    checks: ["fail", "na", "na"],
  },
  {
    label: "Blob 거래 C",
    summary: "61,000 + 30,000 = 91,000",
    note: "C의 gas 30,000은 남은 39,000에 들어갑니다. Blob 수는 gas와 따로 활성 fork의 max blob count·user limit과 비교하고, sidecar가 BlobStore에 있는지와 fork에 맞는 형식인지도 따로 확인합니다(여기서는 통과했다고 가정).",
    status: ["in", "in", "skip", "drop", "in"],
    focus: 4,
    used: 91000,
    overflow: 0,
    checks: ["pass", "pass", "pass"],
  },
  {
    label: "세 공간 따로",
    summary: "gas 91,000 · blob · byte를 합산하지 않음",
    note: "결과 block에는 A·B·C가 들어가고 gas는 91,000을 씁니다. Gas, blob 수, Osaka 이후의 encoded RLP byte는 단위가 달라 각자의 한도와만 비교합니다. 하나의 점수로 더하지 않습니다.",
    status: ["in", "in", "skip", "drop", "in"],
    focus: -1,
    used: 91000,
    overflow: 0,
    checks: ["pass", "pass", "pass"],
    texts: ["91,000 / 100,000 gas", "blob 개수 / blob 한도", "block byte / RLP 한도"],
  },
];

const X0 = 12;
const X1 = 348;
const gx = (gas: number) => X0 + (gas / AXIS_MAX) * (X1 - X0);
const fmt = (n: number) => n.toLocaleString("en-US");

const STATUS_STYLE: Record<Status, { box: string; text: string; tag: string }> = {
  wait: { box: "border-border text-muted-foreground", text: "", tag: "대기" },
  in: { box: "border-primary bg-primary/5", text: "text-primary", tag: "포함" },
  skip: { box: "border-dashed border-red-600", text: "text-red-700 dark:text-red-400", tag: "gas 초과" },
  drop: { box: "border-dashed border-red-600/60 text-muted-foreground", text: "text-red-700 dark:text-red-400", tag: "함께 제외" },
};

const CHECK_TEXT: Record<Check, string> = {
  pass: "통과",
  fail: "초과 → 제외",
  none: "blob 없음",
  na: "—",
};

const SEG_COLOR = ["#2563eb", "#3b82f6", "", "", "#0891b2"] as const;

function GasBar({ scene }: { scene: SceneSpec }) {
  const included = POOL.map((tx, i) => ({ tx, i })).filter(({ i }) => scene.status[i] === "in");
  const segments = included.reduce<{ id: string; start: number; end: number; color: string }[]>((acc, { tx, i }) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    return [...acc, { id: tx.id, start, end: start + tx.gas, color: SEG_COLOR[i] }];
  }, []);
  return (
    <svg viewBox="0 0 360 92" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`gas 사용량 ${fmt(scene.used)} / ${fmt(LIMIT)}`}>
      <text x={X0} y={12} fontSize={10} fill="#64748b">Execution gas (block gas limit 100,000)</text>
      <rect x={X0} y={22} width={gx(LIMIT) - X0} height={26} fill="none" stroke="#94a3b8" strokeWidth={1} rx={3} />
      {segments.map((seg) => (
        <g key={seg.id}>
          <rect x={gx(seg.start)} y={22} width={gx(seg.end) - gx(seg.start)} height={26} fill={seg.color} opacity={0.85} />
          <text x={(gx(seg.start) + gx(seg.end)) / 2} y={39} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
            {seg.id} {fmt(seg.end - seg.start)}
          </text>
        </g>
      ))}
      {scene.overflow > 0 && (
        <g>
          <rect x={gx(scene.used)} y={24} width={gx(scene.used + scene.overflow) - gx(scene.used)} height={22} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={(gx(scene.used) + gx(scene.used + scene.overflow)) / 2} y={39} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">X 50,000</text>
        </g>
      )}
      <line x1={gx(LIMIT)} x2={gx(LIMIT)} y1={16} y2={56} stroke="#0f172a" strokeWidth={1.25} />
      <text x={gx(LIMIT)} y={68} textAnchor="middle" fontSize={9} fill="#475569">한도 100,000</text>
      <text x={X0} y={68} fontSize={9} fill="#475569">0</text>
      <text x={X0} y={86} fontSize={10} fontWeight={700} fill="#2563eb">
        사용 {fmt(scene.used)} · 남은 공간 {fmt(LIMIT - scene.used)}
      </text>
    </svg>
  );
}

export default function GasBudgetSelectionViz() {
  return (
    <PayloadSceneShell
      eyebrow="거래 선택 · 한 build 시도"
      title="Pool 순서대로 보지만, 남은 공간에 들어가는 거래만 포함됩니다"
      description="위 칸은 pool이 내준 순서, 막대는 block gas 사용량, 아래 세 칸은 단위가 다른 세 검사입니다. Gas 숫자는 아래 공식의 예시와 같고, X·X+1과 순서는 가정입니다."
      note="Dependent 거래는 앞 거래가 있어야 실행할 수 있는 거래입니다. 여기서는 같은 sender의 다음 nonce를 예로 들었습니다(가정). Gas 비교는 다음 거래의 gas limit 기준이고, 예시는 단순화를 위해 gas limit과 실제 사용량을 같게 두었습니다(가정)."
      ariaLabel="pool 순서대로 거래를 검사하며 gas 한도를 넘는 거래와 그 의존 거래가 빠지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-5 gap-1.5">
              {POOL.map((tx, i) => {
                const style = STATUS_STYLE[scene.status[i]];
                return (
                  <div key={tx.id} className={`min-w-0 rounded-md border px-1 py-2 text-center ${style.box} ${i === scene.focus ? "ring-1 ring-primary" : ""}`}>
                    <span className="block font-mono text-xs font-bold">{tx.id}</span>
                    <span className="block text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                      {tx.id === "X+1" ? "X에 의존" : `${fmt(tx.gas)}${tx.blob ? " · blob" : ""}`}
                    </span>
                    <span className={`block text-[9px] font-bold leading-4 sm:text-[10px] ${style.text}`}>{style.tag}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground">← pool이 내준 탐색 순서 (가정)</p>
            <GasBar scene={scene} />
            <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] leading-4 sm:text-xs">
              {(["Execution gas", "Blob 수·sidecar", "Encoded size"] as const).map((title, k) => {
                const check = scene.checks[k];
                return (
                  <div key={title} className="min-w-0 bg-background px-1 py-2">
                    <strong className="block break-keep">{title}</strong>
                    <span className={`mt-1 block break-keep ${check === "fail" ? "font-bold text-red-700 dark:text-red-400" : check === "pass" ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      {scene.texts ? scene.texts[k] : k === 2 && check === "pass" ? "RLP 한도 이내 (가정)" : CHECK_TEXT[check]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
