import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace-air — 세 행(1,6,10)에 전이 조건 두 개와 경계 조건 두 개가 어느 행에 걸리는지,
 * 각 조건이 0이 되는 행이 곧 나누는 식의 인수가 되고 몫이 남는다는 흐름.
 * 모든 계산은 17로 나눈 나머지: N(T)=10T(T−1) → 몫 10, (v−1)/T=8T+14, (v−10)/(T−2)=8T+13,
 * 가중치 1·2·3(가정) → 10+2(8T+14)+3(8T+13)=40T+77 ≡ 6T+9.
 * 마지막 장면은 #security-cost의 "마지막 경계를 빼면 공개 답 11" 경우.
 */

type Col = "trans" | "first" | "last";

interface Cell {
  text: string;
  tone: "zero" | "off" | "plain";
}

const ROWS = [
  { t: 0, v: 1 },
  { t: 1, v: 6 },
  { t: 2, v: 10 },
] as const;

const COLS: readonly { key: Col; name: string; divisor: string; quotient: string; weight: string }[] = [
  { key: "trans", name: "전이", divisor: "÷ T(T−1)", quotient: "10", weight: "×1" },
  { key: "first", name: "첫 경계", divisor: "÷ T", quotient: "8T+14", weight: "×2" },
  { key: "last", name: "끝 경계", divisor: "÷ (T−2)", quotient: "8T+13", weight: "×3" },
];

const DETAIL: Record<Col, readonly Cell[]> = {
  trans: [
    { text: "6−4·1−2=0", tone: "zero" },
    { text: "10−4·6−3≡0", tone: "zero" },
    { text: "다음 상태 없음", tone: "off" },
  ],
  first: [
    { text: "1−1=0", tone: "zero" },
    { text: "—", tone: "off" },
    { text: "—", tone: "off" },
  ],
  last: [
    { text: "—", tone: "off" },
    { text: "—", tone: "off" },
    { text: "10−10=0", tone: "zero" },
  ],
};

const OUTLINE: Record<Col, readonly Cell[]> = {
  trans: [
    { text: "적용", tone: "plain" },
    { text: "적용", tone: "plain" },
    { text: "다음 상태 없음", tone: "off" },
  ],
  first: [
    { text: "v = 1 ?", tone: "plain" },
    { text: "—", tone: "off" },
    { text: "—", tone: "off" },
  ],
  last: [
    { text: "—", tone: "off" },
    { text: "—", tone: "off" },
    { text: "v = 10 ?", tone: "plain" },
  ],
};

const SCENES = [
  { label: "세 행과 세 조건", summary: "전이 2칸 · 경계 2칸", note: "전이 조건은 다음 상태가 있는 행 0과 1에만 걸립니다. 첫 경계는 행 0의 값이 1인지, 끝 경계는 행 2의 값이 공개 답 10인지 묻습니다. 행 2에는 다음 실행이 없으므로 전이 조건을 적용하지 않습니다." },
  { label: "전이 차이가 0인 행", summary: "N(T)=10T(T−1) → 몫 10", note: "규칙 v(T+1)−4v(T)−(T+2)를 전개하면 10T²+7T=10T(T−1)입니다. 행 0과 1에서 0이므로 T와 T−1이 모두 인수이고, T(T−1)로 정확히 나누어 몫 10이 남습니다." },
  { label: "첫 경계", summary: "(v−1)/T = 8T+14", note: "v(T)−1은 행 0에서 0입니다. 그래서 T로 정확히 나누어지고 몫은 8T+14입니다." },
  { label: "끝 경계", summary: "(v−10)/(T−2) = 8T+13", note: "v(T)−10은 행 2에서 0입니다. T−2로 정확히 나누어지고 몫은 8T+13입니다. 이 조건이 내부 표와 공개 답 10을 잇습니다." },
  { label: "가중치로 합침", summary: "10+2(8T+14)+3(8T+13) ≡ 6T+9", note: "세 몫에 가정한 가중치 1, 2, 3을 곱해 더하면 40T+77이고, 17로 나눈 나머지에서 6T+9입니다. 실제 가중치는 표를 고정한 뒤 정합니다." },
  { label: "끝 경계를 빼면", summary: "공개 답 11도 막지 못함", note: "끝 경계 열이 없으면 남은 조건은 표(1,6,10)로 모두 통과합니다. 공개 답을 11이라고 적어도 그 답과 표를 비교하는 칸이 없습니다(10절)." },
] as const;

const toneClass = (tone: Cell["tone"], focus: boolean) =>
  tone === "zero"
    ? focus
      ? "font-bold text-emerald-700 dark:text-emerald-400"
      : "text-emerald-700/80 dark:text-emerald-400/80"
    : tone === "off"
      ? "text-muted-foreground/60"
      : "text-foreground";

