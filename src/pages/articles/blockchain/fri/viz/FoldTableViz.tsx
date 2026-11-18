import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — mod 17에서 f(X)=X²+2X+3을 위치 1~16에 계산한 표(가정)를
 * 서로 반대인 위치(x, 17−x)끼리 묶어 제곱 위치로 모은다. 값은
 * (f(x)+f(−x))/2 + β·(f(x)−f(−x))/(2x), β=5 → 위치 4·13의 10·11이 위치 16의 12.
 * 마지막 장면은 #folding의 두 번째 숫자 3으로 8칸을 4칸으로 줄여 모두 16이 되는 계산.
 * 모든 값은 아래 함수로 계산한다(본문 숫자와 같은지 장면 문구에서 대조).
 */
const P = 17;
const mod = (n: number) => ((n % P) + P) % P;
const inv = (a: number) =>
  Array.from({ length: P - 2 }, () => 0).reduce<number>((acc) => mod(acc * a), 1); // a^(p−2)
const f = (x: number) => mod(x * x + 2 * x + 3);
const fold = (x: number, vx: number, vneg: number, beta: number) => {
  const even = mod((vx + vneg) * inv(2));
  const odd = mod((vx - vneg) * inv(mod(2 * x)));
  return mod(even + beta * odd);
};

type Column = { top: number; bottom: number; topValue: number; bottomValue: number; square: number; folded: number };

const LAYER0_TOP = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const LAYER0: Column[] = LAYER0_TOP.map((x) => ({
  top: x,
  bottom: P - x,
  topValue: f(x),
  bottomValue: f(P - x),
  square: mod(x * x),
  folded: fold(x, f(x), f(P - x), 5),
}));
const g = (t: number) => LAYER0.find((c) => c.square === t)?.folded ?? 0;
const LAYER1_TOP = [1, 4, 9, 2] as const;
const LAYER1: Column[] = LAYER1_TOP.map((x) => ({
  top: x,
  bottom: P - x,
  topValue: g(x),
  bottomValue: g(P - x),
  square: mod(x * x),
  folded: fold(x, g(x), g(P - x), 3),
}));

const SCENES = [
  { label: "16칸 표", summary: "위치 4 → 10, 위치 13 → 11", note: "칸 위쪽 작은 숫자가 위치, 큰 숫자가 그 위치의 값입니다. 위 줄에 1~8, 아래 줄에 16~9를 놓아 한 세로줄에 두 위치가 서게 했습니다." },
  { label: "반대 위치끼리 짝", summary: "13 ≡ −4 (mod 17)", note: "한 세로줄의 두 위치를 더하면 17이므로 mod 17에서 서로 반대(x와 −x)입니다. 1과 16, 2와 15, 4와 13이 이렇게 짝입니다." },
  { label: "제곱하면 같은 위치", summary: "4² ≡ 13² ≡ 16", note: "x와 −x는 제곱이 같습니다. 그래서 세로줄마다 새 위치 하나로 모이고 16칸이 8칸이 됩니다. 새 값은 아직 정하지 않았습니다." },
  { label: "나중에 받은 5로 섞기", summary: "10·11 → 2 + 5×2 = 12", note: "각 세로줄의 두 값에서 합÷2(짝수 부분)와 차÷2x(홀수 부분)를 구하고, 표를 고정한 뒤 받은 5로 섞습니다. 위치 16의 12는 3절의 계산과 같습니다. 나머지 일곱 칸도 같은 식으로 계산했습니다." },
  { label: "한 번 더 접기", summary: "8칸 → 4칸, 모두 16", note: "8칸 표를 고정한 뒤 다음 숫자를 3으로 잡으면(가정, 7절) 같은 방법으로 4칸이 됩니다. 네 칸이 모두 13+3×1=16인 상수입니다. 7절의 말로는 차수 2의 함수가 차수 1을 거쳐 상수로 줄어든 것입니다." },
] as const;

const W = 360;
const CELL_W = 36;
const CELL_H = 36;
const TOP_Y = 14;
const BOT_Y = 58;
const NEW_Y = 150;
const H = NEW_Y + CELL_H + 24;

