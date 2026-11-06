import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 입력 두 개와 공유 곱셈 값 네 개가 두 점수를 만드는 배선.
 * 입력 1에 붙은 값 +0.001 → 둘째 점수 +0.001, 입력 2에 붙은 값 +0.001 → 둘째 점수 +0.002.
 * 둘째 점수 0.002일 때 오차 1.097279, 차분 ≈ −1.332889 (본문 값).
 */
const IN_Y: readonly number[] = [50, 140];
const OUT_Y: readonly number[] = [50, 140];
const IN_X = 72;
const OUT_X = 230;
const LABEL_T = 0.3;

interface State {
  w: readonly (readonly string[])[];
  focus: readonly [number, number] | null;
  score2: string;
  calc2: string;
}

const STATES: readonly State[] = [
  { w: [["ln2", "0"], ["0", "0"]], focus: null, score2: "0", calc2: "1×0 + 2×0" },
  { w: [["ln2", "0.001"], ["0", "0"]], focus: [0, 1], score2: "0.001", calc2: "1×0.001 + 2×0" },
  { w: [["ln2", "0"], ["0", "0.001"]], focus: [1, 1], score2: "0.002", calc2: "1×0 + 2×0.001" },
  { w: [["ln2", "0"], ["0", "0.001"]], focus: [1, 1], score2: "0.002", calc2: "1×0 + 2×0.001" },
];

const SCENES = [
  { label: "네 곱셈 값의 배선", summary: "첫 점수 ln2 · 둘째 점수 0", note: "입력마다 두 점수로 가는 선이 하나씩 있어 곱셈 값은 네 개입니다. 점수는 들어오는 선의 입력×곱셈 값을 더한 값이고, 그 뒤에 추가로 더하는 값은 0입니다." },
  { label: "입력 1에 붙은 값을 0.001 늘림", summary: "둘째 점수 +0.001", note: "둘째 점수로 가는 선 중 입력 1에서 오는 값만 바꿨습니다. 입력이 1이라서 바꾼 폭이 그대로 점수에 더해집니다." },
  { label: "입력 2에 붙은 값을 0.001 늘림", summary: "둘째 점수 +0.002", note: "같은 폭을 바꿨지만 이 선에는 입력 2가 곱해져서 점수가 두 배 움직입니다. 오차가 하나여도 곱셈 값마다 민감도가 다른 이유입니다." },
  { label: "오차로 확인", summary: "변화율 ≈ −1.332889", note: "둘째 점수가 0.002이면 오차는 1.098612에서 약 1.097279로 내려갑니다. 반올림 전 값으로 차이를 0.001로 나누면 약 −1.332889이고, 음수는 이 값을 늘리면 오차가 줄어든다는 뜻입니다. 뒤에서 구할 정확한 값 −4/3에 가깝습니다." },
];

export default function ScoreWiringViz() {
  return (
    <SceneShell
      eyebrow="곱셈 값의 배선"
      title="같은 0.001이라도 어느 입력에 붙었는지에 따라 점수가 다르게 움직입니다"
      description="왼쪽이 이번 자료의 입력 (1, 2), 오른쪽이 두 선택지의 점수이고 선 위의 숫자가 공유 곱셈 값입니다(가정). 칠한 선이 이번 장면에서 바꾼 값입니다."
      ariaLabel="입력과 공유 곱셈 값이 두 점수를 만드는 배선과 작은 변화의 효과"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {IN_Y.map((y1, row) =>
              OUT_Y.map((y2, col) => {
                const on = state.focus !== null && state.focus[0] === row && state.focus[1] === col;
                return <line key={`${row}-${col}`} x1={IN_X} y1={y1} x2={OUT_X} y2={y2} stroke={on ? "#dc2626" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />;
              }),
            )}
            {IN_Y.map((y1, row) =>
              OUT_Y.map((y2, col) => {
                const on = state.focus !== null && state.focus[0] === row && state.focus[1] === col;
                const lx = IN_X + (OUT_X - IN_X) * LABEL_T;
                const ly = y1 + (y2 - y1) * LABEL_T;
                return (
                  <g key={`label-${row}-${col}`}>
                    <rect x={lx - 20} y={ly - 9} width={40} height={18} rx={4} fill={on ? "#fee2e2" : "#ffffff"} stroke={on ? "#dc2626" : "#cbd5e1"} strokeWidth={1} />
                    <text x={lx} y={ly + 4} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill="#0f172a">{state.w[row][col]}</text>
                  </g>
                );
              }),
            )}
            {IN_Y.map((y, row) => (
              <g key={`in-${row}`}>
                <rect x={6} y={y - 20} width={66} height={40} rx={8} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
                <text x={39} y={y - 4} textAnchor="middle" fontSize={11} fill="#334155">입력 {row + 1}</text>
                <text x={39} y={y + 13} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">{row + 1}</text>
              </g>
            ))}
            <rect x={OUT_X} y={OUT_Y[0] - 28} width={126} height={56} rx={8} fill="#ffffff" stroke="#7c3aed" strokeWidth={1} />
            <text x={OUT_X + 63} y={OUT_Y[0] - 12} textAnchor="middle" fontSize={11} fill="#334155">첫 점수 · 1×ln2 + 2×0</text>
            <text x={OUT_X + 63} y={OUT_Y[0] + 12} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f172a">ln2</text>
            <rect x={OUT_X} y={OUT_Y[1] - 28} width={126} height={56} rx={8} fill="#ffffff" stroke="#7c3aed" strokeWidth={1} />
            <text x={OUT_X + 63} y={OUT_Y[1] - 12} textAnchor="middle" fontSize={11} fill="#334155">둘째 · {state.calc2}</text>
            <text x={OUT_X + 63} y={OUT_Y[1] + 12} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f172a">{state.score2}</text>
            {active === 3 ? (
              <g>
                <rect x={190} y={172} width={166} height={18} rx={4} fill="#fee2e2" stroke="#dc2626" strokeWidth={1} />
                <text x={273} y={185} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">오차 1.098612 → 약 1.097279</text>
              </g>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
