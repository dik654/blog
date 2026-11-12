import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: #soft-target — Hinton et al.(2015) 실험 수치.
 * MNIST test error: 작은 net 146, 큰 net 67, soft target student 74 → 좁힌 몫 (146−74)/(146−67)=72/79≈91%(계산).
 * 음성 frame accuracy: baseline 58.9, ensemble 61.1, student 60.8 → 1.9/2.2≈86%(계산). WER 10.9 → 10.7, student 10.7 → 100%(계산).
 */
type Mark = { label: string; value: number; color: string };
type Scene = {
  label: string;
  summary: string;
  note: string;
  unit: string;
  worse: number;
  better: number;
  marks: readonly Mark[];
  share: string | null;
};

const SCENES: readonly Scene[] = [
  {
    label: "MNIST · test error 개수",
    summary: "146 → 67 / 74",
    unit: "개",
    worse: 146,
    better: 67,
    marks: [
      { label: "작은 net", value: 146, color: "#64748b" },
      { label: "Student", value: 74, color: "#2563eb" },
      { label: "큰 net", value: 67, color: "#16a34a" },
    ],
    share: null,
    note: "정규화 없는 작은 net은 146개, dropout을 쓴 큰 net은 67개를 틀렸습니다. 같은 작은 net에 T=20 soft target을 맞추게 해 학습한 student는 74개입니다. 오른쪽으로 갈수록 오류가 적습니다.",
  },
  {
    label: "MNIST · 좁힌 몫",
    summary: "72 / 79 ≈ 91% (계산)",
    unit: "개",
    worse: 146,
    better: 67,
    marks: [
      { label: "작은 net", value: 146, color: "#64748b" },
      { label: "Student", value: 74, color: "#2563eb" },
      { label: "큰 net", value: 67, color: "#16a34a" },
    ],
    share: "146 − 67 = 79개 차이 중 146 − 74 = 72개를 줄였습니다.",
    note: "두 net의 차이 79개를 하나의 띠로 두면 student는 그중 72개를 줄였습니다. 논문 수치로 계산한 비율이며, 큰 net과의 남은 차이는 7개입니다.",
  },
  {
    label: "음성 · frame accuracy",
    summary: "2.2%p 중 1.9%p ≈ 86% (계산)",
    unit: "%",
    worse: 58.9,
    better: 61.1,
    marks: [
      { label: "Baseline", value: 58.9, color: "#64748b" },
      { label: "Student", value: 60.8, color: "#2563eb" },
      { label: "Ensemble 10개", value: 61.1, color: "#16a34a" },
    ],
    share: "61.1 − 58.9 = 2.2%p 중 60.8 − 58.9 = 1.9%p를 가져왔습니다.",
    note: "Model 10개 ensemble이 만든 개선 2.2%p 가운데 단일 student가 1.9%p를 가져왔습니다. 본문이 말한 ‘80% 이상’이 이 비율입니다.",
  },
  {
    label: "음성 · WER",
    summary: "0.2%p 중 0.2%p (계산)",
    unit: "%",
    worse: 10.9,
    better: 10.7,
    marks: [
      { label: "Baseline", value: 10.9, color: "#64748b" },
      { label: "Student = Ensemble", value: 10.7, color: "#2563eb" },
    ],
    share: "10.9 − 10.7 = 0.2%p를 student도 똑같이 줄였습니다.",
    note: "단어 오류율(WER)은 낮을수록 좋습니다. Ensemble과 student가 모두 10.7%여서 이 지표에서는 개선분 전체를 가져왔습니다. 차이 자체가 0.2%p로 작다는 점도 함께 봅니다.",
  },
];

const W = 360;
const H = 128;
const X0 = 30;
const X1 = 330;
const AXIS_Y = 70;

export default function GapRecoveryViz() {
  return (
    <KdSceneShell
      eyebrow="개선분 회수"
      title="Student가 큰 model과의 차이를 얼마나 따라갔는지 띠 위에서 셉니다"
      description="왼쪽 끝은 teacher 없이 학습한 작은 model, 오른쪽 끝은 비교 대상인 큰 net 또는 ensemble입니다. 각 장면의 띠는 그 두 값 사이만 펼친 것이라 장면마다 축척이 다릅니다. 수치는 Hinton et al.(2015)의 실험입니다."
      ariaLabel="MNIST와 음성 인식 실험에서 student가 teacher와의 차이를 좁힌 비율"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const x = (value: number) => X0 + ((value - scene.worse) / (scene.better - scene.worse)) * (X1 - X0);
        const student = scene.marks.find((mark) => mark.label.startsWith("Student"));
        const studentX = student ? x(student.value) : X0;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={X0} y={AXIS_Y - 9} width={X1 - X0} height={18} rx={3} fill="#e2e8f0" opacity={0.6} />
              {scene.share !== null && <rect x={X0} y={AXIS_Y - 9} width={studentX - X0} height={18} rx={3} fill="#2563eb" opacity={0.35} />}
              {scene.marks.map((mark, index) => {
                const mx = x(mark.value);
                const above = index % 2 === 0;
                const anchor = mx < X0 + 40 ? "start" : mx > X1 - 40 ? "end" : "middle";
                return (
                  <g key={mark.label}>
                    <line x1={mx} x2={mx} y1={AXIS_Y - 14} y2={AXIS_Y + 14} stroke={mark.color} strokeWidth={1.25} />
                    <text x={mx} y={above ? AXIS_Y - 36 : AXIS_Y + 32} textAnchor={anchor} fontSize={13} fontWeight={700} fill={mark.color}>
                      {mark.label}
                    </text>
                    <text x={mx} y={above ? AXIS_Y - 20 : AXIS_Y + 48} textAnchor={anchor} fontSize={13} fill="#64748b">
                      {mark.value}
                      {scene.unit}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 min-h-[2.5rem] text-center text-xs leading-5 text-muted-foreground">
              {scene.share ?? "아직 비율은 세지 않습니다. 다음 장면에서 두 끝 사이의 차이를 하나의 띠로 둡니다."}
            </p>
          </div>
        );
      }}
    />
  );
}
