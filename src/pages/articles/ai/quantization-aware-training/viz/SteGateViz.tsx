import SceneShell from "./SceneShell";
import StaircasePlot from "./StaircasePlot";

/**
 * 본문 대응: #ste — ∂x̂/∂x ≈ 1[r_min ≤ x ≤ r_max], ∂L/∂x ≈ ∂L/∂x̂ · 1[x∈R].
 * 앞 Viz와 같은 가정: s=0.5, z=0, q∈{−4…3} → R=[0.5×(−4), 0.5×3]=[−2, 1.5].
 * upstream gradient ∂L/∂x̂=0.5(가정): x=0.8은 0.5×1=0.5, x=2.4는 0.5×0=0.
 */
const SCENES = [
  {
    label: "1. 계단의 진짜 기울기",
    summary: "평평한 칸 위에서 ∂x̂/∂x = 0",
    note: "칸 위에서는 x를 조금 움직여도 x̂가 그대로라 derivative가 0이고, 칸이 바뀌는 경계(×)에서는 값이 끊겨 정의되지 않습니다. 이 기울기를 그대로 쓰면 loss 쪽 gradient에 0이 곱해집니다.",
  },
  {
    label: "2. Range 안: identity처럼 1",
    summary: "−2 ≤ x ≤ 1.5 이면 gate = 1",
    note: "STE(straight-through estimator)는 backward에서만 fake quantizer를 주황 직선처럼 취급합니다. Representable range R은 code −4…3이 나타내는 −2부터 1.5까지이고, 그 안에서는 기울기를 1로 둡니다(가정한 s·z 기준).",
  },
  {
    label: "3. Range 밖: 포화 gate 0",
    summary: "x < −2 또는 x > 1.5 이면 gate = 0",
    note: "R 밖에서는 fake quantizer를 포화 gate처럼 보고 gradient를 0으로 막습니다. Forward의 계단과 backward의 직선은 의도적으로 다른 규칙입니다.",
  },
  {
    label: "4. Upstream gradient에 곱하기",
    summary: "x=0.8: 0.5×1 = 0.5 · x=2.4: 0.5×0 = 0",
    note: "뒤에서 돌아온 ∂L/∂x̂를 0.5로 두면(가정) R 안의 x=0.8에는 0.5가, R 밖의 x=2.4에는 0이 float master 쪽으로 갑니다. 이 근사는 round의 참 derivative가 아니고, STE variant마다 range 밖과 scale gradient 정의가 다릅니다.",
  },
] as const;

const ORANGE = "#d97706";
const BLUE = "#2563eb";
const GRAY = "#64748b";
const RED = "#dc2626";

const W = 360;
const SH = 80;
const BASE = 56;
const ONE = 26;
const sx = (x: number) => 180 + 50 * x;
const JUMPS = [-1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25];

export default function SteGateViz() {
  return (
    <SceneShell
      eyebrow="Backward의 surrogate"
      title="계단의 기울기 0 대신 range gate로 gradient를 흘립니다"
      description="위는 앞 그림과 같은 fake quantizer(파란 계단)이고, 아래는 backward가 쓰는 ∂x̂/∂x입니다. s=0.5, z=0, code −4…3은 그림을 위한 가정값입니다."
      ariaLabel="round의 참 기울기 0과 STE의 range gate를 비교하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const ste = active >= 1;
        return (
          <div className="min-w-0">
            <StaircasePlot showIdentity={false} showSteps ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {(px, py) =>
                ste ? (
                  <polyline
                    points={`${px(-3)},${py(-2)} ${px(-2)},${py(-2)} ${px(1.5)},${py(1.5)} ${px(3)},${py(1.5)}`}
                    fill="none"
                    stroke={ORANGE}
                    strokeWidth={1.25}
                    strokeDasharray="5 4"
                  />
                ) : (
                  <text x={px(0.25)} y={py(1) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>
                    칸 위 기울기 0
                  </text>
                )
              }
            </StaircasePlot>
            <svg viewBox={`0 0 ${W} ${SH}`} role="img" aria-label="backward에서 쓰는 ∂x̂/∂x" className="mx-auto mt-2 block h-auto w-full max-w-[400px]">
              <text x={4} y={14} fontSize={10} fill={GRAY}>{ste ? "STE의 ∂x̂/∂x (gate)" : "진짜 ∂x̂/∂x"}</text>
              <line x1={sx(-3)} x2={sx(3)} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <text x={sx(-3) - 4} y={BASE + 4} textAnchor="end" fontSize={10} fill={GRAY}>0</text>
              <text x={sx(-3) - 4} y={ONE + 4} textAnchor="end" fontSize={10} fill={GRAY}>1</text>
              {[-2, 1.5].map((v) => (
                <g key={v}>
                  <line x1={sx(v)} x2={sx(v)} y1={BASE - 3} y2={BASE + 3} stroke="#94a3b8" strokeWidth={1} />
                  <text x={sx(v)} y={BASE + 16} textAnchor="middle" fontSize={10} fill={GRAY}>{v}</text>
                </g>
              ))}
              {!ste && (
                <>
                  <line x1={sx(-3)} x2={sx(3)} y1={BASE} y2={BASE} stroke={BLUE} strokeWidth={1.25} />
                  {JUMPS.map((j) => (
                    <text key={j} x={sx(j)} y={BASE + 4} textAnchor="middle" fontSize={11} fill={RED}>×</text>
                  ))}
                </>
              )}
              {ste && (
                <>
                  <line x1={sx(-3)} x2={sx(-2)} y1={BASE} y2={BASE} stroke={active === 2 ? RED : ORANGE} strokeWidth={1.25} />
                  <line x1={sx(-2)} x2={sx(-2)} y1={BASE} y2={ONE} stroke={ORANGE} strokeWidth={1} strokeDasharray="2 3" />
                  <line x1={sx(-2)} x2={sx(1.5)} y1={ONE} y2={ONE} stroke={ORANGE} strokeWidth={1.25} />
                  <line x1={sx(1.5)} x2={sx(1.5)} y1={ONE} y2={BASE} stroke={ORANGE} strokeWidth={1} strokeDasharray="2 3" />
                  <line x1={sx(1.5)} x2={sx(3)} y1={BASE} y2={BASE} stroke={active === 2 ? RED : ORANGE} strokeWidth={1.25} />
                  {active === 1 && <text x={sx(-0.25)} y={ONE - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={ORANGE}>R 안: 1</text>}
                  {active === 2 && (
                    <>
                      <text x={sx(-2.5)} y={BASE - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>0</text>
                      <text x={sx(2.25)} y={BASE - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>0</text>
                    </>
                  )}
                  {active === 3 && (
                    <>
                      <circle cx={sx(0.8)} cy={ONE} r={4} fill={BLUE} />
                      <text x={sx(0.8)} y={ONE - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={BLUE}>x=0.8 → 0.5</text>
                      <circle cx={sx(2.4)} cy={BASE} r={4} fill={RED} />
                      <text x={sx(2.4)} y={BASE - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>x=2.4 → 0</text>
                    </>
                  )}
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
