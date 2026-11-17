import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fold-local — I_source ⊆ I_train, I_source ∩ I_val = ∅.
 * "Dataset 전체에서 SMOTE한 뒤 split하면 synthetic row가 validation point의 geometry를 이미 사용합니다."
 * r1=(2,4), r2=(6,8)은 본문 좌표, r3=(3,2)와 다수 class 점·fold 배정은 가정이다.
 * r1에서 거리: r3 = √(1²+2²) = √5 ≈ 2.24, r2 = √(4²+4²) = √32 ≈ 5.66 → 전체에서 고르면 r3가 가장 가깝다.
 * λ=.25: r1+.25(r3−r1) = (2,4)+.25(1,−2) = (2.25,3.5), r1+.25(r2−r1) = (3,5).
 */
type Pt = { id: string; x: number; y: number; minority: boolean };

const POINTS: readonly Pt[] = [
  { id: "r1", x: 2, y: 4, minority: true },
  { id: "r2", x: 6, y: 8, minority: true },
  { id: "r3", x: 3, y: 2, minority: true },
  { id: "m1", x: 7, y: 3, minority: false },
  { id: "m2", x: 5, y: 1, minority: false },
  { id: "m3", x: 8, y: 6, minority: false },
  { id: "m4", x: 1, y: 7, minority: false },
];

const SCENES = [
  {
    label: "잘못된 순서 ①: 전체 dataset에서 SMOTE부터",
    summary: "r1의 이웃 = r3",
    val: [] as readonly string[],
    pair: ["r1", "r3"],
    synth: [2.25, 3.5],
    stale: null as readonly number[] | null,
    source: "{r1, r3}",
    valText: "아직 나누지 않음",
    inter: "−",
    q: "판정 전",
    bad: false,
    note: "아직 split 전이라 r3도 이웃 후보입니다. r1에서 r3까지 √5≈2.24, r2까지 √32≈5.66이므로 r3가 가장 가깝고, λ=.25로 (2,4)+.25×(1,−2) = (2.25, 3.5)를 만듭니다.",
  },
  {
    label: "잘못된 순서 ②: 그 뒤 split하면 r3가 validation에 들어갑니다",
    summary: "∩ = {r3} → Q = 0",
    val: ["r3", "m1"],
    pair: ["r1", "r3"],
    synth: [2.25, 3.5],
    stale: null,
    source: "{r1, r3}",
    valText: "{r3, m1}",
    inter: "{r3}",
    q: "0 (leakage)",
    bad: true,
    note: "Synthetic 점은 training에 남지만 그 위치는 validation 점 r3의 좌표로 정해졌습니다. 모델은 validation의 geometry를 이미 본 채로 평가받습니다.",
  },
  {
    label: "올바른 순서: split 먼저, sampler는 train만 봅니다",
    summary: "∩ = ∅ → Q = 1",
    val: ["r3", "m1"],
    pair: ["r1", "r2"],
    synth: [3, 5],
    stale: null,
    source: "{r1, r2}",
    valText: "{r3, m1}",
    inter: "∅",
    q: "1",
    bad: false,
    note: "r3와 m1을 먼저 봉인하면 r1의 이웃 후보는 train 안의 r2뿐입니다. 본문의 (2,4)+.25×(4,4) = (3,5)가 나오고, source와 validation이 겹치지 않습니다.",
  },
  {
    label: "다음 fold에서는 그 fold의 train으로 다시 fit합니다",
    summary: "fold 2: ∩ = ∅ → Q = 1",
    val: ["r2", "m2"],
    pair: ["r1", "r3"],
    synth: [2.25, 3.5],
    stale: [3, 5],
    source: "{r1, r3}",
    valText: "{r2, m2}",
    inter: "∅",
    q: "1",
    bad: false,
    note: "Fold 2에서 r2가 validation이 되면(가정), fold 1의 (3,5)를 그대로 쓰면 source r2가 validation과 겹칩니다. 그래서 fold마다 그 fold의 train subset에서 sampler를 다시 fit합니다. 이번에는 r3가 train이라 (2.25, 3.5)가 정상입니다.",
  },
] as const;

const px = (x: number) => 34 + x * 28;
const py = (y: number) => 196 - y * 19;
const ACCENT = "#2563eb";
const SYN = "#d97706";
const RED = "#dc2626";

