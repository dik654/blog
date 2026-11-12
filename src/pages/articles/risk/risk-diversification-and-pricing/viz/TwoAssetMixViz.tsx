import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: covariance 절의 두 자산 식과 그 해석 예시.
 * σ1 = σ2 = 20%, w1 = w2 = 0.5 → 각자의 몫 0.25×400 = 100씩, 함께 움직이는 몫 2×0.5×0.5×ρ×20×20 = 200ρ.
 * ρ = 1: 400 → 20%, ρ = 0: 200 → 14.1%, ρ = −1: 0 → 0%.
 */
const SD = 20;
const W = 0.5;
const OWN = W * W * SD * SD;
const RHOS = [1, 0, -1];
const cross = (rho: number) => 2 * W * W * rho * SD * SD;
const total = (rho: number) => 2 * OWN + cross(rho);

const sdText = (rho: number) => {
  const sd = Math.sqrt(total(rho));
  return Number.isInteger(sd) ? `${sd}` : sd.toFixed(1);
};
const rhoText = (rho: number) => (rho < 0 ? `−${Math.abs(rho)}` : `${rho}`);

const NOTES = [
  `상관이 1이면 함께 움직이는 몫이 +${cross(1)}으로 가장 커집니다. 합친 분산 ${total(1)}, 표준편차 ${sdText(1)}%로 하나도 줄지 않습니다.`,
  `상관이 0이면 함께 움직이는 몫이 통째로 사라집니다. 합친 분산 ${total(0)}, 표준편차 약 ${sdText(0)}%로 각자의 ${SD}%보다 작아집니다.`,
  `상관이 −1이면 함께 움직이는 몫이 −${Math.abs(cross(-1))}이 되어 각자의 몫 ${2 * OWN}을 전부 깎아 냅니다. 합친 분산이 ${total(-1)}이라 위험이 완전히 사라집니다.`,
];

const SCENES = RHOS.map((rho, i) => ({
  label: `상관 ρ = ${rhoText(rho)}`,
  summary: `σp = √${total(rho)} = ${sdText(rho)}%`,
  note: NOTES[i],
}));

const ACCENT = "#6366f1";
const WARN = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";
const INK = "#64748b";

const X0 = 104;
const PX = 0.55; // 분산 1당 px, 400 → 220px

export default function TwoAssetMixViz() {
  return (
    <StackedSceneShell
      eyebrow="두 자산을 반씩"
      title="섞은 위험은 상관이 정하는 셋째 몫만큼 달라집니다"
      description="본문 식의 예시 그대로 표준편차 20%인 두 자산을 반씩 담았습니다. 상관(ρ)은 두 자산이 같은 방향으로 움직이는 정도로 −1에서 1 사이입니다. 막대 길이는 분산(%의 제곱)입니다."
      note="상관이 과거 값 그대로 유지된다고 둔 계산입니다. 본문이 짚듯 이 가정이 위기 때 가장 먼저 깨집니다."
      ariaLabel="상관이 1, 0, −1일 때 두 자산 포트폴리오 분산의 세 몫"
      scenes={SCENES}
      render={(s) => {
        const rho = RHOS[s];
        const c = cross(rho);
        const t = total(rho);
        const ownEnd = X0 + 2 * OWN * PX;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${SCENES[s].summary}`}>
            <text x={6} y={14} fontSize={10.5} fill={INK}>각 자산: 비중 0.5 · 표준편차 20% (분산 400)</text>

            <text x={6} y={44} fontSize={10.5} fontWeight={700} fill={INK}>각자의 몫</text>
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x={X0 + i * OWN * PX} y={30} width={OWN * PX} height={20} fill={MUTED} fillOpacity={0.25} stroke={INK} strokeWidth={1} />
                <text x={X0 + (i + 0.5) * OWN * PX} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>
                  {OWN}
                </text>
              </g>
            ))}
            <text x={ownEnd + 6} y={44} fontSize={10} fill={MUTED}>0.25×400</text>

            <text x={6} y={80} fontSize={10.5} fontWeight={700} fill={INK}>함께 움직이는</text>
            <text x={6} y={93} fontSize={10.5} fontWeight={700} fill={INK}>몫 (200ρ)</text>
            {c > 0 && (
              <rect x={ownEnd} y={70} width={c * PX} height={20} fill={WARN} fillOpacity={0.2} stroke={WARN} strokeWidth={1} />
            )}
            {c < 0 && (
              <rect x={ownEnd + c * PX} y={70} width={-c * PX} height={20} fill={OK} fillOpacity={0.2} stroke={OK} strokeWidth={1} strokeDasharray="4 3" />
            )}
            <line x1={ownEnd} y1={64} x2={ownEnd} y2={96} stroke={MUTED} strokeWidth={1} strokeDasharray="2 2" />
            <text
              x={c > 0 ? ownEnd + (c * PX) / 2 : c < 0 ? ownEnd + (c * PX) / 2 : ownEnd + 6}
              y={84}
              textAnchor={c === 0 ? "start" : "middle"}
              fontSize={10.5}
              fontWeight={700}
              fill={c > 0 ? WARN : c < 0 ? OK : INK}
            >
              {c > 0 ? `+${c}` : c < 0 ? `−${-c} 깎음` : "0 · 사라짐"}
            </text>

            <text x={6} y={124} fontSize={10.5} fontWeight={700} fill={ACCENT}>합친 분산</text>
            {t > 0 && (
              <rect x={X0} y={110} width={t * PX} height={20} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeWidth={1} />
            )}
            <line x1={X0} y1={106} x2={X0} y2={134} stroke={ACCENT} strokeWidth={1} />
            <text x={X0 + t * PX + 6} y={124} fontSize={10.5} fontWeight={700} fill={ACCENT}>{t}</text>

            <text x={6} y={158} fontSize={10.5} fontWeight={700} fill={ACCENT}>
              표준편차 √{t} = {sdText(rho)}%
            </text>
            <text x={354} y={158} textAnchor="end" fontSize={10} fill={MUTED}>각자는 {SD}%</text>
          </svg>
        );
      }}
    />
  );
}
