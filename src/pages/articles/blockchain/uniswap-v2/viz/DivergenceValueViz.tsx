import V2SceneShell from "./V2SceneShell";

/**
 * 본문 대응: #divergence-loss — A·B 1000개씩, 수수료 제외, A의 외부 가격이 B 기준 2배(가정).
 * 그대로 보유: 1000×2 + 1000 = 3000 B. 풀: xy=1,000,000, y/x=2 → A 707.107, B 1414.214,
 * 가치 707.107×2 + 1414.214 = 2828.427 B. 2828.427/3000 − 1 ≈ −5.72% = 2√2/3 − 1.
 */
const SCALE = 3000;

interface Row {
  aCount: string;
  bCount: string;
  aValue: number;
  bValue: number;
  total: string;
}

const SCENES = [
  {
    label: "처음",
    summary: "A 1개 = B 1개 · 둘 다 2,000 B",
    note: "처음에는 A 한 개가 B 한 개 값입니다. 풀에 맡긴 A·B 1000개씩과 그대로 들고 있는 A·B 1000개씩은 모두 B로 2,000개어치입니다.",
    hold: { aCount: "A 1000", bCount: "B 1000", aValue: 1000, bValue: 1000, total: "2,000 B" } as Row,
    pool: { aCount: "A 1000", bCount: "B 1000", aValue: 1000, bValue: 1000, total: "2,000 B" } as Row | null,
  },
  {
    label: "A 가격이 2배",
    summary: "보유: 1000×2 + 1000 = 3,000 B",
    note: "A의 외부 가격만 B 기준 두 배가 됐다고 가정합니다. 그대로 보유했다면 개수는 그대로이고 A 쪽 가치만 2,000 B로 커집니다. 풀은 아직 가격을 맞추는 거래 전이라 비워 두었습니다.",
    hold: { aCount: "A 1000", bCount: "B 1000", aValue: 2000, bValue: 1000, total: "3,000 B" } as Row,
    pool: null as Row | null,
  },
  {
    label: "풀이 가격을 맞춤",
    summary: "A 707.107 · B 1414.214",
    note: "가격을 맞추는 거래 뒤에는 곱 1,000,000과 B/A = 2가 함께 성립합니다. 비싸진 A가 풀에서 빠져나가 707.107개가 되고 B는 1414.214개가 됩니다. A 쪽 가치는 707.107×2 = 1414.214 B입니다.",
    hold: { aCount: "A 1000", bCount: "B 1000", aValue: 2000, bValue: 1000, total: "3,000 B" } as Row,
    pool: { aCount: "A 707.107", bCount: "B 1414.214", aValue: 1414.214, bValue: 1414.214, total: "2,828.427 B" } as Row | null,
  },
  {
    label: "두 결과의 차이",
    summary: "2,828.427 ÷ 3,000 − 1 ≈ −5.72%",
    note: "풀 가치 2,828.427 B는 처음 2,000 B보다 크지만 그대로 보유한 3,000 B에는 못 미칩니다. 1000을 한 단위로 보면 풀은 2√2 ≈ 2.828, 보유는 1+2 = 3이고 아래 식의 r = 2인 경우입니다. 수수료는 넣지 않았습니다.",
    hold: { aCount: "A 1000", bCount: "B 1000", aValue: 2000, bValue: 1000, total: "3,000 B" } as Row,
    pool: { aCount: "A 707.107", bCount: "B 1414.214", aValue: 1414.214, bValue: 1414.214, total: "2,828.427 B" } as Row | null,
  },
] as const;

function ValueRow({ title, row, pendingText }: { title: string; row: Row | null; pendingText: string }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">{title}</span>
        <span className="font-mono text-muted-foreground">{row ? `${row.aCount}개 · ${row.bCount}개` : "—"}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_5.75rem] items-center gap-2">
        <div className="h-7 min-w-0 rounded-sm border border-border/60">
          {row ? (
            <div className="flex h-full">
              <div className="flex h-full items-center justify-center overflow-hidden text-[11px] font-semibold text-white" style={{ width: `${(row.aValue / SCALE) * 100}%`, backgroundColor: "#2563eb" }}>
                A {row.aValue.toLocaleString("en-US")}
              </div>
              <div className="flex h-full items-center justify-center overflow-hidden text-[11px] font-semibold text-white" style={{ width: `${(row.bValue / SCALE) * 100}%`, backgroundColor: "#64748b" }}>
                B {row.bValue.toLocaleString("en-US")}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center px-2 text-[11px] text-muted-foreground">{pendingText}</div>
          )}
        </div>
        <span className="text-right font-mono text-xs font-bold sm:text-sm">{row ? row.total : "?"}</span>
      </div>
    </div>
  );
}

export default function DivergenceValueViz() {
  return (
    <V2SceneShell
      eyebrow="보유 대안과 비교"
      title="A 가격이 두 배가 되면 풀은 A를 내주고 B를 더 갖습니다"
      description="막대 길이는 B로 환산한 가치이며 오른쪽 끝이 3,000 B입니다. 파랑은 A가 차지하는 가치, 회색은 B입니다. 10절의 수수료 제외 산술 예입니다(가정)."
      ariaLabel="A 가격이 두 배일 때 그대로 보유한 가치와 풀에 맡긴 가치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-4">
            <ValueRow title="그대로 보유" row={scene.hold} pendingText="" />
            <ValueRow title="풀에 맡김" row={scene.pool} pendingText="가격을 맞추는 거래 전" />
            <p className="font-mono text-xs text-muted-foreground">
              {active === 0 ? "A 1개 = B 1개" : "A 1개 = B 2개 (외부 가격, 가정)"}
            </p>
          </div>
        );
      }}
    />
  );
}
