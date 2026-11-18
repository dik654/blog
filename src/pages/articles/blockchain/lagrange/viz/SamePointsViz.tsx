import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — F17에서 입력 0·1·2·3의 값.
 * L = x²+2x+1: 1, 4, 9, 16.  Z_H = x(x−1)(x−2): 0, 0, 0, 6.
 * L+Z_H: 1, 4, 9, (16+6) mod 17 = 5.
 */
const MOD = 17;
const XS = [0, 1, 2, 3] as const;
const L_VALUES: readonly number[] = [1, 4, 9, 16];
const Z_VALUES: readonly number[] = [0, 0, 0, 6];
const SUM_VALUES = XS.map((_, index) => (L_VALUES[index] + Z_VALUES[index]) % MOD);

const W = 360;
const H = 200;
const LEFT = 34;
const RIGHT = 16;
const TOP = 14;
const BOTTOM = 166;
const px = (x: number) => LEFT + 24 + (x / 3) * (W - LEFT - RIGHT - 48);
const py = (y: number) => BOTTOM - (y / 16) * (BOTTOM - TOP);
const Y_TICKS = [0, 4, 8, 12, 16] as const;

const SCENES = [
  { label: "2차 규칙 L", summary: "1, 4, 9 → 입력 3에서 16", note: "L(x)=x²+2x+1은 표본 위치 0·1·2에서 1·4·9를 지나고 입력 3에서 16입니다. 회색 띠가 세 표본 위치입니다." },
  { label: "L에 Z_H를 더하면", summary: "1, 4, 9 → 입력 3에서 5", note: "Z_H(x)=x(x−1)(x−2)는 0·1·2에서 모두 0인 3차식입니다. L에 더해도 세 표본값은 1·4·9 그대로지만 입력 3에서는 16+6=22의 나머지 5가 되어 16과 다릅니다." },
  { label: "두 규칙의 차이", summary: "차이 = Z_H: 0, 0, 0, 6", note: "두 규칙의 차이는 Z_H이고 서로 다른 근 0·1·2를 가집니다. 3차식이라 가능한 일입니다. 0이 아닌 2차 이하 다항식은 근을 세 개 가질 수 없으므로, 세 점이 규칙을 하나로 정한다는 말은 2차 이하라는 조건을 포함합니다." },
] as const;

function Dot({ x, y, color, hollow = false }: { x: number; y: number; color: string; hollow?: boolean }) {
  return <circle cx={px(x)} cy={py(y)} r={hollow ? 6.5 : 4.5} fill={hollow ? "none" : color} stroke={color} strokeWidth={hollow ? 1.25 : 1} />;
}

export default function SamePointsViz() {
  return (
    <SceneShell
      eyebrow="같은 세 점, 다른 규칙"
      title="세 표본에서는 같아도 입력 3에서 갈라집니다"
      description="가로축은 입력, 세로축은 17로 나눈 나머지(F17)의 값입니다. 유한체 값이라 점 사이를 선으로 잇지 않습니다."
      ariaLabel="F17에서 L, L+Z_H, Z_H의 입력 0부터 3까지의 값 비교"
      scenes={SCENES}
      render={(active) => {
        const showSum = active === 1;
        const showDiff = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={px(0) - 14} y={TOP} width={px(2) - px(0) + 28} height={BOTTOM - TOP} fill="#94a3b8" opacity={0.12} rx={6} />
              {Y_TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={py(tick)} y2={py(tick)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "2 3"} />
                  <text x={LEFT - 6} y={py(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
                </g>
              ))}
              {XS.map((x) => (
                <text key={x} x={px(x)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill="#64748b">x={x}</text>
              ))}
              <text x={(px(0) + px(2)) / 2} y={BOTTOM + 30} textAnchor="middle" fontSize={10} fill="#64748b">표본 위치</text>
              {XS.map((x, index) => (
                <g key={x}>
                  {!showDiff && <Dot x={x} y={L_VALUES[index]} color="#2563eb" />}
                  {showSum && <Dot x={x} y={SUM_VALUES[index]} color="#d97706" hollow />}
                  {showDiff && <Dot x={x} y={Z_VALUES[index]} color="#7c3aed" />}
                </g>
              ))}
              {!showDiff && <text x={px(3) - 10} y={py(16) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">L(3)=16</text>}
              {showSum && <text x={px(3) - 10} y={py(5) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#d97706">L+Z_H: 22→5</text>}
              {showDiff && <text x={px(3) - 10} y={py(6) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#7c3aed">Z_H(3)=6</text>}
              {showDiff && <text x={px(1)} y={py(0) - 12} textAnchor="middle" fontSize={11} fill="#7c3aed">근 세 개</text>}
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span className={`inline-flex items-center gap-1.5 ${showDiff ? "opacity-30" : ""}`}>
                <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#2563eb" /></svg>L = x²+2x+1 (2차)
              </span>
              <span className={`inline-flex items-center gap-1.5 ${showSum ? "" : "opacity-30"}`}>
                <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="none" stroke="#d97706" strokeWidth="1.25" /></svg>L + Z_H (3차)
              </span>
              <span className={`inline-flex items-center gap-1.5 ${showDiff ? "" : "opacity-30"}`}>
                <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#7c3aed" /></svg>Z_H = x(x−1)(x−2)
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
