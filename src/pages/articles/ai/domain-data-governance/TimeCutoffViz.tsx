import SceneShell from "./SceneShell";

/**
 * 본문 대응: #group-time-split 둘째 문단 — group 격리만으로는 미래 예측에 충분하지 않다.
 * time-safe = 1[max t_train < min t_test]. 환자 A·B·C의 visit은 train, D는 test.
 * 가로 위치는 visit의 순서만 나타내며 날짜 간격이 아니다(가정).
 * 장면 1: D의 visit이 train 사이에 섞인 배치(가정) → max t_train(12번째) > min t_test(3번째) → 0.
 * 장면 2: D의 visit이 모두 train 뒤인 배치(가정) → max t_train(9번째) < min t_test(10번째) → 1.
 * 장면 3: diagnosis 뒤에 기록된 treatment·discharge 결과가 training feature로 들어오면 시간 누수.
 */
const PATIENTS = ["A", "B", "C", "D"] as const;
type Patient = (typeof PATIENTS)[number];

/** 각 배치에서 순서 1..12 자리에 놓인 환자. */
const MIXED: readonly Patient[] = ["A", "B", "D", "C", "A", "D", "B", "C", "A", "D", "B", "C"];
const AFTER: readonly Patient[] = ["A", "B", "C", "A", "B", "C", "A", "B", "C", "D", "D", "D"];

const lastTrain = (order: readonly Patient[]) =>
  order.reduce<number>((acc, patient, index) => (patient !== "D" ? index : acc), -1);
const firstTest = (order: readonly Patient[]) => order.indexOf("D");

const SCENES = [
  {
    label: "환자만 나눈 배치 (가정)",
    summary: `max t_train ${lastTrain(MIXED) + 1}번째 > min t_test ${firstTest(MIXED) + 1}번째 → 0`,
    note: "A·B·C를 train, D를 test로 나눠 group-safe는 1입니다. 그런데 D의 첫 visit이 train의 마지막 visit보다 앞서면 training이 test보다 미래의 기록을 씁니다. time-safe는 0입니다.",
  },
  {
    label: "test가 시간상 뒤인 배치 (가정)",
    summary: `max t_train ${lastTrain(AFTER) + 1}번째 < min t_test ${firstTest(AFTER) + 1}번째 → 1`,
    note: "Training에서 쓴 가장 늦은 event가 test의 가장 이른 event보다 앞서면 time-safe가 1입니다. 이 시간 조건은 미래 holdout이 실제 배포 질문과 맞을 때만 요구합니다.",
  },
  {
    label: "한 row 안의 미래 정보",
    summary: "group-safe 1이어도 시간 누수",
    note: "Diagnosis 뒤에 기록된 treatment나 discharge 결과는 미래 정보입니다. 이 값이 training feature로 들어오면 환자가 분리돼도 시간 누수가 남습니다.",
  },
] as const;

const W = 360;
const H = 196;
const LEFT = 30;
const RIGHT = 14;
const TOP = 34;
const ROW = 30;
const STEP = (W - LEFT - RIGHT) / 12;
const cx = (index: number) => LEFT + STEP * index + STEP / 2;
const cy = (patient: Patient) => TOP + PATIENTS.indexOf(patient) * ROW;
const TRAIN = "#2563eb";
const TEST = "#dc2626";

function OrderPanel({ order }: { order: readonly Patient[] }) {
  const maxTrain = lastTrain(order);
  const minTest = firstTest(order);
  const ok = maxTrain < minTest;
  const bottom = cy("D") + 16;
  return (
    <g>
      {PATIENTS.map((patient) => (
        <g key={patient}>
          <text x={4} y={cy(patient) + 4} fontSize={11} fontWeight={700} fill={patient === "D" ? TEST : TRAIN}>{patient}</text>
          <line x1={LEFT} x2={W - RIGHT} y1={cy(patient)} y2={cy(patient)} stroke="#e2e8f0" strokeWidth={1} />
        </g>
      ))}
      {!ok && (
        <rect x={cx(minTest)} y={TOP - 14} width={cx(maxTrain) - cx(minTest)} height={bottom - TOP + 14} fill="#dc2626" opacity={0.08} />
      )}
      {order.map((patient, index) => (
        <circle key={index} cx={cx(index)} cy={cy(patient)} r={6} fill={patient === "D" ? TEST : TRAIN} />
      ))}
      <line x1={cx(maxTrain)} x2={cx(maxTrain)} y1={TOP - 14} y2={bottom} stroke={TRAIN} strokeWidth={1.25} strokeDasharray="3 3" />
      <line x1={cx(minTest)} x2={cx(minTest)} y1={TOP - 14} y2={bottom} stroke={TEST} strokeWidth={1.25} strokeDasharray="3 3" />
      <text x={cx(maxTrain)} y={TOP - 18} fontSize={10} fontWeight={700} textAnchor={maxTrain > 6 ? "end" : "start"} fill={TRAIN}>max t_train</text>
      <text x={cx(minTest)} y={bottom + 12} fontSize={10} fontWeight={700} textAnchor={minTest > 6 ? "end" : "start"} fill={TEST}>min t_test</text>
      <text x={W - RIGHT} y={H - 6} fontSize={10} textAnchor="end" fill="#64748b">→ 시간 순서 (간격 무시, 가정)</text>
      <text x={LEFT} y={H - 6} fontSize={10} fontWeight={700} fill={ok ? "#15803d" : TEST}>{ok ? "time-safe = 1" : "time-safe = 0"}</text>
    </g>
  );
}

