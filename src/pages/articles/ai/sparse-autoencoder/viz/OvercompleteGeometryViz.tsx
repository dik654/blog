import SceneShell from "./SceneShell";

/**
 * 본문 대응: #polysemanticity — d차원 activation을 d보다 많은 m개 decoder direction의
 * 소수 가중합으로 다시 기술한다(x̂ = Σ z_i d_i, m > d, ‖z‖₀ ≪ m). 분해는 일반적으로 유일하지 않다.
 * 가정: d=2, m=4, 방향 각도 15°·60°·105°·150°(unit), x = 0.5·d₁ + 1.0·d₂ = (0.983, 0.995).
 * 다른 분해: d₁⊥d₃이므로 z₁ = x·d₁ ≈ 1.207, z₃ = x·d₃ ≈ 0.707 → x = 1.207·d₁ + 0.707·d₃.
 */
const ANGLES = [15, 60, 105, 150];
const DIRS = ANGLES.map((deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)] as const);
const X = [0.5 * DIRS[0][0] + DIRS[1][0], 0.5 * DIRS[0][1] + DIRS[1][1]] as const;
const dot = (a: readonly number[], b: readonly number[]) => a[0] * b[0] + a[1] * b[1];
const ALT1 = dot(X, DIRS[0]);
const ALT3 = dot(X, DIRS[2]);

const OX = 170;
const OY = 178;
const S = 118;
const px = (v: number) => OX + v * S;
const py = (v: number) => OY - v * S;
const f2 = (v: number) => v.toFixed(2);

type Combo = { a: number; ca: number; b: number; cb: number } | null;

const SCENES: { label: string; summary: string; note: string; mode: "neuron" | "dict" | "combo"; combo: Combo; z: readonly number[] | null }[] = [
  {
    label: "neuron 축으로 읽기",
    summary: `x = ${f2(X[0])}·e₁ + ${f2(X[1])}·e₂`,
    note: "neuron 좌표 두 개로 읽으면 같은 activation에서 두 neuron이 모두 크게 켜집니다. 축 하나만 보고 이름을 붙이기 어렵습니다.",
    mode: "neuron",
    combo: null,
    z: null,
  },
  {
    label: "방향 4개짜리 dictionary",
    summary: "m = 4 > d = 2",
    note: "같은 평면에 decoder direction 네 개를 둡니다. 평면 차원은 2 그대로이며 정보가 새로 생기지 않습니다. 좌표 이름표만 늘어난 것입니다.",
    mode: "dict",
    combo: null,
    z: null,
  },
  {
    label: "두 방향만 켜서 복원",
    summary: "z = (0.50, 1.00, 0, 0)",
    note: "x는 0.5·d₁ + 1.0·d₂로 정확히 다시 쓸 수 있습니다. 방향 네 개 중 두 개만 0이 아니므로 ‖z‖₀ = 2입니다.",
    mode: "combo",
    combo: { a: 1, ca: 1, b: 0, cb: 0.5 },
    z: [0.5, 1, 0, 0],
  },
  {
    label: "다른 두 방향으로도 됨",
    summary: `z = (${f2(ALT1)}, 0, ${f2(ALT3)}, 0)`,
    note: `같은 x를 ${f2(ALT1)}·d₁ + ${f2(ALT3)}·d₃으로도 쓸 수 있고 여기서도 ‖z‖₀ = 2입니다. 어느 분해를 고를지는 SAE의 objective와 data가 정합니다.`,
    mode: "combo",
    combo: { a: 0, ca: ALT1, b: 2, cb: ALT3 },
    z: [ALT1, 0, ALT3, 0],
  },
];

