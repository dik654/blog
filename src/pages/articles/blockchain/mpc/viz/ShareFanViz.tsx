import SceneShell from "./SceneShell";

/**
 * 본문 대응: #privacy — 한 조각은 모든 상수항과 맞고, 기울기를 재사용하면 두 조각의 차이에 입력 차이가 남는다.
 * 주소 1의 조각 6: s+a=6 → (s,a)=(4,2),(5,1),(6,0),(3,3)… 그림에는 a=0…5만 그린다.
 * 4+2X → 6,8,10 · 3+2X → 5,7,9 · 차이는 항상 −1 (mod67: 66).
 */
const W = 360;
const H = 210;
const L = 40;
const R = 344;
const T = 16;
const B = 180;
const X_MAX = 3.3;
const Y_MAX = 20;
const sx = (x: number) => L + (x / X_MAX) * (R - L);
const sy = (y: number) => B - (y / Y_MAX) * (B - T);

const FAN = [0, 1, 2, 3, 4, 5].map((a) => ({ s: 6 - a, a }));
const HIGHLIGHT = new Set([4, 5]);
const PAIR = [
  { s: 4, a: 2, color: "#2563eb", name: "4+2X" },
  { s: 3, a: 2, color: "#d97706", name: "3+2X" },
] as const;

const SCENES = [
  {
    label: "조각 하나만 보면",
    summary: "6 = 4+2·1 = 5+1·1 = 6+0·1 = …",
    note: "주소 1의 조각 6을 지나는 직선은 상수항마다 하나씩 있습니다. 상수항 4·기울기 2뿐 아니라 상수항 5·기울기 1과도 맞습니다. 그림에는 여섯 개만 그렸지만, F₆₇에서는 67개 상수항 각각에 맞는 기울기가 정확히 하나씩 있어 기울기를 균등하게 뽑으면 조각 하나로는 상수항이 무엇인지 가려낼 수 없습니다.",
  },
  {
    label: "기울기를 재사용하면",
    summary: "5−6 = 7−8 = 9−10 = −1 ≡ 66",
    note: "4+2X와 3+2X는 같은 기울기라 평행합니다. 같은 사람이 두 조각을 함께 받으면 어느 주소에서든 둘째에서 첫째를 뺀 값이 −1, mod 67에서는 66입니다. 각 조각만 보면 균등해도 두 조각을 함께 본 분포에는 입력 차이 3−4가 남습니다.",
  },
] as const;

export default function ShareFanViz() {
  return (
    <SceneShell
      eyebrow="한 조각의 비밀성"
      title="조각 하나는 모든 상수항과 맞지만 같은 기울기의 두 조각은 차이를 드러냅니다"
      description="가로축은 주소 X, 세로축은 조각 값이며 X=0의 값이 숨긴 상수항입니다. 작은 정수 범위에서 그렸고 mod 67로 줄일 필요가 없는 값만 씁니다."
      ariaLabel="조각 6을 지나는 여러 직선과 기울기를 재사용한 두 평행 직선"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 5, 10, 15, 20].map((tick) => (
            <g key={tick}>
              <line x1={L} x2={R} y1={sy(tick)} y2={sy(tick)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={L - 6} y={sy(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
            </g>
          ))}
          <line x1={L} x2={L} y1={T} y2={B} stroke="#94a3b8" strokeWidth={1} />
          <line x1={L} x2={R} y1={B} y2={B} stroke="#94a3b8" strokeWidth={1} />
          {[0, 1, 2, 3].map((x) => (
            <text key={x} x={sx(x)} y={B + 16} textAnchor="middle" fontSize={11} fill="#64748b">X={x}</text>
          ))}
          {active === 0 ? (
            <>
              {FAN.map(({ s, a }) => {
                const strong = HIGHLIGHT.has(s);
                return (
                  <g key={s}>
                    <line x1={sx(0)} y1={sy(s)} x2={sx(X_MAX)} y2={sy(s + a * X_MAX)} stroke={strong ? "#2563eb" : "#94a3b8"} strokeWidth={strong ? 1.25 : 1} />
                    <circle cx={sx(0)} cy={sy(s)} r={3} fill={strong ? "#2563eb" : "#94a3b8"} />
                    {strong && (
                      <text x={sx(X_MAX) - 2} y={sy(s + a * X_MAX) + (s === 4 ? -6 : 14)} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">
                        상수항 {s} · 기울기 {a}
                      </text>
                    )}
                  </g>
                );
              })}
              <circle cx={sx(1)} cy={sy(6)} r={4.5} fill="#ffffff" stroke="#0f172a" strokeWidth={1.25} />
              <text x={sx(1) + 4} y={sy(6) + 22} fontSize={11} fontWeight={700} fill="#0f172a">받은 조각 6 (주소 1)</text>
            </>
          ) : (
            <>
              {PAIR.map(({ s, a, color, name }) => (
                <g key={name}>
                  <line x1={sx(0)} y1={sy(s)} x2={sx(X_MAX)} y2={sy(s + a * X_MAX)} stroke={color} strokeWidth={1.25} />
                  <text x={sx(0) + 6} y={sy(s) + (s === 4 ? -8 : 16)} fontSize={11} fontWeight={700} fill={color}>{name}</text>
                  {[1, 2, 3].map((x) => (
                    <circle key={x} cx={sx(x)} cy={sy(s + a * x)} r={3} fill={color} />
                  ))}
                </g>
              ))}
              {[1, 2, 3].map((x) => (
                <text key={x} x={sx(x)} y={sy(3 + 2 * x) + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">
                  {3 + 2 * x}−{4 + 2 * x}=−1
                </text>
              ))}
            </>
          )}
        </svg>
      )}
    />
  );
}
