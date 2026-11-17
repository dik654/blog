import SceneShell from "./SceneShell";

/**
 * 본문 대응: #normalization — LayerNorm은 각 sample의 마지막 feature 축을 정규화하고 BatchNorm은 배치 통계를 쓴다.
 * sample 1 = [1, 3]은 글의 ExplainedFormula 예제(μ 2, σ² 1 → [−1, 1]).
 * sample 2 = [5, 5]는 글의 "상수 입력" negative fixture를 보이려는 가정(μ 5, σ² 0 → ε 덕분에 [0, 0]).
 * BatchNorm 열 평균: (1+5)/2 = 3, (3+5)/2 = 4.
 */
const X = [
  [1, 3],
  [5, 5],
] as const;

const SCENES = [
  {
    label: "두 축",
    summary: "가로 = feature, 세로 = sample",
    note: "행 하나가 sample 하나, 열 하나가 feature 하나입니다. LayerNorm은 한 행 안(feature 축)에서 평균과 분산을 구하고, BatchNorm은 한 열을 따라(배치 전체) 구합니다.",
  },
  {
    label: "sample 1 정규화",
    summary: "[1, 3] → μ 2, σ² 1 → [−1, 1]",
    note: "첫 행만 봅니다. 평균 2를 빼면 [−1, 1], 분산 1에 ε를 더한 제곱근은 약 1이라 결과는 약 [−1, 1]입니다. 두 번째 행은 이 계산에 전혀 들어오지 않습니다.",
  },
  {
    label: "상수 입력",
    summary: "[5, 5] → σ² 0 → [0, 0]",
    note: "두 번째 행이 [5, 5]처럼 상수라면(가정) 평균 5, 분산 0입니다. 분자는 0이고 분모는 √(0 + ε)라 0으로 나누지 않으므로 결과는 finite한 [0, 0]입니다. NaN이 나오면 실패입니다.",
  },
  {
    label: "BatchNorm이라면",
    summary: "열 평균 3, 4 — 다른 sample에 따라 바뀜",
    note: "같은 표를 열 방향으로 정규화하면 첫 열 평균은 (1 + 5)/2 = 3, 둘째 열은 (3 + 5)/2 = 4입니다. sample 1의 결과가 같은 배치에 들어온 sample 2에 따라 달라지므로 배치 크기가 바뀌면 통계도 바뀝니다. LayerNorm 결과는 행 안에서만 정해집니다.",
  },
  {
    label: "γ·β의 gradient",
    summary: "feature마다 하나 · sample 축으로 합산",
    note: "γ와 β는 feature마다 값이 하나뿐이라 모든 sample이 같은 γ, β를 씁니다. 그래서 각 feature의 γ, β gradient는 그 열을 따라 모든 sample의 기여를 더해야 합니다. 정규화 축이 아닌 차원(여기서는 sample 축)을 합산한다는 뜻입니다. 열 방향으로 더하는 것은 gradient이고, 정규화 통계는 여전히 행 안에서 냅니다(BatchNorm이 아닙니다).",
  },
] as const;

const fmtSigned = (v: number) => (v === 0 ? "0" : v > 0 ? `${v}` : `−${Math.abs(v)}`);

export default function NormAxisViz() {
  return (
    <SceneShell
      eyebrow="정규화 축"
      title="LayerNorm은 행 안에서, BatchNorm은 열을 따라 통계를 냅니다"
      description="2개 sample × 2개 feature 표입니다. [1, 3]은 아래 수식 예제와 같고 [5, 5]는 상수 입력을 보이려는 가정입니다. γ = 1, β = 0으로 둡니다."
      ariaLabel="2×2 입력에서 LayerNorm과 BatchNorm의 정규화 방향, 상수 입력, gamma beta gradient 합산 방향"
      scenes={SCENES}
      render={(active) => {
        const rowFocus = active === 1 ? 0 : active === 2 ? 1 : -1;
                const out = (r: number, c: number) => {
          if (active === 1 && r === 0) return `≈ ${fmtSigned(c === 0 ? -1 : 1)}`;
          if (active === 2 && r === 1) return "0";
          return "";
        };
        const rowStat = (r: number) => {
          if (active === 0) return "← 행 안: LayerNorm";
          if (active === 1 && r === 0) return "μ 2 · σ² 1";
          if (active === 2 && r === 1) return "μ 5 · σ² 0 · ε";
          return "";
        };
        const colStat = (c: number) => {
          if (active === 0) return "↓ 열: BatchNorm";
          if (active === 3) return c === 0 ? "평균 3" : "평균 4";
          if (active === 4) return c === 0 ? "dγ₁·dβ₁ = 열 합" : "dγ₂·dβ₂ = 열 합";
          return "";
        };
        return (
          <div className="mx-auto grid w-full max-w-[30rem] grid-cols-[3.75rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,6.5rem)] gap-1.5 text-xs">
            <span />
            {["feature 1", "feature 2"].map((name) => (
              <span key={name} className="text-center text-[11px] text-muted-foreground">{name}</span>
            ))}
            <span />
            {X.map((row, r) => (
              <div key={r} className="contents">
                <span className="flex items-center text-[11px] text-muted-foreground">sample {r + 1}</span>
                {row.map((value, c) => {
                  const inRow = rowFocus === r;
                  const border = inRow ? "border-primary" : active === 3 ? "border-amber-600" : active === 4 ? "border-primary/60 border-dashed" : "border-border";
                  return (
                    <div key={c} className={`flex min-h-14 flex-col items-center justify-center rounded border ${border}`}>
                      <span className="font-mono text-sm font-bold">{value}</span>
                      <span className="min-h-4 font-mono text-[11px] text-primary">{out(r, c) ? `→ ${out(r, c)}` : ""}</span>
                    </div>
                  );
                })}
                <span className={`flex items-center break-keep text-[11px] leading-4 ${rowFocus === r ? "font-semibold text-primary" : "text-muted-foreground"}`}>{rowStat(r)}</span>
              </div>
            ))}
            <span />
            {[0, 1].map((c) => (
              <span key={c} className={`min-h-8 text-center text-[11px] leading-4 ${active === 3 ? "font-semibold text-amber-700 dark:text-amber-300" : active === 4 ? "font-semibold text-primary" : "text-muted-foreground"}`}>{colStat(c)}</span>
            ))}
            <span />
            <span />
            {[0, 1].map((c) => (
              <span key={c} className={`min-h-6 rounded border text-center font-mono text-[11px] leading-6 ${active === 4 ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                γ{c === 0 ? "₁" : "₂"} · β{c === 0 ? "₁" : "₂"}
              </span>
            ))}
            <span className="flex items-center text-[11px] leading-4 text-muted-foreground">feature별 파라미터</span>
          </div>
        );
      }}
    />
  );
}
