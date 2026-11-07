import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ae-vs-vae — AE는 입력마다 점 하나, VAE는 입력마다 축에 나란한 분포 하나.
 * 평면의 위치와 크기는 모양을 보이기 위한 가정이며 학습 결과가 아닙니다.
 */
const SCENES = [
  { label: "AE: 입력마다 점 하나", summary: "z = f(x)", note: "같은 입력은 항상 같은 점으로 갑니다. 그 점에서 입력을 다시 만들 때의 오차를 줄입니다." },
  { label: "AE: 점 사이의 빈 자리", summary: "decoder 출력이 정해지지 않음", note: "학습 점 사이에서 decoder가 무엇을 낼지 정해지지 않습니다. prior(미리 정한 z의 분포)에서 뽑아 생성하는 모델이 자동으로 되지는 않습니다." },
  { label: "VAE: 입력마다 분포 하나", summary: "qφ(z|x)의 μ와 σ²", note: "encoder는 점 대신 중심 μ와 축별 분산 σ²를 냅니다. 축 사이 covariance를 0으로 둔 기본 VAE라 타원이 축에 나란합니다." },
  { label: "VAE: prior와 비교", summary: "멀어질수록 KL 비용", note: "KL은 두 분포의 차이를 재는 값입니다. 분포가 prior에서 지나치게 멀어지지 않게 해 prior sample을 decoder에 넣을 수 있는 조건을 만듭니다." },
  { label: "그래도 보장은 아닙니다", summary: "빈틈·해석 가능성 보장 없음", note: "구멍 없이 완전히 채워지거나 각 축이 사람에게 해석 가능한 요인으로 나뉜다고 보장하지는 않습니다." },
] as const;

const W = 360;
const H = 194;
const CX = 180;
const CY = 98;

const INPUTS = [
  { name: "x₁", near: [96, 50], close: [146, 74], rx: 34, ry: 20 },
  { name: "x₂", near: [276, 66], close: [216, 86], rx: 24, ry: 34 },
  { name: "x₃", near: [140, 164], close: [168, 134], rx: 38, ry: 18 },
] as const;

const INK = "#475569";
const ACCENT = "#2563eb";
const WARN = "#d97706";

function Probe({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={12} height={12} transform={`rotate(45 ${x} ${y})`} fill="none" stroke={WARN} strokeWidth={1.25} />
      <text x={x + 13} y={y + 4} fontSize={13} fontWeight={700} fill={WARN}>?</text>
    </g>
  );
}

export default function LatentContractViz() {
  return (
    <SceneShell
      eyebrow="latent space"
      title="한 점을 정하는 일과 분포를 정하는 일은 빈 자리에서 갈립니다"
      description="평면은 입력을 압축한 좌표 z의 공간(latent space)이고 두 축만 그렸습니다. 위치와 크기는 학습 결과가 아니라 모양을 보이는 그림입니다(가정)."
      ariaLabel="autoencoder의 점과 VAE의 분포를 latent 평면에서 비교하는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const isVae = active >= 2;
        const pulled = active >= 3;
        const showPrior = active === 1 || active >= 3;
        const probe = active === 1 ? { x: 214, y: 128 } : active === 4 ? { x: 124, y: 114 } : null;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={14} x2={W - 14} y1={CY} y2={CY} stroke="#94a3b8" strokeWidth={1} />
              <line x1={CX} x2={CX} y1={10} y2={H - 10} stroke="#94a3b8" strokeWidth={1} />
              <text x={W - 16} y={CY - 6} textAnchor="end" fontSize={12} fill="#64748b">z₁</text>
              <text x={CX + 7} y={22} fontSize={12} fill="#64748b">z₂</text>
              {showPrior && (
                <>
                  <circle cx={CX} cy={CY} r={70} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" />
                  <text x={CX + 54} y={CY + 68} fontSize={12} fill="#64748b">prior</text>
                </>
              )}
              {INPUTS.map((input) => {
                const [x, y] = pulled ? input.close : input.near;
                return (
                  <g key={input.name}>
                    {isVae && <ellipse cx={x} cy={y} rx={input.rx} ry={input.ry} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1} />}
                    {active === 3 && (
                      <line x1={input.near[0]} y1={input.near[1]} x2={x} y2={y} stroke={INK} strokeWidth={1} strokeDasharray="2 3" />
                    )}
                    <circle cx={x} cy={y} r={isVae ? 3 : 5} fill={isVae ? ACCENT : INK} />
                    <text x={x + 8} y={y - 7} fontSize={13} fontWeight={700} fill={isVae ? ACCENT : INK}>{input.name}</text>
                  </g>
                );
              })}
              {probe && <Probe x={probe.x} y={probe.y} />}
            </svg>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
              <li><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#475569] align-middle" />회색 점 = AE code</li>
              <li><span className="mr-1 inline-block h-2.5 w-4 rounded-full border border-[#2563eb] align-middle" />타원·파란 점 = VAE 분포·μ</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rotate-45 border border-[#d97706] align-middle" />? = prior에서 뽑은 z</li>
            </ul>
          </div>
        );
      }}
    />
  );
}
