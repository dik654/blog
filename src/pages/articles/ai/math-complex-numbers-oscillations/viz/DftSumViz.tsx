import SceneShell from "./SceneShell";
import { Plane, TipToTail } from "./Plane";

/**
 * 본문 대응: #applications — zₙ=(3+4i)iⁿ, Xₖ=Σ zₙ(−i)^{kn}. k=1은 (3,4)×4=12+16i, 나머지는 0.
 * |X₁|=20, 20÷4=5.
 */
type Term = readonly [number, number];
const times = ([a, b]: Term, [c, d]: Term): Term => [a * c - b * d, a * d + b * c];
const STEP: readonly Term[] = [[1, 0], [0, -1], [-1, 0], [0, 1]];
const POINTS: readonly Term[] = [[3, 4], [-4, 3], [-3, -4], [4, -3]];
const termsFor = (k: number): readonly Term[] => POINTS.map((p, n) => times(p, STEP[(k * n) % 4]));

const SCENES = [
  { label: "k = 0", summary: "X₀ = 0", k: 0, note: "되감지 않고 그대로 더합니다. 네 항이 차례로 1/4바퀴씩 꺾여 있어 경로가 원점으로 돌아오고 합이 지워집니다." },
  { label: "k = 1", summary: "X₁ = 12 + 16i", k: 1, note: "iⁿ(−i)ⁿ=1이라 네 항이 모두 3+4i로 돌아옵니다. 같은 방향으로 네 번 쌓여 지워지지 않습니다." },
  { label: "k = 2", summary: "X₂ = 0", k: 2, note: "되감는 양이 회전과 맞지 않아 앞 절의 네 방향 합처럼 지워집니다." },
  { label: "k = 3", summary: "X₃ = 0", k: 3, note: "3+4i와 그 반대 방향을 번갈아 갑니다. 화살표가 겹치지 않도록 조금씩 어긋나게 그렸습니다. 끝점은 원점입니다." },
  { label: "크기 읽기", summary: "|X₁| = 20 → 20 ÷ 4 = 5", k: 1, note: "X₁의 크기는 20으로 반지름 5와 바로 같지 않습니다. 이 변환은 네 항을 더하고 N으로 나누지 않았으니, 4로 나눠야 복소 회전의 크기 5가 나옵니다." },
] as const;

const COLORS: readonly string[] = ["#2563eb", "#d97706", "#16a34a", "#dc2626"];
const LIST = ["X₀ = 0", "X₁ = 12+16i", "X₂ = 0", "X₃ = 0"] as const;

export default function DftSumViz() {
  return (
    <SceneShell
      eyebrow="이산 푸리에 변환"
      title="되감는 방향이 맞는 번호에서만 네 점이 한 방향으로 쌓입니다"
      description="네 점 (3,4), (−4,3), (−3,−4), (4,−3)에 k번 회전을 되감는 값을 곱해 머리와 꼬리로 이었습니다. 끝점이 Xₖ입니다. 색은 n=0, 1, 2, 3 순서입니다."
      ariaLabel="네 회전 성분마다 네 항을 이은 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const terms = termsFor(scene.k);
        return (
          <Plane
            width={350}
            height={236}
            originX={70}
            originY={160}
            unit={9}
            xTicks={[4, 8, 12]}
            yTicks={[8, 16]}
            xLabel=""
            yLabel=""
            ariaLabel={`${scene.label}: ${scene.summary}`}
            render={(m) => (
              <g>
                <TipToTail map={m} terms={terms} colors={COLORS} shift={scene.k === 3 ? 6 : 0} />
                {scene.k === 1 && <text x={m.x(12) + 6} y={m.y(16) + 12} fontSize={12} fontWeight={700} fill="#dc2626">12+16i</text>}
                {scene.k !== 1 && <circle cx={m.x(0)} cy={m.y(0) + (scene.k === 3 ? 18 : 0)} r={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />}
                {active === 4 && (
                  <g>
                    <text x={m.x(6) + 8} y={m.y(8) + 16} fontSize={12} fontWeight={700} fill="#64748b">길이 5 × 4 = 20</text>
                  </g>
                )}
                {LIST.map((text, index) => (
                  <text key={text} x={232} y={40 + index * 18} fontSize={12} fontWeight={index === scene.k ? 700 : 400} fill={index === scene.k ? "#2563eb" : "#64748b"}>{text}</text>
                ))}
              </g>
            )}
          />
        );
      }}
    />
  );
}
