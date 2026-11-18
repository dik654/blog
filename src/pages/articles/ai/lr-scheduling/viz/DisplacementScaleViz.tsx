import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schedule-function — Δₜ = −ηₜuₜ, θₜ₊₁ = θₜ + Δₜ.
 * 평면은 parameter 공간을 둘로 줄여 그린 개념도입니다. u의 방향·길이와 η 값은
 * 모양을 보이려고 고른 가정이며 본문에 수치가 없습니다.
 */
const ORIGIN = { x: 190, y: 112 } as const;
const U_A = { x: 110, y: -48 } as const;
const U_B = { x: -50, y: -70 } as const;
const ETA_HIGH = 0.8;
const ETA_LOW = 0.4;

const SCENES = [
  {
    label: "optimizer가 방향 uₜ를 냅니다",
    summary: "uₜ",
    note: "SGD라면 gradient, Adam이라면 preconditioned direction이 uₜ입니다. 아직 parameter는 θₜ에 있습니다.",
  },
  {
    label: "부호를 뒤집고 ηₜ배로 줄입니다",
    summary: "Δₜ = −ηₜuₜ",
    note: "Δₜ는 uₜ와 같은 직선에서 반대쪽을 향하고 길이는 ηₜ가 정합니다. 끝점이 다음 parameter θ(t+1)입니다. ηₜ 값과 길이는 가정입니다.",
  },
  {
    label: "ηₜ만 낮추면 길이만 바뀝니다",
    summary: "방향 그대로 · 크기 변화",
    note: "ηₜ를 낮추면 화살표가 짧아질 뿐 방향은 같습니다(점선은 앞 장면의 Δₜ). scheduler가 바꾸는 것은 scale입니다.",
  },
  {
    label: "같은 ηₜ, 다른 uₜ",
    summary: "Δₜ가 달라집니다",
    note: "ηₜ=0.8 그대로 uₜ만 바꾸면 Δₜ의 방향과 길이가 함께 달라집니다(점선은 두 번째 장면의 uₜ와 Δₜ). 그래서 LR trace와 displacement trace를 함께 봅니다.",
  },
] as const;

function Arrow({
  dx,
  dy,
  color,
  dashed = false,
  markerId,
}: {
  dx: number;
  dy: number;
  color: string;
  dashed?: boolean;
  markerId: string;
}) {
  return (
    <line
      x1={ORIGIN.x}
      y1={ORIGIN.y}
      x2={ORIGIN.x + dx}
      y2={ORIGIN.y + dy}
      stroke={color}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={`url(#${markerId})`}
    />
  );
}

export default function DisplacementScaleViz() {
  return (
    <SceneShell
      eyebrow="direction과 scale"
      title="Learning rate는 화살표의 방향이 아니라 길이를 바꿉니다"
      description="parameter 공간을 평면 둘로 줄인 개념도입니다. 회색은 optimizer direction uₜ, 파랑은 실제 이동량 Δₜ이며 길이와 각도는 가정입니다."
      ariaLabel="optimizer direction에 learning rate를 곱해 parameter 이동량을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const eta = active === 2 ? ETA_LOW : ETA_HIGH;
        const u = active === 3 ? U_B : U_A;
        const delta = { x: -eta * u.x, y: -eta * u.y };
        const next = { x: ORIGIN.x + delta.x, y: ORIGIN.y + delta.y };
        const len = Math.hypot(delta.x, delta.y);
        const flip = delta.x / len > 0 ? -1 : 1;
        const normal = { x: (flip * -delta.y) / len, y: (flip * delta.x) / len };
        const labelAt = {
          x: ORIGIN.x + delta.x / 2 + normal.x * 10,
          y: ORIGIN.y + delta.y / 2 + normal.y * 10,
          anchor: normal.x < 0 ? ("end" as const) : ("start" as const),
        };
        return (
          <svg
            viewBox="0 0 360 210"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
            className="mx-auto block h-auto w-full max-w-[520px] text-foreground"
          >
            <defs>
              <marker id="dsv-gray" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#64748b" />
              </marker>
              <marker id="dsv-blue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#2563eb" />
              </marker>
              <marker id="dsv-faint" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
              </marker>
            </defs>
            <rect x="8" y="8" width="344" height="194" rx="8" fill="none" stroke="#cbd5e1" strokeWidth={1} />
            {active === 2 && (
              <Arrow dx={-ETA_HIGH * U_A.x} dy={-ETA_HIGH * U_A.y} color="#94a3b8" dashed markerId="dsv-faint" />
            )}
            {active === 3 && (
              <>
                <Arrow dx={U_A.x} dy={U_A.y} color="#cbd5e1" dashed markerId="dsv-faint" />
                <Arrow dx={-ETA_HIGH * U_A.x} dy={-ETA_HIGH * U_A.y} color="#94a3b8" dashed markerId="dsv-faint" />
              </>
            )}
            <Arrow dx={u.x} dy={u.y} color="#64748b" markerId="dsv-gray" />
            <text
              x={ORIGIN.x + u.x + (u.x >= 0 ? 6 : -6)}
              y={ORIGIN.y + u.y - 4}
              textAnchor={u.x >= 0 ? "start" : "end"}
              className="text-[17px] sm:text-[12px]"
              fontWeight={700}
              fill="#64748b"
            >
              {active === 3 ? "다른 uₜ" : "uₜ"}
            </text>
            {active >= 1 && (
              <>
                <Arrow dx={delta.x} dy={delta.y} color="#2563eb" markerId="dsv-blue" />
                <circle cx={next.x} cy={next.y} r={4} fill="#2563eb" />
                <text
                  x={next.x + 6}
                  y={next.y + 20}
                  className="text-[16px] sm:text-[11px]"
                  fontWeight={700}
                  fill="#2563eb"
                >
                  θ<tspan baselineShift="sub" className="text-[13px] sm:text-[8px]">t+1</tspan>
                </text>
                <text
                  x={labelAt.x}
                  y={labelAt.y}
                  textAnchor={labelAt.anchor}
                  className="text-[16px] sm:text-[11px]"
                  fill="#2563eb"
                >
                  {`Δₜ (ηₜ=${eta}, 가정)`}
                </text>
              </>
            )}
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={4.5} fill="currentColor" />
            <text x={ORIGIN.x + 8} y={active === 3 ? ORIGIN.y - 8 : ORIGIN.y + 16} className="text-[16px] sm:text-[11px]" fontWeight={700} fill="currentColor">
              θₜ
            </text>
          </svg>
        );
      }}
    />
  );
}
