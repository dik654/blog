import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — normalize: v/max(‖v‖,10⁻¹²), cosine_similarity: 각 노름을 10⁻⁸ 이상으로 제한.
 * 출력 길이 = min(1, ‖v‖/eps). 코사인(방향 고정, x₂=(1,0)) = 0.6 × min(1, ‖x₁‖/eps).
 * 5×10⁻¹⁴/10⁻¹² = 0.05, 0.6 × 5×10⁻¹⁰/10⁻⁸ = 0.03. 전부 문서 식을 대입한 계산이다.
 */
const SCENES = [
  { label: "보통 크기의 입력", summary: "(3,4) ÷ 5 = (0.6,0.8)", note: "입력 길이 5가 eps보다 훨씬 크므로 분모는 5입니다. 결과의 길이는 1입니다. 그래프 오른쪽의 평평한 구간입니다." },
  { label: "분모가 바뀌는 문턱", summary: "‖v‖ = eps = 10⁻¹²", note: "max(‖v‖, eps)는 길이가 eps보다 작아지는 순간부터 eps를 고릅니다. 분모에 더하는 것이 아니라 바닥을 까는 것이라 문턱 위의 출력은 그대로입니다." },
  { label: "문턱 아래 입력", summary: "(3×10⁻¹⁴,4×10⁻¹⁴) → 길이 0.05", note: "길이 5×10⁻¹⁴를 eps로 나누면 (0.03,0.04), 길이 0.05입니다(가정). 함수 이름이 normalize여도 이 입력에서는 길이 1이 되지 않습니다." },
  { label: "코사인 함수의 문턱", summary: "3×10⁻¹⁰ ÷ 10⁻⁸ = 0.03", note: "cosine_similarity에 x₁=(3×10⁻¹⁰,4×10⁻¹⁰), x₂=(1,0)을 넣으면 x₁의 노름 5×10⁻¹⁰이 eps 10⁻⁸로 올라가 값이 0.03입니다(가정). 기하학적 코사인 0.6과 다릅니다. 이 함수의 기본 eps가 10⁻⁸이라 문턱 위치도 다릅니다." },
  { label: "0벡터", summary: "출력 0, 방향 없음", note: "0벡터를 넣으면 이 문서식의 출력은 0입니다. 왼쪽으로 갈수록 곡선이 닿는 값이기도 합니다. 계산 결과가 있다고 0벡터에 방향이 생기지는 않습니다." },
] as const;

const W = 360;
const H = 190;
const L = 62;
const R = 348;
const T = 22;
const B = 150;
const MIN_LOG = -16;
const MAX_LOG = 2;
const sx = (log: number) => L + ((log - MIN_LOG) / (MAX_LOG - MIN_LOG)) * (R - L);
const sy = (value: number) => B - value * (B - T);
const LOGS = Array.from({ length: (MAX_LOG - MIN_LOG) * 4 + 1 }, (_, index) => MIN_LOG + index / 4);
const curve = (epsLog: number, top: number) => LOGS.map((log) => `${sx(log).toFixed(1)},${sy(top * Math.min(1, 10 ** (log - epsLog))).toFixed(1)}`).join(" ");
const TICKS = [
  { log: -16, text: "10⁻¹⁶" },
  { log: -12, text: "10⁻¹²" },
  { log: -8, text: "10⁻⁸" },
  { log: -4, text: "10⁻⁴" },
  { log: 0, text: "1" },
] as const;
const LOG_5 = Math.log10(5);

export default function EpsFloorViz() {
  return (
    <SceneShell
      eyebrow="작은 분모의 바닥"
      title="입력이 eps보다 작아지면 출력이 입력을 따라 함께 줄어듭니다"
      description="가로축은 입력 길이이고 한 눈금마다 10⁴배입니다. PyTorch 2.8 문서의 식과 기본 eps를 대입해 계산한 곡선이며 라이브러리를 실행해 잰 값이 아닙니다."
      ariaLabel="입력 길이에 따른 normalize 출력 길이와 cosine_similarity 값"
      scenes={SCENES}
      render={(active) => {
        const cosine = active === 3;
        const point =
          active === 0 ? { x: sx(LOG_5), y: sy(1), text: "입력 5 → 1", anchor: "end" as const, dx: 0, dy: -9 }
          : active === 1 ? { x: sx(-12), y: sy(1), text: "eps", anchor: "middle" as const, dx: 0, dy: -9 }
          : active === 2 ? { x: sx(LOG_5 - 14), y: sy(0.05), text: "5×10⁻¹⁴ → 0.05", anchor: "start" as const, dx: sx(-12) + 6 - sx(LOG_5 - 14), dy: sy(0.25) - sy(0.05) }
          : active === 3 ? { x: sx(LOG_5 - 10), y: sy(0.03), text: "5×10⁻¹⁰ → 0.03", anchor: "end" as const, dx: -7, dy: -7 }
          : { x: 30, y: sy(0), text: "0벡터 → 0", anchor: "start" as const, dx: -22, dy: -10 };
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={L} y={13} fontSize={11} fill="#64748b">{cosine ? "코사인 값" : "출력 길이"}</text>
            <line x1={L} x2={R} y1={B} y2={B} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={T - 2} y2={B} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick.log}>
                <line x1={sx(tick.log)} x2={sx(tick.log)} y1={B} y2={B + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(tick.log)} y={B + 17} textAnchor="middle" fontSize={11} fill="#64748b">{tick.text}</text>
              </g>
            ))}
            <text x={L - 5} y={sy(1) + 4} textAnchor="end" fontSize={11} fill="#64748b">1</text>
            <text x={L - 5} y={sy(0.6) + 4} textAnchor="end" fontSize={11} fill="#64748b" opacity={cosine ? 1 : 0}>0.6</text>
            <line x1={L} x2={R} y1={sy(cosine ? 0.6 : 1)} y2={sy(cosine ? 0.6 : 1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={30} y={B + 17} textAnchor="middle" fontSize={11} fill="#64748b">0</text>
            <line x1={30} x2={30} y1={B} y2={B + 4} stroke="#94a3b8" strokeWidth={1} />
            <line x1={22} x2={L - 14} y1={B} y2={B} stroke="#94a3b8" strokeWidth={1} />
            <line x1={sx(cosine ? -8 : -12)} x2={sx(cosine ? -8 : -12)} y1={T} y2={B} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(cosine ? -8 : -12) + 5} y={B - 8} fontSize={11} fontWeight={700} fill="#d97706">eps</text>
            <polyline points={cosine ? curve(-8, 0.6) : curve(-12, 1)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={point.x} cy={point.y} r={4.5} fill="#2563eb" />
            {active === 2 && <line x1={point.x + 3} y1={point.y - 3} x2={point.x + point.dx - 2} y2={point.y + point.dy + 2} stroke="#2563eb" strokeWidth={1} opacity={0.5} />}
            {active !== 1 && (
              <text x={point.x + point.dx} y={point.y + point.dy} textAnchor={point.anchor} fontSize={12} fontWeight={700} fill="#2563eb">{point.text}</text>
            )}
            <text x={R} y={H - 6} textAnchor="end" fontSize={11} fill="#64748b">입력 길이 (0벡터는 축과 따로)</text>
          </svg>
        );
      }}
    />
  );
}
