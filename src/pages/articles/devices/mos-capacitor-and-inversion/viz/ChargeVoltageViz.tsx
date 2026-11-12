import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 문턱을 넘은 여분 전압에만 선형 전하식을 적용한다.
 * 10 nm: 0.3453 pF × 0.5 V ≈ 0.173 pC ≈ 108만 개.
 * 5 nm(같은 문턱 가정): 0.6906 pF × 0.5 V ≈ 0.345 pC ≈ 216만 개(두 배).
 */
const W = 360;
const H = 240;
const X0 = 52;
const X1 = 288;
const Y0 = 176;
const Y1 = 22;
const Q_MAX = 0.4;
const VTH = 0.5;
const C10 = 0.3453;
const C5 = 0.6906;

const vx = (v: number) => X0 + v * (X1 - X0);
const qy = (q: number) => Y0 - (q / Q_MAX) * (Y0 - Y1);
const at1V = (c: number) => c * (1.0 - VTH);

const SCENES = [
  {
    label: "10 nm · 여분 0.5 V",
    summary: "0.345 pF × 0.5 V ≈ 0.173 pC",
    note: "1.0 V 가운데 문턱 0.5 V(가정)를 넘은 0.5 V만 선형식에 들어갑니다. 기울기는 절연층 용량 0.345 pF이고, 1.0 V에서 약 0.173 pC, 전자로 약 108만 개입니다.",
  },
  {
    label: "5 nm · 같은 문턱 가정",
    summary: "0.691 pF × 0.5 V ≈ 0.345 pC",
    note: "두께만 절반으로 줄이고 문턱을 같은 0.5 V로 고정한다고 가정하면 기울기가 두 배가 됩니다. 같은 1.0 V에서 전하도 약 0.345 pC로 두 배입니다. 실제 소자에서는 문턱·누설·공급 속도가 함께 바뀔 수 있어 조건부 비교입니다.",
  },
  {
    label: "문턱 근처",
    summary: "선형식은 강한 반전의 근사",
    note: "문턱은 전자가 하나도 없다가 갑자기 생기는 선이 아니라 약한 반전에서 강한 반전으로 넘어가는 기준입니다. 회색 구간의 표면 전하는 이 직선으로 읽지 않고 더 자세한 모델로 구해야 합니다.",
  },
] as const;

export default function ChargeVoltageViz() {
  return (
    <SceneShell
      eyebrow="같은 축에서 두께 비교"
      title="문턱을 넘은 전압만큼 반전 전하가 늘고, 두께를 줄이면 기울기가 커집니다"
      description="가로축은 전극 전압, 세로축은 표면에 추가로 모인 전자 전하의 크기(pC)입니다. 직선의 기울기가 절연층 용량입니다. 면적 100 µm²·평탄띠 0 V·문턱 0.5 V는 모두 가정입니다."
      note="강한 반전의 간단한 전하 시트 모델입니다. 문턱 아래 구간의 실제 전하량은 그리지 않았습니다."
      ariaLabel="전극 전압에 따른 반전 전하, 10 nm와 5 nm 비교"
      scenes={SCENES}
      render={(active) => {
        const show5 = active >= 1;
        const weak = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={vx(0)} y={Y1} width={vx(VTH) - vx(0)} height={Y0 - Y1} fill={weak ? "#e2e8f0" : "#f1f5f9"} stroke={weak ? "#64748b" : "none"} strokeWidth={1} strokeDasharray="3 3" />
            <text x={(vx(0) + vx(VTH)) / 2} y={Y1 + 18} textAnchor="middle" fontSize={11} fill="#475569">문턱 아래</text>
            <text x={(vx(0) + vx(VTH)) / 2} y={Y1 + 34} textAnchor="middle" fontSize={10} fill="#64748b">이 직선으로 읽지 않음</text>

            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y0} y2={Y1 - 6} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1.0].map((v) => (
              <g key={v}>
                <line x1={vx(v)} x2={vx(v)} y1={Y0} y2={Y0 + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={vx(v)} y={Y0 + 17} textAnchor={v === 0 ? "start" : v === 1 ? "end" : "middle"} fontSize={11} fill="#475569">{v.toFixed(1)} V</text>
              </g>
            ))}
            <text x={vx(0.25)} y={Y0 + 43} textAnchor="middle" fontSize={11} fill="#64748b">전극 전압 V_G →</text>
            {[0.173, 0.345].map((q) => (
              <g key={q}>
                <line x1={X0 - 4} x2={X0} y1={qy(q)} y2={qy(q)} stroke="#94a3b8" strokeWidth={1} />
                <text x={X0 - 6} y={qy(q) + 4} textAnchor="end" fontSize={10} fill="#475569">{q}</text>
              </g>
            ))}
            <text x={X0 - 6} y={Y1 - 10} textAnchor="end" fontSize={10} fill="#64748b">pC</text>

            <line x1={vx(VTH)} x2={vx(VTH)} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />

            <line x1={vx(VTH)} y1={qy(0)} x2={vx(1)} y2={qy(at1V(C10))} stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={vx(1)} cy={qy(at1V(C10))} r={3.5} fill="#2563eb" />
            <text x={vx(1) + 8} y={qy(at1V(C10)) + 4} fontSize={11} fontWeight={700} fill="#2563eb">10 nm</text>
            <text x={vx(1) + 8} y={qy(at1V(C10)) + 18} fontSize={10} fill="#2563eb">약 108만 개</text>

            {show5 && (
              <>
                <line x1={vx(VTH)} y1={qy(0)} x2={vx(1)} y2={qy(at1V(C5))} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <circle cx={vx(1)} cy={qy(at1V(C5))} r={3.5} fill="#d97706" />
                <text x={vx(1) + 8} y={qy(at1V(C5)) + 4} fontSize={11} fontWeight={700} fill="#b45309">5 nm</text>
                <text x={vx(1) + 8} y={qy(at1V(C5)) + 18} fontSize={10} fill="#b45309">약 216만 개</text>
              </>
            )}

            <line x1={vx(VTH)} x2={vx(1)} y1={Y0 + 27} y2={Y0 + 27} stroke="#475569" strokeWidth={1} />
            <line x1={vx(VTH)} x2={vx(VTH)} y1={Y0 + 23} y2={Y0 + 31} stroke="#475569" strokeWidth={1} />
            <line x1={vx(1)} x2={vx(1)} y1={Y0 + 23} y2={Y0 + 31} stroke="#475569" strokeWidth={1} />
            <text x={(vx(VTH) + vx(1)) / 2} y={Y0 + 43} textAnchor="middle" fontSize={11} fill="#334155">여분 ΔV = 0.5 V</text>
          </svg>
        );
      }}
    />
  );
}
