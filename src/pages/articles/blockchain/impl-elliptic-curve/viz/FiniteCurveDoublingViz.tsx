import SceneShell from "./SceneShell";

/**
 * 본문 대응: #coordinate-ops — 설명용 곡선 y² = x³ + 2x + 2 (mod 17) 위에서 P=(5,1)을 두 배로 만든다.
 * 곡선의 affine 점 18개 + 무한원점 O = 19개 (손계산으로 전수 확인).
 * λ = 13, 직선 y = 13(x − 5) + 1 mod 17은 곡선 점 (5,1)과 (6,14)에서만 겹친다.
 * y₂ = λ(x − x₂) − y = −(13·(6 − 5) + 1) = −14 ≡ 3 → 2P = (6,3).
 */
const MOD = 17;
const A = 2;
const B = 2;
const LAMBDA = 13;
const P = { x: 5, y: 1 } as const;

const POINTS = Array.from({ length: MOD * MOD }, (_, index) => ({ x: Math.floor(index / MOD), y: index % MOD })).filter(
  ({ x, y }) => (y * y - (x * x * x + A * x + B)) % MOD === 0,
);
const LINE = Array.from({ length: MOD }, (_, x) => ({ x, y: (((LAMBDA * (x - P.x) + P.y) % MOD) + MOD) % MOD }));

const CELL = 18;
const LEFT = 26;
const TOP = 10;
const SIZE = CELL * (MOD - 1);
const W = LEFT + SIZE + 14;
const H = TOP + SIZE + 26;
const sx = (x: number) => LEFT + x * CELL;
const sy = (y: number) => TOP + (MOD - 1 - y) * CELL;
const TICKS = [0, 5, 10, 16] as const;

const SCENES = [
  { label: "칸 위의 점 18개", summary: "18개 + 무한원점 O = 19", note: "F₁₇에서는 좌표가 0~16의 정수뿐이라 곡선이 매끄러운 선이 아니라 y² ≡ x³ + 2x + 2를 만족하는 칸들의 모임입니다. 여기 보이는 18개에 그릴 수 없는 무한원점 O를 더해 19개입니다." },
  { label: "x=5의 두 후보", summary: "(5,1) · (5,16)", note: "x=5 열에는 점이 두 개 있습니다. 1 + 16 = 17 ≡ 0이라 두 y는 서로 반대이고, 0x03의 홀수 표식이 y=1, 곧 P=(5,1)을 고릅니다." },
  { label: "기울기 λ=13인 직선", summary: "y = 13(x − 5) + 1 mod 17", note: "본문 공식의 기울기 λ=13으로 P를 지나는 직선의 칸을 찍었습니다. mod 17이라 16을 넘으면 0부터 다시 올라오므로 줄무늬처럼 보입니다. 이 17칸 중 곡선 점과 겹치는 곳은 (5,1)과 (6,14) 두 칸뿐입니다." },
  { label: "부호를 바꿔 2P", summary: "(6,14) → 2P = (6,3)", note: "직선이 x₂=6에서 지나는 높이는 13·(6 − 5) + 1 = 14입니다. 공식 y₂ = λ(x − x₂) − y는 이 값의 부호를 바꾼 것이라 −14 ≡ 3, 곧 2P = (6,3)입니다. y=3이 홀수이므로 출력은 0x03 0x06입니다." },
] as const;

export default function FiniteCurveDoublingViz() {
  return (
    <SceneShell
      eyebrow="설명용 E(F₁₇) 위의 점 두 배"
      title="P=(5,1)의 기울기 13 직선은 (6,14)에서 곡선과 다시 만나고, 부호를 바꾼 (6,3)이 2P입니다"
      description="가로가 x, 세로가 y이고 점 하나가 곡선 y² = x³ + 2x + 2 (mod 17)을 만족하는 좌표이고, 3장면부터 나오는 주황 네모는 직선이 지나는 칸입니다. 숫자는 모두 본문의 손계산에서 나왔습니다."
      ariaLabel="유한체 F17 위 설명용 곡선의 18개 점과 P=(5,1), 기울기 13 직선, 2P=(6,3)"
      scenes={SCENES}
      render={(active) => {
        const showLine = active >= 2;
        const highlight = (x: number, y: number) =>
          (active === 1 && x === 5) || (active >= 2 && x === 6 && y === 14);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: MOD }, (_, i) => (
              <g key={i}>
                <line x1={sx(i)} x2={sx(i)} y1={sy(0)} y2={sy(MOD - 1)} stroke="#e2e8f0" strokeWidth={0.5} />
                <line x1={sx(0)} x2={sx(MOD - 1)} y1={sy(i)} y2={sy(i)} stroke="#e2e8f0" strokeWidth={0.5} />
              </g>
            ))}
            {TICKS.map((t) => (
              <g key={t}>
                <text x={sx(t)} y={sy(0) + 16} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
                <text x={LEFT - 8} y={sy(t) + 3.5} textAnchor="end" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
            {active === 1 && <rect x={sx(5) - 7} y={sy(16) - 7} width={14} height={sy(1) - sy(16) + 14} rx={7} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />}
            {showLine &&
              LINE.map(({ x, y }) => <rect key={`l${x}`} x={sx(x) - 3} y={sy(y) - 3} width={6} height={6} fill="#d97706" opacity={0.85} />)}
            {POINTS.map(({ x, y }) => {
              const isP = x === P.x && y === P.y;
              const is2P = active >= 3 && x === 6 && y === 3;
              const on = highlight(x, y);
              const fill = isP && active >= 1 ? "#2563eb" : is2P ? "#16a34a" : on ? "#ffffff" : "#475569";
              const stroke = isP && active >= 1 ? "#2563eb" : is2P ? "#16a34a" : on ? (active === 1 ? "#2563eb" : "#d97706") : "#475569";
              return <circle key={`${x}-${y}`} cx={sx(x)} cy={sy(y)} r={on || isP ? 5.5 : 4} fill={fill} stroke={stroke} strokeWidth={1.25} />;
            })}
            {active >= 1 && (
              <text x={sx(5) + 9} y={sy(1) + 4} fontSize={11} fontWeight={700} fill="#2563eb">P (5,1)</text>
            )}
            {active === 1 && (
              <text x={sx(5) + 9} y={sy(16) + 4} fontSize={11} fill="#475569">(5,16)</text>
            )}
            {active >= 2 && (
              <text x={sx(6) + 9} y={sy(14) + 4} fontSize={11} fontWeight={700} fill="#b45309">(6,14)</text>
            )}
            {active >= 3 && (
              <>
                <line x1={sx(6)} x2={sx(6)} y1={sy(14) + 7} y2={sy(3) - 7} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
                <text x={sx(6) + 9} y={sy(3) + 4} fontSize={11} fontWeight={700} fill="#16a34a">2P (6,3)</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
