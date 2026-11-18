import F9Board, { type CellView } from "./F9Board";
import SceneShell from "./SceneShell";
import { mulF3 } from "./f9Geometry";

/**
 * 본문 대응: #basis — u와 v=1+u의 곱셈 위수 비교(u²=2, 계수 mod 3).
 * u: u, 2, 2u, 1 → 위수 4.  v: 1+u, 2u, 1+2u, 2, 2+2u, u, 2+u, 1 → 위수 8(원시원소).
 */
const SUP: readonly string[] = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸"];

function powers(g: readonly [number, number], count: number): (readonly [number, number])[] {
  return Array.from({ length: count }, (_, i) => i + 1).reduce<(readonly [number, number])[]>((acc) => {
    const prev = acc.length === 0 ? ([1, 0] as const) : acc[acc.length - 1];
    return [...acc, mulF3(prev, g, 2)];
  }, []);
}

const U_POWERS = powers([0, 1], 4);
const V_POWERS = powers([1, 1], 8);

const SCENES = [
  { label: "u를 거듭 곱하기", summary: "u⁴ = 1 · 네 칸만", note: "u, u²=2, u³=2u, u⁴=1에서 다시 처음으로 돌아갑니다. u를 붙이면 F₉ 전체를 a+bu로 적을 수 있지만, u의 거듭제곱만으로는 0 아닌 여덟 값 중 네 개만 만듭니다." },
  { label: "v=1+u의 1~4제곱", summary: "v² = 2u, v⁴ = 2", note: "v를 곱해 가면 1+u, 2u, 1+2u, 2를 지납니다. u가 닿지 못한 칸에도 갑니다." },
  { label: "v의 5~8제곱", summary: "v⁸ = 1 · 여덟 칸 전부", note: "v는 0 아닌 여덟 값을 모두 한 번씩 만든 뒤 v⁸=1로 돌아옵니다. 곱셈군 전체를 만드는 이런 원소를 원시원소라고 부릅니다. 체를 생성하는 것과 원시원소인 것은 다른 조건입니다." },
] as const;

function findIndex(list: readonly (readonly [number, number])[], a: number, b: number): number {
  return list.findIndex((p) => p[0] === a && p[1] === b);
}

export default function PowerWalkViz() {
  return (
    <SceneShell
      eyebrow="곱셈 위수"
      title="u와 v=1+u를 거듭 곱하면 지나가는 칸 수가 다릅니다"
      description="칸 하나가 원소 a+bu 하나이고 가로는 a, 세로는 u의 계수 b입니다(배치는 설명용). 칸 아래 글자는 그 칸에 도착한 거듭제곱입니다. 곱셈 위수는 거듭 곱해 처음으로 1이 되는 횟수입니다."
      ariaLabel="u와 1+u의 거듭제곱이 F9의 0 아닌 원소를 지나가는 순서"
      scenes={SCENES}
      render={(active) => {
        const cell = (a: number, b: number): CellView => {
          if (a === 0 && b === 0) return { tone: "dim", sub: "거듭제곱에 없음" };
          if (active === 0) {
            const k = findIndex(U_POWERS, a, b);
            return k < 0 ? { tone: "dim", sub: "닿지 않음" } : { tone: "focus", sub: `u${SUP[k + 1]}` };
          }
          const k = findIndex(V_POWERS, a, b);
          const shown = active === 1 ? 4 : 8;
          if (k < 0 || k >= shown) return { tone: "base" };
          const fresh = active === 1 || k >= 4;
          return { tone: fresh ? "focus" : "ok", sub: `v${SUP[k + 1]}` };
        };
        return <F9Board cell={cell} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />;
      }}
    />
  );
}
