import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-paper — 원문의 yᵢ·xⱼ와 이 글의 X·Z를 짝짓고 식 (6)·(7)에 숫자를 넣는다.
 * 식 (6): (−2/3)×2 = −4/3. 식 (7): (2/3)ln2 + (−2/3)×0 ≈ 0.462098.
 */
const OUT_Y: readonly number[] = [46, 126];

interface State {
  input: string;
  inputSub: string;
  edges: readonly { to: number; label: string; on: boolean }[];
  outs: readonly { top: string; value: string; on: boolean }[];
}

const STATES: readonly State[] = [
  {
    input: "yᵢ",
    inputSub: "이 글의 입력 X",
    edges: [{ to: 0, label: "wᵢⱼ = W", on: false }, { to: 1, label: "wᵢⱼ = W", on: false }],
    outs: [
      { top: "xⱼ · 이 글의 점수 Z", value: "뒤 기여 ∂E/∂xⱼ = G", on: false },
      { top: "xⱼ · 이 글의 점수 Z", value: "뒤 기여 ∂E/∂xⱼ = G", on: false },
    ],
  },
  {
    input: "yᵢ = 2",
    inputSub: "입력 둘째 칸",
    edges: [{ to: 0, label: "", on: false }, { to: 1, label: "gradient −4/3", on: true }],
    outs: [
      { top: "첫 점수", value: "", on: false },
      { top: "둘째 점수", value: "∂E/∂xⱼ = −2/3", on: true },
    ],
  },
  {
    input: "입력 1",
    inputSub: "첫 칸의 기여를 구함",
    edges: [{ to: 0, label: "w = ln2", on: true }, { to: 1, label: "w = 0", on: true }],
    outs: [
      { top: "첫 점수", value: "∂E/∂xⱼ = 2/3", on: true },
      { top: "둘째 점수", value: "∂E/∂xⱼ = −2/3", on: true },
    ],
  },
];

const SCENES = [
  { label: "같은 문자, 다른 자리", summary: "원문 y = 입력 · 원문 x = 점수", note: "원문의 yᵢ는 이전 단위의 출력이라 이 글의 입력 X에, xⱼ는 다음 단위의 합산 점수라 이 글의 Z에 해당합니다. 원문의 x를 이 글의 X로 읽으면 안 됩니다." },
  { label: "식 (6) · 선 하나", summary: "(−2/3) × 2 = −4/3", note: "∂E/∂wᵢⱼ = (∂E/∂xⱼ)yᵢ입니다. 선의 뒤쪽 기여에 앞쪽 값을 곱합니다. 8절 dW 둘째 행의 둘째 칸과 같은 값입니다." },
  { label: "식 (7) · 선을 모아 합", summary: "(2/3)ln2 + (−2/3)×0 ≈ 0.462098", note: "입력 쪽 기여는 Σⱼ(∂E/∂xⱼ)wᵢⱼ로 그 입력에서 나간 선을 모두 더합니다. 8절의 dX₁과 같은 값입니다. 원문은 sigmoid와 제곱 오차로 신호를 유도하고, 여기서는 softmax–cross-entropy의 G를 넣었습니다." },
];

export default function PaperNotationViz() {
  return (
    <SceneShell
      eyebrow="원문 기호 대조"
      title="원문의 y는 이 글의 입력, 원문의 x는 이 글의 점수입니다"
      description="왼쪽이 선의 앞쪽 값, 오른쪽이 선의 뒤쪽 점수입니다. 칠한 선이 이번 장면의 식이 쓰는 선입니다. 숫자는 이 글의 가정 사례입니다."
      ariaLabel="1986년 원문 기호와 이 글 기호의 대응, 식 6과 7의 대입"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox="0 0 360 156" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {state.edges.map((edge) => (
              <line key={edge.to} x1={100} y1={86} x2={212} y2={OUT_Y[edge.to]} stroke={edge.on ? "#dc2626" : "#94a3b8"} strokeWidth={edge.on ? 1.25 : 1} />
            ))}
            {state.edges.filter((edge) => edge.label !== "").map((edge) => {
              const ly = 86 + (OUT_Y[edge.to] - 86) * 0.5;
              return (
                <g key={`label-${edge.to}`}>
                  <rect x={114} y={ly - 9} width={84} height={18} rx={4} fill="#ffffff" stroke={edge.on ? "#dc2626" : "#cbd5e1"} strokeWidth={1} />
                  <text x={156} y={ly + 4} textAnchor="middle" fontSize={11} fontWeight={edge.on ? 700 : 400} fill="#0f172a">{edge.label}</text>
                </g>
              );
            })}
            <rect x={4} y={62} width={96} height={48} rx={8} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
            <text x={52} y={82} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">{state.input}</text>
            <text x={52} y={99} textAnchor="middle" fontSize={10.5} fill="#334155">{state.inputSub}</text>
            {state.outs.map((out, index) => (
              <g key={index}>
                <rect x={212} y={OUT_Y[index] - 24} width={144} height={48} rx={8} fill="#ffffff" stroke={out.on ? "#dc2626" : "#7c3aed"} strokeWidth={1} />
                <text x={284} y={OUT_Y[index] - 5} textAnchor="middle" fontSize={11} fill="#334155">{out.top}</text>
                <text x={284} y={OUT_Y[index] + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">{out.value}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
