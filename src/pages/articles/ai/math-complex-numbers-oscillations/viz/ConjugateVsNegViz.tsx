import SceneShell from "./SceneShell";
import { Arrow, Plane } from "./Plane";

/**
 * 본문 대응: #complex-plane — z=3+4i, iz=−4+3i, 두 번 돌린 −z=−3−4i, 켤레 z̄=3−4i.
 */
const SCENES = [
  { label: "z = 3 + 4i", summary: "실수부 3 · 허수부 4", note: "가로 좌표가 실수부, 세로 좌표가 허수부입니다. 허수부는 4이지 4i가 아닙니다." },
  { label: "i를 한 번 곱하면", summary: "iz = −4 + 3i", note: "규칙 (a,b)→(−b,a)가 곱셈 한 번으로 나옵니다. 네 번 곱하면 i⁴=1 때문에 처음 값입니다." },
  { label: "i를 두 번 곱하면", summary: "−z = −3 − 4i", note: "두 번의 1/4바퀴는 원점의 반대편입니다. 두 좌표의 부호가 모두 바뀝니다." },
  { label: "켤레", summary: "z̄ = 3 − 4i", note: "켤레는 허수부의 부호만 바꾼 수입니다. 가로축에 비춘 반사라서 −z와 다른 점이고, 모든 점에 같은 각도를 더하는 회전이 아닙니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";

export default function ConjugateVsNegViz() {
  return (
    <SceneShell
      eyebrow="평면 위의 복소수"
      title="두 번 돌린 점과 켤레는 다른 자리에 있습니다"
      description="가로 3, 세로 4인 점을 3+4i로 적었습니다. 곱셈과 부호 바꾸기가 평면에서 어디로 옮기는지 봅니다."
      ariaLabel="복소수와 i를 곱한 값, 부호 반전, 켤레의 위치"
      scenes={SCENES}
      render={(active) => (
        <Plane
          width={300}
          height={270}
          originX={150}
          originY={135}
          unit={22}
          xTicks={[-4, -2, 2, 4]}
          yTicks={[-4, -2, 2, 4]}
          xLabel="실수부"
          yLabel="허수부"
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
          maxWidth="max-w-[270px] sm:max-w-[420px]"
          render={(m) => (
            <g>
              <circle cx={m.x(0)} cy={m.y(0)} r={5 * m.unit} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
              <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(3)} y2={m.y(4)} color={BLUE} />
              <text x={m.x(3) + 6} y={m.y(4) - 6} fontSize={12} fontWeight={700} fill={BLUE}>3+4i</text>
              {active === 0 && (
                <g>
                  <line x1={m.x(3)} x2={m.x(3)} y1={m.y(0)} y2={m.y(4)} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />
                  <line x1={m.x(0)} x2={m.x(3)} y1={m.y(4)} y2={m.y(4)} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />
                </g>
              )}
              {active === 1 && (
                <g>
                  <path d={`M${m.x(3)} ${m.y(4)}A${5 * m.unit} ${5 * m.unit} 0 0 0 ${m.x(-4)} ${m.y(3)}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
                  <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(-4)} y2={m.y(3)} color={AMBER} />
                  <text x={m.x(-4) - 8} y={m.y(3) - 2} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>−4+3i</text>
                </g>
              )}
              {active === 2 && (
                <g>
                  <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(-3)} y2={m.y(-4)} color={AMBER} />
                  <text x={m.x(-3)} y={m.y(-4) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>−3−4i</text>
                  <path d={`M${m.x(3)} ${m.y(4)}A${5 * m.unit} ${5 * m.unit} 0 0 0 ${m.x(-3)} ${m.y(-4)}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
                </g>
              )}
              {active === 3 && (
                <g>
                  <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(-3)} y2={m.y(-4)} color="#94a3b8" />
                  <text x={m.x(-3)} y={m.y(-4) + 16} textAnchor="middle" fontSize={12} fill="#64748b">−3−4i</text>
                  <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(3)} y2={m.y(-4)} color={RED} />
                  <text x={m.x(3)} y={m.y(-4) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>3−4i</text>
                  <line x1={m.x(3)} x2={m.x(3)} y1={m.y(4)} y2={m.y(-4)} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                </g>
              )}
            </g>
          )}
        />
      )}
    />
  );
}
