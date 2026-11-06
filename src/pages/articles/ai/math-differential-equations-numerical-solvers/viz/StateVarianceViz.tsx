import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #noise-variance — vₙ₊₁=.75²vₙ+.01, v₀=0. v₁=.01, v₂=.5625×.01+.01=.015625. 원시 잡음의 합 .02.
 */
const SCENES = [
  { label: "첫 잡음", summary: "v₁ = 0.01", note: "확정된 시작값에서 v₀=0입니다. 한 단계 뒤의 분산은 새 잡음 0.1ε의 분산 0.01뿐입니다." },
  { label: "감소를 거침", summary: "0.01 × 0.75² = 0.005625", note: "다음 단계에서 현재 값에 0.75를 곱하므로 첫 잡음의 영향이 0.75배가 됩니다. 값이 0.75배이면 분산은 0.75²=0.5625배입니다." },
  { label: "둘째 잡음", summary: "v₂ = 0.005625 + 0.01 = 0.015625", note: "새 잡음은 과거와 독립이므로 분산이 그대로 더해져 0.015625입니다. 원시 잡음의 분산을 그냥 더한 0.02보다 작습니다." },
] as const;

const X0 = 12;
const px = (value: number) => (value / 0.02) * 300;

function Row({ y, title, children }: { y: number; title: string; children: ReactNode }) {
  return (
    <g>
      <text x={X0} y={y - 6} fontSize={12.5} fontWeight={700} fill="#64748b">{title}</text>
      {children}
    </g>
  );
}

export default function StateVarianceViz() {
  return (
    <SceneShell
      eyebrow="상태의 분산"
      title="앞에서 들어온 잡음은 감소를 거치며 작아진 채로 쌓입니다"
      description="h=0.25, g=0.2의 수치 반복 xₙ₊₁=0.75xₙ+0.1εₙ입니다. vₙ은 n단계 뒤 상태의 분산이고 막대는 모두 같은 눈금입니다."
      ariaLabel="두 단계에 걸친 상태 분산의 누적"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 348 168" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Row y={20} title="한 단계 뒤 v₁">
            <rect x={X0} y={20} width={px(0.01)} height={18} rx={2} fill="#2563eb" />
            <text x={X0 + px(0.01) + 6} y={33} fontSize={12} fontWeight={700} fill="#2563eb">0.01</text>
          </Row>
          {active >= 1 && (
            <Row y={72} title="첫 잡음 몫이 다음 단계로">
              <rect x={X0} y={72} width={px(0.01)} height={18} rx={2} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
              <rect x={X0} y={72} width={px(0.005625)} height={18} rx={2} fill="#2563eb" opacity={0.75} />
              <text x={X0 + px(0.01) + 6} y={85} fontSize={12} fontWeight={700} fill="#2563eb">0.005625</text>
            </Row>
          )}
          {active >= 2 && (
            <Row y={124} title="두 단계 뒤 v₂">
              <rect x={X0} y={124} width={px(0.005625)} height={18} fill="#2563eb" opacity={0.75} />
              <rect x={X0 + px(0.005625)} y={124} width={px(0.01)} height={18} fill="#d97706" />
              <line x1={X0 + px(0.02)} x2={X0 + px(0.02)} y1={118} y2={146} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
              <text x={X0} y={158} fontSize={12} fontWeight={700} fill="#d97706">0.015625 (새 잡음 0.01 포함)</text>
              <text x={X0 + px(0.02)} y={158} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">그냥 합 0.02</text>
            </Row>
          )}
        </svg>
      )}
    />
  );
}
