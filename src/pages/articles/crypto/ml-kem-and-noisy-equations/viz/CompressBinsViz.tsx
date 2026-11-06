import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #names — dv=4이면 0~3328을 16칸으로 나눠 보내므로 한 칸 폭 3329/16≈208, 오차 최대 약 104.
 * 1,000은 이 그림에서 고른 예입니다(가정). 1000÷208≈4.8 → 번호 5 → 5×208.06≈1,040, 오차 40.
 * du=10이면 2¹⁰=1,024칸, 폭 3329/1024≈3.25, 오차 최대 약 1.6. η=2의 계수 폭은 −2~2.
 * 마지막 장면은 계수 하나의 폭 비교입니다. η와 du의 오차는 s나 r의 계수와 곱해져 k×256=768항으로 합쳐지므로 복호에 닿는 크기가 아닙니다.
 */
const W = 360;
const H = 170;
const X0 = 14;
const LEN = 332;
const Y = 86;
const STEP = 3329 / 16;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";
const px = (value: number) => X0 + (value / 3329) * LEN;

const SCENES = [
  { label: "계수 하나", summary: "0 ~ 3328", note: "캡슐의 v에 들어가는 계수 하나는 0부터 3328 사이의 값입니다. 그대로 보내면 3329가지를 구별해야 합니다." },
  { label: "16칸", summary: "dv = 4 → 2⁴ = 16칸", note: "dv=4이면 계수당 4비트만 쓰므로 16칸으로 나눕니다. 한 칸 폭은 3329/16≈208입니다." },
  { label: "칸 번호만", summary: "1,000 → 번호 5 → 1,040", note: "예로 1,000이라면(가정) 가장 가까운 눈금인 5번을 보냅니다. 받는 쪽은 5×208≈1,040으로 되돌리므로 값이 40 어긋납니다." },
  { label: "최대 오차", summary: "208 ÷ 2 ≈ 104", note: "눈금 사이 정가운데 값이 가장 많이 어긋나므로 최대 오차는 칸 폭의 절반, 약 104입니다. 어떤 값이든 이 안에 들어옵니다." },
  { label: "계수 하나의 폭 비교", summary: "±2 · ±1.6 · ±104", note: "계수 하나만 놓으면 η=2의 폭은 −2~2, du=10(1,024칸)의 최대 오차는 약 1.6, dv=4는 약 104입니다. η와 du의 오차는 s나 r의 계수와 곱해져 768항으로 합쳐지므로 복호에 닿는 크기는 이 막대보다 큽니다." },
] as const;

function Line({ active }: { active: number }) {
  const showBins = active >= 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={X0} x2={X0 + LEN} y1={Y} y2={Y} stroke={GRAY} strokeWidth={1.25} />
      {showBins &&
        Array.from({ length: 16 }, (_, index) => (
          <g key={index}>
            <line x1={px(index * STEP)} x2={px(index * STEP)} y1={Y - 9} y2={Y + 9} stroke={index === 5 && active >= 2 ? BLUE : FAINT} strokeWidth={1} />
            {active >= 1 && index % 5 === 0 && (
              <text x={px(index * STEP)} y={Y + 24} textAnchor="middle" fontSize={12} fill={GRAY}>{index}번</text>
            )}
          </g>
        ))}
      <text x={X0} y={Y + 46} fontSize={12} fill={GRAY}>0</text>
      <text x={X0 + LEN} y={Y + 46} textAnchor="end" fontSize={12} fill={GRAY}>3328</text>
      {active === 1 && (
        <g>
          <line x1={px(2 * STEP)} x2={px(3 * STEP)} y1={Y - 18} y2={Y - 18} stroke={AMBER} strokeWidth={1.25} />
          <text x={px(2.5 * STEP)} y={Y - 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>한 칸 ≈ 208</text>
        </g>
      )}
      {active === 2 && (
        <g>
          <circle cx={px(1000)} cy={Y} r={5} fill={RED} />
          <text x={px(1000) - 6} y={Y - 34} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>실제 1,000</text>
          <Arrow x1={px(1000) + 2} y1={Y - 8} x2={px(1040)} y2={Y - 26} color={BLUE} />
          <text x={px(1040) + 4} y={Y - 30} fontSize={13} fontWeight={700} fill={BLUE}>되돌린 값 ≈ 1,040 (5번)</text>
        </g>
      )}
      {active === 3 && (
        <g>
          <rect x={px(4.5 * STEP)} y={Y - 14} width={px(5.5 * STEP) - px(4.5 * STEP)} height={26} fill={`${BLUE}26`} stroke={BLUE} strokeWidth={1} />
          <text x={px(5 * STEP)} y={Y - 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>5번으로 가는 범위 · 눈금에서 ±104</text>
        </g>
      )}
    </svg>
  );
}

function SpreadRow({ label, value, spread, color }: { label: string; value: string; spread: number; color: string }) {
  const half = (spread / 104) * 50;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="relative h-6 min-w-0 rounded-sm bg-muted/40">
        <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <span className="absolute inset-y-0 rounded-sm" style={{ left: `${50 - half}%`, width: `max(2px, ${half * 2}%)`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-semibold">{value}</span>
    </div>
  );
}

function Spread() {
  return (
    <div className="mx-auto max-w-[520px] space-y-3 pt-6">
      <SpreadRow label="η=2 계수" value="±2" spread={2} color={GRAY} />
      <SpreadRow label="du=10 오차" value="≈±1.6" spread={1.6} color={BLUE} />
      <SpreadRow label="dv=4 오차" value="≈±104" spread={104} color={RED} />
      <p className="text-center text-xs text-muted-foreground">계수 하나의 폭을 같은 눈금에 놓았습니다</p>
    </div>
  );
}

export default function CompressBinsViz() {
  return (
    <SceneShell
      eyebrow="계수당 비트 줄이기"
      title="16칸으로 줄이면 값이 눈금으로 끌려가며 오차가 생깁니다"
      description="가로줄이 계수 값의 범위 0~3328입니다. 숫자는 FIPS 203의 ML-KEM-768 설정 du=10, dv=4에서 계산했습니다."
      ariaLabel="계수 범위를 16칸으로 나눠 칸 번호만 보내고 최대 오차 약 104가 생기는 과정과 η, du 폭과의 비교"
      scenes={SCENES}
      render={(active) => (active === 4 ? <Spread /> : <Line active={active} />)}
    />
  );
}
