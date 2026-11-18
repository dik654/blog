import SceneShell from "./SceneShell";

/**
 * 본문 대응: #theorem — 큰 singular value 방향부터 k개 남기면 버리는 energy가 최소.
 * 중심화한 두 점 A′=(0.1,−0.1), B′=(−0.1,0.1)을 각도 θ의 직선에 투영한다.
 * 한 점의 버린 거리² = |p|² − (p·u)², 두 점 합 = 0.02 + 0.02·sin2θ.
 * θ=0°: 0.02, θ=45°: 0.04, θ=−45°: 0.
 * X′=[[0.1,−0.1],[−0.1,0.1]]의 singular value: σ₁=0.2(v₁ ∝ (1,−1)), σ₂=0. 전체 energy σ₁²+σ₂² = 0.04.
 */
const POINTS = [
  { name: "A′", x: 0.1, y: -0.1 },
  { name: "B′", x: -0.1, y: 0.1 },
] as const;

const errorAt = (deg: number) => 0.02 + 0.02 * Math.sin((2 * deg * Math.PI) / 180);

const SCENES = [
  {
    label: "x₁축 방향을 남기면",
    summary: "버린 거리² 합 = 0.01 + 0.01 = 0.02",
    note: "직선 하나에 점을 내려 그 위치만 기억하는 것이 rank-1 복원입니다. x₁축(θ=0°)을 고르면 A′는 (0.1, 0)으로 복원되고 세로로 0.1만큼 어긋납니다. 두 점의 어긋난 거리 제곱을 더하면 0.02입니다.",
    deg: 0,
  },
  {
    label: "x₂=x₁ 방향을 남기면",
    summary: "버린 거리² 합 = 0.02 + 0.02 = 0.04",
    note: "θ=45° 직선은 두 점과 직각으로 만납니다. 두 점 모두 원점으로 복원되어 원래 크기를 전부 잃습니다. 곡선의 가장 높은 지점입니다.",
    deg: 45,
  },
  {
    label: "x₂=−x₁ 방향을 남기면",
    summary: "버린 거리² 합 = 0",
    note: "θ=−45° 직선은 두 점을 그대로 지나므로 버리는 거리가 없습니다. 각도를 −90°에서 90°까지 모두 돌려 봐도 이 직선의 오차가 가장 작습니다.",
    deg: -45,
  },
  {
    label: "SVD가 같은 직선을 고릅니다",
    summary: "σ₁² = 0.04 보존 · σ₂² = 0 버림",
    note: "SVD는 행렬을 서로 직각인 방향들과 각 방향에 실린 크기(singular value)로 나누는 분해입니다. 두 점의 행렬을 나누면 σ₁=0.2, σ₂=0이고 σ₁의 방향 v₁이 x₂=−x₁입니다. 모든 좌표 제곱의 합(energy) 0.04 = σ₁²+σ₂²가 모두 v₁ 쪽에 실려 있어 v₁만 남기면 버리는 energy는 σ₂²=0입니다. 각도를 돌려 찾은 최저점과 같은 직선입니다.",
    deg: -45,
  },
] as const;

const PS = 600; // 좌표 0.1 → 60px
const PC = 100;
const toX = (x: number) => PC + x * PS;
const toY = (y: number) => PC - y * PS;

const CW = 220;
const CH = 200;
const CL = 34;
const CR = 210;
const CT = 26;
const CB = 160;
const cx = (deg: number) => CL + ((deg + 90) / 180) * (CR - CL);
const cy = (err: number) => CB - (err / 0.04) * (CB - CT);
const CURVE = Array.from({ length: 61 }, (_, i) => -90 + i * 3)
  .map((deg, i) => `${i === 0 ? "M" : "L"}${cx(deg).toFixed(1)} ${cy(errorAt(deg)).toFixed(1)}`)
  .join(" ");

const LINE = "#2563eb";
const RESID = "#dc2626";
const MUTED = "#64748b";
const AXIS = "#94a3b8";

