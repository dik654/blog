import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — update_row_max_from_local의 조건부 기준 갱신.
 * 차이 (3−5)·log₂e ≈ −2.885390 (2의 지수 단위). 차이 ≥ −임계값이면 기준 3 유지.
 * 임계값 3(가정): 유지 → 막대 e^(s−3) = [e⁻², 1, e⁻¹, e²], ℓ≈8.892271, u≈65.590396.
 * 임계값 2(가정): 기준 5 → 막대 e^(s−5), ℓ≈1.203438, u≈8.876695. 두 경우 모두 O≈7.376113.
 */
const DIFF = -2.88539;

interface BranchScene {
  label: string;
  summary: string;
  note: string;
  threshold: number | null;
  m: number | null;
  bars: readonly number[];
  barText: readonly string[];
  l: string;
  u: string;
}

const SCENES: readonly BranchScene[] = [
  {
    label: "차이를 2의 지수 단위로",
    summary: "(3−5)·log₂e ≈ −2.885390",
    threshold: null,
    m: null,
    bars: [],
    barText: [],
    l: "—",
    u: "—",
    note: "FA4 코드는 새 최대가 나와도 기준 차이가 임계값 안쪽이면 옛 기준을 유지합니다. 코드는 exp2를 쓰므로 옛 기준 3과 새 최대 5의 차이 −2에 log₂e를 곱해 −2.885390을 만듭니다. 임계값도 이 2의 지수 단위로 읽습니다. 자연지수 차이 2와 곧바로 비교하지 않습니다.",
  },
  {
    label: "임계값 3 (가정) · 유지",
    summary: "−2.885390 ≥ −3 → 기준 3, 배율 1",
    threshold: 3,
    m: 3,
    bars: [0.135335, 1, 0.367879, 7.389056],
    barText: ["e⁻²", "1", "e⁻¹", "e²"],
    l: "1.135335 + e⁻¹ + e² ≈ 8.892271",
    u: "≈ 65.590396",
    note: "차이가 −3보다 크므로 기준 3과 배율 1을 유지합니다. 옛 두 합을 고치지 않고 둘째 조각을 기준 3으로 더합니다. 점수 5의 막대 e²는 1을 넘습니다. 이런 큰 지수를 계속 허용하면 overflow가 생길 수 있어 갱신 조건과 dtype 범위를 함께 지켜야 합니다.",
  },
  {
    label: "임계값 2 (가정) · 기준 5",
    summary: "−2.885390 < −2 → 기준 5, 배율 e⁻²",
    threshold: 2,
    m: 5,
    bars: [0.018316, 0.135335, 0.049787, 1],
    barText: ["e⁻⁴", "e⁻²", "e⁻³", "1"],
    l: "1.203438",
    u: "8.876695",
    note: "조건이 거짓이므로 기준 5와 배율 e⁻²를 반환합니다. 모든 막대가 1 이하로 내려옵니다. 차이가 임계값과 정확히 같았다면 코드의 ≥ 때문에 유지 분기로 갑니다.",
  },
];

const W = 360;
// 수직선: −4 … 0 (2의 지수 단위)
const NL_LEFT = 24;
const NL_RIGHT = W - 24;
const nx = (v: number) => NL_LEFT + ((v + 4) / 4) * (NL_RIGHT - NL_LEFT);
const TICKS = [-4, -3, -2, -1, 0] as const;

// 막대: e^(s−m), 위쪽 0…7.5
const BAR_TOP = 16;
const BAR_BASE = 118;
const BAR_MAX = 7.5;
const SCORES = [1, 3, 2, 5] as const;
const bh = (v: number) => (v / BAR_MAX) * (BAR_BASE - BAR_TOP);

