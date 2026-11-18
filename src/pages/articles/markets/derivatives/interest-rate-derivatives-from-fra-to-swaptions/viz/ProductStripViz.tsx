import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture(+#mechanism) — FRA는 한 기간, 스왑은 여러 기간 반복, 캡·플로어는 상한 위·하한 아래 기간만,
 * 스왑션은 미래 스왑을 시작할 권리. 2년 분기 8칸은 7절의 예.
 * 첫 칸 6%·고정 4%는 3절 숫자. 2~8칸의 금리 경로, 캡 5%, 플로어 3%, 행사일(4분기 뒤)은 모양을 보이려는 가정입니다.
 * 스왑 순액(%p) = 변동 − 고정 4%: +2, +1.5, +0.5, −0.5, −1.5, −2, −0.5, +0.5.
 */
const W = 360;
const H = 206;
const RATES: readonly number[] = [6, 5.5, 4.5, 3.5, 2.5, 2, 3.5, 4.5];
const FIXED = 4;
const CAP = 5;
const FLOOR = 3;
const SLOT = 39;
const LEFT = 36;
const BAR = 24;
const BASE = 170;
const y = (rate: number) => BASE - rate * 19;
const bx = (i: number) => LEFT + i * SLOT + (SLOT - BAR) / 2;

type Mode = "fra" | "swap" | "cap" | "floor" | "swaption";

const SCENES: readonly { label: string; summary: string; mode: Mode; note: string }[] = [
  {
    label: "FRA: 한 기간",
    summary: "6% − 4% = 2%p → 약 500만 원",
    mode: "fra",
    note: "미래 한 기간의 금리 차이만 정산합니다. 3절의 10억 원·3개월 사례가 이 한 칸입니다.",
  },
  {
    label: "금리스왑: 매 기간 반복",
    summary: "칸마다 변동 − 고정 4%",
    mode: "swap",
    note: "2년 동안 분기마다 고정하려면 FRA 여러 개를 이어 놓거나 스왑 하나를 씁니다(7절). 고정을 내고 변동을 받는 쪽이면 금리가 4%보다 높은 칸에서 받고 낮은 칸에서 냅니다. 의무라서 불리한 칸도 지급합니다.",
  },
  {
    label: "캡: 상한 위 칸만",
    summary: "상한 5%(가정) 위 2칸에서 받음",
    mode: "cap",
    note: "기준금리가 상한을 넘는 기간에만 받는 옵션들의 묶음입니다. 대출자는 금리 상승만 막고, 금리가 내린 칸의 이익은 그대로 둡니다. 대신 프리미엄을 먼저 냅니다(7절).",
  },
  {
    label: "플로어: 하한 아래 칸만",
    summary: "하한 3%(가정) 아래 2칸에서 받음",
    mode: "floor",
    note: "반대로 기준금리가 하한 아래로 내려간 기간에만 플로어를 산 쪽이 받습니다. 하한 위의 칸에서는 아무것도 오가지 않습니다.",
  },
  {
    label: "스왑션: 시작할 권리",
    summary: "오늘 프리미엄 → 행사일에 선택",
    mode: "swaption",
    note: "정한 날에 정한 조건의 스왑을 시작할 권리입니다. 불리하면 행사하지 않아 뒤의 칸이 아예 생기지 않고, 행사하면 그때부터 스왑처럼 칸마다 주고받습니다. 미래 차입 여부가 불확실할 때 쓸 수 있습니다(7절).",
  },
];

function payoff(mode: Mode, rate: number, i: number) {
  if (mode === "fra") return i === 0 ? rate - FIXED : null;
  if (mode === "swap") return rate - FIXED;
  if (mode === "cap") return rate > CAP ? rate - CAP : 0;
  if (mode === "floor") return rate < FLOOR ? FLOOR - rate : 0;
  return null;
}

function fmt(value: number) {
  return `${value > 0 ? "+" : "−"}${Math.abs(value)}`;
}

export default function ProductStripViz() {
  return (
    <SceneShell
      eyebrow="한 기간 · 여러 기간 · 선택권"
      title="같은 금리 차액이 몇 칸에, 어떤 조건으로 붙는지가 상품을 가릅니다"
      description="막대 하나가 분기 하나의 기준금리(%)이고, 숫자는 그 칸에서 받는(+)·내는(−) 금리 차이(%p)이며 숫자가 없는 칸은 오가는 돈이 없습니다. 첫 칸 6%와 고정 4%는 3절 숫자, 나머지 금리 경로·상한·하한·행사일은 가정입니다."
      ariaLabel="FRA, 금리스왑, 캡, 플로어, 스왑션이 분기 8칸 중 어느 칸에서 지급되는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mode = scene.mode;
        const ref = mode === "cap" ? CAP : mode === "floor" ? FLOOR : FIXED;
        const refLabel = mode === "cap" ? "상한 5%(가정)" : mode === "floor" ? "하한 3%(가정)" : "고정 4%";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={W - 8} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {RATES.map((rate, i) => {
              const value = payoff(mode, rate, i);
              const shown = mode !== "fra" || i === 0;
              const pays = value !== null && value !== 0;
              const fill = mode === "swaption" ? "#94a3b8" : pays ? (value > 0 ? "#16a34a" : "#b91c1c") : "#94a3b8";
              return (
                <g key={i} opacity={shown ? 1 : 0.15}>
                  <rect x={bx(i)} y={y(rate)} width={BAR} height={BASE - y(rate)} rx={2} fill={fill} opacity={mode === "swaption" ? 0.35 : pays ? 0.9 : 0.4} />
                  {value !== null && pays && (
                    <text
                      x={bx(i) + BAR / 2}
                      y={value > 0 ? y(rate) - 6 : y(rate) + 14}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={value > 0 ? "#15803d" : "#ffffff"}
                    >
                      {fmt(value)}
                    </text>
                  )}
                  <text x={bx(i) + BAR / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{i + 1}</text>
                </g>
              );
            })}
            <text x={W - 8} y={BASE + 30} textAnchor="end" fontSize={10} fill="#64748b">분기(칸 번호)</text>

            {mode !== "swaption" && (
              <g>
                <line x1={LEFT - 4} x2={W - 8} y1={y(ref)} y2={y(ref)} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
                <text x={LEFT - 6} y={y(ref) + 4} textAnchor="end" fontSize={10} fontWeight={700} fill="#1d4ed8">{ref}%</text>
                <text x={W - 8} y={20} textAnchor="end" fontSize={11} fill="#1d4ed8">{`점선 = ${refLabel}`}</text>
              </g>
            )}

            {mode === "swaption" && (
              <g>
                <text x={LEFT} y={22} fontSize={11} fontWeight={700} fill="#b91c1c">오늘: 프리미엄 지급</text>
                <line x1={LEFT + 4 * SLOT} x2={LEFT + 4 * SLOT} y1={30} y2={BASE + 4} stroke="#2563eb" strokeWidth={1.25} />
                <text x={LEFT + 4 * SLOT + 4} y={42} fontSize={11} fontWeight={700} fill="#1d4ed8">행사일(가정)</text>
                <rect x={LEFT + 4 * SLOT + 3} y={52} width={4 * SLOT - 8} height={BASE - 56} rx={6} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
                <text x={LEFT + 6 * SLOT} y={72} textAnchor="middle" fontSize={11} fill="#1d4ed8">행사하면 스왑 시작</text>
                <text x={LEFT + 6 * SLOT} y={88} textAnchor="middle" fontSize={11} fill="#64748b">안 하면 칸 없음</text>
                <text x={LEFT + 2 * SLOT} y={44} textAnchor="middle" fontSize={11} fill="#64748b">아직 의무 없음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
