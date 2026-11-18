import SceneShell from "./SceneShell";

/**
 * 본문 대응: #divisor — fₘ·fₙ·(ℓ/v)의 영점·극점 기록을 위치별 칸에 더합니다.
 * fₙ: n(P)−(nP)−(n−1)(O), ℓᵤ,ᵥ/vᵤ₊ᵥ: (U)+(V)−(U+V)−(O), U=mP, V=nP.
 * 합: (m+n)(P)−((m+n)P)−(m+n−1)(O). O 칸: −(m−1)−(n−1)−1 = −(m+n−1).
 */
const COLS = ["(P)", "(mP)", "(nP)", "(kP)", "(O)"] as const;

type Row = { name: string; cells: readonly string[]; from: number };
const ROWS: readonly Row[] = [
  { name: "fₘ", cells: ["+m", "−1", "", "", "−(m−1)"], from: 0 },
  { name: "fₙ", cells: ["+n", "", "−1", "", "−(n−1)"], from: 1 },
  { name: "ℓ/v", cells: ["", "+1", "+1", "−1", "−1"], from: 2 },
];
const SUM = ["+k", "0", "0", "−1", "−(k−1)"] as const;
const CANCEL_COLS = new Set([1, 2]);

const SCENES = [
  { label: "fₘ의 기록", summary: "m(P) − (mP) − (m−1)(O)", note: "칸 하나가 곡선 위의 한 위치이고, 칸의 수는 그 위치에서 0이 되는 횟수(+) 또는 무한대로 커지는 횟수(−)입니다. (P)는 좌표가 아니라 위치 표식입니다." },
  { label: "fₙ을 곱하기", summary: "함수를 곱하면 기록은 더해짐", note: "두 함수를 곱하면 같은 위치의 횟수끼리 더해집니다. 이 상태에서는 (mP)와 (nP)에 −1이 하나씩 남아 있습니다." },
  { label: "선의 비를 곱하기", summary: "+(mP)와 +(nP)가 −1을 지움", note: "U=mP, V=nP를 잇는 선과 수직선의 비는 (U)+(V)−(U+V)−(O)를 가져오고, U+V가 kP입니다. 새 +1 두 개가 남아 있던 −1 두 개와 각각 상쇄됩니다." },
  { label: "합친 기록", summary: "k(P) − (kP) − (k−1)(O)", note: "k=m+n이므로 남은 기록 (m+n)(P)−((m+n)P)−(m+n−1)(O)는 fₘ₊ₙ의 모양과 같습니다. 두 배 단계는 m=n이라 (mP)와 (nP)가 같은 칸으로 합쳐지지만, 그 칸의 합도 −1−1+2=0입니다." },
] as const;

function Cell({ text, tone }: { text: string; tone: "plain" | "cancel" | "sum" | "empty" }) {
  const cls =
    tone === "cancel"
      ? "text-muted-foreground line-through decoration-[#dc2626]"
      : tone === "sum"
        ? "font-bold text-[#1d4ed8]"
        : "";
  return <span className={`block whitespace-nowrap py-2 text-center font-mono text-[11px] sm:text-sm ${cls}`}>{text || "·"}</span>;
}

export default function DivisorCancelViz() {
  return (
    <SceneShell
      eyebrow="영점·극점 장부"
      title="선의 비를 곱하면 중간 두 점의 기록이 지워집니다"
      description="열은 곡선 위의 위치, 줄은 곱하는 함수입니다. 칸의 +는 그 위치에서 0이 되는 횟수, −는 무한대로 커지는 횟수입니다. 이 기록 전체를 divisor라고 부릅니다. 칸을 좁게 쓰려고 k=m+n으로 적었습니다."
      ariaLabel="fₘ, fₙ, 선의 비를 곱할 때 divisor 기록이 상쇄되는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[2rem_repeat(5,minmax(0,1fr))] gap-x-1 border-b border-border pb-1 text-[11px] text-muted-foreground sm:text-xs">
            <span />
            {COLS.map((c) => (
              <span key={c} className="break-all text-center font-mono">{c}</span>
            ))}
          </div>
          {ROWS.map((row) => {
            const on = active >= row.from;
            return (
              <div key={row.name} className={`grid grid-cols-[2rem_repeat(5,minmax(0,1fr))] gap-x-1 border-b border-border/60 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-20"}`}>
                <span className="py-2 text-xs font-semibold sm:text-sm">{row.name}</span>
                {row.cells.map((c, i) => (
                  <Cell key={i} text={c} tone={active >= 2 && CANCEL_COLS.has(i) && c !== "" ? "cancel" : "plain"} />
                ))}
              </div>
            );
          })}
          <div className={`grid grid-cols-[2rem_repeat(5,minmax(0,1fr))] gap-x-1 transition-opacity duration-300 ${active === 3 ? "opacity-100" : "opacity-20"}`}>
            <span className="py-2 text-xs font-semibold sm:text-sm">합</span>
            {SUM.map((c, i) => (
              <Cell key={i} text={c} tone="sum" />
            ))}
          </div>
        </div>
      )}
    />
  );
}
