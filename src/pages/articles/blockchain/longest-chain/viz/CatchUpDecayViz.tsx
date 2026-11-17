import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finality ExplainedFormula — q=0.1, p=0.9.
 * deficit z는 work event마다 +1(정직, p) 또는 −1(공격자, q). P_catch(z) = (q/p)^z = (1/9)^z.
 * z=1 0.111, 2 0.0123, 3 0.00137, 4 1.52e-4, 5 1.69e-5, 6 1.88e-6.
 */
const Q = 0.1;
const P = 0.9;
const RATIO = Q / P;
const ZS = [0, 1, 2, 3, 4, 5, 6] as const;
const CATCH = ZS.map((z) => RATIO ** z);

const W = 360;
const H = 200;
const LEFT = 52;
const RIGHT = 344;
const BASE_Y = 172;
const TOP_Y = 24;
const DECADES = 6;
const logY = (value: number) => TOP_Y + (-Math.log10(value) / DECADES) * (BASE_Y - TOP_Y);

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function formatProb(value: number) {
  if (value >= 0.001) return value.toPrecision(3).replace(/0+$/, "").replace(/\.$/, "");
  const exp = Math.floor(Math.log10(value));
  const digits = String(-exp).split("").map((d) => SUPERSCRIPT[Number(d)]).join("");
  return `${(value / 10 ** exp).toFixed(2)}×10⁻${digits}`;
}

const SCENES = [
  {
    label: "Deficit은 한 칸씩 움직입니다",
    summary: "+1 확률 p=0.9 · −1 확률 q=0.1",
    note: "공격 분기가 z=6 뒤처져 있다고 둡니다. 다음 work를 정직한 쪽이 얻으면(p) 한 칸 멀어지고, 공격자가 얻으면(q) 한 칸 가까워집니다. 0이 동률입니다.",
  },
  {
    label: "한 칸 멀수록 1/9배",
    summary: "(0.1/0.9)^6 ≈ 1.88×10⁻⁶",
    note: "q/p=1/9라 deficit이 한 칸 늘면 확률이 1/9배가 됩니다. 세로축은 한 칸이 10배인 로그 눈금이며, p·q가 일정하다는 전제 안의 값입니다.",
  },
] as const;

function Walk() {
  const step = 38;
  const x0 = 28;
  const y = 112;
  return (
    <g>
      <line x1={x0} x2={x0 + 8 * step} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line x1={x0 + i * step} x2={x0 + i * step} y1={y - 5} y2={y + 5} stroke="#94a3b8" strokeWidth={1} />
          <text x={x0 + i * step} y={y + 22} textAnchor="middle" fontSize={11} fill={i === 0 ? "#dc2626" : "#64748b"} fontWeight={i === 0 ? 700 : 400}>{i}</text>
        </g>
      ))}
      <text x={x0} y={y + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">동률</text>
      <text x={x0 + 8 * step} y={y + 40} textAnchor="end" fontSize={11} fill="#64748b">deficit z (work-step)</text>
      <circle cx={x0 + 6 * step} cy={y} r={9} fill="#2563eb" />
      <text x={x0 + 6 * step} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">6</text>
      <path d={`M ${x0 + 6 * step - 4} ${y - 14} Q ${x0 + 5.5 * step} ${y - 46} ${x0 + 5 * step + 4} ${y - 14}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
      <path d={`M ${x0 + 5 * step + 4} ${y - 14} l 1 -7 M ${x0 + 5 * step + 4} ${y - 14} l 7 -2`} stroke="#d97706" strokeWidth={1.25} />
      <text x={x0 + 5 * step - 6} y={y - 52} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">공격자 work −1 · q=0.1</text>
      <path d={`M ${x0 + 6 * step + 4} ${y - 14} Q ${x0 + 6.5 * step} ${y - 46} ${x0 + 7 * step - 4} ${y - 14}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      <path d={`M ${x0 + 7 * step - 4} ${y - 14} l -1 -7 M ${x0 + 7 * step - 4} ${y - 14} l -7 -2`} stroke="#2563eb" strokeWidth={1.25} />
      <text x={x0 + 7 * step + 4} y={y - 74} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">정직 work +1 · p=0.9</text>
    </g>
  );
}

function Decay() {
  const slot = (RIGHT - LEFT) / ZS.length;
  const barW = slot * 0.55;
  return (
    <g>
      {Array.from({ length: DECADES + 1 }, (_, d) => (
        <g key={d}>
          <line x1={LEFT} x2={RIGHT} y1={logY(10 ** -d)} y2={logY(10 ** -d)} stroke="#94a3b8" strokeWidth={0.5} strokeOpacity={0.5} />
          <text x={LEFT - 6} y={logY(10 ** -d) + 4} textAnchor="end" fontSize={10} fill="#64748b">{d === 0 ? "1" : `10⁻${"¹²³⁴⁵⁶"[d - 1]}`}</text>
        </g>
      ))}
      {ZS.map((z, i) => {
        const x = LEFT + i * slot + (slot - barW) / 2;
        const top = logY(CATCH[i]);
        const last = z === 6;
        return (
          <g key={z}>
            <rect x={x} y={top} width={barW} height={Math.max(BASE_Y - top, 1)} rx={2} fill={last ? "#2563eb" : "#64748b"} fillOpacity={last ? 0.9 : 0.5} />
            {z > 0 && <text x={x + barW / 2} y={top - 5} textAnchor="middle" fontSize={8} fontWeight={last ? 700 : 400} fill={last ? "#2563eb" : "#475569"}>{formatProb(CATCH[i])}</text>}
            <text x={x + barW / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">z={z}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function CatchUpDecayViz() {
  return (
    <SceneShell
      eyebrow="뒤처진 공격 분기 · q=0.1, p=0.9"
      title="Deficit이 한 칸 늘 때마다 따라잡을 확률은 1/9배가 됩니다"
      description="Deficit은 관찰 시점에 공격 분기가 뒤처진 work-step 수입니다. p·q가 일정하고 q<p인 단순 random walk 모델의 값입니다."
      ariaLabel="deficit random walk와 z별 eventual catch-up 확률의 로그 눈금 막대"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <Walk /> : <Decay />}
        </svg>
      )}
    />
  );
}
