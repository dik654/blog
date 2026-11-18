import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 평소 노출 10·부도확률 2%·손실률 60% → 0.12,
 * 충격 때 노출 18·부도확률 5% → 0.54. 노출 1.8배 × 부도확률 2.5배 = 손실 4.5배.
 * 가운데 장면(노출만 18, 부도확률 2%)은 두 배수를 나눠 보이려는 비교용 계산이다.
 * 사각형 넓이 = 노출 × 부도확률, 여기에 손실률 0.60을 곱하면 기대손실.
 */
const LGD = 0.6;

const SCENES = [
  { label: "평소", exposure: 10, pd: 0.02, summary: "10 × 2% × 60% = 0.12", note: "노출과 부도를 서로 독립으로 본 단순 기대손실입니다. 사각형 넓이(노출×부도확률) 0.2에 손실률 60%를 곱해 0.12입니다." },
  { label: "노출만 커졌다면(비교용)", exposure: 18, pd: 0.02, summary: "18 × 2% × 60% = 0.216", note: "부도확률이 2%에 머물렀다고 놓고 노출만 1.8배로 키운 비교용 계산입니다. 넓이도 1.8배라 손실은 0.216에 그칩니다." },
  { label: "노출과 부도확률이 함께", exposure: 18, pd: 0.05, summary: "18 × 5% × 60% = 0.54", note: "같은 시장 충격이 노출을 1.8배, 부도확률을 2.5배로 함께 키웠습니다. 넓이는 1.8×2.5=4.5배가 되어 손실이 0.12에서 0.54로 뜁니다." },
] as const;

const W = 360;
const H = 210;
const X0 = 44;
const Y0 = 176;
const X_MAX = 20;
const PD_MAX = 0.06;
const PLOT_W = 290;
const PLOT_H = 150;
const px = (exposure: number) => X0 + (exposure / X_MAX) * PLOT_W;
const py = (pd: number) => Y0 - (pd / PD_MAX) * PLOT_H;
const fmt = (value: number) => String(Math.round(value * 1000) / 1000);

export default function WrongWayAreaViz() {
  return (
    <SceneShell
      eyebrow="곱해지는 두 입력"
      title="노출과 부도확률이 함께 커지면 넓이는 곱으로 커집니다"
      description="가로는 미래 양의 노출(상대방에게 받을 가치), 세로는 그 기간에 상대방이 부도날 확률입니다. 사각형 넓이에 손실률 60%를 곱하면 기대손실입니다. 숫자는 4절의 설명용 가정입니다."
      ariaLabel="노출과 부도확률의 곱으로 기대손실이 커지는 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const base = SCENES[0];
        const area = scene.exposure * scene.pd;
        const ratio = area / (base.exposure * base.pd);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={X0} x2={X0 + PLOT_W} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y0} y2={Y0 - PLOT_H} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 18, 20].map((tick) => (
              <text key={tick} x={px(tick)} y={Y0 + 14} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            {[0.02, 0.05].map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={X0 + PLOT_W} y1={py(tick)} y2={py(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick * 100}%</text>
              </g>
            ))}
            <text x={X0 + PLOT_W} y={Y0 + 28} textAnchor="end" fontSize={11} fill="#64748b">노출 →</text>
            <text x={X0} y={Y0 - PLOT_H - 6} textAnchor="middle" fontSize={11} fill="#64748b">부도확률</text>
            <rect x={px(0)} y={py(base.pd)} width={px(base.exposure) - px(0)} height={Y0 - py(base.pd)} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <rect
              x={px(0)}
              y={py(scene.pd)}
              width={px(scene.exposure) - px(0)}
              height={Y0 - py(scene.pd)}
              fill={index === 2 ? "#dc2626" : "#2563eb"}
              opacity={0.22}
              stroke={index === 2 ? "#dc2626" : "#2563eb"}
              strokeWidth={1.25}
            />
            <text x={(px(0) + px(scene.exposure)) / 2} y={(py(scene.pd) + Y0) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={index === 2 ? "#b91c1c" : "#1d4ed8"}>
              넓이 {fmt(area)} × 0.6 = {fmt(area * LGD)}
            </text>
            <text x={X0 + PLOT_W} y={py(0.055)} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">
              {index === 0 ? "점선 = 평소 넓이 0.2" : `점선(평소)의 ${fmt(ratio)}배`}
            </text>
          </svg>
        );
      }}
    />
  );
}
