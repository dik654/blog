import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — SIGReg는 표현 분포가 등방 Gaussian과 맞도록 제약한다.
 * 모두 0이면 조건을 충족하지 않고, 단순히 분산만 크게 만드는 것과도 같지 않다.
 * 점은 고정된 수열로 만든 그림용 2차원 표본(가정)이며 실제 192차원 표현이 아니다.
 */
const N = 120;
const CX = 180;
const CY = 88;
const GOLDEN = 2.399963;
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";

const RADII = Array.from({ length: N }, (_, i) => Math.sqrt(-2 * Math.log((i + 0.5) / N)));
const ROUND = RADII.map((r, i) => ({ x: r * Math.cos(i * GOLDEN), y: r * Math.sin(i * GOLDEN) }));

const SCENES = [
  { label: "모두 0", summary: "점 전부가 한 자리", note: "표현이 모두 0이면 관측별 변화가 없으므로 이 분포 조건을 충족하지 않습니다. 표본 120개가 한 점에 겹쳐 있습니다." },
  { label: "분산만 크게", summary: "한쪽으로 길게 퍼짐", note: "단순히 분산만 크게 만드는 것과 같지 않습니다. 이 점들은 넓게 퍼졌지만 방향마다 퍼진 정도가 달라서 등방이 아닙니다." },
  { label: "등방 Gaussian", summary: "어느 방향으로나 같게", note: "LeWM은 latent prediction loss에 SIGReg를 더해 표현 분포가 이 모양과 맞도록 제약합니다. 실제 regularizer는 finite batch·projection으로 계산하므로 그 가정을 확인해야 합니다." },
] as const;

export default function LatentSpreadViz() {
  return (
    <SceneShell
      eyebrow="표현 분포의 모양"
      title="붕괴를 막는 제약은 '넓게'가 아니라 '이 모양으로'입니다"
      description="등방 Gaussian은 가운데가 가장 빽빽하고 어느 방향으로 봐도 같은 비율로 옅어지는 분포입니다. 점 하나가 관측 하나의 표현입니다."
      note="점은 모양을 보이려고 만든 2차원 가정입니다. 실제 표현은 192차원이고 학습 결과를 그린 것이 아닙니다."
      ariaLabel="표현이 한 점에 모인 경우, 한 방향으로만 퍼진 경우, 등방 Gaussian인 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const color = active === 0 ? RED : active === 1 ? AMBER : BLUE;
        const points = ROUND.map((p) =>
          active === 0 ? { x: 0, y: 0 } : active === 1 ? { x: p.x * 44, y: p.x * 16 + p.y * 3 } : { x: p.x * 24, y: p.y * 24 },
        );
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={24} x2={336} y1={CY} y2={CY} stroke={LINE} strokeWidth={1} />
            <line x1={CX} x2={CX} y1={6} y2={170} stroke={LINE} strokeWidth={1} />
            <text x={336} y={CY - 6} textAnchor="end" fontSize={12} fill={INK}>표현 좌표 1</text>
            <text x={CX + 6} y={16} fontSize={12} fill={INK}>표현 좌표 2</text>
            {points.map((p, i) => (
              <circle key={i} cx={CX + p.x} cy={CY - p.y} r={active === 0 ? 4 : 2.2} fill={color} opacity={active === 0 ? 1 : 0.65} />
            ))}
            {active === 0 && <text x={CX + 10} y={CY + 18} fontSize={12} fontWeight={700} fill={RED}>120개가 전부 0</text>}
          </svg>
        );
      }}
    />
  );
}