function Arrow({ x1, y1, x2, y2, color, width = 1, dash }: { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: string }) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 6;
  const p1 = `${x2 - h * Math.cos(ang - 0.4)},${y2 - h * Math.sin(ang - 0.4)}`;
  const p2 = `${x2 - h * Math.cos(ang + 0.4)},${y2 - h * Math.sin(ang + 0.4)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </g>
  );
}

function Plane({ scene }: { scene: (typeof SCENES)[number] }) {
  const xs = px(X[0]);
  const ys = py(X[1]);
  const combo = scene.combo;
  const mid = combo ? [DIRS[combo.a][0] * combo.ca, DIRS[combo.a][1] * combo.ca] : null;
  return (
    <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {scene.mode === "neuron" ? (
        <>
          <Arrow x1={OX} y1={OY} x2={px(1.25)} y2={OY} color="#64748b" />
          <Arrow x1={OX} y1={OY} x2={OX} y2={py(1.25)} color="#64748b" />
          <text x={px(1.25) + 4} y={OY + 4} fontSize={11} fill="#64748b">e₁</text>
          <text x={OX + 5} y={py(1.25) + 4} fontSize={11} fill="#64748b">e₂</text>
          <line x1={xs} y1={ys} x2={xs} y2={OY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={xs} y1={ys} x2={OX} y2={ys} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <text x={xs} y={OY + 13} textAnchor="middle" fontSize={10} fill="#64748b">{f2(X[0])}</text>
          <text x={OX - 4} y={ys + 4} textAnchor="end" fontSize={10} fill="#64748b">{f2(X[1])}</text>
        </>
      ) : (
        <>
          <line x1={OX - 130} y1={OY} x2={OX + 170} y2={OY} stroke="#e2e8f0" strokeWidth={1} />
          {DIRS.map(([dx, dy], i) => {
            const used = scene.z ? scene.z[i] > 0 : true;
            return (
              <g key={ANGLES[i]} opacity={used ? 1 : 0.3}>
                <Arrow x1={OX} y1={OY} x2={px(dx)} y2={py(dy)} color="#64748b" />
                <text x={px(dx * 1.12)} y={py(dy * 1.12) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">d{["₁", "₂", "₃", "₄"][i]}</text>
              </g>
            );
          })}
          {combo && mid && (
            <>
              <Arrow x1={OX} y1={OY} x2={px(mid[0])} y2={py(mid[1])} color="#2563eb" width={1.25} />
              <Arrow x1={px(mid[0])} y1={py(mid[1])} x2={xs} y2={ys} color="#2563eb" width={1.25} />
            </>
          )}
        </>
      )}
      <circle cx={OX} cy={OY} r={2.5} fill="#64748b" />
      <circle cx={xs} cy={ys} r={4.5} fill="#d97706" />
      <text x={xs + 8} y={ys - 4} fontSize={11} fontWeight={700} fill="#d97706">x</text>
    </svg>
  );
}

function ZRow({ z }: { z: readonly number[] | null }) {
  return (
    <div className="mt-2 grid grid-cols-[3rem_repeat(4,minmax(0,1fr))] gap-1 text-center font-mono text-xs" aria-label="feature activation z">
      <span className="text-left text-muted-foreground">z</span>
      {[0, 1, 2, 3].map((i) => {
        const v = z ? z[i] : null;
        const on = v !== null && v > 0;
        return (
          <span key={i} className={`rounded border px-1 py-1 ${on ? "border-[#2563eb] font-bold text-[#2563eb]" : "border-border/60 text-muted-foreground/60"}`}>
            {v === null ? "·" : v === 0 ? "0" : f2(v)}
          </span>
        );
      })}
    </div>
  );
}

export default function OvercompleteGeometryViz() {
  return (
    <SceneShell
      eyebrow="overcomplete dictionary"
      title="2차원 점 하나를 방향 4개 중 2개로 다시 씁니다"
      description="d=2인 평면, 네 방향(15°·60°·105°·150°)과 점 x의 위치는 그림을 위한 가정입니다. z_i는 방향 d_i를 얼마나 쓰는지 나타내는 0 이상의 계수입니다."
      ariaLabel="2차원 activation을 네 decoder direction 중 두 개의 가중합으로 표현하는 네 장면"
      note="회색 화살표는 길이 1인 방향 d_i 자체입니다. 이웃한 방향 사이 각도는 45°라 직교와는 거리가 멉니다. 차원과 방향 수를 줄여 그린 그림입니다."
      scenes={SCENES}
      render={(i) => (
        <div className="min-w-0">
          <Plane scene={SCENES[i]} />
          <ZRow z={SCENES[i].z} />
        </div>
      )}
    />
  );
}
