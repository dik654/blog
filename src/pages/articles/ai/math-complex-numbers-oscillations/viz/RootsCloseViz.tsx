import SceneShell from "./SceneShell";
import { Plane, TipToTail } from "./Plane";

/**
 * 본문 대응: #roots-of-unity — N=4의 방향 (1,−i,−1,i)와 1+q+q²+q³의 합.
 * q=−i, −1, i → 0, q=1 → 4, 각도를 π/4씩 늘린 경우 → 1+i(1+√2) (0이 아님).
 */
const S = Math.SQRT1_2;
type Term = readonly [number, number];
const SCENES: readonly { label: string; summary: string; note: string; terms: readonly Term[]; circle: boolean }[] = [
  { label: "네 방향", summary: "1 → −i → −1 → i", terms: [], circle: true, note: "N=4의 한 칸은 시계 방향 1/4바퀴인 −i입니다. 점 번호가 거듭제곱의 지수 0, 1, 2, 3이고, 네 번 곱하면 1로 돌아옵니다." },
  { label: "k = 1", summary: "q = −i → 합 0", terms: [[1, 0], [0, -1], [-1, 0], [0, 1]], circle: false, note: "q는 ω를 k번 곱한 값, 합은 1+q+q²+q³입니다. k가 4의 배수가 아니면 경로가 닫혀 합이 0입니다. k=3은 q=i로 방향만 반대입니다." },
  { label: "k = 2", summary: "q = −1 → 합 0", terms: [[1, 0], [-1, 0], [1, 0], [-1, 0]], circle: false, note: "오른쪽과 왼쪽을 번갈아 갑니다. 화살표가 겹치지 않도록 조금씩 아래로 어긋나게 그렸습니다. 마지막에 원점에 돌아와 합은 역시 0입니다." },
  { label: "k = 4의 배수", summary: "q = 1 → 합 4", terms: [[1, 0], [1, 0], [1, 0], [1, 0]], circle: false, note: "k가 N의 배수이면 모든 항이 1입니다. 네 화살표가 한 줄로 이어져 합이 N=4입니다." },
  { label: "칸에 맞지 않는 회전", summary: "π/4씩 → 합 1 + i(1+√2)", terms: [[1, 0], [S, S], [0, 1], [-S, S]], circle: false, note: "각도를 π/4씩 늘리면 네 번으로 한 바퀴가 되지 않아 경로가 닫히지 않습니다. 정수 칸에 맞지 않은 회전은 qᴺ=1을 만족하지 않습니다." },
];

const COLORS: readonly string[] = ["#2563eb", "#d97706", "#16a34a", "#dc2626"];
const NAMES: readonly string[] = ["1", "−i", "−1", "i"];
const POS: readonly Term[] = [[1, 0], [0, -1], [-1, 0], [0, 1]];

export default function RootsCloseViz() {
  return (
    <SceneShell
      eyebrow="합이 지워지는 조건"
      title="네 화살표를 이었을 때 제자리로 돌아오면 합은 0입니다"
      description="한 눈금은 길이 1입니다. 복소수 덧셈은 화살표를 머리와 꼬리로 잇는 일이므로, 끝점이 합입니다. 색은 첫째부터 넷째 항의 순서입니다."
      ariaLabel="네 회전 방향의 합이 닫히거나 닫히지 않는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const end = scene.terms.reduce<readonly [number, number]>((sum, term) => [sum[0] + term[0], sum[1] + term[1]], [0, 0]);
        return (
          <Plane
            width={340}
            height={224}
            originX={110}
            originY={132}
            unit={46}
            xTicks={[-1, 1, 2, 3, 4]}
            yTicks={[-1, 1]}
            ariaLabel={`${scene.label}: ${scene.summary}`}
            render={(m) => (
              <g>
                {scene.circle && (
                  <g>
                    <circle cx={m.x(0)} cy={m.y(0)} r={m.unit} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.7} />
                    {POS.map((p, index) => (
                      <g key={index}>
                        <circle cx={m.x(p[0])} cy={m.y(p[1])} r={4.5} fill={COLORS[index]} />
                        <text x={m.x(p[0]) + (p[0] === 0 ? 12 : p[0] * 12)} y={m.y(p[1]) + (p[1] === 0 ? -8 : p[1] > 0 ? -2 : 16)} textAnchor={p[0] < 0 ? "end" : "start"} fontSize={12} fontWeight={700} fill={COLORS[index]}>
                          {index}: {NAMES[index]}
                        </text>
                      </g>
                    ))}
                  </g>
                )}
                {!scene.circle && <TipToTail map={m} terms={scene.terms} colors={COLORS} shift={active === 2 ? 5 : 0} />}
                {!scene.circle && (
                  <g>
                    <circle cx={m.x(end[0])} cy={m.y(end[1]) + (active === 2 ? 15 : 0)} r={4} fill="#ffffff" stroke="#0f172a" strokeWidth={1} />
                    <text x={m.x(end[0]) + (end[0] > 3 ? 4 : 8)} y={m.y(end[1]) + (active === 2 ? 28 : end[0] > 3 ? -12 : -8)} textAnchor={end[0] > 3 ? "end" : "start"} fontSize={13} fontWeight={700} fill="#64748b">끝점 = {scene.summary.split("합 ")[1]}</text>
                  </g>
                )}
              </g>
            )}
          />
        );
      }}
    />
  );
}
