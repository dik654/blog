import SceneShell from "./SceneShell";

/**
 * 본문 대응: #categorical — TE^(-k(i))(c_i) = (S_i + α μ_train) / (N_i + α)를 row A에 대해 숫자로 계산.
 * rows는 CategoricalViz와 같은 A(red,1,F1)·B(red,0,F2)·C(blue,1,F3). α 값은 가정.
 * 단순 평균 (1+0)/2 = 0.5 → F1 제외 S=0, N=1 → μ_train=(0+1)/2=0.5 → α=1: 0.5/2=0.25.
 * α=0: 0/1=0, α=3: 1.5/4=0.375.
 */
const ROWS = [
  { id: "A", cat: "red", y: 1, fold: "F1" },
  { id: "B", cat: "red", y: 0, fold: "F2" },
  { id: "C", cat: "blue", y: 1, fold: "F3" },
] as const;

const S = 0;
const N = 1;
const MU = (0 + 1) / 2;
const te = (alpha: number) => (S + alpha * MU) / (N + alpha);

const SCENES = [
  { label: "그냥 평균하면", summary: "red 평균 = (1+0)/2 = 0.5", excludeF1: false, note: "Row A의 피처를 red의 target 평균으로 만들면 A 자신의 정답 y=1이 계산에 들어갑니다. 자기 label이 자기 입력으로 되돌아오는 지름길입니다." },
  { label: "A의 fold 제외", summary: "S = 0, N = 1", excludeF1: true, note: "A가 속한 F1을 통째로 빼면 남은 red row는 B 하나입니다. 같은 category의 target 합 S는 0, 관측 수 N은 1입니다." },
  { label: "전체 평균 μ", summary: "μ_train = (0+1)/2 = 0.5", excludeF1: true, note: "Smoothing 기준 μ_train도 같은 fold를 뺀 training target, 즉 B와 C의 평균 0.5입니다." },
  { label: "α = 1로 완화", summary: "(0 + 1×0.5)/(1 + 1) = 0.25", excludeF1: true, note: "α=1(가정)이면 실제 관측 1개에 평균 0.5짜리 가상 관측 1개를 더한 셈이라 0.25가 됩니다. A의 정답은 어디에도 쓰이지 않았습니다." },
  { label: "α를 바꾸면", summary: "α=0: 0 · α=1: 0.25 · α=3: 0.375", excludeF1: true, note: "α=0이면 관측 하나(B의 0)가 값을 그대로 정합니다. α가 커질수록 μ=0.5 쪽으로 당겨집니다. 세 α 값은 비교를 위한 가정입니다." },
] as const;

const LX = 20;
const RX = 340;
const px = (v: number) => LX + v * (RX - LX);

export default function TargetEncodingCalcViz() {
  return (
    <SceneShell
      eyebrow="Target encoding 계산"
      title="Row A의 encoding을 숫자로 끝까지 계산합니다"
      description="세 row는 아래 cross-fitting 그림과 같은 예이고, smoothing 세기 α는 가정입니다. 아래 수직선은 0~1 사이 encoding 값입니다."
      ariaLabel="Row A의 out-of-fold target encoding을 단계별로 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks: { v: number; label: string; color: string }[] =
          active === 0
            ? [{ v: 0.5, label: "0.5 (누출)", color: "#dc2626" }]
            : active === 1
              ? [{ v: S / N, label: "S/N = 0", color: "#475569" }]
              : active === 2
                ? [{ v: MU, label: "μ = 0.5", color: "#475569" }]
                : active === 3
                  ? [{ v: te(1), label: "0.25", color: "#2563eb" }]
                  : [
                      { v: te(0), label: "α=0", color: "#475569" },
                      { v: te(1), label: "α=1", color: "#2563eb" },
                      { v: te(3), label: "α=3", color: "#475569" },
                    ];
        return (
          <div className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-border/70 text-sm">
              <div className="grid grid-cols-4 bg-muted/35 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                <span>row</span>
                <span>category</span>
                <span>y</span>
                <span>fold</span>
              </div>
              {ROWS.map((r) => {
                const out = scene.excludeF1 && r.fold === "F1";
                const used = active === 0 ? r.cat === "red" : !out && (active >= 2 || r.cat === "red");
                return (
                  <div
                    key={r.id}
                    className={`grid grid-cols-4 border-t border-border/60 px-3 py-1.5 ${out ? "text-muted-foreground line-through" : used ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    <span>{r.id}</span>
                    <span>{r.cat}</span>
                    <span className={active === 0 && r.id === "A" ? "text-red-700 dark:text-red-400" : ""}>{r.y}</span>
                    <span>{r.fold}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">굵은 row = 이번 계산에 들어간 row · 취소선 = 제외한 fold</p>
            <svg viewBox="0 0 360 66" className="mt-3 block h-auto w-full" role="img" aria-label={`encoding 값: ${scene.summary}`}>
              <line x1={LX} x2={RX} y1={40} y2={40} stroke="#94a3b8" strokeWidth={1} />
              {[0, 0.5, 1].map((t) => (
                <g key={t}>
                  <line x1={px(t)} x2={px(t)} y1={36} y2={44} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(t)} y={60} textAnchor="middle" fontSize={13} fill="#64748b">{t}</text>
                </g>
              ))}
              {marks.map((m, i) => (
                <g key={m.label}>
                  <circle cx={px(m.v)} cy={40} r={5} fill={m.color} />
                  <text x={px(m.v)} y={i % 2 === 0 ? 26 : 13} textAnchor={m.v === 0 ? "start" : "middle"} fontSize={13} fontWeight={700} fill={m.color}>
                    {m.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        );
      }}
    />
  );
}
