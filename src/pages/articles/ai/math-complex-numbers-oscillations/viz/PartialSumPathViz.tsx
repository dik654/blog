import SceneShell from "./SceneShell";
import { Arrow, Plane } from "./Plane";

/**
 * 본문 대응: #euler-formula — z=iπ/2의 지수 급수. 항 (iπ/2)^m/m!의 방향은 1,i,−1,−i를 되풀이하고
 * 부분합 경로가 i로 다가간다. M=4: 약 0.019969+0.924832i(거리 0.077775), M=8: 약 0.0000247+0.999843i(거리 0.000159).
 */
const T = Math.PI / 2;
const FACT = [1, 1, 2, 6, 24, 120, 720, 5040, 40320] as const;
const DIRS: readonly (readonly [number, number])[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const TERMS = FACT.map((fact, m): readonly [number, number] => {
  const size = T ** m / fact;
  const dir = DIRS[m % 4];
  return [dir[0] * size, dir[1] * size];
});
const SUMS = TERMS.reduce<(readonly [number, number])[]>((acc, [dx, dy]) => {
  const [x, y] = acc[acc.length - 1];
  return [...acc, [x + dx, y + dy]];
}, [[0, 0]]);

const SCENES = [
  { label: "방향이 네 개뿐입니다", summary: "1 → i → −1 → −i → 1 …", M: 1, panel: "차수가 늘 때 방향", value: "오른쪽·위·왼쪽·아래", note: "m차 항은 (iπ/2)^m/m!입니다. i의 거듭제곱이 네 방향을 되풀이합니다. 그림은 0차와 1차까지입니다." },
  { label: "M = 3", summary: "약 −0.2337 + 0.9248i", M: 3, panel: "0~3차의 합", value: "−0.2337 + 0.9248i", note: "분모의 팩토리얼 때문에 뒤로 갈수록 화살표가 빠르게 짧아집니다. 경로는 안쪽으로 말려 들어갑니다." },
  { label: "M = 4", summary: "약 0.019969 + 0.924832i", M: 4, panel: "i까지 거리", value: "약 0.077775", note: "4차까지 더하면 정확한 i에서 약 0.078 떨어져 있습니다. 유한한 합의 길이는 정확히 1이라고 보장되지 않습니다." },
  { label: "M = 8", summary: "약 0.0000247 + 0.9998431i", M: 8, panel: "i까지 거리", value: "약 0.000159", note: "8차까지 더하면 그림에서는 i와 구별되지 않습니다. 그래도 합이 유한하면 아직 정확한 i는 아닙니다." },
  { label: "짝수·홀수로 모으면", summary: "cos(π/2) = 0 · sin(π/2) = 1", M: 8, panel: "모은 결과", value: "가로 0 · 세로 1", note: "가로로 놓인 짝수 항은 코사인, 세로로 놓인 홀수 항은 i를 곱한 사인의 급수입니다. 절대수렴하므로 따로 모아도 합이 같고, 극한은 0+1·i=i입니다." },
] as const;

const COLORS: readonly string[] = ["#2563eb", "#d97706"];

export default function PartialSumPathViz() {
  return (
    <SceneShell
      eyebrow="급수가 회전이 되는 자리"
      title="항을 이어 붙이면 경로가 i로 말려 들어갑니다"
      description="지수 급수에 z=iπ/2를 넣고 항을 머리와 꼬리로 이었습니다. 파랑은 짝수 차수 항, 노랑은 홀수 차수 항입니다. M은 어느 차수까지 더했는지이고, 표시한 점 i는 1/4바퀴 회전의 답입니다."
      ariaLabel="지수 급수 부분합이 i로 다가가는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const final = active === 4;
        return (
          <Plane
            width={350}
            height={224}
            originX={110}
            originY={196}
            unit={110}
            xTicks={[1]}
            yTicks={[]}
            xLabel=""
            yLabel=""
            ariaLabel={`${scene.label}: ${scene.summary}`}
            render={(m) => (
              <g>
                {TERMS.slice(0, scene.M + 1).map((_, index) => (
                  <Arrow
                    key={index}
                    x1={m.x(SUMS[index][0])}
                    y1={m.y(SUMS[index][1])}
                    x2={m.x(SUMS[index + 1][0])}
                    y2={m.y(SUMS[index + 1][1])}
                    color={COLORS[index % 2]}
                    opacity={final ? 0.3 : 1}
                  />
                ))}
                {final && (
                  <g>
                    <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(0)} y2={m.y(1)} color="#d97706" />
                  </g>
                )}
                <circle cx={m.x(0)} cy={m.y(1)} r={4.5} fill="none" stroke="#dc2626" strokeWidth={1} />
                <text x={m.x(0) - 8} y={m.y(1) - 8} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">i</text>
                <text x={236} y={70} fontSize={12} fill="#64748b">{scene.panel}</text>
                <text x={236} y={90} fontSize={scene.value.length > 15 ? 11 : 13} fontWeight={700} fill="#2563eb">{scene.value}</text>
              </g>
            )}
          />
        );
      }}
    />
  );
}
