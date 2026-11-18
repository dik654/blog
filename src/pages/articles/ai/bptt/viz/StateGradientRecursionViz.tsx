import SceneShell from "./SceneShell";

/**
 * 본문 대응: 첫 ExplainedFormula — δₜ = ∂ℓₜ/∂hₜ + J_{t+1}ᵀ δ_{t+1}.
 * 네 시점(T=4, 가정)으로 펼친 graph에서 sequence 끝부터 거꾸로 δ를 채웁니다.
 * 각 δₜ는 직접 경로(ℓₜ → hₜ)와 미래 경로(h_{t+1} → hₜ) 두 개를 더합니다.
 */
const XS = [48, 136, 224, 312] as const;
const H_Y = 128;
const L_Y = 40;
const SUB = ["₁", "₂", "₃", "₄"] as const;

const RED = "#dc2626";
const BLUE = "#2563eb";
const GREY = "#94a3b8";
const FAINT = "#cbd5e1";

const SCENES = [
  {
    label: "끝 시점에서 시작",
    summary: "δ₄ = ∂ℓ₄/∂h₄",
    note: "Sequence 끝(여기서는 T=4, 가정)의 h₄ 뒤에는 다음 state가 없습니다. 그래서 δ₄는 ℓ₄에서 바로 오는 직접 경로 하나뿐입니다.",
  },
  {
    label: "한 칸 앞으로",
    summary: "δ₃ = ∂ℓ₃/∂h₃ + J₄ᵀδ₄",
    note: "h₃는 ℓ₃에 직접 쓰였고, h₄를 거쳐 ℓ₄에도 영향을 줬습니다. J₄=∂h₄/∂h₃의 transpose로 이미 구한 δ₄를 되돌려 직접 경로에 더합니다.",
  },
  {
    label: "앞 결과를 재사용",
    summary: "δ₂ = ∂ℓ₂/∂h₂ + J₃ᵀδ₃",
    note: "δ₃ 안에 ℓ₃와 ℓ₄의 책임이 이미 들어 있습니다. 그래서 덧셈 한 번으로 h₂는 ℓ₂·ℓ₃·ℓ₄ 세 loss의 책임을 받습니다.",
  },
  {
    label: "처음 state까지",
    summary: "δ₁ = ∂ℓ₁/∂h₁ + J₂ᵀδ₂",
    note: "역방향으로 한 번 훑으면 δ₁에는 ℓ₁부터 ℓ₄까지 네 loss가 모두 들어갑니다. ℓ₄의 책임은 J₄ᵀ, J₃ᵀ, J₂ᵀ를 차례로 지나 h₁에 닿습니다.",
  },
] as const;

function Arrowheads() {
  return (
    <defs>
      {[
        ["sgr-red", RED],
        ["sgr-blue", BLUE],
        ["sgr-grey", GREY],
        ["sgr-faint", FAINT],
      ].map(([id, color]) => (
        <marker key={id} id={id} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill={color} />
        </marker>
      ))}
    </defs>
  );
}

export default function StateGradientRecursionViz() {
  return (
    <SceneShell
      eyebrow="δ를 끝에서부터 채웁니다"
      title="각 state의 책임은 직접 경로와 다음 state에서 돌아온 경로의 합입니다"
      description="네 시점으로 펼친 graph입니다(T=4는 가정). 회색 화살표는 forward 계산, 빨간 선은 이번 단계에서 더하는 두 경로, 파란 선은 이미 계산을 마친 경로입니다. δₜ는 전체 loss가 hₜ에 얼마나 민감한지를 뜻합니다."
      ariaLabel="네 시점으로 펼친 RNN에서 state gradient delta를 끝 시점부터 거꾸로 계산하는 순서"
      scenes={SCENES}
      render={(active) => {
        const current = 3 - active;
        const stateOf = (index: number) => (index === current ? "now" : index > current ? "done" : "todo");
        const colorOf = (index: number) => {
          const state = stateOf(index);
          return state === "now" ? RED : state === "done" ? BLUE : FAINT;
        };
        const markerOf = (index: number) => {
          const state = stateOf(index);
          return state === "now" ? "url(#sgr-red)" : state === "done" ? "url(#sgr-blue)" : "url(#sgr-faint)";
        };
        const losses = SUB.slice(current).map((sub) => `ℓ${sub}`).join(" · ");
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].summary}. δ${SUB[current]}에 담긴 loss: ${losses}`}>
            <Arrowheads />
            <text x={180} y={14} textAnchor="middle" fontSize={13} fill="#475569">
              {`δ${SUB[current]}에 담긴 loss: ${losses}`}
            </text>
            {XS.slice(0, 3).map((x, index) => (
              <line key={`f-${x}`} x1={x + 23} y1={H_Y} x2={XS[index + 1] - 25} y2={H_Y} stroke={GREY} strokeWidth={1} markerEnd="url(#sgr-grey)" />
            ))}
            {XS.map((x, index) => {
              const color = colorOf(index);
              const lossIncluded = index >= current;
              return (
                <g key={`n-${x}`}>
                  <rect x={x - 18} y={L_Y - 12} width={36} height={24} rx={4} fill="#ffffff" stroke={lossIncluded ? BLUE : FAINT} strokeWidth={lossIncluded ? 1.25 : 1} />
                  <text x={x} y={L_Y + 4} textAnchor="middle" fontSize={14} fill={lossIncluded ? "#1e3a8a" : "#94a3b8"}>{`ℓ${SUB[index]}`}</text>
                  <line x1={x} y1={L_Y + 13} x2={x} y2={H_Y - 21} stroke={color} strokeWidth={stateOf(index) === "now" ? 1.25 : 1} markerEnd={markerOf(index)} />
                  <rect x={x - 22} y={H_Y - 18} width={44} height={36} rx={4} fill="#ffffff" stroke={stateOf(index) === "todo" ? GREY : color} strokeWidth={stateOf(index) === "now" ? 1.25 : 1} />
                  <text x={x} y={H_Y - 3} textAnchor="middle" fontSize={14} fill="#0f172a">{`h${SUB[index]}`}</text>
                  <text x={x} y={H_Y + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={stateOf(index) === "todo" ? "#94a3b8" : color}>
                    {stateOf(index) === "todo" ? "δ 대기" : `δ${SUB[index]}`}
                  </text>
                </g>
              );
            })}
            {XS.slice(0, 3).map((x, index) => {
              const next = XS[index + 1];
              const color = colorOf(index);
              const mid = (x + next) / 2;
              return (
                <g key={`b-${x}`}>
                  <path d={`M ${next - 8} ${H_Y + 19} Q ${mid} ${H_Y + 50} ${x + 8} ${H_Y + 21}`} fill="none" stroke={color} strokeWidth={stateOf(index) === "now" ? 1.25 : 1} markerEnd={markerOf(index)} />
                  <text x={mid} y={H_Y + 60} textAnchor="middle" fontSize={12} fill={stateOf(index) === "todo" ? "#94a3b8" : color}>{`J${SUB[index + 1]}ᵀ`}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
