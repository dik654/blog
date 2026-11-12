import GroupSceneShell from "./GroupSceneShell";

/**
 * 본문 대응: #boundary — A와 C는 다른 환자지만 같은 병원일 수 있다.
 * 환자 분할 {A,B}|{C,D}: 환자 교집합 ∅, 병원 교집합에는 A·C의 병원이 들어감.
 * 병원을 바깥 경계로 두면 A·C를 같은 쪽에 둔다. B·D의 병원은 글에 없으므로 마지막 장면은 가정.
 */
type Patient = { id: string; hospital: string };

const SPLITS: readonly { train: readonly Patient[]; valid: readonly Patient[] }[] = [
  {
    train: [{ id: "A", hospital: "" }, { id: "B", hospital: "" }],
    valid: [{ id: "C", hospital: "" }, { id: "D", hospital: "" }],
  },
  {
    train: [{ id: "A", hospital: "병원 1" }, { id: "B", hospital: "?" }],
    valid: [{ id: "C", hospital: "병원 1" }, { id: "D", hospital: "?" }],
  },
  {
    train: [{ id: "A", hospital: "병원 1" }, { id: "C", hospital: "병원 1" }],
    valid: [{ id: "B", hospital: "다른 병원" }, { id: "D", hospital: "다른 병원" }],
  },
];

const SCENES = [
  {
    label: "환자 경계만 보면 통과",
    summary: "환자 {A,B} ∩ {C,D} = ∅",
    note: "7절의 분할입니다. 환자 식별자로 보면 학습과 평가에 겹치는 사람이 없습니다.",
  },
  {
    label: "병원 경계로 올라가면",
    summary: "병원 교집합 ⊇ {병원 1}",
    note: "A와 C가 다른 환자여도 같은 병원의 측정 습관을 공유할 수 있습니다. 그 병원을 병원 1이라 부르면 병원 1은 학습과 평가 양쪽에 나타납니다. B·D의 병원은 글에서 정하지 않았으므로 ?로 두었습니다.",
  },
  {
    label: "병원을 바깥 경계로 격리",
    summary: "환자 ∅ · 병원 ∅",
    note: "새 병원 배포가 목표라면 병원 1의 환자 A·C를 한쪽에 함께 둡니다. 여기서는 B·D가 병원 1이 아닌 다른 병원이라고 가정했습니다(가정). 그러면 환자와 병원 두 경계에서 모두 교집합이 비고, 시간 방향이 필요하면 이 분리 위에 함께 적용합니다.",
  },
] as const;

const BOX_W = 166;
const BOXES = [
  { key: "train", name: "학습", x: 10 },
  { key: "valid", name: "평가", x: 184 },
] as const;

function hospitalLabel(patients: readonly Patient[]): string {
  const names = Array.from(new Set(patients.map((patient) => patient.hospital)));
  return names[0] === "" ? "병원 정보 안 봄" : `병원 {${names.join(", ")}}`;
}

export default function HospitalBoundaryViz() {
  return (
    <GroupSceneShell
      eyebrow="더 큰 공유 원인"
      title="환자는 겹치지 않아도 병원이 겹칠 수 있습니다"
      description="원 하나가 환자 한 명(그 환자의 기록 전체)이고, 원 아래 글자는 그 환자가 온 병원입니다. 병원 배치는 10절을 설명하기 위한 가정입니다."
      ariaLabel="환자 단위 분할에서 병원이 학습과 평가에 겹치는 경우와 병원 단위로 다시 나눈 경우"
      scenes={SCENES}
      render={(active) => {
        const split = SPLITS[active];
        return (
          <svg viewBox="0 0 360 176" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {BOXES.map((box) => {
              const patients = box.key === "train" ? split.train : split.valid;
              const other = box.key === "train" ? split.valid : split.train;
              return (
                <g key={box.key}>
                  <rect x={box.x} y={8} width={BOX_W} height={120} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  <text x={box.x + 10} y={26} fontSize={11} fontWeight={700} fill="#64748b">
                    {box.name}
                  </text>
                  {patients.map((patient, index) => {
                    const cx = box.x + 48 + index * 70;
                    const shared = patient.hospital === "병원 1" && other.some((item) => item.hospital === "병원 1");
                    return (
                      <g key={patient.id}>
                        <circle cx={cx} cy={64} r={20} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} />
                        <text x={cx} y={69} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">
                          {patient.id}
                        </text>
                        {patient.hospital !== "" && (
                          <g>
                            <rect
                              x={cx - 30}
                              y={92}
                              width={60}
                              height={22}
                              rx={5}
                              fill="none"
                              stroke={shared ? "#dc2626" : "#94a3b8"}
                              strokeWidth={shared ? 1.25 : 1}
                              strokeDasharray={patient.hospital === "?" ? "3 2" : undefined}
                            />
                            <text x={cx} y={107} textAnchor="middle" fontSize={11} fontWeight={shared ? 700 : 400} fill={shared ? "#dc2626" : "#64748b"}>
                              {patient.hospital}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  <text x={box.x + BOX_W / 2} y={150} textAnchor="middle" fontSize={12} fill="#64748b">
                    환자 {"{"}
                    {patients.map((patient) => patient.id).join(", ")}
                    {"}"}
                  </text>
                  <text x={box.x + BOX_W / 2} y={168} textAnchor="middle" fontSize={12} fill="#64748b">
                    {hospitalLabel(patients)}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
