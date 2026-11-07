import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap — 이동 50.1 또는 10.0 µs, 계산 139.0 µs. 두 항만 놓은 상한 비교.
 * 합: 189.1 / 149.0 (149.0 = 10.0 + 139.0). 완전 겹침: max = 139.0.
 */
const COMPUTE = 139.0;
const SCENES = [
  { label: "160 MiB · 순서대로", summary: "50.1 + 139.0 = 189.1 µs", note: "세 kernel의 출력 traffic 약 50.1 µs와 GEMM 계산 약 139.0 µs를 이어 놓았습니다. 합만 보는 그림이라 앞뒤 순서는 뜻이 없습니다. 두 항만 놓은 상한 계산이고 측정이 아닙니다.", move: 50.1, overlap: false },
  { label: "160 MiB · 완전 겹침", summary: "max(50.1, 139.0) = 139.0 µs", note: "두 줄이 같은 시각에 시작하면 짧은 쪽은 긴 쪽 안에 숨습니다. 끝나는 시각은 긴 줄이 정합니다.", move: 50.1, overlap: true },
  { label: "32 MiB · 순서대로", summary: "10.0 + 139.0 = 149.0 µs", note: "Fusion으로 traffic이 약 10.0 µs로 줄었습니다. 겹치지 않을 때는 이 절감이 합에 그대로 드러납니다.", move: 10.0, overlap: false },
  { label: "32 MiB · 완전 겹침", summary: "max(10.0, 139.0) = 139.0 µs", note: "이동을 더 줄여도 끝나는 시각은 그대로입니다. 완전 overlap 상한은 여전히 계산 항이 지배하므로, 이 경우 시간을 더 줄일 손잡이는 max 안의 큰 항입니다.", move: 10.0, overlap: true },
] as const;

const X0 = 40;
const PX = (336 - X0) / 200;

export default function KernelSumMaxViz() {
  return (
    <SceneShell
      eyebrow="Kernel 전체의 합과 max"
      title="이동을 줄여도 다 겹친 뒤에는 계산 항이 시간을 정합니다"
      description="앞 절의 GEMM + bias + GELU를 두 줄로 놓았습니다. 윗줄이 HBM 이동, 아랫줄이 GEMM 계산이고 세로선이 끝나는 시각입니다. GELU 계산·launch·cache와 첫 tile의 fill 시간은 넣지 않았습니다."
      ariaLabel="출력 traffic과 계산을 순서대로 할 때와 완전히 겹칠 때의 kernel 시간"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const computeStart = scene.overlap ? 0 : scene.move;
        const end = scene.overlap ? Math.max(scene.move, COMPUTE) : scene.move + COMPUTE;
        return (
          <svg viewBox="0 0 340 118" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 - 6} y={31} textAnchor="end" fontSize={11} fill="#64748b">이동</text>
            <text x={X0 - 6} y={61} textAnchor="end" fontSize={11} fill="#64748b">계산</text>
            <rect x={X0} y={16} width={scene.move * PX} height={22} rx={2} fill="#d97706" fillOpacity={0.3} stroke="#d97706" strokeWidth={1} strokeDasharray="4 2" />
            <text x={X0 + scene.move * PX + 5} y={31} fontSize={11} fontWeight={700} fill="currentColor">{scene.move.toFixed(1)}</text>
            <rect x={X0 + computeStart * PX} y={46} width={COMPUTE * PX} height={22} rx={2} fill="#2563eb" fillOpacity={0.9} />
            <text x={X0 + (computeStart + COMPUTE / 2) * PX} y={61} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">139.0</text>
            <line x1={X0 + end * PX} x2={X0 + end * PX} y1={8} y2={78} stroke="#dc2626" strokeWidth={1.25} />
            <line x1={X0} x2={X0 + 200 * PX} y1={78} y2={78} stroke="#94a3b8" strokeWidth={1} />
            {[0, 50, 100, 150, 200].map((tick) => (
              <g key={tick}>
                <line x1={X0 + tick * PX} x2={X0 + tick * PX} y1={78} y2={82} stroke="#94a3b8" strokeWidth={1} />
                <text x={X0 + tick * PX} y={95} textAnchor={tick === 200 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={X0} y={113} fontSize={11} fill="#64748b">µs</text>
            <text x={336} y={113} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">{`끝 ${end.toFixed(1)} µs`}</text>
          </svg>
        );
      }}
    />
  );
}
