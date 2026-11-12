import SceneShell from "./SceneShell";

/**
 * 본문 대응: #calibration — noul:2 칸 T=1.983. σ(2.0)=0.881, 2.0÷1.983=1.008, σ(1.008)=0.733.
 * ECE 예(가정): 답 10개, 첫 칸 5개 평균 확신 0.95·정답 3개, 둘째 칸 5개 평균 확신 0.65·정답 3개.
 * 0.5×|0.95−0.6| + 0.5×|0.65−0.6| = 0.175 + 0.025 = 0.2.
 */
const SCENES = [
  { label: "보정 전", summary: "σ(2.0) = 0.881", note: "noul 질문에서 yes와 no의 logit 차이가 2.0이면, 이 차이를 sigmoid 곡선에 넣은 보정 전 yes 확률은 0.881입니다." },
  { label: "T = 1.983으로 나눔", summary: "σ(2.0 ÷ 1.983) = σ(1.008) = 0.733", note: "noul:2 칸의 출시 temperature로 나누면 차이가 1.008로 줄어 곡선의 더 낮은 자리를 읽습니다. T가 1보다 크면 확신이 내려갑니다." },
  { label: "ECE 첫 칸", summary: "0.5 × |0.95 − 0.6| = 0.175", note: "ECE는 답을 확신 구간별 칸에 나눈 뒤, 칸마다 평균 확신과 실제 정답률의 차이에 그 칸의 비중을 곱해 더한 값입니다. 첫 칸은 답 10개 중 5개(비중 0.5)가 평균 확신 0.95인데 3개만 맞았습니다." },
  { label: "ECE 둘째 칸과 합", summary: "0.175 + 0.025 = 0.2", note: "둘째 칸 5개는 평균 확신 0.65에 3개가 맞아 차이가 0.05입니다. 합한 ECE 0.2 가운데 0.175가 첫 칸의 과신에서 나옵니다." },
] as const;

const W = 360;
const H = 200;
const X0 = 44;
const X1 = 330;
const Y0 = 160;
const Y1 = 24;
const sx = (d: number) => X0 + ((d + 1) / 4) * (X1 - X0);
const sy = (p: number) => Y0 - p * (Y0 - Y1);
const sig = (d: number) => 1 / (1 + Math.exp(-d));
const CURVE = Array.from({ length: 41 }, (_, i) => -1 + i * 0.1)
  .map((d, i) => `${i === 0 ? "M" : "L"}${sx(d).toFixed(1)} ${sy(sig(d)).toFixed(1)}`)
  .join("");
const BINS = [
  { name: "첫 칸 · 답 5개", conf: 0.95, acc: 0.6, part: "0.175", x: 60 },
  { name: "둘째 칸 · 답 5개", conf: 0.65, acc: 0.6, part: "0.025", x: 200 },
] as const;
const BAR = 30;

