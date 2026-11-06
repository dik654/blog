import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 중성 조건 n + Na = p + Nd를 양전하 쪽과 음전하 쪽 칸으로 맞춘다. 칸 하나 = 10¹⁵ cm⁻³.
 * 도너만: Nd 10칸 = n 10칸. 억셉터 2×10¹⁵ 추가(가정): Na 2칸 + n 8칸 = Nd 10칸.
 * p = 10²⁰ ÷ 10¹⁶ = 10⁴, p = 10²⁰ ÷ (8×10¹⁵) = 1.25×10⁴. p는 칸의 10¹¹분의 1 수준이라 칸으로 그리지 않는다.
 */
type CellKind = "nd" | "na" | "n" | "unknown";

interface BalanceState {
  negative: readonly CellKind[];
  n: string;
  p: string;
  formula: string;
}

const repeat = (kind: CellKind, count: number): readonly CellKind[] => Array.from({ length: count }, () => kind);
const POSITIVE = repeat("nd", 10);

const STATES: readonly BalanceState[] = [
  { negative: repeat("n", 10), n: "≈ 10¹⁶", p: "≈ 10⁴", formula: "n = p + Nd" },
  { negative: [...repeat("na", 2), ...repeat("unknown", 8)], n: "?", p: "?", formula: "n+Na=p+Nd" },
  { negative: [...repeat("na", 2), ...repeat("n", 8)], n: "≈ 8×10¹⁵", p: "?", formula: "n ≈ Nd − Na" },
  { negative: [...repeat("na", 2), ...repeat("n", 8)], n: "≈ 8×10¹⁵", p: "≈ 1.25×10⁴", formula: "p ≈ 10²⁰ ÷ n" },
];

const SCENES = [
  { label: "도너만 있을 때", summary: "n = p + Nd ≈ 10¹⁶", note: "p 10⁴는 칸 하나의 10¹¹분의 1이라 보이지 않을 만큼 작습니다. 그래서 n을 Nd로 근사합니다." },
  { label: "억셉터 2칸을 함께 넣으면", summary: "음전하 쪽에 Na 2칸", note: "억셉터 이온 2×10¹⁵ cm⁻³(가정)는 음전하 쪽에 섭니다. 두 줄의 합이 같도록 전자 칸을 다시 셉니다." },
  { label: "남은 8칸이 전자입니다", summary: "10 − 2 = 8칸 (12칸이 아님)", note: "개수를 더하지 않고 양·음 전하가 서로 보상하는 양을 빼면 n ≈ 8×10¹⁵ cm⁻³입니다." },
  { label: "적은 쪽 정공을 다시 구합니다", summary: "10²⁰ ÷ (8×10¹⁵) = 1.25×10⁴", note: "n이 줄어 p는 10⁴에서 1.25×10⁴ cm⁻³로 늘어납니다. 그래도 칸으로 그리기엔 너무 작습니다." },
] as const;

const CELL_STYLE: Record<CellKind, { bg: string; border: string; text: string; glyph: string; dashed?: boolean }> = {
  nd: { bg: "#64748b", border: "#64748b", text: "#ffffff", glyph: "+" },
  na: { bg: "#64748b", border: "#64748b", text: "#ffffff", glyph: "−" },
  n: { bg: "#2563eb", border: "#2563eb", text: "#ffffff", glyph: "e" },
  unknown: { bg: "transparent", border: "#94a3b8", text: "#64748b", glyph: "?", dashed: true },
};

function Row({ label, cells, suffix }: { label: string; cells: readonly CellKind[]; suffix: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold">{label}</p>
      <div className="grid grid-cols-10 gap-0.5" aria-hidden>
        {cells.map((kind, index) => {
          const style = CELL_STYLE[kind];
          return (
            <div
              key={index}
              className="flex h-6 items-center justify-center rounded-[3px] border font-mono text-xs font-bold"
              style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text, borderStyle: style.dashed ? "dashed" : "solid" }}
            >
              {style.glyph}
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{suffix}</p>
    </div>
  );
}

export default function ChargeBalanceViz() {
  return (
    <SceneShell
      eyebrow="전하 장부"
      title="도너와 억셉터는 더하지 않고 서로 뺍니다"
      description="칸 하나가 10¹⁵ cm⁻³입니다. Nd(+)는 고정된 도너 이온, Na(−)는 고정된 억셉터 이온, e는 전자 n, p는 정공입니다. 두 줄의 합이 같아야 중성입니다."
      note="완전 이온화한 균일 벌크의 열평형, 10¹⁶, 2×10¹⁵은 가정입니다."
      ariaLabel="중성 조건에서 도너, 억셉터, 전자 수를 칸으로 맞추는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Row label="양전하 쪽" cells={POSITIVE} suffix="Nd 10칸 + 정공 p (너무 작아 칸 없음)" />
            <Row label="음전하 쪽" cells={state.negative} suffix={active === 0 ? "전자 n 10칸" : "Na 2칸 + 전자 n"} />
            <dl className="grid grid-cols-3 gap-1.5 font-mono text-[11px] sm:text-xs">
              <div className="min-w-0 rounded-lg border border-border px-1.5 py-1.5">
                <dt className="text-muted-foreground">n (cm⁻³)</dt>
                <dd className="font-bold">{state.n}</dd>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-1.5 py-1.5">
                <dt className="text-muted-foreground">p (cm⁻³)</dt>
                <dd className="font-bold">{state.p}</dd>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-1.5 py-1.5">
                <dt className="text-muted-foreground">이 장면의 식</dt>
                <dd className="font-bold">{state.formula}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