export default function ConditionalRescaleViz() {
  return (
    <SceneShell
      eyebrow="조건부 기준 갱신"
      title="차이가 임계값 안쪽이면 기준 3을 그대로 둡니다"
      description="위 수직선은 2의 지수 단위로 잰 기준 차이입니다. 아래 막대는 고른 기준에서 각 점수의 e^(점수−기준)이고 점선이 높이 1입니다. 임계값 3과 2는 본문이 든 가정입니다."
      note="두 분기 모두 출력은 u/ℓ ≈ 7.376113입니다. GPU의 근사 지수와 병렬 실행은 재현하지 않습니다."
      ariaLabel="기준 차이 −2.885와 임계값 3, 2를 비교해 기준을 유지하거나 5로 옮기는 분기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const t = scene.threshold;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} 64`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`차이 −2.885390${t === null ? "" : `, 경계 −${t}`}`}>
              <line x1={NL_LEFT} x2={NL_RIGHT} y1={36} y2={36} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((v) => (
                <g key={v}>
                  <line x1={nx(v)} x2={nx(v)} y1={32} y2={40} stroke="#94a3b8" strokeWidth={1} />
                  <text x={nx(v)} y={56} textAnchor="middle" fontSize={10} fill="#64748b">{v === 0 ? "0" : `−${-v}`}</text>
                </g>
              ))}
              {t !== null && (
                <>
                  <rect x={nx(-t)} y={30} width={NL_RIGHT - nx(-t)} height={12} fill={t === 3 ? "#16a34a" : "#d97706"} opacity={0.18} />
                  <line x1={nx(-t)} x2={nx(-t)} y1={22} y2={46} stroke={t === 3 ? "#16a34a" : "#d97706"} strokeWidth={1.25} />
                  <text x={NL_RIGHT} y={20} textAnchor="end" fontSize={10} fontWeight={700} fill={t === 3 ? "#15803d" : "#b45309"}>유지 구간 ≥ −{t}</text>
                </>
              )}
              <circle cx={nx(DIFF)} cy={36} r={4.5} fill="#2563eb" />
              <text x={nx(DIFF)} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1d4ed8">−2.885</text>
            </svg>
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <svg viewBox={`0 0 ${W} 140`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={scene.m === null ? "아직 기준을 고르지 않음" : `기준 ${scene.m}에서의 막대`}>
                {scene.m !== null && (
                  <>
                    <line x1={20} x2={W - 20} y1={BAR_BASE - bh(1)} y2={BAR_BASE - bh(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                    <text x={W - 20} y={BAR_BASE - bh(1) - 3} textAnchor="end" fontSize={10} fill="#64748b">1</text>
                  </>
                )}
                {SCORES.map((s, i) => {
                  const cx = 60 + i * 80;
                  const v = scene.bars[i];
                  return (
                    <g key={s}>
                      {v !== undefined && (
                        <>
                          <rect x={cx - 16} y={BAR_BASE - bh(v)} width={32} height={bh(v)} rx={2} fill={v > 1 ? "#dc2626" : "#2563eb"} opacity={0.8} />
                          <text x={cx} y={BAR_BASE - bh(v) - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={v > 1 ? "#b91c1c" : "#1d4ed8"}>{scene.barText[i]}</text>
                        </>
                      )}
                      <text x={cx} y={BAR_BASE + 16} textAnchor="middle" fontSize={10} fill="#64748b">점수 {s}</text>
                    </g>
                  );
                })}
                <line x1={20} x2={W - 20} y1={BAR_BASE} y2={BAR_BASE} stroke="#94a3b8" strokeWidth={1} />
                {scene.m === null && (
                  <text x={W / 2} y={70} textAnchor="middle" fontSize={11} fill="#64748b">기준은 분기 결과로 정해집니다</text>
                )}
              </svg>
              <dl className="grid content-start gap-1 rounded-lg border border-border px-3 py-2 text-xs">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">기준 m</dt><dd className="font-mono font-bold">{scene.m ?? "—"}</dd><dt className="ml-auto text-muted-foreground sm:hidden">O</dt><dd className="font-mono font-bold sm:hidden">{scene.m === null ? "—" : "≈ 7.376113"}</dd></div>
                <div className="flex flex-wrap justify-between gap-x-2"><dt className="text-muted-foreground">ℓ</dt><dd className="font-mono">{scene.l}</dd></div>
                <div className="flex flex-wrap justify-between gap-x-2"><dt className="text-muted-foreground">u</dt><dd className="font-mono">{scene.u}</dd></div>
                <div className="hidden justify-between gap-2 border-t border-border pt-1 sm:flex"><dt className="text-muted-foreground">O = u/ℓ</dt><dd className="font-mono font-bold">{scene.m === null ? "—" : "≈ 7.376113"}</dd></div>
              </dl>
            </div>
          </div>
        );
      }}
    />
  );
}
