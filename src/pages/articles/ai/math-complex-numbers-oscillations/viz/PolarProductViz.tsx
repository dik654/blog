import SceneShell from "./SceneShell";
import { Arrow, Plane } from "./Plane";

/**
 * 본문 대응: #euler-formula — (2e^{iπ/3})(3e^{−iπ/6})=6e^{iπ/6}=3√3+3i.
 * 사례: 5e^{iφ}·1e^{iπ/2} → 길이 5, 각도 φ+π/2, 곧 −4+3i.
 */
const pol = (r: number, a: number) => [r * Math.cos(a), r * Math.sin(a)] as const;
const A = pol(2, Math.PI / 3);
const B = pol(3, -Math.PI / 6);
const P = pol(6, Math.PI / 6);

const SCENES = [
  { label: "첫 번째 수", summary: "크기 2 · 각도 π/3", note: "가로축에서 반시계로 π/3 돈 방향에 길이 2인 화살표입니다." },
  { label: "두 번째 수", summary: "크기 3 · 각도 −π/6", note: "각도가 음수이니 시계 방향으로 π/6 돈 방향에 길이 3인 화살표입니다." },
  { label: "곱하면", summary: "크기 2×3=6 · 각도 π/3−π/6=π/6", note: "길이는 곱하고 각도는 더합니다. 결과는 6e^(iπ/6), 좌표로 3√3+3i입니다." },
  { label: "사례의 점에 i를 곱하면", summary: "크기 5×1=5 · 각도 φ+π/2", note: "3+4i는 크기 5, 각도 φ입니다. i는 크기 1, 각도 π/2입니다. 길이 5는 그대로이고 방향만 π/2 늘어 −4+3i가 됩니다." },
] as const;

export default function PolarProductViz() {
  return (
    <SceneShell
      eyebrow="곱셈의 두 동작"
      title="곱하면 길이는 곱해지고 각도는 더해집니다"
      description="파랑과 노랑이 곱하는 두 수, 빨강이 곱한 결과입니다. 이어지는 식의 숫자를 그대로 그렸습니다."
      ariaLabel="두 복소수의 곱에서 크기와 각도가 합쳐지는 과정"
      scenes={SCENES}
      render={(active) => (
        <Plane
          width={340}
          height={230}
          originX={150}
          originY={150}
          unit={28}
          xTicks={[-4, -2, 2, 4]}
          yTicks={[-2, 2, 4]}
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
          render={(m) => {
            const to = (p: readonly [number, number], color: string) => <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(p[0])} y2={m.y(p[1])} color={color} />;
            if (active === 3) {
              return (
                <g>
                  {to([3, 4], "#2563eb")}
                  <text x={m.x(3) + 6} y={m.y(4) + 4} fontSize={12} fontWeight={700} fill="#2563eb">3+4i</text>
                  {to([0, 1], "#d97706")}
                  <text x={m.x(0) + 8} y={m.y(1) + 4} fontSize={12} fontWeight={700} fill="#d97706">i</text>
                  {to([-4, 3], "#dc2626")}
                  <text x={m.x(-4)} y={m.y(3) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">−4+3i</text>
                </g>
              );
            }
            return (
              <g>
                {to(A, "#2563eb")}
                <text x={m.x(A[0]) + 2} y={m.y(A[1]) - 8} fontSize={12} fontWeight={700} fill="#2563eb">2e^(iπ/3)</text>
                {active >= 1 && to(B, "#d97706")}
                {active >= 1 && <text x={m.x(B[0]) + 4} y={m.y(B[1]) + 16} fontSize={12} fontWeight={700} fill="#d97706">3e^(−iπ/6)</text>}
                {active === 2 && to(P, "#dc2626")}
                {active === 2 && <text x={m.x(P[0]) - 2} y={m.y(P[1]) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">6e^(iπ/6)</text>}
              </g>
            );
          }}
        />
      )}
    />
  );
}
