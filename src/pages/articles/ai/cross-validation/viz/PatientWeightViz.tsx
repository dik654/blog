import SceneShell from "./CvSceneShell";

/**
 * 본문 대응: #small-case, #inside-evaluation — 환자 A·B·C·D의 기록 2·2·3·1개(가정).
 * A·B로 학습, C·D로 평가. 손실 C=[0,0,0], D=[1].
 * 기록마다 같은 무게: 각 1/4 → C 몫 3/4, D 몫 1/4 → 0.25.
 * 사람마다 같은 무게: C의 기록 각 1/6, D 1/2 → 0.50.
 */
type Patient = { name: string; records: number; train: boolean; loss: number };

const PATIENTS: readonly Patient[] = [
  { name: "A", records: 2, train: true, loss: 0 },
  { name: "B", records: 2, train: true, loss: 0 },
  { name: "C", records: 3, train: false, loss: 0 },
  { name: "D", records: 1, train: false, loss: 1 },
];

const CELL = 30;
const IN_GAP = 4;
const GROUP_GAP = 18;
const LEFT = 25;
const CELL_Y = 54;
const CELL_H = 26;
const BAR_X = LEFT;
const BAR_W = 310;
const BAR_Y = 130;
const BAR_H = 24;

const groupWidth = (records: number) => records * CELL + (records - 1) * IN_GAP;
const GROUP_X = PATIENTS.map((_, index) =>
  PATIENTS.slice(0, index).reduce<number>((x, patient) => x + groupWidth(patient.records) + GROUP_GAP, LEFT),
);

const SCENES = [
  { label: "사람 단위로 나눕니다", summary: "학습 A·B 4개 / 평가 C·D 4개", note: "칸 하나가 기록 하나입니다. A·B의 기록 4개로만 학습하므로 C·D의 기록은 어느 것도 예측기가 배우지 않았습니다." },
  { label: "손실을 매깁니다", summary: "손실 [0, 0, 0, 1]", note: "틀리면 1, 맞으면 0입니다. C의 세 기록은 모두 맞고 D의 한 기록은 틀렸습니다. 같은 예측 결과를 두 가지 무게로 평균냅니다." },
  { label: "기록마다 같은 무게", summary: "1 × 1/4 = 0.25", note: "평가 기록 4개가 각각 1/4을 받습니다. 기록이 셋인 C가 전체의 3/4을 차지하므로, 손실 1을 낸 D의 몫은 1/4뿐입니다." },
  { label: "사람마다 같은 무게", summary: "(0 + 1) / 2 = 0.50", note: "C와 D가 1/2씩 받습니다. C의 1/2은 세 기록에 1/6씩 나뉘고 D의 한 기록이 1/2을 받습니다. 그래서 같은 예측에서 평균이 0.50이 됩니다." },
];

const WEIGHTS: readonly (readonly [string, string])[] = [
  ["", ""],
  ["", ""],
  ["1/4", "1/4"],
  ["1/6", "1/2"],
];

const SHARE_D = [0, 0, 1 / 4, 1 / 2];

export default function PatientWeightViz() {
  return (
    <SceneShell
      eyebrow="평균의 단위"
      title="같은 손실 [0,0,0,1]이 0.25도 되고 0.50도 됩니다"
      description="환자 A·B·C·D의 기록 2·2·3·1개로 만든 계산용 사례입니다(가정). 아래 막대는 평가에서 각 사람이 차지하는 무게입니다."
      ariaLabel="환자별로 나눈 학습·평가 기록과 기록 평균 0.25, 사람 평균 0.50 비교"
      scenes={SCENES}
      render={(active) => {
        const showLoss = active >= 1;
        const [cWeight, dWeight] = WEIGHTS[active];
        const shareD = SHARE_D[active];
        const showBar = active >= 2;
        const cW = BAR_W * (1 - shareD);
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GROUP_X[0]} y={18} fontSize={11} fontWeight={700} fill="#64748b">학습</text>
            <line x1={GROUP_X[0]} x2={GROUP_X[1] + groupWidth(2)} y1={24} y2={24} stroke="#94a3b8" strokeWidth={1} />
            <text x={GROUP_X[2]} y={18} fontSize={11} fontWeight={700} fill="#2563eb">평가 (처음 보는 사람)</text>
            <line x1={GROUP_X[2]} x2={GROUP_X[3] + groupWidth(1)} y1={24} y2={24} stroke="#2563eb" strokeWidth={1} />
            {PATIENTS.map((patient, p) => (
              <g key={patient.name}>
                <text x={GROUP_X[p] + groupWidth(patient.records) / 2} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">
                  {patient.name}
                </text>
                {Array.from({ length: patient.records }, (_, r) => {
                  const x = GROUP_X[p] + r * (CELL + IN_GAP);
                  const failed = !patient.train && showLoss && patient.loss === 1;
                  const weight = patient.name === "C" ? cWeight : patient.name === "D" ? dWeight : "";
                  return (
                    <g key={r}>
                      <rect
                        x={x}
                        y={CELL_Y}
                        width={CELL}
                        height={CELL_H}
                        rx={3}
                        fill={patient.train ? "#94a3b8" : failed ? "#dc2626" : "#ffffff"}
                        fillOpacity={patient.train ? 0.35 : failed ? 0.85 : 0}
                        stroke={patient.train ? "#94a3b8" : "#2563eb"}
                        strokeWidth={1}
                      />
                      {!patient.train && showLoss && (
                        <text x={x + CELL / 2} y={CELL_Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={failed ? "#ffffff" : "#2563eb"}>
                          {patient.loss}
                        </text>
                      )}
                      {weight && (
                        <text x={x + CELL / 2} y={CELL_Y + CELL_H + 16} textAnchor="middle" fontSize={10} fill="#475569">
                          {weight}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
            {showBar && (
              <g>
                <text x={BAR_X} y={BAR_Y - 8} fontSize={10} fill="#64748b">평가 무게 전체 = 1</text>
                <rect x={BAR_X} y={BAR_Y} width={cW} height={BAR_H} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                <rect x={BAR_X + cW} y={BAR_Y} width={BAR_W - cW} height={BAR_H} fill="#dc2626" fillOpacity={0.85} stroke="#dc2626" strokeWidth={1} />
                <text x={BAR_X + cW / 2} y={BAR_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                  C 몫 {active === 2 ? "3/4" : "1/2"} · 손실 0
                </text>
                <text x={BAR_X + cW + (BAR_W - cW) / 2} y={BAR_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                  D {active === 2 ? "1/4" : "1/2"}
                </text>
                <text x={BAR_X + BAR_W} y={BAR_Y + BAR_H + 18} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">
                  평균 손실 = D 몫 × 1 = {active === 2 ? "0.25" : "0.50"}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
