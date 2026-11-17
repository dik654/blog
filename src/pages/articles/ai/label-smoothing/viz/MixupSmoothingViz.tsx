import SceneShell from "./SceneShell";

/**
 * 본문 대응: #composition — K=4, λ=.7, ε=.1, c1/c2를 섞은 뒤 smoothing.
 * y_a=c1, y_b=c2 → mix (.7,.3,0,0) → ×(1−ε) (.63,.27,0,0) → +ε/K=.025 → (.655,.295,.025,.025).
 */
const K = 4;
const LAMBDA = 0.7;
const EPS = 0.1;
const SHARE = EPS / K;

interface Row {
  a: number;
  b: number;
  u: number;
}

const zero: Row = { a: 0, b: 0, u: 0 };

const SCENES = [
  {
    label: "섞기 전 두 target",
    summary: "y_a=(1,0,0,0) · y_b=(0,1,0,0)",
    note: "Mixup에 참여한 두 sample의 one-hot target입니다. c₁이 y_a, c₂가 y_b의 정답 class입니다. 아직 섞기 전이라 두 target을 한 그림에 따로 놓았고, 각각의 합이 1입니다.",
    rows: [{ a: 1, b: 0, u: 0 }, { a: 0, b: 1, u: 0 }, zero, zero],
  },
  {
    label: "λ=.7로 섞기",
    summary: ".7·y_a + .3·y_b = (.7,.3,0,0)",
    note: "입력을 섞은 비율과 같은 λ=.7, 1−λ=.3으로 두 target을 섞습니다. 이 단계에서 이미 정답 질량이 두 class에 나뉜 soft target입니다.",
    rows: [{ a: LAMBDA, b: 0, u: 0 }, { a: 0, b: 1 - LAMBDA, u: 0 }, zero, zero],
  },
  {
    label: "(1−ε)=.9만 남기기",
    summary: "(.63,.27,0,0) · 떼어낸 질량 .1",
    note: "섞인 target 전체에 .9를 곱합니다. c₁에서 .07, c₂에서 .03, 합해서 ε=.1만큼이 빠지고 남은 합은 .9입니다.",
    rows: [{ a: (1 - EPS) * LAMBDA, b: 0, u: 0 }, { a: 0, b: (1 - EPS) * (1 - LAMBDA), u: 0 }, zero, zero],
  },
  {
    label: "ε/K=.025씩 더하기",
    summary: "(.655,.295,.025,.025) · 합 1",
    note: "떼어낸 .1을 네 class에 .025씩 나눠 더합니다. c₁은 .63+.025=.655, c₂는 .27+.025=.295가 되고, mixup에 없던 c₃·c₄도 .025를 받습니다.",
    rows: [
      { a: (1 - EPS) * LAMBDA, b: 0, u: SHARE },
      { a: 0, b: (1 - EPS) * (1 - LAMBDA), u: SHARE },
      { a: 0, b: 0, u: SHARE },
      { a: 0, b: 0, u: SHARE },
    ],
  },
] as const;

const COLORS = { a: "#2563eb", b: "#d97706", u: "#16a34a" } as const;
const CLASS_LABELS: readonly string[] = ["c₁", "c₂", "c₃", "c₄"];

function fmt(value: number) {
  return Number(value.toFixed(3)).toString().replace(/^0\./, ".");
}

export default function MixupSmoothingViz() {
  return (
    <SceneShell
      eyebrow="Mixup 뒤 smoothing"
      title="두 target을 섞은 뒤 .9만 남기고 .025씩 나눕니다"
      description="막대 하나가 한 class의 target probability입니다(눈금 0–1). λ는 mixup coefficient로, 두 sample과 두 target을 섞는 같은 비율입니다. 본문 예시 K=4, λ=.7, ε=.1을 그대로 씁니다."
      ariaLabel="Mixup으로 섞은 target에 label smoothing을 적용해 최종 target이 되는 네 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const rows: readonly Row[] = scene.rows;
        const total = rows.reduce<number>((sum, row) => sum + row.a + row.b + row.u, 0);
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              {rows.map((row, index) => {
                const value = row.a + row.b + row.u;
                return (
                  <div key={CLASS_LABELS[index]} className="grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
                    <span className="font-mono font-bold">{CLASS_LABELS[index]}</span>
                    <div className="flex h-5 min-w-0 overflow-hidden rounded-sm bg-muted/40">
                      <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${row.a * 100}%`, backgroundColor: COLORS.a }} />
                      <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${row.b * 100}%`, backgroundColor: COLORS.b }} />
                      <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${row.u * 100}%`, backgroundColor: COLORS.u }} />
                    </div>
                    <span className="text-right font-mono font-bold">{fmt(value)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.a }} />y_a(c₁)에서 온 몫</span>
                <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.b }} />y_b(c₂)에서 온 몫</span>
                <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.u }} />uniform ε/K 몫</span>
              </div>
              <span className="font-mono font-bold">{active === 0 ? "합: target마다 1" : `합 ${fmt(total)}`}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