export default function LineAngleErrorViz() {
  return (
    <SceneShell
      eyebrow="직선 고르기"
      title="직선 방향을 돌리면 버리는 거리가 달라집니다"
      description="첫 그림의 중심화한 두 점 A′=(0.1, −0.1), B′=(−0.1, 0.1)을 원점을 지나는 직선 하나로 되살립니다. 빈 원은 직선 위로 내린 복원 위치, 빨간 점선은 그때 버려지는 거리이고, 곡선은 직선 각도 θ마다 두 점의 버린 거리 제곱을 더한 값입니다."
      ariaLabel="직선 각도에 따른 두 점의 복원 오차와 SVD가 고르는 방향"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const rad = (s.deg * Math.PI) / 180;
        const ux = Math.cos(rad);
        const uy = Math.sin(rad);
        const svd = active === 3;
        const err = errorAt(s.deg);
        return (
          <div className="grid min-w-0 items-start gap-4 sm:grid-cols-2">
            <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[210px] text-foreground sm:max-w-[280px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              <line x1={10} x2={190} y1={PC} y2={PC} stroke={AXIS} strokeWidth={1} />
              <line x1={PC} x2={PC} y1={10} y2={190} stroke={AXIS} strokeWidth={1} />
              <text x={186} y={PC + 14} fontSize={11} textAnchor="end" fill={MUTED}>x₁</text>
              <text x={PC + 5} y={18} fontSize={11} fill={MUTED}>x₂</text>
              <line x1={toX(-0.15 * ux)} y1={toY(-0.15 * uy)} x2={toX(0.15 * ux)} y2={toY(0.15 * uy)} stroke={LINE} strokeWidth={1.25} />
              <text x={toX(0.15 * ux) + (ux >= 0 ? -4 : 4)} y={toY(0.15 * uy) + (uy >= 0 ? -6 : 14)} fontSize={11} fontWeight={700} textAnchor={ux >= 0 ? "end" : "start"} fill={LINE}>
                {svd ? "v₁" : `θ=${s.deg}°`}
              </text>
              {POINTS.map((p) => {
                const dot = p.x * ux + p.y * uy;
                const px = dot * ux;
                const py = dot * uy;
                const moved = Math.hypot(p.x - px, p.y - py) > 1e-9;
                const labelRight = p.x > 0;
                return (
                  <g key={p.name}>
                    {moved && <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(px)} y2={toY(py)} stroke={RESID} strokeWidth={1.25} strokeDasharray="3 3" />}
                    {moved && <circle cx={toX(px)} cy={toY(py)} r={3.5} fill="none" stroke={LINE} strokeWidth={1.25} />}
                    <circle cx={toX(p.x)} cy={toY(p.y)} r={4.5} fill="currentColor" />
                    <text x={toX(p.x) + (labelRight ? 8 : -8)} y={toY(p.y) + (labelRight ? 14 : -8)} fontSize={12} fontWeight={700} textAnchor={labelRight ? "start" : "end"} fill="currentColor">{p.name}</text>
                  </g>
                );
              })}
            </svg>
            <svg viewBox={`0 0 ${CW} ${CH}`} className="mx-auto h-auto w-full max-w-[250px] text-foreground sm:max-w-[300px]" role="img" aria-label={svd ? "singular value 제곱 비교" : `θ=${s.deg}°에서 버린 거리 제곱 합 ${err.toFixed(2)}`}>
              {svd ? (
                <>
                  <text x={10} y={18} fontSize={11} fontWeight={700} fill="currentColor">전체 크기 0.04를 두 방향으로 나누면</text>
                  {[
                    { name: "σ₁² (v₁, 보존)", value: 0.04, color: LINE, y: 52 },
                    { name: "σ₂² (버림)", value: 0, color: RESID, y: 112 },
                  ].map((bar) => (
                    <g key={bar.name}>
                      <text x={10} y={bar.y - 8} fontSize={11} fill="currentColor">{bar.name}</text>
                      <rect x={10} y={bar.y} width={200} height={16} rx={2} fill={AXIS} fillOpacity={0.25} />
                      <rect x={10} y={bar.y} width={(bar.value / 0.04) * 200} height={16} rx={2} fill={bar.color} />
                      <text x={210} y={bar.y + 32} fontSize={11} fontWeight={700} textAnchor="end" fill={bar.color}>{bar.value.toFixed(2)}</text>
                    </g>
                  ))}
                  <text x={10} y={182} fontSize={10} fill={MUTED}>σ₁ = 0.2, σ₂ = 0 · v₁ 방향 = x₂=−x₁</text>
                </>
              ) : (
                <>
                  <text x={CL} y={14} fontSize={11} fontWeight={700} fill="currentColor">버린 거리² 합</text>
                  <line x1={CL} x2={CR} y1={CB} y2={CB} stroke={AXIS} strokeWidth={1} />
                  <line x1={CL} x2={CL} y1={CT} y2={CB} stroke={AXIS} strokeWidth={1} />
                  {[0, 0.02, 0.04].map((v) => (
                    <text key={v} x={CL - 4} y={cy(v) + 4} fontSize={10} textAnchor="end" fill={MUTED}>{v === 0 ? "0" : v.toFixed(2)}</text>
                  ))}
                  {[-90, -45, 0, 45, 90].map((d) => (
                    <text key={d} x={cx(d)} y={CB + 14} fontSize={10} textAnchor="middle" fill={MUTED}>{d}°</text>
                  ))}
                  <text x={(CL + CR) / 2} y={CB + 30} fontSize={10} textAnchor="middle" fill={MUTED}>직선 각도 θ</text>
                  <path d={CURVE} fill="none" stroke={MUTED} strokeWidth={1.25} />
                  <line x1={cx(s.deg)} x2={cx(s.deg)} y1={CT} y2={CB} stroke={LINE} strokeWidth={1} strokeDasharray="2 3" />
                  <circle cx={cx(s.deg)} cy={cy(err)} r={5} fill={LINE} />
                  <text x={cx(s.deg) + (s.deg > 30 ? -8 : 8)} y={Math.max(cy(err) - 8, CT + 10)} fontSize={11} fontWeight={700} textAnchor={s.deg > 30 ? "end" : "start"} fill={LINE}>
                    {err < 1e-9 ? "0" : err.toFixed(2)}
                  </text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
