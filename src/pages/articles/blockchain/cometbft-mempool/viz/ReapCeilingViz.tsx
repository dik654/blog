import SceneShell from "./SceneShell";

/**
 * 본문 대응: #clist — ReapMaxBytesMaxGas는 list 앞에서부터 encoded size와 GasWanted를 따로 누적하고,
 * 어느 한도를 넘긴 transaction에서 읽기를 끝내며 그 transaction은 반환 slice에서 뺀다.
 * 모든 크기·gas·한도는 설명용 가정이다. encoded = raw + 3 (가정).
 * MaxBytes 400: 133 → 266 → 266+141 = 407 > 400 → c 제외, 반환 [a, b]. raw 합은 130+130+138 = 398.
 * MaxGas 120: a 100 → b 150 > 120 → b 제외, 반환 [a].
 */
const TXS = [
  { name: "a", raw: 130, encoded: 133, gas: 100 },
  { name: "b", raw: 130, encoded: 133, gas: 50 },
  { name: "c", raw: 138, encoded: 141, gas: 60 },
  { name: "d", raw: 120, encoded: 123, gas: 40 },
] as const;

type Status = "in" | "out" | "unread";

const SCENES = [
  { label: "a를 읽음", summary: "bytes 133 · gas 100", maxGas: 300, status: ["in", "unread", "unread", "unread"], bytes: 133, gas: 100, note: "Reap은 이 node의 list 맨 앞부터 읽습니다. a의 block data용 encoded size 133과 GasWanted 100을 각각 누계에 더합니다. 두 누계 모두 한도 아래입니다." },
  { label: "b를 읽음", summary: "bytes 266 · gas 150", maxGas: 300, status: ["in", "in", "unread", "unread"], bytes: 266, gas: 150, note: "b를 더하면 bytes 누계 266, gas 누계 150입니다. 아직 두 한도 모두 넘지 않았습니다." },
  { label: "c가 bytes 한도를 넘음", summary: "266 + 141 = 407 > 400", maxGas: 300, status: ["in", "in", "out", "unread"], bytes: 407, gas: 150, note: "c의 encoded size를 더하면 407로 MaxBytes 400을 넘습니다. c는 반환 slice에서 빠지고 읽기가 끝나므로 d는 보지 않습니다. raw 길이만 더했다면 398이라 c까지 들어간다고 잘못 셌을 것입니다." },
  { label: "gas 한도가 먼저라면", summary: "MaxGas 120 · 100 + 50 = 150", maxGas: 120, status: ["in", "out", "unread", "unread"], bytes: 266, gas: 150, note: "같은 list에서 MaxGas만 120으로 바꾸면 b의 bytes 누계 266은 통과하지만 gas 누계 150이 120을 넘습니다. 이번에는 b에서 끝나고 반환은 a 하나입니다." },
] as const;

const MAX_BYTES = 400;

function Gauge({ label, value, max, scaleMax }: { label: string; value: number; max: number; scaleMax: number }) {
  const pct = (v: number) => (Math.min(v, scaleMax) / scaleMax) * 100;
  const over = value > max;
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <strong className={`font-mono ${over ? "text-red-700 dark:text-red-400" : ""}`}>
          {value} / {max}
        </strong>
      </div>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="mt-1 block h-4 w-full" aria-hidden>
        <rect x={0} y={1} width={100} height={10} fill="#e2e8f0" />
        <rect x={0} y={1} width={pct(Math.min(value, max))} height={10} fill="#2563eb" />
        {over && <rect x={pct(max)} y={1} width={pct(value) - pct(max)} height={10} fill="#dc2626" />}
        <line x1={pct(max)} x2={pct(max)} y1={0} y2={12} stroke="#0f172a" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

const STATUS_TEXT: Record<Status, string> = { in: "반환", out: "한도 초과 · 제외", unread: "읽지 않음" };

export default function ReapCeilingViz() {
  return (
    <SceneShell
      eyebrow="ReapMaxBytesMaxGas"
      title="앞에서부터 bytes와 gas를 따로 더하다가, 한도를 넘긴 transaction에서 멈춥니다"
      description="한 줄이 local list의 transaction 하나입니다. a~d의 크기, GasWanted, MaxBytes 400·MaxGas 300/120, encoded size = raw + 3은 모두 설명용 가정입니다(가정)."
      ariaLabel="list 앞에서부터 encoded bytes와 GasWanted 누계를 더하다가 한도를 넘긴 transaction을 빼고 멈추는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1.75rem_repeat(3,minmax(0,1fr))_minmax(0,1.4fr)] gap-px bg-border p-px text-[11px] leading-5 sm:text-xs">
              {["tx", "raw", "encoded", "gas", "결과"].map((head) => (
                <div key={head} className="bg-background px-0.5 py-1.5 text-center text-[10px] font-bold text-muted-foreground sm:text-xs">{head}</div>
              ))}
              {TXS.map((tx, index) => {
                const status = (scene.status as readonly Status[])[index];
                const tone = status === "in" ? "text-primary" : status === "out" ? "text-red-700 dark:text-red-400" : "text-muted-foreground/60";
                return (
                  <div key={tx.name} className={`contents ${status === "unread" ? "opacity-50" : ""}`}>
                    <div className="bg-background p-1.5 text-center font-mono font-bold">{tx.name}</div>
                    <div className="bg-background p-1.5 text-center font-mono">{tx.raw}</div>
                    <div className="bg-background p-1.5 text-center font-mono">{tx.encoded}</div>
                    <div className="bg-background p-1.5 text-center font-mono">{tx.gas}</div>
                    <div className={`bg-background p-1.5 text-center font-bold break-keep ${tone}`}>{STATUS_TEXT[status]}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-3">
              <Gauge label="encoded bytes 누계 / MaxBytes" value={scene.bytes} max={MAX_BYTES} scaleMax={440} />
              <Gauge label="GasWanted 누계 / MaxGas" value={scene.gas} max={scene.maxGas} scaleMax={330} />
            </div>
          </div>
        );
      }}
    />
  );
}
