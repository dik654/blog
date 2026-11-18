import F9Board, { type CellView } from "./F9Board";
import SceneShell from "./SceneShell";
import { CELL_H, CELL_W, GRID_X, GRID_Y, elementName } from "./f9Geometry";

/**
 * 본문 대응: #frobenius·#boundaries — F₉에서 세제곱 φ(a+bu)=a+2bu.
 * 세로로 b=1 행과 b=2 행이 서로 바뀌고 b=0 행(F₃)은 그대로입니다. 두 번 적용하면 2²=4=1이라 원복.
 * 잘못된 표 [1,1]은 모든 값을 그대로 두어 원복 검사는 통과하지만 b≠0인 여섯 칸에서 실제 세제곱과 다릅니다.
 */
const SCENES = [
  { label: "세제곱 한 번", summary: "a+bu → a+2bu", note: "a는 그대로이고 u의 계수 b에만 2가 붙습니다. 그래서 b=1 행과 b=2 행이 점선을 사이에 두고 서로 자리를 바꿉니다. 같은 입력 1+u는 1+2u로 갑니다." },
  { label: "한 번 더 세제곱", summary: "1+u → 1+2u → 1+u", note: "두 번 적용하면 b에 2가 두 번 붙어 2²=4, 나머지 1입니다. 모든 칸이 자기 자리로 돌아옵니다." },
  { label: "F₃의 세 값", summary: "돌아오는 최소 횟수는 1 또는 2", note: "b=0 행의 0·1·2는 한 번 만에 그대로입니다. 모든 원소가 정확히 두 번 뒤에만 돌아온다고 말하면 틀립니다." },
  { label: "잘못된 표 [1,1]", summary: "원복 검사 통과 · 세제곱과 다름", note: "표만 [1,1]로 바꾸면 c1에 1을 곱해 모든 값을 그대로 둡니다. 그대로 둔 값은 두 번 적용해도 그대로라 원복 검사는 통과하지만, b가 0이 아닌 여섯 칸은 실제 세제곱과 다릅니다." },
] as const;

const MIRROR_Y = GRID_Y + 2 * CELL_H;

export default function FrobeniusMirrorViz() {
  return (
    <SceneShell
      eyebrow="Frobenius"
      title="세제곱은 아홉 칸을 거울처럼 뒤집습니다"
      description="칸 하나가 원소 a+bu 하나이고 가로는 a, 세로는 u의 계수 b입니다(배치는 설명용). 칸 아래 글자는 세제곱한 뒤 도착하는 값입니다."
      ariaLabel="F9의 아홉 원소에 세제곱 사상을 적용했을 때의 이동"
      scenes={SCENES}
      render={(active) => {
        const cell = (a: number, b: number): CellView => {
          const image = elementName(a, (2 * b) % 3);
          const isCase = a === 1 && b > 0;
          if (active === 0) {
            if (b === 0) return { tone: "ok", sub: "→ 그대로" };
            return { tone: isCase ? "focus" : "base", sub: `→ ${image}` };
          }
          if (active === 1) {
            if (b === 0) return { tone: "ok", sub: "→ 그대로" };
            return { tone: isCase ? "focus" : "base", sub: `→${image}→${elementName(a, b)}` };
          }
          if (active === 2) {
            if (b === 0) return { tone: "ok", sub: "1번에 그대로" };
            return { tone: "dim", sub: "2번에 돌아옴" };
          }
          if (b === 0) return { tone: "ok", sub: "실제와 같음" };
          return { tone: "bad", sub: `실제는 ${image}` };
        };
        return (
          <F9Board
            cell={cell}
            ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
            overlay={
              active <= 1 ? (
                <g>
                  <line x1={GRID_X} x2={GRID_X + 3 * CELL_W} y1={MIRROR_Y} y2={MIRROR_Y} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={GRID_X - 6} y={MIRROR_Y + 4} textAnchor="end" fontSize={9} fontWeight={700} fill="#2563eb">
                    b↔2b
                  </text>
                </g>
              ) : null
            }
          />
        );
      }}
    />
  );
}
