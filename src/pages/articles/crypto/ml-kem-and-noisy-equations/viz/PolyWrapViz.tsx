import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #names — 다항식의 계수 개수 256(차수 255 이하), x의 256제곱+1로 다항식을 줄인다.
 * x²⁵⁶+1을 0으로 두면 x²⁵⁶=−1. 255+255=510이 곱의 최대 차수. x⁵¹⁰=x²⁵⁶·x²⁵⁴=−x²⁵⁴.
 * 위 띠의 자리 256+i는 바로 아래 자리 i로 부호를 바꿔 내려옵니다. −1은 3329로 나눈 나머지로 3328입니다.
 */
const W = 360;
const H = 232;
const X0 = 22;
const LEN = 316;
const BAND = 26;
const Y_UP = 58;
const Y_LOW = 150;
const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";
const px = (position: number) => X0 + (position / 255) * LEN;

const SCENES = [
  { label: "자리 256개", summary: "차수 0~255", note: "다항식 하나는 차수 0부터 255까지 자리에 계수를 하나씩 둡니다. 띠 한 줄이 그 256자리입니다." },
  { label: "곱하면 넘침", summary: "255 + 255 = 510", note: "차수 255끼리 곱하면 차수가 더해져 510까지 올라갑니다. 256자리 밖으로 넘친 항이 생깁니다." },
  { label: "x²⁵⁶ = −1", summary: "넘친 첫 자리 → 자리 0", note: "x의 256제곱+1로 줄인다는 것은 그 식을 0으로 본다는 뜻입니다. 그러면 x²⁵⁶=−1이라 차수 256 항은 자리 0으로 내려오며 부호가 바뀝니다." },
  { label: "x⁵¹⁰도 같은 규칙", summary: "x⁵¹⁰ = −x²⁵⁴", note: "x⁵¹⁰은 x²⁵⁶과 x²⁵⁴의 곱이므로 −x²⁵⁴가 됩니다. 넘친 띠가 통째로 아래 띠에 포개지고 부호만 뒤집힙니다. 그래서 결과는 언제나 256자리입니다." },
  { label: "계수도 줄임", summary: "−1 → 3328", note: "계수는 3329로 나눈 나머지로 계산하므로 −1은 3329−1=3328로 적습니다. 차수는 x²⁵⁶+1로, 계수는 3329로 줄이는 두 가지 축소가 함께 일어납니다." },
] as const;

function Band({ y, dashed = false, color = GRAY }: { y: number; dashed?: boolean; color?: string }) {
  return (
    <g>
      <rect x={X0} y={y} width={LEN} height={BAND} fill={dashed ? "none" : `${color}1a`} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {Array.from({ length: 15 }, (_, index) => (
        <line key={index} x1={X0 + ((index + 1) * LEN) / 16} x2={X0 + ((index + 1) * LEN) / 16} y1={y} y2={y + BAND} stroke={color} strokeWidth={0.5} opacity={0.5} />
      ))}
    </g>
  );
}

function Wrap({ active }: { active: number }) {
  const showUp = active >= 1 && active <= 3;
  const dropAt = active === 2 ? 0 : active === 3 ? 254 : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {showUp && (
        <g>
          <text x={X0} y={Y_UP - 22} fontSize={12} fontWeight={700} fill={RED}>넘친 자리</text>
          <text x={px(0)} y={Y_UP - 6} fontSize={12} fill={GRAY}>256</text>
          <text x={px(255)} y={Y_UP - 6} textAnchor="end" fontSize={12} fill={GRAY}>510</text>
          <Band y={Y_UP} dashed color={RED} />
        </g>
      )}
      <text x={X0} y={Y_LOW + BAND + 34} fontSize={12} fontWeight={700} fill={BLUE}>결과의 256자리</text>
      <text x={px(0)} y={Y_LOW + BAND + 16} fontSize={12} fill={GRAY}>0</text>
      <text x={px(255)} y={Y_LOW + BAND + 16} textAnchor="end" fontSize={12} fill={GRAY}>255</text>
      <Band y={Y_LOW} color={BLUE} />

      {active === 1 && (
        <g>
          <circle cx={px(254)} cy={Y_UP + BAND / 2} r={6} fill={RED} />
          <text x={px(254) - 12} y={Y_UP + BAND + 18} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>x²⁵⁵ · x²⁵⁵ = x⁵¹⁰</text>
        </g>
      )}
      {dropAt !== null && (
        <g>
          <circle cx={px(dropAt)} cy={Y_UP + BAND / 2} r={6} fill={RED} />
          <Arrow x1={px(dropAt)} y1={Y_UP + BAND / 2 + 8} x2={px(dropAt)} y2={Y_LOW + 5} color={RED} />
          <circle cx={px(dropAt)} cy={Y_LOW + BAND / 2} r={6} fill={BLUE} />
          <text x={dropAt === 0 ? px(dropAt) + 12 : px(dropAt) - 12} y={(Y_UP + Y_LOW + BAND) / 2 + 5} textAnchor={dropAt === 0 ? "start" : "end"} fontSize={14} fontWeight={700} fill={RED}>
            {dropAt === 0 ? "x²⁵⁶ → −1" : "x⁵¹⁰ → −x²⁵⁴"}
          </text>
        </g>
      )}
      {active === 4 && (
        <g>
          <circle cx={px(0)} cy={Y_LOW + BAND / 2} r={6} fill={BLUE} />
          <Arrow x1={px(0)} y1={Y_LOW - 4} x2={px(0)} y2={Y_LOW - 34} color={GRAY} />
          <text x={px(0) + 12} y={Y_LOW - 42} fontSize={14} fontWeight={700} fill={BLUE}>자리 0의 계수: −1 + 3329 = 3328</text>
          <text x={px(0) + 12} y={Y_LOW - 18} fontSize={12} fill={GRAY}>계수의 범위 0~3328</text>
        </g>
      )}
    </svg>
  );
}

export default function PolyWrapViz() {
  return (
    <SceneShell
      eyebrow="다항식 줄이기"
      title="x²⁵⁶+1로 줄이면 넘친 항이 부호를 바꿔 내려옵니다"
      description="띠 한 칸이 16자리를 나타내고 왼쪽 끝이 낮은 차수입니다. 숫자는 차수이고, 점은 항 하나입니다."
      ariaLabel="차수 510까지 넘친 다항식 곱이 x의 256제곱을 −1로 바꾸어 256자리로 되돌아오는 과정"
      scenes={SCENES}
      render={(active) => <Wrap active={active} />}
    />
  );
}
