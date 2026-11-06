import SceneShell from "./SceneShell";

/**
 * 본문 대응: #latent-representation 끝 — m×n 숫자를 r(m+n)개로 줄이려면 r(m+n)<mn이어야 한다.
 * 1000×1000, r=10은 축척을 맞춰 그렸습니다. 면적이 숫자의 개수입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 224;
const SIDE = 170;
const UNIT = SIDE / 1000;
const THIN = 10 * UNIT;

const SCENES = [
  { label: "그대로 적기", summary: "1000 × 1000 = 1,000,000", note: "표의 숫자를 그대로 적으면 칸 수는 가로와 세로의 곱입니다. 정사각형의 넓이가 저장할 숫자의 수입니다." },
  { label: "두 행렬로 적기", summary: "10(1000+1000) = 20,000", note: "rank≤10이면 1000×10과 10×1000의 곱으로 적을 수 있습니다. 같은 축척으로 그린 얇은 두 띠의 넓이가 2만입니다. 버린 방향의 작은 오차가 과제에도 작다는 뜻은 아닙니다." },
  { label: "표가 작으면", summary: "1(2+2) = 4 · 이득 없음", note: "2×2에서 r=1이면 두 칸과 두 칸으로 합이 4입니다. 원래도 4칸이라 r(m+n)<mn이 거짓이고 저장 이득이 없습니다." },
] as const;

export default function LowRankStorageViz() {
  return (
    <SceneShell
      eyebrow="낮은 계수 표현의 저장량"
      title="두 행렬로 나눠 적어도 넓이가 줄어야 이득입니다"
      description="넓이가 저장할 숫자의 수입니다. 처음 두 장면은 같은 축척입니다."
      note="셋째 장면은 칸을 셀 수 있게 크게 그렸습니다."
      ariaLabel="큰 표와 작은 표의 낮은 계수 저장량 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <rect x={(W - SIDE) / 2} y={18} width={SIDE} height={SIDE} fill={BLUE} fillOpacity={0.2} stroke={BLUE} strokeWidth={1} />
              <text x={W / 2} y={18 + SIDE / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={BLUE}>1,000,000개</text>
              <text x={W / 2} y={208} textAnchor="middle" fontSize={12} fill={GRAY}>가로 1000</text>
              <text x={(W - SIDE) / 2 - 8} y={18 + SIDE / 2 + 4} textAnchor="end" fontSize={12} fill={GRAY}>세로 1000</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <rect x={20} y={18} width={SIDE} height={SIDE} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <rect x={20} y={18} width={THIN} height={SIDE} fill={BLUE} />
              <rect x={20} y={18 - THIN - 3} width={SIDE} height={THIN} fill={AMBER} />
              <text x={32} y={110} fontSize={12} fontWeight={700} fill={BLUE}>1000×10</text>
              <text x={20 + SIDE} y={36} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>10×1000</text>
              <text x={20 + SIDE / 2} y={208} textAnchor="middle" fontSize={12} fill={GRAY}>점선은 원래 넓이</text>
              <text x={W - 6} y={84} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>1만 + 1만</text>
              <text x={W - 6} y={106} textAnchor="end" fontSize={15} fontWeight={700} fill={BLUE}>= 2만</text>
              <text x={W - 6} y={128} textAnchor="end" fontSize={12} fill={GRAY}>원래의 2%</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <text x={80} y={32} textAnchor="middle" fontSize={12} fill={GRAY}>2×2: 4칸</text>
              {[0, 1].map((r) => [0, 1].map((c) => (
                <rect key={`${r}-${c}`} x={38 + c * 42} y={44 + r * 42} width={40} height={40} rx={3} fill={GRAY} fillOpacity={0.14} stroke={GRAY} strokeWidth={1} />
              )))}
              <text x={246} y={32} textAnchor="middle" fontSize={12} fill={GRAY}>2×1 + 1×2: 4칸</text>
              {[0, 1].map((r) => <rect key={r} x={178} y={44 + r * 42} width={40} height={40} rx={3} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1} />)}
              {[0, 1].map((c) => <rect key={c} x={230 + c * 42} y={65} width={40} height={40} rx={3} fill={AMBER} fillOpacity={0.18} stroke={AMBER} strokeWidth={1} />)}
              <text x={W / 2} y={170} textAnchor="middle" fontSize={14} fontWeight={700} fill={RED}>{"r(m+n) = 4, mn = 4 → 4 < 4 거짓"}</text>
              <text x={W / 2} y={194} textAnchor="middle" fontSize={12} fill={GRAY}>1000×1000은 20,000 &lt; 1,000,000 참</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