function Cell({ x, y, pos, value, tone }: { x: number; y: number; pos: number; value: string; tone: "plain" | "focus" | "muted" | "new" }) {
  const stroke = tone === "focus" ? "#2563eb" : tone === "new" ? "#16a34a" : tone === "muted" ? "#e2e8f0" : "#94a3b8";
  const fill = tone === "focus" ? "#dbeafe" : tone === "new" ? "#dcfce7" : "#ffffff";
  return (
    <g>
      <rect x={x} y={y} width={CELL_W} height={CELL_H} rx={6} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + CELL_W / 2} y={y + 12} textAnchor="middle" fontSize={10} fill="#64748b">{pos}</text>
      <text x={x + CELL_W / 2} y={y + 29} textAnchor="middle" fontSize={13} fontWeight={tone === "focus" ? 700 : 500} fill={tone === "muted" ? "#94a3b8" : "#0f172a"}>{value}</text>
    </g>
  );
}

export default function FoldTableViz() {
  return (
    <SceneShell
      eyebrow="표를 절반으로 접기"
      title="반대 위치 두 칸이 제곱 위치 한 칸으로 모입니다"
      description="17로 나눈 나머지에서 f(X)=X²+2X+3을 위치 1~16에 계산한 표입니다(숫자는 모두 가정). 섞는 숫자 5와 3은 각 표를 고정한 뒤에 받은 값입니다."
      ariaLabel="16칸 평가표를 반대 위치끼리 묶어 8칸, 다시 4칸으로 접는 과정"
      scenes={SCENES}
      render={(active) => {
        const second = active === 4;
        const cols = second ? LAYER1 : LAYER0;
        const step = second ? 80 : 42;
        const x0 = (W - ((cols.length - 1) * step + CELL_W)) / 2;
        const isFocus = (c: Column) => !second && c.top === 4;
        const showPairs = active >= 1;
        const showNew = active >= 2;
        const showValues = active >= 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {cols.map((c, i) => {
              const x = x0 + i * step;
              const focus = isFocus(c) && active < 4;
              const tone = focus ? "focus" : "plain";
              return (
                <g key={`${second ? "b" : "a"}${c.top}`}>
                  {showPairs && (
                    <rect x={x - 3} y={TOP_Y - 3} width={CELL_W + 6} height={BOT_Y + CELL_H - TOP_Y + 6} rx={8} fill="none" stroke={focus ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray="3 3" />
                  )}
                  <Cell x={x} y={TOP_Y} pos={c.top} value={String(c.topValue)} tone={tone} />
                  <Cell x={x} y={BOT_Y} pos={c.bottom} value={String(c.bottomValue)} tone={tone} />
                  {showNew && (
                    <>
                      <line x1={x + CELL_W / 2} y1={BOT_Y + CELL_H + 4} x2={x + CELL_W / 2} y2={NEW_Y - 8} stroke={focus ? "#2563eb" : "#94a3b8"} strokeWidth={focus ? 1.25 : 1} />
                      <polygon points={`${x + CELL_W / 2},${NEW_Y - 3} ${x + CELL_W / 2 - 4},${NEW_Y - 10} ${x + CELL_W / 2 + 4},${NEW_Y - 10}`} fill={focus ? "#2563eb" : "#94a3b8"} />
                      <Cell x={x} y={NEW_Y} pos={c.square} value={showValues ? String(c.folded) : "?"} tone={focus ? "focus" : showValues ? "new" : "muted"} />
                    </>
                  )}
                  {!showNew && (
                    <rect x={x} y={NEW_Y} width={CELL_W} height={CELL_H} rx={6} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
                  )}
                </g>
              );
            })}
            <text x={W / 2} y={NEW_Y + CELL_H + 17} textAnchor="middle" fontSize={11} fill="#64748b">{second ? "8칸 → 4칸 (β=3, 가정)" : showValues ? "8칸 표 (β=5)" : showNew ? "제곱한 위치" : "줄인 표 자리"}</text>
          </svg>
        );
      }}
    />
  );
}
