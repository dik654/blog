import SceneShell from "./SceneShell";

/**
 * 본문 대응: #r1cs-qap 두 번째 식 A(X)B(X)−C(X)=H(X)Z(X).
 * 글의 행 x·y=z를 r₁에 두고, 나머지 세 행은 "실제 circuit은 많은 행을 가질 수 있다"를 보이기 위한 가정이다.
 * r₁의 위반량: 정직한 할당 3·5−15=0, 공개 입력을 z=14로 바꾸면 3·5−14=1.
 * 곡선 모양은 설명용이며 domain 점에서의 값만 의미가 있다.
 */
const ROOTS = [1, 2, 3, 4];
const X_MIN = 0.7;
const X_MAX = 4.3;
const W = 360;
const H = 170;
const PAD = 18;
const MID_Y = 100;
const UNIT = 20;
const CLAMP = 3.6;

const sx = (x: number) => PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const sy = (y: number) => MID_Y - Math.max(-CLAMP, Math.min(CLAMP, y)) * UNIT;

const vanishing = (x: number) => ROOTS.reduce<number>((prod, r) => prod * (x - r), 1);
// r₁에서 1, 나머지 domain 점에서 0인 보간 polynomial
const firstRowBump = (x: number) => -((x - 2) * (x - 3) * (x - 4)) / 6;

const SAMPLES = Array.from({ length: 73 }, (_, i) => X_MIN + (i / 72) * (X_MAX - X_MIN));
const pathOf = (f: (x: number) => number) =>
  SAMPLES.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`).join(" ");

const Z_PATH = pathOf((x) => 0.6 * vanishing(x));
const OK_PATH = pathOf((x) => -0.9 * vanishing(x));
const BAD_PATH = pathOf((x) => -0.9 * vanishing(x) + firstRowBump(x));

const SCENES = [
  {
    label: "행마다 domain 점 하나",
    summary: "Z(r₁)=…=Z(r₄)=0",
    note: "R1CS의 각 행에 X축의 점 rᵢ를 하나씩 붙입니다. Z(X)는 이 점들에서만 정확히 0이 되도록 만든 polynomial입니다. 글의 회로는 x·y=z 한 행이고, 행 2~4는 행이 여럿인 circuit을 보이기 위한 가정입니다.",
  },
  {
    label: "모든 행 만족",
    summary: "위반량이 r₁~r₄에서 모두 0",
    note: "w=[1,15,3,5]면 r₁의 위반량은 3·5−15=0입니다. 다른 행도 만족한다고 가정하면 A(X)B(X)−C(X)는 Z(X)가 0인 모든 점에서 0이므로 Z(X)로 나머지 없이 나누어지고, 그 몫이 H(X)입니다.",
  },
  {
    label: "한 행 위반 · z=14",
    summary: "r₁에서 3·5−14=1",
    note: "공개 입력을 z=14로 바꾸면 r₁의 위반량이 1이 됩니다. 한 점에서라도 0이 아니면 Z(X)로 나머지 없이 나누어지지 않으므로, 식이 요구하는 H(X)를 얻지 못합니다.",
  },
] as const;

const ROW_LABELS = ["x·y=z (글의 행)", "행 2 (가정)", "행 3 (가정)", "행 4 (가정)"] as const;
const ROW_VALUES: readonly (readonly string[])[] = [
  ["—", "—", "—", "—"],
  ["3·5−15=0", "0", "0", "0"],
  ["3·5−14=1", "0", "0", "0"],
];

export default function QapDivisibilityViz() {
  return (
    <SceneShell
      eyebrow="QAP · 나누어떨어짐"
      title="모든 행이 만족될 때만 위반량이 Z(X)로 나누어떨어집니다"
      description="보간은 정해진 점들을 지나는 polynomial을 만드는 일입니다. X축의 점 rᵢ(domain 점)가 R1CS의 한 행이고, 그 점에서 그래프의 높이가 그 행의 위반량 A·B−C입니다. Z(X)는 모든 rᵢ에서 0이 되는 polynomial입니다."
      note="행 2~4와 곡선 모양은 설명용 가정이며 세로축에 눈금을 두지 않았습니다. 실제 계산은 선택한 pairing curve의 scalar field 안에서 이루어집니다."
      ariaLabel="R1CS 행별 위반량이 domain 점에서 0인지에 따라 Z(X)로 나누어지는지 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <line x1={PAD} x2={W - PAD} y1={MID_Y} y2={MID_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={W - PAD} y={MID_Y + 30} textAnchor="end" fontSize={12} fill="#64748b">X</text>
            <text x={PAD} y={14} fontSize={12} fill="#64748b">높이 = 위반량 (눈금 없음)</text>
            {active === 0 ? (
              <path d={Z_PATH} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
            ) : (
              <path d={active === 1 ? OK_PATH : BAD_PATH} fill="none" stroke={active === 1 ? "#2563eb" : "#dc2626"} strokeWidth={1.25} />
            )}
            {ROOTS.map((r, i) => {
              const off = active === 2 && i === 0;
              return (
                <g key={r}>
                  {off && <line x1={sx(r)} x2={sx(r)} y1={MID_Y} y2={sy(1)} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />}
                  <circle
                    cx={sx(r)}
                    cy={off ? sy(1) : MID_Y}
                    r={4}
                    fill={off ? "#dc2626" : active === 0 ? "#ffffff" : "#2563eb"}
                    stroke={off ? "#dc2626" : active === 0 ? "#64748b" : "#2563eb"}
                    strokeWidth={1.25}
                  />
                  <text x={sx(r)} y={MID_Y + 18} textAnchor="middle" fontSize={13} fill="#475569">{`r${r}`}</text>
                  {off && <text x={sx(r) + 8} y={sy(1) - 6} fontSize={13} fontWeight={700} fill="#dc2626">1</text>}
                </g>
              );
            })}
          </svg>
          <p className={`mt-1 text-center text-sm font-bold ${active === 2 ? "text-red-700 dark:text-red-400" : active === 1 ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"}`}>
            {active === 0 ? "점선 = Z(X), 네 점에서 0" : active === 1 ? "네 점 모두 0 → Z(X)로 나머지 없이 나눔 → H(X)" : "r₁에서 0이 아님 → 나머지가 남음 → H(X) 없음"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px text-xs sm:grid-cols-4">
            {ROW_LABELS.map((label, i) => (
              <div key={label} className="min-w-0 bg-background px-2 py-2 text-center">
                <span className="block break-keep text-muted-foreground">{`r${i + 1} · ${label}`}</span>
                <strong className={`mt-1 block font-mono ${active === 2 && i === 0 ? "text-red-700 dark:text-red-400" : ""}`}>{ROW_VALUES[active][i]}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