function Axes({ yLabel }: { yLabel: string }) {
  return (
    <g>
      {[0, 0.5, 1].map((p) => (
        <g key={p}>
          <line x1={X0} x2={X1} y1={sy(p)} y2={sy(p)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={X0 - 6} y={sy(p) + 4} textAnchor="end" fontSize={10} fill="#64748b">{p}</text>
        </g>
      ))}
      <text x={6} y={14} fontSize={10} fill="#64748b">{yLabel}</text>
    </g>
  );
}

export default function CalibrationViz() {
  return (
    <SceneShell
      eyebrow="temperature와 ECE"
      title="T로 나누면 곡선의 낮은 자리를 읽고, ECE는 확신과 정답률의 틈을 잽니다"
      description="앞 두 장면은 noul 질문 하나, 뒤 두 장면은 답 10개짜리 가상의 묶음입니다. ECE 칸은 코드처럼 15개지만 이 예에서는 두 칸만 찹니다. (가정)"
      ariaLabel="temperature로 확률이 내려가는 과정과 두 칸짜리 ECE 계산"
      scenes={SCENES}
      render={(active) => {
        if (active <= 1) {
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <Axes yLabel="yes 확률" />
              <path d={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1.25} />
              <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
              {[-1, 0, 1, 2, 3].map((d) => (
                <text key={d} x={sx(d)} y={Y0 + 14} textAnchor="middle" fontSize={9} fill="#94a3b8">{d}</text>
              ))}
              <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={10} fill="#64748b">yes logit − no logit →</text>
              <g opacity={active === 0 ? 1 : 0.35}>
                <line x1={sx(2)} x2={sx(2)} y1={Y0} y2={sy(0.881)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X0} x2={sx(2)} y1={sy(0.881)} y2={sy(0.881)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(2)} cy={sy(0.881)} r={4.5} fill="#64748b" />
                <text x={sx(2) + 8} y={sy(0.881) + 14} fontSize={10} fontWeight={700} fill="#475569">2.0 → 0.881</text>
              </g>
              <g opacity={active === 1 ? 1 : 0}>
                <line x1={sx(1.008)} x2={sx(1.008)} y1={Y0} y2={sy(0.733)} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X0} x2={sx(1.008)} y1={sy(0.733)} y2={sy(0.733)} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(1.008)} cy={sy(0.733)} r={4.5} fill="#2563eb" />
                <text x={sx(1.008) - 8} y={sy(0.733) - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">1.008 → 0.733</text>
                <path d={`M${sx(2)} ${Y0 - 8}L${sx(1.008) + 7} ${Y0 - 8}`} stroke="#2563eb" strokeWidth={1.25} />
                <path d={`M${sx(1.008) + 7} ${Y0 - 12}L${sx(1.008)} ${Y0 - 8}L${sx(1.008) + 7} ${Y0 - 4}Z`} fill="#2563eb" />
                <text x={(sx(2) + sx(1.008)) / 2} y={Y0 - 13} textAnchor="middle" fontSize={10} fill="#2563eb">÷ 1.983</text>
              </g>
            </svg>
          );
        }
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Axes yLabel="확률·정답률" />
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            {BINS.map((bin, index) => {
              const on = index === 0 || active === 3;
              return (
                <g key={bin.name} opacity={on ? 1 : 0.18}>
                  <rect x={bin.x} y={sy(bin.conf)} width={BAR} height={Y0 - sy(bin.conf)} rx={2} fill="#94a3b8" />
                  <rect x={bin.x + BAR + 6} y={sy(bin.acc)} width={BAR} height={Y0 - sy(bin.acc)} rx={2} fill="#2563eb" />
                  <text x={bin.x + BAR / 2} y={sy(bin.conf) - 5} textAnchor="middle" fontSize={10} fill="#475569">{bin.conf}</text>
                  <text x={bin.x + BAR * 1.5 + 6} y={sy(bin.acc) - 5} textAnchor="middle" fontSize={10} fill="#2563eb">{bin.acc}</text>
                  <line x1={bin.x + BAR * 2 + 12} x2={bin.x + BAR * 2 + 12} y1={sy(bin.conf)} y2={sy(bin.acc)} stroke="#dc2626" strokeWidth={1.25} />
                  <text x={bin.x + BAR * 2 + 16} y={(sy(bin.conf) + sy(bin.acc)) / 2 + 4} fontSize={10} fontWeight={700} fill="#dc2626">×0.5 = {bin.part}</text>
                  <text x={bin.x + BAR + 3} y={Y0 + 15} textAnchor="middle" fontSize={10} fill="#475569">{bin.name}</text>
                </g>
              );
            })}
            <text x={X0} y={Y0 + 32} fontSize={10} fill="#64748b">회색 평균 확신 · 파랑 정답률 · 빨강 차이</text>
            <text x={X1} y={Y0 + 32} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626" opacity={active === 3 ? 1 : 0}>ECE 0.2</text>
          </svg>
        );
      }}
    />
  );
}