export default function SplitOrderLeakageViz() {
  return (
    <SceneShell
      eyebrow="Split과 sampling의 순서"
      title="SMOTE를 split 앞에 두면 validation 점이 이웃이 됩니다"
      description="파란 점은 minority, 회색 점은 majority, 점선 고리는 validation으로 봉인한 row, 주황 마름모는 λ=.25로 만든 synthetic 점입니다. I_source는 sampler가 이웃 탐색·보간에 읽은 원본 row, I_val은 validation row이고, 둘의 교집합이 비어야 Q=1(leakage 없음)입니다. r1=(2,4)·r2=(6,8)은 본문 좌표이고 r3=(3,2)·회색 점·fold 배정은 가정입니다."
      ariaLabel="전체에서 SMOTE 후 split하면 synthetic 점이 validation 점 r3를 source로 써서 교집합이 생기고, split 먼저 하면 교집합이 비는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const val = new Set<string>(s.val);
        const byId = new Map(POINTS.map((p) => [p.id, p]));
        const a = byId.get(s.pair[0]);
        const b = byId.get(s.pair[1]);
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-center">
            <svg viewBox="0 0 300 214" role="img" aria-label={s.label} className="block h-auto w-full">
              <line x1={px(0)} y1={py(0)} x2={px(9)} y2={py(0)} stroke="#94a3b8" strokeWidth="1" />
              <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(9.5)} stroke="#94a3b8" strokeWidth="1" />
              {[0, 3, 6, 9].map((t) => (
                <g key={t}>
                  <text x={px(t)} y={py(0) + 13} textAnchor="middle" fontSize="10" fill="#64748b">{t}</text>
                  <text x={px(0) - 8} y={py(t) + 3} textAnchor="end" fontSize="10" fill="#64748b">{t}</text>
                </g>
              ))}
              {a && b && (
                <line x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)} stroke={s.bad ? RED : SYN} strokeWidth="1.25" strokeDasharray="4 3" />
              )}
              {POINTS.map((p) => (
                <g key={p.id}>
                  {val.has(p.id) && <circle cx={px(p.x)} cy={py(p.y)} r={11} fill="none" stroke={RED} strokeWidth="1" strokeDasharray="3 2" />}
                  <circle cx={px(p.x)} cy={py(p.y)} r={6} fill={p.minority ? ACCENT : "#cbd5e1"} stroke={p.minority ? ACCENT : "#94a3b8"} strokeWidth="1" />
                  <text x={px(p.x) + 13} y={py(p.y) - 7} fontSize="10" fontWeight={p.minority ? 700 : 400} fill={p.minority ? ACCENT : "#64748b"}>
                    {p.id}
                    {val.has(p.id) ? " (val)" : ""}
                  </text>
                </g>
              ))}
              {s.stale && (
                <g>
                  <rect x={px(s.stale[0]) - 5} y={py(s.stale[1]) - 5} width={10} height={10} transform={`rotate(45 ${px(s.stale[0])} ${py(s.stale[1])})`} fill="none" stroke={RED} strokeWidth="1" strokeDasharray="2 2" />
                  <text x={px(s.stale[0]) + 10} y={py(s.stale[1]) - 4} fontSize="10" fill={RED}>fold 1의 (3,5)</text>
                </g>
              )}
              <rect
                x={px(s.synth[0]) - 5}
                y={py(s.synth[1]) - 5}
                width={10}
                height={10}
                transform={`rotate(45 ${px(s.synth[0])} ${py(s.synth[1])})`}
                fill={SYN}
              />
            </svg>
            <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">synthetic</dt>
              <dd className="font-mono font-bold text-[#d97706]">({s.synth[0]}, {s.synth[1]})</dd>
              <dt className="text-muted-foreground">I_source</dt>
              <dd className="font-mono">{s.source}</dd>
              <dt className="text-muted-foreground">I_val</dt>
              <dd className="font-mono">{s.valText}</dd>
              <dt className="text-muted-foreground">교집합</dt>
              <dd className={`font-mono font-bold ${s.bad ? "text-[#dc2626]" : ""}`}>{s.inter}</dd>
              <dt className="text-muted-foreground">Q</dt>
              <dd className={`font-mono font-bold ${s.bad ? "text-[#dc2626]" : "text-primary"}`}>{s.q}</dd>
            </dl>
          </div>
        );
      }}
    />
  );
}
