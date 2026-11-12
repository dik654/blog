import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 같은 0–1 곡선 위에서 높이(앞으로 보낼 값)와 기울기(뒤 변화율에 곱할 값)를 구분한다.
 * 입력 2: e^(−2)≈0.135335 → 1.135335 → 역수 0.880797, 기울기 0.104994, 뒤 변화율 3 → 0.314981.
 * 입력 0: 0.5, 0.25. 입력 10: 0.999955, 0.000045.
 */
const sigma = (z: number) => 1 / (1 + Math.exp(-z));
const slopeAt = (z: number) => sigma(z) * (1 - sigma(z));

const W = 360;
const H = 206;
const X0 = 34;
const X1 = 350;
const Y_TOP = 22;
const Y_BOT = 178;
const Z_MIN = -4;
const Z_MAX = 10;
// 범례는 곡선이 1에 붙은 오른쪽 아래 빈자리에 둡니다. 왼쪽 위에 두면 입력 2의 접선이 글자를 가로지릅니다.
const LEG_X = 196;
const px = (z: number) => X0 + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (X1 - X0);
const py = (v: number) => Y_BOT - v * (Y_BOT - Y_TOP);

const CURVE = Array.from({ length: 141 }, (_, i) => Z_MIN + (i * (Z_MAX - Z_MIN)) / 140)
  .map((z, i) => `${i === 0 ? "M" : "L"}${px(z).toFixed(1)} ${py(sigma(z)).toFixed(1)}`)
  .join(" ");

const SCENES = [
  { label: "높이: 앞으로 보낼 값", summary: "입력 2 → 0.880797", z: 2, height: true, tangent: false, back: false, note: "입력 2의 부호를 바꿔 지수를 취하면 e^(−2)≈0.135335, 1을 더하면 1.135335, 역수는 약 0.880797입니다. 이 높이가 다음 계산에 전달됩니다." },
  { label: "기울기: 조금 움직였을 때", summary: "입력 2의 기울기 0.104994", z: 2, height: true, tangent: true, back: false, note: "같은 자리에서 곡선에 닿는 직선의 기울기는 약 0.104994입니다. 입력을 아주 조금 움직이면 출력이 그 비율로 움직인다는 뜻이고, 높이 0.880797과는 다른 숫자입니다." },
  { label: "뒤로: 기울기를 곱합니다", summary: "3 × 0.104994 ≈ 0.314981", z: 2, height: false, tangent: true, back: true, note: "뒤 계산이 보낸 변화율 3에 높이가 아니라 기울기 0.104994를 곱해 약 0.314981을 앞 계산으로 돌려보냅니다." },
  { label: "입력 0 (가정)", summary: "높이 0.5 · 기울기 0.25", z: 0, height: true, tangent: true, back: false, note: "같은 곡선의 가운데로 옮기면 높이는 0.5로 낮아지지만 기울기는 0.25로 커집니다. 높이가 낮다고 기울기도 작은 것은 아닙니다." },
  { label: "입력 10 (가정)", summary: "높이 0.999955 · 기울기 0.000045", z: 10, height: true, tangent: true, back: false, note: "입력 10에서는 높이가 1에 거의 붙지만 기울기는 약 0.000045로 거의 평평합니다. 높이와 기울기를 따로 읽어야 하는 이유입니다." },
] as const;

const fmt = (v: number) => (v < 0.001 ? v.toFixed(6) : v.toFixed(6).replace(/0+$/, "").replace(/\.$/, ""));

export default function HeightSlopeViz() {
  return (
    <SceneShell
      eyebrow="같은 곡선 · 두 숫자"
      title="곡선의 높이는 앞으로, 그 자리의 기울기는 뒤로 갑니다"
      description="가로축은 입력, 세로축은 출력(0–1)입니다. 1절에서 정한 입력 2와 뒤 변화율 3을 그대로 씁니다(가정)."
      ariaLabel="0과 1 사이 곡선 위에서 입력 2, 0, 10의 높이와 기울기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const z = scene.z;
        const v = sigma(z);
        const s = slopeAt(z);
        const half = 1.2;
        const t0 = Math.max(Z_MIN, z - half);
        const t1 = Math.min(Z_MAX, z + half);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={X0} x2={X1} y1={Y_BOT} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y_TOP - 6} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={py(1)} y2={py(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X0 - 5} y={py(1) + 4} textAnchor="end" fontSize={11} fill="#64748b">1</text>
            <text x={X0 - 5} y={py(0.5) + 4} textAnchor="end" fontSize={11} fill="#64748b">0.5</text>
            <text x={X0 - 5} y={Y_BOT + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
            <line x1={X0 - 3} x2={X0} y1={py(0.5)} y2={py(0.5)} stroke="#94a3b8" strokeWidth={1} />
            {[0, 2, 10].map((tick) => (
              <g key={tick}>
                <line x1={px(tick)} x2={px(tick)} y1={Y_BOT} y2={Y_BOT + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(tick)} y={Y_BOT + 16} textAnchor={tick === 10 ? "end" : "middle"} fontSize={11} fill={tick === z ? "#2563eb" : "#64748b"} fontWeight={tick === z ? 700 : 400}>{tick}</text>
              </g>
            ))}
            <text x={px(-4)} y={Y_BOT + 16} textAnchor="start" fontSize={11} fill="#64748b">입력 →</text>
            <path d={CURVE} fill="none" stroke="#64748b" strokeWidth={1.25} />

            {scene.height && <line x1={px(z)} x2={px(z)} y1={Y_BOT} y2={py(v)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />}
            {scene.tangent && <line x1={px(t0)} x2={px(t1)} y1={py(v + s * (t0 - z))} y2={py(v + s * (t1 - z))} stroke="#d97706" strokeWidth={1.25} />}
            <circle cx={px(z)} cy={py(v)} r={4} fill="#2563eb" />

            <g opacity={scene.height ? 1 : 0.25}>
              <line x1={LEG_X} x2={LEG_X + 14} y1={84} y2={84} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={LEG_X + 20} y={88} fontSize={13} fontWeight={700} fill="#2563eb">{`높이 ${fmt(v)}`}</text>
            </g>
            <g opacity={scene.tangent ? 1 : 0.25}>
              <line x1={LEG_X} x2={LEG_X + 14} y1={106} y2={106} stroke="#d97706" strokeWidth={1.25} />
              <text x={LEG_X + 20} y={110} fontSize={13} fontWeight={700} fill="#b45309">{scene.tangent ? `기울기 ${fmt(s)}` : "기울기 ?"}</text>
            </g>

            {scene.back && (
              <g>
                <rect x={196} y={124} width={156} height={46} rx={6} fill="none" stroke="#d97706" strokeWidth={1} />
                <text x={206} y={143} fontSize={12} fill="#b45309">← 뒤에서 온 변화율 3</text>
                <text x={206} y={161} fontSize={12} fontWeight={700} fill="#b45309">× 0.104994 ≈ 0.314981</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
