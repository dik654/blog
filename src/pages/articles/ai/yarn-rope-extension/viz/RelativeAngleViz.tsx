import SceneShell from "./SceneShell";
import { polar, sectorPath } from "./dialGeometry";

/**
 * 본문 대응: #rope-foundation — (R_m q)ᵀ(R_n k) = qᵀ R_{n−m} k.
 * 한 좌표 쌍의 회전 속도를 θ=20°로 놓은 가정 사례. 각도 = 위치 × 20°.
 * (2,5) → 40°, 100°, 차이 60° / (6,9) → 120°, 180°, 차이 60° / (2,8) → 40°, 160°, 차이 120°.
 */
const THETA = 20;
const TOKENS = 12;

const SCENES = [
  { label: "회전 전", summary: "q와 k 모두 0°에서 출발", m: 0, n: 0, note: "위치를 넣기 전의 두 벡터입니다. 그림을 단순하게 하려고 같은 방향에서 출발시켰고, 실제 q와 k의 방향에는 token의 내용이 담겨 있습니다." },
  { label: "위치 2와 위치 5", summary: "40°, 100° → 차이 60°", m: 2, n: 5, note: "q는 2×20°=40°, k는 5×20°=100° 돕니다. 각 벡터는 자기 절대 위치만큼 돌지만, 둘 사이에 벌어진 각도는 (5−2)×20°=60°입니다." },
  { label: "둘 다 4칸 뒤로 옮기면", summary: "120°, 180° → 차이 60°", m: 6, n: 9, note: "절대 위치가 바뀌어 두 바늘은 모두 다른 곳을 가리킵니다. 그래도 거리가 3으로 같으니 벌어진 각도는 여전히 60°입니다. 내적에 남는 위치 정보가 이 차이입니다." },
  { label: "거리만 6으로 늘리면", summary: "40°, 160° → 차이 120°", m: 2, n: 8, note: "q를 처음 위치 2로 되돌리고 k만 위치 8로 더 멀리 보내면 벌어진 각도가 (8−2)×20°=120°로 바뀝니다. attention score에 상대 거리가 남는다는 말이 이 그림입니다." },
] as const;

const W = 360;
const H = 262;
const CX = 180;
const CY = 158;
const R = 66;
const tokenX = (index: number) => 22 + (index * (W - 44)) / (TOKENS - 1);

export default function RelativeAngleViz() {
  return (
    <SceneShell
      eyebrow="절대 위치에서 상대 거리로"
      title="두 바늘을 함께 옮겨도 벌어진 각도는 그대로입니다"
      description="query(q)와 key(k)는 attention score를 계산하는 두 벡터이고, 그림의 바늘은 그중 한 좌표 쌍입니다. 위 눈금은 token 위치(q는 m, k는 n)이며, 한 칸에 20°씩 돈다고 놓았습니다(가정)."
      ariaLabel="위치 m의 query와 위치 n의 key가 회전한 각도와 그 차이"
      scenes={SCENES}
      render={(active) => {
        const { m, n } = SCENES[active];
        const q = m * THETA;
        const k = n * THETA;
        const rotated = n > m;
        const qTip = polar(CX, CY, R, q);
        const kTip = polar(CX, CY, R, k);
        const qText = polar(CX, CY, R + 14, q);
        const kText = polar(CX, CY, R + 14, k);
        const middle = polar(CX, CY, R * 0.56, (q + k) / 2);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: TOKENS }, (_, index) => (
              <g key={index}>
                <rect x={tokenX(index) - 10} y={22} width={20} height={20} rx={3} fill={rotated && index === m ? "#2563eb" : rotated && index === n ? "#d97706" : "none"} stroke="#94a3b8" strokeWidth={1} />
                <text x={tokenX(index)} y={36} textAnchor="middle" fontSize={11} fill={rotated && (index === m || index === n) ? "#ffffff" : "#64748b"}>{index}</text>
              </g>
            ))}
            {rotated && (
              <g>
                <text x={tokenX(m)} y={15} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">m</text>
                <text x={tokenX(n)} y={15} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">n</text>
                <line x1={tokenX(m)} x2={tokenX(n)} y1={50} y2={50} stroke="#64748b" strokeWidth={1} />
                <text x={(tokenX(m) + tokenX(n)) / 2} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">거리 n−m = {n - m}</text>
              </g>
            )}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <line x1={CX - R} x2={CX + R} y1={CY} y2={CY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
            {rotated && <path d={sectorPath(CX, CY, R, q, k)} fill="#2563eb" opacity={0.14} />}
            <line x1={CX} y1={CY} x2={kTip.x} y2={kTip.y} stroke="#d97706" strokeWidth={1.25} />
            <line x1={CX} y1={CY} x2={qTip.x} y2={qTip.y} stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={CX} cy={CY} r={2.5} fill="#64748b" />
            {rotated ? (
              <>
                <text x={qText.x} y={qText.y + 4} textAnchor={q > 90 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#2563eb">q {q}°</text>
                <text x={kText.x} y={kText.y + 4} textAnchor={k > 90 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#d97706">k {k}°</text>
                <text x={middle.x} y={middle.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{k - q}°</text>
              </>
            ) : (
              <text x={CX + R + 8} y={CY + 4} fontSize={12} fontWeight={700} fill="#64748b">q, k 0°</text>
            )}
          </svg>
        );
      }}
    />
  );
}