function FeaturePanel() {
  const y = 96;
  const tPred = 120;
  const events = [
    { x: tPred, label: "diagnosis", future: false },
    { x: 220, label: "treatment", future: true },
    { x: 300, label: "discharge 결과", future: true },
  ] as const;
  return (
    <g>
      <text x={4} y={24} fontSize={10} fontWeight={700} fill="#334155">training row 하나 (환자 A의 visit, 가정)</text>
      <rect x={20} y={y - 34} width={tPred - 20} height={52} fill="#2563eb" opacity={0.08} />
      <rect x={tPred} y={y - 34} width={W - RIGHT - tPred} height={52} fill="#dc2626" opacity={0.08} />
      <text x={24} y={y + 30} fontSize={10} fontWeight={700} fill={TRAIN}>feature로 쓸 수 있음</text>
      <text x={W - RIGHT - 4} y={y - 22} fontSize={10} fontWeight={700} textAnchor="end" fill={TEST}>미래 정보</text>
      <line x1={20} x2={W - RIGHT} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      <line x1={tPred} x2={tPred} y1={y - 34} y2={y + 34} stroke="#334155" strokeWidth={1.25} strokeDasharray="3 3" />
      <text x={tPred} y={y + 46} fontSize={10} fontWeight={700} textAnchor="middle" fill="#334155">예측 시점 (가정)</text>
      {events.map((event) => (
        <g key={event.label}>
          <circle cx={event.x} cy={y} r={5} fill={event.future ? TEST : TRAIN} />
          <text x={event.x} y={y + 18} fontSize={10} textAnchor="middle" fill="#475569">{event.label}</text>
        </g>
      ))}
      <path d={`M 300 ${y - 8} C 280 ${y - 60}, 120 ${y - 60}, 96 ${y - 10}`} fill="none" stroke={TEST} strokeWidth={1.25} />
      <path d={`M 96 ${y - 10} l -1 -8 M 96 ${y - 10} l 7 -4`} fill="none" stroke={TEST} strokeWidth={1.25} />
      <text x={W / 2 + 20} y={y - 52} fontSize={10} fontWeight={700} textAnchor="middle" fill={TEST}>feature로 역류 → 시간 누수</text>
      <text x={4} y={H - 6} fontSize={10} fill="#64748b">환자 분리(group-safe = 1)와 별개로 검사합니다</text>
    </g>
  );
}

export default function TimeCutoffViz() {
  return (
    <SceneShell
      eyebrow="Time split"
      title="환자를 나눠도 test보다 늦은 기록이 training에 있으면 미래가 새어 듭니다"
      description="점 하나가 visit 하나입니다. 파랑은 train(A·B·C), 빨강은 test(D)입니다. group-safe는 train과 test가 같은 환자를 공유하지 않으면 1, time-safe는 training의 가장 늦은 visit(max t_train)이 test의 가장 이른 visit(min t_test)보다 앞서면 1입니다. 글은 visit 날짜를 정하지 않았으므로 가로 위치는 순서만 보여 주는 가정 배치입니다."
      ariaLabel="환자를 분리한 뒤에도 시간 순서가 섞이면 time-safe가 0이 되고, diagnosis 뒤 기록이 feature로 들어오면 시간 누수가 남는 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <OrderPanel order={MIXED} />}
          {active === 1 && <OrderPanel order={AFTER} />}
          {active === 2 && <FeaturePanel />}
        </svg>
      )}
    />
  );
}
