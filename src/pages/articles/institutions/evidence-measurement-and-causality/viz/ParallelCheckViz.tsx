import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 이전 여러 기간의 움직임은 평행 추세 가정을 검토하는 데 도움을 주지만 증명하지는 않는다.
 * 설치 전 10, 설치 후 A 8·B 9는 본문의 (가정) 값이다. 이전 기간 선의 값은 본문에 없어 모양만 그렸다.
 * A와 B는 둘 다 10에서 만나므로, 나란히 움직인 장면의 이전 구간은 같은 값을 겹쳐 두 색이 번갈아 보이게 그린다.
 */
const SCENES = [
  { label: "점선은 관찰이 아님", summary: "설치 뒤 A의 점선 = 가정", note: "장치를 단 A가 달지 않았을 경우는 볼 수 없습니다. 그래서 B만큼 내려간 점선을 가정으로 긋고, 추가감소 1을 얻습니다." },
  { label: "이전에 함께 움직였다면", summary: "점선을 긋는 근거가 됨", note: "설치 전 기간에 A와 B가 함께 움직였다면 점선을 긋는 일이 더 그럴듯해집니다. 둘 다 10에서 만나므로 이전 선을 겹쳐 두 색이 번갈아 보입니다. 측정 조건도 함께 봅니다." },
  { label: "이전에 달리 움직였다면", summary: "점선이 내려가면 간격은 1보다 작음", note: "A가 설치 전부터 더 빠르게 줄고 있었다면 장치 없이도 9 아래로 갔을 수 있고, 8과의 간격은 1보다 작습니다. 내린 정도는 모양입니다." },
  { label: "나란해도 남는 것", summary: "과거가 미래를 증명하지 않음", note: "과거가 비슷했다고 설치 뒤까지 같았으리라고 증명되지는 않습니다. 점선은 여전히 관찰이 아니라 가정입니다." },
] as const;

const W = 340;
const H = 232;
const XS = [58, 134, 210, 286];
const TOP = 12;
const BOTTOM = 34;
const y = (value: number) => TOP + ((13.4 - value) / (13.4 - 7.6)) * (H - TOP - BOTTOM);

const A_COLOR = "#2563eb";
const B_COLOR = "#64748b";
const GAP = "#d97706";

const PAST_B = [12, 11.2, 10] as const;

const polyline = (values: readonly number[], start = 0) =>
  values.map((value, index) => `${XS[index + start]},${y(value)}`).join(" ");

export default function ParallelCheckViz() {
  return (
    <SceneShell
      eyebrow="평행 추세 검토"
      title="설치 전 기간은 점선을 얼마나 믿을지 판단하는 재료입니다"
      description="세로는 가구당 하루 평균 사용량(kWh)입니다. 10·9·8은 본문의 (가정) 값이고 이전 기간의 선은 값 없이 모양만 그렸습니다."
      ariaLabel="설치 전 기간의 움직임에 따라 설치 후 점선을 얼마나 믿을지 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const past = active === 0 ? null : active === 2 ? [13, 11.5, 10] : PAST_B;
        const counterfactual = active === 2 ? 8.45 : 9;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[8, 9, 10].map((value) => (
              <g key={value}>
                <line x1={34} x2={W - 6} y1={y(value)} y2={y(value)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
                <text x={28} y={y(value) + 5} textAnchor="end" fontSize={15} fill="#64748b">{value}</text>
              </g>
            ))}
            {["이전", "이전", "설치 전", "설치 후"].map((label, index) => (
              <text key={index} x={XS[index]} y={H - 10} textAnchor="middle" fontSize={15} fill="#64748b">{label}</text>
            ))}
            <line x1={XS[2]} x2={XS[2]} y1={TOP} y2={H - BOTTOM} stroke="#94a3b8" strokeWidth={0.5} />

            {past && (
              <g>
                <polyline points={polyline(PAST_B)} fill="none" stroke={B_COLOR} strokeWidth={1.25} />
                <polyline points={polyline(past)} fill="none" stroke={A_COLOR} strokeWidth={1.25} strokeDasharray={active === 2 ? undefined : "10 10"} />
                <text x={XS[0] + 4} y={y(past[0]) - 8} fontSize={15} fontWeight={700} fill={A_COLOR}>A</text>
                <text x={XS[0] - 4} y={y(PAST_B[0]) + 18} textAnchor="end" fontSize={15} fontWeight={700} fill={B_COLOR}>B</text>
              </g>
            )}
            <line x1={XS[2]} x2={XS[3]} y1={y(10)} y2={y(9)} stroke={B_COLOR} strokeWidth={1.25} opacity={active === 2 ? 1 : 0.35} />
            <line x1={XS[2]} x2={XS[3]} y1={y(10)} y2={y(8)} stroke={A_COLOR} strokeWidth={1.25} />
            <line x1={XS[2]} x2={XS[3]} y1={y(10)} y2={y(counterfactual)} stroke={GAP} strokeWidth={1.25} strokeDasharray="6 4" />
            <circle cx={XS[2]} cy={y(10)} r={3} fill="#64748b" />
            <circle cx={XS[3]} cy={y(8)} r={3} fill={A_COLOR} />
            <circle cx={XS[3]} cy={y(9)} r={3} fill={B_COLOR} />
            <circle cx={XS[3]} cy={y(counterfactual)} r={3.5} fill="#ffffff" stroke={GAP} strokeWidth={1.25} />
            <text x={XS[3] + 8} y={y(8) + 5} fontSize={15} fontWeight={700} fill={A_COLOR}>A 8</text>
            {active !== 2 && <text x={XS[3] + 8} y={y(9) + 5} fontSize={15} fontWeight={700} fill={B_COLOR}>B 9</text>}
            {active === 2 && <text x={XS[3] + 8} y={y(9) - 3} fontSize={15} fontWeight={700} fill={B_COLOR}>B 9</text>}
            <text x={XS[3] - 4} y={y(10) - 8} textAnchor="middle" fontSize={15} fontWeight={700} fill={GAP}>점선 = 가정</text>
          </svg>
        );
      }}
    />
  );
}
