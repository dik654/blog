import F9Board, { type CellView } from "./F9Board";
import SceneShell from "./SceneShell";
import { ALL_CELLS, CELL_H, CELL_INSET, CELL_W, GRID_X, GRID_Y, centerX, centerY, elementName, mulF3 } from "./f9Geometry";

/**
 * 본문 대응: #black-box·#need·#boundaries — 아홉 원소 중 0 아닌 값마다 곱해서 1이 되는 짝이 있는가.
 * u²=2: 1↔1, 2↔2, u↔2u, 1+u↔2+u, 1+2u↔2+2u (7절 곱셈식으로 직접 계산).
 * u²=1: 1+u, 2+u, 1+2u, 2+2u는 짝이 없고 (u−1)(u+1)=[2,1]·[1,1]=0.
 */
function inverseOf(a: number, b: number, beta: number): readonly [number, number] | null {
  return ALL_CELLS.find((y) => {
    const p = mulF3([a, b], y, beta);
    return p[0] === 1 && p[1] === 0;
  }) ?? null;
}

const SCENES = [
  { label: "아홉 칸", summary: "u²=2 · 계수 mod 3", note: "칸 하나가 a+bu 하나입니다. a와 b가 각각 0·1·2라서 3×3=9칸입니다. 0은 무엇을 곱해도 0이라 역원이 없고, 이것은 정상적인 실패입니다." },
  { label: "u²=2의 역원 짝", summary: "0 아닌 여덟 칸 모두 짝 있음", note: "3절의 1+u와 2+u가 한 짝입니다. 1과 2는 자기 자신과 곱해 1이 됩니다(2×2=4, 나머지 1). 각 칸의 짝은 7절의 곱셈식으로 직접 계산한 값입니다." },
  { label: "u²=1로 바꾸면", summary: "네 칸이 짝을 잃음", note: "규칙만 u²=1로 바꾸고 같은 아홉 칸을 다시 계산했습니다. 1+u, 2+u, 1+2u, 2+2u는 아홉 값 중 무엇을 곱해도 1이 되지 않습니다." },
  { label: "0 아닌 두 값의 곱이 0", summary: "[2,1] × [1,1] = [0,0]", note: "u−1=[2,1]과 u+1=[1,1]은 둘 다 0이 아닌데 곱은 u²−1=0입니다. 5절이 말한 모순이고, 14절의 잘못된 설정에서도 [1,1]의 inverse는 None이었습니다." },
] as const;

function HLink({ a, b, color, label }: { a: number; b: number; color: string; label?: string }) {
  const x1 = GRID_X + a * CELL_W + CELL_W - CELL_INSET;
  const x2 = GRID_X + (a + 1) * CELL_W + CELL_INSET;
  const y = centerY(b);
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <circle cx={x1} cy={y} r={2.5} fill={color} />
      <circle cx={x2} cy={y} r={2.5} fill={color} />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function VLink({ a, b, color }: { a: number; b: number; color: string }) {
  const x = centerX(a) + 30;
  const y1 = GRID_Y + b * CELL_H + CELL_H - CELL_INSET;
  const y2 = GRID_Y + (b + 1) * CELL_H + CELL_INSET;
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2} stroke={color} strokeWidth={1.25} />
      <circle cx={x} cy={y1} r={2.5} fill={color} />
      <circle cx={x} cy={y2} r={2.5} fill={color} />
    </g>
  );
}

export default function InversePairsViz() {
  return (
    <SceneShell
      eyebrow="역원 짝"
      title="아홉 칸 중 0 아닌 값마다 곱해서 1이 되는 짝이 있나요"
      description="칸 하나가 원소 a+bu 하나입니다. 가로는 상수 계수 a, 세로는 u의 계수 b이며 칸의 배치는 설명용입니다. 역원은 곱해서 1이 되는 값입니다."
      ariaLabel="F3 계수 아홉 원소에서 u제곱이 2일 때와 1일 때의 역원 짝 비교"
      scenes={SCENES}
      render={(active) => {
        const beta = active >= 2 ? 1 : 2;
        const cell = (a: number, b: number): CellView => {
          if (a === 0 && b === 0) {
            if (active === 3) return { tone: "bad", sub: "곱 = 0" };
            return { tone: "dim", sub: "역원 없음" };
          }
          if (active === 0) return { tone: "base" };
          if (active === 3) {
            if (b === 1 && a === 2) return { tone: "warn", sub: "u−1" };
            if (b === 1 && a === 1) return { tone: "warn", sub: "u+1" };
            return { tone: "dim" };
          }
          const inv = inverseOf(a, b, beta);
          if (!inv) return { tone: "bad", sub: "역원 없음" };
          const isCase = active === 1 && b === 1 && a > 0;
          return { tone: isCase ? "focus" : "ok", sub: `× ${elementName(inv[0], inv[1])} = 1` };
        };
        return (
          <F9Board
            cell={cell}
            ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
            overlay={
              active === 1 ? (
                <>
                  <VLink a={0} b={1} color="#16a34a" />
                  <HLink a={1} b={1} color="#2563eb" />
                  <HLink a={1} b={2} color="#16a34a" />
                </>
              ) : active === 3 ? (
                <HLink a={1} b={1} color="#d97706" label="×" />
              ) : null
            }
          />
        );
      }}
    />
  );
}
