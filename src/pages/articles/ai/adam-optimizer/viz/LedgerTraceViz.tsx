import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 변화율 2, −2가 두 장부에 남기는 값.
 * 방향: 0.1×2=0.2, 0.9×0.2+0.1×(−2)=0.18−0.2=−0.02.
 * 제곱: 0.001×4=0.004, 0.999×0.004+0.001×4=0.003996+0.004=0.007996.
 */
interface Ledger {
  past: number;
  fresh: number;
  sum: number;
  pastText: string;
  freshText: string;
  sumText: string;
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  dir: Ledger;
  sq: Ledger;
}[] = [
  {
    label: "빈 장부에서 시작",
    summary: "방향 0 · 제곱 0",
    note: "두 장부의 초기값은 0으로 정했습니다(가정). 아직 들어온 변화율이 없어 어느 막대도 없습니다.",
    dir: { past: 0, fresh: 0, sum: 0, pastText: "0", freshText: "0", sumText: "0" },
    sq: { past: 0, fresh: 0, sum: 0, pastText: "0", freshText: "0", sumText: "0" },
  },
  {
    label: "첫 변화율 2",
    summary: "방향 0.2 · 제곱 0.004",
    note: "방향 장부에는 2의 0.1배가, 제곱 장부에는 2를 제곱한 4의 0.001배가 들어갑니다. 직전 값이 0이라 남은 과거는 아직 없습니다.",
    dir: { past: 0, fresh: 0.2, sum: 0.2, pastText: "0", freshText: "+0.2", sumText: "+0.2" },
    sq: { past: 0, fresh: 0.004, sum: 0.004, pastText: "0", freshText: "0.004", sumText: "0.004" },
  },
  {
    label: "둘째 변화율 −2",
    summary: "방향 −0.02 · 제곱 0.007996",
    note: "방향 장부에서는 남은 과거 +0.18과 새 신호 −0.2가 반대로 뻗어 −0.02만 남습니다. 제곱 장부에서는 −2도 제곱하면 4라서 두 조각이 같은 쪽으로 쌓입니다.",
    dir: { past: 0.18, fresh: -0.2, sum: -0.02, pastText: "+0.18", freshText: "−0.2", sumText: "−0.02" },
    sq: { past: 0.003996, fresh: 0.004, sum: 0.007996, pastText: "0.003996", freshText: "0.004", sumText: "0.007996" },
  },
];

const DIR_SCALE = 0.25;
const SQ_SCALE = 0.008;
const PAST = "#64748b";
const FRESH = "#d97706";
const SUM = "#2563eb";
const ROW = "grid grid-cols-[4.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm";

function SignedRow({ label, value, text, color, strong = false }: { label: string; value: number; text: string; color: string; strong?: boolean }) {
  const half = (Math.abs(value) / DIR_SCALE) * 50;
  return (
    <div className={ROW}>
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 rounded-sm" style={{ left: `${value < 0 ? 50 - half : 50}%`, width: `${half}%`, backgroundColor: color }} />
        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/50" />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{text}</span>
    </div>
  );
}

function StackRow({ label, parts, text, strong = false }: { label: string; parts: readonly { value: number; color: string }[]; text: string; strong?: boolean }) {
  return (
    <div className={ROW}>
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="flex h-4 min-w-0 overflow-hidden rounded-sm bg-muted/40">
        {parts.map((part, index) => (
          <div key={index} className="h-full" style={{ width: `${(part.value / SQ_SCALE) * 100}%`, backgroundColor: part.color }} />
        ))}
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{text}</span>
    </div>
  );
}

export default function LedgerTraceViz() {
  return (
    <SceneShell
      eyebrow="두 장부 계산"
      title="2와 −2가 한쪽에서는 지워지고 다른 쪽에서는 쌓입니다"
      description="새 값은 남은 과거와 새 신호의 합입니다. 방향 막대는 가운데 선이 0, 제곱 막대는 왼쪽 끝이 0이며 눈금이 달라 서로 비교하지 않습니다. 2와 −2는 가정입니다."
      ariaLabel="변화율 2와 마이너스 2가 방향 장부와 제곱 장부에 남기는 값"
      scenes={SCENES}
      render={(active) => {
        const { dir, sq } = SCENES[active];
        return (
          <div className="min-w-0 space-y-5">
            <div className="grid grid-cols-2 gap-2">
              {[{ g: "2", at: 1 }, { g: "−2", at: 2 }].map(({ g, at }) => (
                <div key={g} className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 sm:text-sm ${active === at ? "border-primary bg-background font-semibold" : active > at ? "border-border" : "border-dashed border-border/60 text-muted-foreground"}`}>
                  <span className="block font-mono">{g} → 제곱 4</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">방향 장부: 직전 값의 0.9 + 새 변화율의 0.1</p>
              <SignedRow label="남은 과거" value={dir.past} text={dir.pastText} color={PAST} />
              <SignedRow label="새 신호" value={dir.fresh} text={dir.freshText} color={FRESH} />
              <SignedRow label="새 값" value={dir.sum} text={dir.sumText} color={SUM} strong />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">제곱 장부: 직전 값의 0.999 + 새 제곱의 0.001</p>
              <StackRow label="남은 과거" parts={[{ value: sq.past, color: PAST }]} text={sq.pastText} />
              <StackRow label="새 신호" parts={[{ value: sq.fresh, color: FRESH }]} text={sq.freshText} />
              <StackRow label="새 값" parts={[{ value: sq.past, color: PAST }, { value: sq.fresh, color: FRESH }]} text={sq.sumText} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