export default function ConstraintRowsViz() {
  return (
    <SceneShell
      eyebrow="AIR 조건과 몫"
      title="조건이 0이 되는 행이 나누는 식이 됩니다"
      description="가로줄은 시간 행 0·1·2, 세로줄은 조건 세 개입니다. 칸에는 그 행에서 조건을 계산한 값이 들어가며, 모든 계산은 17로 나눈 나머지입니다(≡는 나머지가 같다는 뜻). 아래 두 줄은 그 조건을 나누는 식과 정확한 몫입니다."
      ariaLabel="세 시간 행에 걸리는 전이·첫 경계·끝 경계 조건과 각 몫, 가중합"
      scenes={SCENES}
      render={(active) => {
        const shown = (col: Col) =>
          active === 0 ? false : active >= 4 ? true : col === "trans" ? active >= 1 : col === "first" ? active >= 2 : active >= 3;
        const focusCol: Col | null = active === 1 ? "trans" : active === 2 ? "first" : active === 3 ? "last" : null;
        const dropped = (col: Col) => active === 5 && col === "last";
        return (
          <div className="min-w-0 font-mono text-[11px] sm:text-sm">
            <div className="grid grid-cols-[2rem_2.5rem_repeat(3,minmax(0,1fr))] gap-px overflow-hidden rounded-lg border border-border bg-border">
              <div className="bg-muted/60 px-1 py-2 text-center font-sans font-semibold">T</div>
              <div className="bg-muted/60 px-1 py-2 text-center font-sans font-semibold">v</div>
              {COLS.map((col) => (
                <div
                  key={col.key}
                  className={`px-1 py-2 text-center font-sans font-semibold ${focusCol === col.key ? "bg-primary/10 text-primary" : "bg-muted/60"} ${dropped(col.key) ? "line-through opacity-50" : ""}`}
                >
                  {col.name}
                </div>
              ))}
              {ROWS.map((row, r) => (
                <div key={row.t} className="contents">
                  <div className="bg-background px-1 py-2 text-center">{row.t}</div>
                  <div className="bg-background px-1 py-2 text-center font-bold">{row.v}</div>
                  {COLS.map((col) => {
                    const cell = dropped(col.key) ? { text: "검사 없음", tone: "off" as const } : (shown(col.key) ? DETAIL : OUTLINE)[col.key][r];
                    return (
                      <div key={col.key} className={`flex min-h-[2.5rem] items-center justify-center px-1 py-2 text-center leading-4 ${focusCol === col.key ? "bg-primary/5" : "bg-background"} ${toneClass(cell.tone, focusCol === col.key)} ${/[가-힣]/.test(cell.text) ? "font-sans" : ""}`}>
                        {cell.text}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="col-span-2 bg-muted/30 px-1 py-2 text-center font-sans text-muted-foreground">나눔</div>
              {COLS.map((col) => (
                <div key={col.key} className={`px-1 py-2 text-center ${focusCol === col.key ? "bg-primary/5 font-bold" : "bg-muted/30"} ${shown(col.key) && !dropped(col.key) ? "" : "text-muted-foreground/40"}`}>
                  {shown(col.key) && !dropped(col.key) ? col.divisor : "·"}
                </div>
              ))}
              <div className="col-span-2 bg-muted/30 px-1 py-2 text-center font-sans text-muted-foreground">몫</div>
              {COLS.map((col) => (
                <div key={col.key} className={`px-1 py-2 text-center ${focusCol === col.key ? "bg-primary/5 font-bold text-primary" : "bg-muted/30"} ${shown(col.key) && !dropped(col.key) ? "" : "text-muted-foreground/40"}`}>
                  {shown(col.key) && !dropped(col.key) ? (active === 4 ? `${col.weight} ${col.quotient}` : col.quotient) : "·"}
                </div>
              ))}
            </div>
            <div className="mt-3 flex min-h-[2.5rem] flex-wrap items-center justify-center gap-x-2 rounded-lg border border-dashed border-border px-3 py-2 text-center">
              {active === 4 ? (
                <span>
                  10 + 2(8T+14) + 3(8T+13) = 40T+77 ≡ <strong className="text-primary">6T+9</strong> <span className="font-sans text-muted-foreground">(가중치 1·2·3 가정)</span>
                </span>
              ) : active === 5 ? (
                <span className="font-sans">
                  공개 답 주장 <strong className="text-red-700 dark:text-red-400">11</strong> <span className="font-sans text-muted-foreground">↔ 표의 끝값 10을 비교하는 칸 없음</span>
                </span>
              ) : (
                <span className="font-sans text-muted-foreground">합성 다항식: 세 몫을 모두 구한 뒤 합칩니다</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
