import SceneShell from "./SceneShell";

/**
 * 본문 대응: #merging — τ_domain=(0.6,−0.2), τ_style=(−0.1,0.5), λ=1이면 θ_new=(0.5,0.3).
 * λ=0.5는 (0.25,0.15)이고 두 fine-tuned 좌표의 평균과 같은 점이다.
 * 상충 방향 (−0.6,0.2)은 간섭 한계를 보이려는 극단적 가정이다.
 */
const SCALE = 200;
const OX = 170;
const OY = 146;
const sx = (x: number) => OX + x * SCALE;
const sy = (y: number) => OY - y * SCALE;

const DOMAIN = [0.6, -0.2] as const;
const STYLE = [-0.1, 0.5] as const;
const SUM = [DOMAIN[0] + STYLE[0], DOMAIN[1] + STYLE[1]] as const;
const HALF = [SUM[0] / 2, SUM[1] / 2] as const;
const OPPOSE = [-0.6, 0.2] as const;

const BLUE = "#2563eb";
const SLATE = "#64748b";
const AMBER = "#d97706";

function Arrow({ from, to, color, dashed }: { from: readonly [number, number]; to: readonly [number, number]; color: string; dashed?: boolean }) {
  const x1 = sx(from[0]);
  const y1 = sy(from[1]);
  const x2 = sx(to[0]);
  const y2 = sy(to[1]);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 7;
  const left = `${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)}`;
  const right = `${x2 - head * Math.cos(angle + 0.45)},${y2 - head * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />
    </g>
  );
}

const SCENES = [
  { label: "두 이동", summary: "τ = fine-tuned − base", note: "각 fine-tuned checkpoint에서 base를 뺀 이동이 task vector τ입니다. 같은 원점에서 domain과 style이 서로 다른 쪽으로 갑니다." },
  { label: "이어 붙이면 합", summary: "λ=1 → θ_new (0.5, 0.3)", note: "style 화살표를 domain 끝에 옮겨 붙이면 좌표별 합과 같은 점에 닿습니다. (0.6−0.1, −0.2+0.5)=(0.5, 0.3)입니다. 좌표 계산일 뿐, 두 능력이 보존되는지는 task별 held-out에서 따로 잽니다." },
  { label: "λ는 길이를 정합니다", summary: "λ=0.5 → (0.25, 0.15)", note: "λ는 합친 delta 전체에 곱하므로 같은 직선 위에서 길이만 바꿉니다. 이 두 점의 경우 좌표 평균 (0.25, 0.15)은 λ=0.5와 같은 점입니다." },
  { label: "방향이 상충하면", summary: "합 = (0, 0) (가정)", note: "domain과 정반대인 (−0.6, +0.2)를 더한 극단적 가정입니다. 좌표가 base로 돌아와 domain 이동이 사라집니다. 상충하는 task의 합이 한쪽 성능을 깎을 수 있다는 한계를 좌표로 보인 것이며 실제 성능은 측정해야 합니다." },
] as const;

export default function TaskVectorPlaneViz() {
  return (
    <SceneShell
      eyebrow="2차원 toy 평면"
      title="task vector를 평면에 놓으면 합과 λ가 위치로 보입니다"
      description="본문의 2차원 toy 예입니다. 가운데 점이 base θ_pre=(0, 0)이고, 화살표 하나가 fine-tuning 하나의 이동입니다."
      note="실제 모델은 수십억 차원이며, 위치만으로 성능을 판정할 수 없습니다."
      ariaLabel="2차원 평면에서 task vector 합과 스케일"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={10} x2={350} y1={OY} y2={OY} stroke="#94a3b8" strokeWidth={1} opacity={0.6} />
          <line x1={OX} x2={OX} y1={6} y2={200} stroke="#94a3b8" strokeWidth={1} opacity={0.6} />
          <Arrow from={[0, 0]} to={DOMAIN} color={BLUE} />
          <text x={sx(DOMAIN[0]) + 4} y={sy(DOMAIN[1]) + 16} fontSize={11} fontWeight={700} textAnchor="end" fill={BLUE}>τ_domain (0.6, −0.2)</text>
          {active !== 3 && (
            <>
              <Arrow from={[0, 0]} to={STYLE} color={SLATE} />
              <text x={sx(STYLE[0]) - 4} y={sy(STYLE[1]) + 4} fontSize={11} fontWeight={700} textAnchor="end" fill={SLATE}>τ_style (−0.1, 0.5)</text>
            </>
          )}
          {(active === 1 || active === 2) && (
            <>
              {active === 1 && <Arrow from={DOMAIN} to={SUM} color={SLATE} dashed />}
              <Arrow from={[0, 0]} to={SUM} color={AMBER} />
              <text x={sx(SUM[0]) + 6} y={sy(SUM[1]) - 6} fontSize={11} fontWeight={700} textAnchor="middle" fill={AMBER}>λ=1 (0.5, 0.3)</text>
            </>
          )}
          {active === 2 && (
            <>
              <circle cx={sx(HALF[0])} cy={sy(HALF[1])} r={4.5} fill={AMBER} />
              <text x={sx(HALF[0]) + 8} y={sy(HALF[1]) + 14} fontSize={11} fontWeight={700} fill={AMBER}>λ=0.5 (0.25, 0.15)</text>
            </>
          )}
          {active === 3 && (
            <>
              <Arrow from={[0, 0]} to={OPPOSE} color={AMBER} dashed />
              <text x={sx(OPPOSE[0]) + 2} y={sy(OPPOSE[1]) - 8} fontSize={11} fontWeight={700} fill={AMBER}>상충 방향 (−0.6, +0.2)</text>
              <circle cx={OX} cy={OY} r={6} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <text x={OX + 10} y={OY - 8} fontSize={11} fontWeight={700} fill={AMBER}>합 (0, 0)</text>
            </>
          )}
          <circle cx={OX} cy={OY} r={3} fill="#475569" />
          {active !== 3 && <text x={OX - 6} y={OY + 15} fontSize={11} textAnchor="end" fill="#475569">θ_pre (0, 0)</text>}
        </svg>
      )}
    />
  );
}
