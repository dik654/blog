import SceneShell from "./SceneShell";

/**
 * 본문 대응: #softmax-ce-gradient — z=(0,0,ln2) → 지수 (1,1,2) → ÷4 → Q=(1/4,1/4,1/2)
 * → 정답 A: Q−y=(−3/4,1/4,1/2) → 네 관측이 로짓을 공유할 때 평균 Q−P=(−1/4,0,1/4).
 */
const SCENES = [
  { label: "로짓", summary: "z = (0, 0, ln2)", values: [0, 0, Math.LN2], texts: ["0", "0", "ln2"], note: "로짓은 확률을 만들기 전의 실수 점수입니다. 아직 합이 1일 필요가 없습니다." },
  { label: "지수로 바꾸기", summary: "(1, 1, 2) · 합 4", values: [1, 1, 2], texts: ["1", "1", "2"], note: "각 로짓에 지수를 취합니다. e⁰=1이고 e^(ln2)=2여서 세 값은 모두 양수가 되고 합은 4입니다." },
  { label: "합으로 나누기", summary: "Q = (1/4, 1/4, 1/2)", values: [0.25, 0.25, 0.5], texts: ["1/4", "1/4", "1/2"], note: "합 4로 나누면 두 번째 표와 같은 확률이 나옵니다. 지수를 취한 뒤 합으로 나누는 이 정규화가 softmax입니다." },
  { label: "정답 A의 기울기", summary: "Q − (1,0,0) = (−3/4, 1/4, 1/2)", values: [-0.75, 0.25, 0.5], texts: ["−3/4", "1/4", "1/2"], note: "기울기는 로짓을 조금 올릴 때 비용이 변하는 정도입니다. 로짓을 기울기 반대쪽으로 직접 고치면(경사하강) A의 음수 기울기는 A 로짓을 올립니다. 공유 신경망 가중치를 바꿀 때는 그 가중치에서 로짓으로 이어지는 미분도 곱해야 합니다." },
  { label: "네 관측의 평균", summary: "Q − P = (−1/4, 0, 1/4)", values: [-0.25, 0, 0.25], texts: ["−1/4", "0", "1/4"], note: "네 관측이 같은 로짓을 공유한다고 가정하면 평균 기울기는 Q−P입니다. 각 행의 로짓이 별도 변수라면 행별 기울기에 1/4가 붙습니다." },
] as const;

const LETTERS = ["A", "B", "C"] as const;
const COL_X = [70, 180, 290] as const;
const ZERO_Y = 78;
const MAX_BAR = 54;

export default function SoftmaxPipelineViz() {
  return (
    <SceneShell
      eyebrow="로짓에서 기울기까지"
      title="세 로짓이 확률을 거쳐 기울기가 되는 길"
      description="글자마다 값 하나씩 다음 단계로 넘어갑니다. 막대 길이는 장면 안에서만 비교합니다. 값의 종류가 장면마다 다르기 때문입니다."
      ariaLabel="로짓 세 개가 지수와 정규화를 거쳐 확률이 되고 정답을 뺀 기울기가 되는 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const max = Math.max(...scene.values.map((value) => Math.abs(value)));
        return (
          <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LETTERS.map((letter, index) => {
              const value = scene.values[index];
              const size = (Math.abs(value) / max) * MAX_BAR;
              const positive = value >= 0;
              const color = active >= 3 ? (positive ? "#d97706" : "#16a34a") : "#2563eb";
              return (
                <g key={letter}>
                  {size > 0 && <rect x={COL_X[index] - 28} y={positive ? ZERO_Y - size : ZERO_Y} width={56} height={size} rx={2} fill={color} fillOpacity={0.55} />}
                  <text x={COL_X[index]} y={positive ? ZERO_Y - size - 6 : ZERO_Y + size + 16} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}>{scene.texts[index]}</text>
                  <text x={COL_X[index]} y={172} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{letter}</text>
                </g>
              );
            })}
            <line x1={20} x2={340} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
